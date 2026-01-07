"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: workflows } = useSuspenseQuery(trpc.getWorkflows.queryOptions());
    const createWorkflow = useMutation({
        ...trpc.createWorkflow.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: trpc.getWorkflows.queryOptions().queryKey });
            },
        }),
    });

    return (
        <>
            <button
                type="button"
                onClick={() => createWorkflow.mutate({ name: "New Workflow" })}
                disabled={createWorkflow.isPending}
                className="mb-4 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
                {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
            </button>
            <div className="flex flex-col justify-center items-center">
                This client: {JSON.stringify(workflows)}
            </div>
        </>
    )
}