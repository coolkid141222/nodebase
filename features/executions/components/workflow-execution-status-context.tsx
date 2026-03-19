"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

type WorkflowExecutionStep = {
  id: string;
  nodeId: string | null;
  nodeName: string;
  nodeType: string;
  status: ExecutionStepStatus;
  position: number;
  input: unknown;
  output: unknown;
  error: unknown;
  startedAt: Date | null;
  completedAt: Date | null;
};

type WorkflowExecution = {
  id: string;
  status: ExecutionStatus;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  triggerType: string;
  steps: WorkflowExecutionStep[];
};

type WorkflowExecutionStatusContextValue = {
  execution: WorkflowExecution | null;
  nodeStatuses: Record<string, NodeStatus>;
};

const WorkflowExecutionStatusContext =
  createContext<WorkflowExecutionStatusContextValue | null>(null);

function mapExecutionStepStatus(status: ExecutionStepStatus): NodeStatus | undefined {
  switch (status) {
    case ExecutionStepStatus.RUNNING:
      return "loading";
    case ExecutionStepStatus.SUCCESS:
      return "success";
    case ExecutionStepStatus.FAILED:
      return "error";
    default:
      return undefined;
  }
}

function buildNodeStatusMap(steps: WorkflowExecutionStep[]) {
  return steps.reduce<Record<string, NodeStatus>>((accumulator, step) => {
    if (!step.nodeId) {
      return accumulator;
    }

    const mappedStatus = mapExecutionStepStatus(step.status);

    if (!mappedStatus) {
      return accumulator;
    }

    accumulator[step.nodeId] = mappedStatus;
    return accumulator;
  }, {});
}

export function WorkflowExecutionStatusProvider({
  workflowId,
  children,
}: {
  workflowId: string;
  children: ReactNode;
}) {
  const trpc = useTRPC();
  const executionQuery = useQuery({
    ...trpc.executions.getLatestForWorkflow.queryOptions({ workflowId }),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      return status === ExecutionStatus.PENDING || status === ExecutionStatus.RUNNING
        ? 1000
        : 5000;
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const value = useMemo<WorkflowExecutionStatusContextValue>(() => {
    const execution = executionQuery.data;

    if (!execution) {
      return {
        execution: null,
        nodeStatuses: {},
      };
    }

    return {
      execution: execution as WorkflowExecution,
      nodeStatuses: buildNodeStatusMap(execution.steps as WorkflowExecutionStep[]),
    };
  }, [executionQuery.data]);

  return (
    <WorkflowExecutionStatusContext.Provider value={value}>
      {children}
    </WorkflowExecutionStatusContext.Provider>
  );
}

export function WorkflowExecutionStatusScope({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const workflowMatch = pathname.match(/^\/workflows\/([^/]+)$/);
  const workflowId = workflowMatch?.[1];

  if (!workflowId || workflowId === "new") {
    return <>{children}</>;
  }

  return (
    <WorkflowExecutionStatusProvider workflowId={workflowId}>
      {children}
    </WorkflowExecutionStatusProvider>
  );
}

export function useWorkflowExecutionStatus() {
  const context = useContext(WorkflowExecutionStatusContext);

  if (!context) {
    return {
      execution: null,
      nodeStatuses: {},
    };
  }

  return context;
}

export function useWorkflowNodeStatus(nodeId: string) {
  const { nodeStatuses } = useWorkflowExecutionStatus();
  return nodeStatuses[nodeId];
}
