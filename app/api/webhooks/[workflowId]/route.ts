import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import {
  createWebhookExecution,
  runExecution,
  WorkflowExecutionError,
} from "@/features/executions/server/execution-runner";
import { ExecutionStatus } from "@/lib/prisma/client";
import prisma from "@/lib/db";

function canUseInngestQueue() {
  return Boolean(process.env.INNGEST_EVENT_KEY?.trim());
}

function parseWebhookPayload(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return {};
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return {
      rawBody: trimmed,
    };
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workflowId: string }> | { workflowId: string } },
) {
  const { workflowId } = await params;
  const webhookSecret = new URL(request.url).searchParams.get("token");

  if (!webhookSecret) {
    return NextResponse.json(
      {
        message: "Workflow not found.",
      },
      {
        status: 404,
      },
    );
  }

  const bodyText = await request.text();
  const triggerPayload = parseWebhookPayload(bodyText);
  let executionId: string | null = null;

  try {
    const execution = await createWebhookExecution({
      workflowId,
      webhookSecret,
      triggerPayload,
    });

    if (!execution) {
      return NextResponse.json(
        {
          message: "Workflow not found.",
        },
        {
          status: 404,
        },
      );
    }

    executionId = execution.id;

    const queued = canUseInngestQueue();

    if (queued) {
      await inngest.send({
        name: "workflow/webhook.triggered",
        data: {
          executionId: execution.id,
          workflowId: execution.workflowId,
        },
      });
    } else {
      const completedExecution = await runExecution(execution.id);

      return NextResponse.json(
        {
          id: execution.id,
          status: completedExecution?.status ?? execution.status,
          queued: false,
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      {
        id: execution.id,
        status: execution.status,
        queued: true,
      },
      {
        status: 202,
      },
    );
  } catch (error) {
    if (error instanceof WorkflowExecutionError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    if (executionId) {
      await prisma.execution.update({
        where: {
          id: executionId,
        },
        data: {
          status: ExecutionStatus.FAILED,
          completedAt: new Date(),
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to queue webhook execution.",
          },
          state: {
            phase: "queue_failed",
          },
        },
      });
    }

    throw error;
  }
}
