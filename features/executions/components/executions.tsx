"use client";

import { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
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
  return (
    <EntityHeader
      title="Executions"
      description="Inspect workflow runs, node-by-node progress, and captured errors"
      newButtonLabel="Back to Workflows"
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
  return <LoadingView message="Loading executions..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Failed to load executions." />;
};

export const ExecutionsEmpty = () => {
  return <EmptyView />;
};

function buildExecutionSubtitle(execution: ExecutionListItem) {
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
      <span>
        Updated{" "}
        {formatDistanceToNow(new Date(execution.createdAt), { addSuffix: true })}
      </span>
      <span>
        {totalSteps} step{totalSteps === 1 ? "" : "s"}
      </span>
      {failedSteps > 0 && (
        <span>{failedSteps} failed</span>
      )}
    </span>
  );
}

const ExecutionItem = ({ execution }: { execution: ExecutionListItem }) => {
  return (
    <EntityItem
      href={`/executions/${execution.id}`}
      title={execution.id}
      subtitle={buildExecutionSubtitle(execution)}
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
