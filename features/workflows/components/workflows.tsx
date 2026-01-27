"use client"
import { ReactNode } from "react";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/user-workflows"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/app/components/entity-compoents";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue: localSearch, setSearchValue } = useEntitySearch({
        params,
        setParams,
    });

    return (
        <EntitySearch
            value={localSearch ?? ''}
            onChange={setSearchValue}
            placeholder="Search workflows"
        />
    )
}

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

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();
    return (
        <EntityPagination 
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
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
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}