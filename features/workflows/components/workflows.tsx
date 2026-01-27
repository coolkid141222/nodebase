"use client"
import { ReactNode } from "react";
import { useCreateWorkflow, useSuspenseWorkflows, useDeleteWorkflow } from "../hooks/user-workflows"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch, LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/app/components/entity-compoents";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import type { Workflow } from "@/lib/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns"

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
        <EntityList 
            items={workflows.data.item}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowsItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
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
                toast.error(`Failed to create workflow: ${error.message}`);
                Sentry.captureException(error);
            }
        })
    }
    return (
        <>
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New Workflows"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
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

export const WorkflowsLoading = () => {
    return (
        <LoadingView message="Loading workflows.." />
    )
}

export const WorkflowsError = () => {
    return (
        <ErrorView message="Loading workflows Error" />
    )
}

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
               toast.error(`Failed to create workflow: ${error.message}`);
               Sentry.captureException(error);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            }
        });
    }
    return (
        <>
             <EmptyView
                onNew={handleCreate}
                isPending={createWorkflow.isPending}
             />
        </>
    )
}

export const WorkflowsItem = ({
    data,
}: {
    data: Workflow;
}) => {
    const deleteWorkflow = useDeleteWorkflow();

    const handleRemove = () => {
        deleteWorkflow.mutate({ id: data.id });
    };

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    updated {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={deleteWorkflow.isPending}
        />
    )
}