"use client";

import type { NodeProps } from "@xyflow/react";
import { LinkIcon } from "lucide-react";
import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { BaseTriggerNode } from "./base-trigger-node";
import { WebhookTriggerDialog } from "./webhook-trigger-dialog";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/user-workflows";

const WebhookTriggerNodeComponent = (props: NodeProps) => {
  const params = useParams<{ workflowId: string }>();
  const workflowId = params.workflowId;
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = useWorkflowNodeStatus(props.id);

  const description = workflowId
    ? `POST /api/webhooks/${workflowId}?token=••••••••`
    : "POST /api/webhooks/[workflowId]?token=...";

  return (
    <>
      {dialogOpen && (
        <WebhookTriggerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          workflowId={workflowId}
          webhookSecret={workflow.webhookSecret}
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
