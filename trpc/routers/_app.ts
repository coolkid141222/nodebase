import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

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


  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure
  .mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "nothing@gmail.com"
      }
    });
      return { state: "success" }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
