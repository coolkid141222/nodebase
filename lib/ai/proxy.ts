import { ProxyAgent } from "undici";
import { createGoogleGenerativeAI } from "@ai-sdk/google";


function createProviderWithProxy<T>(
    providerFactory: (options?: any) => T,
    useProxyEnv: string,
    defaultProxyUrl: string = "http://127.0.0.1:7897"
): T {
    const useProxy = process.env[useProxyEnv] === "true";

    if (!useProxy) {
        return providerFactory();
    }

    const proxyUrl =
        process.env[useProxyEnv.replace("_USE_PROXY", "_PROXY_URL")] ||
        defaultProxyUrl;
    const dispatcher = new ProxyAgent(proxyUrl);

    return providerFactory({
        fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
            return fetch(url, {
                ...init,
                // @ts-ignore
                dispatcher,
            });
            },
        });
    }

export const google = createProviderWithProxy(
    createGoogleGenerativeAI,
    "GOOGLE_USE_PROXY",
);