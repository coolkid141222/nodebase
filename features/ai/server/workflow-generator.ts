import { createId } from "@paralleldrive/cuid2";
import { generateText } from "ai";
import type { Edge, Node } from "@xyflow/react";
import { CredentialProvider, NodeType, Prisma } from "@/lib/prisma/client";
import prisma from "@/lib/db";
import {
  createAnthropicProvider,
  createDeepSeekProvider,
  createGoogleProvider,
  createMinimaxProvider,
  createOpenAIProvider,
} from "@/lib/ai/proxy";
import { readCredentialSecret } from "@/features/credentials/server/payload";
import { getToolRegistrySnapshot } from "@/features/tools/server/registry";
import { getDefaultAITextModel } from "../text/shared";
import {
  aiWorkflowDraftSchema,
  type AIWorkflowDraft,
  type GenerateWorkflowGraphInput,
} from "../workflow-generator/shared";

type UserCredentialSummary = {
  id: string;
  name: string;
  provider: CredentialProvider;
  fields: string[];
  description: string | null;
};

type GeneratedWorkflowResult = {
  title: string;
  summary: string;
  notes: string[];
  nodes: Node[];
  edges: Edge[];
};

type SavedGeneratedWorkflowResult = GeneratedWorkflowResult & {
  workflowId: string;
  webhookSecret: string;
};

type PreferredTriggerType = "MANUAL_TRIGGER" | "WEBHOOK_TRIGGER";

const PROBLEM_SOLVING_PROMPT_PATTERN =
  /\b(solve|answer|analy[sz]e|debug|investigate|research|compare|plan|reason|question|issue|problem)\b|问题|分析|研究|排查|解决|比较|推理|调查/i;
const RESEARCH_PROMPT_PATTERN =
  /\b(research|browse|browser|website|web page|page|url|link|docs?|documentation|source)\b|网页|页面|网址|链接|官网|文档|资料|来源/i;
const REFINEMENT_PROMPT_PATTERN =
  /\b(rewrite|refine|polish|iterate|iteration|retry|improve|revise|tighten)\b|润色|改写|重写|迭代|循环|优化|重试|完善/i;
const TASK_DISPATCH_PROMPT_PATTERN =
  /\b(task|dispatch|assign|owner|deadline|priority|brief|briefing|announcement|notify|notification)\b|任务|分派|派发|负责人|截止|优先级|任务消息|通知|公告/i;
const URL_PATTERN = /https?:\/\/[^\s)]+/i;
const FEISHU_PROMPT_PATTERN = /\b(feishu|lark|larksuite)\b|飞书/i;
const FEISHU_WEBHOOK_PATTERN = /open\.feishu\.cn\/open-apis\/bot\/v2\/hook/i;

const WORKFLOW_NODE_X = 300;
const WORKFLOW_NODE_Y = 210;
const WORKFLOW_OFFSET_X = 120;
const WORKFLOW_OFFSET_Y = 140;

function extractJsonObject(text: string) {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Model did not return a JSON object.");
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function unwrapGeneratedDraftPayload(input: unknown) {
  let current = input;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (typeof current === "string") {
      const trimmed = current.trim();

      if (!trimmed) {
        return current;
      }

      try {
        current = JSON.parse(trimmed);
        continue;
      } catch {
        return current;
      }
    }

    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      if ("draft" in current && current.draft !== undefined) {
        current = current.draft;
        continue;
      }

      if ("workflow" in current && current.workflow !== undefined) {
        current = current.workflow;
        continue;
      }
    }

    return current;
  }

  return current;
}

function parseGeneratedWorkflowDraft(text: string) {
  const extractedJson = extractJsonObject(text);
  const parsedJson = JSON.parse(extractedJson);
  const normalizedPayload = unwrapGeneratedDraftPayload(parsedJson);
  const validatedDraft = aiWorkflowDraftSchema.safeParse(normalizedPayload);

  if (validatedDraft.success) {
    return validatedDraft.data;
  }

  const firstIssue = validatedDraft.error.issues[0];
  const issuePath = firstIssue?.path?.length
    ? firstIssue.path.join(".")
    : "root";

  throw new Error(
    `Generated draft has an invalid shape at "${issuePath}": ${firstIssue?.message ?? "unknown validation error"}.`,
  );
}

function parseCredentialFields(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return [];
  }

  const fields = "fields" in metadata ? metadata.fields : undefined;
  return Array.isArray(fields)
    ? fields.filter((field): field is string => typeof field === "string")
    : [];
}

