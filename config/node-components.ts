import { NodeTypes } from "@xyflow/react"
import { InitialNode } from "@/components/react-flow/initial-node"
import { HttpRequestNode } from "@/features/executions/components/http-request/node"
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger-node"
import { WebhookTriggerNode } from "@/features/triggers/components/webhook-trigger-node"
import { AITextNode } from "@/features/ai/components/text/node"
import { DiscordMessageNode } from "@/features/integrations/components/discord-message/node"
import { SlackMessageNode } from "@/features/integrations/components/slack-message/node"
import { LoopNode } from "@/features/loops/components/node"

export const nodeComponents = {
    "INITIAL": InitialNode,
    "HTTP_REQUEST": HttpRequestNode,
    "MANUAL_TRIGGER": ManualTriggerNode,
    "WEBHOOK_TRIGGER": WebhookTriggerNode,
    "AI_TEXT": AITextNode,
    "LOOP": LoopNode,
    "DISCORD_MESSAGE": DiscordMessageNode,
    "SLACK_MESSAGE": SlackMessageNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents
