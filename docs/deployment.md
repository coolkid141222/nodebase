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
- `BETTER_AUTH_URL`

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
- `NEXT_PUBLIC_PADDLE_ENV`
- `PADDLE_API_KEY`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_PRO_PRICE_ID`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_WEBHOOK_TOLERANCE_SECONDS`
- `SENTRY_AUTH_TOKEN`

Use [`.env.example`](../.env.example) as the starting template.

## Neon

Use two connection strings:

- `DATABASE_URL`: pooled runtime connection string
- `DIRECT_URL`: direct connection string for Prisma CLI

This repo already points Prisma CLI at `DIRECT_URL` through [`prisma.config.ts`](../prisma.config.ts).

## Vercel

1. Import the repo into Vercel.
2. Add the environment variables from this guide.
3. If you use Preview deployments, give Preview its own database instead of reusing Production.
4. Deploy once.

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

## References

- Next.js environment variables: https://nextjs.org/docs/app/guides/environment-variables
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Better Auth dynamic base URL: https://better-auth.com/docs/concepts/dynamic-base-url
- Inngest on Vercel: https://www.inngest.com/docs/deploy/vercel
- Inngest app version and production keys: https://www.inngest.com/docs/setup/connect
- Inngest signing keys: https://www.inngest.com/docs/platform/signing-keys
- Prisma on Vercel: https://www.prisma.io/docs/v6/orm/prisma-client/deployment/serverless/deploy-to-vercel
- Prisma + Neon: https://www.prisma.io/docs/guides/database/neon
