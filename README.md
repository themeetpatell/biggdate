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

## Architecture

- `src/app`: Next App Router pages and route handlers
- `src/components`: reusable UI and product components
- `src/lib`: data access, providers, billing, auth, moderation, logging
- `src/proxy.ts`: request proxy/auth boundary
- `supabase/migrations`: database schema
- `scripts`: repo and data operations
- `docs`: user, developer, product, and standards docs

## Production Setup

1. Configure all required env vars from `.env.example`.
2. Apply `supabase/migrations` to Supabase.
3. Configure Stripe products, prices, and webhook endpoint `/api/billing/webhook`.
4. Configure Resend, Upstash Redis, AI provider keys, Sentry, and moderation provider.
5. Deploy on Vercel and verify `/api/health`.

## Documentation

- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/dev-guide.md)
- [Launch Readiness](docs/launch-readiness.md)
- [Contribution Guide](CONTRIBUTING.md)
- [Documentation Index](docs/README.md)
