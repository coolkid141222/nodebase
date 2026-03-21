"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Check, Clock3, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/card";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import { useWorkflowExecutionStatus } from "./workflow-execution-status-context";

type StatusValue = ExecutionStatus | ExecutionStepStatus;
type PreviewExecution = {
  status: ExecutionStatus;
  steps: Array<{
    nodeType: string;
    nodeName: string;
    status: ExecutionStepStatus;
    output: unknown;
    error: unknown;
  }>;
};

type AITextPreview = {
  text: string;
  provider?: string;
  model?: string;
};

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

function getDisplayExecutionStatus(execution: PreviewExecution): ExecutionStatus {
  if (
    execution.status !== ExecutionStatus.RUNNING &&
    execution.status !== ExecutionStatus.PENDING
  ) {
    return execution.status;
  }

  if (execution.steps.some((step) => step.status === ExecutionStepStatus.FAILED)) {
    return ExecutionStatus.FAILED;
  }

  if (execution.steps.some((step) => step.status === ExecutionStepStatus.RUNNING)) {
    return ExecutionStatus.RUNNING;
  }

  if (
    execution.steps.length > 0 &&
    execution.steps.every(
      (step) =>
        step.status === ExecutionStepStatus.SUCCESS ||
        step.status === ExecutionStepStatus.SKIPPED,
    )
  ) {
    return ExecutionStatus.SUCCESS;
  }

  return execution.status;
}

function pickFocusedStep(
  execution: PreviewExecution,
  displayStatus: ExecutionStatus,
) {
  const steps = execution.steps;
  const terminalSteps = [...steps].reverse();

  if (
    displayStatus === ExecutionStatus.RUNNING ||
    displayStatus === ExecutionStatus.PENDING
  ) {
    return (
      steps.find((step) => step.status === ExecutionStepStatus.RUNNING) ??
      terminalSteps.find(
        (step) =>
          step.status === "SUCCESS" &&
          step.nodeType !== "MANUAL_TRIGGER" &&
          step.nodeType !== "WEBHOOK_TRIGGER",
      ) ??
      terminalSteps.find((step) => step.status === "FAILED") ??
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

function pickResultStep(
  execution: PreviewExecution,
  displayStatus: ExecutionStatus,
  focusedStep:
    | PreviewExecution["steps"][number]
    | undefined,
) {
  const terminalSteps = [...execution.steps].reverse();

  if (
    displayStatus === ExecutionStatus.RUNNING ||
    displayStatus === ExecutionStatus.PENDING
  ) {
    return (
      terminalSteps.find(
        (step) =>
          step.output != null &&
          step.nodeType !== "MANUAL_TRIGGER" &&
          step.nodeType !== "WEBHOOK_TRIGGER",
      ) ??
      terminalSteps.find((step) => step.error != null) ??
      terminalSteps.find((step) => step.output != null) ??
      focusedStep
    );
  }

  return focusedStep;
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

function extractAITextPreview(value: unknown): AITextPreview | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const text = "text" in value && typeof value.text === "string"
    ? value.text.trim()
    : "";

  if (!text) {
    return null;
  }

  return {
    text,
    provider:
      "provider" in value && typeof value.provider === "string"
        ? value.provider
        : undefined,
    model:
      "model" in value && typeof value.model === "string"
        ? value.model
        : undefined,
  };
}

function pickLatestAITextStep(execution: PreviewExecution) {
  return [...execution.steps].reverse().find(
    (step) =>
      step.nodeType === "AI_TEXT" &&
      step.status === ExecutionStepStatus.SUCCESS &&
      extractAITextPreview(step.output) !== null,
  );
}

const ExecutionPreviewCard = memo(function ExecutionPreviewCard() {
  const execution = useWorkflowExecutionStatus();
  const {
    displayStatus,
    focusedStep,
    resultStep,
    aiTextPreview,
    previewResult,
  } = useMemo(() => {
    if (!execution) {
      return {
        displayStatus: undefined,
        focusedStep: undefined,
        resultStep: undefined,
        aiTextPreview: null,
        previewResult: "",
      };
    }

    const nextDisplayStatus = getDisplayExecutionStatus(execution);
    const nextFocusedStep = pickFocusedStep(execution, nextDisplayStatus);
    const nextResultStep = pickResultStep(
      execution,
      nextDisplayStatus,
      nextFocusedStep,
    );
    const aiTextStep = pickLatestAITextStep(execution);

    return {
      displayStatus: nextDisplayStatus,
      focusedStep: nextFocusedStep,
      resultStep: nextResultStep,
      aiTextPreview: aiTextStep
        ? extractAITextPreview(aiTextStep.output)
        : null,
      previewResult: extractPreviewResult(
        nextResultStep?.output ?? nextResultStep?.error,
      ),
    };
  }, [execution]);

  if (!execution) {
    return (
      <Card className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-border/60 bg-background/95 shadow-sm">
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
    <Card className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-border/60 bg-background/95 shadow-sm">
      <div className={`h-1 w-full ${getExecutionAccentClass(displayStatus ?? execution.status)}`} />
      <div className="flex min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 space-y-1">
              <CardDescription className="text-[11px] uppercase tracking-[0.18em]">
                Run preview
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={displayStatus ?? execution.status} />
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

          {focusedStep && (
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {(displayStatus ?? execution.status) === ExecutionStatus.RUNNING ||
                (displayStatus ?? execution.status) === ExecutionStatus.PENDING
                  ? "Focused step"
                  : "Final step"}
              </div>
              <div className="mt-1 truncate text-sm font-medium text-foreground">
                {focusedStep.nodeName}
              </div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {getStepSummaryNote(displayStatus ?? execution.status, focusedStep.status)}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          {aiTextPreview && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                LLM output
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                {(aiTextPreview.provider || aiTextPreview.model) && (
                  <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-emerald-700/80">
                    {[aiTextPreview.provider, aiTextPreview.model]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                )}
                <div className="max-h-28 overflow-y-auto overflow-x-hidden break-words text-sm leading-5 text-foreground">
                  {aiTextPreview.text}
                </div>
              </div>
            </div>
          )}
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              {getResultLabel(displayStatus ?? execution.status, resultStep?.status)}
            </div>
            <div className="max-h-28 overflow-y-auto overflow-x-hidden break-words rounded-xl border border-border/70 bg-background p-3 text-sm leading-5">
              {previewResult || "No extractable result yet."}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
});

export function WorkflowRunPreviewSidebar() {
  return <ExecutionPreviewCard />;
}
