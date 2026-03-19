import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView } from "@/app/components/entity-compoents";
import {
  BillingLoading,
  BillingPortalView,
} from "@/features/billing/components/billing-portal";
import { prefetchBillingState } from "@/features/billing/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  await requireAuth();
  prefetchBillingState();

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<ErrorView entity="billing" message="Failed to load billing." />}
      >
        <Suspense fallback={<BillingLoading />}>
          <BillingPortalView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
