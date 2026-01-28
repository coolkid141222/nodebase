"use client"

import { type NodeProps, Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import { memo, type ReactNode } from "react"
import { BaseHandle } from "@/components/react-flow/base-handle"
import { WorkflowNode } from "@/components/workflow-components"

interface BaseTriggerProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    // status?: NodeStatus
    onSetting?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo((props: BaseTriggerProps) => {
    const { icon: Icon, name, description, children, onSetting, onDoubleClick } = props;
    const handleDelect = () => {};
    return(
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelect}
            onSettings={onSetting}
            nodeClassName="rounded-l-2xl"
        >
            <div onClick={onDoubleClick} className="w-full h-full flex items-center justify-center">
                {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} width={16} height={16}/>
                ): (
                    <Icon className="size-4 text-muted-foreground"/>
                )}
                {children}
                <BaseHandle
                    id="source-1"
                    type="source"
                    position={Position.Right}
                />
            </div>
        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = "BaseTriggerNode"