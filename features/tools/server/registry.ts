import type { ToolRegistrySnapshot, ToolProviderSummary } from "../shared";
import { internalToolCatalog } from "./adapters/internal";
import { mcpProviderSummary } from "./adapters/mcp";
import { openClawProviderSummary } from "./adapters/openclaw";

const internalProviderSummary: ToolProviderSummary = {
  id: "INTERNAL",
  label: "Internal Workflow Tools",
  description:
    "Built-in tools implemented by the current workflow runtime and execution engine.",
  lifecycle: "READY",
  transport: ["NONE"],
};

export function getToolRegistrySnapshot(): ToolRegistrySnapshot {
  return {
    providers: [
      internalProviderSummary,
      mcpProviderSummary,
      openClawProviderSummary,
    ],
    tools: internalToolCatalog,
  };
}
