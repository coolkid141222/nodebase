"use client"
import { ReactNode } from "react";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/user-workflows"
import { EntityContainer, EntityHeader } from "@/app/components/entity-compoents";
import { useRouter } from "next/navigation";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <p>
            {JSON.stringify(workflows.data, null, 2)}
        </p>
    )
}

export const WorkflowsHearder = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
    return (
        <>
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="new Workflows"
                disabled={disabled}
                isCreating={false}
            />
        </>
    )
}

export const WorkflowsContainer = ({
    children
}: {
    children: ReactNode
}) => {
    return (
        <EntityContainer
            header={<WorkflowsHearder />}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}