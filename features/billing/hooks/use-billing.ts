"use client";

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

const invalidateBilling = async (
  queryClient: ReturnType<typeof useQueryClient>,
  trpc: ReturnType<typeof useTRPC>,
) => {
  await queryClient.invalidateQueries(trpc.billing.getState.queryOptions());
};

export const useBillingState = () => {
  const trpc = useTRPC();
  return useQuery(trpc.billing.getState.queryOptions());
};

export const useSuspenseBillingState = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.billing.getState.queryOptions());
};

export const useUpgradeToPro = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.billing.upgradeToPro.mutationOptions({
      onSuccess: async () => {
        toast.success("Pro plan enabled");
        await invalidateBilling(queryClient, trpc);
      },
      onError: (error) => {
        toast.error(`Failed to enable Pro: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};

export const useDowngradeToFree = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.billing.downgradeToFree.mutationOptions({
      onSuccess: async () => {
        toast.success("Switched back to Free");
        await invalidateBilling(queryClient, trpc);
      },
      onError: (error) => {
        toast.error(`Failed to switch plan: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};

export const useSyncPaddleCheckout = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.billing.syncPaddleCheckout.mutationOptions({
      onSuccess: async () => {
        toast.success("Paddle checkout completed");
        await invalidateBilling(queryClient, trpc);
      },
      onError: (error) => {
        toast.error(`Failed to sync Paddle checkout: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};

export const useCreatePaddlePortalLink = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.billing.createPaddlePortalLink.mutationOptions({
      onError: (error) => {
        toast.error(`Failed to open Paddle portal: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};
