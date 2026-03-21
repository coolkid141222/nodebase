import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_AI_SMOKE_PROMPT } from "../shared";
import { runAISmokeTest } from "./smoke-test";
import { generateWorkflowDraft } from "./workflow-generator";
import { generateWorkflowGraphInputSchema } from "../workflow-generator/shared";

export const aiRouter = createTRPCRouter({
  runSmokeTest: protectedProcedure
    .input(
      z.object({
        prompt: z.string().trim().max(2_000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return runAISmokeTest(input.prompt || DEFAULT_AI_SMOKE_PROMPT);
    }),
  generateWorkflowGraph: protectedProcedure
    .input(generateWorkflowGraphInputSchema)
    .mutation(async ({ ctx, input }) => {
      return generateWorkflowDraft({
        userId: ctx.user.id,
        input,
      });
    }),
});
