import prisma from "@/lib/db";
import { CredentialProvider, type Prisma } from "@/lib/prisma/client";
import { inngest } from "@/inngest/client";
import {
  createWebhookExecution,
  runExecution,
  WorkflowExecutionError,
} from "@/features/executions/server/execution-runner";
import { createGeneratedWorkflowDraft } from "@/features/ai/server/workflow-generator";

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
      fromDefault?: boolean;
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
  eventId: string | null;
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
  executionId?: string | null;
  workflowId?: string | null;
  draftWorkflowId?: string | null;
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

function getAppBaseUrl() {
  return (
    process.env.FEISHU_BRIDGE_PUBLIC_BASE_URL?.trim() ||
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    "http://localhost:3000"
  );
}

function canUseInngestQueue() {
  return Boolean(process.env.INNGEST_EVENT_KEY?.trim());
}

function isLikelyWorkflowId(value: string) {
  return /^[a-z0-9]{20,}$/i.test(value.trim());
}

async function resolveBridgeOwnerUser() {
  const ownerEmail = getBridgeOwnerEmail();

  if (!ownerEmail) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: ownerEmail,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

async function resolveDefaultGeneratorCredential(userId: string) {
  const providerPriority = [
    CredentialProvider.MINIMAX,
    CredentialProvider.DEEPSEEK,
    CredentialProvider.GOOGLE,
    CredentialProvider.OPENAI,
    CredentialProvider.ANTHROPIC,
  ];

  for (const provider of providerPriority) {
    const credential = await prisma.credential.findFirst({
      where: {
        userId,
        provider,
      },
      select: {
        id: true,
        provider: true,
        metadata: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!credential) {
      continue;
    }

    const metadata =
      credential.metadata &&
      typeof credential.metadata === "object" &&
      !Array.isArray(credential.metadata)
        ? (credential.metadata as Record<string, unknown>)
        : null;
    const fields = Array.isArray(metadata?.fields)
      ? metadata.fields.filter(
          (value): value is string => typeof value === "string" && value.trim().length > 0,
        )
      : [];

    return {
      credentialId: credential.id,
      credentialField:
        fields.includes("apiKey") ? "apiKey" : fields[0] || "apiKey",
      provider,
    };
  }

  return null;
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
    eventId: typeof record.event_id === "string" ? record.event_id : null,
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

function buildReceiptKeys(message: Pick<FeishuBridgeMessage, "eventId" | "messageId">) {
  const keys = new Set<string>();

  if (message.messageId?.trim()) {
    keys.add(`message:${message.messageId.trim()}`);
  }

  if (message.eventId?.trim()) {
    keys.add(`event:${message.eventId.trim()}`);
    keys.add(message.eventId.trim());
  }

  return Array.from(keys);
}

async function findExistingReceipt(receiptKeys: string[]) {
  if (receiptKeys.length === 0) {
    return null;
  }

  return prisma.feishuBridgeReceipt.findFirst({
    where: {
      eventId: {
        in: receiptKeys,
      },
    },
    select: {
      replyText: true,
      status: true,
      workflowId: true,
      executionId: true,
      draftWorkflowId: true,
    },
  });
}

async function claimReceipt(params: {
  receiptKey: string | null;
  messageId: string | null;
  chatId: string | null;
  commandType: BridgeCommand["type"];
}) {
  if (!params.receiptKey) {
    return true;
  }

  try {
    await prisma.feishuBridgeReceipt.create({
      data: {
        eventId: params.receiptKey,
        messageId: params.messageId,
        chatId: params.chatId,
        commandType: params.commandType,
        status: "processing",
        replyText: null,
      },
    });

    return true;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return false;
    }

    throw error;
  }
}

async function persistReceipt(params: {
  receiptKey: string | null;
  messageId: string | null;
  chatId: string | null;
  commandType: BridgeCommand["type"];
  result: FeishuBridgeResult;
}) {
  if (!params.receiptKey) {
    return;
  }

  try {
    await prisma.feishuBridgeReceipt.update({
      where: {
        eventId: params.receiptKey,
      },
      data: {
        messageId: params.messageId,
        chatId: params.chatId,
        commandType: params.commandType,
        status: params.result.status,
        replyText: params.result.replyText,
        workflowId: params.result.workflowId ?? null,
        executionId: params.result.executionId ?? null,
        draftWorkflowId: params.result.draftWorkflowId ?? null,
      },
    });
  } catch (error) {
    throw error;
  }
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

  if (normalized === "/run") {
    return {
      type: "invalid",
      message:
        defaultWorkflowRef
          ? "Use `/run <message>` to run the default workflow, or `/run <workflow id or exact name> :: <message>`."
          : "Use `/run <workflow id or exact name> :: <message>`.",
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
        fromDefault: false,
      };
    }

    if (defaultWorkflowRef) {
      return {
        type: "run",
        workflowRef: defaultWorkflowRef,
        message: rest,
        fromDefault: true,
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
      fromDefault: true,
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

async function workflowHasWebhookTrigger(workflowId: string) {
  const triggerNode = await prisma.node.findFirst({
    where: {
      workflowId,
      type: "WEBHOOK_TRIGGER",
    },
    select: {
      id: true,
    },
  });

  return Boolean(triggerNode);
}

async function findLatestRunnableWorkflow() {
  const ownerEmail = getBridgeOwnerEmail();

  return prisma.workflow.findFirst({
    where: ownerEmail
      ? {
          user: {
            email: ownerEmail,
          },
          nodes: {
            some: {
              type: "WEBHOOK_TRIGGER",
            },
          },
        }
      : {
          nodes: {
            some: {
              type: "WEBHOOK_TRIGGER",
            },
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
  });
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
    "/draft <workflow idea>",
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

async function createWorkflowDraftFromFeishu(prompt: string) {
  const owner = await resolveBridgeOwnerUser();

  if (!owner) {
    throw new Error(
      "FEISHU_BRIDGE_OWNER_EMAIL is not configured to a valid Nodebase user.",
    );
  }

  const generatorCredential = await resolveDefaultGeneratorCredential(owner.id);

  if (!generatorCredential) {
    throw new Error(
      "No AI credential is available for the bridge owner. Add a MiniMax, DeepSeek, Google, OpenAI, or Anthropic credential first.",
    );
  }

  const draftWorkflow = await createGeneratedWorkflowDraft({
    userId: owner.id,
    input: {
      prompt,
      mode: "PROBLEM_SOLVER",
      provider:
        generatorCredential.provider === CredentialProvider.MINIMAX
          ? "MINIMAX"
          : generatorCredential.provider === CredentialProvider.DEEPSEEK
            ? "DEEPSEEK"
            : generatorCredential.provider === CredentialProvider.GOOGLE
              ? "GOOGLE"
              : generatorCredential.provider === CredentialProvider.OPENAI
                ? "OPENAI"
                : "ANTHROPIC",
      credentialId: generatorCredential.credentialId,
      credentialField: generatorCredential.credentialField,
    },
    preferredTriggerType: "WEBHOOK_TRIGGER",
  });

  return {
    workflowId: draftWorkflow.workflowId,
    title: draftWorkflow.title,
    summary: draftWorkflow.summary,
    editorUrl: `${getAppBaseUrl()}/workflows/${draftWorkflow.workflowId}`,
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
  const receiptKeys = buildReceiptKeys(message);
  const primaryReceiptKey = receiptKeys[0] ?? null;

  if (receiptKeys.length > 0) {
    const existingReceipt = await findExistingReceipt(receiptKeys);

    if (existingReceipt) {
      return {
        status: "ignored",
        replyText: null,
        executionId: existingReceipt.executionId,
        workflowId: existingReceipt.workflowId,
        draftWorkflowId: existingReceipt.draftWorkflowId,
      } satisfies FeishuBridgeResult;
    }
  }

  if (primaryReceiptKey) {
    const claimed = await claimReceipt({
      receiptKey: primaryReceiptKey,
      messageId: message.messageId,
      chatId: message.chatId,
      commandType: command.type,
    });

    if (!claimed) {
      return {
        status: "ignored",
        replyText: null,
      } satisfies FeishuBridgeResult;
    }
  }

  const finalizeResult = async (result: FeishuBridgeResult) => {
    if (primaryReceiptKey) {
      await persistReceipt({
        receiptKey: primaryReceiptKey,
        messageId: message.messageId,
        chatId: message.chatId,
        commandType: command.type,
        result,
      });
    }

    return result;
  };

  if (command.type === "help") {
    return finalizeResult({
      status: "handled",
      replyText: buildHelpReply(),
    } satisfies FeishuBridgeResult);
  }

  if (command.type === "list") {
    const workflows = await listAccessibleWorkflows();

    return finalizeResult({
      status: "handled",
      replyText: buildWorkflowListReply(workflows),
    } satisfies FeishuBridgeResult);
  }

  if (command.type === "draft") {
    try {
      const draftWorkflow = await createWorkflowDraftFromFeishu(command.prompt);

      return finalizeResult({
        status: "handled",
        replyText: [
          `Created draft workflow "${draftWorkflow.title}".`,
          draftWorkflow.summary,
          draftWorkflow.editorUrl,
        ].join("\n"),
        workflowId: draftWorkflow.workflowId,
        draftWorkflowId: draftWorkflow.workflowId,
      } satisfies FeishuBridgeResult);
    } catch (error) {
      return finalizeResult({
        status: "error",
        replyText:
          error instanceof Error
            ? error.message
            : "Failed to generate a workflow draft from Feishu.",
      } satisfies FeishuBridgeResult);
    }
  }

  if (command.type === "invalid") {
    return finalizeResult({
      status: "error",
      replyText: command.message,
    } satisfies FeishuBridgeResult);
  }

  const resolved = await resolveWorkflowReference(command.workflowRef);

  if (resolved.ambiguous) {
    return finalizeResult({
      status: "error",
      replyText:
        "More than one workflow matches that name. Use the workflow id instead.",
    } satisfies FeishuBridgeResult);
  }

  if (!resolved.workflow) {
    return finalizeResult({
      status: "error",
      replyText: `Workflow "${command.workflowRef}" was not found.`,
    } satisfies FeishuBridgeResult);
  }

  let workflow = resolved.workflow;

  if (command.fromDefault) {
    const defaultWorkflowIsRunnable = await workflowHasWebhookTrigger(workflow.id);

    if (!defaultWorkflowIsRunnable) {
      const latestRunnableWorkflow = await findLatestRunnableWorkflow();

      if (latestRunnableWorkflow) {
        workflow = latestRunnableWorkflow;
      }
    }
  }

  const isRunnableWorkflow = await workflowHasWebhookTrigger(workflow.id);

  if (!isRunnableWorkflow) {
    return finalizeResult({
      status: "error",
      replyText:
        command.fromDefault
          ? "The configured default workflow is not webhook-triggered. Create a Feishu draft first or use `/run <workflow id or exact name> :: <message>` with a webhook workflow."
          : `Workflow "${workflow.name}" does not have a webhook trigger. Feishu can only run webhook-triggered workflows.`,
      workflowId: workflow.id,
    } satisfies FeishuBridgeResult);
  }

  try {
    const queuedExecution = await queueWorkflowExecution({
      workflow,
      message: command.message,
      chatId: message.chatId,
      chatType: message.chatType,
      messageId: message.messageId,
      sender: message.sender,
      rawEvent: message.rawEvent,
    });

    return finalizeResult({
      status: "handled",
      replyText: queuedExecution.queued
        ? `Queued workflow "${workflow.name}" (${queuedExecution.executionId}).`
        : `Started workflow "${workflow.name}" (${queuedExecution.executionId}).`,
      workflowId: workflow.id,
      executionId: queuedExecution.executionId,
    } satisfies FeishuBridgeResult);
  } catch (error) {
    const replyText =
      error instanceof WorkflowExecutionError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Failed to trigger the workflow from Feishu.";

    return finalizeResult({
      status: "error",
      replyText,
      workflowId: workflow.id,
    } satisfies FeishuBridgeResult);
  }
}
