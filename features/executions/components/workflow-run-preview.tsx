"use client";

import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { Badge } from "@/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/card";
import { ExecutionStepStatus } from "@/lib/prisma/client";
import { useSuspenseExecution, useSuspenseExecutions } from "../hooks/use-executions";

const executionStatusVariant = {
  PENDING: "secondary",
  RUNNING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  CANCELED: "outline",
} as const;

function pickPreviewStep(execution: {
  steps: Array<{
    nodeType: string;
    status: ExecutionStepStatus;
    output: unknown;
    error: unknown;
  }>;
}) {
  return (
    execution.steps.find(
      (step) => step.nodeType === "AI_TEXT" && step.status === "SUCCESS",
    ) ??
    execution.steps.find((step) => step.output != null) ??
    execution.steps.at(-1)
  );
}

function extractPreviewResult(value: unknown) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "text" in value &&
    typeof (value as { text?: unknown }).text === "string"
  ) {
    return ((value as { text: string }).text || "").trim();
  }

  const sourceText =
    JSON.stringify(value, null, 2);

  try {
    const regex = /"text"\s*:\s*"([^"]+)"/g;
    const matches = Array.from(sourceText.matchAll(regex));

    if (matches.length > 0) {
      return matches
        .map((match) => match[1] ?? match[0] ?? "")
        .filter(Boolean)
        .join("\n");
    }

    const textMatch = sourceText.match(/^\s*([^{}\[\]]{8,})\s*$/m);
    if (textMatch?.[1]) {
      return textMatch[1].trim();
    }

    return sourceText.slice(0, 240).trim();
  } catch {
    return sourceText.slice(0, 240).trim();
  }
}

function ExecutionPreviewCard({
  executionId,
}: {
  executionId: string;
}) {
  const { data } = useSuspenseExecution(executionId);
  const previewStep = pickPreviewStep(data);
  const previewResult = useMemo(
    () => extractPreviewResult(previewStep?.output ?? previewStep?.error),
    [previewStep?.output, previewStep?.error],
  );

  return (
    <Card className="w-full min-w-0 max-h-[28rem] overflow-hidden border-border/60 bg-background/95 shadow-sm">
      <div className="flex min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden">
        <CardHeader className="space-y-1 pb-3">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <CardDescription className="text-xs break-all">
                {formatDistanceToNow(new Date(data.createdAt), {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>
            <Badge variant={executionStatusVariant[data.status]}>
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Result
            </div>
            <div className="max-h-20 overflow-y-auto overflow-x-hidden break-words rounded-md border bg-muted/30 p-3 text-sm leading-5">
              {previewResult || "No extractable result yet."}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function WorkflowRunPreviewSidebar({
  workflowId,
}: {
  workflowId: string;
}) {
  const executions = useSuspenseExecutions();
  const latestExecution = executions.data.find(
    (execution) => execution.workflow.id === workflowId,
  );

  return latestExecution ? (
    <ExecutionPreviewCard executionId={latestExecution.id} />
  ) : (
    <Card className="w-full min-w-0 max-h-[20rem] overflow-hidden border-border/60 bg-background/95 shadow-sm">
      <CardHeader className="space-y-2">
        <CardDescription className="text-xs">
          Run the workflow to inspect the latest result here.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        No execution yet.
      </CardContent>
    </Card>
  );
}
