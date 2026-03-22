"use client";

import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Badge } from "@/components/badge";
import { Input } from "@/components/input";
import {
  ExecutionMemoryScope,
  ExecutionMemoryVisibility,
  ExecutionMemoryWriteMode,
  type ExecutionMemoryEntry,
  type ExecutionMemoryEvent,
} from "@/lib/prisma/client";
import { cn } from "@/lib/utils";

type MemoryEntry = ExecutionMemoryEntry & { stepName?: string; nodeName?: string };
type MemoryEvent = ExecutionMemoryEvent & { stepName?: string; nodeName?: string };

const scopeVariant = {
  SHARED: "default",
  NODE: "secondary",
} as const;

const visibilityVariant = {
  PUBLIC: "default",
  PRIVATE: "outline",
} as const;

const modeVariant = {
  REPLACE: "outline",
  MERGE: "default",
  APPEND: "secondary",
} as const;

interface MemoryInspectorProps {
  entries: MemoryEntry[];
  events: MemoryEvent[];
  steps: Array<{ id: string; nodeName: string; nodeType: string; position: number }>;
}

function JsonValue({ value, className }: { value: unknown; className?: string }) {
  if (value == null) {
    return <span className="text-muted-foreground">null</span>;
  }

  const str = JSON.stringify(value);
  if (str.length > 200) {
    return (
      <span className={cn("font-mono text-xs", className)}>
        {str.slice(0, 200)}...
      </span>
    );
  }

  return <pre className={cn("font-mono text-xs whitespace-pre-wrap", className)}>{str}</pre>;
}

function MemoryEventItem({
  event,
  index,
}: {
  event: MemoryEvent;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group flex flex-col gap-2 rounded-lg border p-3 transition-colors",
        index % 2 === 0 ? "bg-muted/20" : "bg-background",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left hover:text-foreground"
        >
          {expanded ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {event.stepName ?? event.stepId?.slice(0, 8) ?? "init"}
            </Badge>
            <Badge variant={modeVariant[event.mode] ?? "outline"}>
              {event.mode}
            </Badge>
            <Badge variant={scopeVariant[event.scope]}>
              {event.scope}
            </Badge>
            {event.visibility && (
              <Badge variant={visibilityVariant[event.visibility]}>
                {event.visibility}
              </Badge>
            )}
            <span className="font-mono text-sm font-medium">
              {event.namespace}.{event.key}
            </span>
          </div>
        </button>
        <span className="text-xs text-muted-foreground">
          {new Date(event.createdAt).toLocaleTimeString()}
        </span>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2 pl-6">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Step:</span>
              <span className="font-mono">{event.nodeName}</span>
            </div>
            {event.ownerNodeId && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-mono">{event.ownerNodeId}</span>
              </div>
            )}
          </div>
          <div className="rounded-md bg-muted p-2">
            <JsonValue value={event.value} />
          </div>
        </div>
      )}
    </div>
  );
}

function MemoryEntryItem({
  entry,
  index,
}: {
  entry: MemoryEntry;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group flex flex-col gap-2 rounded-lg border p-3 transition-colors",
        index % 2 === 0 ? "bg-muted/20" : "bg-background",
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between text-left hover:text-foreground"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
          <div className="flex items-center gap-2">
            <Badge variant={scopeVariant[entry.scope]}>
              {entry.scope}
            </Badge>
            {entry.visibility && (
              <Badge variant={visibilityVariant[entry.visibility]}>
                {entry.visibility}
              </Badge>
            )}
            <span className="font-mono text-sm font-medium">
              {entry.namespace}.{entry.key}
            </span>
            {entry.ownerNodeId && (
              <span className="text-xs text-muted-foreground">
                ← {entry.ownerNodeId.slice(0, 8)}
              </span>
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 pl-6">
          {entry.ownerNodeId && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Owner Node:</span>
              <span className="font-mono">{entry.ownerNodeId}</span>
            </div>
          )}
          {entry.sourceStepId && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Source Step:</span>
              <span className="font-mono">{entry.sourceStepId}</span>
            </div>
          )}
          <div className="rounded-md bg-muted p-2">
            <JsonValue value={entry.value} />
          </div>
        </div>
      )}
    </div>
  );
}

export function MemoryInspector({
  entries,
  events,
  steps,
}: MemoryInspectorProps) {
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ExecutionMemoryScope | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"events" | "entries">("events");

  const stepMap = useMemo(() => {
    return new Map(steps.map((s) => [s.id, s]));
  }, [steps]);

  const enrichedEvents = useMemo(() => {
    return events.map((e) => {
      const step = e.stepId ? stepMap.get(e.stepId) : null;
      return {
        ...e,
        stepName: step?.nodeName,
        nodeName: step?.nodeName,
      };
    });
  }, [events, stepMap]);

  const enrichedEntries = useMemo(() => {
    return entries.map((e) => {
      const step = e.sourceStepId ? stepMap.get(e.sourceStepId) : null;
      return {
        ...e,
        stepName: step?.nodeName,
        nodeName: step?.nodeName,
      };
    });
  }, [entries, stepMap]);

  const filteredEvents = useMemo(() => {
    return enrichedEvents.filter((e) => {
      if (scopeFilter !== "ALL" && e.scope !== scopeFilter) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        const key = `${e.namespace}.${e.key}`.toLowerCase();
        const value = JSON.stringify(e.value).toLowerCase();
        if (!key.includes(searchLower) && !value.includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }, [enrichedEvents, scopeFilter, search]);

  const filteredEntries = useMemo(() => {
    return enrichedEntries.filter((e) => {
      if (scopeFilter !== "ALL" && e.scope !== scopeFilter) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        const key = `${e.namespace}.${e.key}`.toLowerCase();
        const value = JSON.stringify(e.value).toLowerCase();
        if (!key.includes(searchLower) && !value.includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }, [enrichedEntries, scopeFilter, search]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Memory Inspector</CardTitle>
            <CardDescription>
              {viewMode === "events"
                ? `${filteredEvents.length} memory events`
                : `${filteredEntries.length} memory entries`}
              {search && ` (filtered)`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === "events" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("events")}
              >
                <ClockIcon className="size-4 mr-1" />
                Timeline
              </Button>
              <Button
                variant={viewMode === "entries" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("entries")}
              >
                Entries
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Search keys or values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value as ExecutionMemoryScope | "ALL")}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="ALL">All Scopes</option>
            <option value={ExecutionMemoryScope.SHARED}>SHARED</option>
            <option value={ExecutionMemoryScope.NODE}>NODE</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] space-y-1 overflow-y-auto">
          {viewMode === "events" ? (
            filteredEvents.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No memory events found
              </div>
            ) : (
              filteredEvents.map((event, i) => (
                <MemoryEventItem key={`${event.createdAt}-${i}`} event={event} index={i} />
              ))
            )
          ) : filteredEntries.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No memory entries found
            </div>
          ) : (
            filteredEntries.map((entry, i) => (
              <MemoryEntryItem key={`${entry.namespace}.${entry.key}`} entry={entry} index={i} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
