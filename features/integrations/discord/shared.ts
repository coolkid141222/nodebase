import z from "zod";

export const discordMessageNodeSchema = z.object({
  credentialId: z.string().trim().min(1),
  credentialField: z.string().trim().min(1).default("webhookUrl"),
  content: z.string().trim().min(1),
});

export type DiscordMessageNodeData = {
  credentialId?: string;
  credentialField?: string;
  content?: string;
};
