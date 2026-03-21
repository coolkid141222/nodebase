import { createId } from "@paralleldrive/cuid2";
import { generateText } from "ai";
import type { Edge, Node } from "@xyflow/react";
import { CredentialProvider } from "@/lib/prisma/client";
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
  const internalTools = registry.tools.filter((tool) => tool.provider === "INTERNAL");

  if (internalTools.length === 0) {
    return "No runtime tools are available.";
  }

  return internalTools
    .map((tool) => `- INTERNAL: ${tool.id} (${tool.description})`)
    .join("\n");
}

function buildWorkflowGeneratorPrompt(params: {
  userPrompt: string;
  credentials: UserCredentialSummary[];
}) {
  return `
You are generating a Nodebase workflow draft for a visual low-code editor.

Supported node types:
- MANUAL_TRIGGER: starts the workflow manually.
- WEBHOOK_TRIGGER: starts the workflow from an inbound webhook.
- AI_TEXT: generate text. Config keys: provider, model, prompt, system, credentialName, credentialField.
- HTTP_REQUEST: make an HTTP request. Config keys: endpoint, method, body, authType, credentialName, credentialField, headerName.
- LOOP: controls a local repeated cycle. Config keys: maxIterations.
- TOOL: call a runtime tool. Config keys: provider, serverId, toolId, argumentsJson.
- DISCORD_MESSAGE: send content to Discord. Config keys: content, credentialName, credentialField.
- SLACK_MESSAGE: send content to Slack. Config keys: content, credentialName, credentialField.

Template rules:
- Use {{input}} for the previous node's semantic output.
- Use {{inputRaw}} for raw output.
- Use {{current.attempt}} inside loop bodies.
- Use {{memory.shared.run.trigger.body.<field>}} when you need trigger payload values.

Problem-solving rules:
- When the request needs external information, create a TOOL node before AI reasoning.
- Prefer INTERNAL tool id "internal.browser_page" for public web research.
- After a TOOL node, feed the extracted result into an AI_TEXT node with {{input}}.
- Use LOOP only when iterative refinement is part of the strategy.

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
      "row": 1
    },
    {
      "id": "research",
      "type": "TOOL",
      "column": 1,
      "row": 1,
      "config": {
        "provider": "INTERNAL",
        "toolId": "internal.browser_page",
        "argumentsJson": "{\"url\":\"https://example.com\",\"maxChars\":4000,\"includeLinks\":true}"
      }
    },
    {
      "id": "loop",
      "type": "LOOP",
      "column": 2,
      "row": 0,
      "config": { "maxIterations": 3 }
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
        "prompt": "Rewrite this result for iteration {{current.attempt}}: {{input}}"
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
        "content": "{{input}}"
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
            memoryWrites: [],
          },
        });
        break;
      case "LOOP":
        generatedNodes.push({
          ...baseNode,
          data: {
            maxIterations: node.config.maxIterations,
            memoryWrites: [],
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
            memoryWrites: [],
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
            memoryWrites: [],
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
            memoryWrites: [],
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
            memoryWrites: [],
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
            memoryWrites: [],
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

    if (edge.role === "DEFAULT") {
      continue;
    }

    const sourceType = nodeTypeById.get(edge.source);
    const targetType = nodeTypeById.get(edge.target);

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

  const parsedJson = extractJsonObject(result.text);
  const draft = aiWorkflowDraftSchema.parse(JSON.parse(parsedJson));
  validateGeneratedDraft(draft);

  return mapGeneratedDraftToCanvas({
    draft,
    credentials: userCredentials,
  });
}
