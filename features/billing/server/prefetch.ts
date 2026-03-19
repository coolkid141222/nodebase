import { prefetch, trpc } from "@/trpc/server";

export const prefetchBillingState = () => {
  return prefetch(trpc.billing.getState.queryOptions());
};
