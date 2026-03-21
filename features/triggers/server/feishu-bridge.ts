import prisma from "@/lib/db";
import type { Prisma } from "@/lib/prisma/client";
import { inngest } from "@/inngest/client";
import {
  createWebhookExecution,
  runExecution,
  WorkflowExecutionError,
} from "@/features/executions/server/execution-runner";

type BridgeCommand =
  | {
      type: "help";
    }
  | {
      type: "list";
    }
  | {
      type: "draft";
      prompt: string;
    }
  | {
      type: "run";
      workflowRef: string;
      message: string;
    }
  | {
      type: "invalid";
      message: string;
    };

type WorkflowMatch = {
  id: string;
  name: string;
  webhookSecret: string;
  user: {
    email: string;
  };
  updatedAt: Date;
};

type FeishuBridgeMessage = {
  chatId: string | null;
  chatType: string | null;
  messageId: string | null;
  senderType: string | null;
  sender: Prisma.InputJsonValue | null;
  text: string | null;
  rawEvent: Prisma.InputJsonValue | null;
};

type FeishuBridgeResult = {
  replyText: string | null;
  status: "ignored" | "handled" | "error";
};

const RUN_DELIMITER = "::";

function getBridgeOwnerEmail() {
  return process.env.FEISHU_BRIDGE_OWNER_EMAIL?.trim() || null;
}

function getDefaultWorkflowRef() {
  return process.env.FEISHU_BRIDGE_DEFAULT_WORKFLOW?.trim() || null;
}

