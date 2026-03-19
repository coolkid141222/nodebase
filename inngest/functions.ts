import { inngest } from "./client";
import { runExecution } from "@/features/executions/server/execution-runner";

async function runExecutionJob(executionId: string) {
  return runExecution(executionId);
}

export const runManualWorkflow = inngest.createFunction(
  { id: "workflow-manual-execution" },
  { event: "workflow/manual.triggered" },
  async ({ event, step }) => {
    const execution = await step.run("run-manual-workflow", async () => {
      return runExecutionJob(event.data.executionId);
    });

    return {
      executionId: event.data.executionId,
      status: execution?.status ?? "UNKNOWN",
    };
  },
);

export const runWebhookWorkflow = inngest.createFunction(
  { id: "workflow-webhook-execution" },
  { event: "workflow/webhook.triggered" },
  async ({ event, step }) => {
    const execution = await step.run("run-webhook-workflow", async () => {
      return runExecutionJob(event.data.executionId);
    });

    return {
      executionId: event.data.executionId,
      status: execution?.status ?? "UNKNOWN",
    };
  },
);
