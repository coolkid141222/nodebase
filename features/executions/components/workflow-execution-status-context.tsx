"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom, useAtomValue } from "jotai";
import { usePathname } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { ExecutionStatus } from "@/lib/prisma/client";
import {
  buildWorkflowExecutionState,
  emptyWorkflowExecutionState,
  type WorkflowExecutionSnapshot,
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
  const executionQuery = useQuery({
    ...trpc.executions.getLatestForWorkflow.queryOptions({ workflowId }),
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

  useEffect(() => {
    setWorkflowExecutionState(
      buildWorkflowExecutionState(
        (executionQuery.data as WorkflowExecutionSnapshot | undefined) ?? null,
      ),
    );
  }, [executionQuery.data, setWorkflowExecutionState]);

  useEffect(() => {
    return () => {
      setWorkflowExecutionState(emptyWorkflowExecutionState);
    };
  }, [setWorkflowExecutionState]);

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
