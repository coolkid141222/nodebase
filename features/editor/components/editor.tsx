"use client"

import { useSuspenseWorkflow } from "@/features/workflows/hooks/user-workflows"
import { LoadingView, ErrorView } from "@/app/components/entity-compoents"
import { useState, useCallback } from 'react';
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
    Panel
} from '@xyflow/react';

const initialNodes: Node[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];

import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

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

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes ?? []);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges ?? []);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((eds) => applyNodeChanges(changes, eds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    return (
        <div className="w-full h-full overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                onInit={setEditor}
                fitView
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
                panOnDrag={false}
                selectionOnDrag
                proOptions={{
                    hideAttribution: true
                }}
            >
                <Background variant={BackgroundVariant.Dots} />
                <Controls />
                <MiniMap />
                <Panel position="top-right" className="p-4">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    )
}