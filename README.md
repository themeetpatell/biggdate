# BiggDate

BiggDate is an AI-assisted dating product for intentional relationships. It supports onboarding, profiles, discovery, intros, messaging, coaching, Pulse community flows, verification, moderation, premium billing, and admin operations.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev`: local app
- `npm run build`: production build
- `npm run start`: run production build
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript
- `npm run check`: lint, typecheck, repo checks, docs checks
- `npm run ci`: full CI check plus build
- `npm run seed`: seed profile data
- `npm run seed:reset`: reset and seed profile data
- `npm run test:e2e`: Playwright end-to-end suite
- `npm run sitemap:submit`: ping IndexNow / search engines with the current sitemap

## Architecture

- `src/app`: Next App Router pages and route handlers
- `src/components`: reusable UI and product components
- `src/lib`: data access, providers, billing, auth, moderation, logging, AI
- `src/proxy.ts`: request proxy/auth boundary (Next 16 replacement for `middleware.ts`)
- `supabase/migrations`: database schema (36 migrations)
- `apps/`, `packages/`: npm workspaces — `@biggdate/shared` ships server/client primitives consumed by the main app and (eventually) the native client
- `scripts`: repo, docs, seed, and sitemap operations
- `docs`: user, developer, product, brand, and standards docs

## Billing Modes

BiggDate ships with two billing modes, controlled by `BILLING_MODE` / `NEXT_PUBLIC_BILLING_MODE`:

- `early_access` (current default): Premium is unlocked by redeeming a founder-issued coupon code at `/settings/billing`. Stripe paths remain in the tree but are dormant. See [docs/launch-readiness.md](docs/launch-readiness.md#billing-model--early-access-active).
- `stripe`: production subscription mode using Stripe Checkout, Customer Portal, and webhooks.

## Production Setup

1. Configure all required env vars from `.env.example`.
2. Apply every file in `supabase/migrations/` to Supabase, in chronological order.
3. (Stripe mode only) Configure Stripe products, prices, the Customer Portal, and the webhook endpoint `/api/billing/webhook`.
4. Configure Resend, Upstash Redis, the AI provider key for `AI_PROVIDER`, Sentry, Sightengine, PostHog, and VAPID push keys.
5. Deploy on Vercel (Fluid Compute) and verify `/api/health`.

## Documentation

- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/dev-guide.md)
- [Launch Readiness](docs/launch-readiness.md)
- [Contribution Guide](CONTRIBUTING.md)
- [Documentation Index](docs/README.md)
