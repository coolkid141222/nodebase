"use client"

import type { NodeProps } from "@xyflow/react"
import { PlusIcon } from "lucide-react"
import { memo } from "react"
import { PlaceholderNode } from "./placeholder-node"
import { WorkflowNode } from "../workflow-components"

export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode name="Initial Node" description="hello">
            <PlaceholderNode
                {...props}
                handleClick={() => {}}
                >
                <div className="cursor-pointer flex items-center justify-center size-4">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
})

InitialNode.displayName = "InitialNode"