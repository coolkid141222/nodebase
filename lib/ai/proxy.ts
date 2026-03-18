import { ProxyAgent } from "undici";
import {
    createGoogleGenerativeAI,
    type GoogleGenerativeAIProvider,
    type GoogleGenerativeAIProviderSettings,
} from "@ai-sdk/google";


function createProviderWithProxy<TOptions extends { fetch?: typeof fetch }, TProvider>(
    providerFactory: (options?: TOptions) => TProvider,
    useProxyEnv: string,
    defaultProxyUrl: string = "http://127.0.0.1:7897",
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

export const google = createGoogleProvider();
