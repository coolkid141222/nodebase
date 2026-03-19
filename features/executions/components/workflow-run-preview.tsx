"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Panel } from "@xyflow/react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { ExecutionStepStatus } from "@/lib/prisma/client";
import { useSuspenseExecution, useSuspenseExecutions } from "../hooks/use-executions";

const executionStatusVariant = {
  PENDING: "secondary",
  RUNNING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  CANCELED: "outline",
} as const;

const stepStatusVariant = {
  PENDING: "secondary",
  RUNNING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  SKIPPED: "outline",
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

function toPreviewText(value: unknown) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

function extractRegexMatch(sourceText: string, pattern: string) {
  const trimmedPattern = pattern.trim();

  if (!trimmedPattern) {
    return {
      error: "Regex pattern is required.",
      match: "",
    };
  }

  try {
    const regex = new RegExp(trimmedPattern, "g");
    const matches = Array.from(sourceText.matchAll(regex));

    if (matches.length === 0) {
      return {
        error: "No match found.",
        match: "",
      };
    }

    const joinedMatches = matches
      .map((match) => match[1] ?? match[0] ?? "")
      .filter(Boolean)
      .join("\n");

    return {
      error: null,
      match: joinedMatches,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid regex pattern.",
      match: "",
    };
  }
}

function ExecutionPreviewCard({
  executionId,
}: {
  executionId: string;
}) {
  const { data } = useSuspenseExecution(executionId);
  const previewStep = pickPreviewStep(data);
  const [pattern, setPattern] = useState(String.raw`"text"\s*:\s*"([^"]+)"`);

  const sourceValue = toPreviewText(previewStep?.output ?? previewStep?.error);
  const extracted = extractRegexMatch(sourceValue, pattern);

  return (
    <Card className="border-border/60 bg-background/95 shadow-lg backdrop-blur max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col overflow-y-auto">
        <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm">Latest run</CardTitle>
            <CardDescription className="text-xs">
              {data.id} ·{" "}
              {formatDistanceToNow(new Date(data.createdAt), {
                addSuffix: true,
              })}
            </CardDescription>
          </div>
          <Badge variant={executionStatusVariant[data.status]}>
            {data.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{data.triggerType}</Badge>
          <span>{data.workflow.name}</span>
        </div>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Inspect step
            </div>
            <div className="text-sm font-medium">
              {previewStep?.nodeName ?? "No previewable step"}
            </div>
          </div>
          {previewStep && (
            <Badge variant={stepStatusVariant[previewStep.status]}>
              {previewStep.status}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Regex
          </div>
          <Input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder='"text"\\s*:\\s*"([^"]+)"'
          />
          <div className="text-[11px] leading-4 text-muted-foreground">
            Runs against the raw JSON output of the selected step.
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Raw output
          </div>
          <Textarea
            readOnly
            value={sourceValue}
            className="min-h-32 resize-none font-mono text-[11px]"
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Extracted result
          </div>
          <Textarea
            readOnly
            value={extracted.error ? extracted.error : extracted.match}
            className={`min-h-24 resize-none font-mono text-[11px] ${
              extracted.error ? "text-destructive" : ""
            }`}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/executions/${data.id}`}>Open details</Link>
          </Button>
          <span className="text-xs text-muted-foreground">
            Use the latest AI output here.
          </span>
        </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function WorkflowRunPreviewPanel({
  workflowId,
}: {
  workflowId: string;
}) {
  const executions = useSuspenseExecutions();
  const latestExecution = executions.data.find(
    (execution) => execution.workflow.id === workflowId,
  );

  return (
    <Panel
      position="top-left"
      className="pointer-events-auto w-[min(360px,calc(100vw-2rem))] p-4"
    >
      {latestExecution ? (
        <ExecutionPreviewCard executionId={latestExecution.id} />
      ) : (
        <Card className="border-border/60 bg-background/95 shadow-lg backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-sm">Latest run</CardTitle>
            <CardDescription className="text-xs">
              Run the workflow to inspect the latest result here.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No execution yet.
          </CardContent>
        </Card>
      )}
    </Panel>
  );
}
