import type { Edge, Node } from "@xyflow/react";

type LoopScope = {
  id: string;
  nodeIds: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  maxIterations: number;
};

type MeasuredNode = Node & {
  width?: number;
  height?: number;
  measured?: {
    width?: number;
    height?: number;
  };
  data?: {
    maxIterations?: number;
  };
};

const LOOP_NODE_WIDTH = 104;
const DEFAULT_NODE_WIDTH = 56;
const DEFAULT_NODE_HEIGHT = 56;
const LABEL_ALLOWANCE = 52;
const SCOPE_PADDING_X = 34;
const SCOPE_PADDING_TOP = 34;
const SCOPE_PADDING_BOTTOM = 46;

function getNodeVisualRect(node: MeasuredNode) {
  const width =
    node.measured?.width ??
    node.width ??
    (node.type === "LOOP" ? LOOP_NODE_WIDTH : DEFAULT_NODE_WIDTH);
  const height =
    node.measured?.height ?? node.height ?? DEFAULT_NODE_HEIGHT;

  return {
    x: node.position.x,
    y: node.position.y,
    width,
    height: height + LABEL_ALLOWANCE,
  };
}

export function buildLoopScopes(params: {
  nodes: Node[];
  edges: Edge[];
}): LoopScope[] {
  const { nodes, edges } = params;
  const nodeById = new Map(nodes.map((node) => [node.id, node as MeasuredNode]));
  const adjacency = new Map<string, string[]>();
  const allNodeIds = nodes.map((node) => node.id);

  for (const edge of edges) {
    const targets = adjacency.get(edge.source) ?? [];
    targets.push(edge.target);
    adjacency.set(edge.source, targets);
  }

  const indexMap = new Map<string, number>();
  const lowLinkMap = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: string[][] = [];
  let nextIndex = 0;

  const visitNode = (nodeId: string) => {
    indexMap.set(nodeId, nextIndex);
    lowLinkMap.set(nodeId, nextIndex);
    nextIndex += 1;
    stack.push(nodeId);
    onStack.add(nodeId);

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      if (!indexMap.has(nextNodeId)) {
        visitNode(nextNodeId);
        lowLinkMap.set(
          nodeId,
          Math.min(
            lowLinkMap.get(nodeId) ?? 0,
            lowLinkMap.get(nextNodeId) ?? 0,
          ),
        );
        continue;
      }

      if (onStack.has(nextNodeId)) {
        lowLinkMap.set(
          nodeId,
          Math.min(
            lowLinkMap.get(nodeId) ?? 0,
            indexMap.get(nextNodeId) ?? 0,
          ),
        );
      }
    }

    if ((lowLinkMap.get(nodeId) ?? 0) !== (indexMap.get(nodeId) ?? 0)) {
      return;
    }

    const component: string[] = [];

    while (stack.length > 0) {
      const currentNodeId = stack.pop();

      if (!currentNodeId) {
        break;
      }

      onStack.delete(currentNodeId);
      component.push(currentNodeId);

      if (currentNodeId === nodeId) {
        break;
      }
    }

    components.push(component);
  };

  for (const nodeId of allNodeIds) {
    if (!indexMap.has(nodeId)) {
      visitNode(nodeId);
    }
  }

  return components.flatMap((component) => {
    const hasSelfLoop = component.some((nodeId) =>
      (adjacency.get(nodeId) ?? []).includes(nodeId),
    );
    const isCyclic = component.length > 1 || hasSelfLoop;

    if (!isCyclic) {
      return [];
    }

    const loopNodes = component
      .map((nodeId) => nodeById.get(nodeId))
      .filter((node): node is MeasuredNode => node?.type === "LOOP");

    if (loopNodes.length === 0) {
      return [];
    }

    const visualRects = component
      .map((nodeId) => nodeById.get(nodeId))
      .filter((node): node is MeasuredNode => Boolean(node))
      .map(getNodeVisualRect);

    if (visualRects.length === 0) {
      return [];
    }

    const minX = Math.min(...visualRects.map((rect) => rect.x));
    const minY = Math.min(...visualRects.map((rect) => rect.y));
    const maxX = Math.max(...visualRects.map((rect) => rect.x + rect.width));
    const maxY = Math.max(...visualRects.map((rect) => rect.y + rect.height));
    const primaryLoopNode = loopNodes[0];

    return [
      {
        id: primaryLoopNode.id,
        nodeIds: component,
        x: minX - SCOPE_PADDING_X,
        y: minY - SCOPE_PADDING_TOP,
        width: maxX - minX + SCOPE_PADDING_X * 2,
        height: maxY - minY + SCOPE_PADDING_TOP + SCOPE_PADDING_BOTTOM,
        maxIterations: primaryLoopNode.data?.maxIterations ?? 3,
      },
    ];
  });
}
