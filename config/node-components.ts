import { NodeType } from "@/types/workflow"
import { NodeTypes } from "@xyflow/react"
import { InitialNode } from "@/components/react-flow/initial-node"

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    // [NodeType.GEMINI]: GeminiNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents