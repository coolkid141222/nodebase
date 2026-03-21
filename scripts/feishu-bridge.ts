import "dotenv/config";
import * as Lark from "@larksuiteoapi/node-sdk";
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

async function replyText(chatId: string, text: string) {
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
  console.log("[feishu-bridge] Starting long-connection bridge...");

  await wsClient.start({
    eventDispatcher: new Lark.EventDispatcher({}).register({
      "im.message.receive_v1": async (event) => {
        const result = await handleFeishuBridgeMessage({
          event,
        });

        const chatId =
          event &&
          typeof event === "object" &&
          !Array.isArray(event) &&
          "message" in event &&
          event.message &&
          typeof event.message === "object" &&
          "chat_id" in event.message &&
          typeof event.message.chat_id === "string"
            ? event.message.chat_id
            : null;

        if (!chatId || !result.replyText) {
          return;
        }

        await replyText(chatId, result.replyText);
      },
    }),
  });

  console.log("[feishu-bridge] Connected. Listening for im.message.receive_v1...");
}

void main().catch((error) => {
  console.error("[feishu-bridge] Failed to start.", error);
  process.exit(1);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.log(`[feishu-bridge] Received ${signal}, closing connection...`);
    wsClient.close({ force: true });
    process.exit(0);
  });
}
