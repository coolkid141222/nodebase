import { TRPCError } from "@trpc/server";

type PaddleEnvironment = "sandbox" | "live";

type PaddleEnvelope<T> = {
  data: T;
};

type PaddleCustomer = {
  id: string;
  email: string;
};

type PaddlePortalSession = {
  urls: {
    general?: {
      overview?: string;
    };
  };
};

const getPaddleEnvironment = (): PaddleEnvironment => {
  return process.env.NEXT_PUBLIC_PADDLE_ENV === "live" ? "live" : "sandbox";
};

const getPaddleApiKey = () => process.env.PADDLE_API_KEY ?? "";
const getPaddleClientToken = () => process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
const getPaddlePriceId = () => process.env.PADDLE_PRO_PRICE_ID ?? "";

export const getPaddleConfig = () => {
  const apiKey = getPaddleApiKey();
  const clientToken = getPaddleClientToken();
  const priceId = getPaddlePriceId();

  return {
    environment: getPaddleEnvironment(),
    hasApiKey: Boolean(apiKey),
    hasClientToken: Boolean(clientToken),
    hasPriceId: Boolean(priceId),
    enabled: Boolean(apiKey && clientToken && priceId),
    clientToken: clientToken || null,
    priceId: priceId || null,
  };
};

const paddleRequest = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const apiKey = getPaddleApiKey();

  if (!apiKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Paddle is not configured yet. Add PADDLE_API_KEY first.",
    });
  }

  const response = await fetch(`https://api.paddle.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | PaddleEnvelope<T>
    | { error?: { detail?: string } }
    | null;

  if (!response.ok || !payload || !("data" in payload)) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message:
        (payload &&
          "error" in payload &&
          payload.error?.detail) ||
        "Paddle request failed.",
    });
  }

  return payload.data;
};

export const ensurePaddleCustomer = async ({
  existingCustomerId,
  email,
  name,
  userId,
}: {
  existingCustomerId: string | null;
  email: string;
  name: string | null;
  userId: string;
}) => {
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await paddleRequest<PaddleCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      email,
      name,
      custom_data: {
        appUserId: userId,
      },
    }),
  });

  return customer.id;
};

export const createPaddlePortalOverviewLink = async ({
  customerId,
}: {
  customerId: string;
}) => {
  const portalSession = await paddleRequest<PaddlePortalSession>(
    `/customers/${customerId}/portal-sessions`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );

  const overviewUrl = portalSession.urls.general?.overview;

  if (!overviewUrl) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Paddle did not return a customer portal overview URL.",
    });
  }

  return overviewUrl;
};
