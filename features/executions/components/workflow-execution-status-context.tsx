"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom, useAtomValue } from "jotai";
import { usePathname } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import {
  buildWorkflowExecutionState,
  emptyWorkflowExecutionState,
  isExecutionPendingOrRunning,
  isExecutionTerminal,
  type WorkflowExecutionSnapshot,
  workflowExecutionActiveIdAtom,
  workflowExecutionStateAtom,
} from "../store/atoms";

export function WorkflowExecutionStatusProvider({
  workflowId,
  children,
}: {
  workflowId: string;
  children: ReactNode;
}) {
  const trpc = useTRPC();
  const setWorkflowExecutionState = useSetAtom(workflowExecutionStateAtom);
  const setActiveExecutionId = useSetAtom(workflowExecutionActiveIdAtom);
  const activeExecutionId = useAtomValue(workflowExecutionActiveIdAtom);
  const latestExecutionQuery = useQuery({
    ...trpc.executions.getLatestForWorkflow.queryOptions({ workflowId }),
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (activeExecutionId) {
        return 1000;
      }

      return isExecutionPendingOrRunning(status) ? 1000 : 5000;
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  const activeExecutionQuery = useQuery({
    ...trpc.executions.getOne.queryOptions({
      id: activeExecutionId ?? "",
    }),
    enabled: Boolean(activeExecutionId),
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return isExecutionPendingOrRunning(status) ? 500 : false;
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (activeExecutionId) {
      const activeExecution =
        (activeExecutionQuery.data as WorkflowExecutionSnapshot | undefined) ??
        null;

      if (activeExecution) {
        setWorkflowExecutionState(buildWorkflowExecutionState(activeExecution));
      }

      return;
    }

    setWorkflowExecutionState(
      buildWorkflowExecutionState(
        (latestExecutionQuery.data as WorkflowExecutionSnapshot | undefined) ??
          null,
      ),
    );
  }, [
    activeExecutionId,
    activeExecutionQuery.data,
    latestExecutionQuery.data,
    setWorkflowExecutionState,
  ]);

  useEffect(() => {
    if (!activeExecutionId) {
      return;
    }

    const activeExecution =
      (activeExecutionQuery.data as WorkflowExecutionSnapshot | undefined) ??
      null;

    if (!activeExecution || !isExecutionTerminal(activeExecution.status)) {
      return;
    }

    const latestExecution =
      (latestExecutionQuery.data as WorkflowExecutionSnapshot | undefined) ??
      null;

    if (
      latestExecution?.id === activeExecution.id &&
      latestExecution.status === activeExecution.status
    ) {
      setWorkflowExecutionState(buildWorkflowExecutionState(latestExecution));
      // Release the handoff once the latest execution query has caught up.
      // The preview state already reflects the terminal result.
      setActiveExecutionId(null);
    }
  }, [
    activeExecutionId,
    activeExecutionQuery.data,
    latestExecutionQuery.data,
    setWorkflowExecutionState,
    setActiveExecutionId,
  ]);

  useEffect(() => {
    return () => {
      setWorkflowExecutionState(emptyWorkflowExecutionState);
      setActiveExecutionId(null);
    };
  }, [setWorkflowExecutionState, setActiveExecutionId]);

  return <>{children}</>;
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
    <WorkflowExecutionStatusProvider key={workflowId} workflowId={workflowId}>
      {children}
    </WorkflowExecutionStatusProvider>
  );
}

export function useWorkflowExecutionStatus() {
  return useAtomValue(workflowExecutionStateAtom);
}

export function useWorkflowNodeStatus(nodeId: string) {
  const { nodeStatuses } = useWorkflowExecutionStatus();
  return nodeStatuses[nodeId];
}
