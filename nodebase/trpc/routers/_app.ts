import { z } from "zod";
import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  session: baseProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return prisma.workflow.create({
        data: {
          id: crypto.randomUUID(),
          name: input.name,
        },
      });
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
