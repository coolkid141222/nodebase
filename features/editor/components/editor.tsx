"use client"

import { useSuspenseWorkflow } from "@/features/workflows/hooks/user-workflows"
import { LoadingView, ErrorView } from "@/app/components/entity-compoents"
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    NodeChange,
    EdgeChange,
    Connection,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    Panel,
    type EdgeMouseHandler,
} from '@xyflow/react';

import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { LoopScopeOverlays } from "@/features/loops/components/scope-overlays";
import { buildLoopScopes } from "@/features/loops/lib/build-loop-scopes";
import { WorkflowEdge } from "@/components/react-flow/workflow-edge";
import {
    emptyWorkflowLoopScopeState,
    workflowLoopScopeStateAtom,
} from "@/features/executions/store/atoms";

const edgeTypes = {
    workflow: WorkflowEdge,
} as const;

export const EditorLoading = () => {
    return (
        <LoadingView message="Loading editor..." />
    )
}

export const EditorError = () => {
    return (
        <ErrorView entity="editor" message="Failed to load editor." />
    )
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);
    const setLoopScopeState = useSetAtom(workflowLoopScopeStateAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes ?? []);
    const [edges, setEdges] = useState<Edge[]>(
        (workflow.edges ?? []).map((edge) => ({
            ...edge,
            type: "workflow",
        })),
    );

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((eds) => applyNodeChanges(changes, eds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: "workflow",
                    },
                    eds,
                ),
            ),
        [],
    );
    const onEdgeDoubleClick = useCallback<EdgeMouseHandler>(
        (_, edge) =>
            setEdges((currentEdges) =>
                currentEdges.filter((currentEdge) => currentEdge.id !== edge.id),
            ),
        [],
    );
    const loopScopeState = useMemo(() => {
        const loopScopes = buildLoopScopes({ nodes, edges });
        const scopesById = Object.fromEntries(
            loopScopes.map((scope) => [scope.id, { id: scope.id, nodeIds: scope.nodeIds }]),
        );
        const scopeIdByNodeId = Object.fromEntries(
            loopScopes.flatMap((scope) =>
                scope.nodeIds.map((nodeId) => [nodeId, scope.id] as const),
            ),
        );

        return {
            scopesById,
            scopeIdByNodeId,
        };
    }, [nodes, edges]);

    useEffect(() => {
        setLoopScopeState(loopScopeState);

        return () => {
            setLoopScopeState(emptyWorkflowLoopScopeState);
        };
    }, [loopScopeState, setLoopScopeState]);

    return (
        <div className="w-full h-full overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeDoubleClick={onEdgeDoubleClick}
                nodeTypes={nodeComponents}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{
                    type: "workflow",
                }}
                onInit={setEditor}
                fitView
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
                panOnDrag={false}
                selectionOnDrag
                elevateEdgesOnSelect
                proOptions={{
                    hideAttribution: true
                }}
            >
                <Background variant={BackgroundVariant.Dots} />
                <LoopScopeOverlays nodes={nodes} edges={edges} />
                <Controls />
                <MiniMap />
                <Panel position="top-right" className="p-4">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    )
}
