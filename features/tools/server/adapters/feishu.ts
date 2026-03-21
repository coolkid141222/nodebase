import z from "zod";
import type { Prisma } from "@/lib/prisma/client";
import type { RegisteredTool, ToolProviderSummary } from "../../shared";

const feishuMessageSendArgumentsSchema = z.union([
  z.string().trim().min(1).transform((text) => ({ text })),
  z
    .object({
      text: z.string().trim().min(1).optional(),
      message: z.string().trim().min(1).optional(),
      content: z.string().trim().min(1).optional(),
    })
    .refine((value) => Boolean(value.text ?? value.message ?? value.content))
    .transform((value) => ({
      text: value.text ?? value.message ?? value.content ?? "",
    })),
]);

function hasFeishuBotWebhook() {
  return Boolean(process.env.FEISHU_BOT_WEBHOOK?.trim());
}

export function getFeishuToolCatalog(): RegisteredTool[] {
  return [
    {
      id: "feishu.message.send",
      provider: "FEISHU",
      displayName: "Feishu Message",
      description:
        "Post a plain text message to a Feishu group bot webhook configured in the runtime environment.",
      transport: "HTTP",
      lifecycle: hasFeishuBotWebhook() ? "READY" : "ADAPTER_REQUIRED",
      dangerous: true,
      requiresApproval: false,
      capabilities: ["MESSAGING"],
      parameters: [
        {
          key: "text",
          label: "Text",
          description: "Plain text body to send to the configured Feishu bot.",
          type: "string",
          required: true,
        },
      ],
      tags: ["messaging", "feishu", "workflow-node"],
    },
  ];
}

export function getFeishuProviderSummary(): ToolProviderSummary {
  return {
    id: "FEISHU",
    label: "Feishu Tools",
    description:
      "Expose Feishu Open Platform capabilities through the same registry-adapter pattern as OpenClaw, instead of hard-wiring each action into workflow nodes.",
    lifecycle: hasFeishuBotWebhook() ? "READY" : "ADAPTER_REQUIRED",
    transport: ["HTTP"],
  };
}

export function parseFeishuMessageSendArguments(
  value: Prisma.InputJsonValue | null,
) {
  const parsed = feishuMessageSendArgumentsSchema.safeParse(value ?? {});

  if (!parsed.success) {
    throw new Error(
      "Feishu message tool expects either a plain string or an object with a text field.",
    );
  }

  return parsed.data;
}

export async function executeFeishuMessageSendTool(args: { text: string }) {
  const webhookUrl = process.env.FEISHU_BOT_WEBHOOK?.trim();

  if (!webhookUrl) {
    throw new Error(
      "FEISHU_BOT_WEBHOOK is not configured for the Feishu provider runtime.",
    );
  }

  let requestUrl: URL;

  try {
    requestUrl = new URL(webhookUrl);
  } catch {
    throw new Error("FEISHU_BOT_WEBHOOK must be a valid HTTPS URL.");
  }

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msg_type: "text",
      content: {
        text: args.text,
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const responseText = await response.text();
  let responseBody: Prisma.InputJsonValue;

  try {
    responseBody = JSON.parse(responseText) as Prisma.InputJsonValue;
  } catch {
    responseBody = responseText;
  }

  return {
    ok: response.ok,
    status: response.status,
    body: responseBody,
    text: args.text,
  } satisfies Prisma.InputJsonValue;
}
