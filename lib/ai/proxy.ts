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
  createOpenAI,
  type OpenAIProvider,
  type OpenAIProviderSettings,
} from "@ai-sdk/openai";
import { ProxyAgent } from "undici";

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

  const proxyUrl =
    process.env[useProxyEnv.replace("_USE_PROXY", "_PROXY_URL")] ||
    defaultProxyUrl;
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

export const google = createGoogleProvider();
