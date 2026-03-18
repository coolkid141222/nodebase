import prisma from "@/lib/db";
import {
  ExecutionStatus,
  ExecutionStepStatus,
  ExecutionTriggerType,
  NodeType,
  Prisma,
} from "@/lib/prisma/client";

type WorkflowForExecution = Prisma.WorkflowGetPayload<{
  include: {
    nodes: true;
    connections: true;
  };
}>;

type ExecutionWithWorkflow = Prisma.ExecutionGetPayload<{
  include: {
    workflow: {
      include: {
        nodes: true;
        connections: true;
      };
    };
  };
}>;

type ExecutionPlan = {
  orderedNodes: WorkflowForExecution["nodes"];
};

type NodeExecutionResult = {
  status: ExecutionStepStatus;
  output?: Prisma.InputJsonValue;
};

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: string;
};

export class WorkflowExecutionError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "MANUAL_TRIGGER_NOT_FOUND"
      | "WORKFLOW_HAS_CYCLE"
      | "UNSUPPORTED_NODE_TYPE"
      | "INVALID_HTTP_REQUEST_CONFIG"
      | "HTTP_REQUEST_FAILED",
  ) {
    super(message);
    this.name = "WorkflowExecutionError";
  }
}

function serializeError(error: unknown): Prisma.InputJsonValue {
  if (error instanceof WorkflowExecutionError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? null,
    };
  }

  return {
    message: "Unknown execution error",
    value: String(error),
  };
}

function createWorkflowSnapshot(
  workflow: WorkflowForExecution,
): Prisma.InputJsonValue {
  return {
    id: workflow.id,
    name: workflow.name,
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    connections: workflow.connections.map((connection) => ({
      id: connection.id,
      fromNodeId: connection.fromNodeId,
      toNodeId: connection.toNodeId,
      fromOutput: connection.fromOutput,
      toInput: connection.toInput,
      data: connection.data,
    })),
  };
}