async function resolveGeneratorApiKey(params: {
  userId: string;
  credentialId: string;
  credentialField: string;
  provider: CredentialProvider;
}) {
  const credential = await prisma.credential.findFirst({
    where: {
      id: params.credentialId,
      userId: params.userId,
      provider: params.provider,
    },
  });

  if (!credential) {
    throw new Error(`Credential "${params.credentialId}" was not found.`);
  }

  const secret = readCredentialSecret(credential.encryptedData);
  const apiKey = secret[params.credentialField];

  if (typeof apiKey !== "string" || !apiKey.trim()) {
    throw new Error(
      `Credential "${credential.name}" does not contain a usable "${params.credentialField}" string.`,
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

  return apiKey.trim();
}

async function createGeneratorModel(input: {
  userId: string;
  provider: GenerateWorkflowGraphInput["provider"];
  model?: string;
  credentialId: string;
  credentialField: string;
}) {
  const modelId = input.model?.trim() || getDefaultAITextModel(input.provider);

  switch (input.provider) {
    case "GOOGLE": {
      const apiKey = await resolveGeneratorApiKey({
        userId: input.userId,
        credentialId: input.credentialId,
        credentialField: input.credentialField,
        provider: CredentialProvider.GOOGLE,
      });

      return {
        modelId,
        provider: createGoogleProvider({ apiKey })(modelId),
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        },
      };
    }
    case "OPENAI": {
      const apiKey = await resolveGeneratorApiKey({
        userId: input.userId,
        credentialId: input.credentialId,
        credentialField: input.credentialField,
        provider: CredentialProvider.OPENAI,
      });

      return {
        modelId,
        provider: createOpenAIProvider({ apiKey })(modelId),
        providerOptions: undefined,
      };
    }
    case "ANTHROPIC": {
      const apiKey = await resolveGeneratorApiKey({
        userId: input.userId,
        credentialId: input.credentialId,
        credentialField: input.credentialField,
        provider: CredentialProvider.ANTHROPIC,
      });

      return {
        modelId,
        provider: createAnthropicProvider({ apiKey })(modelId),
        providerOptions: undefined,
      };
    }
    case "DEEPSEEK": {
      const apiKey = await resolveGeneratorApiKey({
        userId: input.userId,
        credentialId: input.credentialId,
        credentialField: input.credentialField,
        provider: CredentialProvider.DEEPSEEK,
      });

      return {
        modelId,
        provider: createDeepSeekProvider({ apiKey })(modelId),
        providerOptions: undefined,
      };
    }
    case "MINIMAX": {
      const apiKey = await resolveGeneratorApiKey({
        userId: input.userId,
        credentialId: input.credentialId,
        credentialField: input.credentialField,
        provider: CredentialProvider.MINIMAX,
      });

      return {
        modelId,
        provider: createMinimaxProvider({ apiKey })(modelId),
        providerOptions: undefined,
      };
    }
  }
}

function formatCredentialInventory(credentials: UserCredentialSummary[]) {
  if (credentials.length === 0) {
    return "No user credentials are available.";
  }

  return credentials
    .map((credential) => {
      const fields = credential.fields.length > 0
        ? credential.fields.join(", ")
        : "unknown";
      return `- ${credential.provider}: ${credential.name} (fields: ${fields})`;
    })
    .join("\n");
}

function formatToolInventory() {
  const registry = getToolRegistrySnapshot();
  const preferredTools = registry.tools.filter(
    (tool) =>
      (tool.provider === "INTERNAL" || tool.provider === "FEISHU") &&
      tool.lifecycle === "READY",
  );

  if (preferredTools.length === 0) {
    return "No runtime tools are available.";
  }

  return preferredTools
    .map((tool) => `- ${tool.provider}: ${tool.id} (${tool.description})`)
    .join("\n");
}

function buildWorkflowGeneratorPrompt(params: {
  userPrompt: string;
  credentials: UserCredentialSummary[];
}) {
  return `
You are generating a Nodebase workflow draft for a visual low-code editor.

Supported node types:
- MANUAL_TRIGGER: starts the workflow manually. Config keys: memoryWrites.
- WEBHOOK_TRIGGER: starts the workflow from an inbound webhook. Config keys: memoryWrites.
- AI_TEXT: generate text. Config keys: provider, model, prompt, system, credentialName, credentialField, memoryWrites.
- HTTP_REQUEST: make an HTTP request. Config keys: endpoint, method, body, authType, credentialName, credentialField, headerName, memoryWrites.
- LOOP: controls a local repeated cycle. Config keys: maxIterations, memoryWrites.
- TOOL: call a runtime tool. Config keys: provider, serverId, toolId, argumentsJson, memoryWrites.
- DISCORD_MESSAGE: send content to Discord. Config keys: content, credentialName, credentialField, memoryWrites.
- SLACK_MESSAGE: send content to Slack. Config keys: content, credentialName, credentialField, memoryWrites.

Template rules:
- Use {{input}} for the previous node's semantic output.
- Use {{inputRaw}} for raw output.
- Use {{current.attempt}} inside loop bodies.
- Use {{memory.shared.run.trigger.body.<field>}} when you need trigger payload values.

Memory rules:
- Use shared memory for values that later nodes must read again.
- Use node private memory for scratch output, intermediate reasoning, or drafts that should not become the workflow-wide source of truth.
- Prefer a small number of stable shared keys such as:
  - problem.task
  - research.context
  - answers.final
- Good memoryWrites examples:
  - {"scope":"SHARED","namespace":"problem","key":"task","value":"{{trigger.body.message}}","mode":"REPLACE","visibility":"PUBLIC","persist":true,"persistenceScope":"WORKFLOW","semanticIndex":false}
  - {"scope":"SHARED","namespace":"research","key":"context","value":"{{current.output.result}}","mode":"REPLACE","visibility":"PUBLIC","persist":true,"persistenceScope":"WORKFLOW","semanticIndex":false}
  - {"scope":"NODE","namespace":"analysis","key":"draft","value":"{{current.output.text}}","mode":"REPLACE","visibility":"PRIVATE","persist":false,"persistenceScope":"WORKFLOW","semanticIndex":false}

Problem-solving rules:
- When the request needs external information, create a TOOL node before AI reasoning.
- Prefer INTERNAL tool id "internal.browser_page" for public web research.
- If the user mentions Feishu, Lark, or 飞书, prefer a TOOL node with provider "FEISHU" and toolId "feishu.message.send".
- Do not use HTTP_REQUEST for Feishu webhook delivery when the native Feishu tool is available.
- After a TOOL node, feed the extracted result into an AI_TEXT node with {{input}}.
- Use LOOP only when iterative refinement is part of the strategy.
- For non-trivial problem-solving prompts, use at least two processing nodes.
- Prefer a structure like: gather context -> analyze -> final answer.
- For task dispatch, messaging, or Feishu delivery prompts, prefer a structure like: trigger -> analyze -> optional refinement loop -> final formatted message -> delivery.
- When a request sounds complex, multi-stage, or user-facing, target at least 4 nodes instead of collapsing everything into one AI node.
- Do not collapse a research or investigation workflow into a single AI_TEXT node unless the user explicitly asks for the smallest possible flow.

Loop rules:
- A local loop uses exactly one LOOP node.
- Upstream nodes connect directly to the first body node with DEFAULT edges.
- Downstream nodes connect directly from the last body node with DEFAULT edges.
- Use exactly two loop-specific edges:
  - LOOP_BODY: go from LOOP to the first node inside the repeated body.
  - LOOP_BACK: go from the last repeated body node back into LOOP.
- All other edges should use DEFAULT.

Layout rules:
- Return column and row for each node.
- Keep flows left-to-right.
- Place LOOP above or beside the nodes it controls, but keep the body readable.

Credential inventory you may reference by credentialName:
${formatCredentialInventory(params.credentials)}

Available tools:
${formatToolInventory()}

Preferred tool usage:
- internal.browser_page
  - Use for public web pages.
  - argumentsJson example: {"url":"https://example.com","maxChars":4000,"includeLinks":true}
- feishu.message.send
  - Use to send the final text result to Feishu / Lark.
  - provider must be FEISHU.
  - argumentsJson example: {"text":"{{input}}"}

Important constraints:
- Use exactly one trigger node.
- Do not use node types outside the supported list.
- Prefer concrete prompts and URLs.
- If a credential is needed, reference a matching credentialName from the inventory when possible.
- Return strict JSON only. No markdown, no explanation.

Required JSON shape:
{
  "title": "Workflow title",
  "summary": "What this workflow does",
  "notes": ["optional implementation notes"],
  "nodes": [
    {
      "id": "trigger",
      "type": "MANUAL_TRIGGER",
      "column": 0,
      "row": 1,
      "config": {
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "problem",
            "key": "task",
            "value": "{{trigger.body.message}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "research",
      "type": "TOOL",
      "column": 1,
      "row": 1,
      "config": {
        "provider": "INTERNAL",
        "toolId": "internal.browser_page",
        "argumentsJson": "{\"url\":\"https://example.com\",\"maxChars\":4000,\"includeLinks\":true}",
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "research",
            "key": "context",
            "value": "{{current.output.result}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "loop",
      "type": "LOOP",
      "column": 2,
      "row": 0,
      "config": {
        "maxIterations": 3,
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "loop",
            "key": "attempt",
            "value": "{{current.output.attempt}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC"
          }
        ]
      }
    },
    {
      "id": "writer",
      "type": "AI_TEXT",
      "column": 3,
      "row": 1,
      "config": {
        "provider": "DEEPSEEK",
        "model": "deepseek-chat",
        "credentialName": "DeepSeek API",
        "credentialField": "apiKey",
        "prompt": "Rewrite this result for iteration {{current.attempt}}: {{input}}",
        "memoryWrites": [
          {
            "scope": "NODE",
            "namespace": "analysis",
            "key": "draft",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PRIVATE",
            "persist": false,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "answers",
            "key": "final",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "notify",
      "type": "SLACK_MESSAGE",
      "column": 4,
      "row": 1,
      "config": {
        "credentialName": "Slack webhook",
        "credentialField": "webhookUrl",
        "content": "{{memory.shared.answers.final}}",
        "memoryWrites": []
      }
    }
  ],
  "edges": [
    { "source": "trigger", "target": "research", "role": "DEFAULT" },
    { "source": "research", "target": "writer", "role": "DEFAULT" },
    { "source": "loop", "target": "writer", "role": "LOOP_BODY" },
    { "source": "writer", "target": "loop", "role": "LOOP_BACK" },
    { "source": "writer", "target": "notify", "role": "DEFAULT" }
  ]
}

User request:
${params.userPrompt}
`.trim();
}

function resolveCredentialReference(params: {
  provider: CredentialProvider;
  credentialName?: string;
  credentialField?: string;
  credentials: UserCredentialSummary[];
  notes: string[];
  nodeDescription: string;
}) {
  const candidates = params.credentials.filter(
    (credential) => credential.provider === params.provider,
  );

  if (candidates.length === 0) {
    params.notes.push(
      `${params.nodeDescription} needs a ${params.provider} credential, but none are available in this account yet.`,
    );
    return {
      credentialId: undefined,
      credentialField: params.credentialField ?? "apiKey",
    };
  }

  if (params.credentialName) {
    const match = candidates.find(
      (credential) =>
        credential.name.localeCompare(params.credentialName ?? "", undefined, {
          sensitivity: "accent",
          usage: "search",
        }) === 0,
    );

    if (match) {
      return {
        credentialId: match.id,
        credentialField:
          params.credentialField ??
          (match.fields.includes("apiKey") ? "apiKey" : match.fields[0] || "apiKey"),
      };
    }

    params.notes.push(
      `${params.nodeDescription} requested credential "${params.credentialName}", so the first available ${params.provider} credential was used instead.`,
    );
  }

  const fallback = candidates[0];
  return {
    credentialId: fallback.id,
    credentialField:
      params.credentialField ??
      (fallback.fields.includes("apiKey")
        ? "apiKey"
        : fallback.fields[0] || "apiKey"),
  };
}

function resolveCredentialByName(params: {
  credentialName?: string;
  credentialField?: string;
  credentials: UserCredentialSummary[];
  notes: string[];
  nodeDescription: string;
}) {
  if (params.credentials.length === 0) {
    params.notes.push(
      `${params.nodeDescription} referenced a credential, but this account does not have any credentials yet.`,
    );
    return {
      credentialId: undefined,
      credentialField: params.credentialField ?? "apiKey",
    };
  }

  if (params.credentialName) {
    const match = params.credentials.find(
      (credential) =>
        credential.name.localeCompare(params.credentialName ?? "", undefined, {
          sensitivity: "accent",
          usage: "search",
        }) === 0,
    );

    if (match) {
      return {
        credentialId: match.id,
        credentialField:
          params.credentialField ??
          (match.fields.includes("apiKey") ? "apiKey" : match.fields[0] || "apiKey"),
      };
    }

    params.notes.push(
      `${params.nodeDescription} requested credential "${params.credentialName}", but no exact match was found. The first available credential was used instead.`,
    );
  }

  const fallback = params.credentials[0];
  return {
    credentialId: fallback.id,
    credentialField:
      params.credentialField ??
      (fallback.fields.includes("apiKey")
        ? "apiKey"
        : fallback.fields[0] || "apiKey"),
  };
}

function buildEdgeHandles(params: {
  sourceType: AIWorkflowDraft["nodes"][number]["type"];
  targetType: AIWorkflowDraft["nodes"][number]["type"];
  role: AIWorkflowDraft["edges"][number]["role"];
}) {
  switch (params.role) {
    case "LOOP_BODY":
      return {
        sourceHandle: params.sourceType === "LOOP" ? "source-main" : null,
        targetHandle: null,
      };
    case "LOOP_BACK":
      return {
        sourceHandle: null,
        targetHandle: params.targetType === "LOOP" ? "target-main" : null,
      };
    default:
      return {
        sourceHandle: null,
        targetHandle: null,
      };
  }
}

function isProblemSolvingPrompt(prompt: string) {
  return PROBLEM_SOLVING_PROMPT_PATTERN.test(prompt);
}

function wantsResearchTool(prompt: string) {
  return RESEARCH_PROMPT_PATTERN.test(prompt) || URL_PATTERN.test(prompt);
}

function wantsIterativeRefinement(prompt: string) {
  return REFINEMENT_PROMPT_PATTERN.test(prompt);
}

function wantsTaskDispatch(prompt: string) {
  return TASK_DISPATCH_PROMPT_PATTERN.test(prompt);
}

function wantsFeishuDelivery(prompt: string) {
  return FEISHU_PROMPT_PATTERN.test(prompt);
}

function wantsComplexScaffold(prompt: string) {
  return (
    isProblemSolvingPrompt(prompt) ||
    wantsResearchTool(prompt) ||
    wantsIterativeRefinement(prompt) ||
    wantsTaskDispatch(prompt) ||
    wantsFeishuDelivery(prompt)
  );
}

function extractFirstUrl(prompt: string) {
  return prompt.match(URL_PATTERN)?.[0] ?? null;
}

function extractLoopIterationLimit(prompt: string) {
  const explicitCountMatch = prompt.match(/(?:up to|for|repeat|retry)?\s*(\d+)\s*(?:times|iterations|rounds|轮|次)/i);
  const parsed = explicitCountMatch?.[1]
    ? Number.parseInt(explicitCountMatch[1], 10)
    : NaN;

  if (Number.isFinite(parsed) && parsed >= 2) {
    return Math.min(parsed, 12);
  }

  return 3;
}

function createDraftNodeId(existingIds: Set<string>, base: string) {
  let candidate = base;
  let suffix = 2;

  while (existingIds.has(candidate)) {
    candidate = `${base}_${suffix}`;
    suffix += 1;
  }

  existingIds.add(candidate);
  return candidate;
}

function createAnalysisPrompt(userPrompt: string) {
  return [
    "Analyze the user's task and extract the key facts, constraints, and the best response strategy.",
    "Keep the output concise and actionable so a downstream node can turn it into the final answer.",
    "",
    "User task:",
    userPrompt,
  ].join("\n");
}

function createFeishuDispatchPrompt(userPrompt: string) {
  return [
    "Turn the upstream context into a Feishu-ready task dispatch message.",
    "Output plain text only with the following sections:",
    "Title",
    "Summary",
    "Owner suggestion",
    "Priority",
    "Deadline suggestion",
    "Next action",
    "",
    "Upstream context:",
    "{{input}}",
    "",
    "Original user request:",
    userPrompt,
  ].join("\n");
}

function createFinalAnswerPrompt(userPrompt: string) {
  return [
    "Produce the final user-facing answer from the upstream context.",
    "Keep the answer concise, practical, and ready to send.",
    "",
    "Upstream context:",
    "{{input}}",
    "",
    "Original user request:",
    userPrompt,
  ].join("\n");
}

function extractMessageTextTemplateFromJsonString(value?: string | null) {
  if (!value?.trim()) {
    return "{{input}}";
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      const directText = "text" in parsed ? parsed.text : undefined;
      if (typeof directText === "string" && directText.trim()) {
        return directText.trim();
      }

      const content = "content" in parsed ? parsed.content : undefined;
      if (
        content &&
        typeof content === "object" &&
        !Array.isArray(content) &&
        "text" in content &&
        typeof content.text === "string" &&
        content.text.trim()
      ) {
        return content.text.trim();
      }
    }
  } catch {
    // Fall back to semantic input when the model emits invalid JSON.
  }

  return "{{input}}";
}

