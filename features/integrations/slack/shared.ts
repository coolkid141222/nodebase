import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";

export const slackMessageNodeSchema = z.object({
  credentialId: z.string().trim().min(1),
  credentialField: z.string().trim().min(1).default("webhookUrl"),
  content: z.string().trim().min(1),
  memoryWrites: executionMemoryWriteConfigListSchema,
});

export type SlackMessageNodeData = {
  credentialId?: string;
  credentialField?: string;
  content?: string;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};
