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
  FREE_PLAN_FEATURES,
  PADDLE_SUPPORTED_COUNTRIES_URL,
  PRO_PLAN_FEATURES,
} from "@/features/billing/shared";
import {
  useBillingState,
  useUpgradeToPro,
} from "@/features/billing/hooks/use-billing";
import { usePaddleCheckout } from "@/features/billing/hooks/use-paddle-checkout";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
}: UpgradeModalProps) => {
  const router = useRouter();
  const billing = useBillingState();
  const upgradeToPro = useUpgradeToPro();
  const paddleCheckout = usePaddleCheckout();

  const activePlan = billing.data?.plan ?? BillingPlan.FREE;
  const isPro = activePlan === BillingPlan.PRO;
  const paddleEnabled = Boolean(billing.data?.paddle.enabled);

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
              {isPro ? "Pro active" : "Local upgrade"}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              No real charge
            </Badge>
          </div>
          <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="max-w-xl leading-6">
            This project is using a local billing mode right now. Upgrading marks
            your account as Pro inside the app, keeps the flow testable, and leaves
            the real payment provider for later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <PlanPanel
            title="Free"
            description="Your current baseline for development and testing."
            features={FREE_PLAN_FEATURES}
            muted
          />
          <PlanPanel
            title="Pro"
            description="Use this if you want the app to behave like a paid product."
            features={PRO_PLAN_FEATURES}
            accent
          />
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-950">
          <div className="flex items-center gap-2 font-medium">
            <SparklesIcon className="size-4" />
            Best real provider later: Paddle
          </div>
          <p className="mt-2 leading-6 text-emerald-950/80">
            For a China-based side project, keep mock billing for now. When you
            want to collect real payments, move to Paddle rather than starting with
            Stripe.
          </p>
        </div>

        {billing.data?.paddle && (
          <div className="rounded-2xl border bg-muted/25 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Paddle setup</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">
                API key {billing.data.paddle.hasApiKey ? "ready" : "missing"}
              </Badge>
              <Badge variant="outline">
                Client token {billing.data.paddle.hasClientToken ? "ready" : "missing"}
              </Badge>
              <Badge variant="outline">
                Price ID {billing.data.paddle.hasPriceId ? "ready" : "missing"}
              </Badge>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" asChild className="justify-start px-0">
            <a href={PADDLE_SUPPORTED_COUNTRIES_URL} target="_blank" rel="noreferrer">
              Why Paddle later
            </a>
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {paddleEnabled && (
              <Button variant="outline" onClick={() => void paddleCheckout.openCheckout()}>
                <CreditCardIcon />
                Checkout with Paddle
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Not now
            </Button>
            <Button onClick={handleUpgrade} disabled={upgradeToPro.isPending}>
              <CrownIcon />
              {isPro ? "Open billing portal" : "Enable Pro"}
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
