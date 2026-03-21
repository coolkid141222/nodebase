import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "./base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useParams } from "next/navigation";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { useExecuteWorkflow } from "@/features/executions/hooks/use-execute-workflow";

const ManualTriggerNodeComponent = (props: NodeProps) => {
    const params = useParams<{ workflowId: string }>();
    const workflowId = params.workflowId;
    const workflowExecution = useExecuteWorkflow(workflowId);
    const [dialogOpen, setDialogOpen] = useState(false);
    const runtimeStatus = useWorkflowNodeStatus(props.id);
    const nodeStatus = workflowExecution.isPending || runtimeStatus === "loading"
        ? "loading"
        : runtimeStatus;
    const handleOpenSettings = () => setDialogOpen(true);
    const handleTrigger = async () => {
        return workflowExecution.executeWorkflow();
    };
    return (
        <>
            {dialogOpen && (
                <ManualTriggerDialog 
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onTrigger={handleTrigger}
                    disabled={workflowExecution.isPending || !workflowExecution.editorReady}
                    isPending={workflowExecution.isPending}
                    pendingLabel={workflowExecution.isSaving ? "Saving..." : "Running..."}
                />
            )}
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
