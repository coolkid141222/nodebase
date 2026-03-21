import {
  createAnthropic,
  type AnthropicProvider,
  type AnthropicProviderSettings,
} from "@ai-sdk/anthropic";
import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProvider,
  type GoogleGenerativeAIProviderSettings,
} from "@ai-sdk/google";
import {
  createDeepSeek,
  type DeepSeekProvider,
  type DeepSeekProviderSettings,
} from "@ai-sdk/deepseek";
import {
  createOpenAI,
  type OpenAIProvider,
  type OpenAIProviderSettings,
} from "@ai-sdk/openai";
import {
  createMinimax,
  type MinimaxProvider,
  type MinimaxProviderSettings,
} from "vercel-minimax-ai-provider";
import { ProxyAgent } from "undici";

function isHostedRuntime() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

function isLoopbackHost(hostname: string) {
  const normalized = hostname.trim().toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1"
  );
}

function resolveProxyUrl(useProxyEnv: string, defaultProxyUrl: string) {
  const proxyUrlEnv = useProxyEnv.replace("_USE_PROXY", "_PROXY_URL");
  const explicitProxyUrl = process.env[proxyUrlEnv]?.trim();
  const proxyUrl = explicitProxyUrl || defaultProxyUrl;

  try {
    const parsed = new URL(proxyUrl);

    // Hosted runtimes cannot reach a loopback proxy running on a developer machine.
    if (isHostedRuntime() && isLoopbackHost(parsed.hostname)) {
      return null;
    }

    return proxyUrl;
  } catch {
    return null;
  }
}

function createProviderWithProxy<
  TOptions extends { fetch?: typeof fetch },
  TProvider,
>(
  providerFactory: (options?: TOptions) => TProvider,
  useProxyEnv: string,
  defaultProxyUrl = "http://127.0.0.1:7897",
  options?: TOptions,
): TProvider {
  const useProxy = process.env[useProxyEnv] === "true";

  if (!useProxy) {
    return providerFactory(options);
  }

  const proxyUrl = resolveProxyUrl(useProxyEnv, defaultProxyUrl);

  if (!proxyUrl) {
    return providerFactory(options);
  }

  const dispatcher = new ProxyAgent(proxyUrl);
  const baseFetch = options?.fetch ?? fetch;

  return providerFactory({
    ...options,
    fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
      return baseFetch(url, {
        ...init,
        // @ts-expect-error undici dispatcher is supported at runtime but not declared on RequestInit.
        dispatcher,
      });
    },
  } as TOptions);
}

export const createGoogleProvider = (
  options?: GoogleGenerativeAIProviderSettings,
): GoogleGenerativeAIProvider =>
  createProviderWithProxy(
    createGoogleGenerativeAI,
    "GOOGLE_USE_PROXY",
    "http://127.0.0.1:7897",
    options,
  );

export const createOpenAIProvider = (
  options?: OpenAIProviderSettings,
): OpenAIProvider =>
  createProviderWithProxy(
    createOpenAI,
    "OPENAI_USE_PROXY",
    "http://127.0.0.1:7897",
    options,
  );

export const createAnthropicProvider = (
  options?: AnthropicProviderSettings,
): AnthropicProvider =>
  createProviderWithProxy(
    createAnthropic,
    "ANTHROPIC_USE_PROXY",
    "http://127.0.0.1:7897",
    options,
  );

export const createDeepSeekProvider = (
  options?: DeepSeekProviderSettings,
): DeepSeekProvider =>
  createProviderWithProxy(
    createDeepSeek,
    "DEEPSEEK_USE_PROXY",
    "http://127.0.0.1:7897",
    options,
  );

export const createMinimaxProvider = (
  options?: MinimaxProviderSettings,
): MinimaxProvider =>
  createProviderWithProxy(
    createMinimax,
    "MINIMAX_USE_PROXY",
    "http://127.0.0.1:7897",
    options,
  );

export const google = createGoogleProvider();
