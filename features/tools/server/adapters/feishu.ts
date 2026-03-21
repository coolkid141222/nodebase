import type { ToolProviderSummary } from "../../shared";

export const feishuProviderSummary: ToolProviderSummary = {
  id: "FEISHU",
  label: "Feishu Tools",
  description:
    "Expose Feishu Open Platform capabilities through the same registry-adapter pattern as OpenClaw, instead of hard-wiring each action into workflow nodes.",
  lifecycle: "ADAPTER_REQUIRED",
  transport: ["HTTP"],
};
