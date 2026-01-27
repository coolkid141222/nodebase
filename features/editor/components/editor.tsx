"use client"

import { useSuspenseWorkflow } from "@/features/workflows/hooks/user-workflows"
import { LoadingView, ErrorView } from "@/app/components/entity-compoents"
export const EditorLoading = () => {
    return (
        <LoadingView message="Loading editor..." />
    )
}

export const EditorError = () => {
    return (
        <ErrorView entity="editor" message="Failed to load editor." />
    )
}

export const Editor = ( { workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    return (
        <p>
            { JSON.stringify(workflow) }
        </p>
    )
}