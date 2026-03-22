"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type MemoryEntry = {
  id: string;
  scope: "SHARED" | "NODE" | "WORKFLOW" | "USER";
  namespace: string;
  key: string;
  value: unknown;
  ownerNodeId?: string;
};

interface MemoryGraphProps {
  entries: MemoryEntry[];
  onNodeClick?: (entry: MemoryEntry) => void;
}

const nodeColors: Record<string, { bg: string; border: string }> = {
  SHARED: { bg: "#dbeafe", border: "#3b82f6" },
  NODE: { bg: "#fce7f3", border: "#ec4899" },
  WORKFLOW: { bg: "#d1fae5", border: "#10b981" },
  USER: { bg: "#fef3c7", border: "#f59e0b" },
};

function MemoryNode({ data }: { data: MemoryEntry }) {
  const colors = nodeColors[data.scope] || nodeColors.SHARED;

  return (
    <div
      className="rounded-lg border-2 px-3 py-2 shadow-md min-w-[150px]"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="text-xs font-medium">{data.key}</div>
      <div className="text-[10px] text-muted-foreground">
        {data.namespace}
      </div>
      <div className="mt-1 text-[10px] font-mono truncate max-w-[130px]">
        {typeof data.value === "object"
          ? JSON.stringify(data.value).slice(0, 30)
          : String(data.value)?.slice(0, 30)}
      </div>
    </div>
  );
}

const nodeTypes = {
  memory: MemoryNode,
};

export function MemoryGraph({ entries, onNodeClick: handleNodeClick }: MemoryGraphProps) {
  // Group entries by scope and namespace for positioning
  const { nodes, edges } = useMemo(() => {
    const sharedEntries = entries.filter((e) => e.scope === "SHARED");
    const nodeEntries = entries.filter((e) => e.scope === "NODE");

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    // Position SHARED entries on the left
    const namespaces = [...new Set(sharedEntries.map((e) => e.namespace))];
    let sharedY = 0;
    namespaces.forEach((ns) => {
      const nsEntries = sharedEntries.filter((e) => e.namespace === ns);
      nsEntries.forEach((entry, entryIdx) => {
        flowNodes.push({
          id: entry.id,
          type: "memory",
          position: { x: 50, y: sharedY + entryIdx * 80 },
          data: entry,
        });
      });
      sharedY += nsEntries.length * 80 + 40;
    });

    // Position NODE entries on the right
    const ownerNodeIds = [...new Set(nodeEntries.map((e) => e.ownerNodeId).filter(Boolean))];
    let nodeY = 0;
    ownerNodeIds.forEach((ownerId) => {
      const ownerEntries = nodeEntries.filter((e) => e.ownerNodeId === ownerId);
      ownerEntries.forEach((entry, entryIdx) => {
        flowNodes.push({
          id: entry.id,
          type: "memory",
          position: { x: 350, y: nodeY + entryIdx * 80 },
          data: entry,
        });
      });
      nodeY += ownerEntries.length * 80 + 40;
    });

    // Create edges from NODE to SHARED entries (data flow)
    // This is a simplified visualization - in real scenario, we'd track read/write relationships
    nodeEntries.forEach((nodeEntry) => {
      const relatedShared = sharedEntries.find(
        (s) => s.namespace === nodeEntry.namespace && s.key === nodeEntry.key,
      );
      if (relatedShared) {
        flowEdges.push({
          id: `${nodeEntry.id}-${relatedShared.id}`,
          source: nodeEntry.id,
          target: relatedShared.id,
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: "#94a3b8", strokeWidth: 1 },
        });
      }
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [entries]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  // Update nodes when entries change
  useMemo(() => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, [nodes, edges, setFlowNodes, setFlowEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const entry = entries.find((e) => e.id === node.id);
      if (entry) {
        handleNodeClick?.(entry);
      }
    },
    [entries, handleNodeClick],
  );

  if (entries.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No memory entries to visualize</p>
      </div>
    );
  }

  return (
    <div className="h-80 rounded-lg border overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as MemoryEntry;
            return data?.scope === "NODE" ? "#ec4899" : "#3b82f6";
          }}
          maskColor="rgb(243, 244, 246, 0.8)"
        />
      </ReactFlow>
    </div>
  );
}
