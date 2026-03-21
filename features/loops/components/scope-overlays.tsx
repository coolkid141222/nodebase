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
            <div className="absolute inset-0 rounded-[28px] border border-dashed border-primary/35 bg-primary/[0.045] shadow-[inset_0_0_0_1px_rgba(234,88,12,0.06)]" />
            <div className="absolute top-0 left-6 -translate-y-1/2 rounded-full border border-primary/20 bg-background/96 px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur">
              <span className="inline-flex items-center gap-1.5">
                <RotateCwIcon className="size-3 text-primary/80" />
                LOOP SCOPE
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.2em] text-primary">
                  {scope.maxIterations}X
                </span>
              </span>
            </div>
          </div>
        ))}
      </>
    </ViewportPortal>
  );
}
