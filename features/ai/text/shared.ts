import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";

export const aiTextProviderSchema = z.enum([
  "GOOGLE",
  "OPENAI",
  "ANTHROPIC",
  "DEEPSEEK",
  "MINIMAX",
]);

export const aiTextDefaultModels = {
  GOOGLE: "gemini-2.5-flash",
  OPENAI: "gpt-4o-mini",
  ANTHROPIC: "claude-3-5-haiku-latest",
  DEEPSEEK: "deepseek-chat",
  MINIMAX: "MiniMax-M2.1",
} as const;

export function getDefaultAITextModel(
  provider: z.infer<typeof aiTextProviderSchema>,
) {
  return aiTextDefaultModels[provider];
}

export const aiTextNodeSchema = z.object({
  provider: aiTextProviderSchema.default("GOOGLE"),
  model: z.string().trim().min(1),
  prompt: z.string().min(1),
  system: z.string().optional(),
  credentialId: z.string().min(1),
  credentialField: z.string().min(1),
  memoryWrites: executionMemoryWriteConfigListSchema,
});

export type AITextNodeData = {
  provider?: z.infer<typeof aiTextProviderSchema>;
  model?: string;
  prompt?: string;
  system?: string;
  credentialId?: string;
  credentialField?: string;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};
