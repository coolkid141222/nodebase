import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";

export const loopNodeSchema = z.object({
  maxIterations: z.coerce.number().int().min(1).max(25).default(3),
  memoryWrites: executionMemoryWriteConfigListSchema,
});

export type LoopNodeData = {
  maxIterations?: number;
  memoryWrites?: ExecutionMemoryWriteConfig[];
};
