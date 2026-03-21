import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";

export const httpRequestMethodSchema = z.enum([
  "GET",
  "POST",
  "PATCH",
  "DELETE",
]);

export const httpRequestAuthTypeSchema = z.enum([
  "NONE",
  "BEARER",
  "HEADER",
]);

export type HttpRequestMethod = z.infer<typeof httpRequestMethodSchema>;
export type HttpRequestAuthType = z.infer<typeof httpRequestAuthTypeSchema>;

export type HttpRequestCredentialConfig = {
  credentialId: string;
  authType: Exclude<HttpRequestAuthType, "NONE">;
  field: string;
  headerName?: string;
};

export type HttpRequestNodeData = {
  endpoint?: string;
  method?: HttpRequestMethod;
  body?: string;
  credentialId?: string;
  credentialField?: string;
  authType?: HttpRequestAuthType;
  headerName?: string;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};

export const httpRequestNodeSchema = z.object({
  endpoint: z.url(),
  method: httpRequestMethodSchema,
  body: z.string().optional(),
  credentialId: z.string().optional(),
  authType: httpRequestAuthTypeSchema.default("NONE"),
  credentialField: z.string().optional(),
  headerName: z.string().optional(),
  memoryWrites: executionMemoryWriteConfigListSchema,
});
