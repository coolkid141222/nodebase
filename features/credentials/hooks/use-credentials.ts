"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions());
};

export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: () => {
        toast.success("Credential created");
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions());
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};

export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Credential updated");
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions());
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update credential: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};

export const useDeleteCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Credential deleted");
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions());
      },
      onError: (error) => {
        toast.error(`Failed to delete credential: ${error.message}`);
        Sentry.captureException(error);
      },
    }),
  );
};
