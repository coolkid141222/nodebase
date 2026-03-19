"use client";

import type { NodeProps } from "@xyflow/react";
import { LinkIcon } from "lucide-react";
import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { BaseTriggerNode } from "./base-trigger-node";
import { WebhookTriggerDialog } from "./webhook-trigger-dialog";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";

const WebhookTriggerNodeComponent = (props: NodeProps) => {
  const params = useParams<{ workflowId: string }>();
  const workflowId = params.workflowId;
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = useWorkflowNodeStatus(props.id);

  const description = workflowId
    ? `POST /api/webhooks/${workflowId}`
    : "POST /api/webhooks/[workflowId]";

  return (
    <>
      <WebhookTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        workflowId={workflowId}
      />
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
