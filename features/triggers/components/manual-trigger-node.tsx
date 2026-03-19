import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "./base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useParams } from "next/navigation";
import { useManualWorkflowExecution } from "@/features/executions/hooks/use-manual-workflow-execution";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";

const ManualTriggerNodeComponent = (props: NodeProps) => {
    const params = useParams<{ workflowId: string }>();
    const workflowId = params.workflowId;
    const manualExecution = useManualWorkflowExecution();
    const [dialogOpen, setDialogOpen] = useState(false);
    const runtimeStatus = useWorkflowNodeStatus(props.id);
    const nodeStatus = manualExecution.isPending || runtimeStatus === "loading"
        ? "loading"
        : runtimeStatus;
    const handleOpenSettings = () => setDialogOpen(true);
    const handleTrigger = () => {
        manualExecution.mutate({
            workflowId,
        });
    };

    return (
        <>
            <ManualTriggerDialog 
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onTrigger={handleTrigger}
                disabled={manualExecution.isPending}
            />
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute workflow'"
                onSetting={handleOpenSettings}
                status={nodeStatus}
            >
            </BaseTriggerNode>
        </>
    )
}

export const ManualTriggerNode = memo(ManualTriggerNodeComponent);

ManualTriggerNodeComponent.displayName = "ManualTriggerNode";
ManualTriggerNode.displayName = "ManualTriggerNode";
