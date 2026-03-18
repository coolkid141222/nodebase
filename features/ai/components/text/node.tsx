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

export const AITextNode = memo((props: NodeProps) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data as AITextNodeData;
  const [dialogOpen, setDialogOpen] = useState(false);
  const provider = nodeData.provider ?? "GOOGLE";
  const providerLabel =
    provider === "OPENAI"
      ? "OpenAI"
      : provider === "ANTHROPIC"
        ? "Anthropic"
        : "Gemini";
  const model = nodeData.model || getDefaultAITextModel(provider);

  const description = nodeData?.prompt
    ? `${providerLabel} · ${model} · ${nodeData.prompt.slice(0, 36)}${nodeData.prompt.length > 36 ? "..." : ""}`
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
              },
            }
          : node,
      ),
    );
    setDialogOpen(false);
  };

  return (
    <>
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
      />
      <BaseExcutionNode
        {...props}
        icon={BotIcon}
        name="AI Text"
        status="success"
        description={description}
        onSetting={() => setDialogOpen(true)}
      />
    </>
  );
});

AITextNode.displayName = "AITextNode";
