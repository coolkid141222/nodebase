import type { ToolProviderSummary } from "../../shared";

export const openClawProviderSummary: ToolProviderSummary = {
  id: "OPENCLAW",
  label: "OpenClaw Plugins",
  description:
    "Reuse OpenClaw-compatible tools through a registry adapter instead of binding the runtime directly to workflow nodes.",
  lifecycle: "ADAPTER_REQUIRED",
  transport: ["NONE"],
};
