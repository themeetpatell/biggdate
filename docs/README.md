# Documentation Index

This directory is the single source of truth for how the repository is organized and operated.

## Start Here

- [Repository Standards](./standards/repository-standards.md)
- [Contribution Guide](../CONTRIBUTING.md)
- [Development Guide](./guides/development.md)
- [Product Documentation](./product/README.md)
- [Brand Documentation](./brand/README.md)

## Active Sets

- `guides/`: day-to-day engineering workflow.
- `standards/`: repository rules and structural conventions.
- `product/`: full product specification, journeys, API, and operations.
- `brand/`: brand system, voice, and content strategy.
- `email-templates/`: auth email template references.

## Documentation Policy

- Legacy strategy and pitch artifacts have been intentionally removed from this repository.
- Keep only operationally relevant and current docs under `docs/`.
- If a document is no longer active, remove it instead of letting it drift.

## Purpose

- Keep repo conventions explicit.
- Make onboarding predictable.
- Reduce regressions from ad-hoc structure changes.

## Principles

- Keep app code in `src/`.
- Keep framework entrypoints in project root only when required by Next.js conventions.
- Keep docs and standards close to implementation details.
- Prefer small, reversible changes over large unreviewed refactors.
