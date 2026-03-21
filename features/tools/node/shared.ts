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
    case "FEISHU":
      return "Feishu";
    case "INTERNAL":
    default:
      return "Internal";
  }
}

export function getToolArgumentsPlaceholder(toolId?: string | null) {
  switch (toolId) {
    case "internal.browser_page":
      return `{
  "url": "https://example.com",
  "maxChars": 4000,
  "includeLinks": true
}`;
    case "internal.http_request":
      return `{
  "url": "https://api.example.com/data",
  "method": "GET",
  "body": null
}`;
    case "internal.memory_read":
      return `{
  "scope": "SHARED",
  "namespace": "results",
  "key": "summary"
}`;
    case "internal.memory_write":
      return `{
  "scope": "SHARED",
  "namespace": "results",
  "key": "summary",
  "value": "{{input}}"
}`;
    default:
      return `{"query":"{{input}}"}`;
  }
}
