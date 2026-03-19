import { BillingPlan, BillingProvider, BillingStatus } from "@/lib/prisma/client";

export const MOCK_BILLING_PERIOD_DAYS = 30;

export const FREE_PLAN_FEATURES = [
  "Unlimited workflow editing",
  "Manual, webhook, AI, and HTTP nodes",
  "Local development and execution history",
];

export const PRO_PLAN_FEATURES = [
  "Marks your account as Pro inside this app",
  "Unlocks the billing and upgrade flow end to end",
  "Keeps a provider slot ready for a future real checkout",
];

export const PADDLE_SUPPORTED_COUNTRIES_URL =
  "https://developer.paddle.com/concepts/sell/supported-countries-locales";

export const PADDLE_BILLING_WORKFLOWS_URL =
  "https://developer.paddle.com/migrate/overview";
export const PADDLE_WEBHOOK_ENDPOINT_PATH = "/api/webhooks/paddle";

export type BillingStateSnapshot = {
  plan: BillingPlan;
  billingProvider: BillingProvider | null;
  billingStatus: BillingStatus;
  billingCustomerId: string | null;
  billingSubscriptionId: string | null;
  billingCurrentPeriodEnd: Date | null;
};

export const isProPlanActive = (state: BillingStateSnapshot) => {
  return (
    state.plan === BillingPlan.PRO &&
    state.billingStatus === BillingStatus.ACTIVE
  );
};

export const getBillingProviderLabel = (
  provider: BillingProvider | null | undefined,
) => {
  switch (provider) {
    case BillingProvider.MOCK:
      return "Local mock billing";
    case BillingProvider.PADDLE:
      return "Paddle";
    default:
      return "Not connected";
  }
};

export const getBillingStatusLabel = (status: BillingStatus) => {
  switch (status) {
    case BillingStatus.ACTIVE:
      return "Active";
    case BillingStatus.CANCELED:
      return "Canceled";
    default:
      return "Inactive";
  }
};
