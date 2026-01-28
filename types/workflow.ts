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
  MANUAL_TRIGGER = 'MANUAL_TRIGGER',
  HTTP_REQUEST = 'HTTP_REQUEST'
}

export type { NodeType as NodeTypeEnum }
