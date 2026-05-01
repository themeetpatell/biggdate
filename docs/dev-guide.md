# Developer Guide

## Project Overview

BiggDate is a Next.js App Router product backed by Supabase Postgres. It includes profile onboarding, matching, intros, messaging, AI coaching, Pulse community features, safety tooling, verification, billing, admin workflows, and observability.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- Supabase Auth and Postgres
- Direct Postgres access through `pg`
- Stripe billing
- AI SDK with Gemini, OpenAI, Ollama, and Ollama Cloud support
- Resend email
- Upstash Redis rate limiting
- Sentry and Vercel Analytics

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create local env.

```bash
cp .env.example .env.local
```

3. Fill required Supabase and AI provider values.

4. Apply migrations in `supabase/migrations` to the Supabase project.

5. Start local app.

```bash
npm run dev
```

6. Open http://localhost:3000.

## Production Setup

1. Create Supabase project and apply migrations.
2. Configure Supabase Auth URLs and email templates.
3. Create Stripe products/prices and set all `NEXT_PUBLIC_STRIPE_PRICE_*` values.
4. Configure Stripe webhook endpoint: `/api/billing/webhook`.
5. Configure Resend, Upstash Redis, Sentry, and moderation provider keys.
6. Deploy to Vercel.
7. Verify `/api/health`, auth, checkout, webhook delivery, and email flows.

## Folder Structure

- `src/app`: routes, pages, layouts, and route handlers.
- `src/components`: shared UI and product components.
- `src/lib`: repositories, providers, auth, billing, AI, moderation, logging, and utilities.
- `src/proxy.ts`: request proxy/auth boundary.
- `supabase/migrations`: schema migrations.
- `scripts`: repo checks, docs checks, and data scripts.
- `docs`: user, developer, product, brand, and standards documentation.

## Scripts

- `npm run dev`: start local server.
- `npm run build`: build production app.
- `npm run start`: run production build.
- `npm run lint`: run ESLint.
- `npm run typecheck`: run TypeScript checks.
- `npm run repo:check`: validate repo structure.
- `npm run docs:check`: validate required docs and local links.
- `npm run check`: run static checks.
- `npm run ci`: run static checks and production build.
- `npm run seed`: seed profile data.
- `npm run seed:reset`: reset and seed profile data.

## Environment Variables

Use `.env.example` as the contract. Required production groups:

- Application: `NEXT_PUBLIC_APP_URL`
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`
- AI: provider-specific key for `AI_PROVIDER`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs
- Email: `RESEND_API_KEY`, `RESEND_FROM`
- Redis: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Moderation: `SIGHTENGINE_USER`, `SIGHTENGINE_SECRET`
- Observability: Sentry DSNs and sample rates

## API Structure

Route handlers live under `src/app/api`. Product API coverage is documented in [API Reference](./product/api-reference.md).

Core domains:

- `auth`: signup, login, session, password reset, account deletion.
- `profile`: profile reads/writes, derive, photo upload, moderation.
- `matches` and `intros`: matching, intro requests, responses.
- `messages`: threads and message posting.
- `companion`, `coach`, `life-preview`, `dates`: AI-assisted flows.
- `pulse`: prompts, posts, replies, reactions, flags.
- `safety` and `verification`: reports, blocks, trust signals.
- `billing`: checkout, customer portal, status, Stripe webhook.
- `admin`: admin-only management and moderation workflows.

## Adding Features

1. Put routes and route handlers under `src/app`.
2. Put shared business logic in `src/lib`.
3. Put reusable UI in `src/components`.
4. Add or update migrations for schema changes.
5. Add env keys to `.env.example`.
6. Update `docs/user-guide.md` or API docs when behavior changes.
7. Run `npm run ci`.

## Coding Standards

- Keep TypeScript strict and explicit at module boundaries.
- Prefer existing repository helpers over new one-off clients.
- Keep route handlers thin; put business logic in `src/lib`.
- Validate auth, plan gates, and input before writes.
- Keep database writes idempotent where retries are possible.
- Do not commit generated build artifacts or secrets.
- Update docs with workflow or behavior changes.

## Deployment

1. Push to the default branch.
2. CI must pass.
3. Vercel builds with `npm run build`.
4. Configure production env vars in Vercel.
5. Validate auth, billing, webhook, email, AI, and moderation in production.