function updateToolArgumentsJson(
  toolNode: Extract<AIWorkflowDraft["nodes"][number], { type: "TOOL" }>,
  nextArgs: Record<string, unknown>,
) {
  toolNode.config.argumentsJson = JSON.stringify(nextArgs, null, 2);
}

function getToolArgumentsJson(
  toolNode: Extract<AIWorkflowDraft["nodes"][number], { type: "TOOL" }>,
) {
  try {
    const parsed = JSON.parse(toolNode.config.argumentsJson) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}

function createFeishuToolNodeFromTemplate(params: {
  node:
    | Extract<AIWorkflowDraft["nodes"][number], { type: "HTTP_REQUEST" }>
    | Extract<AIWorkflowDraft["nodes"][number], { type: "SLACK_MESSAGE" }>
    | Extract<AIWorkflowDraft["nodes"][number], { type: "DISCORD_MESSAGE" }>;
  textTemplate: string;
}): Extract<AIWorkflowDraft["nodes"][number], { type: "TOOL" }> {
  const text = params.textTemplate.trim() || "{{input}}";

  return {
    id: params.node.id,
    type: "TOOL",
    column: params.node.column,
    row: params.node.row,
    config: {
      provider: "FEISHU",
      toolId: "feishu.message.send",
      argumentsJson: JSON.stringify(
        {
          text,
        },
        null,
        2,
      ),
      memoryWrites: params.node.config.memoryWrites ?? [],
    },
  };
}

function ensureNodeMemoryWrite(
  node: AIWorkflowDraft["nodes"][number],
  write: {
    scope: "SHARED" | "NODE";
    namespace: string;
    key: string;
    value: string;
    mode?: "REPLACE" | "MERGE" | "APPEND";
    visibility?: "PUBLIC" | "PRIVATE";
    persist?: boolean;
    persistenceScope?: "WORKFLOW" | "USER";
    semanticIndex?: boolean;
  },
) {
  const nextWrite = {
    scope: write.scope,
    namespace: write.namespace,
    key: write.key,
    value: write.value,
    mode: write.mode ?? "REPLACE",
    visibility: write.visibility ?? (write.scope === "NODE" ? "PRIVATE" : "PUBLIC"),
    persist: write.persist ?? false,
    persistenceScope: write.persistenceScope ?? "WORKFLOW",
    semanticIndex: write.semanticIndex ?? false,
  };

  switch (node.type) {
    case "MANUAL_TRIGGER":
    case "WEBHOOK_TRIGGER":
    case "AI_TEXT":
    case "HTTP_REQUEST":
    case "LOOP":
    case "TOOL":
    case "DISCORD_MESSAGE":
    case "SLACK_MESSAGE": {
      const memoryWrites = node.config.memoryWrites ?? [];
      const exists = memoryWrites.some(
        (item) =>
          item.scope === nextWrite.scope &&
          item.namespace === nextWrite.namespace &&
          item.key === nextWrite.key,
      );

      if (!exists) {
        memoryWrites.push(nextWrite);
      }

      node.config.memoryWrites = memoryWrites;
      return;
    }
  }
}

function promoteProblemSolvingDraft(params: {
  draft: AIWorkflowDraft;
  userPrompt: string;
}) {
  const existingIds = new Set(params.draft.nodes.map((node) => node.id));
  const workingDraft: AIWorkflowDraft = structuredClone(params.draft);

  const aiNodes = workingDraft.nodes.filter((node) => node.type === "AI_TEXT");
  const toolNodes = workingDraft.nodes.filter((node) => node.type === "TOOL");
  const primaryAi = aiNodes[0];

  if (!primaryAi) {
    return workingDraft;
  }

  let firstProcessingNodeId = primaryAi.id;

  if (
    wantsComplexScaffold(params.userPrompt) &&
    aiNodes.length === 1
  ) {
    const analyzerId = createDraftNodeId(existingIds, "analyze_problem");
    const analyzerNode: AIWorkflowDraft["nodes"][number] = {
      id: analyzerId,
      type: "AI_TEXT",
      column: Math.max(primaryAi.column - 1, 1),
      row: primaryAi.row,
      config: {
        provider: primaryAi.config.provider,
        model: primaryAi.config.model,
        credentialName: primaryAi.config.credentialName,
        credentialField: primaryAi.config.credentialField,
        system: "Return a concise analysis for the next node. No markdown bullets unless necessary.",
        prompt: createAnalysisPrompt(params.userPrompt),
        memoryWrites: [],
      },
    };

    workingDraft.nodes.push(analyzerNode);
    workingDraft.edges = workingDraft.edges.map((edge) => {
      if (edge.role !== "DEFAULT" || edge.target !== primaryAi.id) {
        return edge;
      }

      return {
        ...edge,
        target: analyzerId,
      };
    });
    workingDraft.edges.push({
      source: analyzerId,
      target: primaryAi.id,
      role: "DEFAULT",
    });
    workingDraft.notes.push(
      "Added an analysis step so the workflow decomposes the problem before the final answer.",
    );
    firstProcessingNodeId = analyzerId;
  }

  if (wantsResearchTool(params.userPrompt) && toolNodes.length === 0) {
    const url = extractFirstUrl(params.userPrompt);

    if (url) {
      const toolId = createDraftNodeId(existingIds, "research_page");
      const firstProcessingNode = workingDraft.nodes.find(
        (node) => node.id === firstProcessingNodeId,
      );
      const toolNode: AIWorkflowDraft["nodes"][number] = {
        id: toolId,
        type: "TOOL",
        column: Math.max((firstProcessingNode?.column ?? 2) - 1, 1),
        row: firstProcessingNode?.row ?? 1,
        config: {
          provider: "INTERNAL",
          toolId: "internal.browser_page",
          argumentsJson: JSON.stringify(
            {
              url,
              maxChars: 4000,
              includeLinks: true,
            },
            null,
            2,
          ),
          memoryWrites: [],
        },
      };

      workingDraft.nodes.push(toolNode);
      workingDraft.edges = workingDraft.edges.map((edge) => {
        if (edge.role !== "DEFAULT" || edge.target !== firstProcessingNodeId) {
          return edge;
        }

        return {
          ...edge,
          target: toolId,
        };
      });
      workingDraft.edges.push({
        source: toolId,
        target: firstProcessingNodeId,
        role: "DEFAULT",
      });
      workingDraft.notes.push(
        `Added a browser research tool for ${url} before the reasoning steps.`,
      );
    }
  }

  const triggerNode = workingDraft.nodes.find(
    (node) => node.type === "MANUAL_TRIGGER" || node.type === "WEBHOOK_TRIGGER",
  );
  if (triggerNode) {
    ensureNodeMemoryWrite(triggerNode, {
      scope: "SHARED",
      namespace: "problem",
      key: "task",
      value:
        triggerNode.type === "MANUAL_TRIGGER"
          ? "{{trigger.body.message}}"
          : "{{trigger.body}}",
      visibility: "PUBLIC",
      persist: true,
      semanticIndex: false,
    });
  }

  const researchToolNodes = workingDraft.nodes.filter(
    (node) =>
      node.type === "TOOL" &&
      node.config.provider === "INTERNAL" &&
      node.config.toolId === "internal.browser_page",
  );
  for (const [index, toolNode] of researchToolNodes.entries()) {
    ensureNodeMemoryWrite(toolNode, {
      scope: "SHARED",
      namespace: "research",
      key: index === 0 ? "context" : `context_${index + 1}`,
      value: "{{current.output.result}}",
      visibility: "PUBLIC",
      persist: true,
      semanticIndex: false,
    });
  }

  const updatedAiNodes = workingDraft.nodes.filter((node) => node.type === "AI_TEXT");
  if (updatedAiNodes.length > 0) {
    const firstAiNode = updatedAiNodes[0];
    const lastAiNode = updatedAiNodes[updatedAiNodes.length - 1];

    ensureNodeMemoryWrite(firstAiNode, {
      scope: "NODE",
      namespace: "analysis",
      key: "draft",
      value: "{{current.output.text}}",
      visibility: "PRIVATE",
    });

    ensureNodeMemoryWrite(lastAiNode, {
      scope: "SHARED",
      namespace: "answers",
      key: "final",
      value: "{{current.output.text}}",
      visibility: "PUBLIC",
      persist: true,
      semanticIndex: false,
    });
  }

  for (const node of workingDraft.nodes) {
    if (
      (node.type === "SLACK_MESSAGE" || node.type === "DISCORD_MESSAGE") &&
      (node.config.content.trim() === "{{input}}" || node.config.content.trim() === "")
    ) {
      node.config.content = "{{memory.shared.answers.final}}";
    }
  }

  return workingDraft;
}

function promoteComplexWorkflowDraft(params: {
  draft: AIWorkflowDraft;
  userPrompt: string;
}) {
  const workingDraft: AIWorkflowDraft = structuredClone(params.draft);

  if (!wantsComplexScaffold(params.userPrompt)) {
    return workingDraft;
  }

  const existingIds = new Set(workingDraft.nodes.map((node) => node.id));
  const deliveryNodes = workingDraft.nodes.filter(
    (node) =>
      node.type === "SLACK_MESSAGE" ||
      node.type === "DISCORD_MESSAGE" ||
      (node.type === "TOOL" &&
        node.config.provider === "FEISHU" &&
        node.config.toolId === "feishu.message.send"),
  );
  const aiNodes = [...workingDraft.nodes]
    .filter((node) => node.type === "AI_TEXT")
    .sort((left, right) => {
      if (left.column !== right.column) {
        return left.column - right.column;
      }

      return left.row - right.row;
    });
  const loopNodes = workingDraft.nodes.filter((node) => node.type === "LOOP");
  const hasDeliveryNode = deliveryNodes.length > 0;
  const firstAiNode = aiNodes[0];
  const lastAiNode = aiNodes[aiNodes.length - 1];

  if (!firstAiNode || !lastAiNode) {
    return workingDraft;
  }

  if (wantsIterativeRefinement(params.userPrompt) && loopNodes.length === 0) {
    const loopNodeId = createDraftNodeId(existingIds, "loop_refine");
    workingDraft.nodes.push({
      id: loopNodeId,
      type: "LOOP",
      column: lastAiNode.column,
      row: Math.max(lastAiNode.row - 1, 0),
      config: {
        maxIterations: extractLoopIterationLimit(params.userPrompt),
        memoryWrites: [],
      },
    });
    workingDraft.edges.push({
      source: loopNodeId,
      target: lastAiNode.id,
      role: "LOOP_BODY",
    });
    workingDraft.edges.push({
      source: lastAiNode.id,
      target: loopNodeId,
      role: "LOOP_BACK",
    });
    workingDraft.notes.push(
      "Added a local loop so the workflow iteratively refines the result before delivery.",
    );
  }

  if (!hasDeliveryNode) {
    return workingDraft;
  }

  const primaryDelivery = [...deliveryNodes].sort((left, right) => {
    if (left.column !== right.column) {
      return right.column - left.column;
    }

    return right.row - left.row;
  })[0];

  if (!primaryDelivery) {
    return workingDraft;
  }

  const incomingDeliveryEdges = workingDraft.edges.filter(
    (edge) => edge.role === "DEFAULT" && edge.target === primaryDelivery.id,
  );
  const needsFormatter =
    aiNodes.length < 2 ||
    incomingDeliveryEdges.length !== 1 ||
    incomingDeliveryEdges[0]?.source !== lastAiNode.id ||
    lastAiNode.config.prompt.includes("{{input}}") === false;

  if (needsFormatter) {
    const formatterNodeId = createDraftNodeId(existingIds, "final_message");
    const deliveryColumn = primaryDelivery.column;
    primaryDelivery.column = deliveryColumn + 1;

    const formatterNode: AIWorkflowDraft["nodes"][number] = {
      id: formatterNodeId,
      type: "AI_TEXT",
      column: deliveryColumn,
      row: primaryDelivery.row,
      config: {
        provider: lastAiNode.config.provider,
        model: lastAiNode.config.model,
        credentialName: lastAiNode.config.credentialName,
        credentialField: lastAiNode.config.credentialField,
        system: wantsFeishuDelivery(params.userPrompt)
          ? "Return plain text only. No markdown tables, no code fences, no bullets unless they improve clarity."
          : "Return a polished final answer. No code fences unless the user explicitly asks for them.",
        prompt: wantsFeishuDelivery(params.userPrompt) || wantsTaskDispatch(params.userPrompt)
          ? createFeishuDispatchPrompt(params.userPrompt)
          : createFinalAnswerPrompt(params.userPrompt),
        memoryWrites: [],
      },
    };

    ensureNodeMemoryWrite(formatterNode, {
      scope: "SHARED",
      namespace: "answers",
      key: "final",
      value: "{{current.output.text}}",
      visibility: "PUBLIC",
      persist: true,
      semanticIndex: false,
    });

    workingDraft.nodes.push(formatterNode);
    workingDraft.edges = workingDraft.edges.map((edge) => {
      if (edge.role === "DEFAULT" && edge.target === primaryDelivery.id) {
        return {
          ...edge,
          target: formatterNodeId,
        };
      }

      return edge;
    });
    workingDraft.edges.push({
      source: formatterNodeId,
      target: primaryDelivery.id,
      role: "DEFAULT",
    });
    workingDraft.notes.push(
      wantsFeishuDelivery(params.userPrompt)
        ? "Added a final Feishu-ready formatting step before delivery."
        : "Added a dedicated final-answer step before delivery.",
    );
  }

  const refreshedFinalAi = [...workingDraft.nodes]
    .filter((node) => node.type === "AI_TEXT")
    .sort((left, right) => {
      if (left.column !== right.column) {
        return left.column - right.column;
      }

      return left.row - right.row;
    })
    .at(-1);

  if (!refreshedFinalAi) {
    return workingDraft;
  }

  for (const node of workingDraft.nodes) {
    if (node.type === "SLACK_MESSAGE" || node.type === "DISCORD_MESSAGE") {
      if (!node.config.content.trim() || node.config.content.trim() === "{{input}}") {
        node.config.content = "{{memory.shared.answers.final}}";
      }
      continue;
    }

    if (
      node.type === "TOOL" &&
      node.config.provider === "FEISHU" &&
      node.config.toolId === "feishu.message.send"
    ) {
      const currentArgs = getToolArgumentsJson(node) ?? {};
      const currentText =
        typeof currentArgs.text === "string" ? currentArgs.text.trim() : "";

      if (!currentText || currentText === "{{input}}") {
        updateToolArgumentsJson(node, {
          ...currentArgs,
          text: "{{memory.shared.answers.final}}",
        });
      }
    }
  }

  ensureNodeMemoryWrite(refreshedFinalAi, {
    scope: "SHARED",
    namespace: "answers",
    key: "final",
    value: "{{current.output.text}}",
    visibility: "PUBLIC",
    persist: true,
    semanticIndex: false,
  });

  return workingDraft;
}

function normalizeFeishuDeliveryDraft(params: {
  draft: AIWorkflowDraft;
  userPrompt: string;
}) {
  const workingDraft: AIWorkflowDraft = structuredClone(params.draft);

  if (!wantsFeishuDelivery(params.userPrompt)) {
    return workingDraft;
  }

  let normalizedExistingDelivery = false;
  const hasNativeFeishuTool = workingDraft.nodes.some(
    (node) =>
      node.type === "TOOL" &&
      node.config.provider === "FEISHU" &&
      node.config.toolId === "feishu.message.send",
  );

  workingDraft.nodes = workingDraft.nodes.map((node) => {
    if (
      node.type === "HTTP_REQUEST" &&
      (FEISHU_WEBHOOK_PATTERN.test(node.config.endpoint) ||
        node.config.endpoint.includes("{webhookId}"))
    ) {
      normalizedExistingDelivery = true;
      return createFeishuToolNodeFromTemplate({
        node,
        textTemplate: extractMessageTextTemplateFromJsonString(node.config.body),
      });
    }

    if (
      !hasNativeFeishuTool &&
      (node.type === "SLACK_MESSAGE" || node.type === "DISCORD_MESSAGE")
    ) {
      normalizedExistingDelivery = true;
      return createFeishuToolNodeFromTemplate({
        node,
        textTemplate: node.config.content,
      });
    }

    return node;
  });

  const nowHasFeishuTool = workingDraft.nodes.some(
    (node) =>
      node.type === "TOOL" &&
      node.config.provider === "FEISHU" &&
      node.config.toolId === "feishu.message.send",
  );

  if (normalizedExistingDelivery) {
    workingDraft.notes.push(
      "Normalized the delivery step to the native Feishu tool node.",
    );
  }

  if (!nowHasFeishuTool) {
    const defaultEdges = workingDraft.edges.filter((edge) => edge.role === "DEFAULT");
    const sourceNodeIds = new Set(defaultEdges.map((edge) => edge.source));
    const terminalNode = [...workingDraft.nodes]
      .filter(
        (node) =>
          node.type !== "MANUAL_TRIGGER" &&
          node.type !== "WEBHOOK_TRIGGER" &&
          node.type !== "LOOP" &&
          !sourceNodeIds.has(node.id),
      )
      .sort((left, right) => {
        if (right.column !== left.column) {
          return right.column - left.column;
        }

        return right.row - left.row;
      })[0];

    if (terminalNode) {
      const existingIds = new Set(workingDraft.nodes.map((node) => node.id));
      const feishuNodeId = createDraftNodeId(existingIds, "feishu_message");
      workingDraft.nodes.push({
        id: feishuNodeId,
        type: "TOOL",
        column: terminalNode.column + 1,
        row: terminalNode.row,
        config: {
          provider: "FEISHU",
          toolId: "feishu.message.send",
          argumentsJson: JSON.stringify(
            {
              text: "{{input}}",
            },
            null,
            2,
          ),
          memoryWrites: [],
        },
      });
      workingDraft.edges.push({
        source: terminalNode.id,
        target: feishuNodeId,
        role: "DEFAULT",
      });
      workingDraft.notes.push(
        "Added a native Feishu delivery node for the final answer.",
      );
    }
  }

  return workingDraft;
}

function normalizeLoopDraft(draft: AIWorkflowDraft) {
  const workingDraft: AIWorkflowDraft = structuredClone(draft);
  const nodeTypeById = new Map(
    workingDraft.nodes.map((node) => [node.id, node.type] as const),
  );
  const loopNodes = workingDraft.nodes.filter((node) => node.type === "LOOP");

  for (const loopNode of loopNodes) {
    const loopId = loopNode.id;
    const loopBodyEdges = workingDraft.edges.filter(
      (edge) =>
        edge.role === "LOOP_BODY" &&
        edge.source === loopId &&
        nodeTypeById.get(edge.target) !== "LOOP",
    );
    const loopBackEdges = workingDraft.edges.filter(
      (edge) =>
        edge.role === "LOOP_BACK" &&
        edge.target === loopId &&
        nodeTypeById.get(edge.source) !== "LOOP",
    );
    const incomingDefaults = workingDraft.edges.filter(
      (edge) =>
        edge.role === "DEFAULT" &&
        edge.target === loopId &&
        nodeTypeById.get(edge.source) !== "LOOP",
    );
    const outgoingDefaults = workingDraft.edges.filter(
      (edge) =>
        edge.role === "DEFAULT" &&
        edge.source === loopId &&
        nodeTypeById.get(edge.target) !== "LOOP",
    );
    const adjacentBodyNodeIds = Array.from(
      new Set(
        [
          ...loopBodyEdges.map((edge) => edge.target),
          ...loopBackEdges.map((edge) => edge.source),
          ...outgoingDefaults.map((edge) => edge.target),
          ...incomingDefaults.map((edge) => edge.source),
        ].filter((nodeId) => nodeTypeById.get(nodeId) !== "LOOP"),
      ),
    );
    const singleBodyNodeId =
      adjacentBodyNodeIds.length === 1 ? adjacentBodyNodeIds[0] : undefined;
    const bodyStartId =
      loopBodyEdges[0]?.target ??
      (outgoingDefaults.length === 1 ? outgoingDefaults[0]?.target : undefined) ??
      singleBodyNodeId;
    const bodyEndId =
      loopBackEdges[0]?.source ??
      (incomingDefaults.length === 1 ? incomingDefaults[0]?.source : undefined) ??
      singleBodyNodeId ??
      bodyStartId;

    if (!bodyStartId || !bodyEndId) {
      continue;
    }

    const rewrittenEdges: AIWorkflowDraft["edges"] = [];
    const pushEdge = (edge: AIWorkflowDraft["edges"][number]) => {
      const exists = rewrittenEdges.some(
        (candidate) =>
          candidate.source === edge.source &&
          candidate.target === edge.target &&
          candidate.role === edge.role,
      );

      if (!exists) {
        rewrittenEdges.push(edge);
      }
    };

    for (const edge of workingDraft.edges) {
      if (edge.source === loopId) {
        if (
          edge.role === "LOOP_BODY" ||
          edge.role === "DEFAULT"
        ) {
          if (edge.target !== bodyStartId) {
            pushEdge({
              source: bodyEndId,
              target: edge.target,
              role: "DEFAULT",
            });
          }
        }
        continue;
      }

      if (edge.target === loopId) {
        if (
          edge.role === "LOOP_BACK" ||
          edge.role === "DEFAULT"
        ) {
          if (edge.source !== bodyEndId) {
            pushEdge({
              source: edge.source,
              target: bodyStartId,
              role: "DEFAULT",
            });
          }
        }
        continue;
      }

      pushEdge(edge);
    }

    pushEdge({
      source: loopId,
      target: bodyStartId,
      role: "LOOP_BODY",
    });
    pushEdge({
      source: bodyEndId,
      target: loopId,
      role: "LOOP_BACK",
    });

    workingDraft.edges = rewrittenEdges;

    if (
      incomingDefaults.length > 0 ||
      outgoingDefaults.length > 0 ||
      loopBodyEdges.length > 1 ||
      loopBackEdges.length > 1
    ) {
      workingDraft.notes.push(
        `Normalized loop "${loopId}" to stable body/back wiring.`,
      );
    }
  }

  const dedupedEdges = new Map<string, AIWorkflowDraft["edges"][number]>();
  for (const edge of workingDraft.edges) {
    const key = `${edge.source}:${edge.target}:${edge.role}`;
    if (!dedupedEdges.has(key)) {
      dedupedEdges.set(key, edge);
    }
  }

  workingDraft.edges = Array.from(dedupedEdges.values());

  return workingDraft;
}

function normalizePreferredTriggerType(params: {
  draft: AIWorkflowDraft;
  preferredTriggerType?: PreferredTriggerType;
}) {
  const { preferredTriggerType } = params;

  if (!preferredTriggerType) {
    return params.draft;
  }

  const workingDraft: AIWorkflowDraft = structuredClone(params.draft);
  let changed = false;

  workingDraft.nodes = workingDraft.nodes.map((node) => {
    if (
      node.type === "MANUAL_TRIGGER" ||
      node.type === "WEBHOOK_TRIGGER"
    ) {
      if (node.type !== preferredTriggerType) {
        changed = true;
      }

      return {
        ...node,
        type: preferredTriggerType,
      };
    }

    return node;
  });

  if (changed) {
    workingDraft.notes.push(
      `Normalized the trigger to ${preferredTriggerType} for the current channel.`,
    );
  }

  return workingDraft;
}

function mapGeneratedDraftToCanvas(params: {
  draft: AIWorkflowDraft;
  credentials: UserCredentialSummary[];
}) {
  const notes = [...params.draft.notes];
  const nodeIdMap = new Map<string, string>();
  const generatedNodes: Node[] = [];

  for (const node of params.draft.nodes) {
    const actualId = createId();
    nodeIdMap.set(node.id, actualId);

    const baseNode = {
      id: actualId,
      type: node.type,
      position: {
        x: WORKFLOW_OFFSET_X + node.column * WORKFLOW_NODE_X,
        y: WORKFLOW_OFFSET_Y + node.row * WORKFLOW_NODE_Y,
      },
      data: {} as Record<string, unknown>,
    } satisfies Node;

    switch (node.type) {
      case "MANUAL_TRIGGER":
      case "WEBHOOK_TRIGGER":
        generatedNodes.push({
          ...baseNode,
          data: {
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      case "LOOP":
        generatedNodes.push({
          ...baseNode,
          data: {
            maxIterations: node.config.maxIterations,
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      case "TOOL":
        generatedNodes.push({
          ...baseNode,
          data: {
            provider: node.config.provider,
            serverId: node.config.serverId ?? "",
            serverDisplayName: "",
            toolId: node.config.toolId,
            toolDisplayName: "",
            argumentsJson: node.config.argumentsJson,
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      case "AI_TEXT": {
        const provider = node.config.provider;
        const credential = resolveCredentialReference({
          provider,
          credentialName: node.config.credentialName,
          credentialField: node.config.credentialField,
          credentials: params.credentials,
          notes,
          nodeDescription: `AI node "${node.id}"`,
        });
        generatedNodes.push({
          ...baseNode,
          data: {
            provider,
            model: node.config.model || getDefaultAITextModel(provider),
            prompt: node.config.prompt,
            system: node.config.system || "",
            credentialId: credential.credentialId,
            credentialField: credential.credentialField,
            toolEnabled: false,
            toolProvider: "INTERNAL",
            toolServerId: "",
            toolId: "",
            toolDisplayName: "",
            toolArgumentsJson: "{}",
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      }
      case "HTTP_REQUEST": {
        const credential =
          node.config.authType !== "NONE"
            ? resolveCredentialByName({
                credentialName: node.config.credentialName,
                credentialField: node.config.credentialField,
                credentials: params.credentials,
                notes,
                nodeDescription: `HTTP node "${node.id}"`,
              })
            : {
                credentialId: undefined,
                credentialField: node.config.credentialField ?? "apiKey",
              };

        generatedNodes.push({
          ...baseNode,
          data: {
            endpoint: node.config.endpoint,
            method: node.config.method,
            body: node.config.body || "",
            authType: node.config.authType,
            credentialId: credential.credentialId,
            credentialField: credential.credentialField,
            headerName: node.config.headerName || "",
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      }
      case "DISCORD_MESSAGE": {
        const credential = resolveCredentialReference({
          provider: CredentialProvider.DISCORD,
          credentialName: node.config.credentialName,
          credentialField: node.config.credentialField ?? "webhookUrl",
          credentials: params.credentials,
          notes,
          nodeDescription: `Discord node "${node.id}"`,
        });
        generatedNodes.push({
          ...baseNode,
          data: {
            content: node.config.content,
            credentialId: credential.credentialId,
            credentialField: credential.credentialField,
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      }
      case "SLACK_MESSAGE": {
        const credential = resolveCredentialReference({
          provider: CredentialProvider.SLACK,
          credentialName: node.config.credentialName,
          credentialField: node.config.credentialField ?? "webhookUrl",
          credentials: params.credentials,
          notes,
          nodeDescription: `Slack node "${node.id}"`,
        });
        generatedNodes.push({
          ...baseNode,
          data: {
            content: node.config.content,
            credentialId: credential.credentialId,
            credentialField: credential.credentialField,
            memoryWrites: node.config.memoryWrites,
          },
        });
        break;
      }
    }
  }

  const generatedNodeTypeMap = new Map(
    params.draft.nodes.map((node) => [node.id, node.type] as const),
  );

  const generatedEdges: Edge[] = [];

  for (const edge of params.draft.edges) {
    const source = nodeIdMap.get(edge.source);
    const target = nodeIdMap.get(edge.target);
    const sourceType = generatedNodeTypeMap.get(edge.source);
    const targetType = generatedNodeTypeMap.get(edge.target);

    if (!source || !target || !sourceType || !targetType) {
      continue;
    }

    const handles = buildEdgeHandles({
      sourceType,
      targetType,
      role: edge.role,
    });

    generatedEdges.push({
      id: createId(),
      type: "workflow",
      source,
      target,
      sourceHandle: handles.sourceHandle ?? undefined,
      targetHandle: handles.targetHandle ?? undefined,
    });
  }

  return {
    title: params.draft.title,
    summary: params.draft.summary,
    notes,
    nodes: generatedNodes,
    edges: generatedEdges,
  };
}

function validateGeneratedDraft(draft: AIWorkflowDraft) {
  const triggerNodes = draft.nodes.filter(
    (node) => node.type === "MANUAL_TRIGGER" || node.type === "WEBHOOK_TRIGGER",
  );

  if (triggerNodes.length !== 1) {
    throw new Error("Generated workflow must contain exactly one trigger node.");
  }

  const nodeIds = new Set<string>();
  const nodeTypeById = new Map(
    draft.nodes.map((node) => [node.id, node.type] as const),
  );

  for (const node of draft.nodes) {
    if (nodeIds.has(node.id)) {
      throw new Error(`Generated workflow contains duplicate node id "${node.id}".`);
    }

    nodeIds.add(node.id);
  }

  for (const edge of draft.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error("Generated workflow contains an edge that references a missing node.");
    }

    const sourceType = nodeTypeById.get(edge.source);
    const targetType = nodeTypeById.get(edge.target);

    if (edge.role === "DEFAULT") {
      if (sourceType === "LOOP" || targetType === "LOOP") {
        throw new Error("DEFAULT edges cannot start from or end at a LOOP node.");
      }
      continue;
    }

    if (edge.role === "LOOP_BODY" && sourceType !== "LOOP") {
      throw new Error("LOOP_BODY edges must start from a LOOP node.");
    }

    if (edge.role === "LOOP_BACK" && targetType !== "LOOP") {
      throw new Error("LOOP_BACK edges must return into a LOOP node.");
    }
  }
}

export async function generateWorkflowDraft(params: {
  userId: string;
  input: GenerateWorkflowGraphInput;
  preferredTriggerType?: PreferredTriggerType;
}): Promise<GeneratedWorkflowResult> {
  const credentials = await prisma.credential.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      name: true,
      provider: true,
      description: true,
      metadata: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const userCredentials: UserCredentialSummary[] = credentials.map((credential) => ({
    id: credential.id,
    name: credential.name,
    provider: credential.provider,
    description: credential.description,
    fields: parseCredentialFields(credential.metadata),
  }));

  const model = await createGeneratorModel({
    userId: params.userId,
    provider: params.input.provider,
    model: params.input.model,
    credentialId: params.input.credentialId,
    credentialField: params.input.credentialField,
  });

  const result = await generateText({
    model: model.provider,
    prompt: buildWorkflowGeneratorPrompt({
      userPrompt: params.input.prompt,
      credentials: userCredentials,
    }),
    temperature: 0.2,
    maxOutputTokens: 2_400,
    providerOptions: model.providerOptions,
  });

  const draft = parseGeneratedWorkflowDraft(result.text);
  const promotedDraft = promoteProblemSolvingDraft({
    draft,
    userPrompt: params.input.prompt,
  });
  const feishuNormalizedDraft = normalizeFeishuDeliveryDraft({
    draft: promotedDraft,
    userPrompt: params.input.prompt,
  });
  const complexPromotedDraft = promoteComplexWorkflowDraft({
    draft: feishuNormalizedDraft,
    userPrompt: params.input.prompt,
  });
  const triggerNormalizedDraft = normalizePreferredTriggerType({
    draft: complexPromotedDraft,
    preferredTriggerType: params.preferredTriggerType,
  });
  const normalizedDraft = normalizeLoopDraft(triggerNormalizedDraft);
  validateGeneratedDraft(normalizedDraft);

  return mapGeneratedDraftToCanvas({
    draft: normalizedDraft,
    credentials: userCredentials,
  });
}

export async function createGeneratedWorkflowDraft(params: {
  userId: string;
  input: GenerateWorkflowGraphInput;
  preferredTriggerType?: PreferredTriggerType;
}): Promise<SavedGeneratedWorkflowResult> {
  const generatedDraft = await generateWorkflowDraft({
    userId: params.userId,
    input: params.input,
    preferredTriggerType: params.preferredTriggerType,
  });
  const workflow = await prisma.workflow.create({
    data: {
      userId: params.userId,
      name: generatedDraft.title,
    },
    select: {
      id: true,
      webhookSecret: true,
    },
  });

  if (generatedDraft.nodes.length > 0) {
    await prisma.node.createMany({
      data: generatedDraft.nodes.map((node) => ({
        id: node.id,
        workflowId: workflow.id,
        name:
          typeof node.type === "string" && node.type.length > 0
            ? node.type
            : "NODE",
        type: node.type as NodeType,
        position: node.position as Prisma.InputJsonValue,
        data: ((node.data ?? {}) as Record<string, unknown>) as Prisma.InputJsonValue,
      })),
    });
  }

  if (generatedDraft.edges.length > 0) {
    await prisma.connection.createMany({
      data: generatedDraft.edges.map((edge) => ({
        workflowId: workflow.id,
        fromNodeId: edge.source,
        toNodeId: edge.target,
        fromOutput: edge.sourceHandle ?? "source-1",
        toInput: edge.targetHandle ?? "target-1",
      })),
    });
  }

  return {
    ...generatedDraft,
    workflowId: workflow.id,
    webhookSecret: workflow.webhookSecret,
  };
}
