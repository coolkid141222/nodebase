import { NodeToolbar } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react"
import { Button } from "./button"
import { ReactNode } from "react";
import { BaseNode } from "./react-flow/base-node";

interface workflowNodeProps {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
}

export function WorkflowNode({
    children,
    showToolbar = true,
    onDelete,
    onSettings,
    name,
    description,
}: workflowNodeProps) {
    return (
        <>
            {/* Toolbar */}
            {showToolbar && (
                <NodeToolbar>
                    <Button size="sm" variant="ghost" onClick={onSettings}>
                        <SettingsIcon className="size-4"/>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onDelete}>
                        <TrashIcon className="size-4"/>
                    </Button>
                </NodeToolbar>
            )}
            <BaseNode className="relative top-1/2 left-1/2 -translate-x-1/2 size-[56px]">
                {/* Node Content */}
                <div className="w-full h-full border-dashed border-gray-50 absolute">
                    {/* Children content */}
                    {children}
                </div>
            </BaseNode>
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