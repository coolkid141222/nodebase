# Feishu Integration Path

## Goal

Feishu should plug into Nodebase through the same adapter layer as OpenClaw, not as a special-case branch in the execution engine.

That means:

- `ToolRegistry` knows Feishu is a provider.
- future Feishu tools are discovered or registered under `provider = FEISHU`
- workflow nodes continue to call tools through the same `TOOL` execution path

## Why this shape

This repo already has three tool-source concepts:

- `INTERNAL`
- `MCP`
- `OPENCLAW`

Feishu fits better as a fourth tool source than as a one-off action hard-coded into every AI node.

Benefits:

- shared tool selection UI
- shared memory write behavior
- shared approval/dangerous-action policy later
- AI and Agent nodes can allowlist Feishu tools without bespoke wiring

## Recommended phases

### Phase 1: provider scaffold

Done in code:

- `FEISHU` exists as a tool provider scaffold
- registry exposes a Feishu provider summary
- Tool dialog can show a Feishu adapter slot

### Phase 1.5: first executable tool

Done in code:

- `feishu.message.send` is registered through `provider = FEISHU`
- the tool executes through the shared `TOOL` runtime path
- it currently uses `FEISHU_BOT_WEBHOOK` from the server environment

This keeps the OpenClaw-like shape:

- provider registered in the registry
- adapter owns the Feishu-specific request
- workflow graph stays provider-agnostic

### Phase 1.6: inbound trigger bridge

Done in code:

- existing `Webhook Trigger` nodes now expose a Feishu callback URL
- Feishu can trigger an existing workflow through `/api/feishu/:workflowId?token=...`
- current support is intentionally narrow:
  - `url_verification`
  - `im.message.receive_v1`
  - plain text extraction from message content

Current product shape:

- Feishu is an inbound task surface
- Nodebase workflows remain the execution engine
- the callback creates a normal workflow execution with `trigger.source = "feishu"`

Recommended event subscription setup:

- callback URL: `https://your-domain/api/feishu/<workflowId>?token=<workflowSecret>`
- disable Encrypt Key for the first version
- optionally set `FEISHU_EVENT_VERIFICATION_TOKEN` and use the same token in Feishu
- subscribe to:
  - URL verification
  - `im.message.receive_v1`

### Phase 1.7: long-connection command bridge

Done in code:

- `npm run feishu:bridge` starts a persistent Feishu SDK worker
- the worker uses `FEISHU_APP_ID + FEISHU_APP_SECRET`
- it receives `im.message.receive_v1` through Feishu long connection
- it routes simple commands to existing workflows instead of creating a new node type

Current command surface:

- `/help`
- `/list`
- `/run <workflow id or exact name> :: <message>`

Optional env for safer routing:

- `FEISHU_BRIDGE_OWNER_EMAIL`
  - restrict workflow lookup to one owner account
- `FEISHU_BRIDGE_DEFAULT_WORKFLOW`
  - lets plain text or `/run <message>` target one default workflow
- `FEISHU_BRIDGE_ALLOWED_CHAT_IDS`
  - comma-separated chat ids that are allowed to trigger Nodebase

Current product shape:

- Feishu long connection is the inbound command surface
- existing workflows remain the execution engine
- `feishu.message.send` remains the outbound delivery tool

This keeps the OpenClaw-like split:

- persistent bridge process for inbound control
- provider/tool adapter for outbound platform actions

### Phase 2: auth and credentials

Add one or both credential styles:

- `appId + appSecret`
- bot/webhook-based credentials for lightweight message sending

Suggested credential payloads:

```json
{
  "appId": "cli_xxx",
  "appSecret": "xxx"
}
```

or

```json
{
  "webhookUrl": "https://open.feishu.cn/open-apis/bot/v2/hook/..."
}
```

### Phase 3: first Feishu tools

Recommended next tool set:

- `feishu.docs.create`
- `feishu.docs.append_blocks`
- `feishu.sheet.append_rows`

These are enough for:

- notification workflows
- AI research output delivery
- structured reporting

### Phase 4: AI and Agent usage

Two usage paths make sense:

1. `TOOL` node
   Use Feishu as an explicit downstream action in the graph.

2. `Agent` or tool-enabled AI node
   Allow Feishu tools as part of a tool allowlist, alongside internal tools and MCP tools.

## Execution model

The execution engine should not know Feishu-specific business rules. It should only:

- validate the tool configuration
- resolve the credential
- hand off to a `FEISHU` adapter
- persist output and memory writes

The Feishu adapter should own:

- token exchange
- tenant access token caching
- API request signing and retries
- Feishu-specific response normalization

## OpenClaw alignment

OpenClaw should remain a tool source.

Feishu should be implemented the same way structurally:

- provider registered in the registry
- adapter mediates runtime calls
- workflow graph stays provider-agnostic

That keeps the long-term shape:

- `INTERNAL`: built-in runtime tools
- `MCP`: external protocol tools
- `OPENCLAW`: OpenClaw-compatible plugin tools
- `FEISHU`: Feishu platform tools

## Production note

If you later want Feishu through a remote tool server instead of a native adapter, MCP is still a good bridge:

- wrap Feishu APIs behind a remote MCP server
- register that server through `MCP_SERVERS_JSON`
- consume Feishu via `provider = MCP`

That is the lowest-friction way to ship Feishu quickly if you already have MCP infrastructure.
