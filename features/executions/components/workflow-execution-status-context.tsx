"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

type WorkflowExecutionStep = {
  nodeId: string | null;
  status: ExecutionStepStatus;
};

type WorkflowExecutionStatusContextValue = {
  executionId: string | null;
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
    ...trpc.executions.getLatestRunningForWorkflow.queryOptions({ workflowId }),
    refetchInterval: (query) =>
      query.state.data?.status === ExecutionStatus.RUNNING ? 1000 : 5000,
    refetchIntervalInBackground: true,
  });

  const value = useMemo<WorkflowExecutionStatusContextValue>(() => {
    const execution = executionQuery.data;

    if (!execution || execution.status !== ExecutionStatus.RUNNING) {
      return {
        executionId: null,
        nodeStatuses: {},
      };
    }

    return {
      executionId: execution.id,
      nodeStatuses: buildNodeStatusMap(execution.steps as WorkflowExecutionStep[]),
    };
  }, [executionQuery.data]);

  return (
    <WorkflowExecutionStatusContext.Provider value={value}>
      {children}
    </WorkflowExecutionStatusContext.Provider>
  );
}

export function useWorkflowNodeStatus(nodeId: string) {
  const context = useContext(WorkflowExecutionStatusContext);

  if (!context) {
    return undefined;
  }

  return context.nodeStatuses[nodeId];
}
