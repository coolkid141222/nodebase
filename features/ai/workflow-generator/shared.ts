import z from "zod";
import { aiTextProviderSchema, getDefaultAITextModel } from "../text/shared";
import { executionMemoryWriteConfigListSchema } from "@/features/executions/memory/shared";

export const workflowGenerationModeSchema = z.enum([
  "AUTO",
  "SIMPLE",
  "PROBLEM_SOLVER",
  "RESEARCH_DELIVERY",
]);

export const workflowGeneratorNodeTypeSchema = z.enum([
  "MANUAL_TRIGGER",
  "WEBHOOK_TRIGGER",
  "AI_TEXT",
  "HTTP_REQUEST",
  "LOOP",
  "TOOL",
  "DISCORD_MESSAGE",
  "SLACK_MESSAGE",
]);

export const workflowGeneratorEdgeRoleSchema = z.enum([
  "DEFAULT",
  "LOOP_BODY",
  "LOOP_BACK",
]);

const workflowGeneratorPositionSchema = z.object({
  column: z.coerce.number().int().min(0).max(12),
  row: z.coerce.number().int().min(0).max(12),
});

const namedCredentialSchema = z.object({
  credentialName: z.string().trim().min(1).max(120).optional(),
  credentialField: z.string().trim().min(1).max(120).optional(),
});

const manualTriggerSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("MANUAL_TRIGGER"),
  ...workflowGeneratorPositionSchema.shape,
  config: z.object({
    memoryWrites: executionMemoryWriteConfigListSchema,
  }).default({
    memoryWrites: [],
  }),
});

const webhookTriggerSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("WEBHOOK_TRIGGER"),
  ...workflowGeneratorPositionSchema.shape,
  config: z.object({
    memoryWrites: executionMemoryWriteConfigListSchema,
  }).default({
    memoryWrites: [],
  }),
});

const aiTextSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("AI_TEXT"),
  ...workflowGeneratorPositionSchema.shape,
  config: z
    .object({
      provider: aiTextProviderSchema.default("GOOGLE"),
      model: z.string().trim().min(1).optional(),
      prompt: z.string().trim().min(1).max(2_000),
      system: z.string().trim().max(1_000).optional(),
      memoryWrites: executionMemoryWriteConfigListSchema,
    })
    .merge(namedCredentialSchema),
});

const httpRequestSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("HTTP_REQUEST"),
  ...workflowGeneratorPositionSchema.shape,
  config: z
    .object({
      endpoint: z.string().trim().min(1).max(2_000),
      method: z.enum(["GET", "POST", "PATCH", "DELETE"]).default("GET"),
      body: z.string().max(4_000).optional(),
      authType: z.enum(["NONE", "BEARER", "HEADER"]).default("NONE"),
      headerName: z.string().trim().max(120).optional(),
      memoryWrites: executionMemoryWriteConfigListSchema,
    })
    .merge(namedCredentialSchema),
});

const loopSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("LOOP"),
  ...workflowGeneratorPositionSchema.shape,
  config: z.object({
    maxIterations: z.coerce.number().int().min(1).max(12).default(3),
    memoryWrites: executionMemoryWriteConfigListSchema,
  }),
});

const toolSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("TOOL"),
  ...workflowGeneratorPositionSchema.shape,
  config: z.object({
    provider: z.enum(["INTERNAL", "MCP", "OPENCLAW", "FEISHU"]).default("INTERNAL"),
    serverId: z.string().trim().max(120).optional(),
    toolId: z.string().trim().min(1).max(160),
    argumentsJson: z.string().trim().min(1).max(6_000),
    memoryWrites: executionMemoryWriteConfigListSchema,
  }),
});

const discordSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("DISCORD_MESSAGE"),
  ...workflowGeneratorPositionSchema.shape,
  config: z
    .object({
      content: z.string().trim().min(1).max(2_000),
      memoryWrites: executionMemoryWriteConfigListSchema,
    })
    .merge(namedCredentialSchema),
});

const slackSpecSchema = z.object({
  id: z.string().trim().min(1).max(40),
  type: z.literal("SLACK_MESSAGE"),
  ...workflowGeneratorPositionSchema.shape,
  config: z
    .object({
      content: z.string().trim().min(1).max(2_000),
      memoryWrites: executionMemoryWriteConfigListSchema,
    })
    .merge(namedCredentialSchema),
});

export const aiWorkflowDraftNodeSchema = z.discriminatedUnion("type", [
  manualTriggerSpecSchema,
  webhookTriggerSpecSchema,
  aiTextSpecSchema,
  httpRequestSpecSchema,
  loopSpecSchema,
  toolSpecSchema,
  discordSpecSchema,
  slackSpecSchema,
]);

export const aiWorkflowDraftEdgeSchema = z.object({
  source: z.string().trim().min(1).max(40),
  target: z.string().trim().min(1).max(40),
  role: workflowGeneratorEdgeRoleSchema.default("DEFAULT"),
});

export const aiWorkflowDraftSchema = z.object({
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(500),
  notes: z.array(z.string().trim().min(1).max(240)).max(8).default([]),
  nodes: z.array(aiWorkflowDraftNodeSchema).min(1).max(24),
  edges: z.array(aiWorkflowDraftEdgeSchema).max(48),
});

export const generateWorkflowGraphInputSchema = z.object({
  prompt: z.string().trim().min(8).max(4_000),
  mode: workflowGenerationModeSchema.default("PROBLEM_SOLVER"),
  provider: aiTextProviderSchema.default("MINIMAX"),
  model: z.string().trim().min(1).optional(),
  credentialId: z.string().trim().min(1),
  credentialField: z.string().trim().min(1).default("apiKey"),
});

export function getDefaultWorkflowGeneratorModel(
  provider: z.infer<typeof aiTextProviderSchema>,
) {
  return getDefaultAITextModel(provider);
}

export type GenerateWorkflowGraphInput = z.infer<
  typeof generateWorkflowGraphInputSchema
>;

export type AIWorkflowDraft = z.infer<typeof aiWorkflowDraftSchema>;
