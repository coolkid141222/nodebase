import { inngest } from "./client";
import { runExecution } from "@/features/executions/server/execution-runner";

export const runManualWorkflow = inngest.createFunction(
  { id: "workflow-manual-execution" },
  { event: "workflow/manual.triggered" },
  async ({ event, step }) => {
    const execution = await step.run("run-manual-workflow", async () => {
      return runExecution(event.data.executionId);
    });

    return {
      executionId: event.data.executionId,
      status: execution?.status ?? "UNKNOWN",
    };
  },
);
