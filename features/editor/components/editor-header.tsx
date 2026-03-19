"use client";
import { Button } from "@/components/button";
import { SidebarTrigger } from "@/components/sidebar";
import { PlayIcon, SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/breadcrumb"
import { Input } from "@/components/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link"
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/user-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import { useManualWorkflowExecution } from "@/features/executions/hooks/use-manual-workflow-execution";
import type { ReactFlowInstance } from "@xyflow/react";

const snapshotWorkflow = (editor: ReactFlowInstance | null) => {
    if (!editor) {
        return null;
    }

    return {
        nodes: editor.getNodes(),
        edges: editor.getEdges(),
    };
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const updateWorkflowName = useUpdateWorkflowName();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name);
    const previousWorkflowName = useRef(workflow.name);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (previousWorkflowName.current === workflow.name) {
            return;
        }

        previousWorkflowName.current = workflow.name;
        setName(workflow.name);
    }, [workflow.name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);
    const handleSave = async () => {
        if (name === workflow.name) {
            setIsEditing(true);
            return;
        }
        
        setIsEditing(false);

        try {
            await updateWorkflowName.mutateAsync({ id: workflowId, name });
        } catch {
            setName(workflow.name);
        } finally {
            setIsEditing(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setName(workflow.name);
            setIsEditing(false);
        }
    }

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                disabled={updateWorkflowName.isPending}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-7 w-auto min-w-[100px] px-2"
            />
        )
    }

    return (
        <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {workflow?.name}
         </BreadcrumbItem>
    )
}

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows">Workflows</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const updateWorkflow = useUpdateWorkflow();
    const manualExecution = useManualWorkflowExecution();

    const saveWorkflow = async () => {
        const snapshot = snapshotWorkflow(editor);

        if (!snapshot) {
            return false;
        }

        try {
            await updateWorkflow.mutateAsync({
                id: workflowId,
                ...snapshot,
            });
            return true;
        } catch {
            return false;
        }
    };

    const handleRun = async () => {
        const saved = await saveWorkflow();

        if (!saved) {
            return;
        }

        try {
            await manualExecution.mutateAsync({ workflowId });
        } catch {
            // toast handled by the mutation hook
        }
    };

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <div className="flex items-center gap-2">
                    <div className="ml-auto">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => void handleRun()}
                            disabled={manualExecution.isPending || updateWorkflow.isPending || !editor}
                        >
                            <PlayIcon className="size-4" />
                            {manualExecution.isPending
                                ? "Running"
                                : updateWorkflow.isPending
                                  ? "Saving..."
                                  : "Execute workflow"}
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => void saveWorkflow()}
                        disabled={updateWorkflow.isPending || !editor}
                    >
                        <SaveIcon />
                        Save
                    </Button>
                </div>
            </div>
        </header>
    )
}
