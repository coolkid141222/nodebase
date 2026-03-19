"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import {
  createQueuedWorkflowExecutionState,
  workflowExecutionActiveIdAtom,
  workflowExecutionStateAtom,
} from "../store/atoms";

export const useManualWorkflowExecution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const setWorkflowExecutionState = useSetAtom(workflowExecutionStateAtom);
  const setActiveExecutionId = useSetAtom(workflowExecutionActiveIdAtom);

  return useMutation(
    trpc.executions.triggerManual.mutationOptions({
      onSuccess: (data, variables) => {
        toast.success(`Execution ${data.id} queued`);
        setActiveExecutionId(data.id);
        setWorkflowExecutionState(createQueuedWorkflowExecutionState(data.id));
        const executionsListQuery = trpc.executions.getMany.queryOptions();
        queryClient.invalidateQueries({
          queryKey: executionsListQuery.queryKey,
          exact: true,
        });
        const latestExecutionQuery =
          trpc.executions.getLatestForWorkflow.queryOptions({
            workflowId: variables.workflowId,
          });

        queryClient.invalidateQueries({
          queryKey: latestExecutionQuery.queryKey,
          exact: true,
        });
        void queryClient.refetchQueries({
          queryKey: latestExecutionQuery.queryKey,
          exact: true,
          type: "active",
        });
      },
      onError: (error) => {
        toast.error(`Failed to trigger workflow: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};
