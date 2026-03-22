# Nodebase

A visual workflow automation platform built on Next.js 16 with a React Flow editor, AI-powered workflow generation, and deep integrations with messaging platforms.

## Stack

- **Framework**: Next.js 16 App Router
- **Database**: Prisma ORM + PostgreSQL/Neon
- **Auth**: Better Auth (email/password + Google/GitHub OAuth)
- **Background Jobs**: Inngest (local dev: `inngest-cli dev`; cloud: Inngest Cloud)
- **API**: tRPC + TanStack React Query
- **Editor**: React Flow (xyflow)
- **AI**: Vercel AI SDK with multi-provider support (OpenAI, Anthropic, Google, DeepSeek, MiniMax)
- **Error Tracking**: Sentry
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **Billing**: Paddle (optional) / Mock billing for local dev

## Quick Start

```bash
# 1. Copy env and fill in required values
cp .env.example .env
# Required: DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

# 2. Install deps (postinstall runs prisma generate)
npm install

# 3. Apply migrations
npm run db:deploy

# 4. Start dev server + Inngest dev server
npm run dev:all
```

## Project Structure

```
nodebase/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Login/register pages
│   ├── (dashboard)/             # Authenticated app shell
│   │   ├── (rest)/              # Workflow list, credentials, executions, billing
│   │   └── (editor)/            # React Flow workflow editor
│   └── api/                      # API routes
│       ├── auth/                 # Better Auth handlers
│       ├── trpc/                 # tRPC handler
│       ├── webhooks/            # Workflow webhooks + Paddle webhooks
│       ├── feishu/              # Feishu webhook receiver
│       └── inngest/             # Inngest HTTP handler
├── features/                     # Feature modules
│   ├── ai/                       # AI text nodes + workflow generation
│   ├── auth/                     # Auth UI components
│   ├── billing/                  # Paddle/mock billing
│   ├── credentials/              # Encrypted API key storage
│   ├── editor/                   # React Flow editor
│   ├── executions/              # Execution engine + memory system
│   ├── integrations/             # Discord + Slack messaging
│   ├── loops/                    # Loop control flow
│   ├── tools/                    # Tool registry (MCP, internal, Feishu)
│   ├── triggers/                 # Manual + webhook triggers
│   └── workflows/               # Workflow CRUD
├── lib/                          # Shared libraries
│   ├── auth.ts                   # Better Auth config
│   ├── db.ts                     # Prisma client
│   ├── ai/proxy.ts               # AI provider factories
│   └── prisma/client/            # Generated Prisma client
├── inngest/                      # Inngest functions
├── prisma/
│   └── schema.prisma             # Database schema
├── trpc/                         # tRPC setup
│   ├── init.ts                   # Context, procedures, router factory
│   ├── routers/_app.ts           # Main app router
│   └── server.tsx                # Server-side tRPC helpers
└── components/                   # Shared UI components
```

## Core Concepts

### Workflows

Workflows are directed graphs of **nodes** connected by **edges**. They support:

- **Triggers**: Manual (button), Webhook (HTTP POST)
- **Actions**: HTTP requests, AI text generation
- **Control Flow**: Conditions (future), Loops (up to 25 iterations)
- **Messaging**: Discord, Slack, Feishu
- **Tools**: MCP servers, browser page fetch, custom tools
- **Memory**: Per-run execution memory + cross-run persistent memory

### Execution Flow

1. **Trigger** → Creates an `Execution` record (PENDING)
2. **Inngest** → Receives `workflow/manual.triggered` or `workflow/webhook.triggered` event
3. **Execution Engine** → Topologically sorts nodes, executes each:
   - Resolves `{{template}}` variables from upstream outputs + memory
   - Executes node logic (HTTP call, AI generate, send message, etc.)
   - Writes to execution memory
   - Handles loops by repeating subgraph
4. **Complete** → Execution marked SUCCESS/FAILED with output

### Memory System

Two layers:

