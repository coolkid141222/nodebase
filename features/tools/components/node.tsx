"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { WrenchIcon } from "lucide-react";
import { BaseExcutionNode } from "@/components/base-execution-node";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { buildTemplateVariableOptions } from "@/features/executions/components/template-variables";
import { ToolDialog, type ToolFormValues } from "./dialog";
import { getToolProviderLabel, type ToolNodeData } from "../node/shared";

export const ToolNode = memo((props: NodeProps) => {
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const nodeData = props.data as ToolNodeData;
  const nodeStatus = useWorkflowNodeStatus(props.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const templateVariables = buildTemplateVariableOptions({
    currentNodeId: props.id,
    nodes: getNodes(),
    edges: getEdges(),
  });

  const providerLabel = getToolProviderLabel(nodeData.provider);
  const toolLabel =
    nodeData.toolDisplayName?.trim() || nodeData.toolId?.trim() || "";
  const serverLabel =
    nodeData.provider === "MCP"
      ? nodeData.serverDisplayName?.trim() || nodeData.serverId?.trim() || ""
      : "";
  const description = toolLabel
    ? `${providerLabel} · ${toolLabel}${serverLabel ? ` · ${serverLabel}` : ""}`
    : "Select a tool source";

  const handleSubmit = (values: ToolFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                provider: values.provider,
                serverId: values.serverId,
                serverDisplayName: values.serverDisplayName,
                toolId: values.toolId,
                toolDisplayName: values.toolDisplayName,
                argumentsJson: values.argumentsJson,
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
        <ToolDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultProvider={nodeData.provider}
          defaultServerId={nodeData.serverId}
          defaultServerDisplayName={nodeData.serverDisplayName}
          defaultToolId={nodeData.toolId}
          defaultToolDisplayName={nodeData.toolDisplayName}
          defaultArgumentsJson={nodeData.argumentsJson}
          defaultMemoryWrites={nodeData.memoryWrites}
          templateVariables={templateVariables}
        />
      )}
      <BaseExcutionNode
        {...props}
        icon={WrenchIcon}
        name="Tool"
        description={description}
        status={nodeStatus}
        onSetting={() => setDialogOpen(true)}
      />
    </>
  );
});

ToolNode.displayName = "ToolNode";
