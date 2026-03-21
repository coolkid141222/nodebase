"use client"
import { ReactNode } from "react";
import { useCreateWorkflow, useSuspenseWorkflows, useDeleteWorkflow, usePrefetchWorkflow } from "../hooks/user-workflows"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch, LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/app/components/entity-compoents";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import type { Workflow } from "@/lib/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns"
import { useI18n } from "@/features/i18n/provider";

export const WorkflowsSearch = () => {
    const { t } = useI18n();
    const [params, setParams] = useWorkflowsParams();
    const { searchValue: localSearch, setSearchValue } = useEntitySearch({
        params,
        setParams,
    });

    return (
        <EntitySearch
            value={localSearch ?? ''}
            onChange={setSearchValue}
            placeholder={t("workflows.search")}
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
    const { t } = useI18n();
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                toast.error(t("workflows.createFailed", { message: error.message }));
                Sentry.captureException(error);
            }
        })
    }
    return (
        <>
            <EntityHeader
                title={t("workflows.title")}
                description={t("workflows.description")}
                onNew={handleCreate}
                newButtonLabel={t("workflows.new")}
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
    const { t } = useI18n();
    return (
        <LoadingView message={t("workflows.loading")} />
    )
}

export const WorkflowsError = () => {
    const { t } = useI18n();
    return (
        <ErrorView message={t("workflows.error")} />
    )
}

export const WorkflowsEmpty = () => {
    const { t } = useI18n();
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
               toast.error(t("workflows.createFailed", { message: error.message }));
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
    const { t, dateLocale } = useI18n();
    const deleteWorkflow = useDeleteWorkflow();
    const prefetchWorkflow = usePrefetchWorkflow();

    const handleRemove = () => {
        deleteWorkflow.mutate({ id: data.id });
    };

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    {t("common.updatedAgo", {
                        value: formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true, locale: dateLocale }),
                    })}{" "}
                    &bull;{" "}
                    {t("common.createdAgo", {
                        value: formatDistanceToNow(new Date(data.createdAt), { addSuffix: true, locale: dateLocale }),
                    })}
                </>
            }
            image={
                <div className="size-8 flex flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onPrefetch={() => prefetchWorkflow(data.id)}
            onRemove={handleRemove}
            isRemoving={deleteWorkflow.isPending}
        />
    )
}
