import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";
import { toolProviderSchema } from "../shared";

export const toolNodeSchema = z.object({
  provider: toolProviderSchema.default("INTERNAL"),
  serverId: z.string().trim().default(""),
  serverDisplayName: z.string().trim().default(""),
  toolId: z.string().trim().default(""),
  toolDisplayName: z.string().trim().default(""),
  argumentsJson: z.string().default("{}"),
  memoryWrites: executionMemoryWriteConfigListSchema,
});

export type ToolNodeData = {
  provider?: z.infer<typeof toolProviderSchema>;
  serverId?: string;
  serverDisplayName?: string;
  toolId?: string;
  toolDisplayName?: string;
  argumentsJson?: string;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};

export function getToolProviderLabel(
  provider?: z.infer<typeof toolProviderSchema> | null,
) {
  switch (provider) {
    case "MCP":
      return "MCP";
    case "OPENCLAW":
      return "OpenClaw";
    case "INTERNAL":
    default:
      return "Internal";
  }
}
