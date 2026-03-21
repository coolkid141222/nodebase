import type { ToolRegistrySnapshot, ToolProviderSummary } from "../shared";
import { internalToolCatalog } from "./adapters/internal";
import { getConfiguredMcpServers, getMcpProviderSummary } from "./adapters/mcp";
import { openClawProviderSummary } from "./adapters/openclaw";
import { feishuProviderSummary } from "./adapters/feishu";

const internalProviderSummary: ToolProviderSummary = {
  id: "INTERNAL",
  label: "Internal Workflow Tools",
  description:
    "Built-in tools implemented by the current workflow runtime and execution engine.",
  lifecycle: "READY",
  transport: ["NONE"],
};

export function getToolRegistrySnapshot(): ToolRegistrySnapshot {
  const mcpServers = getConfiguredMcpServers();

  return {
    providers: [
      internalProviderSummary,
      getMcpProviderSummary(),
      openClawProviderSummary,
      feishuProviderSummary,
    ],
    tools: internalToolCatalog,
    mcpServers,
  };
}
