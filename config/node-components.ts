import { NodeTypes } from "@xyflow/react"
import { InitialNode } from "@/components/react-flow/initial-node"
import { HttpRequestNode } from "@/features/executions/components/http-request/node"
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger-node"
import { AITextNode } from "@/features/ai/components/text/node"

export const nodeComponents = {
    "INITIAL": InitialNode,
    "HTTP_REQUEST": HttpRequestNode,
    "MANUAL_TRIGGER": ManualTriggerNode,
    "AI_TEXT": AITextNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents
