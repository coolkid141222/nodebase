import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { generateWorkflowDraft } from "./workflow-generator";
import { generateWorkflowGraphInputSchema } from "../workflow-generator/shared";

export const aiRouter = createTRPCRouter({
  generateWorkflowGraph: protectedProcedure
    .input(generateWorkflowGraphInputSchema)
    .mutation(async ({ ctx, input }) => {
      return generateWorkflowDraft({
        userId: ctx.user.id,
        input,
      });
    }),
});
