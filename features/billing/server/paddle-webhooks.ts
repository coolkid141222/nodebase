import { createHmac, timingSafeEqual } from "node:crypto";
import prisma from "@/lib/db";
import { BillingPlan, BillingProvider, BillingStatus } from "@/lib/prisma/client";
import {
  getPaddleWebhookSecret,
  getPaddleWebhookToleranceSeconds,
} from "./paddle";

type PaddleSubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "paused"
  | "canceled"
  | string;

type PaddleSubscriptionPayload = {
  id: string;
  customer_id?: string | null;
  status?: PaddleSubscriptionStatus | null;
  current_billing_period?: {
    starts_at?: string | null;
    ends_at?: string | null;
  } | null;
  custom_data?: {
    appUserId?: string;
  } | null;
};

export type PaddleWebhookEvent = {
  event_id: string;
  event_type: string;
  occurred_at: string;
  data: PaddleSubscriptionPayload;
};

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: string };

export const verifyPaddleWebhookSignature = ({
  rawBody,
  signatureHeader,
}: {
  rawBody: string;
  signatureHeader: string | null;
}): VerifyResult => {
  const secret = getPaddleWebhookSecret();

  if (!secret) {
    return {
      ok: false,
      reason: "PADDLE_WEBHOOK_SECRET is not configured.",
    };
  }

  if (!signatureHeader) {
    return {
      ok: false,
      reason: "Missing Paddle-Signature header.",
    };
  }

  const parsedHeader = signatureHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<{ ts?: string; h1: string[] }>(
      (accumulator, entry) => {
        const [key, value] = entry.split("=");
        if (!key || !value) {
          return accumulator;
        }

        if (key === "ts") {
          accumulator.ts = value;
        }

        if (key === "h1") {
          accumulator.h1.push(value);
        }

        return accumulator;
      },
      { h1: [] },
    );

  if (!parsedHeader.ts || parsedHeader.h1.length === 0) {
    return {
      ok: false,
      reason: "Paddle-Signature header is malformed.",
    };
  }

  const timestamp = Number(parsedHeader.ts);
  if (!Number.isFinite(timestamp)) {
    return {
      ok: false,
      reason: "Webhook signature timestamp is invalid.",
    };
  }

  const toleranceSeconds = getPaddleWebhookToleranceSeconds();
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return {
      ok: false,
      reason: "Webhook signature timestamp is outside the allowed tolerance.",
    };
  }

  const signedPayload = `${parsedHeader.ts}:${rawBody}`;
  const expectedSignature = createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const isMatch = parsedHeader.h1.some((signature) => {
    const actualBuffer = Buffer.from(signature, "utf8");
    if (actualBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(actualBuffer, expectedBuffer);
  });

  if (!isMatch) {
    return {
      ok: false,
      reason: "Webhook signature verification failed.",
    };
  }

  return { ok: true };
};

const mapSubscriptionToBillingUpdate = ({
  subscription,
  event,
}: {
  subscription: PaddleSubscriptionPayload;
  event: PaddleWebhookEvent;
}) => {
  const status = (subscription.status ?? "").toLowerCase();
  const currentPeriodEnd = subscription.current_billing_period?.ends_at
    ? new Date(subscription.current_billing_period.ends_at)
    : null;

  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
      return {
        plan: BillingPlan.PRO,
        billingStatus: BillingStatus.ACTIVE,
        billingCurrentPeriodEnd: currentPeriodEnd,
        billingProvider: BillingProvider.PADDLE,
        billingCustomerId: subscription.customer_id ?? null,
        billingSubscriptionId: subscription.id,
        billingLastEventId: event.event_id,
        billingLastEventAt: new Date(event.occurred_at),
      };
    case "canceled":
      return {
        plan: BillingPlan.FREE,
        billingStatus: BillingStatus.CANCELED,
        billingCurrentPeriodEnd: currentPeriodEnd,
        billingProvider: BillingProvider.PADDLE,
        billingCustomerId: subscription.customer_id ?? null,
        billingSubscriptionId: subscription.id,
        billingLastEventId: event.event_id,
        billingLastEventAt: new Date(event.occurred_at),
      };
    case "paused":
      return {
        plan: BillingPlan.FREE,
        billingStatus: BillingStatus.INACTIVE,
        billingCurrentPeriodEnd: currentPeriodEnd,
        billingProvider: BillingProvider.PADDLE,
        billingCustomerId: subscription.customer_id ?? null,
        billingSubscriptionId: subscription.id,
        billingLastEventId: event.event_id,
        billingLastEventAt: new Date(event.occurred_at),
      };
    default:
      return null;
  }
};

const findBillingUserForWebhook = async (subscription: PaddleSubscriptionPayload) => {
  const appUserId = subscription.custom_data?.appUserId?.trim();

  if (appUserId) {
    const user = await prisma.user.findUnique({
      where: {
        id: appUserId,
      },
      select: {
        id: true,
        billingLastEventId: true,
        billingLastEventAt: true,
      },
    });

    if (user) {
      return user;
    }
  }

  if (subscription.id) {
    const user = await prisma.user.findFirst({
      where: {
        billingSubscriptionId: subscription.id,
      },
      select: {
        id: true,
        billingLastEventId: true,
        billingLastEventAt: true,
      },
    });

    if (user) {
      return user;
    }
  }

  if (subscription.customer_id) {
    return prisma.user.findFirst({
      where: {
        billingCustomerId: subscription.customer_id,
      },
      select: {
        id: true,
        billingLastEventId: true,
        billingLastEventAt: true,
      },
    });
  }

  return null;
};

export const processPaddleWebhookEvent = async (event: PaddleWebhookEvent) => {
  if (!event.event_type.startsWith("subscription.")) {
    return {
      applied: false,
      reason: "ignored-non-subscription-event",
    };
  }

  const occurredAt = new Date(event.occurred_at);
  if (Number.isNaN(occurredAt.getTime())) {
    return {
      applied: false,
      reason: "invalid-occurred-at",
    };
  }

  const user = await findBillingUserForWebhook(event.data);

  if (!user) {
    return {
      applied: false,
      reason: "user-not-found",
    };
  }

  if (user.billingLastEventId === event.event_id) {
    return {
      applied: false,
      reason: "duplicate-event",
    };
  }

  if (
    user.billingLastEventAt &&
    occurredAt.getTime() < new Date(user.billingLastEventAt).getTime()
  ) {
    return {
      applied: false,
      reason: "stale-event",
    };
  }

  const billingUpdate = mapSubscriptionToBillingUpdate({
    subscription: event.data,
    event,
  });

  if (!billingUpdate) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        billingLastEventId: event.event_id,
        billingLastEventAt: occurredAt,
      },
    });

    return {
      applied: false,
      reason: "unsupported-subscription-status",
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: billingUpdate,
  });

  return {
    applied: true,
    reason: "billing-state-updated",
    userId: user.id,
  };
};
