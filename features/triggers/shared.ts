import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";

export const triggerNodeSchema = z.object({
  maxIterations: z.coerce.number().int().min(1).max(25).default(1),
  memoryWrites: executionMemoryWriteConfigListSchema,
});

export type TriggerNodeData = {
  maxIterations?: number;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};
