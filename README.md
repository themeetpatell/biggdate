# BiggDate

BiggDate is a Next.js 16 application with App Router, Supabase, Stripe, and AI-assisted product features.

## Repository Architecture

The repository is organized by responsibility:

- `src/app`: routes, pages, and route handlers.
- `src/components`: reusable UI and feature components.
- `src/lib`: shared business and infrastructure utilities.
- `scripts`: operational and maintenance scripts.
- `supabase/migrations`: canonical schema evolution.
- `docs`: standards, guides, and operational documentation.

For standards and governance:

- [Documentation Index](docs/README.md)
- [Product Documentation](docs/product/README.md)
- [Repository Standards](docs/standards/repository-standards.md)
- [Contribution Guide](CONTRIBUTING.md)

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Copy environment template.

```bash
cp .env.example .env.local
```

3. Configure AI provider in `.env.local`.

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

4. Configure Supabase in `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_DB_URL=postgresql://postgres.<project_ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

`DATABASE_URL` is also supported as fallback.

5. Apply migrations from `supabase/migrations` to your Supabase project.

6. Start development server.

```bash
npm run dev
```

## Quality Gates

Run these before pushing changes:

```bash
npm run lint
npm run typecheck
npm run repo:check
```

Or run all at once:

```bash
npm run check
```

## Notes

- The app uses the `pg` driver for direct Supabase Postgres access.
- Build and generated artifacts should not be committed.
- Structural changes should update docs in the same PR.
