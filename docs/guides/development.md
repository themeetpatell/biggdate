# Development Workflow

For full setup, architecture, API, env, and deployment guidance, see [Developer Guide](../dev-guide.md).

## Daily Workflow

1. Pull latest changes.
2. Install dependencies when lockfile changes: `npm install`.
3. Run local app: `npm run dev`.
4. Before PR: `npm run ci`.

## Structural Rules

- Add route UI and API handlers under `src/app`.
- Put shared UI in `src/components`.
- Put shared logic, repositories, providers, and guards in `src/lib`.
- Add database changes under `supabase/migrations`.
- Keep `.env.example`, README, and docs updated with behavior changes.
