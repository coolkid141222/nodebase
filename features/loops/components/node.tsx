"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { RotateCwIcon } from "lucide-react";
import { BaseExcutionNode } from "@/components/base-execution-node";
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
  const description = `Repeat the surrounding cycle up to ${maxIterations} iteration${maxIterations === 1 ? "" : "s"}`;

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
        name="Loop"
        description={description}
        status={nodeStatus}
        onSetting={() => setDialogOpen(true)}
      />
    </>
  );
});

LoopNode.displayName = "LoopNode";