function getAllowedChatIds() {
  return new Set(
    (process.env.FEISHU_BRIDGE_ALLOWED_CHAT_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function canUseInngestQueue() {
  return Boolean(process.env.INNGEST_EVENT_KEY?.trim());
}

function isLikelyWorkflowId(value: string) {
  return /^[a-z0-9]{20,}$/i.test(value.trim());
}

function parseMessageContent(content?: string | null) {
  if (!content?.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "text" in parsed &&
      typeof parsed.text === "string"
    ) {
      return parsed.text.trim();
    }
  } catch {
    return content.trim();
  }

  return content.trim();
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue | null {
  if (value === undefined) {
    return null;
  }

  try {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  } catch {
    return null;
  }
}

export function extractFeishuBridgeMessage(value: unknown): FeishuBridgeMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const message =
    record.message && typeof record.message === "object" && !Array.isArray(record.message)
      ? (record.message as Record<string, unknown>)
      : null;
  const sender =
    record.sender && typeof record.sender === "object" && !Array.isArray(record.sender)
      ? (record.sender as Record<string, unknown>)
      : null;

  return {
    chatId: typeof message?.chat_id === "string" ? message.chat_id : null,
    chatType: typeof message?.chat_type === "string" ? message.chat_type : null,
    messageId:
      typeof message?.message_id === "string" ? message.message_id : null,
    senderType:
      typeof sender?.sender_type === "string" ? sender.sender_type : null,
    sender: toInputJsonValue(sender),
    text:
      typeof message?.content === "string"
        ? parseMessageContent(message.content)
        : null,
    rawEvent: toInputJsonValue(value),
  };
}

export function parseFeishuBridgeCommand(text: string): BridgeCommand {
  const normalized = text.trim();
  const defaultWorkflowRef = getDefaultWorkflowRef();

  if (!normalized) {
    return { type: "help" };
  }

  if (normalized === "/help" || normalized === "help") {
    return { type: "help" };
  }

  if (normalized === "/list" || normalized === "list") {
    return { type: "list" };
  }

  if (normalized.startsWith("/draft ")) {
    const prompt = normalized.slice("/draft".length).trim();
    return prompt
      ? { type: "draft", prompt }
      : {
          type: "invalid",
          message: "Use `/draft <workflow idea>` to generate a draft later.",
        };
  }

  if (normalized === "/draft") {
    return {
      type: "invalid",
      message: "Use `/draft <workflow idea>` to generate a draft later.",
    };
  }

  if (normalized.startsWith("/run ")) {
    const rest = normalized.slice("/run".length).trim();

    if (!rest) {
      return {
        type: "invalid",
        message:
          "Use `/run <workflow id or exact name> :: <message>` or set FEISHU_BRIDGE_DEFAULT_WORKFLOW.",
      };
    }

    const delimiterIndex = rest.indexOf(RUN_DELIMITER);

    if (delimiterIndex >= 0) {
      const workflowRef = rest.slice(0, delimiterIndex).trim();
      const message = rest.slice(delimiterIndex + RUN_DELIMITER.length).trim();

      if (!workflowRef || !message) {
        return {
          type: "invalid",
          message:
            "Use `/run <workflow id or exact name> :: <message>` with both parts filled.",
        };
      }

      return {
        type: "run",
        workflowRef,
        message,
      };
    }

    if (defaultWorkflowRef) {
      return {
        type: "run",
        workflowRef: defaultWorkflowRef,
        message: rest,
      };
    }

    return {
      type: "invalid",
      message:
        "No default workflow is configured. Use `/run <workflow id or exact name> :: <message>`.",
    };
  }

  if (defaultWorkflowRef) {
    return {
      type: "run",
      workflowRef: defaultWorkflowRef,
      message: normalized,
    };
  }

  return { type: "help" };
}

async function listAccessibleWorkflows() {
  const ownerEmail = getBridgeOwnerEmail();

  return prisma.workflow.findMany({
    where: ownerEmail
      ? {
          user: {
            email: ownerEmail,
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      webhookSecret: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 12,
  });
}

async function resolveWorkflowReference(workflowRef: string) {
  const ownerEmail = getBridgeOwnerEmail();
  const trimmedRef = workflowRef.trim();

  if (isLikelyWorkflowId(trimmedRef)) {
    const workflow = await prisma.workflow.findFirst({
      where: ownerEmail
        ? {
            id: trimmedRef,
            user: {
              email: ownerEmail,
            },
          }
        : {
            id: trimmedRef,
          },
      select: {
        id: true,
        name: true,
        webhookSecret: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (workflow) {
      return { workflow, ambiguous: false } as const;
    }
  }

  const matches = await prisma.workflow.findMany({
    where: ownerEmail
      ? {
          name: {
            equals: trimmedRef,
            mode: "insensitive",
          },
          user: {
            email: ownerEmail,
          },
        }
      : {
          name: {
            equals: trimmedRef,
            mode: "insensitive",
          },
        },
    select: {
      id: true,
      name: true,
      webhookSecret: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 2,
  });

  if (matches.length === 1) {
    return { workflow: matches[0], ambiguous: false } as const;
  }

  if (matches.length > 1) {
    return { workflow: null, ambiguous: true } as const;
  }

  return { workflow: null, ambiguous: false } as const;
}

function buildHelpReply() {
  const defaultWorkflowRef = getDefaultWorkflowRef();

  return [
    "Nodebase Feishu bridge",
    "",
    "Commands:",
    "/help",
    "/list",
    defaultWorkflowRef
      ? "/run <message>  (runs the default workflow)"
      : "/run <workflow id or exact name> :: <message>",
    "/draft <workflow idea>  (not implemented yet)",
  ].join("\n");
}

function buildWorkflowListReply(workflows: WorkflowMatch[]) {
  if (workflows.length === 0) {
    return "No accessible workflows were found for the configured bridge scope.";
  }

  const lines = workflows.map(
    (workflow, index) => `${index + 1}. ${workflow.name} (${workflow.id})`,
  );

  return ["Available workflows:", ...lines].join("\n");
}

async function queueWorkflowExecution(params: {
  workflow: WorkflowMatch;
  message: string;
  chatId: string | null;
  chatType: string | null;
  messageId: string | null;
  sender: Prisma.InputJsonValue | null;
  rawEvent: Prisma.InputJsonValue | null;
}) {
  const execution = await createWebhookExecution({
    workflowId: params.workflow.id,
    webhookSecret: params.workflow.webhookSecret,
    triggerSource: "feishu",
    triggerPayload: {
      text: params.message,
      message: params.message,
      chatId: params.chatId,
      chatType: params.chatType,
      messageId: params.messageId,
      sender: params.sender,
      rawEvent: params.rawEvent,
      bridge: {
        transport: "long_connection",
      },
    },
  });

  if (!execution) {
    throw new Error(`Workflow "${params.workflow.id}" no longer exists.`);
  }

  if (canUseInngestQueue()) {
    await inngest.send({
      name: "workflow/webhook.triggered",
      data: {
        executionId: execution.id,
        workflowId: execution.workflowId,
      },
    });

    return {
      executionId: execution.id,
      queued: true,
    };
  }

  setImmediate(() => {
    void runExecution(execution.id).catch((error) => {
      console.error(
        `[feishu-bridge] Execution ${execution.id} failed after dispatch.`,
        error,
      );
    });
  });

  return {
    executionId: execution.id,
    queued: false,
  };
}

export async function handleFeishuBridgeMessage(params: {
  event: unknown;
}) {
  const message = extractFeishuBridgeMessage(params.event);

  if (!message?.text) {
    return {
      status: "ignored",
      replyText: null,
    } satisfies FeishuBridgeResult;
  }

  if (message.senderType && message.senderType !== "user") {
    return {
      status: "ignored",
      replyText: null,
    } satisfies FeishuBridgeResult;
  }

  const allowedChatIds = getAllowedChatIds();

  if (
    allowedChatIds.size > 0 &&
    (!message.chatId || !allowedChatIds.has(message.chatId))
  ) {
    return {
      status: "handled",
      replyText: "This Feishu chat is not allowed to trigger Nodebase workflows.",
    } satisfies FeishuBridgeResult;
  }

  const command = parseFeishuBridgeCommand(message.text);

  if (command.type === "help") {
    return {
      status: "handled",
      replyText: buildHelpReply(),
    } satisfies FeishuBridgeResult;
  }

  if (command.type === "list") {
    const workflows = await listAccessibleWorkflows();

    return {
      status: "handled",
      replyText: buildWorkflowListReply(workflows),
    } satisfies FeishuBridgeResult;
  }

  if (command.type === "draft") {
    return {
      status: "handled",
      replyText:
        "Workflow draft generation from Feishu is not wired yet. Use `/run` for existing workflows first.",
    } satisfies FeishuBridgeResult;
  }

  if (command.type === "invalid") {
    return {
      status: "error",
      replyText: command.message,
    } satisfies FeishuBridgeResult;
  }

  const resolved = await resolveWorkflowReference(command.workflowRef);

  if (resolved.ambiguous) {
    return {
      status: "error",
      replyText:
        "More than one workflow matches that name. Use the workflow id instead.",
    } satisfies FeishuBridgeResult;
  }

  if (!resolved.workflow) {
    return {
      status: "error",
      replyText: `Workflow "${command.workflowRef}" was not found.`,
    } satisfies FeishuBridgeResult;
  }

  try {
    const queuedExecution = await queueWorkflowExecution({
      workflow: resolved.workflow,
      message: command.message,
      chatId: message.chatId,
      chatType: message.chatType,
      messageId: message.messageId,
      sender: message.sender,
      rawEvent: message.rawEvent,
    });

    return {
      status: "handled",
      replyText: queuedExecution.queued
        ? `Queued workflow "${resolved.workflow.name}" (${queuedExecution.executionId}).`
        : `Started workflow "${resolved.workflow.name}" (${queuedExecution.executionId}).`,
    } satisfies FeishuBridgeResult;
  } catch (error) {
    const replyText =
      error instanceof WorkflowExecutionError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Failed to trigger the workflow from Feishu.";

    return {
      status: "error",
      replyText,
    } satisfies FeishuBridgeResult;
  }
}
