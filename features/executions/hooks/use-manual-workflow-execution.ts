"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useManualWorkflowExecution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.executions.triggerManual.mutationOptions({
      onSuccess: (data, variables) => {
        toast.success(`Execution ${data.id} queued`);
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
