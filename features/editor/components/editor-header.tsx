"use client";
import { Button } from "@/components/button";
import { SidebarTrigger } from "@/components/sidebar";
import { SaveIcon } from "lucide-react";
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
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/user-workflows";
import { useExecuteWorkflow } from "@/features/executions/hooks/use-execute-workflow";

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
    const workflowExecution = useExecuteWorkflow(workflowId);

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => void workflowExecution.saveWorkflow()}
                        disabled={workflowExecution.isPending || !workflowExecution.editorReady}
                    >
                        <SaveIcon />
                        Save
                    </Button>
                </div>
            </div>
        </header>
    )
}
