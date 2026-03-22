"use client";

import { useMemo } from "react";
import { type Edge, type Node, ViewportPortal } from "@xyflow/react";
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
            <div className="absolute bottom-4 left-5 inline-flex max-w-[280px] items-center gap-2 rounded-full border border-primary/15 bg-background/95 px-3 py-1.5 shadow-sm backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Loop Scope
              </div>
              <div className="h-3 w-px bg-border/80" />
              <div className="text-[11px] font-medium text-foreground whitespace-nowrap">
                {scope.maxIterations}x iterations
              </div>
              <div className="h-3 w-px bg-border/80" />
              <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                {scope.bodyNodeCount} node{scope.bodyNodeCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        ))}
      </>
    </ViewportPortal>
  );
}
