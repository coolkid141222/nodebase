import z from "zod";

export const aiTextProviderSchema = z.enum([
  "GOOGLE",
  "OPENAI",
  "ANTHROPIC",
]);

export const aiTextDefaultModels = {
  GOOGLE: "gemini-2.5-flash",
  OPENAI: "gpt-4o-mini",
  ANTHROPIC: "claude-3-5-haiku-latest",
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
});

export type AITextNodeData = {
  provider?: z.infer<typeof aiTextProviderSchema>;
  model?: string;
  prompt?: string;
  system?: string;
  credentialId?: string;
  credentialField?: string;
};
