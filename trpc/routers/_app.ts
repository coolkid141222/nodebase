import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import { credentialsRouter } from "@/features/credentials/server/router";
import { workflowsRouter } from "@/features/workflows/server/router";
import { executionsRouter } from "@/features/executions/server/router";
import { aiRouter } from "@/features/ai/server/router";
import { billingRouter } from "@/features/billing/server/router";
import { DEFAULT_AI_SMOKE_PROMPT } from "@/features/ai/shared";
import { runAISmokeTest } from "@/features/ai/server/smoke-test";

export const appRouter = createTRPCRouter({
  session: baseProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  testAI: protectedProcedure.mutation(async () => {
    return runAISmokeTest(DEFAULT_AI_SMOKE_PROMPT);
  }),

  workflows: workflowsRouter,
  executions: executionsRouter,
  credentials: credentialsRouter,
  ai: aiRouter,
  billing: billingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
