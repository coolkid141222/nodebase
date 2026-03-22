"use client";

import { useMemo } from "react";
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
  ChevronRightIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExecutionStepStatus, ExecutionStatus } from "@/lib/prisma/client";

type TimelineStep = {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: ExecutionStepStatus;
  position: number;
  startedAt: Date | null;
  completedAt: Date | null;
  durationMs: number | null;
};

interface ExecutionTimelineProps {
  steps: TimelineStep[];
  executionStatus: ExecutionStatus;
  onStepClick?: (stepId: string) => void;
}

const stepStatusIcon = {
  PENDING: Clock,
  RUNNING: Clock,
  SUCCESS: CheckCircle2,
  FAILED: XCircle,
  SKIPPED: SkipForward,
};

const stepStatusColor = {
  PENDING: "text-zinc-400",
  RUNNING: "text-blue-500",
  SUCCESS: "text-emerald-500",
  FAILED: "text-red-500",
  SKIPPED: "text-zinc-400",
};

const stepStatusBg = {
  PENDING: "bg-zinc-100 dark:bg-zinc-800",
  RUNNING: "bg-blue-100 dark:bg-blue-900",
  SUCCESS: "bg-emerald-100 dark:bg-emerald-900",
  FAILED: "bg-red-100 dark:bg-red-900",
  SKIPPED: "bg-zinc-100 dark:bg-zinc-800",
};

export function ExecutionTimeline({
  steps,
  executionStatus,
  onStepClick,
}: ExecutionTimelineProps) {
  const sortedSteps = useMemo(
    () => [...steps].sort((a, b) => a.position - b.position),
    [steps],
  );

  const totalDuration = useMemo(() => {
    if (!steps.length) return 0;
    const lastCompleted = steps.find((s) => s.completedAt);
    if (!lastCompleted?.completedAt || !steps[0]?.startedAt) return 0;
    return new Date(lastCompleted.completedAt).getTime() - new Date(steps[0].startedAt!).getTime();
  }, [steps]);

  // Calculate relative timing for each step
  const stepsWithTiming = useMemo(() => {
    if (!sortedSteps.length || !sortedSteps[0]?.startedAt) {
      return sortedSteps.map((step) => ({
        ...step,
        relativeStart: 0,
        relativeEnd: 0,
      }));
    }

    const startTime = new Date(sortedSteps[0].startedAt!).getTime();

    return sortedSteps.map((step) => {
      const startMs = step.startedAt
        ? new Date(step.startedAt).getTime() - startTime
        : 0;
      const endMs = step.completedAt
        ? new Date(step.completedAt).getTime() - startTime
        : totalDuration;
      return {
        ...step,
        relativeStart: startMs,
        relativeEnd: endMs,
      };
    });
  }, [sortedSteps, totalDuration]);

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Execution Timeline</CardTitle>
            <CardDescription>
              {steps.length} steps · {totalDuration}ms total
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Bar */}
        <div className="relative h-8 rounded-full bg-muted overflow-hidden">
          {stepsWithTiming.map((step, idx) => {
            const widthPercent = totalDuration > 0
              ? ((step.relativeEnd - step.relativeStart) / totalDuration) * 100
              : 100 / stepsWithTiming.length;
            const leftPercent = totalDuration > 0
              ? (step.relativeStart / totalDuration) * 100
              : (idx / stepsWithTiming.length) * 100;

            const StatusIcon = stepStatusIcon[step.status];
            const bgColor = stepStatusBg[step.status];

            return (
              <div
                key={step.id}
                className={cn(
                  "absolute top-0 h-full cursor-pointer transition-opacity hover:opacity-80",
                  bgColor,
                )}
                style={{
                  left: `${leftPercent}%`,
                  width: `${Math.max(widthPercent, 2)}%`,
                }}
                onClick={() => onStepClick?.(step.id)}
                title={`${step.nodeName}: ${step.status}`}
              >
                {widthPercent > 5 && (
                  <div className="flex h-full items-center justify-center">
                    <StatusIcon className={cn("size-3", stepStatusColor[step.status])} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step List */}
        <div className="space-y-2">
          {stepsWithTiming.map((step, idx) => {
            const StatusIcon = stepStatusIcon[step.status];

            return (
              <button
                key={step.id}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                  step.status === "FAILED" && "border-red-200 dark:border-red-900",
                  step.status === "SUCCESS" && "border-emerald-200 dark:border-emerald-900",
                )}
              >
                {/* Position */}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {step.position}
                </div>

                {/* Icon */}
                <div className={cn("rounded-full p-1", stepStatusBg[step.status])}>
                  <StatusIcon className={cn("size-3.5", stepStatusColor[step.status])} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-sm">{step.nodeName}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {step.nodeType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase">{step.status}</span>
                    {step.durationMs !== null && (
                      <>
                        <span>·</span>
                        <span>{step.durationMs}ms</span>
                      </>
                    )}
                    {step.startedAt && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(step.startedAt).toLocaleTimeString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                {idx < stepsWithTiming.length - 1 && (
                  <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>Pending/Running</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-500" />
            <span>Success</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="size-3 text-red-500" />
            <span>Failed</span>
          </div>
          <div className="flex items-center gap-1">
            <SkipForward className="size-3" />
            <span>Skipped</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
