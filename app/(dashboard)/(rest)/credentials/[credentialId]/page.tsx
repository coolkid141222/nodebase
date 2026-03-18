import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView, LoadingView } from "@/app/components/entity-compoents";
import {
  EditCredentialForm,
  NewCredentialForm,
} from "@/features/credentials/components/credential-form";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialId } = await params;

  if (credentialId === "new") {
    return <NewCredentialForm />;
  }

  prefetchCredential(credentialId);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorView entity="credential" message="Failed to load credential." />
        }
      >
        <Suspense fallback={<LoadingView message="Loading credential..." />}>
          <EditCredentialForm id={credentialId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
