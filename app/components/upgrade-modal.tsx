"use client";

import { useRouter } from "next/navigation";
import { CreditCardIcon, CrownIcon, SparklesIcon } from "lucide-react";
import { BillingPlan } from "@/lib/prisma/client";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import {
  PADDLE_SUPPORTED_COUNTRIES_URL,
  PADDLE_WEBHOOK_ENDPOINT_PATH,
} from "@/features/billing/shared";
import {
  useBillingState,
  useUpgradeToPro,
} from "@/features/billing/hooks/use-billing";
import { usePaddleCheckout } from "@/features/billing/hooks/use-paddle-checkout";
import { useI18n } from "@/features/i18n/provider";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
}: UpgradeModalProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const billing = useBillingState();
  const upgradeToPro = useUpgradeToPro();
  const paddleCheckout = usePaddleCheckout();

  const activePlan = billing.data?.plan ?? BillingPlan.FREE;
  const isPro = activePlan === BillingPlan.PRO;
  const paddleEnabled = Boolean(billing.data?.paddle.enabled);
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

  const handleUpgrade = async () => {
    if (isPro) {
      onOpenChange(false);
      router.push("/billing");
      return;
    }

    await upgradeToPro.mutateAsync();
    onOpenChange(false);
    router.push("/billing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="gap-3">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full px-3 py-1">
              {isPro ? t("upgrade.badgeProActive") : t("upgrade.badgeLocalUpgrade")}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {t("upgrade.badgeNoCharge")}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{t("upgrade.title")}</DialogTitle>
          <DialogDescription className="max-w-xl leading-6">
            {t("upgrade.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <PlanPanel
            title="Free"
            description={t("billing.freeDescription")}
            features={freePlanFeatures}
            muted
          />
          <PlanPanel
            title="Pro"
            description={t("billing.proDescription")}
            features={proPlanFeatures}
            accent
          />
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-950">
          <div className="flex items-center gap-2 font-medium">
            <SparklesIcon className="size-4" />
            {t("upgrade.bestProvider")}
          </div>
          <p className="mt-2 leading-6 text-emerald-950/80">
            {t("upgrade.bestProviderBody")}
          </p>
        </div>

        {billing.data?.paddle && (
          <div className="rounded-2xl border bg-muted/25 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("upgrade.paddleSetup")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">
                {t("upgrade.apiKey")} {billing.data.paddle.hasApiKey ? t("common.ready") : t("common.missing")}
              </Badge>
              <Badge variant="outline">
                {t("upgrade.clientToken")} {billing.data.paddle.hasClientToken ? t("common.ready") : t("common.missing")}
              </Badge>
              <Badge variant="outline">
                {t("upgrade.priceId")} {billing.data.paddle.hasPriceId ? t("common.ready") : t("common.missing")}
              </Badge>
              <Badge variant="outline">
                {t("upgrade.webhook")} {billing.data.paddle.hasWebhookSecret ? t("common.ready") : t("common.missing")}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-foreground">
              {t("upgrade.endpoint")}: {PADDLE_WEBHOOK_ENDPOINT_PATH}
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" asChild className="justify-start px-0">
            <a href={PADDLE_SUPPORTED_COUNTRIES_URL} target="_blank" rel="noreferrer">
              {t("upgrade.whyPaddle")}
            </a>
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {paddleEnabled && (
              <Button variant="outline" onClick={() => void paddleCheckout.openCheckout()}>
                <CreditCardIcon />
                {t("upgrade.checkoutWithPaddle")}
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.notNow")}
            </Button>
            <Button onClick={handleUpgrade} disabled={upgradeToPro.isPending}>
              <CrownIcon />
              {isPro ? t("upgrade.openBillingPortal") : t("upgrade.enablePro")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PlanPanel = ({
  title,
  description,
  features,
  accent,
  muted,
}: {
  title: string;
  description: string;
  features: string[];
  accent?: boolean;
  muted?: boolean;
}) => {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        accent ? "border-primary/30 bg-primary/5" : "",
        muted ? "bg-muted/25" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant={accent ? "default" : "outline"}>{title}</Badge>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {features.map((feature) => (
          <li key={feature} className="rounded-xl border bg-background/80 px-3 py-2">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
