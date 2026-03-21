"use client";

import { useAtomValue } from "jotai";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { editorAtom } from "@/features/editor/store/atoms";
import { useUpdateWorkflow } from "@/features/workflows/hooks/user-workflows";
import { useManualWorkflowExecution } from "./use-manual-workflow-execution";

type WorkflowSnapshot = {
  nodes: Node[];
  edges: Edge[];
};

const snapshotWorkflow = (
  editor: ReactFlowInstance | null,
  override?: WorkflowSnapshot,
) => {
  if (override) {
    return override;
  }

  if (!editor) {
    return null;
  }

  return {
    nodes: editor.getNodes(),
    edges: editor.getEdges(),
  };
};

export const useExecuteWorkflow = (workflowId: string) => {
  const editor = useAtomValue(editorAtom);
  const updateWorkflow = useUpdateWorkflow();
  const manualExecution = useManualWorkflowExecution();

  const saveWorkflow = async (override?: WorkflowSnapshot) => {
    const snapshot = snapshotWorkflow(editor, override);

    if (!snapshot) {
      return false;
    }

    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        ...snapshot,
      });
      return true;
    } catch {
      return false;
    }
  };

  const executeWorkflow = async (options?: { snapshot?: WorkflowSnapshot }) => {
    const saved = await saveWorkflow(options?.snapshot);

    if (!saved) {
      return false;
    }

    try {
      await manualExecution.mutateAsync({ workflowId });
      return true;
    } catch {
      return false;
    }
  };

  return {
    executeWorkflow,
    saveWorkflow,
    editorReady: Boolean(editor),
    isPending: updateWorkflow.isPending || manualExecution.isPending,
    isSaving: updateWorkflow.isPending,
    isRunning: manualExecution.isPending,
  };
};
