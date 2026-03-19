"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { Check, Clock3, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/card";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import {
  useWorkflowExecutionStatus,
} from "./workflow-execution-status-context";

type StatusValue = ExecutionStatus | ExecutionStepStatus;

function getExecutionStatusClasses(status: StatusValue) {
  switch (status) {
    case "RUNNING":
    case "PENDING":
      return "bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.12)]";
    case "SUCCESS":
      return "bg-emerald-600 text-white shadow-[0_0_0_4px_rgba(5,150,105,0.12)]";
    case "FAILED":
      return "bg-red-600 text-white shadow-[0_0_0_4px_rgba(220,38,38,0.12)]";
    case "CANCELED":
      return "bg-zinc-500 text-white shadow-[0_0_0_4px_rgba(113,113,122,0.12)]";
    default:
      return "bg-gray-500 text-white";
  }
}

function getExecutionAccentClass(status: ExecutionStatus) {
  switch (status) {
    case "RUNNING":
    case "PENDING":
      return "bg-blue-600";
    case "SUCCESS":
      return "bg-emerald-600";
    case "FAILED":
      return "bg-red-600";
    case "CANCELED":
      return "bg-zinc-500";
    default:
      return "bg-gray-500";
  }
}

function StatusChip({
  status,
}: {
  status: StatusValue;
}) {
  const classes = getExecutionStatusClasses(status);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${classes}`}
    >
      {status === "RUNNING" && (
        <span className="inline-block size-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {status === "SUCCESS" && <Check className="size-3" />}
      {status === "FAILED" && <X className="size-3" />}
      {status === "PENDING" && <Clock3 className="size-3" />}
      {status === "CANCELED" && <Clock3 className="size-3" />}
      {status === "SKIPPED" && <Clock3 className="size-3" />}
      <span className="uppercase tracking-wide">{status}</span>
    </div>
  );
}

function getResultLabel(
  executionStatus: ExecutionStatus,
  stepStatus?: ExecutionStepStatus,
) {
  if (stepStatus === "FAILED" || executionStatus === "FAILED") {
    return "Error";
  }

  if (stepStatus === "RUNNING") {
    return "Current output";
  }

  if (executionStatus === ExecutionStatus.RUNNING || executionStatus === ExecutionStatus.PENDING) {
    return "Latest output";
  }

  return "Result";
}

function getStepSummaryNote(
  executionStatus: ExecutionStatus,
  stepStatus?: ExecutionStepStatus,
) {
  if (!stepStatus) {
    return "No step has produced output yet.";
  }

  if (stepStatus === "RUNNING") {
    return "This step is still processing.";
  }

  if (executionStatus === ExecutionStatus.RUNNING || executionStatus === ExecutionStatus.PENDING) {
    return "Latest finished step while the workflow continues.";
  }

  return "Final step output for this run.";
}

function pickPreviewStep(execution: {
  status: ExecutionStatus;
  steps: Array<{
    nodeType: string;
    nodeName: string;
    status: ExecutionStepStatus;
    output: unknown;
    error: unknown;
  }>;
}) {
  const steps = execution.steps;
  const terminalSteps = [...steps].reverse();

  if (execution.status === ExecutionStatus.RUNNING || execution.status === ExecutionStatus.PENDING) {
    return (
      terminalSteps.find(
        (step) =>
          step.status === "SUCCESS" &&
          step.nodeType !== "MANUAL_TRIGGER" &&
          step.nodeType !== "WEBHOOK_TRIGGER",
      ) ??
      terminalSteps.find((step) => step.status === "FAILED") ??
      steps.find((step) => step.status === "RUNNING") ??
      steps.find((step) => step.status === "FAILED") ??
      steps.at(-1)
    );
  }

  return (
    terminalSteps.find(
      (step) =>
        step.status === "SUCCESS" &&
        step.nodeType !== "MANUAL_TRIGGER" &&
        step.nodeType !== "WEBHOOK_TRIGGER",
    ) ??
    terminalSteps.find((step) => step.status === "FAILED") ??
    terminalSteps.find((step) => step.output != null) ??
    steps.at(-1)
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

function ExecutionPreviewCard() {
  const { execution } = useWorkflowExecutionStatus();
  const previewStep = execution ? pickPreviewStep(execution) : undefined;
  const previewResult = useMemo(
    () => extractPreviewResult(previewStep?.output ?? previewStep?.error),
    [previewStep?.output, previewStep?.error],
  );

  if (!execution) {
    return (
      <Card className="w-full min-w-0 max-h-[20rem] overflow-hidden border-border/60 bg-background/95 shadow-sm">
        <div className="h-1 w-full bg-muted" />
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardDescription className="text-[11px] uppercase tracking-[0.18em]">
                Run preview
              </CardDescription>
              <p className="text-sm font-medium text-foreground">
                No execution yet
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Run the workflow to inspect the latest result here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full min-w-0 max-h-[28rem] overflow-hidden border-border/60 bg-background/95 shadow-sm">
      <div className={`h-1 w-full ${getExecutionAccentClass(execution.status)}`} />
      <div className="flex min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 space-y-1">
              <CardDescription className="text-[11px] uppercase tracking-[0.18em]">
                Run preview
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={execution.status} />
                <span className="text-xs text-muted-foreground break-all">
                  {formatDistanceToNow(new Date(execution.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <Link
              href={`/executions/${execution.id}`}
              className="shrink-0 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Open
            </Link>
          </div>

          {previewStep && (
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {execution.status === ExecutionStatus.RUNNING ||
                execution.status === ExecutionStatus.PENDING
                  ? "Focused step"
                  : "Final step"}
              </div>
              <div className="mt-1 truncate text-sm font-medium text-foreground">
                {previewStep.nodeName}
              </div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {getStepSummaryNote(execution.status, previewStep.status)}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              {getResultLabel(execution.status, previewStep?.status)}
            </div>
            <div className="max-h-28 overflow-y-auto overflow-x-hidden break-words rounded-xl border border-border/70 bg-background p-3 text-sm leading-5">
              {previewResult || "No extractable result yet."}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function WorkflowRunPreviewSidebar() {
  return <ExecutionPreviewCard />;
}
