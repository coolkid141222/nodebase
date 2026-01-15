import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import { inngest } from "@/inngest/client";
import { workflowsRouter } from "@/features/workflows/server/router";

export const appRouter = createTRPCRouter({
  session: baseProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/ai.providers",
      data: {
        email: "nothing@gmail.com"
      }
    });
    return { state: "success" }
  }),

  workflows: workflowsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
