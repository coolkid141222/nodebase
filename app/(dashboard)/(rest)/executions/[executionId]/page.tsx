import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView } from "@/app/components/entity-compoents";
import { ExecutionDetails } from "@/features/executions/components/execution-details";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
    params: Promise<{
        executionId: string;
    }>
}

const Page = async ({ params }: PageProps) => {
    const { executionId } = await params;
    await requireAuth();
    prefetchExecution(executionId);

    return (
        <HydrateClient>
            <ErrorBoundary
                fallback={
                    <ErrorView entity="execution" message="Failed to load execution." />
                }
            >
                <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading execution...</p>}>
                    <div className="p-4 md:px-10 md:py-6">
                        <ExecutionDetails id={executionId} />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}

export default Page;
