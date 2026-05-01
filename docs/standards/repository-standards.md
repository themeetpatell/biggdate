# Repository Standards

## Folder Layout

Top-level folders have one job each:

- `src/`: application code.
- `public/`: static assets.
- `supabase/migrations/`: schema changes.
- `scripts/`: operational and maintenance scripts.
- `docs/`: human documentation.

### Source Layout

Inside `src/`:

- `src/app/`: routes, pages, route handlers.
- `src/components/`: reusable UI and feature components.
- `src/lib/`: shared server/client utilities.

## File Placement Rules

- Keep Next.js special files in exactly one valid location.
- Do not duplicate root-level and `src/` instrumentation files.
- Keep route handlers in `src/app/**/route.ts`.
- Keep route-local loading/error/not-found files with their route segment.

## Naming Rules

- Use kebab-case for directories and non-component files.
- Use PascalCase only for React component filenames when necessary.
- Keep script names action-oriented, e.g. `check-repo-structure.mjs`.

## Hygiene Rules

- No tracked OS artifacts (for example `.DS_Store`).
- No committed build artifacts (`.next/`, `dist/`, `out/`).
- Keep generated files ignored unless explicitly required.

## Required Checks Before Merge

- `npm run lint`
- `npm run typecheck`
- `npm run repo:check`
- `npm run docs:check`

## Documentation Standards

- `docs/README.md` is the entrypoint for all in-repo documentation.
- Keep documentation operational and current; remove stale strategy artifacts.
- Internal markdown links must resolve to existing files.

## Change Management

- Structural changes must update docs in `docs/` in the same PR.
- Avoid moving directories and changing behavior in the same PR.
- Keep migration scripts additive and reviewable.
