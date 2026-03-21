import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getToolRegistrySnapshot } from "./registry";

export const toolsRouter = createTRPCRouter({
  getRegistry: protectedProcedure.query(() => {
    return getToolRegistrySnapshot();
  }),
});
