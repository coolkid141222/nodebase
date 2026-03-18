import { prefetch, trpc } from "@/trpc/server";

export const prefetchExecutions = () => {
  return prefetch(trpc.executions.getMany.queryOptions());
};

export const prefetchExecution = (id: string) => {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
};
