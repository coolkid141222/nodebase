"use client";
import { Button } from "@/components/button";
import { SidebarTrigger } from "@/components/sidebar";
import { SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb"
import { Input } from "@/components/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link"
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/user-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const updateWorkflow = useUpdateWorkflow();
    const handleSave = () => {
        if (!editor) {
            return;
        }

        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        updateWorkflow.mutate({
            id: workflowId,
            nodes,
            edges
        })
    }

    return (
        <div className="ml-auto">
            <Button size="sm" onClick={handleSave} disabled={updateWorkflow.isPending || !editor}>
                <SaveIcon />Save
            </Button>
        </div>
    )
}

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const updateWorkflowName = useUpdateWorkflowName();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (workflow.name !== name) {
            setName(workflow.name);
        }
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
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}