"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Button } from "@/components/button";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Copy,
  Check,
  Search,
} from "lucide-react";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TemplateResolution = {
  expression: string;
  resolved: unknown;
  path: string;
  timestamp: string;
};

type ContextKey = {
  path: string;
  description: string;
  example: string;
};

const CONTEXT_KEYS: ContextKey[] = [
  { path: "trigger", description: "Trigger payload", example: "{{trigger.body.message}}" },
  { path: "input", description: "Current node semantic input", example: "{{input}}" },
  { path: "inputRaw", description: "Current node raw input", example: "{{inputRaw}}" },
  { path: "current.attempt", description: "Loop attempt number", example: "{{current.attempt}}" },
  { path: "current.status", description: "Current node status", example: "{{current.status}}" },
  { path: "current.output", description: "Current node output", example: "{{current.output.text}}" },
  { path: "memory.shared", description: "Shared memory", example: "{{memory.shared.run.lastNode}}" },
  { path: "memory.node", description: "Node private memory", example: "{{memory.node.run.input}}" },
  { path: "memory.persistent.workflow", description: "Workflow persistent memory", example: "{{memory.persistent.workflow.context}}" },
  { path: "memory.persistent.user", description: "User persistent memory", example: "{{memory.persistent.user.preferences}}" },
  { path: "steps.{nodeId}", description: "Step output by ID", example: "{{steps.node_123.output}}" },
  { path: "upstream", description: "Upstream nodes", example: "{{upstream[0].output}}" },
];

interface TemplateDebuggerProps {
  resolutions: TemplateResolution[];
  title?: string;
}

export function TemplateDebugger({
  resolutions,
  title = "Template Debugger",
}: TemplateDebuggerProps) {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showContextKeys, setShowContextKeys] = useState(true);

  const filteredResolutions = resolutions.filter(
    (res) =>
      res.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(res.resolved).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>
              {resolutions.length} template expressions resolved
            </CardDescription>
          </div>
          {expanded ? (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          )}
        </button>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expressions or values..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Template Resolutions Table */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Resolved Expressions
            </div>
            {filteredResolutions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
                {searchQuery ? "No matching expressions" : "No template expressions recorded"}
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/30 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Expression</th>
                      <th className="px-3 py-2 text-left font-medium">Resolved Value</th>
                      <th className="px-3 py-2 text-left font-medium">Path</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResolutions.map((res, idx) => (
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
                        <td className="px-3 py-2 text-muted-foreground font-mono text-[10px]">
                          {res.path}
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5"
                            onClick={() => handleCopy(`{{${res.expression}}}`)}
                          >
                            <Copy className="size-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Available Context Keys */}
          <div className="space-y-2">
            <button
              onClick={() => setShowContextKeys(!showContextKeys)}
              className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              {showContextKeys ? (
                <ChevronDownIcon className="size-3" />
              ) : (
                <ChevronRightIcon className="size-3" />
              )}
              Available Context Keys
            </button>
            {showContextKeys && (
              <div className="grid gap-2 md:grid-cols-2">
                {CONTEXT_KEYS.map((key) => (
                  <div
                    key={key.path}
                    className="rounded-lg border bg-muted/20 p-2 text-xs"
                  >
                    <div className="font-mono text-violet-600">{key.path}</div>
                    <div className="text-muted-foreground">{key.description}</div>
                    <div className="mt-1 font-mono text-[10px] text-emerald-600">
                      {key.example}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
