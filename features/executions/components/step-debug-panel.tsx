"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExecutionStepStatus } from "@/lib/prisma/client";
import { toast } from "sonner";

type StepDebugInfo = {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: ExecutionStepStatus;
  position: number;
  attempt: number;
  durationMs: number | null;
  input: Record<string, unknown> | null;
  output: unknown;
  error: unknown;
  templateResolutions?: Array<{
    expression: string;
    resolved: unknown;
    path: string;
    timestamp: string;
  }>;
};

const statusVariant: Record<ExecutionStepStatus, "secondary" | "default" | "destructive" | "outline"> = {
  PENDING: "secondary",
  RUNNING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  SKIPPED: "outline",
};

interface StepDebugPanelProps {
  step: StepDebugInfo;
}

function JsonView({
  title,
  value,
  className,
}: {
  title: string;
  value: unknown;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(value, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <ChevronDownIcon className="size-3" />
          ) : (
            <ChevronRightIcon className="size-3" />
          )}
          {title}
        </button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3" />
          ) : (
            <Copy className="size-3" />
          )}
        </Button>
      </div>
      {expanded && (
        <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
          {jsonString}
        </pre>
      )}
    </div>
  );
}

function TemplateResolutionsView({
  resolutions,
}: {
  resolutions: Array<{
    expression: string;
    resolved: unknown;
    path: string;
    timestamp: string;
  }>;
}) {
  const [expanded, setExpanded] = useState(true);

  if (!resolutions || resolutions.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Template Resolutions
        </div>
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
          No template resolutions recorded
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        {expanded ? (
          <ChevronDownIcon className="size-3" />
        ) : (
          <ChevronRightIcon className="size-3" />
        )}
        Template Resolutions ({resolutions.length})
      </button>
      {expanded && (
        <div className="max-h-60 overflow-y-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead className="border-b bg-muted/30 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Expression</th>
                <th className="px-3 py-2 text-left font-medium">Resolved</th>
                <th className="px-3 py-2 text-left font-medium">Path</th>
              </tr>
            </thead>
            <tbody>
              {resolutions.map((res, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "border-b last:border-0",
                    idx % 2 === 0 ? "bg-background" : "bg-muted/20",
                  )}
                >
                  <td className="px-3 py-2 font-mono text-violet-600">
                    {`{{${res.expression}}}`}
                  </td>
                  <td className="px-3 py-2 font-mono text-emerald-600 max-w-[200px] truncate">
                    {typeof res.resolved === "object"
                      ? JSON.stringify(res.resolved).slice(0, 100)
                      : String(res.resolved)?.slice(0, 100)}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground font-mono">
                    {res.path}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function StepDebugPanel({ step }: StepDebugPanelProps) {
  const resolutions = step.templateResolutions ?? [];

  return (
    <div className="space-y-4">
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-base">{step.nodeName}</CardTitle>
              <CardDescription className="font-mono text-xs">
                {step.nodeType} · Position {step.position}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[step.status]}>
                {step.status}
              </Badge>
              {step.durationMs !== null && (
                <span className="text-xs text-muted-foreground">
                  {step.durationMs}ms
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <JsonView title="Input" value={step.input ?? {}} />
          <TemplateResolutionsView resolutions={resolutions} />
          <JsonView
            title="Output"
            value={step.output}
            className={step.error ? "opacity-60" : undefined}
          />
          <JsonView title="Error" value={step.error} />
        </CardContent>
      </Card>
    </div>
  );
}
