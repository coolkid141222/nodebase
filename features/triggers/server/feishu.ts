import type { Prisma } from "@/lib/prisma/client";

type FeishuEventHeader = {
  event_type?: string;
  token?: string;
  app_id?: string;
  tenant_key?: string;
  create_time?: string;
  event_id?: string;
};

type FeishuMessageEvent = {
  sender?: Record<string, unknown> | null;
  message?: {
    message_id?: string;
    chat_id?: string;
    chat_type?: string;
    message_type?: string;
    content?: string;
  } | null;
};

export type FeishuCallbackPayload = {
  type?: string;
  token?: string;
  challenge?: string;
  encrypt?: string;
  schema?: string;
  header?: FeishuEventHeader;
  event?: FeishuMessageEvent;
};

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

export function isFeishuUrlVerificationRequest(
  payload: FeishuCallbackPayload,
): payload is FeishuCallbackPayload & { challenge: string } {
  return payload.type === "url_verification" && typeof payload.challenge === "string";
}

export function validateFeishuVerificationToken(
  payload: FeishuCallbackPayload,
) {
  const configuredToken = process.env.FEISHU_EVENT_VERIFICATION_TOKEN?.trim();

  if (!configuredToken) {
    return true;
  }

  return payload.token === configuredToken || payload.header?.token === configuredToken;
}

export function extractFeishuTriggerPayload(
  payload: FeishuCallbackPayload,
): Prisma.InputJsonValue | null {
  const eventType = payload.header?.event_type;

  if (eventType !== "im.message.receive_v1") {
    return null;
  }

  const message = payload.event?.message;
  const sender = payload.event?.sender ?? null;
  const text = parseMessageContent(message?.content);

  return {
    eventType,
    messageId: message?.message_id ?? null,
    messageType: message?.message_type ?? null,
    chatId: message?.chat_id ?? null,
    chatType: message?.chat_type ?? null,
    text,
    message: text,
    sender: toInputJsonValue(sender),
    rawEvent: toInputJsonValue(payload.event ?? null),
  } satisfies Prisma.InputJsonValue;
}
