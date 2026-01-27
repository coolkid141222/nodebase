import { useQueryStates } from "nuqs";
import { workflowsParams } from "../params";

type WorkflowsParams = {
    page: number;
    pageSize: number;
    search: string;
}

export const useWorkflowsParams = () => {
    const result = useQueryStates(workflowsParams);
    return result as [WorkflowsParams, (params: Partial<WorkflowsParams> | WorkflowsParams | ((prev: WorkflowsParams) => WorkflowsParams)) => void];
}