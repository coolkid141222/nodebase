"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CreditCardIcon,
  CrownIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from "lucide-react";
import { BillingPlan } from "@/lib/prisma/client";
import { LoadingView } from "@/app/components/entity-compoents";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
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

  const primaryAction = isPro ? (
    <Button
      variant="outline"
      onClick={() => downgradeToFree.mutate()}
      disabled={downgradeToFree.isPending}
    >
      Return to Free
    </Button>
  ) : (
    <Button onClick={() => upgradeToPro.mutate()} disabled={upgradeToPro.isPending}>
      <CrownIcon />
      Enable Pro locally
    </Button>
  );

  return (
    <div className="p-4 md:px-10 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(250,245,239,0.95)_55%,rgba(255,248,241,0.98))] shadow-sm">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                Billing
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
                  A quieter billing layer for your workflow lab.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  This page now behaves more like a real pricing surface: local Pro
                  for instant testing, Paddle kept ready for the day you actually
                  want to charge money.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusPill label={state.plan === BillingPlan.PRO ? "Pro plan" : "Free plan"} />
                <StatusPill label={getBillingStatusLabel(state.billingStatus)} />
                <StatusPill label={getBillingProviderLabel(state.billingProvider)} />
              </div>

              <div className="flex flex-wrap gap-3">
                {primaryAction}
                {state.paddle.enabled && (
                  <Button
                    variant="outline"
                    onClick={() => void paddleCheckout.openCheckout()}
                  >
                    <CreditCardIcon />
                    Checkout with Paddle
                  </Button>
                )}
                {state.paddle.enabled && (
                  <Button
                    variant="ghost"
                    onClick={() => void paddleCheckout.openPortal()}
                    disabled={paddleCheckout.isOpeningPortal}
                  >
                    <ExternalLinkIcon />
                    Open Paddle portal
                  </Button>
                )}
              </div>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                The practical path for this project is still the same: keep local
                billing on by default, then switch to Paddle when you want a real
                checkout that works better for a China-based side project.
              </p>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-background/85 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                    Current plan
                  </p>
                  <p className="mt-2 font-serif text-3xl text-foreground">
                    {state.plan === BillingPlan.PRO ? "Pro" : "Free"}
                  </p>
                </div>
                <Badge className="rounded-full px-3 py-1">
                  {state.plan === BillingPlan.PRO ? "Active" : "Default"}
                </Badge>
              </div>

              <div className="mt-6 grid gap-3">
                <HeroRow
                  label="Provider"
                  value={getBillingProviderLabel(state.billingProvider)}
                />
                <HeroRow
                  label="Renewal"
                  value={
                    state.billingCurrentPeriodEnd
                      ? format(new Date(state.billingCurrentPeriodEnd), "PPP")
                      : "No renewal scheduled"
                  }
                />
                <HeroRow
                  label="Webhook sync"
                  value={
                    state.billingLastEventAt
                      ? `Updated ${format(new Date(state.billingLastEventAt), "PPP p")}`
                      : "No Paddle event received yet"
                  }
                />
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  Readiness
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {state.paddle.enabled
                    ? "Checkout can open right now. Add the webhook secret to finish the full lifecycle sync."
                    : "Paddle is still optional. Until those credentials exist, the page stays safely in local mode."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel className="bg-background">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Eyebrow>System State</Eyebrow>
                <h2 className="font-serif text-2xl text-foreground">Plan details</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  The essential bits only: account state, renewal state, and what
                  this billing layer is currently doing.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {state.plan}
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Billing status"
                value={getBillingStatusLabel(state.billingStatus)}
                detail={
                  isPro
                    ? "This account currently resolves to Pro."
                    : "This account currently resolves to Free."
                }
              />
              <MetricCard
                label="Paddle environment"
                value={state.paddle.environment}
                detail="Sandbox by default until you switch the public environment variable."
              />
              <MetricCard
                label="Customer record"
                value={state.billingCustomerId ? "Linked" : "Not linked yet"}
                detail={state.billingCustomerId ?? "Created automatically once you use Paddle."}
              />
              <MetricCard
                label="Subscription record"
                value={state.billingSubscriptionId ? "Tracked" : "Not tracked yet"}
                detail={state.billingSubscriptionId ?? "Will populate after Paddle returns a subscription."}
              />
            </div>

            <div className="mt-6 rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(248,244,239,0.7),rgba(255,255,255,1))] p-5">
              <Eyebrow>Why this path</Eyebrow>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                  <SparklesIcon className="size-4" />
                </div>
                <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Paddle is still the better long-term provider here.
                  </p>
                  <p>
                    Stripe does not list mainland China as a supported seller
                    region. Paddle does list China, which makes it the saner path
                    once you leave local-only mode.
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="bg-background">
            <div className="flex flex-col gap-2">
              <Eyebrow>Paddle Readiness</Eyebrow>
              <h2 className="font-serif text-2xl text-foreground">
                What is configured right now
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                This is the operational checklist, not marketing copy. If all five
                rows are green, checkout plus webhook sync are both wired.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <ReadinessRow
                label="Paddle API key"
                ready={state.paddle.hasApiKey}
                detail="Used by the server to create portal links and customer records."
              />
              <ReadinessRow
                label="Client-side token"
                ready={state.paddle.hasClientToken}
                detail="Loads Paddle.js and opens overlay checkout in the browser."
              />
              <ReadinessRow
                label="Pro price ID"
                ready={state.paddle.hasPriceId}
                detail="The price entity used for the Pro checkout."
              />
              <ReadinessRow
                label="Webhook secret"
                ready={state.paddle.hasWebhookSecret}
                detail="Required for signature verification and automatic subscription sync."
              />
              <ReadinessRow
                label="Checkout script"
                ready={paddleCheckout.readiness === "ready"}
                detail={
                  state.paddle.enabled
                    ? paddleCheckout.readiness === "loading-script"
                      ? "Paddle.js is loading in the browser."
                      : "The browser checkout runtime is ready."
                    : "The script stays unloaded until a client token exists."
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="rounded-[24px] border border-border/70 bg-muted/25 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  Webhook endpoint
                </p>
                <p className="mt-3 break-all rounded-xl bg-background px-3 py-2 font-mono text-xs text-foreground">
                  {PADDLE_WEBHOOK_ENDPOINT_PATH}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href={PADDLE_SUPPORTED_COUNTRIES_URL} target="_blank">
                    Supported countries
                    <ArrowUpRightIcon />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={PADDLE_BILLING_WORKFLOWS_URL} target="_blank">
                    Billing workflows
                    <ArrowUpRightIcon />
                  </Link>
                </Button>
              </div>
            </div>
          </Panel>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Eyebrow>Plans</Eyebrow>
              <h2 className="font-serif text-2xl text-foreground">Choose your mode</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              This section follows the Claude pricing rhythm more closely: two
              clear cards, one strong choice, minimal noise.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PlanCard
              title="Free"
              price="$0"
              description="Stay here if you just want the editor, triggers, nodes, and execution history."
              badgeLabel="Current baseline"
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
              price={state.paddle.enabled ? "Paddle" : "Local"}
              description="Use local Pro for instant testing now, or hand off to Paddle once you configure real checkout."
              badgeLabel={state.paddle.enabled ? "Ready to charge" : "Local mode"}
              features={PRO_PLAN_FEATURES}
              accent
              footer={
                isPro ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button disabled>
                      <CrownIcon />
                      Pro enabled
                    </Button>
                    {state.paddle.enabled && (
                      <Button
                        variant="outline"
                        onClick={() => void paddleCheckout.openCheckout()}
                      >
                        <CreditCardIcon />
                        Open checkout
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={() => upgradeToPro.mutate()}
                      disabled={upgradeToPro.isPending}
                    >
                      <CreditCardIcon />
                      Enable Pro locally
                    </Button>
                    {state.paddle.enabled && (
                      <Button
                        variant="outline"
                        onClick={() => void paddleCheckout.openCheckout()}
                      >
                        <CreditCardIcon />
                        Checkout with Paddle
                      </Button>
                    )}
                  </div>
                )
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const Panel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/70 p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
      {children}
    </p>
  );
};

const StatusPill = ({ label }: { label: string }) => {
  return (
    <div className="inline-flex items-center rounded-full border border-border/70 bg-background/85 px-3 py-1.5 text-sm text-foreground">
      {label}
    </div>
  );
};

const HeroRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-muted/25 px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) => {
  return (
    <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
};

const ReadinessRow = ({
  label,
  ready,
  detail,
}: {
  label: string;
  ready: boolean;
  detail: string;
}) => {
  return (
    <div className="flex items-start gap-4 rounded-[22px] border border-border/70 bg-background p-4">
      <div
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          ready ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground",
        )}
      >
        <CheckIcon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "ml-auto rounded-full px-2.5 py-1",
          ready ? "border-emerald-200 text-emerald-700" : "text-muted-foreground",
        )}
      >
        {ready ? "Ready" : "Missing"}
      </Badge>
    </div>
  );
};

const PlanCard = ({
  title,
  price,
  description,
  badgeLabel,
  features,
  footer,
  accent,
  muted,
}: {
  title: string;
  price: string;
  description: string;
  badgeLabel: string;
  features: string[];
  footer: ReactNode;
  accent?: boolean;
  muted?: boolean;
}) => {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/70 p-6 shadow-sm",
        muted && "bg-background",
        accent &&
          "bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(255,255,255,1))]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Badge variant={accent ? "default" : "outline"} className="rounded-full px-3 py-1">
          {badgeLabel}
        </Badge>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="font-serif text-3xl text-foreground">{title}</h3>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-foreground">
            {price}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">
            {title === "Free" ? "for experiments" : "for paid-mode testing"}
          </span>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3"
          >
            <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
              <CheckIcon className="size-3.5" />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{feature}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-border/70 pt-6">{footer}</div>
    </div>
  );
};
