# Contributing

## Branching

- Keep branches focused to one concern.
- Use short-lived branches and small PRs.
- Avoid mixing large refactors with product behavior changes.

## Pull Request Checklist

- [ ] Lint passes: `npm run lint`
- [ ] Type check passes: `npm run typecheck`
- [ ] Repo structure check passes: `npm run repo:check`
- [ ] Docs check passes: `npm run docs:check`
- [ ] Updated docs if structure changed
- [ ] Added migration for schema changes

## Code Organization

- Keep feature routes and route handlers under `src/app/`.
- Keep shared UI in `src/components/`.
- Keep business utilities in `src/lib/`.
- Keep standalone tooling in `scripts/`.

## Review Standards

- Prefer explicit, readable code over clever abstractions.
- Keep functions small and side effects obvious.
- Fail safely and log actionable context.

## Documentation

- Update [docs/README.md](docs/README.md) when adding new docs.
- Keep standards in [docs/standards/repository-standards.md](docs/standards/repository-standards.md).
