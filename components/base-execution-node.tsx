"use client"

import { type NodeProps, Position, useReactFlow } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import { memo, type ReactNode } from "react"
import { BaseHandle } from "./react-flow/base-handle"
import { WorkflowNode } from "./workflow-components"
import { NodeStatus } from "./react-flow/node-status-indicator"
interface BaseExcutionProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    status?: NodeStatus
    onSetting?: () => void;
    onDoubleClick?: () => void;
}

export const BaseExcutionNode = memo((props: BaseExcutionProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const { icon: Icon, name, description, children, onSetting, onDoubleClick, id, status } = props;
    const handleDelete = () => {
        setNodes((currentNodes) => {
            const updatedNodes = currentNodes.filter((node) => node.id !== id)
            return updatedNodes;
        })

        setEdges((currentEdges) => {
            const updatedEdges = currentEdges.filter(
                (edge) => edge.source !== id && edge.target !== id,
            )
            return updatedEdges
        })
    };
    return(
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSettings={onSetting}
            status={status}
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
