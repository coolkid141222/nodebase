"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowUpRightIcon,
  CreditCardIcon,
  CrownIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from "lucide-react";
import { BillingPlan } from "@/lib/prisma/client";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { LoadingView } from "@/app/components/entity-compoents";
import {
  FREE_PLAN_FEATURES,
  getBillingProviderLabel,
  getBillingStatusLabel,
  isProPlanActive,
  PADDLE_BILLING_WORKFLOWS_URL,
  PADDLE_SUPPORTED_COUNTRIES_URL,
  PADDLE_WEBHOOK_ENDPOINT_PATH,
  PRO_PLAN_FEATURES,
} from "../shared";
import {
  useDowngradeToFree,
  useSuspenseBillingState,
  useUpgradeToPro,
} from "../hooks/use-billing";
import { usePaddleCheckout } from "../hooks/use-paddle-checkout";

export const BillingLoading = () => {
  return <LoadingView message="Loading billing..." />;
};

export const BillingPortalView = () => {
  const billing = useSuspenseBillingState();
  const upgradeToPro = useUpgradeToPro();
  const downgradeToFree = useDowngradeToFree();

  const state = billing.data;
  const isPro = isProPlanActive(state);
  const paddleCheckout = usePaddleCheckout();

  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">Billing</p>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This project is running in local billing mode. You can still upgrade,
            manage plan state, and exercise the full upgrade flow without wiring a
            live payment provider yet.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/70">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Current plan</CardTitle>
                  <CardDescription>
                    Persistent account-level billing state for your workflow app.
                  </CardDescription>
                </div>
                <Badge className="rounded-full px-3 py-1 text-xs">
                  {state.plan}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <MetricTile
                  label="Plan"
                  value={state.plan === BillingPlan.PRO ? "Pro" : "Free"}
                />
                <MetricTile
                  label="Status"
                  value={getBillingStatusLabel(state.billingStatus)}
                />
                <MetricTile
                  label="Provider"
                  value={getBillingProviderLabel(state.billingProvider)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <MetricTile
                  label="Paddle env"
                  value={state.paddle.environment}
                />
                <MetricTile
                  label="Paddle setup"
                  value={state.paddle.enabled ? "Ready" : "Incomplete"}
                />
              </div>

              <div className="rounded-2xl border bg-muted/25 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Renewal
                </p>
                <p className="mt-2 text-sm font-medium">
                  {state.billingCurrentPeriodEnd
                    ? format(new Date(state.billingCurrentPeriodEnd), "PPP")
                    : "No renewal scheduled"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isPro
                    ? "Mock billing is active for this account. No real payment is created."
                    : "You are on the free plan. Upgrade to exercise the in-app purchase flow."}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-2 sm:flex-row">
                {isPro ? (
                  <Button
                    variant="outline"
                    onClick={() => downgradeToFree.mutate()}
                    disabled={downgradeToFree.isPending}
                  >
                    Return to Free
                  </Button>
                ) : (
                  <Button
                    onClick={() => upgradeToPro.mutate()}
                    disabled={upgradeToPro.isPending}
                  >
                    <CrownIcon />
                    Enable Pro locally
                  </Button>
                )}
                {state.paddle.enabled && (
                  <Button variant="outline" onClick={() => void paddleCheckout.openCheckout()}>
                    <CreditCardIcon />
                    Checkout with Paddle
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="gap-3">
              <CardTitle className="text-xl">Recommended later</CardTitle>
              <CardDescription>
                If you want to charge real money from China for this side project,
                do not start with Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-950">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <SparklesIcon className="size-4" />
                  Paddle is the better real-payment path later
                </div>
                <p className="mt-2 text-sm leading-6 text-emerald-950/80">
                  Keep this app on mock billing now. When you want a real checkout,
                  migrate to Paddle and let the current billing state become the
                  source of truth for plan entitlements.
                </p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Why this setup is pragmatic:</p>
                <ul className="space-y-2">
                  <li>Stripe does not list mainland China as a supported seller region.</li>
                  <li>Paddle officially lists China as supported.</li>
                  <li>This project already has enough moving parts; real tax and billing flows can wait.</li>
                </ul>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Paddle readiness
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>API key: {state.paddle.hasApiKey ? "ready" : "missing"}</li>
                  <li>Client token: {state.paddle.hasClientToken ? "ready" : "missing"}</li>
                  <li>Price ID: {state.paddle.hasPriceId ? "ready" : "missing"}</li>
                  <li>Webhook secret: {state.paddle.hasWebhookSecret ? "ready" : "missing"}</li>
                  <li>
                    Checkout script:{" "}
                    {state.paddle.enabled
                      ? paddleCheckout.readiness === "loading-script"
                        ? "loading"
                        : "ready"
                      : "waiting for config"}
                  </li>
                </ul>
                <div className="mt-3 rounded-xl border bg-muted/25 px-3 py-2 text-xs text-foreground">
                  Webhook endpoint: {PADDLE_WEBHOOK_ENDPOINT_PATH}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-6 sm:items-start">
              {state.paddle.enabled && (
                <Button onClick={() => void paddleCheckout.openPortal()} disabled={paddleCheckout.isOpeningPortal}>
                  <ExternalLinkIcon />
                  Open Paddle portal
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={PADDLE_SUPPORTED_COUNTRIES_URL} target="_blank">
                  Supported countries
                  <ArrowUpRightIcon />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="px-0">
                <Link href={PADDLE_BILLING_WORKFLOWS_URL} target="_blank">
                  Paddle billing workflows
                  <ArrowUpRightIcon />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PlanCard
            title="Free"
            description="Good enough for local development and testing."
            badgeLabel="Current default"
            features={FREE_PLAN_FEATURES}
            muted
            footer={
              isPro ? (
                <Button
                  variant="outline"
                  onClick={() => downgradeToFree.mutate()}
                  disabled={downgradeToFree.isPending}
                >
                  Switch to Free
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Already active
                </Button>
              )
            }
          />
          <PlanCard
            title="Pro"
            description="Turns on the in-app upgrade path without charging real money."
            badgeLabel="Local mode"
            features={PRO_PLAN_FEATURES}
            accent
            footer={
              isPro ? (
                <Button disabled>
                  <CrownIcon />
                  Pro enabled
                </Button>
              ) : (
                <Button
                  onClick={() => upgradeToPro.mutate()}
                  disabled={upgradeToPro.isPending}
                >
                  <CreditCardIcon />
                  Enable Pro locally
                </Button>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

const MetricTile = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-base font-medium">{value}</p>
    </div>
  );
};

const PlanCard = ({
  title,
  description,
  badgeLabel,
  features,
  footer,
  accent,
  muted,
}: {
  title: string;
  description: string;
  badgeLabel: string;
  features: string[];
  footer: ReactNode;
  accent?: boolean;
  muted?: boolean;
}) => {
  return (
    <Card className={accent ? "border-primary/30 shadow-sm" : undefined}>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={muted ? "outline" : "default"}>{badgeLabel}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {features.map((feature) => (
            <li key={feature} className="rounded-xl border bg-muted/25 px-3 py-2">
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t pt-6">{footer}</CardFooter>
    </Card>
  );
};
