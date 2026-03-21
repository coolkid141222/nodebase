import "dotenv/config";
import * as Lark from "@larksuiteoapi/node-sdk";
import fs from "node:fs";
import path from "node:path";
import { handleFeishuBridgeMessage } from "@/features/triggers/server/feishu-bridge";

function getRequiredEnv(name: "FEISHU_APP_ID" | "FEISHU_APP_SECRET") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required to start the Feishu long-connection bridge.`);
  }

  return value;
}

const appId = getRequiredEnv("FEISHU_APP_ID");
const appSecret = getRequiredEnv("FEISHU_APP_SECRET");

const baseConfig = {
  appId,
  appSecret,
  appType: Lark.AppType.SelfBuild,
  domain: Lark.Domain.Feishu,
};

const client = new Lark.Client(baseConfig);
const wsClient = new Lark.WSClient({
  ...baseConfig,
  loggerLevel: Lark.LoggerLevel.info,
});
const logFilePath = path.resolve(process.cwd(), ".codex-feishu-bridge.log");

function log(message: string, ...args: unknown[]) {
  const rendered =
    args.length > 0
      ? `${message} ${args
          .map((arg) => {
            if (arg instanceof Error) {
              return arg.stack || arg.message;
            }

            if (typeof arg === "string") {
              return arg;
            }

            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          })
          .join(" ")}`
      : message;
  const line = `[${new Date().toISOString()}] ${rendered}`;

  console.log(line);
  fs.appendFileSync(logFilePath, `${line}\n`, "utf8");
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function findFirstStringByKey(value: unknown, key: string): string | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  if (typeof record[key] === "string" && record[key].trim()) {
    return record[key] as string;
  }

  for (const nestedValue of Object.values(record)) {
    const nestedMatch = findFirstStringByKey(nestedValue, key);
    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

function summarizeEvent(event: unknown) {
  return {
    chatId: findFirstStringByKey(event, "chat_id"),
    messageId: findFirstStringByKey(event, "message_id"),
    openId: findFirstStringByKey(event, "open_id"),
    senderType: findFirstStringByKey(event, "sender_type"),
  };
}

async function replyText(chatId: string, text: string) {
  log(`[feishu-bridge] Replying to chat ${chatId}: ${text.slice(0, 120)}`);
  await client.im.v1.message.create({
    params: {
      receive_id_type: "chat_id",
    },
    data: {
      receive_id: chatId,
      content: JSON.stringify({
        text,
      }),
      msg_type: "text",
    },
  });
}

async function main() {
  log("[feishu-bridge] Starting long-connection bridge...");
  log(
    "[feishu-bridge] Registered handlers: im.message.receive_v1, im.chat.access_event.bot_p2p_chat_entered_v1",
  );

  await wsClient.start({
    eventDispatcher: new Lark.EventDispatcher({}).register({
      "im.message.receive_v1": async (event) => {
        const summary = summarizeEvent(event);
        const chatId = summary.chatId;
        const messageId = summary.messageId;

        log(
          `[feishu-bridge] Received im.message.receive_v1 chatId=${chatId ?? "unknown"} messageId=${messageId ?? "unknown"}`,
        );

        const result = await handleFeishuBridgeMessage({
          event,
        });
        log(
          `[feishu-bridge] Command result status=${result.status} hasReply=${Boolean(result.replyText)}`,
        );

        if (!chatId || !result.replyText) {
          return;
        }

        try {
          await replyText(chatId, result.replyText);
          log("[feishu-bridge] Reply sent successfully.");
        } catch (error) {
          log("[feishu-bridge] Failed to send reply.", error);
        }
      },
      "im.chat.access_event.bot_p2p_chat_entered_v1": async (event) => {
        const summary = summarizeEvent(event);
        log(
          `[feishu-bridge] Received im.chat.access_event.bot_p2p_chat_entered_v1 chatId=${summary.chatId ?? "unknown"} openId=${summary.openId ?? "unknown"}`,
        );

        if (!summary.chatId) {
          log(
            "[feishu-bridge] P2P enter event did not expose a chat_id. Full payload follows for debugging.",
          );
          log(JSON.stringify(event, null, 2));
          return;
        }

        try {
          await replyText(
            summary.chatId,
            "Nodebase Feishu bridge is connected.\nSend /help to see available commands.",
          );
          log("[feishu-bridge] Welcome reply sent successfully.");
        } catch (error) {
          log("[feishu-bridge] Failed to send welcome reply.", error);
        }
      },
    }),
  });

  log("[feishu-bridge] Connected. Listening for im.message.receive_v1...");
}

void main().catch((error) => {
  log("[feishu-bridge] Failed to start.", error);
  process.exit(1);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    log(`[feishu-bridge] Received ${signal}, closing connection...`);
    wsClient.close({ force: true });
    process.exit(0);
  });
}
