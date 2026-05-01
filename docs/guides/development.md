# Development Guide

## Setup

1. Install dependencies.
2. Copy env template to `.env.local`.
3. Configure provider and database values.
4. Run `npm run dev`.

## Daily Workflow

1. `npm run lint`
2. `npm run typecheck`
3. `npm run repo:check`
4. `npm run docs:check`
5. Implement feature.
6. Re-run checks before opening PR.

## Project Scripts

- `npm run dev`: start local server.
- `npm run lint`: static analysis.
- `npm run typecheck`: TypeScript checks.
- `npm run repo:check`: repository structure and hygiene checks.
- `npm run docs:check`: validate required docs and internal links.
- `npm run check`: combined verification run.

## Structural Guidelines

- Add new route features under `src/app/` with colocated files.
- Put cross-route shared logic in `src/lib/`.
- Put shared UI in `src/components/`.
- Keep scripts in `scripts/` and make them idempotent when possible.