- **Execution Memory** (`ExecutionMemoryEntry`) — ephemeral per-run, nodes read/write `memory.shared.*` and `memory.node.*` template namespaces
- **Persistent Memory** (`PersistentMemoryEntry`) — survives across runs, supports semantic embeddings (Google text-embedding-004 or OpenAI text-embedding-3-small) for `recall` operations

### Tool Registry

Tools are provided by four backends:

| Provider | Description |
|----------|-------------|
| `INTERNAL` | Built-in: browser_page, http_request, memory_read, memory_write, discord_webhook, slack_webhook |
| `MCP` | Model Context Protocol servers (configured via `MCP_SERVERS_JSON`) |
| `OPENCLAW` | OpenClaw tool adapter |
| `FEISHU` | Feishu bot message sending (via `FEISHU_BOT_WEBHOOK`) |

### Credentials

API keys and secrets are encrypted at rest using AES-256-GCM. Providers: OpenAI, Anthropic, Google, DeepSeek, MiniMax, Discord, Slack, Stripe, Polar.

### Billing

- **FREE**: Unlimited workflows, manual/webhook execution, AI nodes, local memory
- **PRO**: Paddle-powered subscription (or mock for local dev)

Mock billing works without Paddle configured — creates a 30-day trial period.

## Feature Modules

| Feature | Purpose |
|---------|---------|
| `features/ai` | AI text generation nodes + natural language → workflow graph (AI workflow generator dialog) |
| `features/billing` | Paddle checkout, webhook handling, billing portal UI |
| `features/credentials` | Encrypted credential CRUD, provider-specific secret retrieval |
| `features/editor` | React Flow canvas, node drag-drop, loop scope overlays, Jotai-based editor state |
| `features/executions` | Execution engine (execution-runner.ts), memory read/write/resolution, template parsing, step history |
| `features/integrations` | Discord + Slack message nodes (webhook-based) |
| `features/loops` | Loop node with configurable max iterations (1-25) |
| `features/tools` | Tool registry snapshot, MCP adapter, internal tool catalog, Feishu adapter |
| `features/triggers` | Manual trigger, webhook trigger with secret validation, Feishu webhook + command bridge |
| `features/workflows` | Workflow CRUD, node/connection reconciliation |

## Common Commands

```bash
npm run dev          # Next.js dev server only
npm run dev:all      # Next.js + Inngest dev server (mprocs)
npm run build        # Next.js production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript --noEmit
npm run db:deploy     # Apply Prisma migrations
npm run deploy:check  # lint + typecheck + build
npm run feishu:bridge # Start Feishu long-connection command bridge
npm run inngest:dev  # Inngest dev server only (alternative to mprocs)
```

## Environment Variables

Critical variables (see `.env.example` for full list):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Pooled Neon connection (runtime) |
| `DIRECT_URL` | Direct Neon connection (Prisma CLI) |
| `BETTER_AUTH_SECRET` | Session encryption secret |
| `BETTER_AUTH_URL` | App origin for auth |
| `INNGEST_EVENT_KEY` | Inngest Cloud event key (optional for local dev) |
| `INNGEST_SIGNING_KEY` | Inngest Cloud signing key |
| `FEISHU_APP_ID` / `FEISHU_APP_SECRET` | Feishu integration |
| `FEISHU_BOT_WEBHOOK` | Feishu bot webhook URL for sending messages |
| `CREDENTIAL_ENCRYPTION_KEY` | AES-256-GCM key for credential encryption |
| `ENABLE_PERSISTENT_MEMORY_EMBEDDINGS` | Enable vector embeddings for persistent memory |

## Deployment

Recommended: **Vercel + Neon + Inngest Cloud**

See [`docs/deployment.md`](./docs/deployment.md) for step-by-step guide.

## Docs

- [`docs/deployment.md`](./docs/deployment.md) — Vercel/Neon/Inngest Cloud deployment
- [`docs/feishu-integration.md`](./docs/feishu-integration.md) — Feishu integration roadmap
