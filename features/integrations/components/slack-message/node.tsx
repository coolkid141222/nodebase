"use client";

import type { NodeProps } from "@xyflow/react";
import { MessageSquareIcon } from "lucide-react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { BaseExcutionNode } from "@/components/base-execution-node";
import {
  SlackMessageDialog,
  type SlackMessageFormValues,
} from "./dialog";
import type { SlackMessageNodeData } from "../../slack/shared";

export const SlackMessageNode = memo((props: NodeProps) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data as SlackMessageNodeData;
  const [dialogOpen, setDialogOpen] = useState(false);

  const description = nodeData.content
    ? `${nodeData.content.slice(0, 44)}${nodeData.content.length > 44 ? "..." : ""}${nodeData.credentialId ? " · credential" : ""}`
    : "Not configured";

  const handleSubmit = (values: SlackMessageFormValues) => {
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
      <SlackMessageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultCredentialId={nodeData.credentialId}
        defaultCredentialField={nodeData.credentialField}
        defaultContent={nodeData.content}
      />
      <BaseExcutionNode
        {...props}
        icon={MessageSquareIcon}
        name="Slack Message"
        status="success"
        description={description}
        onSetting={() => setDialogOpen(true)}
      />
    </>
  );
});

SlackMessageNode.displayName = "SlackMessageNode";
