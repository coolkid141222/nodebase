import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView } from "@/app/components/entity-compoents";
import {
  CredentialsContainer,
  CredentialsList,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  await requireAuth();
  prefetchCredentials();

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary
          fallback={
            <ErrorView entity="credentials" message="Failed to load credentials." />
          }
        >
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};

export default Page;
