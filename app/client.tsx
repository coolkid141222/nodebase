"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export const Client = () => {
    const trpc = useTRPC();
    const testAI = useMutation(trpc.testAI.mutationOptions());
    const queryClient = useQueryClient();
    const { data: workflows } = useSuspenseQuery(trpc.getWorkflows.queryOptions());
    const [isSigningOut, setIsSigningOut] = useState(false);

    const createWorkflow = useMutation({
        ...trpc.createWorkflow.mutationOptions({
            onMutate: () => {
                console.log("Frontend: mutation called at:", new Date().toISOString());
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: trpc.getWorkflows.queryOptions().queryKey });
                toast.success("Job queued");
            },
        }),
    });

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await authClient.signOut();
        toast.success("Logged out successfully");
        window.location.replace("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <button
                type="button"
                onClick={() => createWorkflow.mutate()}
                disabled={createWorkflow.isPending}
                className="mb-4 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
                {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
            </button>
            <div className="flex flex-col justify-center items-center">
                This client: {JSON.stringify(workflows)}
            </div>
            <button onClick={() => testAI}>
                AI
            </button>
            <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-60"
            >
                {isSigningOut ? "Logging out..." : "Log Out!"}
            </button>
            <Toaster />
        </div>
    )
}