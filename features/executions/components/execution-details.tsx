"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { ExecutionStatus, ExecutionStepStatus } from "@/lib/prisma/client";
import { useSuspenseExecution } from "../hooks/use-executions";
import { MemoryInspector } from "./memory-inspector";
import { StepDebugPanel } from "./step-debug-panel";
import { ExecutionTimeline } from "./execution-timeline";

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

function JsonBlock({
  title,
  value,
}: {
  title: string;
  value: unknown;
}) {
  if (value == null) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap break-words">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function formatStatusCopy(status: ExecutionStatus | ExecutionStepStatus) {
  return status.toLowerCase();
}

type ViewTab = "steps" | "timeline" | "memory";

export const ExecutionDetails = ({ id }: { id: string }) => {
  const execution = useSuspenseExecution(id);
  const data = execution.data;
  const [activeTab, setActiveTab] = useState<ViewTab>("steps");
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const selectedStep = selectedStepId
    ? data.steps.find((s) => s.id === selectedStepId)
    : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{data.workflow.name}</CardTitle>
                <Badge variant={executionStatusVariant[data.status]}>
                  {formatStatusCopy(data.status)}
                </Badge>
                <Badge variant="outline">{data.triggerType}</Badge>
              </div>
              <CardDescription>
                Execution {data.id} created{" "}
                {formatDistanceToNow(new Date(data.createdAt), {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/executions">
                <ArrowLeftIcon className="size-4" />
                Back
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-sm">
            <div>Status: {data.status}</div>
            <div>Workflow ID: {data.workflowId}</div>
            <div>Started: {data.startedAt ? new Date(data.startedAt).toLocaleString() : "-"}</div>
            <div>Completed: {data.completedAt ? new Date(data.completedAt).toLocaleString() : "-"}</div>
            <div>Steps: {data.steps.length}</div>
            <div>Memory entries: {data.memoryEntries.length}</div>
            <div>Memory events: {data.memoryEvents.length}</div>
          </div>
          <div className="space-y-4">
            <JsonBlock title="Trigger Payload" value={data.triggerPayload} />
            <JsonBlock title="Execution Error" value={data.error} />
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b px-4">
        <button
          onClick={() => {
            setActiveTab("steps");
            setSelectedStepId(null);
          }}
          className={`pb-3 pt-2 text-sm font-medium transition-colors ${
            activeTab === "steps"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Steps
        </button>
        <button
          onClick={() => {
            setActiveTab("timeline");
            setSelectedStepId(null);
          }}
          className={`pb-3 pt-2 text-sm font-medium transition-colors ${
            activeTab === "timeline"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => {
            setActiveTab("memory");
            setSelectedStepId(null);
          }}
          className={`pb-3 pt-2 text-sm font-medium transition-colors ${
            activeTab === "memory"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Memory
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "steps" && (
        <div className="grid gap-4">
          {selectedStep ? (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStepId(null)}
                className="mb-4"
              >
                <ArrowLeftIcon className="size-4 mr-1" />
                Back to steps
              </Button>
              <StepDebugPanel
                step={{
                  id: selectedStep.id,
                  nodeId: selectedStep.nodeId ?? "",
                  nodeName: selectedStep.nodeName,
                  nodeType: selectedStep.nodeType,
                  status: selectedStep.status,
                  position: selectedStep.position,
                  attempt: selectedStep.attempt,
                  durationMs: selectedStep.durationMs,
                  input: selectedStep.input as Record<string, unknown> | null,
                  output: selectedStep.output,
                  error: selectedStep.error,
                  templateResolutions: undefined, // TODO: Add when stored in DB
                }}
              />
            </div>
          ) : (
            data.steps.map((step) => (
              <Card key={step.id} className="shadow-none cursor-pointer hover:bg-muted/30 transition-colors">
                <CardHeader>
                  <div
                    className="flex flex-wrap items-center justify-between gap-3"
                    onClick={() => setSelectedStepId(step.id)}
                  >
                    <div className="space-y-1">
                      <CardTitle className="text-base">{step.nodeName}</CardTitle>
                      <CardDescription>
                        {step.nodeType} · position {step.position}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={stepStatusVariant[step.status]}>
                        {formatStatusCopy(step.status)}
                      </Badge>
                      {step.durationMs != null && (
                        <Badge variant="outline">{step.durationMs} ms</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-3">
                  <JsonBlock title="Input" value={step.input} />
                  <JsonBlock title="Output" value={step.output} />
                  <JsonBlock title="Error" value={step.error} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "timeline" && (
        <ExecutionTimeline
          steps={data.steps.map((s) => ({
            id: s.id,
            nodeId: s.nodeId ?? "",
            nodeName: s.nodeName,
            nodeType: s.nodeType,
            status: s.status,
            position: s.position,
            startedAt: s.startedAt,
            completedAt: s.completedAt,
            durationMs: s.durationMs,
          }))}
          executionStatus={data.status}
          onStepClick={(stepId) => {
            setSelectedStepId(stepId);
            setActiveTab("steps");
          }}
        />
      )}

      {activeTab === "memory" && (
        <MemoryInspector
          entries={data.memoryEntries}
          events={data.memoryEvents}
          steps={data.steps.map((s) => ({
            id: s.id,
            nodeName: s.nodeName,
            nodeType: s.nodeType,
            position: s.position,
          }))}
        />
      )}
    </div>
  );
};
