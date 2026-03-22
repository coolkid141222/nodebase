import type {
  MCPServerConfig,
  MCPServerSummary,
  ToolProviderSummary,
  RegisteredTool,
} from "../../shared";
import { mcpServerConfigSchema } from "../../shared";
import { getOrCreateMCPServer, callMCPTool } from "./mcp-client";

const DEFAULT_PROVIDER_SUMMARY: ToolProviderSummary = {
  id: "MCP",
  label: "MCP Servers",
  description:
    "Discover external tools over the Model Context Protocol through stdio, HTTP, or SSE transports.",
  lifecycle: "ADAPTER_REQUIRED",
  transport: ["STDIO", "HTTP", "SSE"],
};

function resolveServerUrl(config: MCPServerConfig) {
  if (config.url) {
    return config.url;
  }

  if (!config.urlEnv) {
    return undefined;
  }

  const envValue = process.env[config.urlEnv]?.trim();
  return envValue || undefined;
}

function buildServerStatus(config: MCPServerConfig) {
  if (!config.enabled) {
    return {
      lifecycle: "ADAPTER_REQUIRED" as const,
      statusMessage: "Disabled in MCP_SERVERS_JSON.",
    };
  }

  if (config.transport === "STDIO") {
    if (!config.command) {
      return {
        lifecycle: "ADAPTER_REQUIRED" as const,
        statusMessage: "Missing `command` for stdio MCP transport.",
      };
    }

    return {
      lifecycle: "DISCOVERY" as const,
      statusMessage: "Configured for stdio discovery. Runtime adapter is next.",
    };
  }

  if (!resolveServerUrl(config)) {
    return {
      lifecycle: "ADAPTER_REQUIRED" as const,
      statusMessage: "Missing `url` or `urlEnv` for remote MCP transport.",
    };
  }

  return {
    lifecycle: "DISCOVERY" as const,
    statusMessage: "Configured for remote MCP discovery. Runtime adapter is next.",
  };
}

export function getConfiguredMcpServers(): MCPServerSummary[] {
  const raw = process.env.MCP_SERVERS_JSON?.trim();

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const configs = mcpServerConfigSchema.array().parse(parsed);

    return configs.map((config) => {
      const status = buildServerStatus(config);

      return {
        id: config.id,
        displayName: config.displayName,
        description: config.description,
        transport: config.transport,
        enabled: config.enabled,
        lifecycle: status.lifecycle,
        statusMessage: status.statusMessage,
        toolPrefix: config.toolPrefix ?? config.id,
        command: config.command,
        args: config.args,
        url: resolveServerUrl(config),
        urlEnv: config.urlEnv,
        headersEnv: config.headersEnv,
        workingDirectory: config.workingDirectory,
        env: config.env,
      };
    });
  } catch {
    return [
      {
        id: "mcp.invalid_config",
        displayName: "Invalid MCP config",
        description:
          "The MCP_SERVERS_JSON environment variable could not be parsed.",
        transport: "HTTP",
        enabled: false,
        lifecycle: "ADAPTER_REQUIRED",
        statusMessage:
          "Fix MCP_SERVERS_JSON before MCP tools can be discovered.",
        toolPrefix: "invalid",
        args: [],
        headersEnv: [],
      },
    ];
  }
}

export function getMcpProviderSummary(): ToolProviderSummary {
  const servers = getConfiguredMcpServers();

  if (servers.some((server) => server.lifecycle === "DISCOVERY")) {
    return {
      ...DEFAULT_PROVIDER_SUMMARY,
      lifecycle: "DISCOVERY",
    };
  }

  return DEFAULT_PROVIDER_SUMMARY;
}

/**
 * Discover and return all available MCP tools
 */
export async function discoverMCPTools(): Promise<RegisteredTool[]> {
  const servers = getConfiguredMcpServers().filter((s) => s.enabled && s.lifecycle === "DISCOVERY");

  const allTools: RegisteredTool[] = [];

  for (const server of servers) {
    try {
      const { tools } = await getOrCreateMCPServer(server);
      allTools.push(...tools);
    } catch (error) {
      console.error(`Failed to initialize MCP server ${server.id}:`, error);
    }
  }

  return allTools;
}

/**
 * Execute an MCP tool
 */
export async function executeMCPTool(params: {
  serverId: string;
  toolId: string;
  arguments: Record<string, unknown>;
}): Promise<{ ok: boolean; status: number; body: unknown; text: string }> {
  const { serverId, toolId, arguments: args } = params;

  try {
    const result = await callMCPTool(serverId, toolId, args);

    // Extract text content from MCP result
    const textContent = result.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n") || "";

    return {
      ok: true,
      status: 200,
      body: result,
      text: textContent,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      body: null,
      text: error instanceof Error ? error.message : String(error),
    };
  }
}
