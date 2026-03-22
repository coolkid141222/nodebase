import { spawn } from "child_process";
import type { MCPServerSummary } from "../../shared";
import type { RegisteredTool, ToolParameter } from "../../shared";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChildProc = any;

type ServerState = {
  config: MCPServerSummary;
  process: ChildProc;
  tools: RegisteredTool[];
  ready: boolean;
};

const serverCache = new Map<string, ServerState>();

interface MCPJsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPJsonRpcResponse {
  jsonrpc: "2.0";
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

async function sendMCPRequest(
  proc: ChildProc,
  method: string,
  params?: Record<string, unknown>,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const request: MCPJsonRpcRequest = { jsonrpc: "2.0", id, method, params };
    let responseData = "";

    const stdout = proc.stdout;
    if (!stdout) { reject(new Error("stdout unavailable")); return; }

    const onData = (chunk: Buffer) => {
      responseData += chunk.toString();
      try {
        const lines = responseData.split("\n").filter((l: string) => l.trim());
        for (const line of lines) {
          try {
            const response = JSON.parse(line) as MCPJsonRpcResponse;
            if (response.id === id) {
              stdout.removeListener("data", onData);
              if (response.error) reject(new Error(response.error.message));
              else resolve(response.result);
              return;
            }
          } catch { /* continue */ }
        }
      } catch { /* continue */ }
    };

    stdout.on("data", onData);

    const stdin = proc.stdin;
    if (!stdin) { reject(new Error("stdin unavailable")); return; }

    stdin.write(JSON.stringify(request) + "\n", (err: Error | null) => {
      if (err) { stdout.removeListener("data", onData); reject(err); }
    });

    setTimeout(() => { stdout.removeListener("data", onData); reject(new Error("timeout")); }, 60000);
  });
}

export async function getOrCreateMCPServer(config: MCPServerSummary): Promise<{ tools: RegisteredTool[] }> {
  const cached = serverCache.get(config.id);
  if (cached?.ready && cached.tools.length > 0) return { tools: cached.tools };

  if (config.transport === "STDIO" && config.command) return createStdioMCPConnection(config);
  throw new Error(`Unsupported transport: ${config.transport}`);
}

