"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { BotIcon } from "lucide-react";
import { BaseExcutionNode } from "@/components/base-execution-node";
import { AITextDialog, type AITextFormValues } from "./dialog";
import {
  getDefaultAITextModel,
  type AITextNodeData,
} from "../../text/shared";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { buildTemplateVariableOptions } from "@/features/executions/components/template-variables";

export const AITextNode = memo((props: NodeProps) => {
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const nodeData = props.data as AITextNodeData;
  const nodeStatus = useWorkflowNodeStatus(props.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const provider = nodeData.provider ?? "GOOGLE";
  const providerLabelMap = {
    GOOGLE: "Gemini",
    OPENAI: "OpenAI",
    ANTHROPIC: "Anthropic",
    DEEPSEEK: "DeepSeek",
    MINIMAX: "MiniMax",
  } as const;
  const providerLabel = providerLabelMap[provider];
  const model = nodeData.model || getDefaultAITextModel(provider);
  const templateVariables = buildTemplateVariableOptions({
    currentNodeId: props.id,
    nodes: getNodes(),
    edges: getEdges(),
  });

  const description = nodeData?.prompt
    ? `${providerLabel} · ${model}${nodeData.toolEnabled && nodeData.toolId ? " · browser context" : ""}${nodeData.memoryContextEnabled ? " · memory recall" : ""} · ${nodeData.prompt.slice(0, 36)}${nodeData.prompt.length > 36 ? "..." : ""}`
    : "Not configured";

  const handleSubmit = (values: AITextFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                provider: values.provider,
                model: values.model,
                prompt: values.prompt,
                system: values.system || "",
                credentialId: values.credentialId,
                credentialField: values.credentialField.trim(),
                toolEnabled: values.toolEnabled,
                toolProvider: values.toolProvider,
                toolServerId: values.toolServerId,
                toolId: values.toolId,
                toolDisplayName: values.toolDisplayName,
                toolArgumentsJson: values.toolArgumentsJson,
                memoryContextEnabled: values.memoryContextEnabled,
                memoryContextScope: values.memoryContextScope,
                memoryContextQuery: values.memoryContextQuery,
                memoryContextLimit: values.memoryContextLimit,
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
        <AITextDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultProvider={nodeData.provider}
          defaultModel={nodeData.model}
          defaultPrompt={nodeData.prompt}
          defaultSystem={nodeData.system}
          defaultCredentialId={nodeData.credentialId}
          defaultCredentialField={nodeData.credentialField}
          defaultToolEnabled={nodeData.toolEnabled}
          defaultToolProvider={nodeData.toolProvider}
          defaultToolServerId={nodeData.toolServerId}
          defaultToolId={nodeData.toolId}
          defaultToolDisplayName={nodeData.toolDisplayName}
          defaultToolArgumentsJson={nodeData.toolArgumentsJson}
          defaultMemoryContextEnabled={nodeData.memoryContextEnabled}
          defaultMemoryContextScope={nodeData.memoryContextScope}
          defaultMemoryContextQuery={nodeData.memoryContextQuery}
          defaultMemoryContextLimit={nodeData.memoryContextLimit}
          defaultMemoryWrites={nodeData.memoryWrites}
          templateVariables={templateVariables}
        />
      )}
      <BaseExcutionNode
        {...props}
        icon={BotIcon}
        name="AI Text"
        description={description}
        status={nodeStatus}
        onSetting={() => setDialogOpen(true)}
      />
    </>
  );
});

AITextNode.displayName = "AITextNode";
