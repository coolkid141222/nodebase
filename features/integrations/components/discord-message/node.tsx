"use client";

import type { NodeProps } from "@xyflow/react";
import { MessageSquareIcon } from "lucide-react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { BaseExcutionNode } from "@/components/base-execution-node";
import {
  DiscordMessageDialog,
  type DiscordMessageFormValues,
} from "./dialog";
import type { DiscordMessageNodeData } from "../../discord/shared";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";

export const DiscordMessageNode = memo((props: NodeProps) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data as DiscordMessageNodeData;
  const nodeStatus = useWorkflowNodeStatus(props.id);
  const [dialogOpen, setDialogOpen] = useState(false);

  const description = nodeData.content
    ? `${nodeData.content.slice(0, 44)}${nodeData.content.length > 44 ? "..." : ""}${nodeData.credentialId ? " · credential" : ""}`
    : "Not configured";

  const handleSubmit = (values: DiscordMessageFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                credentialId: values.credentialId,
                credentialField: values.credentialField.trim(),
                content: values.content,
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
        <DiscordMessageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          defaultCredentialId={nodeData.credentialId}
          defaultCredentialField={nodeData.credentialField}
          defaultContent={nodeData.content}
        />
      )}
      <BaseExcutionNode
        {...props}
        icon={MessageSquareIcon}
        name="Discord Message"
        description={description}
        status={nodeStatus}
        onSetting={() => setDialogOpen(true)}
      />
    </>
  );
});

DiscordMessageNode.displayName = "DiscordMessageNode";
