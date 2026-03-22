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
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DatabaseIcon, Trash2Icon } from "lucide-react";
import { useI18n } from "@/features/i18n/provider";
import { toast } from "sonner";

interface MemoryDialogProps {
  workflowId: string;
  children?: React.ReactNode;
}

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

export function PersistentMemoryDialog({ workflowId, children }: MemoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useI18n();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: memoryData, isLoading, refetch } = useQuery(
    trpc.executions.getPersistentMemory.queryOptions(
      { workflowId },
      {
        enabled: open,
        staleTime: 0,
      },
    ),
  );

  const deleteMutation = useMutation(
    trpc.executions.deletePersistentMemory.mutationOptions({
      onSuccess: () => {
        toast.success(t("persistentMemory.deleted") || "Entry deleted");
        queryClient.invalidateQueries({
          queryKey: trpc.executions.getPersistentMemory.queryKey({ workflowId }),
        });
      },
      onError: () => {
        toast.error(t("persistentMemory.deleteFailed") || "Failed to delete entry");
      },
    }),
  );

  const handleDelete = (id: string) => {
    if (confirm(t("persistentMemory.confirmDelete") || "Are you sure you want to delete this entry?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredMemory = useMemo(() => {
    if (!memoryData?.entries) return [];
    if (!search) return memoryData.entries;

    const searchLower = search.toLowerCase();
    return memoryData.entries.filter(
      (entry) =>
        `${entry.namespace}.${entry.key}`.toLowerCase().includes(searchLower) ||
        JSON.stringify(entry.value).toLowerCase().includes(searchLower),
    );
  }, [memoryData, search]);

  const groupedMemory = useMemo(() => {
    const groups = new Map<string, typeof filteredMemory>();
    for (const entry of filteredMemory) {
      const ns = entry.namespace || "default";
      if (!groups.has(ns)) {
        groups.set(ns, []);
      }
      groups.get(ns)!.push(entry);
    }
    return groups;
  }, [filteredMemory]);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      refetch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <DatabaseIcon className="size-4 mr-2" />
            Memory
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DatabaseIcon className="size-5" />
            {t("persistentMemory.title") || "Workflow Memory"}
          </DialogTitle>
          <DialogDescription>
            {t("persistentMemory.description") ||
              "Persistent memory entries saved from workflow executions."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          <div className="relative flex-1">
            <Input
              placeholder={t("persistentMemory.search") || "Search keys or values..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Badge variant="secondary">
            {filteredMemory.length} {t("persistentMemory.entries") || "entries"}
          </Badge>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredMemory.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {search
                ? t("persistentMemory.noResults") || "No matching entries found"
                : t("persistentMemory.empty") || "No memory entries yet. Run the workflow to create entries."}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {Array.from(groupedMemory.entries()).map(([namespace, entries]) => (
                <div key={namespace}>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline">{namespace}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {entries.length} {t("persistentMemory.entries") || "entries"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={`${entry.namespace}-${entry.key}`}
                        className="group rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-medium">
                              {entry.key}
                            </code>
                            {entry.sourceExecutionId && (
                              <span className="text-xs text-muted-foreground">
                                from {entry.sourceExecutionId.slice(0, 8)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {entry.updatedAt
                                ? new Date(entry.updatedAt).toLocaleString()
                                : "-"}
                            </span>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="opacity-0 transition-opacity group-hover:opacity-100 p-1 hover:text-destructive"
                              title={t("persistentMemory.delete") || "Delete"}
                            >
                              <Trash2Icon className="size-3.5" />
                            </button>
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
          )}
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