async function createStdioMCPConnection(config: MCPServerSummary): Promise<{ tools: RegisteredTool[] }> {
  mcpLog(`createStdioMCPConnection: starting for ${config.id}`);
  const existing = serverCache.get(config.id);
  if (existing?.process) { existing.process.kill(); serverCache.delete(config.id); }

  const baseEnv: Record<string, string> = {};
  if (process.env) for (const [k, v] of Object.entries(process.env)) if (v) baseEnv[k] = v;
  if (config.env) for (const [k, v] of Object.entries(config.env)) baseEnv[k] = v;

  mcpLog(`createStdioMCPConnection: spawning process ${config.command} ${config.args?.join(" ")}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childProcess: any = spawn(config.command as string, config.args || [], {
    stdio: ["pipe", "pipe", "pipe"],
    // @ts-expect-error - spawn env typing is complex
    env: baseEnv,
    cwd: config.workingDirectory || process.cwd(),
    shell: true,
  });

  childProcess.stderr.on("data", (data: Buffer) => {
    mcpLog(`[${config.id} stderr]: ${data.toString().slice(0, 200)}`);
  });

  await new Promise<void>((resolve, reject) => {
    const tm = setTimeout(() => {
      mcpLog(`createStdioMCPConnection: startup timeout for ${config.id}`);
      reject(new Error("startup timeout"));
    }, 30000);
    childProcess.on("error", (e: Error) => { clearTimeout(tm); mcpLog(`createStdioMCPConnection: spawn error: ${e.message}`); reject(e); });
    childProcess.on("spawn", () => { clearTimeout(tm); mcpLog(`createStdioMCPConnection: process spawned for ${config.id}`); resolve(); });
  });

  try {
    // Try initialize first - some servers require it
    mcpLog(`createStdioMCPConnection: sending initialize for ${config.id}`);
    try {
      await sendMCPRequest(childProcess, "initialize", {
        protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "nodebase", version: "1.0.0" },
      });
      await sendMCPRequest(childProcess, "initialized", {});
    } catch (initErr) {
      mcpLog(`createStdioMCPConnection: initialize failed (trying without): ${initErr instanceof Error ? initErr.message : String(initErr)}`);
      // Some servers don't need initialize - continue anyway
    }

    mcpLog(`createStdioMCPConnection: sending tools/list for ${config.id}`);
    const listResponse = (await sendMCPRequest(childProcess, "tools/list", {})) as {
      tools?: Array<{ name: string; description?: string; inputSchema?: { properties?: Record<string, { description?: string; type?: string }>; required?: string[] } }>;
    };

    const tools: RegisteredTool[] = (listResponse.tools || []).map((tool) => {
      const params: ToolParameter[] = [];
      if (tool.inputSchema?.properties) {
        for (const [key, prop] of Object.entries(tool.inputSchema.properties)) {
          params.push({ key, label: key, description: prop.description || "", type: (prop.type as "string" | "number" | "boolean" | "object" | "array") || "string", required: (tool.inputSchema.required || []).includes(key) });
        }
      }
      return {
        id: `${config.id}.${tool.name}`, provider: "MCP" as const, displayName: tool.name, description: tool.description || "",
        transport: "STDIO" as const, lifecycle: "READY" as const, dangerous: false, requiresApproval: false, capabilities: [], parameters: params, tags: ["mcp"],
      };
    });

    mcpLog(`createStdioMCPConnection: got ${tools.length} tools for ${config.id}: ${tools.map(t => t.displayName).join(", ")}`);

    serverCache.set(config.id, { config, process: childProcess, tools, ready: true });
    childProcess.on("exit", () => { const s = serverCache.get(config.id); if (s) { s.ready = false; s.process = null; } });
    childProcess.on("error", (e: Error) => { mcpLog(`MCP ${config.id} error: ${e.message}`); const s = serverCache.get(config.id); if (s) s.ready = false; });

    return { tools };
  } catch (e) {
    mcpLog(`createStdioMCPConnection: error for ${config.id}: ${e instanceof Error ? e.message : String(e)}`);
    childProcess.kill();
    throw e;
  }
}

const MCP_LOG_FILE = process.env.MCP_LOG_FILE || "mcp-debug.log";

function mcpLog(...args: unknown[]) {
  const msg = `[MCP] ${new Date().toISOString()} ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}\n`;
  try {
    require('fs').appendFileSync(MCP_LOG_FILE, msg);
  } catch {}
  console.log(...args);
}

export async function callMCPTool(serverId: string, toolName: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text?: string }> }> {
  mcpLog(`callMCPTool called: serverId=${serverId}, toolName=${toolName}`);

  let cached = serverCache.get(serverId);

  // Check if process is still running
  if (cached?.process && cached.process.exitCode !== null) {
    mcpLog(`Server ${serverId} has exited, reinitializing...`);
    cached.ready = false;
    cached.process = null;
    serverCache.set(serverId, cached);
  }

  // Initialize server if not ready
  if (!cached?.ready || !cached?.process) {
    mcpLog(`Server ${serverId} not ready, initializing...`);
    // Get server config from environment
    const { getConfiguredMcpServers } = await import("../adapters/mcp");
    const servers = getConfiguredMcpServers();
    const serverConfig = servers.find((s) => s.id === serverId);

    if (!serverConfig) {
      throw new Error(`Server ${serverId} not configured`);
    }

    if (!serverConfig.enabled) {
      throw new Error(`Server ${serverId} is disabled`);
    }

    if (serverConfig.lifecycle !== "READY" && serverConfig.lifecycle !== "DISCOVERY") {
      throw new Error(`Server ${serverId} not ready: ${serverConfig.statusMessage}`);
    }

    // Initialize the server
    mcpLog(`Creating MCP server for ${serverId}...`);
    const { tools } = await getOrCreateMCPServer(serverConfig);
    mcpLog(`Server created, tools: ${tools.map(t => t.displayName).join(", ")}`);
    cached = serverCache.get(serverId);
  }

  if (!cached?.process || !cached.ready) throw new Error(`Server ${serverId} unavailable`);

  // Find the actual tool name - try exact match first, then try suffix match
  let name = toolName.includes(".") ? toolName.split(".").pop()! : toolName;
  mcpLog(`Looking for tool: ${name}, available: ${cached.tools.map(t => t.displayName).join(", ")}`);

  // Check if the tool exists in registered tools
  const registeredTool = cached.tools.find(
    (t) => t.id === toolName || t.id === `${serverId}.${name}` || t.displayName === name
  );

  if (registeredTool) {
    // Extract the actual tool name from the MCP server
    name = registeredTool.displayName;
    mcpLog(`Found tool via ID match: ${name}`);
  } else {
    // Try to find by suffix match (e.g., "search" matches "duckduckgo_web_search")
    // Try multiple matching strategies
    const strategies = [
      // Exact match
      (t: RegisteredTool) => t.displayName === name,
      // Match without server prefix (e.g., "search" matches "duckduckgo_web_search")
      (t: RegisteredTool) => t.displayName.split("_").pop() === name,
      // Contains match
      (t: RegisteredTool) => t.displayName.includes(name),
      // Reverse contains (tool name contains input)
      (t: RegisteredTool) => name.includes(t.displayName.split("_").pop() || ""),
    ];

    for (const strategy of strategies) {
      const match = cached.tools.find(strategy);
      if (match) {
        name = match.displayName;
        mcpLog(`Found tool via ${strategy.name}: ${name}`);
        break;
      }
    }

    if (!cached.tools.find(t => t.displayName === name)) {
      mcpLog(`Tool not found, using original: ${name}`);
    }
  }

  try {
    mcpLog(`Calling tool: ${name} with args:`, JSON.stringify(args));
    const result = (await sendMCPRequest(cached.process, "tools/call", { name, arguments: args })) as { content?: Array<{ type: string; text?: string }> };
    mcpLog(`Result:`, JSON.stringify(result).slice(0, 500));
    return { content: result?.content || [] };
  } catch (e) { throw new Error(`Call failed: ${e instanceof Error ? e.message : String(e)}`); }
}

export function getAllMCPTools(): RegisteredTool[] {
  const arr: RegisteredTool[] = [];
  for (const [, s] of serverCache) if (s.ready) arr.push(...s.tools);
  return arr;
}

export function getMCPServerConfig(serverId: string): MCPServerSummary | undefined {
  return serverCache.get(serverId)?.config;
}

export async function closeAllMCPServers(): Promise<void> {
  for (const [, s] of serverCache) if (s.process) s.process.kill();
  serverCache.clear();
}

export async function closeMCPServer(serverId: string): Promise<void> {
  const s = serverCache.get(serverId); if (s?.process) s.process.kill();
  serverCache.delete(serverId);
}
