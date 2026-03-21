import z from "zod";

export const executionMemoryScopeSchema = z.enum(["SHARED", "NODE"]);
export const executionMemoryVisibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);
export const executionMemoryWriteModeSchema = z.enum([
  "REPLACE",
  "MERGE",
  "APPEND",
]);
export const persistentMemoryScopeSchema = z.enum(["WORKFLOW", "USER"]);

export const executionMemoryWriteConfigSchema = z.object({
  scope: executionMemoryScopeSchema.default("SHARED"),
  namespace: z.string().trim().min(1),
  key: z.string().trim().min(1),
  value: z.string().trim().min(1),
  mode: executionMemoryWriteModeSchema.default("REPLACE"),
  visibility: executionMemoryVisibilitySchema.default("PUBLIC"),
  persist: z.boolean().default(false),
  persistenceScope: persistentMemoryScopeSchema.default("WORKFLOW"),
  semanticIndex: z.boolean().default(false),
});

export const executionMemoryWriteConfigListSchema = z
  .array(executionMemoryWriteConfigSchema)
  .max(8)
  .default([]);

export type ExecutionMemoryWriteConfig = z.infer<
  typeof executionMemoryWriteConfigSchema
>;

export function createDefaultExecutionMemoryWriteConfig(): ExecutionMemoryWriteConfig {
  return {
    scope: "SHARED",
    namespace: "results",
    key: "",
    value: "{{current.output}}",
    mode: "REPLACE",
    visibility: "PUBLIC",
    persist: false,
    persistenceScope: "WORKFLOW",
    semanticIndex: false,
  };
}
