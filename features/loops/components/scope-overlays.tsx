"use client";

import { useMemo } from "react";
import { type Edge, type Node, ViewportPortal } from "@xyflow/react";
import { RotateCwIcon } from "lucide-react";
import { buildLoopScopes } from "../lib/build-loop-scopes";

type Props = {
  nodes: Node[];
  edges: Edge[];
};

export function LoopScopeOverlays({ nodes, edges }: Props) {
  const scopes = useMemo(() => buildLoopScopes({ nodes, edges }), [nodes, edges]);

  if (scopes.length === 0) {
    return null;
  }

  return (
    <ViewportPortal>
      <>
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
              <div className="rounded-2xl border border-primary/15 bg-background/94 px-3.5 py-2 shadow-sm backdrop-blur">
                <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <RotateCwIcon className="size-3 text-primary/80" />
                  Loop Scope
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Repeats the enclosed region up to{" "}
                  <span className="font-semibold text-foreground">
                    {scope.maxIterations} iterations
                  </span>
                  .
                </div>
              </div>
              <div className="rounded-full border border-primary/15 bg-background/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur">
                {scope.bodyNodeCount} node{scope.bodyNodeCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        ))}
      </>
    </ViewportPortal>
  );
}
