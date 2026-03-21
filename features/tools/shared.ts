import { z } from "zod";

export const toolProviderSchema = z.enum(["INTERNAL", "MCP", "OPENCLAW", "FEISHU"]);
export type ToolProvider = z.infer<typeof toolProviderSchema>;

export const toolTransportSchema = z.enum(["NONE", "STDIO", "HTTP", "SSE"]);
export type ToolTransport = z.infer<typeof toolTransportSchema>;

export const toolLifecycleSchema = z.enum([
  "READY",
  "DISCOVERY",
  "ADAPTER_REQUIRED",
]);
export type ToolLifecycle = z.infer<typeof toolLifecycleSchema>;

export const toolCapabilitySchema = z.enum([
  "MEMORY_READ",
  "MEMORY_WRITE",
  "HTTP",
  "MESSAGING",
  "FILESYSTEM",
  "BROWSER",
  "LLM",
]);
export type ToolCapability = z.infer<typeof toolCapabilitySchema>;

export const toolParameterTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "object",
  "array",
]);
export type ToolParameterType = z.infer<typeof toolParameterTypeSchema>;

export const toolParameterSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  type: toolParameterTypeSchema,
  required: z.boolean().default(false),
});
export type ToolParameter = z.infer<typeof toolParameterSchema>;

export const registeredToolSchema = z.object({
  id: z.string().min(1),
  provider: toolProviderSchema,
  displayName: z.string().min(1),
  description: z.string().min(1),
  transport: toolTransportSchema,
  lifecycle: toolLifecycleSchema,
  dangerous: z.boolean().default(false),
  requiresApproval: z.boolean().default(false),
  capabilities: z.array(toolCapabilitySchema).default([]),
  parameters: z.array(toolParameterSchema).default([]),
  tags: z.array(z.string().min(1)).default([]),
});
export type RegisteredTool = z.infer<typeof registeredToolSchema>;

export const toolProviderSummarySchema = z.object({
  id: toolProviderSchema,
  label: z.string().min(1),
  description: z.string().min(1),
  lifecycle: toolLifecycleSchema,
  transport: z.array(toolTransportSchema).default([]),
});
export type ToolProviderSummary = z.infer<typeof toolProviderSummarySchema>;

export const mcpServerConfigSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().min(1).default("MCP server"),
  transport: z.enum(["STDIO", "HTTP", "SSE"]),
  enabled: z.boolean().default(true),
  toolPrefix: z.string().min(1).optional(),
  command: z.string().min(1).optional(),
  args: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  urlEnv: z.string().min(1).optional(),
  headersEnv: z.array(z.string().min(1)).default([]),
  workingDirectory: z.string().min(1).optional(),
});
export type MCPServerConfig = z.infer<typeof mcpServerConfigSchema>;

export const mcpServerSummarySchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().min(1),
  transport: z.enum(["STDIO", "HTTP", "SSE"]),
  enabled: z.boolean().default(true),
  lifecycle: toolLifecycleSchema,
  statusMessage: z.string().min(1),
  toolPrefix: z.string().min(1),
  command: z.string().min(1).optional(),
  args: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  urlEnv: z.string().min(1).optional(),
  headersEnv: z.array(z.string().min(1)).default([]),
  workingDirectory: z.string().min(1).optional(),
});
export type MCPServerSummary = z.infer<typeof mcpServerSummarySchema>;

export const toolRegistrySnapshotSchema = z.object({
  providers: z.array(toolProviderSummarySchema),
  tools: z.array(registeredToolSchema),
  mcpServers: z.array(mcpServerSummarySchema).default([]),
});
export type ToolRegistrySnapshot = z.infer<typeof toolRegistrySnapshotSchema>;
