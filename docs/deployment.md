# Deployment Guide

## Recommended target

For this repo, the least-friction production path is:

- Vercel for the Next.js app
- Neon for PostgreSQL
- Inngest Cloud for background execution

## Required environment variables

### Minimum app

- `DATABASE_URL`
- `DIRECT_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` is still useful for local dev and explicit production fallback.

### Strongly recommended

- `CREDENTIAL_ENCRYPTION_KEY`

### Inngest production

- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `INNGEST_SIGNING_KEY_FALLBACK` (optional, for rotation)
- `INNGEST_SERVE_HOST` (optional, if you want Inngest to sync against your custom production domain instead of the generated Vercel URL)

### Optional providers

- `GOOGLE_GENERATIVE_AI_API_KEY`
- `DEEPSEEK_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `MINIMAX_BASE_URL` (optional override; this repo defaults MiniMax to the CN-compatible endpoint)
- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_BASE_URL`
- `FEISHU_BOT_WEBHOOK`
- `MCP_SERVERS_JSON`
- `NEXT_PUBLIC_PADDLE_ENV`
- `PADDLE_API_KEY`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_PRO_PRICE_ID`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_WEBHOOK_TOLERANCE_SECONDS`
- `SENTRY_AUTH_TOKEN`

Use [`.env.example`](../.env.example) as the starting template.

## Reuse current env safely

Your local `.env` currently contains these active names:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `DEEPSEEK_API_KEY`
- `GOOGLE_USE_PROXY`
- `GOOGLE_PROXY_URL`
- `MINIMAX_BASE_URL`
- `SENTRY_AUTH_TOKEN`

These are the ones that map directly to the deployed app. Do not paste raw values into source control; add them in Vercel's dashboard or with `vercel env`.

Current legacy values in `.env` that are not used by the deployed code path:

- `ZHIPU_API_KEY`
- `ZHIPU_BASE_URL`

If you want a cleaner production setup, omit those legacy values from the Vercel project entirely.

## MCP scaffold

This repo now includes an MCP adapter scaffold. It does not execute MCP tools yet; it lets the app discover which MCP servers you intend to mount next.

Use `MCP_SERVERS_JSON` with a JSON array of server configs.

Example `stdio` server:

```json
[
  {
    "id": "filesystem",
    "displayName": "Filesystem MCP",
    "description": "Read and write files through MCP",
    "transport": "STDIO",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "E:/OneDrive/code/nodebase"]
  }
]
```

Example remote server with a URL secret stored separately:

```json
[
  {
    "id": "browser",
    "displayName": "Remote Browser MCP",
    "description": "Browser automation over remote MCP transport",
    "transport": "SSE",
    "urlEnv": "BROWSER_MCP_URL",
    "headersEnv": ["BROWSER_MCP_TOKEN"]
  }
]
```

For security:

- Keep secrets out of `MCP_SERVERS_JSON`
- Put secret URLs/tokens in separate env vars
- Use `urlEnv` and `headersEnv` to reference those names instead of hardcoding values

## Feishu scaffold

This repo now includes a Feishu provider scaffold in the tool registry. It is not executable yet; it is there so Feishu can be attached through the same adapter pattern as OpenClaw instead of being treated as a one-off branch.

See [Feishu integration notes](./feishu-integration.md).

## Neon

Use two connection strings:

- `DATABASE_URL`: pooled runtime connection string
- `DIRECT_URL`: direct connection string for Prisma CLI

This repo already points Prisma CLI at `DIRECT_URL` through [`prisma.config.ts`](../prisma.config.ts).

## Vercel

1. Import the repo into Vercel.
2. Add the environment variables from this guide.
3. Add `DIRECT_URL` for Production from Neon's direct connection string.
4. If you use Preview deployments, give Preview its own database instead of reusing Production.
5. Deploy once.

Better Auth is configured to accept `localhost:3000`, `127.0.0.1:3000`, the host from `BETTER_AUTH_URL`/`VERCEL_PROJECT_PRODUCTION_URL`, and the current request URL origin so Vercel preview URLs can still pass origin validation without a broad wildcard.

## Database migrations

Before the first production launch, run:

```bash
npm run db:deploy
```

You can also use:

```bash
npm run vercel-build
```

Use that only when your deployment pipeline is allowed to run `prisma migrate deploy` against the target database.

## Inngest

This repo exposes the Inngest serve endpoint at `/api/inngest`.

Production notes:

- The route is pinned to `runtime = "nodejs"`.
- The route exports `maxDuration = 300` for Vercel.
- The Inngest client now sets `appVersion` from Vercel deployment metadata when available.
- On Vercel, use the official Inngest integration or set `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` manually in the project settings.

If Vercel Deployment Protection is enabled, Inngest needs either:

- protection bypass configured in the Inngest Vercel integration, or
- deployment protection disabled for the relevant environment

## Paddle

Paddle is optional. The app can still run in local billing mode without it.

If you enable Paddle:

- configure the client token, API key, price ID, and webhook secret
- point Paddle webhooks at `/api/webhooks/paddle`
- keep local mode available until the webhook round-trip is verified

## Smoke test after deploy

1. Sign in with email/password.
2. Open `/workflows`.
3. Run a manual workflow.
4. Confirm `/executions` shows the run.
5. Confirm Inngest syncs functions successfully.
6. If Paddle is enabled, verify the webhook endpoint returns a signed success response from Paddle.
7. Confirm the webhook trigger dialog copies a URL that includes the `token` query parameter.

## References

- Next.js environment variables: https://nextjs.org/docs/app/guides/environment-variables
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Better Auth dynamic base URL: https://better-auth.com/docs/concepts/dynamic-base-url
- Inngest on Vercel: https://www.inngest.com/docs/deploy/vercel
- Inngest app version and production keys: https://www.inngest.com/docs/setup/connect
- Inngest signing keys: https://www.inngest.com/docs/platform/signing-keys
- Prisma on Vercel: https://www.prisma.io/docs/v6/orm/prisma-client/deployment/serverless/deploy-to-vercel
- Prisma + Neon: https://www.prisma.io/docs/guides/database/neon
