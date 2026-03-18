import { CredentialProvider, type Prisma } from "@/lib/prisma/client";

const providerLabels: Record<CredentialProvider, string> = {
  OPENAI: "OpenAI",
  ANTHROPIC: "Anthropic",
  GOOGLE: "Google",
  DISCORD: "Discord",
  SLACK: "Slack",
  STRIPE: "Stripe",
  POLAR: "Polar",
};

export const credentialProviders = Object.values(CredentialProvider).map(
  (provider) => ({
    value: provider,
    label: providerLabels[provider],
  }),
);

export function parseCredentialSecretJson(secretJson: string) {
  const trimmed = secretJson.trim();

  if (!trimmed) {
    throw new Error("Secret JSON is required.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("Secret JSON must be valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Secret JSON must be a JSON object.");
  }

  return parsed as Record<string, unknown>;
}

export function serializeCredentialSecret(secretJson: string) {
  const parsed = parseCredentialSecretJson(secretJson);

  return {
    encryptedData: JSON.stringify(parsed),
    metadata: {
      version: 1,
      fields: Object.keys(parsed),
      storage: "plain-json-scaffold",
    } satisfies Prisma.InputJsonValue,
  };
}

export function formatCredentialSecretForForm(encryptedData: string) {
  try {
    const parsed = JSON.parse(encryptedData);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return encryptedData;
  }
}
