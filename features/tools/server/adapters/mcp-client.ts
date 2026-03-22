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
  const existing = serverCache.get(config.id);
  if (existing?.process) { existing.process.kill(); serverCache.delete(config.id); }

  const baseEnv: Record<string, string> = {};
  if (process.env) for (const [k, v] of Object.entries(process.env)) if (v) baseEnv[k] = v;
  if (config.env) for (const [k, v] of Object.entries(config.env)) baseEnv[k] = v;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childProcess: any = spawn(config.command as string, config.args || [], {
    stdio: ["pipe", "pipe", "pipe"],
    // @ts-expect-error - spawn env typing is complex
    env: baseEnv,
    cwd: config.workingDirectory || process.cwd(),
    shell: true,
  });

  await new Promise<void>((resolve, reject) => {
    const tm = setTimeout(() => reject(new Error("startup timeout")), 30000);
    childProcess.on("error", (e: Error) => { clearTimeout(tm); reject(e); });
    childProcess.on("spawn", () => { clearTimeout(tm); resolve(); });
  });

  try {
    await sendMCPRequest(childProcess, "initialize", {
      protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "nodebase", version: "1.0.0" },
    });
    await sendMCPRequest(childProcess, "initialized", {});

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

    serverCache.set(config.id, { config, process: childProcess, tools, ready: true });
    childProcess.on("exit", () => { const s = serverCache.get(config.id); if (s) { s.ready = false; s.process = null; } });
    childProcess.on("error", (e: Error) => { console.error(`MCP ${config.id} error:`, e); const s = serverCache.get(config.id); if (s) s.ready = false; });

    return { tools };
  } catch (e) { childProcess.kill(); throw e; }
}

export async function callMCPTool(serverId: string, toolName: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text?: string }> }> {
  let cached = serverCache.get(serverId);

  // Initialize server if not ready
  if (!cached?.ready || !cached?.process) {
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
    const { tools } = await getOrCreateMCPServer(serverConfig);
    cached = serverCache.get(serverId);
  }

  if (!cached?.process || !cached.ready) throw new Error(`Server ${serverId} unavailable`);

  const name = toolName.includes(".") ? toolName.split(".").pop()! : toolName;
  try {
    const result = (await sendMCPRequest(cached.process, "tools/call", { name, arguments: args })) as { content?: Array<{ type: string; text?: string }> };
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
