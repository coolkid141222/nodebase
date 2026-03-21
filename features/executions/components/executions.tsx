"use client";

import { ReactNode } from "react";
import { formatDistanceToNow, type Locale } from "date-fns";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  Loader2Icon,
  PlayCircleIcon,
} from "lucide-react";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  ErrorView,
  LoadingView,
} from "@/app/components/entity-compoents";
import { Badge } from "@/components/badge";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useI18n } from "@/features/i18n/provider";

const executionStatusVariant = {
  PENDING: "secondary",
  RUNNING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  CANCELED: "outline",
} as const;

function getExecutionIcon(status: ExecutionStatus) {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-emerald-600" />;
    case ExecutionStatus.FAILED:
      return <AlertTriangleIcon className="size-5 text-destructive" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 animate-spin text-muted-foreground" />;
    case ExecutionStatus.PENDING:
      return <Clock3Icon className="size-5 text-muted-foreground" />;
    default:
      return <PlayCircleIcon className="size-5 text-muted-foreground" />;
  }
}

type ExecutionListItem = {
  id: string;
  status: ExecutionStatus;
  triggerType: string;
  createdAt: Date;
  workflow: {
    id: string;
    name: string;
  };
  steps: Array<{
    status: ExecutionStepStatus;
  }>;
};

export const ExecutionsHeader = () => {
  const { t } = useI18n();
  return (
    <EntityHeader
      title={t("executions.title")}
      description={t("executions.description")}
      newButtonLabel={t("executions.backToWorkflows")}
      newButtonHref="/workflows"
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <EntityContainer header={<ExecutionsHeader />}>
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  const { t } = useI18n();
  return <LoadingView message={t("executions.loading")} />;
};

export const ExecutionsError = () => {
  const { t } = useI18n();
  return <ErrorView message={t("executions.error")} />;
};

export const ExecutionsEmpty = () => {
  return <EmptyView />;
};

function buildExecutionSubtitle(
  execution: ExecutionListItem,
  t: (key: string, values?: Record<string, string | number>) => string,
  dateLocale: Locale,
) {
  const totalSteps = execution.steps.length;
  const failedSteps = execution.steps.filter(
    (step) => step.status === ExecutionStepStatus.FAILED,
  ).length;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Badge variant={executionStatusVariant[execution.status]}>
        {execution.status}
      </Badge>
      <Badge variant="outline">{execution.triggerType}</Badge>
      <span>{execution.workflow.name}</span>
      <span>{t("common.updatedAgo", {
        value: formatDistanceToNow(new Date(execution.createdAt), {
          addSuffix: true,
          locale: dateLocale,
        }),
      })}</span>
      <span>
        {totalSteps === 1
          ? t("executions.steps", { count: totalSteps })
          : t("executions.stepsPlural", { count: totalSteps })}
      </span>
      {failedSteps > 0 && (
        <span>{t("executions.failedCount", { count: failedSteps })}</span>
      )}
    </span>
  );
}

const ExecutionItem = ({ execution }: { execution: ExecutionListItem }) => {
  const { t, dateLocale } = useI18n();
  return (
    <EntityItem
      href={`/executions/${execution.id}`}
      title={execution.id}
      subtitle={buildExecutionSubtitle(execution, t, dateLocale)}
      image={
        <div className="flex size-8 items-center justify-center">
          {getExecutionIcon(execution.status)}
        </div>
      }
    />
  );
};

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem execution={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};
