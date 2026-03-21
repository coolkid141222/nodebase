"use client";

import { Position, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { RotateCwIcon } from "lucide-react";
import { BaseExcutionNode } from "@/components/base-execution-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { buildTemplateVariableOptions } from "@/features/executions/components/template-variables";
import { LoopDialog, type LoopFormValues } from "./dialog";
import type { LoopNodeData } from "../shared";

export const LoopNode = memo((props: NodeProps) => {
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data as LoopNodeData;
  const nodeStatus = useWorkflowNodeStatus(props.id);
  const templateVariables = buildTemplateVariableOptions({
    currentNodeId: props.id,
    nodes: getNodes(),
    edges: getEdges(),
  });
  const maxIterations = nodeData.maxIterations ?? 3;

  const handleSubmit = (values: LoopFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                maxIterations: values.maxIterations,
                memoryWrites: values.memoryWrites,
              },
            }
          : node,
      ),
    );
    setDialogOpen(false);
  };

  return (
    <>
      {dialogOpen && (
        <LoopDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultMaxIterations={nodeData.maxIterations}
          defaultMemoryWrites={nodeData.memoryWrites}
          templateVariables={templateVariables}
        />
      )}
      <BaseExcutionNode
        {...props}
        icon={RotateCwIcon}
        iconClassName={nodeStatus === "loading" ? "animate-spin text-blue-700" : undefined}
        name="Loop"
        status={nodeStatus}
        nodeClassName="h-[56px] min-w-[112px] rounded-xl border-dashed"
        contentClassName="relative px-3"
        hideDefaultHandles
        handles={
          <>
            <BaseHandle id="target-entry" type="target" position={Position.Left} />
            <BaseHandle id="source-exit" type="source" position={Position.Right} />
            <BaseHandle
              id="source-body"
              type="source"
              position={Position.Bottom}
              style={{ left: "34%" }}
            />
            <BaseHandle
              id="target-body"
              type="target"
              position={Position.Bottom}
              style={{ left: "66%" }}
            />
          </>
        }
        onSetting={() => setDialogOpen(true)}
      >
        <div className="pointer-events-none absolute top-1.5 right-1.5 rounded-full border border-border/70 bg-background px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {maxIterations}x
        </div>
      </BaseExcutionNode>
    </>
  );
});

LoopNode.displayName = "LoopNode";
