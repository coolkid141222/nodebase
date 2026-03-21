import { toast } from 'sonner';
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useWorkflowsParams } from './use-workflows-params';
import * as Sentry from "@sentry/nextjs";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow ${data.name} created`)
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                )
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`)
                Sentry.captureException(error);
            }
        })
    )
}

export const useDeleteWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: () => {
                toast.success("Workflow deleted")
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                )
            },
            onError: (error) => {
                toast.error(`Failed to delete workflow: ${error.message}`)
                Sentry.captureException(error);
            }
        })
    )
}

export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(
        trpc.workflows.getOne.queryOptions({ id })
    )
}

export const usePrefetchWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return (id: string) => {
        void queryClient.prefetchQuery(
            trpc.workflows.getOne.queryOptions({ id }),
        );
        void queryClient.prefetchQuery(
            trpc.executions.getLatestForWorkflow.queryOptions({ workflowId: id }),
        );
    };
}

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow ${data.name} updated`)
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                )
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({ id: data.id }),
                )
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`)
                Sentry.captureException(error);
            }
        })
    )
}

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(
        trpc.workflows.update.mutationOptions({
            onSuccess: (data) => {
                if (!data) {
                    toast.error(`Failed to save workflow`)
                    return
                }
                toast.success(`Workflow ${data.name} Saved`)
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                )
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({ id: data.id }),
                )
            },
            onError: (error) => {
                toast.error(`Failed to save workflow: ${error.message}`)
                Sentry.captureException(error);
            }
        })
    )
}
