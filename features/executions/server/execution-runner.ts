import prisma from "@/lib/db";
import { generateText } from "ai";
import {
  CredentialProvider,
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
  createGoogleProvider,
  createOpenAIProvider,
} from "@/lib/ai/proxy";

type WorkflowForExecution = Prisma.WorkflowGetPayload<{
  include: {
    nodes: true;
    connections: true;
  };
}>;

type ExecutionWithWorkflow = Prisma.ExecutionGetPayload<{
  include: {
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

type TriggerNodeType = NodeType.MANUAL_TRIGGER | NodeType.WEBHOOK_TRIGGER;

type NodeExecutionResult = {
  status: ExecutionStepStatus;
  input?: Prisma.InputJsonValue;
  output?: Prisma.InputJsonValue;
};

type ResolvedHttpRequestInput = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body: Prisma.InputJsonValue | null;
  credential: HttpRequestCredentialConfig | null;
};

type ResolvedAITextInput = {
  provider: "GOOGLE" | "OPENAI" | "ANTHROPIC";
  model: string;
  prompt: string;
  system: string | null;
  credentialId: string;
  credentialField: string;
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

export class WorkflowExecutionError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "MANUAL_TRIGGER_NOT_FOUND"
      | "WEBHOOK_TRIGGER_NOT_FOUND"
      | "WORKFLOW_HAS_CYCLE"
      | "UNSUPPORTED_NODE_TYPE"
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

function createExecutionTemplateContext(
  execution: ExecutionWithWorkflow,
  completedSteps: Map<string, CompletedStepResult>,
): ExecutionTemplateContext {
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
    steps: Object.fromEntries(completedSteps.entries()),
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

function normalizeDiscordMessageNodeData(
  node: WorkflowForExecution["nodes"][number],
  context: ExecutionTemplateContext,
): ResolvedDiscordMessageInput {
  const data = (node.data ?? {}) as DiscordMessageNodeData;
  const content = data.content
    ? resolveTemplateString(data.content, context).trim()
    : "";
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
  const content = data.content
    ? resolveTemplateString(data.content, context).trim()
    : "";
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
  const prompt = data.prompt
    ? resolveTemplateString(data.prompt, context).trim()
    : "";
  const system = data.system
    ? resolveTemplateString(data.system, context).trim()
    : "";
  const credentialId = data.credentialId?.trim();
  const credentialField = data.credentialField?.trim();

  if (!prompt) {
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

  return {
    provider,
    model,
    prompt,
    system: system || null,
    credentialId,
    credentialField,
  };
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
    default:
      throw new WorkflowExecutionError(
        `AI Text provider "${input.provider}" is not supported yet.`,
        "INVALID_AI_NODE_CONFIG",
      );
  }

  const result = await generateText({
    model,
    prompt: input.prompt,
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

  const indegree = new Map<string, number>();
  for (const nodeId of reachableNodeIds) {
    indegree.set(nodeId, 0);
  }

  for (const connection of workflow.connections) {
    if (
      reachableNodeIds.has(connection.fromNodeId) &&
      reachableNodeIds.has(connection.toNodeId)
    ) {
      indegree.set(
        connection.toNodeId,
        (indegree.get(connection.toNodeId) ?? 0) + 1,
      );
    }
  }

  const sortedQueue = Array.from(reachableNodeIds)
    .filter((nodeId) => (indegree.get(nodeId) ?? 0) === 0)
    .sort((left, right) => {
      return (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0);
    });

  const orderedNodes: WorkflowForExecution["nodes"] = [];

  while (sortedQueue.length > 0) {
    const nodeId = sortedQueue.shift();
    if (!nodeId) {
      continue;
    }

    const node = nodeById.get(nodeId);
    if (!node) {
      continue;
    }

    orderedNodes.push(node);

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      if (!reachableNodeIds.has(nextNodeId)) {
        continue;
      }

      const nextIndegree = (indegree.get(nextNodeId) ?? 0) - 1;
      indegree.set(nextNodeId, nextIndegree);

      if (nextIndegree === 0) {
        sortedQueue.push(nextNodeId);
        sortedQueue.sort((left, right) => {
          return (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0);
        });
      }
    }
  }

  if (orderedNodes.length !== reachableNodeIds.size) {
    throw new WorkflowExecutionError(
      "Workflow execution currently supports acyclic graphs only.",
      "WORKFLOW_HAS_CYCLE",
    );
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
  userId?: string;
}) {
  return prisma.workflow.findFirst({
    where: params.userId
      ? {
          id: params.workflowId,
          userId: params.userId,
        }
      : {
          id: params.workflowId,
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
    },
  });
}

export async function createWebhookExecution(params: {
  workflowId: string;
  triggerPayload: Prisma.InputJsonValue;
}) {
  const workflow = await findWorkflowForExecution({
    workflowId: params.workflowId,
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

    for (const [index, node] of plan.orderedNodes.entries()) {
      const templateContext = createExecutionTemplateContext(
        execution,
        completedSteps,
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
          status: ExecutionStepStatus.RUNNING,
          startedAt: new Date(),
          input: input ?? {
            triggerType: execution.triggerType,
          },
        },
      });

      try {
        const result = await executeNode(execution, node, input);
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
        await prisma.executionStep.update({
          where: {
            id: step.id,
          },
          data: {
            status: ExecutionStepStatus.FAILED,
            error: serializeError(error),
            completedAt: new Date(),
            durationMs: Date.now() - stepStartedAt,
          },
        });

        completedSteps.set(node.id, {
          id: step.id,
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          status: ExecutionStepStatus.FAILED,
          input: (input ?? null) as Prisma.JsonValue | null,
          output: null,
          error: serializeError(error) as Prisma.JsonValue,
        });

        await prisma.execution.update({
          where: {
            id: executionId,
          },
          data: {
            status: ExecutionStatus.FAILED,
            error: serializeError(error),
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
