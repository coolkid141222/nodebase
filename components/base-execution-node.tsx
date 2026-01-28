"use client"

import { type NodeProps, Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import { memo, type ReactNode } from "react"
import { BaseHandle } from "./react-flow/base-handle"
import { WorkflowNode } from "./workflow-components"

interface BaseExcutionProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    // status?: NodeStatus
    onSetting?: () => void;
    onDoubleClick?: () => void;
}

export const BaseExcutionNode = memo((props: BaseExcutionProps) => {
    const { icon: Icon, name, description, children, onSetting, onDoubleClick } = props;
    const handleDelect = () => {};
    return(
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelect}
            onSettings={onSetting}
        >
            <div onClick={onDoubleClick} className="w-full h-full flex items-center justify-center">
                {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} width={16} height={16}/>
                ): (
                    <Icon className="size-4 text-muted-foreground"/>
                )}
                {children}
                <BaseHandle
                    id="target-1"
                    type="target"
                    position={Position.Left}
                />
                <BaseHandle
                    id="source-1"
                    type="source"
                    position={Position.Right}
                />
            </div>
        </WorkflowNode>
    )
})

BaseExcutionNode.displayName = "BaseExcutionNode"