import prisma from "@/lib/db";
import { generateText } from "ai";
import {
  CredentialProvider,
  ExecutionMemoryScope,
  ExecutionMemoryVisibility,
  ExecutionMemoryWriteMode,
  ExecutionStatus,
  ExecutionStepStatus,
  ExecutionTriggerType,
  NodeType,
  Prisma,
} from "@/lib/prisma/client";
import {
  type ExecutionTemplateContext,
  resolveTemplateString,
  resolveTemplateValue,
} from "./template";
import {
  buildExecutionMemoryTemplateSnapshot,
  createExecutionMemoryState,
  persistExecutionMemoryWrites,
  type RuntimeExecutionMemoryState,
  type RuntimeExecutionMemoryWrite,
} from "./memory";
import type { ExecutionMemoryWriteConfig } from "../memory/shared";
import { readCredentialSecret } from "@/features/credentials/server/payload";
import type {
  HttpRequestAuthType,
  HttpRequestCredentialConfig,
  HttpRequestNodeData,
} from "../http-request/shared";
import {
  type AITextNodeData,
  aiTextProviderSchema,
  getDefaultAITextModel,
} from "@/features/ai/text/shared";
import type { DiscordMessageNodeData } from "@/features/integrations/discord/shared";
import type { SlackMessageNodeData } from "@/features/integrations/slack/shared";
import {
  createAnthropicProvider,
  createDeepSeekProvider,
  createGoogleProvider,
  createMinimaxProvider,
  createOpenAIProvider,
} from "@/lib/ai/proxy";
import { loopNodeSchema } from "@/features/loops/shared";
import { toolNodeSchema } from "@/features/tools/node/shared";
import type { ToolProvider } from "@/features/tools/shared";
import {
  executeBrowserPageTool,
  parseBrowserPageArguments,
} from "@/features/tools/server/internal-browser";

type WorkflowForExecution = Prisma.WorkflowGetPayload<{
  include: {
    nodes: true;
    connections: true;
  };
}>;

type ExecutionWithWorkflow = Prisma.ExecutionGetPayload<{
  include: {
    memoryEntries: true;
    workflow: {
      include: {
        nodes: true;
        connections: true;
      };
    };
  };
}>;

type ExecutionPlan = {
  orderedNodes: WorkflowForExecution["nodes"];
};

type TriggerNodeType = "MANUAL_TRIGGER" | "WEBHOOK_TRIGGER";

type NodeExecutionResult = {
  status: ExecutionStepStatus;
  input?: Prisma.InputJsonValue;
  output?: Prisma.InputJsonValue;
  memoryWrites?: RuntimeExecutionMemoryWrite[];
};

type ResolvedHttpRequestInput = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body: Prisma.InputJsonValue | null;
  credential: HttpRequestCredentialConfig | null;
};

type ResolvedAITextInput = {
  provider: "GOOGLE" | "OPENAI" | "ANTHROPIC" | "DEEPSEEK" | "MINIMAX";
  model: string;
  prompt: string;
  system: string | null;
  credentialId: string;
  credentialField: string;
  toolContext: ResolvedToolInput | null;
};

type ResolvedDiscordMessageInput = {
  credentialId: string;
  credentialField: string;
  content: string;
};

type ResolvedSlackMessageInput = {
  credentialId: string;
  credentialField: string;
  content: string;
};

type ResolvedLoopInput = {
  value: Prisma.InputJsonValue | null;
  rawValue: Prisma.InputJsonValue | null;
  attempt: number;
  maxIterations: number;
  isFinalAttempt: boolean;
};

type ResolvedToolInput = {
  provider: ToolProvider;
  serverId: string | null;
  serverDisplayName: string | null;
  toolId: string;
  toolDisplayName: string | null;
  arguments: Prisma.InputJsonValue | null;
};

type CompletedStepResult = {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: string;
  input: Prisma.JsonValue | null;
  output: Prisma.JsonValue | null;
  error: Prisma.JsonValue | null;
};

type TemplateUpstreamEntry = ExecutionTemplateContext["upstream"][number];

export class WorkflowExecutionError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "MANUAL_TRIGGER_NOT_FOUND"
      | "WEBHOOK_TRIGGER_NOT_FOUND"
      | "WORKFLOW_HAS_CYCLE"
      | "INVALID_LOOP_CONFIG"
      | "INVALID_TOOL_CONFIG"
      | "UNSUPPORTED_NODE_TYPE"
      | "TOOL_EXECUTION_FAILED"
      | "TOOL_ADAPTER_NOT_READY"
      | "INVALID_HTTP_REQUEST_CONFIG"
      | "INVALID_AI_NODE_CONFIG"
      | "INVALID_DISCORD_CONFIG"
      | "INVALID_SLACK_CONFIG"
      | "CREDENTIAL_NOT_FOUND"
      | "INVALID_CREDENTIAL_CONFIG"
      | "HTTP_REQUEST_FAILED"
      | "DISCORD_REQUEST_FAILED"
      | "SLACK_REQUEST_FAILED",
  ) {
    super(message);
    this.name = "WorkflowExecutionError";
  }
}

function serializeError(error: unknown): Prisma.InputJsonValue {
  if (error instanceof WorkflowExecutionError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? null,
    };
  }

  return {
    message: "Unknown execution error",
    value: String(error),
  };
}

function createWorkflowSnapshot(
  workflow: WorkflowForExecution,
): Prisma.InputJsonValue {
  return {
    id: workflow.id,
    name: workflow.name,
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    connections: workflow.connections.map((connection) => ({
      id: connection.id,
      fromNodeId: connection.fromNodeId,
      toNodeId: connection.toNodeId,
      fromOutput: connection.fromOutput,
      toInput: connection.toInput,
      data: connection.data,
    })),
  };
}

