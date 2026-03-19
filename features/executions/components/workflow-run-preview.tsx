"use client";

import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { Check, Clock3, Loader2, X } from "lucide-react";
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

function getExecutionStatusClasses(status: ExecutionStatus) {
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

function StatusChip({
  status,
}: {
  status: ExecutionStatus;
}) {
  const classes = getExecutionStatusClasses(status);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${classes}`}
    >
      {status === "RUNNING" && <Loader2 className="size-3 animate-spin" />}
      {status === "SUCCESS" && <Check className="size-3" />}
      {status === "FAILED" && <X className="size-3" />}
      {status === "PENDING" && <Clock3 className="size-3" />}
      {status === "CANCELED" && <Clock3 className="size-3" />}
      {status === "SKIPPED" && <Clock3 className="size-3" />}
      <span className="uppercase tracking-wide">{status}</span>
    </div>
  );
}

function StepNamePill({ label }: { label: string }) {
  return (
    <div className="inline-flex max-w-full items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      <span className="truncate">Step: {label}</span>
    </div>
  );
}

function pickPreviewStep(execution: {
  steps: Array<{
    nodeType: string;
    nodeName: string;
    status: ExecutionStepStatus;
    output: unknown;
    error: unknown;
  }>;
}) {
  return (
    execution.steps.find((step) => step.status === "RUNNING") ??
    execution.steps.find((step) => step.status === "FAILED") ??
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

  return (
    <Card className="w-full min-w-0 max-h-[28rem] overflow-hidden border-border/60 bg-background/95 shadow-sm">
      <div className="flex min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden">
        <CardHeader className="space-y-1 pb-3">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 space-y-1">
              <CardDescription className="text-xs break-all">
                {formatDistanceToNow(new Date(execution.createdAt), {
                  addSuffix: true,
                })}
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={execution.status} />
                {previewStep && <StepNamePill label={previewStep.nodeName} />}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              {previewStep?.status === "RUNNING" ? "Current output" : "Result"}
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

export function WorkflowRunPreviewSidebar() {
  return <ExecutionPreviewCard />;
}
