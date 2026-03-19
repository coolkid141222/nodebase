# Nodebase

Nodebase is a Next.js workflow builder with React Flow, Prisma, Better Auth, Inngest, AI nodes, webhook/manual triggers, execution history, credentials, and a local-first billing layer.

## Stack

- Next.js 16 App Router
- Prisma ORM + PostgreSQL/Neon
- Better Auth
- Inngest
- tRPC + React Query
- React Flow
- Sentry

## Local development

1. Copy [`.env.example`](./.env.example) into `.env`.
2. Fill in at least `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`.
3. Install dependencies and generate Prisma Client:

```bash
npm install
```

4. Apply migrations:

```bash
npm run db:deploy
```

5. Start the app and the local Inngest dev server:

```bash
npm run dev:all
```

## Pre-deploy checks

```bash
npm run deploy:check
```

## Deploy

The recommended path for this repo is Vercel + Neon + Inngest Cloud.

- Deployment guide: [`docs/deployment.md`](./docs/deployment.md)
- Environment variable template: [`.env.example`](./.env.example)

## Notes

- `DATABASE_URL` should be the pooled runtime connection string.
- `DIRECT_URL` should be the direct connection string for Prisma CLI and migrations.
- Billing works in local mode without Paddle. Paddle is optional and only needed when you want a real checkout.
