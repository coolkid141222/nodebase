import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView } from "@/app/components/entity-compoents";
import {
  ExecutionsContainer,
  ExecutionsList,
  ExecutionsLoading,
} from "@/features/executions/components/executions";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  await requireAuth();
  prefetchExecutions();

  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary
          fallback={
            <ErrorView entity="executions" message="Failed to load executions." />
          }
        >
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer>
  );
};

export default Page;
