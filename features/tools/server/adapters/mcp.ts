import type { ToolProviderSummary } from "../../shared";

export const mcpProviderSummary: ToolProviderSummary = {
  id: "MCP",
  label: "MCP Servers",
  description:
    "Discover external tools over the Model Context Protocol through stdio, HTTP, or SSE transports.",
  lifecycle: "ADAPTER_REQUIRED",
  transport: ["STDIO", "HTTP", "SSE"],
};
