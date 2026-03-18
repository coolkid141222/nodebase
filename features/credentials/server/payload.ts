import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
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

type CredentialCipherEnvelope = {
  version: 1;
  algorithm: "aes-256-gcm";
  iv: string;
  tag: string;
  ciphertext: string;
};

function toBase64Url(value: Buffer) {
  return value.toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url");
}

function getCredentialEncryptionKey() {
  const material =
    process.env.CREDENTIAL_ENCRYPTION_KEY || process.env.BETTER_AUTH_SECRET;

  if (!material) {
    throw new Error(
      "Missing credential encryption key. Set CREDENTIAL_ENCRYPTION_KEY or BETTER_AUTH_SECRET.",
    );
  }

  return createHash("sha256").update(material).digest();
}

function encryptCredentialPayload(payload: Record<string, unknown>) {
  const iv = randomBytes(12);
  const key = getCredentialEncryptionKey();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  const envelope: CredentialCipherEnvelope = {
    version: 1,
    algorithm: "aes-256-gcm",
    iv: toBase64Url(iv),
    tag: toBase64Url(tag),
    ciphertext: toBase64Url(ciphertext),
  };

  return JSON.stringify(envelope);
}

function decryptCredentialEnvelope(envelope: CredentialCipherEnvelope) {
  const key = getCredentialEncryptionKey();
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    fromBase64Url(envelope.iv),
  );
  decipher.setAuthTag(fromBase64Url(envelope.tag));

  const plaintext = Buffer.concat([
    decipher.update(fromBase64Url(envelope.ciphertext)),
    decipher.final(),
  ]).toString("utf8");

  const parsed = JSON.parse(plaintext);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Decrypted credential payload must be a JSON object.");
  }

  return parsed as Record<string, unknown>;
}

function parseStoredCredentialData(encryptedData: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(encryptedData);
  } catch {
    throw new Error("Stored credential data is not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Stored credential data must be a JSON object.");
  }

  if (
    "algorithm" in parsed &&
    "iv" in parsed &&
    "tag" in parsed &&
    "ciphertext" in parsed
  ) {
    return decryptCredentialEnvelope(parsed as CredentialCipherEnvelope);
  }

  return parsed as Record<string, unknown>;
}

export function readCredentialSecret(encryptedData: string) {
  return parseStoredCredentialData(encryptedData);
}

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
    encryptedData: encryptCredentialPayload(parsed),
    metadata: {
      version: 1,
      fields: Object.keys(parsed),
      storage: "aes-256-gcm",
    } satisfies Prisma.InputJsonValue,
  };
}

export function formatCredentialSecretForForm(encryptedData: string) {
  const parsed = parseStoredCredentialData(encryptedData);
  return JSON.stringify(parsed, null, 2);
}
