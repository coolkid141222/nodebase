import z from "zod";
import {
  executionMemoryWriteConfigListSchema,
  type ExecutionMemoryWriteConfig,
} from "@/features/executions/memory/shared";

export const triggerNodeSchema = z.object({
  memoryWrites: executionMemoryWriteConfigListSchema,
});

export type TriggerNodeData = {
  memoryWrites?: ExecutionMemoryWriteConfig[];
};
