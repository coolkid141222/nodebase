import { z } from "zod";
import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";

export const appRouter = createTRPCRouter({
  session: baseProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure
  .mutation(async () => {
    console.log("=== Server: Mutation START ===", new Date().toISOString());
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "nothing@gmail.com"
      }
    });
    console.log("=== Server: Inngest event SENT ===");
      return { state: "success" }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
