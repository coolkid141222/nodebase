import { NextResponse } from "next/server";
import {
  processPaddleWebhookEvent,
  verifyPaddleWebhookSignature,
  type PaddleWebhookEvent,
} from "@/features/billing/server/paddle-webhooks";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  const verification = verifyPaddleWebhookSignature({
    rawBody,
    signatureHeader: signature,
  });

  if (!verification.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: verification.reason,
      },
      { status: 400 },
    );
  }

  let event: PaddleWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaddleWebhookEvent;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Webhook payload is not valid JSON.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await processPaddleWebhookEvent(event);
    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process Paddle webhook.",
      },
      { status: 500 },
    );
  }
}
