"use client";

import { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import { KeyIcon } from "lucide-react";
import type { Credential } from "@/lib/prisma/client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  ErrorView,
  LoadingView,
} from "@/app/components/entity-compoents";
import {
  useDeleteCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { Badge } from "@/components/badge";

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Manage API keys and integration secrets for your workflow nodes"
      newButtonHref="/credentials/new"
      newButtonLabel="New Credential"
      disabled={disabled}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <EntityContainer header={<CredentialsHeader />}>
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Failed to load credentials." />;
};

export const CredentialsEmpty = () => {
  return <EmptyView />;
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useDeleteCredential();

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <span className="inline-flex items-center gap-2">
          <Badge variant="outline">{data.provider}</Badge>
          <span>
            Updated{" "}
            {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}
          </span>
        </span>
      }
      image={
        <div className="flex size-8 items-center justify-center">
          <KeyIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={() => removeCredential.mutate({ id: data.id })}
      isRemoving={removeCredential.isPending}
    />
  );
};
