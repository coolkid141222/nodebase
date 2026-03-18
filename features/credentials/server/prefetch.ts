import { prefetch, trpc } from "@/trpc/server";

export const prefetchCredentials = () => {
  return prefetch(trpc.credentials.getMany.queryOptions());
};

export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
