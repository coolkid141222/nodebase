"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useBillingState,
  useCreatePaddlePortalLink,
  useSyncPaddleCheckout,
} from "./use-billing";

type PaddleEvent = {
  name: string;
  data?: {
    customer?: {
      id?: string;
    };
    transaction_id?: string;
    subscription_id?: string;
  };
};

type PaddleCheckoutItem = {
  priceId: string;
  quantity: number;
};

type PaddleCheckoutCustomer = {
  id?: string;
  email?: string;
  address?: {
    countryCode?: string;
  };
};

type PaddleCheckoutCustomData = {
  appUserId?: string;
};

type PaddleInstance = {
  Environment?: {
    set: (environment: "sandbox") => void;
  };
  Initialize: (config: {
    token: string;
    eventCallback?: (event: PaddleEvent) => void;
    checkout?: {
      settings?: {
        displayMode?: "overlay" | "inline";
        locale?: string;
        theme?: "light" | "dark";
      };
    };
  }) => void;
  Update?: (config: {
    eventCallback?: (event: PaddleEvent) => void;
  }) => void;
  Checkout: {
    open: (config: {
      items: PaddleCheckoutItem[];
      customer?: PaddleCheckoutCustomer;
      customData?: PaddleCheckoutCustomData;
      settings?: {
        displayMode?: "overlay" | "inline";
        locale?: string;
        theme?: "light" | "dark";
      };
    }) => void;
  };
};

declare global {
  interface Window {
    Paddle?: PaddleInstance;
    __nodebasePaddleInitialized?: boolean;
  }
}

const PADDLE_SCRIPT_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

export const usePaddleCheckout = () => {
  const billing = useBillingState();
  const syncPaddleCheckout = useSyncPaddleCheckout();
  const createPaddlePortalLink = useCreatePaddlePortalLink();
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.Paddle),
  );

  const paddle = billing.data?.paddle;
  const shouldLoadScript = Boolean(paddle?.hasClientToken);

  useEffect(() => {
    if (typeof window === "undefined" || !shouldLoadScript) {
      return;
    }

    if (window.Paddle) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${PADDLE_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = PADDLE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [shouldLoadScript]);

  useEffect(() => {
    if (!scriptReady || !paddle?.enabled || !paddle.clientToken || !window.Paddle) {
      return;
    }

    const eventCallback = (event: PaddleEvent) => {
      if (event.name !== "checkout.completed") {
        return;
      }

      const customerId = event.data?.customer?.id;
      if (!customerId) {
        return;
      }

      void syncPaddleCheckout.mutateAsync({
        customerId,
        subscriptionId: event.data?.subscription_id ?? null,
      });
    };

    if (paddle.environment === "sandbox") {
      window.Paddle.Environment?.set("sandbox");
    }

    if (!window.__nodebasePaddleInitialized) {
      window.Paddle.Initialize({
        token: paddle.clientToken,
        eventCallback,
        checkout: {
          settings: {
            displayMode: "overlay",
            locale: "zh-CN",
            theme: "light",
          },
        },
      });
      window.__nodebasePaddleInitialized = true;
      return;
    }

    window.Paddle.Update?.({
      eventCallback,
    });
  }, [paddle, scriptReady, syncPaddleCheckout]);

  const openCheckout = async () => {
    if (!paddle?.enabled || !paddle.priceId) {
      toast.error("Paddle is not configured yet.");
      return;
    }

    if (!window.Paddle || !scriptReady) {
      toast.error("Paddle.js is still loading.");
      return;
    }

    window.Paddle.Checkout.open({
      items: [
        {
          priceId: paddle.priceId,
          quantity: 1,
        },
      ],
      customer: billing.data?.billingCustomerId
        ? {
            id: billing.data.billingCustomerId,
          }
        : {
            email: billing.data?.email,
          },
      customData: {
        appUserId: billing.data?.id,
      },
      settings: {
        displayMode: "overlay",
        locale: "zh-CN",
        theme: "light",
      },
    });
  };

  const openPortal = async () => {
    const result = await createPaddlePortalLink.mutateAsync();
    window.location.assign(result.url);
  };

  const readiness = useMemo(() => {
    if (!paddle) {
      return "billing-state-loading";
    }

    if (!paddle.hasApiKey) {
      return "missing-api-key";
    }

    if (!paddle.hasClientToken) {
      return "missing-client-token";
    }

    if (!paddle.hasPriceId) {
      return "missing-price-id";
    }

    if (!scriptReady) {
      return "loading-script";
    }

    return "ready";
  }, [paddle, scriptReady]);

  return {
    readiness,
    openCheckout,
    openPortal,
    canUsePaddle: Boolean(paddle?.enabled),
    isOpeningPortal: createPaddlePortalLink.isPending,
  };
};