function truncateText(value: string, maxLength = 10_000) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...<truncated>`;
}

function parseJsonOrReturnText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as Prisma.InputJsonValue;
  } catch {
    return truncateText(trimmed);
  }
}

function normalizeHttpRequestNodeData(
  node: WorkflowForExecution["nodes"][number],
): Required<HttpRequestNodeData> {
  const data = (node.data ?? {}) as HttpRequestNodeData;
  const endpoint = data.endpoint?.trim();
  const method = data.method ?? "GET";
  const body = data.body ?? "";

  if (!endpoint) {
    throw new WorkflowExecutionError(
      `HTTP Request node "${node.name}" is missing an endpoint URL.`,
      "INVALID_HTTP_REQUEST_CONFIG",
    );
  }

  try {
    new URL(endpoint);
  } catch {
    throw new WorkflowExecutionError(
      `HTTP Request node "${node.name}" has an invalid endpoint URL.`,
      "INVALID_HTTP_REQUEST_CONFIG",
    );
  }

  return {
    endpoint,
    method,
    body,
  };
}

async function executeHttpRequestNode(
  node: WorkflowForExecution["nodes"][number],
): Promise<NodeExecutionResult> {
  const config = normalizeHttpRequestNodeData(node);
  const headers = new Headers();
  const hasBody = config.body.trim().length > 0;
  let requestBody: BodyInit | undefined;

  if (hasBody && config.method !== "GET" && config.method !== "DELETE") {
    const parsedBody = parseJsonOrReturnText(config.body);

    if (typeof parsedBody === "string") {
      requestBody = parsedBody;
      headers.set("content-type", "text/plain; charset=utf-8");
    } else {
      requestBody = JSON.stringify(parsedBody);
      headers.set("content-type", "application/json");
    }
  }

  const response = await fetch(config.endpoint, {
    method: config.method,
    headers,
    body: requestBody,
    signal: AbortSignal.timeout(15_000),
  });

  const responseText = await response.text();
  const responseBody = parseJsonOrReturnText(responseText);
  const output: Prisma.InputJsonValue = {
    url: config.endpoint,
    method: config.method,
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
    body: responseBody,
  };

  if (!response.ok) {
    throw new WorkflowExecutionError(
      `HTTP request failed with status ${response.status}.`,
      "HTTP_REQUEST_FAILED",
    );
  }

  return {
    status: ExecutionStepStatus.SUCCESS,
    output,
  };
}

function buildManualExecutionPlan(workflow: WorkflowForExecution): ExecutionPlan {
  const manualTriggerNodes = workflow.nodes.filter(
    (node) => node.type === NodeType.MANUAL_TRIGGER,
  );

  if (manualTriggerNodes.length === 0) {
    throw new WorkflowExecutionError(
      "Workflow must contain a manual trigger node before it can be executed manually.",
      "MANUAL_TRIGGER_NOT_FOUND",
    );
  }

  const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const nodeOrder = new Map(
    workflow.nodes.map((node, index) => [node.id, index] as const),
  );
  const adjacency = new Map<string, string[]>();

  for (const connection of workflow.connections) {
    const targets = adjacency.get(connection.fromNodeId) ?? [];
    targets.push(connection.toNodeId);
    adjacency.set(connection.fromNodeId, targets);
  }

  const reachableNodeIds = new Set<string>();
  const queue = manualTriggerNodes.map((node) => node.id);

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || reachableNodeIds.has(nodeId)) {
      continue;
    }

    reachableNodeIds.add(nodeId);

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      queue.push(nextNodeId);
    }
  }

  const indegree = new Map<string, number>();
  for (const nodeId of reachableNodeIds) {
    indegree.set(nodeId, 0);
  }

  for (const connection of workflow.connections) {
    if (
      reachableNodeIds.has(connection.fromNodeId) &&
      reachableNodeIds.has(connection.toNodeId)
    ) {
      indegree.set(
        connection.toNodeId,
        (indegree.get(connection.toNodeId) ?? 0) + 1,
      );
    }
  }

  const sortedQueue = Array.from(reachableNodeIds)
    .filter((nodeId) => (indegree.get(nodeId) ?? 0) === 0)
    .sort((left, right) => {
      return (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0);
    });

  const orderedNodes: WorkflowForExecution["nodes"] = [];

  while (sortedQueue.length > 0) {
    const nodeId = sortedQueue.shift();
    if (!nodeId) {
      continue;
    }

    const node = nodeById.get(nodeId);
    if (!node) {
      continue;
    }

    orderedNodes.push(node);

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      if (!reachableNodeIds.has(nextNodeId)) {
        continue;
      }

      const nextIndegree = (indegree.get(nextNodeId) ?? 0) - 1;
      indegree.set(nextNodeId, nextIndegree);

      if (nextIndegree === 0) {
        sortedQueue.push(nextNodeId);
        sortedQueue.sort((left, right) => {
          return (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0);
        });
      }
    }
  }

  if (orderedNodes.length !== reachableNodeIds.size) {
    throw new WorkflowExecutionError(
      "Workflow execution currently supports acyclic graphs only.",
      "WORKFLOW_HAS_CYCLE",
    );
  }

  return { orderedNodes };
}

async function executeNode(
  execution: ExecutionWithWorkflow,
  node: WorkflowForExecution["nodes"][number],
): Promise<NodeExecutionResult> {
  switch (node.type) {
    case NodeType.INITIAL:
      return {
        status: ExecutionStepStatus.SKIPPED,
        output: {
          reason: "INITIAL is a canvas placeholder node.",
        },
      };
    case NodeType.MANUAL_TRIGGER:
      return {
        status: ExecutionStepStatus.SUCCESS,
        output: execution.triggerPayload as Prisma.InputJsonValue,
      };
    case NodeType.HTTP_REQUEST:
      return executeHttpRequestNode(node);
    default:
      throw new WorkflowExecutionError(
        `Node executor for "${node.type}" is not implemented yet.`,
        "UNSUPPORTED_NODE_TYPE",
      );
  }
}

export async function createManualExecution(params: {
  workflowId: string;
  triggeredByUserId: string;
}) {
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: params.workflowId,
      userId: params.triggeredByUserId,
    },
    include: {
      nodes: true,
      connections: true,
    },
  });

  if (!workflow) {
    return null;
  }

  buildManualExecutionPlan(workflow);

  return prisma.execution.create({
    data: {
      workflowId: workflow.id,
      triggerType: ExecutionTriggerType.MANUAL,
      status: ExecutionStatus.PENDING,
      triggeredByUserId: params.triggeredByUserId,
      triggerPayload: {
        source: "manual",
      },
      workflowSnapshot: createWorkflowSnapshot(workflow),
      state: {
        phase: "queued",
      },
    },
  });
}

export async function runExecution(executionId: string) {
  const claimedExecution = await prisma.execution.updateMany({
    where: {
      id: executionId,
      status: ExecutionStatus.PENDING,
    },
    data: {
      status: ExecutionStatus.RUNNING,
      startedAt: new Date(),
      state: {
        phase: "running",
      },
    },
  });

  if (claimedExecution.count === 0) {
    return prisma.execution.findUnique({
      where: { id: executionId },
      include: {
        steps: true,
      },
    });
  }

  const execution = await prisma.execution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: {
        include: {
          nodes: true,
          connections: true,
        },
      },
    },
  });

  if (!execution) {
    throw new Error(`Execution ${executionId} not found.`);
  }

  try {
    const plan = buildManualExecutionPlan(execution.workflow);

    await prisma.execution.update({
      where: {
        id: executionId,
      },
      data: {
        state: {
          phase: "running",
          plannedNodeIds: plan.orderedNodes.map((node) => node.id),
        },
      },
    });

    for (const [index, node] of plan.orderedNodes.entries()) {
      const stepStartedAt = Date.now();
      const step = await prisma.executionStep.create({
        data: {
          executionId,
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          position: index,
          status: ExecutionStepStatus.RUNNING,
          startedAt: new Date(),
          input: {
            triggerType: execution.triggerType,
          },
        },
      });

      try {
        const result = await executeNode(execution, node);

        await prisma.executionStep.update({
          where: {
            id: step.id,
          },
          data: {
            status: result.status,
            output: result.output,
            completedAt: new Date(),
            durationMs: Date.now() - stepStartedAt,
          },
        });
      } catch (error) {
        await prisma.executionStep.update({
          where: {
            id: step.id,
          },
          data: {
            status: ExecutionStepStatus.FAILED,
            error: serializeError(error),
            completedAt: new Date(),
            durationMs: Date.now() - stepStartedAt,
          },
        });

        await prisma.execution.update({
          where: {
            id: executionId,
          },
          data: {
            status: ExecutionStatus.FAILED,
            error: serializeError(error),
            completedAt: new Date(),
            state: {
              phase: "failed",
              failedNodeId: node.id,
            },
          },
        });

        throw error;
      }
    }

    return prisma.execution.update({
      where: {
        id: executionId,
      },
      data: {
        status: ExecutionStatus.SUCCESS,
        completedAt: new Date(),
        state: {
          phase: "completed",
        },
      },
      include: {
        steps: true,
      },
    });
  } catch (error) {
    await prisma.execution.update({
      where: {
        id: executionId,
      },
      data: {
        status: ExecutionStatus.FAILED,
        completedAt: new Date(),
        error: serializeError(error),
        state: {
          phase: "failed",
        },
      },
    });

    if (error instanceof WorkflowExecutionError) {
      return prisma.execution.findUnique({
        where: { id: executionId },
        include: {
          steps: true,
        },
      });
    }

    throw error;
  }
}
