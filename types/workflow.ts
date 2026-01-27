/**
 * Workflow node types
 * This file is separate from Prisma to avoid importing Prisma in client components
 */
export enum NodeType {
  INITIAL = "INITIAL",
  TRIGGER = "TRIGGER",
  ACTION = "ACTION",
  CONDITION = "CONDITION",
  GEMINI = "GEMINI",
  
}

export type { NodeType as NodeTypeEnum }
