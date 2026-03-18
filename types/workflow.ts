/**
 * Workflow node types
 * Re-exports Prisma enum to maintain type consistency
 */

// Re-export Prisma's NodeType
export type { NodeType } from "@/lib/prisma/client"

// Convenience export for easier imports
export { NodeType as NodeTypeEnum } from "@/lib/prisma/client"
