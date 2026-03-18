import z from "zod";

export const aiTextProviderSchema = z.enum(["GOOGLE"]);

export const aiTextModelSchema = z.enum([
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
]);

export const aiTextNodeSchema = z.object({
  provider: aiTextProviderSchema.default("GOOGLE"),
  model: aiTextModelSchema.default("gemini-2.5-flash"),
  prompt: z.string().min(1),
  system: z.string().optional(),
  credentialId: z.string().min(1),
  credentialField: z.string().min(1),
});

export type AITextNodeData = {
  provider?: z.infer<typeof aiTextProviderSchema>;
  model?: z.infer<typeof aiTextModelSchema>;
  prompt?: string;
  system?: string;
  credentialId?: string;
  credentialField?: string;
};
