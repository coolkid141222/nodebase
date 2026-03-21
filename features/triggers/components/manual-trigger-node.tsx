import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "./base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog, type ManualTriggerFormValues } from "./dialog";
import { useParams } from "next/navigation";
import { useWorkflowNodeStatus } from "@/features/executions/components/workflow-execution-status-context";
import { useExecuteWorkflow } from "@/features/executions/hooks/use-execute-workflow";
import { useReactFlow } from "@xyflow/react";
import { buildTemplateVariableOptions } from "@/features/executions/components/template-variables";
import type { TriggerNodeData } from "../shared";

const ManualTriggerNodeComponent = (props: NodeProps) => {
    const params = useParams<{ workflowId: string }>();
    const workflowId = params.workflowId;
    const { setNodes, getNodes, getEdges } = useReactFlow();
    const workflowExecution = useExecuteWorkflow(workflowId);
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeData = props.data as TriggerNodeData;
    const runtimeStatus = useWorkflowNodeStatus(props.id);
    const nodeStatus = workflowExecution.isPending || runtimeStatus === "loading"
        ? "loading"
        : runtimeStatus;
    const templateVariables = buildTemplateVariableOptions({
        currentNodeId: props.id,
        nodes: getNodes(),
        edges: getEdges(),
    });
    const handleOpenSettings = () => setDialogOpen(true);
    const buildNextNodes = (values: ManualTriggerFormValues) => {
        return getNodes().map((node) =>
            node.id === props.id
                ? {
                    ...node,
                    data: {
                        ...node.data,
                        maxIterations: values.maxIterations,
                        memoryWrites: values.memoryWrites,
                    },
                }
                : node,
        );
    };
    const handleSave = (values: ManualTriggerFormValues) => {
        const nextNodes = buildNextNodes(values);
        setNodes(nextNodes);
    };
    const handleTrigger = async (values: ManualTriggerFormValues) => {
        const nextNodes = buildNextNodes(values);
        const nextEdges = getEdges();
        setNodes(nextNodes);

        return workflowExecution.executeWorkflow({
            snapshot: {
                nodes: nextNodes,
                edges: nextEdges,
            },
        });
    };
    return (
        <>
            {dialogOpen && (
                <ManualTriggerDialog 
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSave={handleSave}
                    onTrigger={formValues => handleTrigger(formValues)}
                    disabled={workflowExecution.isPending || !workflowExecution.editorReady}
                    isPending={workflowExecution.isPending}
                    pendingLabel={workflowExecution.isSaving ? "Saving..." : "Running..."}
                    defaultMaxIterations={nodeData.maxIterations}
                    defaultMemoryWrites={nodeData.memoryWrites}
                    templateVariables={templateVariables}
                />
            )}
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When manually triggered"
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
