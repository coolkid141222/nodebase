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
  isProPlanActive,
  PADDLE_BILLING_WORKFLOWS_URL,
  PADDLE_SUPPORTED_COUNTRIES_URL,
  PADDLE_WEBHOOK_ENDPOINT_PATH,
} from "../shared";
import {
  useDowngradeToFree,
  useSuspenseBillingState,
  useUpgradeToPro,
} from "../hooks/use-billing";
import { usePaddleCheckout } from "../hooks/use-paddle-checkout";
import { useI18n } from "@/features/i18n/provider";

export const BillingLoading = () => {
  const { t } = useI18n();
  return <LoadingView message={t("billing.loading")} />;
};

export const BillingPortalView = () => {
  const { t } = useI18n();
  const billing = useSuspenseBillingState();
  const upgradeToPro = useUpgradeToPro();
  const downgradeToFree = useDowngradeToFree();

  const state = billing.data;
  const isPro = isProPlanActive(state);
  const paddleCheckout = usePaddleCheckout();
  const freePlanFeatures = [
    t("billing.feature.free.1"),
    t("billing.feature.free.2"),
    t("billing.feature.free.3"),
  ];
  const proPlanFeatures = [
    t("billing.feature.pro.1"),
    t("billing.feature.pro.2"),
    t("billing.feature.pro.3"),
  ];
  const providerLabel =
    state.billingProvider === "MOCK"
      ? t("billing.mockProvider")
      : state.billingProvider === "PADDLE"
        ? "Paddle"
        : t("billing.notConnected");
  const billingStatusLabel =
    state.billingStatus === "ACTIVE"
      ? t("common.active")
      : state.billingStatus === "CANCELED"
        ? t("billing.statusCanceled")
        : t("billing.statusInactive");

  const primaryAction = isPro ? (
    <Button
      variant="outline"
      onClick={() => downgradeToFree.mutate()}
      disabled={downgradeToFree.isPending}
    >
      {t("billing.returnFree")}
    </Button>
  ) : (
    <Button onClick={() => upgradeToPro.mutate()} disabled={upgradeToPro.isPending}>
      <CrownIcon />
      {t("billing.enableProLocally")}
    </Button>
  );

  return (
    <div className="p-4 md:px-10 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(250,245,239,0.95)_55%,rgba(255,248,241,0.98))] shadow-sm">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                {t("billing.heroEyebrow")}
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
                  {t("billing.heroTitle")}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  {t("billing.heroDescription")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusPill label={state.plan === BillingPlan.PRO ? t("billing.planPro") : t("billing.planFree")} />
                <StatusPill label={billingStatusLabel} />
                <StatusPill label={providerLabel} />
              </div>

              <div className="flex flex-wrap gap-3">
                {primaryAction}
                {state.paddle.enabled && (
                  <Button
                    variant="outline"
                    onClick={() => void paddleCheckout.openCheckout()}
                  >
                    <CreditCardIcon />
                    {t("billing.checkoutWithPaddle")}
                  </Button>
                )}
                {state.paddle.enabled && (
                  <Button
                    variant="ghost"
                    onClick={() => void paddleCheckout.openPortal()}
                    disabled={paddleCheckout.isOpeningPortal}
                  >
                    <ExternalLinkIcon />
                    {t("billing.openPaddlePortal")}
                  </Button>
                )}
              </div>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {t("billing.heroFootnote")}
              </p>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-background/85 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                    {t("billing.currentPlan")}
                  </p>
                  <p className="mt-2 font-serif text-3xl text-foreground">
                    {state.plan === BillingPlan.PRO ? "Pro" : "Free"}
                  </p>
                </div>
                <Badge className="rounded-full px-3 py-1">
                  {state.plan === BillingPlan.PRO ? t("common.active") : t("billing.default")}
                </Badge>
              </div>

              <div className="mt-6 grid gap-3">
                <HeroRow
                  label={t("billing.provider")}
                  value={providerLabel}
                />
                <HeroRow
                  label={t("billing.renewal")}
                  value={
                    state.billingCurrentPeriodEnd
                      ? format(new Date(state.billingCurrentPeriodEnd), "PPP")
                      : t("billing.noRenewal")
                  }
                />
                <HeroRow
                  label={t("billing.webhookSync")}
                  value={
                    state.billingLastEventAt
                      ? `Updated ${format(new Date(state.billingLastEventAt), "PPP p")}`
                      : t("billing.noWebhook")
                  }
                />
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  {t("billing.readiness")}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {state.paddle.enabled
                    ? t("billing.readinessReady")
                    : t("billing.readinessLocal")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel className="bg-background">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Eyebrow>{t("billing.systemState")}</Eyebrow>
                <h2 className="font-serif text-2xl text-foreground">{t("billing.planDetails")}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("billing.planDetailsDescription")}
                </p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {state.plan}
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MetricCard
                label={t("billing.billingStatus")}
                value={billingStatusLabel}
                detail={
                  isPro
                    ? t("billing.proResolved")
                    : t("billing.freeResolved")
                }
              />
              <MetricCard
                label={t("billing.paddleEnvironment")}
                value={state.paddle.environment}
                detail={t("billing.sandboxDefault")}
              />
              <MetricCard
                label={t("billing.customerRecord")}
                value={state.billingCustomerId ? t("billing.customerLinked") : t("billing.customerMissing")}
                detail={state.billingCustomerId ?? t("billing.customerMissingDetail")}
              />
              <MetricCard
                label={t("billing.subscriptionRecord")}
                value={state.billingSubscriptionId ? t("billing.subscriptionTracked") : t("billing.subscriptionMissing")}
                detail={state.billingSubscriptionId ?? t("billing.subscriptionMissingDetail")}
              />
            </div>

            <div className="mt-6 rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(248,244,239,0.7),rgba(255,255,255,1))] p-5">
              <Eyebrow>{t("billing.whyPath")}</Eyebrow>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                  <SparklesIcon className="size-4" />
                </div>
                <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {t("billing.paddleBetter")}
                  </p>
                  <p>{t("billing.paddleBetterBody")}</p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="bg-background">
            <div className="flex flex-col gap-2">
              <Eyebrow>{t("billing.paddleReadiness")}</Eyebrow>
              <h2 className="font-serif text-2xl text-foreground">
                {t("billing.paddleConfigured")}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {t("billing.paddleConfiguredDescription")}
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <ReadinessRow
                label={t("upgrade.apiKey")}
                ready={state.paddle.hasApiKey}
                detail="Used by the server to create portal links and customer records."
              />
              <ReadinessRow
                label={t("upgrade.clientToken")}
                ready={state.paddle.hasClientToken}
                detail="Loads Paddle.js and opens overlay checkout in the browser."
              />
              <ReadinessRow
                label={t("upgrade.priceId")}
                ready={state.paddle.hasPriceId}
                detail="The price entity used for the Pro checkout."
              />
              <ReadinessRow
                label={t("upgrade.webhook")}
                ready={state.paddle.hasWebhookSecret}
                detail="Required for signature verification and automatic subscription sync."
              />
              <ReadinessRow
                label={t("billing.checkoutScript")}
                ready={paddleCheckout.readiness === "ready"}
                detail={
                  state.paddle.enabled
                    ? paddleCheckout.readiness === "loading-script"
                      ? t("billing.checkoutScriptLoading")
                      : t("billing.checkoutScriptReady")
                    : t("billing.checkoutScriptIdle")
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="rounded-[24px] border border-border/70 bg-muted/25 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  {t("billing.webhookEndpoint")}
                </p>
                <p className="mt-3 break-all rounded-xl bg-background px-3 py-2 font-mono text-xs text-foreground">
                  {PADDLE_WEBHOOK_ENDPOINT_PATH}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href={PADDLE_SUPPORTED_COUNTRIES_URL} target="_blank">
                    {t("billing.supportedCountries")}
                    <ArrowUpRightIcon />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={PADDLE_BILLING_WORKFLOWS_URL} target="_blank">
                    {t("billing.workflows")}
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
              <Eyebrow>{t("billing.plans")}</Eyebrow>
              <h2 className="font-serif text-2xl text-foreground">{t("billing.chooseMode")}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              {t("billing.chooseModeDescription")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PlanCard
              title="Free"
              price="$0"
              description={t("billing.freeDescription")}
              badgeLabel={t("billing.currentBaseline")}
              features={freePlanFeatures}
              muted
              footer={
                isPro ? (
                  <Button
                    variant="outline"
                    onClick={() => downgradeToFree.mutate()}
                    disabled={downgradeToFree.isPending}
                  >
                    {t("billing.switchToFree")}
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    {t("billing.alreadyActive")}
                  </Button>
                )
              }
            />
            <PlanCard
              title="Pro"
              price={state.paddle.enabled ? "Paddle" : "Local"}
              description={t("billing.proDescription")}
              badgeLabel={state.paddle.enabled ? t("billing.readyToCharge") : t("billing.localMode")}
              features={proPlanFeatures}
              accent
              footer={
                isPro ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button disabled>
                      <CrownIcon />
                      {t("billing.proEnabled")}
                    </Button>
                    {state.paddle.enabled && (
                      <Button
                        variant="outline"
                        onClick={() => void paddleCheckout.openCheckout()}
                      >
                        <CreditCardIcon />
                        {t("billing.openCheckout")}
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
                      {t("billing.enableProLocally")}
                    </Button>
                    {state.paddle.enabled && (
                      <Button
                        variant="outline"
                        onClick={() => void paddleCheckout.openCheckout()}
                      >
                        <CreditCardIcon />
                        {t("billing.checkoutWithPaddle")}
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
