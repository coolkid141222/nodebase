"use client";
import { Button } from "@/components/button";
import { SidebarTrigger } from "@/components/sidebar";
import { SaveIcon, SparklesIcon, DatabaseIcon } from "lucide-react";
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
import { PersistentMemoryDialog } from "@/features/executions/components/persistent-memory-dialog";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import {
    WorkflowGeneratorDialog,
    type WorkflowDraftPreview,
} from "@/features/ai/components/workflow-generator-dialog";
import { toast } from "sonner";
import { useI18n } from "@/features/i18n/provider";

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
    const { t } = useI18n();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows">{t("editor.breadcrumb.workflows")}</Link>
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
    const editor = useAtomValue(editorAtom);
    const [generatorOpen, setGeneratorOpen] = useState(false);
    const { t } = useI18n();

    const handleApplyGeneratedDraft = (draft: WorkflowDraftPreview) => {
        if (!editor) {
            toast.error(t("editor.editorNotReady"));
            return;
        }

        editor.setNodes(draft.nodes);
        editor.setEdges(draft.edges);
        setGeneratorOpen(false);
        requestAnimationFrame(() => {
            editor.fitView({
                duration: 300,
                padding: 0.18,
            });
        });
        toast.success(t("editor.appliedDraft", { title: draft.title }));
    };

    return (
        <>
        <WorkflowGeneratorDialog
            open={generatorOpen}
            onOpenChange={setGeneratorOpen}
            onApply={handleApplyGeneratedDraft}
            editorReady={Boolean(editor)}
        />
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setGeneratorOpen(true)}
                    >
                        <SparklesIcon />
                        {t("editor.generateWithAi")}
                    </Button>
                    <PersistentMemoryDialog workflowId={workflowId}>
                        <Button size="sm" variant="outline">
                            <DatabaseIcon className="mr-2 size-4" />
                            {t("persistentMemory.button") || "Memory"}
                        </Button>
                    </PersistentMemoryDialog>
                    <Button
                        size="sm"
                        onClick={() => void workflowExecution.saveWorkflow()}
                        disabled={workflowExecution.isPending || !workflowExecution.editorReady}
                    >
                        <SaveIcon />
                        {t("common.save")}
                    </Button>
                </div>
            </div>
        </header>
        </>
    )
}
