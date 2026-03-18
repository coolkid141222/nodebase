import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { google } from "@/lib/ai/proxy";
import { DEFAULT_AI_SMOKE_PROMPT } from "../shared";

const deepseek = createDeepSeek();

const GOOGLE_MODEL = "gemini-2.5-flash";
const DEEPSEEK_MODEL = "deepseek-chat";

type ProviderKey = "google" | "deepseek";
type ProviderStatus = "success" | "error" | "skipped";

type UsageSummary = {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  reasoningTokens: number | null;
};

export type AISmokeTestResult = {
  provider: ProviderKey;
  label: string;
  model: string;
  configured: boolean;
  status: ProviderStatus;
  text: string;
  finishReason: string | null;
  durationMs: number;
  usage: UsageSummary;
  error: string | null;
};

type ProviderDefinition = {
  provider: ProviderKey;
  label: string;
  model: string;
  envKey: string;
  run: (prompt: string) => Promise<{
    text: string;
    finishReason: string;
    usage?: Record<string, number | undefined> | undefined;
  }>;
};

const providerDefinitions: ProviderDefinition[] = [
  {
    provider: "google",
    label: "Google",
    model: GOOGLE_MODEL,
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    run: async (prompt) => {
      const result = await generateText({
        model: google(GOOGLE_MODEL),
        prompt,
        temperature: 0,
        maxOutputTokens: 64,
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        },
      });

      return {
        text: result.text,
        finishReason: result.finishReason,
        usage: result.usage,
      };
    },
  },
  {
    provider: "deepseek",
    label: "DeepSeek",
    model: DEEPSEEK_MODEL,
    envKey: "DEEPSEEK_API_KEY",
    run: async (prompt) => {
      const result = await generateText({
        model: deepseek(DEEPSEEK_MODEL),
        prompt,
        temperature: 0,
        maxOutputTokens: 64,
      });

      return {
        text: result.text,
        finishReason: result.finishReason,
        usage: result.usage,
      };
    },
  },
];

function summarizeUsage(
  usage?: Record<string, number | undefined> | undefined,
): UsageSummary {
  return {
    inputTokens: usage?.inputTokens ?? null,
    outputTokens: usage?.outputTokens ?? null,
    totalTokens: usage?.totalTokens ?? null,
    reasoningTokens: usage?.reasoningTokens ?? null,
  };
}

async function runProviderSmokeTest(
  definition: ProviderDefinition,
  prompt: string,
): Promise<AISmokeTestResult> {
  const configured = Boolean(process.env[definition.envKey]);

  if (!configured) {
    return {
      provider: definition.provider,
      label: definition.label,
      model: definition.model,
      configured: false,
      status: "skipped",
      text: "",
      finishReason: null,
      durationMs: 0,
      usage: summarizeUsage(),
      error: `Missing ${definition.envKey}.`,
    };
  }

  const startedAt = Date.now();

  try {
    const result = await definition.run(prompt);

    return {
      provider: definition.provider,
      label: definition.label,
      model: definition.model,
      configured: true,
      status: "success",
      text: result.text.trim() || "[empty text response]",
      finishReason: result.finishReason ?? null,
      durationMs: Date.now() - startedAt,
      usage: summarizeUsage(result.usage),
      error: null,
    };
  } catch (error) {
    return {
      provider: definition.provider,
      label: definition.label,
      model: definition.model,
      configured: true,
      status: "error",
      text: "",
      finishReason: null,
      durationMs: Date.now() - startedAt,
      usage: summarizeUsage(),
      error:
        error instanceof Error ? error.message : "Provider request failed.",
    };
  }
}

export async function runAISmokeTest(prompt: string) {
  const normalizedPrompt = prompt.trim() || DEFAULT_AI_SMOKE_PROMPT;
  const startedAt = new Date().toISOString();

  const results = await Promise.all(
    providerDefinitions.map((definition) =>
      runProviderSmokeTest(definition, normalizedPrompt),
    ),
  );

  return {
    prompt: normalizedPrompt,
    startedAt,
    results,
  };
}
