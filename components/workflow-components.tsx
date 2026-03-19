import { NodeToolbar } from "@xyflow/react";
import { SettingsIcon, TrashIcon, Check, X, Loader2 } from "lucide-react"
import { Button } from "./button"
import { ReactNode } from "react";
import { BaseNode } from "./react-flow/base-node";
import { NodeStatusIndicator, type NodeStatus } from "./react-flow/node-status-indicator";
interface workflowNodeProps {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
    nodeClassName?: string;
    status?: NodeStatus;
}

export function WorkflowNode({
    children,
    showToolbar = true,
    onDelete,
    onSettings,
    name,
    description,
    nodeClassName,
    status,
}: workflowNodeProps) {
    const getStatusColor = (status?: NodeStatus) => {
        switch (status) {
            case "loading":
                return "bg-blue-500 animate-pulse";
            case "success":
                return "bg-emerald-500";
            case "error":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <>
            {/* Toolbar */}
            {showToolbar && (
                <NodeToolbar>
                    <Button size="sm" variant="ghost" onClick={() => onSettings?.()}>
                        <SettingsIcon className="size-4"/>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete?.()}>
                        <TrashIcon className="size-4"/>
                    </Button>
                </NodeToolbar>
            )}
            <div className="flex flex-col items-center">
                <div className="relative inline-block">
                    <NodeStatusIndicator status={status} variant="border">
                        <BaseNode className={`relative block mx-auto size-[56px] ${nodeClassName || ''}`}>
                            {/* Node Content */}
                            {children}
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
            </div>
            {/* Name */}
            {name && (
                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 flex justify-center">
                    {name}
                </h3>
            )}

            {/* Description */}
            {description && (
                <p className="text-[10px] text-gray-600 dark:text-gray-400 flex justify-center">
                    {description}
                </p>
            )}
        </>
    )
}
