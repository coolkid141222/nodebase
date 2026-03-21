"use client";

import { useMemo } from "react";
import { type Edge, type Node, ViewportPortal } from "@xyflow/react";
import { AlertCircleIcon, RotateCwIcon } from "lucide-react";
import { buildLoopScopes, getLoopNodeVisualRect } from "../lib/build-loop-scopes";

type Props = {
  nodes: Node[];
  edges: Edge[];
};

export function LoopScopeOverlays({ nodes, edges }: Props) {
  const scopes = useMemo(() => buildLoopScopes({ nodes, edges }), [nodes, edges]);
  const loopNodes = useMemo(
    () => nodes.filter((node) => node.type === "LOOP"),
    [nodes],
  );
  const activeLoopIds = useMemo(
    () => new Set(scopes.map((scope) => scope.id)),
    [scopes],
  );

  if (scopes.length === 0 && loopNodes.length === 0) {
    return null;
  }

  return (
    <ViewportPortal>
      <>
        {loopNodes.map((node) => {
          const rect = getLoopNodeVisualRect(node);
          const isActive = activeLoopIds.has(node.id);

          return (
            <div
              key={`loop-anchor-${node.id}`}
              className="pointer-events-none absolute"
              style={{
                left: rect.x + rect.width / 2,
                top: rect.y - 14,
                transform: "translateX(-50%)",
              }}
            >
              <div
                className={
                  isActive
                    ? "rounded-full border border-primary/20 bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur"
                    : "inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700 shadow-sm backdrop-blur"
                }
              >
                {isActive ? (
                  <>
                    <RotateCwIcon className="size-3" />
                    Loop Controller
                  </>
                ) : (
                  <>
                    <AlertCircleIcon className="size-3" />
                    Close a cycle
                  </>
                )}
              </div>
            </div>
          );
        })}
        {scopes.map((scope) => (
          <div
            key={scope.id}
            className="pointer-events-none absolute"
            style={{
              left: scope.x,
              top: scope.y,
              width: scope.width,
              height: scope.height,
            }}
          >
            <div className="absolute inset-0 rounded-[28px] border border-dashed border-primary/30 bg-primary/[0.04] shadow-[inset_0_0_0_1px_rgba(234,88,12,0.05)]" />
            <div className="absolute inset-x-5 top-4 flex items-start justify-between gap-3">
              <div className="max-w-[320px] rounded-2xl border border-primary/15 bg-background/94 px-3.5 py-2 shadow-sm backdrop-blur">
                <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <RotateCwIcon className="size-3 text-primary/80" />
                  Loop Scope
                </div>
                <div className="mt-1 text-xs font-medium text-foreground">
                  Repeats the enclosed flow up to {scope.maxIterations} iterations.
                </div>
                <div className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {scope.bodyNodeNames.length > 0 ? (
                    <>
                      Body:{" "}
                      <span className="text-foreground">
                        {scope.bodyNodeNames.slice(0, 3).join(" -> ")}
                      </span>
                      {scope.bodyNodeNames.length > 3 ? " ..." : ""}
                    </>
                  ) : (
                    "Connect a closed cycle through this node to activate the loop body."
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="rounded-full border border-primary/15 bg-background/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur">
                  {scope.bodyNodeCount} body node{scope.bodyNodeCount === 1 ? "" : "s"}
                </div>
                <div className="rounded-full border border-border/80 bg-background/92 px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur">
                  Downstream nodes run after the final pass
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    </ViewportPortal>
  );
}
