"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Check, Clock3, X, Copy, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/card";
import { Button } from "@/components/button";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import { useWorkflowExecutionStatus } from "./workflow-execution-status-context";
import { useI18n } from "@/features/i18n/provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type StatusValue = ExecutionStatus | ExecutionStepStatus;
type PreviewExecution = {
  id: string;
  status: ExecutionStatus;
  createdAt: Date;
  steps: Array<{
    id: string;
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

// Fields to filter out from output display
const FILTERED_FIELDS = [
  '_raw',
  '_metadata',
  'timestamp',
  'requestId',
  'traceId',
  'spanId',
  'duration',
  'createdAt',
  'updatedAt',
  '__typename',
  '__schema',
];

function getExecutionStatusClasses(status: StatusValue) {
  switch (status) {
    case "RUNNING":
    case "PENDING":
      return "bg-blue-600 text-white";
    case "SUCCESS":
      return "bg-emerald-600 text-white";
    case "FAILED":
      return "bg-red-600 text-white";
    case "CANCELED":
      return "bg-zinc-500 text-white";
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

function StatusChip({ status }: { status: StatusValue }) {
  const classes = getExecutionStatusClasses(status);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        classes
      )}
    >
      {status === "SUCCESS" && <Check className="size-3" />}
      {status === "FAILED" && <X className="size-3" />}
      {status === "PENDING" && <Clock3 className="size-3" />}
      {status === "CANCELED" && <Clock3 className="size-3" />}
      {status === "SKIPPED" && <Clock3 className="size-3" />}
      {status === "RUNNING" && <Loader2 className="size-3 animate-spin" />}
      <span className="uppercase tracking-wide">{status}</span>
    </div>
  );
}

function filterOutputData(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(filterOutputData).filter(v => v !== null && v !== undefined && v !== '');
  }

  const obj = value as Record<string, unknown>;
  const filtered: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(obj)) {
    if (FILTERED_FIELDS.includes(key)) continue;
    if (key.startsWith('_')) continue;
    if (val === null || val === undefined) continue;
    if (typeof val === 'string' && val.trim() === '') continue;

    filtered[key] = filterOutputData(val);
  }

  return filtered;
}

function formatOutputValue(value: unknown, maxDepth = 3, currentDepth = 0): string {
  if (currentDepth >= maxDepth) {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'string') {
    return value.trim() || '';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(v => formatOutputValue(v, maxDepth, currentDepth + 1)).filter(Boolean);
    return items.length > 0 ? items.join('\n') : '[]';
  }

  if (typeof value === 'object') {
    const filtered = filterOutputData(value);
    if (typeof filtered !== 'object' || filtered === null) {
      return String(filtered);
    }

    // Try to extract text field for AI outputs
    if ('text' in filtered && typeof (filtered as { text?: unknown }).text === 'string') {
      return ((filtered as { text: string }).text || '').trim();
    }

    // For other objects, show as formatted JSON (truncated)
    const str = JSON.stringify(filtered, null, 2);
    if (str.length > 500) {
      return str.slice(0, 500) + '...';
    }
    return str;
  }

  return String(value);
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

const ExecutionPreviewCard = memo(function ExecutionPreviewCard() {
  const { t, dateLocale } = useI18n();
  const execution = useWorkflowExecutionStatus();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Get steps that have output or error
  const stepList = useMemo(() => {
    if (!execution?.steps) return [];
    return execution.steps.filter(
      step => step.output != null || step.error != null || step.status === 'RUNNING'
    );
  }, [execution?.steps]);

  // Determine which step to show
  const activeStep = useMemo(() => {
    if (!execution) return null;

    if (selectedStepId) {
      return execution.steps.find(s => s.id === selectedStepId) || null;
    }

    // Find latest step with output
    const stepsWithOutput = [...execution.steps].reverse();
    return stepsWithOutput.find(s => s.output != null || s.error) || execution.steps[0] || null;
  }, [execution, selectedStepId]);

  const aiTextPreview = activeStep ? extractAITextPreview(activeStep.output) : null;
  const outputText = activeStep ? formatOutputValue(activeStep.output ?? activeStep.error) : '';

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success(t("preview.copied") || "Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!execution) {
    return (
      <Card className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-border/60 bg-background/95 shadow-sm">
        <div className="h-1 w-full bg-muted" />
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardDescription className="text-[11px] uppercase tracking-[0.18em]">
                {t("preview.run")}
              </CardDescription>
              <p className="text-sm font-medium text-foreground">
                {t("preview.noExecution")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{t("preview.runToInspect")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border-border/60 bg-background/95 shadow-sm">
      <div className={cn("h-1 w-full", getExecutionAccentClass(execution.status))} />
      <div className="flex min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 space-y-1">
              <CardDescription className="text-[11px] uppercase tracking-[0.18em]">
                {t("preview.run")}
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={execution.status} />
                <span className="text-xs text-muted-foreground break-all">
                  {formatDistanceToNow(new Date(execution.createdAt), {
                    addSuffix: true,
                    locale: dateLocale,
                  })}
                </span>
              </div>
            </div>
            <Link
              href={`/executions/${execution.id}`}
              className="shrink-0 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("preview.open")}
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* Active Step Info */}
          {activeStep && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-sm font-medium">{activeStep.nodeName}</span>
            </div>
          )}

          {/* AI Text Preview */}
          {aiTextPreview && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                  {t("preview.llmOutput")}
                </div>
                {(aiTextPreview.provider || aiTextPreview.model) && (
                  <div className="text-[10px] uppercase tracking-wider text-violet-600">
                    {[aiTextPreview.provider, aiTextPreview.model].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3">
                <div className="max-h-32 overflow-y-auto whitespace-pre-wrap text-sm leading-5 text-foreground">
                  {aiTextPreview.text}
                </div>
              </div>
            </div>
          )}

          {/* Output Result */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                {activeStep?.error ? t("preview.resultError") : t("preview.result")}
              </div>
              {outputText && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="size-3 mr-1" />
                  ) : (
                    <Copy className="size-3 mr-1" />
                  )}
                  {copied ? t("preview.copied") : t("preview.copy")}
                </Button>
              )}
            </div>
            <div className="relative rounded-xl border border-border/70 bg-background p-3">
              <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-5 text-foreground font-mono">
                {outputText || t("preview.noExtractableResult")}
              </pre>
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
