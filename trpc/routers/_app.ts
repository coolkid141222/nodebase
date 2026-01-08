import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({
  session: baseProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  
  testAI: protectedProcedure.mutation(async () => {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });
    return text;
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
