import { createTRPCRouter, baseProcedure } from "../init";
import { credentialsRouter } from "@/features/credentials/server/router";
import { workflowsRouter } from "@/features/workflows/server/router";
import { executionsRouter } from "@/features/executions/server/router";
import { aiRouter } from "@/features/ai/server/router";
import { billingRouter } from "@/features/billing/server/router";
import { toolsRouter } from "@/features/tools/server/router";

export const appRouter = createTRPCRouter({
  session: baseProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  workflows: workflowsRouter,
  executions: executionsRouter,
  credentials: credentialsRouter,
  ai: aiRouter,
  billing: billingRouter,
  tools: toolsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
