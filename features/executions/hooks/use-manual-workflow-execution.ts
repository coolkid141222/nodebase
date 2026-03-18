"use client";

import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useManualWorkflowExecution = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.executions.triggerManual.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Execution ${data.id} queued`);
      },
      onError: (error) => {
        toast.error(`Failed to trigger workflow: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};
