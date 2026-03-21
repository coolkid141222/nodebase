import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import { toolProviderSchema } from "@/features/tools/shared";

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
  MINIMAX: "MiniMax-M2.5",
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
  toolEnabled: z.boolean().default(false),
  toolProvider: toolProviderSchema.default("INTERNAL"),
  toolServerId: z.string().trim().default(""),
  toolId: z.string().trim().default(""),
  toolDisplayName: z.string().trim().default(""),
  toolArgumentsJson: z.string().default("{}"),
  memoryWrites: executionMemoryWriteConfigListSchema,
}).superRefine((value, ctx) => {
  if (value.toolEnabled && !value.toolId.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["toolId"],
      message: "Choose a browser tool before enabling research context.",
    });
  }
});

export type AITextNodeData = {
  provider?: z.infer<typeof aiTextProviderSchema>;
  model?: string;
  prompt?: string;
  system?: string;
  credentialId?: string;
  credentialField?: string;
  toolEnabled?: boolean;
  toolProvider?: z.infer<typeof toolProviderSchema>;
  toolServerId?: string;
  toolId?: string;
  toolDisplayName?: string;
  toolArgumentsJson?: string;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};
