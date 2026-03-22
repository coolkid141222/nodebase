import { atom } from "jotai";

import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";

export type WorkflowLoopScopeSnapshot = {
  id: string;
  nodeIds: string[];
  maxIterations: number;
};

export type WorkflowLoopScopeState = {
  scopesById: Record<string, WorkflowLoopScopeSnapshot>;
  scopeIdByNodeId: Record<string, string>;
};

export type WorkflowExecutionStepSnapshot = {
  id: string;
  nodeId: string | null;
  nodeName: string;
  nodeType: string;
  status: ExecutionStepStatus;
  position: number;
  attempt: number;
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

export const workflowExecutionSnapshotAtom = atom(
  (get) => get(workflowExecutionStateAtom).execution,
);

export const emptyWorkflowLoopScopeState: WorkflowLoopScopeState = {
  scopesById: {},
  scopeIdByNodeId: {},
};

export const workflowLoopScopeStateAtom = atom<WorkflowLoopScopeState>(
  emptyWorkflowLoopScopeState,
);

export const workflowNodeStatusesAtom = atom(
  (get) => get(workflowExecutionStateAtom).nodeStatuses,
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

function getLatestStepForNode(
  execution: WorkflowExecutionSnapshot,
  nodeId: string,
) {
  let latestStep: WorkflowExecutionStepSnapshot | null = null;

  for (const step of execution.steps) {
    if (step.nodeId !== nodeId) {
      continue;
    }

    latestStep = step;
  }

  return latestStep;
}

function getActiveRunningStep(execution: WorkflowExecutionSnapshot) {
  let activeRunningStep: WorkflowExecutionStepSnapshot | null = null;

  for (const step of execution.steps) {
    if (step.status === ExecutionStepStatus.RUNNING) {
      activeRunningStep = step;
    }
  }

  return activeRunningStep;
}

function buildNodeStatusMap(execution: WorkflowExecutionSnapshot) {
  const nodeStatuses = execution.steps.reduce<Record<string, NodeStatus>>(
    (accumulator, step) => {
      if (!step.nodeId) {
        return accumulator;
      }

      const mappedStatus = mapExecutionStepStatus(step.status);

      if (!mappedStatus) {
        return accumulator;
      }

      accumulator[step.nodeId] = mappedStatus;
      return accumulator;
    },
    {},
  );

  if (!isExecutionPendingOrRunning(execution.status)) {
    return nodeStatuses;
  }

  const activeLoopNodeIds = new Set(
    execution.steps
      .filter((step) => step.nodeId && step.nodeType === "LOOP")
      .map((step) => step.nodeId as string),
  );

  for (const loopNodeId of activeLoopNodeIds) {
    nodeStatuses[loopNodeId] = "loading";
  }

  return nodeStatuses;
}

export function deriveWorkflowNodeStatus(params: {
  execution: WorkflowExecutionSnapshot | null;
  nodeId: string;
  loopScopeState: WorkflowLoopScopeState;
}) {
  const { execution, nodeId, loopScopeState } = params;

  if (!execution) {
    return undefined;
  }

  const latestStep = getLatestStepForNode(execution, nodeId);
  const baseStatus = latestStep
    ? mapExecutionStepStatus(latestStep.status)
    : undefined;
  const scope = loopScopeState.scopesById[nodeId];
  const activeRunningStep = getActiveRunningStep(execution);

  if (!isExecutionPendingOrRunning(execution.status)) {
    return baseStatus;
  }

  // During active loop execution, suppress intermediate SUCCESS states.
  // If this node's latest step is from an incomplete iteration, keep showing
  // "loading" so users don't see flashing SUCCESS between loop iterations.
  if (scope && latestStep) {
    return "loading";
  }

  if (!activeRunningStep?.nodeId) {
    return baseStatus;
  }

  const activeScopeId = loopScopeState.scopeIdByNodeId[activeRunningStep.nodeId];

  if (!activeScopeId) {
    return baseStatus;
  }

  const activeScope = loopScopeState.scopesById[activeScopeId];

  if (!activeScope || !activeScope.nodeIds.includes(nodeId)) {
    return baseStatus;
  }

  if (nodeId === activeScope.id) {
    return "loading";
  }

  if (!latestStep) {
    return undefined;
  }

  if (latestStep.attempt < activeRunningStep.attempt) {
    return undefined;
  }

  return baseStatus;
}

export function buildWorkflowExecutionState(
  execution: WorkflowExecutionSnapshot | null,
): WorkflowExecutionState {
  if (!execution) {
    return emptyWorkflowExecutionState;
  }

  return {
    execution,
    nodeStatuses: buildNodeStatusMap(execution),
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