function truncateText(value: string, maxLength = 10_000) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...<truncated>`;
}

function parseJsonOrReturnText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as Prisma.InputJsonValue;
  } catch {
    return truncateText(trimmed);
  }
}

function containsTemplateExpression(value?: string | null) {
  if (!value) {
    return false;
  }

  return /\{\{\s*[^}]+\s*\}\}/.test(value);
}

function stringifyTemplateText(value: unknown) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function isJsonRecord(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null,
): value is Record<string, Prisma.JsonValue | Prisma.InputJsonValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractNodeTransferValue(
  nodeType: string | undefined,
  output: Prisma.JsonValue | Prisma.InputJsonValue | null,
): Prisma.JsonValue | null {
  if (output == null) {
    return null;
  }

  if (!isJsonRecord(output)) {
    return output as Prisma.JsonValue;
  }

  if (
    (nodeType === NodeType.MANUAL_TRIGGER ||
      nodeType === NodeType.WEBHOOK_TRIGGER) &&
    output.body !== undefined
  ) {
    return output.body as Prisma.JsonValue;
  }

  if (nodeType === NodeType.AI_TEXT && typeof output.text === "string") {
    return output.text;
  }

  if (nodeType === NodeType.HTTP_REQUEST && output.body !== undefined) {
    return output.body as Prisma.JsonValue;
  }

  if (nodeType === NodeType.LOOP && output.value !== undefined) {
    return output.value as Prisma.JsonValue;
  }

  if (
    (nodeType === NodeType.DISCORD_MESSAGE ||
      nodeType === NodeType.SLACK_MESSAGE) &&
    typeof output.content === "string"
  ) {
    return output.content;
  }

  if (output.result !== undefined) {
    return output.result as Prisma.JsonValue;
  }

  if (typeof output.text === "string") {
    return output.text;
  }

  if (output.body !== undefined) {
    return output.body as Prisma.JsonValue;
  }

  if (typeof output.content === "string") {
    return output.content;
  }

  return output as Prisma.JsonValue;
}

function createExecutionTemplateContext(
  execution: ExecutionWithWorkflow,
  node: WorkflowForExecution["nodes"][number],
  completedSteps: Map<string, CompletedStepResult>,
  memoryState: RuntimeExecutionMemoryState,
  current?: {
    attempt?: number | null;
    status?: string | null;
    input?: Prisma.JsonValue | null;
    output?: Prisma.JsonValue | null;
    error?: Prisma.JsonValue | null;
  },
): ExecutionTemplateContext {
  const upstream = buildNodeUpstreamContext(execution, node, completedSteps);
  const memory = buildExecutionMemoryTemplateSnapshot(memoryState, node.id);

  return {
    execution: {
      id: execution.id,
      triggerType: execution.triggerType,
    },
    workflow: {
      id: execution.workflow.id,
      name: execution.workflow.name,
    },
    trigger: execution.triggerPayload as Prisma.JsonValue,
    input: upstream.input,
    inputRaw: upstream.inputRaw,
    inputs: upstream.inputs,
    inputsRaw: upstream.inputsRaw,
    current: {
      attempt: current?.attempt ?? null,
      status: current?.status ?? null,
      input: current?.input ?? null,
      output: current?.output ?? null,
      error: current?.error ?? null,
    },
    memory,
    upstream: upstream.upstream,
    steps: Object.fromEntries(completedSteps.entries()),
  };
}

function normalizeMemoryKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildNodeMemoryWrites(params: {
  execution: ExecutionWithWorkflow;
  node: WorkflowForExecution["nodes"][number];
  input: Prisma.InputJsonValue | null;
  status: ExecutionStepStatus;
  output?: Prisma.InputJsonValue;
  error?: Prisma.InputJsonValue;
}) {
  const nodeNameKey = normalizeMemoryKey(params.node.name) || params.node.id;
  const writes: RuntimeExecutionMemoryWrite[] = [];
  const resultValue = extractNodeTransferValue(
    params.node.type,
    (params.output ?? null) as Prisma.JsonValue | null,
  );

  if (params.input != null) {
    writes.push({
      scope: ExecutionMemoryScope.NODE,
      namespace: "run",
      key: "input",
      value: params.input,
      visibility: ExecutionMemoryVisibility.PRIVATE,
    });
  }

  if (params.output != null) {
    writes.push({
      scope: ExecutionMemoryScope.NODE,
      namespace: "run",
      key: "output",
      value: params.output,
      visibility: ExecutionMemoryVisibility.PRIVATE,
    });
  }

  if (params.error != null) {
    writes.push({
      scope: ExecutionMemoryScope.NODE,
      namespace: "run",
      key: "error",
      value: params.error,
      visibility: ExecutionMemoryVisibility.PRIVATE,
    });
  }

  if (resultValue != null) {
    writes.push({
      scope: ExecutionMemoryScope.NODE,
      namespace: "run",
      key: "result",
      value: resultValue as Prisma.InputJsonValue,
      visibility: ExecutionMemoryVisibility.PRIVATE,
    });
  }

  const sharedNodeValue: Prisma.InputJsonValue = {
    nodeId: params.node.id,
    nodeName: params.node.name,
    nodeType: params.node.type,
    status: params.status,
    input: params.input,
    output: params.output ?? null,
    result: resultValue,
    error: params.error ?? null,
  };

  writes.push(
    {
      scope: ExecutionMemoryScope.SHARED,
      namespace: "nodesById",
      key: params.node.id,
      value: sharedNodeValue,
      mode: ExecutionMemoryWriteMode.REPLACE,
    },
    {
      scope: ExecutionMemoryScope.SHARED,
      namespace: "nodesByName",
      key: nodeNameKey,
      value: sharedNodeValue,
      mode: ExecutionMemoryWriteMode.REPLACE,
    },
    {
      scope: ExecutionMemoryScope.SHARED,
      namespace: "run",
      key: "lastNode",
      value: sharedNodeValue,
      mode: ExecutionMemoryWriteMode.REPLACE,
    },
  );

  return writes;
}

function buildConfiguredMemoryWrites(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
) {
  const nodeData = (node.data ?? {}) as {
    memoryWrites?: ExecutionMemoryWriteConfig[];
  };
  const writes = nodeData.memoryWrites ?? [];

  return writes
    .filter((write) => write.key.trim() && write.value.trim())
    .map<RuntimeExecutionMemoryWrite>((write) => ({
      scope: write.scope,
      namespace: write.namespace.trim(),
      key: write.key.trim(),
      value: resolveTemplateValue(write.value, context),
      mode: write.mode,
      visibility: write.visibility,
    }));
}

function buildNodeUpstreamContext(
  execution: ExecutionWithWorkflow,
  node: WorkflowForExecution["nodes"][number],
  completedSteps: Map<string, CompletedStepResult>,
) {
  const nodeById = new Map(execution.workflow.nodes.map((item) => [item.id, item]));
  const incomingConnections = execution.workflow.connections.filter(
    (connection) => connection.toNodeId === node.id,
  );
  const upstream: TemplateUpstreamEntry[] = incomingConnections.map(
    (connection) => {
      const sourceNode = nodeById.get(connection.fromNodeId);
      const completedStep = completedSteps.get(connection.fromNodeId);
      const value = extractNodeTransferValue(
        sourceNode?.type,
        completedStep?.output ?? null,
      );

      return {
        connectionId: connection.id,
        fromNodeId: connection.fromNodeId,
        fromNodeName: sourceNode?.name ?? connection.fromNodeId,
        fromNodeType: sourceNode?.type ?? "UNKNOWN",
        fromOutput: connection.fromOutput,
        toInput: connection.toInput,
        data: (connection.data ?? null) as Prisma.JsonValue | null,
        status: completedStep?.status ?? null,
        input: completedStep?.input ?? null,
        output: completedStep?.output ?? null,
        value,
        error: completedStep?.error ?? null,
      };
    },
  );

  const groupedInputs = Array.from(
    new Set(incomingConnections.map((connection) => connection.toInput || "main")),
  );

  const inputs = Object.fromEntries(
    groupedInputs.map((inputKey) => {
      const values = upstream
        .filter((item) => item.toInput === inputKey && item.value !== null)
        .map((item) => item.value as Prisma.JsonValue);

      if (values.length === 0) {
        return [inputKey, null];
      }

      return [inputKey, values.length === 1 ? values[0] : values];
    }),
  ) as ExecutionTemplateContext["inputs"];

  const inputsRaw = Object.fromEntries(
    groupedInputs.map((inputKey) => {
      const values = upstream
        .filter((item) => item.toInput === inputKey && item.output !== null)
        .map((item) => item.output as Prisma.JsonValue);

      if (values.length === 0) {
        return [inputKey, null];
      }

      return [inputKey, values.length === 1 ? values[0] : values];
    }),
  ) as ExecutionTemplateContext["inputsRaw"];

  const primaryInput =
    upstream.find((item) => item.toInput === "main" && item.value !== null)
      ?.value ??
    upstream.find((item) => item.value !== null)?.value ??
    null;

  const primaryInputRaw =
    upstream.find((item) => item.toInput === "main" && item.output !== null)
      ?.output ??
    upstream.find((item) => item.output !== null)?.output ??
    null;

  return {
    input: primaryInput,
    inputRaw: primaryInputRaw,
    inputs,
    inputsRaw,
    upstream,
  };
}

function normalizeHttpRequestNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedHttpRequestInput {
  const data = (node.data ?? {}) as HttpRequestNodeData;
  const resolvedEndpoint = data.endpoint
    ? resolveTemplateString(data.endpoint, context)
    : undefined;
  const resolvedBody = data.body
    ? resolveTemplateString(data.body, context)
    : "";
  const endpoint =
    typeof resolvedEndpoint === "string" ? resolvedEndpoint.trim() : undefined;
  const method = data.method ?? "GET";
  const body = resolveTemplateValue(
    (typeof resolvedBody === "string"
      ? resolvedBody
      : JSON.stringify(resolvedBody ?? null)) as Prisma.JsonValue,
    context,
  );
  const credentialId = data.credentialId?.trim();
  const credentialField = data.credentialField?.trim();
  const authType = (data.authType ?? "NONE") as HttpRequestAuthType;
  const headerName = data.headerName?.trim();
  let credential: HttpRequestCredentialConfig | null = null;

  if (!endpoint) {
    throw new WorkflowExecutionError(
      `HTTP Request node "${node.name}" is missing an endpoint URL.`,
      "INVALID_HTTP_REQUEST_CONFIG",
    );
  }

  try {
    new URL(endpoint);
  } catch {
    throw new WorkflowExecutionError(
      `HTTP Request node "${node.name}" has an invalid endpoint URL.`,
      "INVALID_HTTP_REQUEST_CONFIG",
    );
  }

  if (credentialId) {
    if (!credentialField) {
      throw new WorkflowExecutionError(
        `HTTP Request node "${node.name}" is missing the credential field name.`,
        "INVALID_HTTP_REQUEST_CONFIG",
      );
    }

    if (authType === "NONE") {
      throw new WorkflowExecutionError(
        `HTTP Request node "${node.name}" must choose how to inject the credential.`,
        "INVALID_HTTP_REQUEST_CONFIG",
      );
    }

    if (authType === "HEADER" && !headerName) {
      throw new WorkflowExecutionError(
        `HTTP Request node "${node.name}" requires a header name for custom header auth.`,
        "INVALID_HTTP_REQUEST_CONFIG",
      );
    }

    credential = {
      credentialId,
      field: credentialField,
      authType,
      headerName: authType === "HEADER" ? headerName : undefined,
    };
  }

  return {
    url: endpoint,
    method,
    body,
    credential,
  };
}

function normalizeLoopNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedLoopInput {
  const parsed = loopNodeSchema.safeParse(node.data ?? {});

  if (!parsed.success) {
    throw new WorkflowExecutionError(
      `Loop node "${node.name}" has invalid configuration.`,
      "INVALID_LOOP_CONFIG",
    );
  }

  const attempt = context.current.attempt ?? 1;

  return {
    value: context.input as Prisma.InputJsonValue | null,
    rawValue: context.inputRaw as Prisma.InputJsonValue | null,
    attempt,
    maxIterations: parsed.data.maxIterations,
    isFinalAttempt: attempt >= parsed.data.maxIterations,
  };
}

function normalizeToolNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedToolInput {
  const parsed = toolNodeSchema.safeParse(node.data ?? {});

  if (!parsed.success) {
    throw new WorkflowExecutionError(
      `Tool node "${node.name}" has invalid configuration.`,
      "INVALID_TOOL_CONFIG",
    );
  }

  const toolId = parsed.data.toolId.trim();

  if (!toolId) {
    throw new WorkflowExecutionError(
      `Tool node "${node.name}" is missing a tool id.`,
      "INVALID_TOOL_CONFIG",
    );
  }

  const resolvedArguments = resolveTemplateString(
    parsed.data.argumentsJson,
    context,
  );
  const argumentsValue =
    typeof resolvedArguments === "string"
      ? (parseJsonOrReturnText(resolvedArguments) as Prisma.InputJsonValue)
      : ((resolvedArguments ?? null) as Prisma.InputJsonValue);

  return {
    provider: parsed.data.provider,
    serverId: parsed.data.serverId.trim() || null,
    serverDisplayName: parsed.data.serverDisplayName.trim() || null,
    toolId,
    toolDisplayName: parsed.data.toolDisplayName.trim() || null,
    arguments: argumentsValue,
  };
}

async function resolveHttpRequestCredentialHeader(
  execution: ExecutionWithWorkflow,
  credentialConfig: HttpRequestCredentialConfig,
) {
  if (!execution.triggeredByUserId) {
    throw new WorkflowExecutionError(
      "Workflow execution is missing the triggering user for credential resolution.",
      "CREDENTIAL_NOT_FOUND",
    );
  }

  const credential = await prisma.credential.findFirst({
    where: {
      id: credentialConfig.credentialId,
      userId: execution.triggeredByUserId,
    },
  });

  if (!credential) {
    throw new WorkflowExecutionError(
      `Credential "${credentialConfig.credentialId}" was not found for this workflow execution.`,
      "CREDENTIAL_NOT_FOUND",
    );
  }

  const secret = readCredentialSecret(credential.encryptedData);
  const secretValue = secret[credentialConfig.field];

  if (typeof secretValue !== "string" || !secretValue.trim()) {
    throw new WorkflowExecutionError(
      `Credential "${credential.name}" does not contain a usable "${credentialConfig.field}" string.`,
      "INVALID_CREDENTIAL_CONFIG",
    );
  }

  await prisma.credential.update({
    where: {
      id: credential.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  if (credentialConfig.authType === "BEARER") {
    return {
      name: "authorization",
      value: `Bearer ${secretValue.trim()}`,
    };
  }

  return {
    name: credentialConfig.headerName!,
    value: secretValue.trim(),
  };
}

async function resolveCredentialStringValue(params: {
  execution: ExecutionWithWorkflow;
  credentialId: string;
  field: string;
  provider?: CredentialProvider;
}) {
  if (!params.execution.triggeredByUserId) {
    throw new WorkflowExecutionError(
      "Workflow execution is missing the triggering user for credential resolution.",
      "CREDENTIAL_NOT_FOUND",
    );
  }

  const credential = await prisma.credential.findFirst({
    where: {
      id: params.credentialId,
      userId: params.execution.triggeredByUserId,
    },
  });

  if (!credential) {
    throw new WorkflowExecutionError(
      `Credential "${params.credentialId}" was not found for this workflow execution.`,
      "CREDENTIAL_NOT_FOUND",
    );
  }

  if (params.provider && credential.provider !== params.provider) {
    throw new WorkflowExecutionError(
      `Credential "${credential.name}" must be a ${params.provider} credential.`,
      "INVALID_CREDENTIAL_CONFIG",
    );
  }

  const secret = readCredentialSecret(credential.encryptedData);
  const secretValue = secret[params.field];

  if (typeof secretValue !== "string" || !secretValue.trim()) {
    throw new WorkflowExecutionError(
      `Credential "${credential.name}" does not contain a usable "${params.field}" string.`,
      "INVALID_CREDENTIAL_CONFIG",
    );
  }

  await prisma.credential.update({
    where: {
      id: credential.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return secretValue.trim();
}

async function executeHttpRequestNode(
  execution: ExecutionWithWorkflow,
  input: ResolvedHttpRequestInput,
): Promise<NodeExecutionResult> {
  const headers = new Headers();

  if (input.credential) {
    const credentialHeader = await resolveHttpRequestCredentialHeader(
      execution,
      input.credential,
    );
    headers.set(credentialHeader.name, credentialHeader.value);
  }

  const serializedBody =
    typeof input.body === "string" ? input.body : JSON.stringify(input.body);
  const hasBody = serializedBody.trim().length > 0;
  let requestBody: BodyInit | undefined;

  if (hasBody && input.method !== "GET" && input.method !== "DELETE") {
    const parsedBody = parseJsonOrReturnText(serializedBody);

    if (typeof parsedBody === "string") {
      requestBody = parsedBody;
      headers.set("content-type", "text/plain; charset=utf-8");
    } else {
      requestBody = JSON.stringify(parsedBody);
      headers.set("content-type", "application/json");
    }
  }

  const response = await fetch(input.url, {
    method: input.method,
    headers,
    body: requestBody,
    signal: AbortSignal.timeout(15_000),
  });

  const responseText = await response.text();
  const responseBody = parseJsonOrReturnText(responseText);
  const output: Prisma.InputJsonValue = {
    url: input.url,
    method: input.method,
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
    body: responseBody,
  };

  if (!response.ok) {
    throw new WorkflowExecutionError(
      `HTTP request failed with status ${response.status}.`,
      "HTTP_REQUEST_FAILED",
    );
  }

  return {
    status: ExecutionStepStatus.SUCCESS,
    output,
  };
}

async function executeToolNode(
  input: ResolvedToolInput,
): Promise<NodeExecutionResult> {
  if (input.provider !== "INTERNAL") {
    throw new WorkflowExecutionError(
      `Tool provider "${input.provider}" is configured, but its runtime adapter is not wired yet.`,
      "TOOL_ADAPTER_NOT_READY",
    );
  }

  if (input.toolId === "internal.browser_page") {
    const browserInput = parseBrowserPageArguments(input.arguments ?? {});
    const output = await executeBrowserPageTool(browserInput);

    if (!output.ok) {
      throw new WorkflowExecutionError(
        `Browser page tool failed with status ${output.status}.`,
        "TOOL_EXECUTION_FAILED",
      );
    }

    return {
      status: ExecutionStepStatus.SUCCESS,
      output: {
        provider: input.provider,
        toolId: input.toolId,
        toolDisplayName: input.toolDisplayName,
        serverId: input.serverId,
        serverDisplayName: input.serverDisplayName,
        ...output,
      },
    };
  }

  throw new WorkflowExecutionError(
    `Internal tool "${input.toolId}" is registered but not executable yet.`,
    "TOOL_ADAPTER_NOT_READY",
  );
}

function normalizeDiscordMessageNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedDiscordMessageInput {
  const data = (node.data ?? {}) as DiscordMessageNodeData;
  const resolvedContent = data.content
    ? resolveTemplateString(data.content, context)
    : "";
  const content =
    typeof resolvedContent === "string" ? resolvedContent.trim() : "";
  const credentialId = data.credentialId?.trim();
  const credentialField = data.credentialField?.trim() || "webhookUrl";

  if (!content) {
    throw new WorkflowExecutionError(
      `Discord Message node "${node.name}" is missing message content.`,
      "INVALID_DISCORD_CONFIG",
    );
  }

  if (!credentialId) {
    throw new WorkflowExecutionError(
      `Discord Message node "${node.name}" requires a Discord credential.`,
      "INVALID_DISCORD_CONFIG",
    );
  }

  return {
    credentialId,
    credentialField,
    content,
  };
}

function normalizeSlackMessageNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedSlackMessageInput {
  const data = (node.data ?? {}) as SlackMessageNodeData;
  const resolvedContent = data.content
    ? resolveTemplateString(data.content, context)
    : "";
  const content =
    typeof resolvedContent === "string" ? resolvedContent.trim() : "";
  const credentialId = data.credentialId?.trim();
  const credentialField = data.credentialField?.trim() || "webhookUrl";

  if (!content) {
    throw new WorkflowExecutionError(
      `Slack Message node "${node.name}" is missing message content.`,
      "INVALID_SLACK_CONFIG",
    );
  }

  if (!credentialId) {
    throw new WorkflowExecutionError(
      `Slack Message node "${node.name}" requires a Slack credential.`,
      "INVALID_SLACK_CONFIG",
    );
  }

  return {
    credentialId,
    credentialField,
    content,
  };
}

function normalizeAITextNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedAITextInput {
  const data = (node.data ?? {}) as AITextNodeData;
  const parsedProvider = aiTextProviderSchema.safeParse(data.provider ?? "GOOGLE");

  if (!parsedProvider.success) {
    throw new WorkflowExecutionError(
      `AI Text node "${node.name}" has an invalid provider configuration.`,
      "INVALID_AI_NODE_CONFIG",
    );
  }

  const provider = parsedProvider.data;
  const model = data.model?.trim() || getDefaultAITextModel(provider);
  const resolvedPrompt = data.prompt
    ? resolveTemplateString(data.prompt, context)
    : "";
  const resolvedSystem = data.system
    ? resolveTemplateString(data.system, context)
    : "";
  const prompt = stringifyTemplateText(resolvedPrompt);
  const system = stringifyTemplateText(resolvedSystem);
  const credentialId = data.credentialId?.trim();
  const credentialField = data.credentialField?.trim();
  let toolContext: ResolvedToolInput | null = null;
  const shouldAutoAttachUpstreamInput =
    !containsTemplateExpression(data.prompt) &&
    context.input != null &&
    context.upstream.some(
      (item) => item.fromNodeType === NodeType.AI_TEXT && item.value != null,
    );
  const finalPrompt = shouldAutoAttachUpstreamInput
    ? [prompt, stringifyTemplateText(context.input)]
        .filter(Boolean)
        .join("\n\nInput:\n")
    : prompt;

  if (!finalPrompt) {
    throw new WorkflowExecutionError(
      `AI Text node "${node.name}" is missing a prompt.`,
      "INVALID_AI_NODE_CONFIG",
    );
  }

  if (!credentialId || !credentialField) {
    throw new WorkflowExecutionError(
      `AI Text node "${node.name}" requires a bound credential and secret field.`,
      "INVALID_AI_NODE_CONFIG",
    );
  }

  if (data.toolEnabled) {
    if (!data.toolId?.trim()) {
      throw new WorkflowExecutionError(
        `AI Text node "${node.name}" has research context enabled but no browser tool selected.`,
        "INVALID_AI_NODE_CONFIG",
      );
    }

    toolContext = normalizeToolNodeData(
      {
        ...node,
        data: {
          provider: data.toolProvider ?? "INTERNAL",
          serverId: data.toolServerId ?? "",
          serverDisplayName: "",
          toolId: data.toolId ?? "",
          toolDisplayName: data.toolDisplayName ?? "",
          argumentsJson: data.toolArgumentsJson ?? "{}",
          memoryWrites: [],
        },
      },
      context,
    );
  }

  return {
    provider,
    model,
    prompt: finalPrompt,
    system: system || null,
    credentialId,
    credentialField,
    toolContext,
  };
}

function stringifyToolContext(toolOutput: Prisma.InputJsonValue | null) {
  if (!toolOutput || typeof toolOutput !== "object" || Array.isArray(toolOutput)) {
    return "";
  }

  const output = toolOutput as Record<string, Prisma.InputJsonValue>;
  const lines: string[] = [];

  if (typeof output.finalUrl === "string") {
    lines.push(`Source URL: ${output.finalUrl}`);
  }

  if (typeof output.title === "string" && output.title.trim()) {
    lines.push(`Title: ${output.title}`);
  }

  if (typeof output.description === "string" && output.description.trim()) {
    lines.push(`Description: ${output.description}`);
  }

  if (typeof output.excerpt === "string" && output.excerpt.trim()) {
    lines.push(`Excerpt: ${output.excerpt}`);
  }

  if (typeof output.text === "string" && output.text.trim()) {
    lines.push(`Page text:\n${output.text}`);
  }

  if (Array.isArray(output.links) && output.links.length > 0) {
    const topLinks = output.links
      .slice(0, 5)
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const href = "href" in item && typeof item.href === "string"
          ? item.href
          : null;
        const text =
          "text" in item && typeof item.text === "string"
            ? item.text.trim()
            : "";

        if (!href) {
          return null;
        }

        return text ? `- ${text}: ${href}` : `- ${href}`;
      })
      .filter(Boolean);

    if (topLinks.length > 0) {
      lines.push(`Top links:\n${topLinks.join("\n")}`);
    }
  }

  return lines.join("\n\n").trim();
}

async function executeDiscordMessageNode(
  execution: ExecutionWithWorkflow,
  input: ResolvedDiscordMessageInput,
): Promise<NodeExecutionResult> {
  const webhookUrl = await resolveCredentialStringValue({
    execution,
    credentialId: input.credentialId,
    field: input.credentialField,
    provider: CredentialProvider.DISCORD,
  });

  let requestUrl: URL;
  try {
    requestUrl = new URL(webhookUrl);
  } catch {
    throw new WorkflowExecutionError(
      `Discord credential field "${input.credentialField}" must contain a valid webhook URL.`,
      "INVALID_CREDENTIAL_CONFIG",
    );
  }

  requestUrl.searchParams.set("wait", "true");

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      content: input.content,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const responseText = await response.text();
  const responseBody = parseJsonOrReturnText(responseText);
  const output: Prisma.InputJsonValue = {
    ok: response.ok,
    status: response.status,
    body: responseBody,
    content: input.content,
  };

  if (!response.ok) {
    throw new WorkflowExecutionError(
      `Discord webhook request failed with status ${response.status}.`,
      "DISCORD_REQUEST_FAILED",
    );
  }

  return {
    status: ExecutionStepStatus.SUCCESS,
    output,
  };
}

async function executeSlackMessageNode(
  execution: ExecutionWithWorkflow,
  input: ResolvedSlackMessageInput,
): Promise<NodeExecutionResult> {
  const webhookUrl = await resolveCredentialStringValue({
    execution,
    credentialId: input.credentialId,
    field: input.credentialField,
    provider: CredentialProvider.SLACK,
  });

  let requestUrl: URL;
  try {
    requestUrl = new URL(webhookUrl);
  } catch {
    throw new WorkflowExecutionError(
      `Slack credential field "${input.credentialField}" must contain a valid webhook URL.`,
      "INVALID_CREDENTIAL_CONFIG",
    );
  }

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: input.content,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const responseText = await response.text();
  const responseBody = parseJsonOrReturnText(responseText);
  const output: Prisma.InputJsonValue = {
    ok: response.ok,
    status: response.status,
    body: responseBody,
    content: input.content,
  };

  if (!response.ok) {
    throw new WorkflowExecutionError(
      `Slack webhook request failed with status ${response.status}.`,
      "SLACK_REQUEST_FAILED",
    );
  }

  return {
    status: ExecutionStepStatus.SUCCESS,
    output,
  };
}

async function executeAITextNode(
  execution: ExecutionWithWorkflow,
  input: ResolvedAITextInput,
): Promise<NodeExecutionResult> {
  let toolOutput: Prisma.InputJsonValue | null = null;
  let prompt = input.prompt;

  if (input.toolContext) {
    const toolResult = await executeToolNode(input.toolContext);
    toolOutput = toolResult.output ?? null;
    const toolContextText = stringifyToolContext(toolOutput);

    if (toolContextText) {
      prompt = `${input.prompt}\n\nResearch context:\n${toolContextText}`;
    }
  }

  let model: Parameters<typeof generateText>[0]["model"];

  switch (input.provider) {
    case "GOOGLE": {
      const apiKey = await resolveCredentialStringValue({
        execution,
        credentialId: input.credentialId,
        field: input.credentialField,
        provider: CredentialProvider.GOOGLE,
      });

      const googleProvider = createGoogleProvider({ apiKey });
      model = googleProvider(input.model);
      break;
    }
    case "OPENAI": {
      const apiKey = await resolveCredentialStringValue({
        execution,
        credentialId: input.credentialId,
        field: input.credentialField,
        provider: CredentialProvider.OPENAI,
      });

      const openai = createOpenAIProvider({ apiKey });
      model = openai(input.model);
      break;
    }
    case "ANTHROPIC": {
      const apiKey = await resolveCredentialStringValue({
        execution,
        credentialId: input.credentialId,
        field: input.credentialField,
        provider: CredentialProvider.ANTHROPIC,
      });

      const anthropic = createAnthropicProvider({ apiKey });
      model = anthropic(input.model);
      break;
    }
    case "DEEPSEEK": {
      const apiKey = await resolveCredentialStringValue({
        execution,
        credentialId: input.credentialId,
        field: input.credentialField,
        provider: CredentialProvider.DEEPSEEK,
      });

      const deepseek = createDeepSeekProvider({ apiKey });
      model = deepseek(input.model);
      break;
    }
    case "MINIMAX": {
      const apiKey = await resolveCredentialStringValue({
        execution,
        credentialId: input.credentialId,
        field: input.credentialField,
        provider: CredentialProvider.MINIMAX,
      });

      const minimax = createMinimaxProvider({ apiKey });
      model = minimax(input.model);
      break;
    }
    default:
      throw new WorkflowExecutionError(
        `AI Text provider "${input.provider}" is not supported yet.`,
        "INVALID_AI_NODE_CONFIG",
      );
  }

  const result = await generateText({
    model,
    prompt,
    system: input.system ?? undefined,
    temperature: 0.2,
    maxOutputTokens: 1024,
    providerOptions:
      input.provider === "GOOGLE"
        ? {
            google: {
              thinkingConfig: {
                thinkingBudget: 0,
              },
            },
          }
        : undefined,
  });

  return {
    status: ExecutionStepStatus.SUCCESS,
    output: {
      provider: input.provider,
      model: input.model,
      text: result.text,
      finishReason: result.finishReason,
      usage: result.usage,
      warnings: result.warnings,
      toolContext: toolOutput,
    },
  };
}

function buildTriggeredExecutionPlan(
  workflow: WorkflowForExecution,
  triggerNodeType: TriggerNodeType,
  missingTriggerCode:
    | "MANUAL_TRIGGER_NOT_FOUND"
    | "WEBHOOK_TRIGGER_NOT_FOUND",
): ExecutionPlan {
  const triggerNodes = workflow.nodes.filter(
    (node) => node.type === triggerNodeType,
  );

  if (triggerNodes.length === 0) {
    throw new WorkflowExecutionError(
      `Workflow must contain a ${triggerNodeType.toLowerCase().replaceAll("_", " ")} node before it can be executed.`,
      missingTriggerCode,
    );
  }

  const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const nodeOrder = new Map(
    workflow.nodes.map((node, index) => [node.id, index] as const),
  );
  const adjacency = new Map<string, string[]>();

  for (const connection of workflow.connections) {
    const targets = adjacency.get(connection.fromNodeId) ?? [];
    targets.push(connection.toNodeId);
    adjacency.set(connection.fromNodeId, targets);
  }

  const reachableNodeIds = new Set<string>();
  const queue = triggerNodes.map((node) => node.id);

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || reachableNodeIds.has(nodeId)) {
      continue;
    }

    reachableNodeIds.add(nodeId);

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      queue.push(nextNodeId);
    }
  }
  const triggerNodeIds = new Set(triggerNodes.map((node) => node.id));
  const indexMap = new Map<string, number>();
  const lowLinkMap = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: string[][] = [];
  let nextIndex = 0;

  const visitNode = (nodeId: string) => {
    indexMap.set(nodeId, nextIndex);
    lowLinkMap.set(nodeId, nextIndex);
    nextIndex += 1;
    stack.push(nodeId);
    onStack.add(nodeId);

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      if (!reachableNodeIds.has(nextNodeId)) {
        continue;
      }

      if (!indexMap.has(nextNodeId)) {
        visitNode(nextNodeId);
        lowLinkMap.set(
          nodeId,
          Math.min(
            lowLinkMap.get(nodeId) ?? 0,
            lowLinkMap.get(nextNodeId) ?? 0,
          ),
        );
        continue;
      }

      if (onStack.has(nextNodeId)) {
        lowLinkMap.set(
          nodeId,
          Math.min(
            lowLinkMap.get(nodeId) ?? 0,
            indexMap.get(nextNodeId) ?? 0,
          ),
        );
      }
    }

    if ((lowLinkMap.get(nodeId) ?? 0) !== (indexMap.get(nodeId) ?? 0)) {
      return;
    }

    const component: string[] = [];

    while (stack.length > 0) {
      const currentNodeId = stack.pop();
      if (!currentNodeId) {
        break;
      }

      onStack.delete(currentNodeId);
      component.push(currentNodeId);

      if (currentNodeId === nodeId) {
        break;
      }
    }

    components.push(component);
  };

  for (const nodeId of reachableNodeIds) {
    if (!indexMap.has(nodeId)) {
      visitNode(nodeId);
    }
  }

  const componentIndexByNode = new Map<string, number>();
  for (const [componentIndex, component] of components.entries()) {
    for (const nodeId of component) {
      componentIndexByNode.set(nodeId, componentIndex);
    }
  }

  const componentAdjacency = new Map<number, Set<number>>();
  const componentIndegree = new Map<number, number>();

  for (let componentIndex = 0; componentIndex < components.length; componentIndex += 1) {
    componentIndegree.set(componentIndex, 0);
  }

  for (const connection of workflow.connections) {
    if (
      !reachableNodeIds.has(connection.fromNodeId) ||
      !reachableNodeIds.has(connection.toNodeId)
    ) {
      continue;
    }

    const fromComponentIndex = componentIndexByNode.get(connection.fromNodeId);
    const toComponentIndex = componentIndexByNode.get(connection.toNodeId);

    if (
      fromComponentIndex == null ||
      toComponentIndex == null ||
      fromComponentIndex === toComponentIndex
    ) {
      continue;
    }

    const targets = componentAdjacency.get(fromComponentIndex) ?? new Set<number>();
    if (targets.has(toComponentIndex)) {
      componentAdjacency.set(fromComponentIndex, targets);
      continue;
    }

    targets.add(toComponentIndex);
    componentAdjacency.set(fromComponentIndex, targets);
    componentIndegree.set(
      toComponentIndex,
      (componentIndegree.get(toComponentIndex) ?? 0) + 1,
    );
  }

  const sortedComponents = Array.from(componentIndegree.entries())
    .filter(([, indegree]) => indegree === 0)
    .map(([componentIndex]) => componentIndex)
    .sort((left, right) => {
      const leftOrder = Math.min(
        ...components[left].map((nodeId) => nodeOrder.get(nodeId) ?? 0),
      );
      const rightOrder = Math.min(
        ...components[right].map((nodeId) => nodeOrder.get(nodeId) ?? 0),
      );
      return leftOrder - rightOrder;
    });

  const orderedNodes: WorkflowForExecution["nodes"] = [];

  while (sortedComponents.length > 0) {
    const componentIndex = sortedComponents.shift();

    if (componentIndex == null) {
      continue;
    }

    const component = components[componentIndex]
      .slice()
      .sort((left, right) => {
        return (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0);
      });
    const hasSelfLoop = component.some((nodeId) =>
      (adjacency.get(nodeId) ?? []).includes(nodeId),
    );
    const isCyclic = component.length > 1 || hasSelfLoop;

    if (isCyclic && component.some((nodeId) => triggerNodeIds.has(nodeId))) {
      throw new WorkflowExecutionError(
        "Trigger nodes cannot participate in workflow loops.",
        "WORKFLOW_HAS_CYCLE",
      );
    }

    let repeatCount = 1;

    if (isCyclic) {
      const loopNodes: WorkflowForExecution["nodes"][number][] = [];

      for (const nodeId of component) {
        const node = nodeById.get(nodeId);

        if (node?.type === NodeType.LOOP) {
          loopNodes.push(node);
        }
      }

      if (loopNodes.length === 0) {
        throw new WorkflowExecutionError(
          "A cyclic workflow section must include a Loop node to control local repetition.",
          "WORKFLOW_HAS_CYCLE",
        );
      }

      if (loopNodes.length > 1) {
        throw new WorkflowExecutionError(
          "Each cyclic workflow section can contain only one Loop node.",
          "WORKFLOW_HAS_CYCLE",
        );
      }

      const loopConfig = loopNodeSchema.safeParse(loopNodes[0].data ?? {});

      if (!loopConfig.success) {
        throw new WorkflowExecutionError(
          `Loop node "${loopNodes[0].name}" has invalid configuration.`,
          "INVALID_LOOP_CONFIG",
        );
      }

      repeatCount = loopConfig.data.maxIterations;
    }

    for (let iteration = 0; iteration < repeatCount; iteration += 1) {
      for (const nodeId of component) {
        const node = nodeById.get(nodeId);
        if (node) {
          orderedNodes.push(node);
        }
      }
    }

    for (const nextComponentIndex of componentAdjacency.get(componentIndex) ?? []) {
      const nextIndegree = (componentIndegree.get(nextComponentIndex) ?? 0) - 1;
      componentIndegree.set(nextComponentIndex, nextIndegree);

      if (nextIndegree === 0) {
        sortedComponents.push(nextComponentIndex);
        sortedComponents.sort((left, right) => {
          const leftOrder = Math.min(
            ...components[left].map((nodeId) => nodeOrder.get(nodeId) ?? 0),
          );
          const rightOrder = Math.min(
            ...components[right].map((nodeId) => nodeOrder.get(nodeId) ?? 0),
          );
          return leftOrder - rightOrder;
        });
      }
    }
  }

  return { orderedNodes };
}

async function executeNode(
  execution: ExecutionWithWorkflow,
  node: WorkflowForExecution["nodes"][number],
  input: Prisma.InputJsonValue | null,
): Promise<NodeExecutionResult> {
  switch (node.type) {
    case NodeType.INITIAL:
      return {
        status: ExecutionStepStatus.SKIPPED,
        output: {
          reason: "INITIAL is a canvas placeholder node.",
        },
      };
    case NodeType.MANUAL_TRIGGER:
    case NodeType.WEBHOOK_TRIGGER:
      return {
        status: ExecutionStepStatus.SUCCESS,
        output: execution.triggerPayload as Prisma.InputJsonValue,
      };
    case NodeType.HTTP_REQUEST:
      return executeHttpRequestNode(
        execution,
        input as ResolvedHttpRequestInput,
      );
    case NodeType.AI_TEXT:
      return executeAITextNode(execution, input as ResolvedAITextInput);
    case NodeType.LOOP:
      return {
        status: ExecutionStepStatus.SUCCESS,
        output: input as ResolvedLoopInput,
      };
    case NodeType.TOOL:
      return executeToolNode(input as ResolvedToolInput);
    case NodeType.DISCORD_MESSAGE:
      return executeDiscordMessageNode(
        execution,
        input as ResolvedDiscordMessageInput,
      );
    case NodeType.SLACK_MESSAGE:
      return executeSlackMessageNode(
        execution,
        input as ResolvedSlackMessageInput,
      );
    default:
      throw new WorkflowExecutionError(
        `Node executor for "${node.type}" is not implemented yet.`,
        "UNSUPPORTED_NODE_TYPE",
      );
  }
}

function resolveNodeInput(
  execution: ExecutionWithWorkflow,
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): Prisma.InputJsonValue | null {
  switch (node.type) {
    case NodeType.INITIAL:
      return null;
    case NodeType.MANUAL_TRIGGER:
    case NodeType.WEBHOOK_TRIGGER:
      return execution.triggerPayload as Prisma.InputJsonValue;
    case NodeType.HTTP_REQUEST:
      return normalizeHttpRequestNodeData(node, context);
    case NodeType.AI_TEXT:
      return normalizeAITextNodeData(node, context);
    case NodeType.LOOP:
      return normalizeLoopNodeData(node, context);
    case NodeType.TOOL:
      return normalizeToolNodeData(node, context);
    case NodeType.DISCORD_MESSAGE:
      return normalizeDiscordMessageNodeData(node, context);
    case NodeType.SLACK_MESSAGE:
      return normalizeSlackMessageNodeData(node, context);
    default:
      return {
        triggerType: execution.triggerType,
      };
  }
}

async function findWorkflowForExecution(params: {
  workflowId: string;
  webhookSecret?: string;
  userId?: string;
}) {
  return prisma.workflow.findFirst({
    where: params.userId
      ? {
          id: params.workflowId,
          userId: params.userId,
          ...(params.webhookSecret
            ? {
                webhookSecret: params.webhookSecret,
              }
            : {}),
        }
      : {
          id: params.workflowId,
          ...(params.webhookSecret
            ? {
                webhookSecret: params.webhookSecret,
              }
            : {}),
        },
    include: {
      nodes: true,
      connections: true,
    },
  });
}

async function createTriggeredExecution(params: {
  workflowId: string;
  triggerType: ExecutionTriggerType;
  triggerNodeType: TriggerNodeType;
  missingTriggerCode:
    | "MANUAL_TRIGGER_NOT_FOUND"
    | "WEBHOOK_TRIGGER_NOT_FOUND";
  workflowUserId?: string;
  triggeredByUserId: string;
  triggerPayload: Prisma.InputJsonValue;
}) {
  const workflow = await findWorkflowForExecution({
    workflowId: params.workflowId,
    userId: params.workflowUserId,
  });

  if (!workflow) {
    return null;
  }

  buildTriggeredExecutionPlan(
    workflow,
    params.triggerNodeType,
    params.missingTriggerCode,
  );

  return prisma.execution.create({
    data: {
      workflowId: workflow.id,
      triggerType: params.triggerType,
      status: ExecutionStatus.PENDING,
      triggeredByUserId: params.triggeredByUserId,
      triggerPayload: params.triggerPayload,
      workflowSnapshot: createWorkflowSnapshot(workflow),
      state: {
        phase: "queued",
      },
    },
  });
}

export async function createManualExecution(params: {
  workflowId: string;
  triggeredByUserId: string;
  message?: string;
}) {
  return createTriggeredExecution({
    workflowId: params.workflowId,
    triggerType: ExecutionTriggerType.MANUAL,
    triggerNodeType: NodeType.MANUAL_TRIGGER,
    missingTriggerCode: "MANUAL_TRIGGER_NOT_FOUND",
    workflowUserId: params.triggeredByUserId,
    triggeredByUserId: params.triggeredByUserId,
    triggerPayload: {
      source: "manual",
      body: {
        message:
          params.message?.trim() || "Triggered from the workflow editor.",
      },
    },
  });
}

export async function createWebhookExecution(params: {
  workflowId: string;
  webhookSecret: string;
  triggerPayload: Prisma.InputJsonValue;
}) {
  const workflow = await findWorkflowForExecution({
    workflowId: params.workflowId,
    webhookSecret: params.webhookSecret,
  });

  if (!workflow) {
    return null;
  }

  buildTriggeredExecutionPlan(
    workflow,
    NodeType.WEBHOOK_TRIGGER,
    "WEBHOOK_TRIGGER_NOT_FOUND",
  );

  return prisma.execution.create({
    data: {
      workflowId: workflow.id,
      triggerType: ExecutionTriggerType.WEBHOOK,
      status: ExecutionStatus.PENDING,
      triggeredByUserId: workflow.userId,
      triggerPayload: {
        source: "webhook",
        body: params.triggerPayload,
      },
      workflowSnapshot: createWorkflowSnapshot(workflow),
      state: {
        phase: "queued",
      },
    },
  });
}

export async function runExecution(executionId: string) {
  const claimedExecution = await prisma.execution.updateMany({
    where: {
      id: executionId,
      status: ExecutionStatus.PENDING,
    },
    data: {
      status: ExecutionStatus.RUNNING,
      startedAt: new Date(),
      state: {
        phase: "running",
      },
    },
  });

  if (claimedExecution.count === 0) {
    return prisma.execution.findUnique({
      where: { id: executionId },
      include: {
        steps: true,
      },
    });
  }

  const execution = await prisma.execution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      memoryEntries: true,
      workflow: {
        include: {
          nodes: true,
          connections: true,
        },
      },
    },
  });

  if (!execution) {
    throw new Error(`Execution ${executionId} not found.`);
  }

  try {
    const plan = buildTriggeredExecutionPlan(
      execution.workflow,
      execution.triggerType === ExecutionTriggerType.WEBHOOK
        ? NodeType.WEBHOOK_TRIGGER
        : NodeType.MANUAL_TRIGGER,
      execution.triggerType === ExecutionTriggerType.WEBHOOK
        ? "WEBHOOK_TRIGGER_NOT_FOUND"
        : "MANUAL_TRIGGER_NOT_FOUND",
    );
    const completedSteps = new Map<string, CompletedStepResult>();
    const memoryState = createExecutionMemoryState(execution.memoryEntries);
    const nodeAttempts = new Map<string, number>();

    await prisma.execution.update({
      where: {
        id: executionId,
      },
      data: {
        state: {
          phase: "running",
          plannedNodeIds: plan.orderedNodes.map((node) => node.id),
        },
      },
    });

    await persistExecutionMemoryWrites({
      executionId,
      state: memoryState,
      writes: [
        {
          scope: ExecutionMemoryScope.SHARED,
          namespace: "run",
          key: "trigger",
          value: execution.triggerPayload as Prisma.InputJsonValue,
        },
        {
          scope: ExecutionMemoryScope.SHARED,
          namespace: "run",
          key: "metadata",
          value: {
            executionId: execution.id,
            workflowId: execution.workflowId,
            workflowName: execution.workflow.name,
            triggerType: execution.triggerType,
          },
        },
      ],
    });

    for (const [index, node] of plan.orderedNodes.entries()) {
      const attempt = (nodeAttempts.get(node.id) ?? 0) + 1;
      nodeAttempts.set(node.id, attempt);
      const templateContext = createExecutionTemplateContext(
        execution,
        node,
        completedSteps,
        memoryState,
        {
          attempt,
        },
      );
      const input = resolveNodeInput(execution, node, templateContext);
      const stepStartedAt = Date.now();
      const step = await prisma.executionStep.create({
        data: {
          executionId,
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          position: index,
          attempt,
          status: ExecutionStepStatus.RUNNING,
          startedAt: new Date(),
          input: input ?? {
            triggerType: execution.triggerType,
          },
        },
      });

      try {
        const result = await executeNode(execution, node, input);
        const successTemplateContext = createExecutionTemplateContext(
          execution,
          node,
          completedSteps,
          memoryState,
          {
            attempt,
            status: result.status,
            input: (input ?? null) as Prisma.JsonValue | null,
            output: (result.output ?? null) as Prisma.JsonValue | null,
            error: null,
          },
        );
        const successWrites = [
          ...buildNodeMemoryWrites({
            execution,
            node,
            input,
            status: result.status,
            output: result.output,
          }),
          ...buildConfiguredMemoryWrites(node, successTemplateContext),
          ...(result.memoryWrites ?? []),
        ];

        await prisma.executionStep.update({
          where: {
            id: step.id,
          },
          data: {
            status: result.status,
            output: result.output,
            completedAt: new Date(),
            durationMs: Date.now() - stepStartedAt,
          },
        });

        await persistExecutionMemoryWrites({
          executionId,
          stepId: step.id,
          nodeId: node.id,
          state: memoryState,
          writes: successWrites,
        });

        completedSteps.set(node.id, {
          id: step.id,
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          status: result.status,
          input: (input ?? null) as Prisma.JsonValue | null,
          output: (result.output ?? null) as Prisma.JsonValue | null,
          error: null,
        });
      } catch (error) {
        const serializedStepError = serializeError(error);

        await prisma.executionStep.update({
          where: {
            id: step.id,
          },
          data: {
            status: ExecutionStepStatus.FAILED,
            error: serializedStepError,
            completedAt: new Date(),
            durationMs: Date.now() - stepStartedAt,
          },
        });

        await persistExecutionMemoryWrites({
          executionId,
          stepId: step.id,
          nodeId: node.id,
          state: memoryState,
          writes: buildNodeMemoryWrites({
            execution,
            node,
            input,
            status: ExecutionStepStatus.FAILED,
            error: serializedStepError,
          }),
        });

        completedSteps.set(node.id, {
          id: step.id,
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          status: ExecutionStepStatus.FAILED,
          input: (input ?? null) as Prisma.JsonValue | null,
          output: null,
          error: serializedStepError as Prisma.JsonValue,
        });

        await prisma.execution.update({
          where: {
            id: executionId,
          },
          data: {
            status: ExecutionStatus.FAILED,
            error: serializedStepError,
            completedAt: new Date(),
            state: {
              phase: "failed",
              failedNodeId: node.id,
            },
          },
        });

        throw error;
      }
    }

    return prisma.execution.update({
      where: {
        id: executionId,
      },
      data: {
        status: ExecutionStatus.SUCCESS,
        completedAt: new Date(),
        state: {
          phase: "completed",
        },
      },
      include: {
        steps: true,
      },
    });
  } catch (error) {
    await prisma.execution.update({
      where: {
        id: executionId,
      },
      data: {
        status: ExecutionStatus.FAILED,
        completedAt: new Date(),
        error: serializeError(error),
        state: {
          phase: "failed",
        },
      },
    });

    if (error instanceof WorkflowExecutionError) {
      return prisma.execution.findUnique({
        where: { id: executionId },
        include: {
          steps: true,
        },
      });
    }

    throw error;
  }
}
