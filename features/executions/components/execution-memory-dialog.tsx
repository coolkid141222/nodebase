"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { CardContent } from "@/components/card";
import { Badge } from "@/components/badge";
import { DatabaseIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExecutionMemoryEntry, ExecutionMemoryEvent } from "@/lib/prisma/client";

interface ExecutionMemoryDialogProps {
  executionId: string;
  entries: ExecutionMemoryEntry[];
  events: ExecutionMemoryEvent[];
  children?: React.ReactNode;
}

const scopeVariant: Record<string, "default" | "secondary"> = {
  SHARED: "default",
  NODE: "secondary",
};

const visibilityVariant = {
  PUBLIC: "default",
  PRIVATE: "outline",
} as const;

function JsonValue({ value }: { value: unknown }) {
  if (value == null) {
    return <span className="text-muted-foreground">null</span>;
  }

  const str = JSON.stringify(value);
  if (str.length > 150) {
    return (
      <span className="font-mono text-xs">
        {str.slice(0, 150)}...
      </span>
    );
  }

  return <pre className="font-mono text-xs whitespace-pre-wrap">{str}</pre>;
}

export function ExecutionMemoryDialog({
  executionId,
  entries,
  events,
  children,
}: ExecutionMemoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"entries" | "events">("entries");

  const filteredEntries = useMemo(() => {
    if (!search) return entries;
    const searchLower = search.toLowerCase();
    return entries.filter(
      (entry) =>
        `${entry.namespace}.${entry.key}`.toLowerCase().includes(searchLower) ||
        JSON.stringify(entry.value).toLowerCase().includes(searchLower),
    );
  }, [entries, search]);

  const filteredEvents = useMemo(() => {
    if (!search) return events;
    const searchLower = search.toLowerCase();
    return events.filter(
      (event) =>
        `${event.namespace}.${event.key}`.toLowerCase().includes(searchLower) ||
        JSON.stringify(event.value).toLowerCase().includes(searchLower),
    );
  }, [events, search]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, typeof filteredEntries>();
    for (const entry of filteredEntries) {
      const scope = entry.scope;
      if (!groups.has(scope)) {
        groups.set(scope, []);
      }
      groups.get(scope)!.push(entry);
    }
    return groups;
  }, [filteredEntries]);

  const groupedEvents = useMemo(() => {
    const groups = new Map<string, typeof filteredEvents>();
    for (const event of filteredEvents) {
      const key = `${event.scope}-${event.namespace}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    }
    return groups;
  }, [filteredEvents]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <DatabaseIcon className="size-4 mr-2" />
            Execution Memory
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DatabaseIcon className="size-5" />
            Execution Memory
          </DialogTitle>
          <DialogDescription>
            Memory state during execution {executionId.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        {/* View Mode Toggle */}
        <div className="flex gap-2 py-2">
          <Button
            variant={viewMode === "entries" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("entries")}
          >
            Entries ({entries.length})
          </Button>
          <Button
            variant={viewMode === "events" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("events")}
          >
            Timeline ({events.length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search keys or values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-0">
          {viewMode === "entries" ? (
            filteredEntries.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No memory entries
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {Array.from(groupedEntries.entries()).map(([scope, scopeEntries]) => (
                  <div key={scope}>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant={scopeVariant[scope]}>{scope}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {scopeEntries.length} entries
                      </span>
                    </div>
                    <div className="space-y-2">
                      {scopeEntries.map((entry) => (
                        <div
                          key={`${entry.scope}-${entry.namespace}-${entry.key}`}
                          className="rounded-lg border p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-medium">
                                {entry.namespace}.{entry.key}
                              </code>
                              <Badge variant={visibilityVariant[entry.visibility]} className="text-[10px]">
                                {entry.visibility}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 rounded bg-muted p-2">
                            <JsonValue value={entry.value} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredEvents.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No memory events
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredEvents.map((event, idx) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg border p-3",
                      idx % 2 === 0 ? "bg-muted/20" : "bg-background",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-medium">
                          {event.namespace}.{event.key}
                        </code>
                        <Badge variant="outline" className="text-[10px]">
                          {event.mode}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-2 rounded bg-muted p-2">
                      <JsonValue value={event.value} />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
