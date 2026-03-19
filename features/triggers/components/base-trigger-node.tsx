"use client"

import { type NodeProps, Position, useReactFlow } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import { memo, type ReactNode } from "react"
import { BaseHandle } from "@/components/react-flow/base-handle"
import { BaseNode } from "@/components/react-flow/base-node"
import { NodeStatusIndicator, type NodeStatus } from "@/components/react-flow/node-status-indicator"
import { NodeToolbar } from "@xyflow/react"
import { SettingsIcon, TrashIcon, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/button"

interface BaseTriggerProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    status?: NodeStatus;
    onSetting?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo((props: BaseTriggerProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const { icon: Icon, name, description, children, onSetting, onDoubleClick, id, status } = props;

    const getStatusColor = (status?: NodeStatus) => {
        switch (status) {
            case "loading":
                return "bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.16)]";
            case "success":
                return "bg-emerald-600 text-white shadow-[0_0_0_4px_rgba(5,150,105,0.16)]";
            case "error":
                return "bg-red-600 text-white shadow-[0_0_0_4px_rgba(220,38,38,0.16)]";
            default:
                return "bg-gray-400 text-white";
        }
    };

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
        <>
            {/* Toolbar */}
            <NodeToolbar>
                <Button size="sm" variant="ghost" onClick={() => onSetting?.()}>
                    <SettingsIcon className="size-4"/>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete()}>
                    <TrashIcon className="size-4"/>
                </Button>
            </NodeToolbar>

            {/* Node with Status Indicator - wrapped to limit absolute positioning */}
            <div className="flex flex-col items-center">
                <div className="relative inline-block">
                    <NodeStatusIndicator status={status} variant="border" className="rounded-l-2xl">
                        <BaseNode
                            className={`relative block mx-auto size-[56px] rounded-l-2xl ${
                                status ? "border-transparent" : ""
                            }`}
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
                        </BaseNode>
                    </NodeStatusIndicator>

                    {/* Status Badge */}
                    {status && (
                        <div className={`absolute bottom-0 right-0 size-5 rounded-full border-2 border-background flex items-center justify-center ${getStatusColor(status)}`}>
                            {status === "loading" && (
                                <Loader2 className="size-3 text-white animate-spin" strokeWidth={3} />
                            )}
                            {status === "success" && (
                                <Check className="size-3 text-white" strokeWidth={3} />
                            )}
                            {status === "error" && (
                                <X className="size-3 text-white" strokeWidth={3} />
                            )}
                        </div>
                    )}
                </div>

                {/* Name */}
                {name && (
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 text-center">
                        {name}
                    </h3>
                )}

                {/* Description */}
                {description && (
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 text-center">
                        {description}
                    </p>
                )}
            </div>

        </>
    )
})

BaseTriggerNode.displayName = "BaseTriggerNode"
