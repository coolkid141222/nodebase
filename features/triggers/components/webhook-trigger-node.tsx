"use client";

import type { NodeProps } from "@xyflow/react";
import { LinkIcon } from "lucide-react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useParams } from "next/navigation";
import { BaseTriggerNode } from "./base-trigger-node";
import {
  WebhookTriggerDialog,
  type WebhookTriggerFormValues,
} from "./webhook-trigger-dialog";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/user-workflows";
import { buildTemplateVariableOptions } from "@/features/executions/components/template-variables";
import type { TriggerNodeData } from "../shared";

const WebhookTriggerNodeComponent = (props: NodeProps) => {
  const params = useParams<{ workflowId: string }>();
  const workflowId = params.workflowId;
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data as TriggerNodeData;
  const nodeStatus = useWorkflowNodeStatus(props.id);
  const templateVariables = buildTemplateVariableOptions({
    currentNodeId: props.id,
    nodes: getNodes(),
    edges: getEdges(),
  });

  const description = workflowId
    ? `POST /api/webhooks/${workflowId}?token=••••••••`
    : "POST /api/webhooks/[workflowId]?token=...";
  const handleSave = (values: WebhookTriggerFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                memoryWrites: values.memoryWrites,
              },
            }
          : node,
      ),
    );
  };

  return (
    <>
      {dialogOpen && (
        <WebhookTriggerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          workflowId={workflowId}
          webhookSecret={workflow.webhookSecret}
          onSave={handleSave}
          defaultMemoryWrites={nodeData.memoryWrites}
          templateVariables={templateVariables}
        />
      )}
      <BaseTriggerNode
        {...props}
        icon={LinkIcon}
        name="When webhook received"
        description={description}
        onSetting={() => setDialogOpen(true)}
        status={nodeStatus}
      />
    </>
  );
};

export const WebhookTriggerNode = memo(WebhookTriggerNodeComponent);

WebhookTriggerNodeComponent.displayName = "WebhookTriggerNode";
WebhookTriggerNode.displayName = "WebhookTriggerNode";
