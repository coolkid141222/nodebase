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
import { useI18n } from "@/features/i18n/provider";

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  const { t } = useI18n();
  return (
    <EntityHeader
      title={t("credentials.title")}
      description={t("credentials.description")}
      newButtonHref="/credentials/new"
      newButtonLabel={t("credentials.new")}
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
  const { t } = useI18n();
  return <LoadingView message={t("credentials.loading")} />;
};

export const CredentialsError = () => {
  const { t } = useI18n();
  return <ErrorView message={t("credentials.error")} />;
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
  const { t, dateLocale } = useI18n();
  const removeCredential = useDeleteCredential();

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <span className="inline-flex items-center gap-2">
          <Badge variant="outline">{data.provider}</Badge>
          <span>
            {t("common.updatedAgo", {
              value: formatDistanceToNow(new Date(data.updatedAt), {
                addSuffix: true,
                locale: dateLocale,
              }),
            })}
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
