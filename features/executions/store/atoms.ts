import { atom } from "jotai";

import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";

export type WorkflowExecutionStepSnapshot = {
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

export type WorkflowExecutionSnapshot = {
  id: string;
  status: ExecutionStatus;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  triggerType: string;
  steps: WorkflowExecutionStepSnapshot[];
};

export type WorkflowExecutionState = {
  execution: WorkflowExecutionSnapshot | null;
  nodeStatuses: Record<string, NodeStatus>;
};

export const emptyWorkflowExecutionState: WorkflowExecutionState = {
  execution: null,
  nodeStatuses: {},
};

export const workflowExecutionStateAtom = atom<WorkflowExecutionState>(
  emptyWorkflowExecutionState,
);

export const workflowExecutionActiveIdAtom = atom<string | null>(null);

export function isExecutionPendingOrRunning(
  status: ExecutionStatus | null | undefined,
) {
  return status === ExecutionStatus.PENDING || status === ExecutionStatus.RUNNING;
}

export function isExecutionTerminal(
  status: ExecutionStatus | null | undefined,
) {
  return (
    status === ExecutionStatus.SUCCESS ||
    status === ExecutionStatus.FAILED ||
    status === ExecutionStatus.CANCELED
  );
}

function mapExecutionStepStatus(
  status: ExecutionStepStatus,
): NodeStatus | undefined {
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

function buildNodeStatusMap(steps: WorkflowExecutionStepSnapshot[]) {
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

export function buildWorkflowExecutionState(
  execution: WorkflowExecutionSnapshot | null,
): WorkflowExecutionState {
  if (!execution) {
    return emptyWorkflowExecutionState;
  }

  return {
    execution,
    nodeStatuses: buildNodeStatusMap(execution.steps),
  };
}

export function createQueuedWorkflowExecutionState(
  executionId: string,
): WorkflowExecutionState {
  return buildWorkflowExecutionState({
    id: executionId,
    status: ExecutionStatus.PENDING,
    createdAt: new Date(),
    startedAt: null,
    completedAt: null,
    triggerType: "MANUAL",
    steps: [],
  });
}
