import { z } from "zod";

export const toolProviderSchema = z.enum(["INTERNAL", "MCP", "OPENCLAW"]);
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

export const toolRegistrySnapshotSchema = z.object({
  providers: z.array(toolProviderSummarySchema),
  tools: z.array(registeredToolSchema),
});
export type ToolRegistrySnapshot = z.infer<typeof toolRegistrySnapshotSchema>;
