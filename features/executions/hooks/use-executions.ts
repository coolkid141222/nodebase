"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getMany.queryOptions());
};

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
