"use client";

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

export const ExecutionDetails = ({ id }: { id: string }) => {
  const execution = useSuspenseExecution(id);
  const data = execution.data;

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

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Execution Memory</CardTitle>
          <CardDescription>
            Shared memory is visible across the current run. Node memory is private to the owner node.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <JsonBlock
            title="Memory Entries"
            value={data.memoryEntries.map((entry) => ({
              scope: entry.scope,
              visibility: entry.visibility,
              ownerNodeId: entry.ownerNodeId || null,
              namespace: entry.namespace,
              key: entry.key,
              sourceStepId: entry.sourceStepId,
              value: entry.value,
            }))}
          />
          <JsonBlock
            title="Memory Events"
            value={data.memoryEvents.map((event) => ({
              stepId: event.stepId,
              nodeId: event.nodeId || null,
              scope: event.scope,
              visibility: event.visibility,
              ownerNodeId: event.ownerNodeId || null,
              namespace: event.namespace,
              key: event.key,
              mode: event.mode,
              value: event.value,
              createdAt: event.createdAt,
            }))}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {data.steps.map((step) => (
          <Card key={step.id} className="shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
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
        ))}
      </div>
    </div>
  );
};
