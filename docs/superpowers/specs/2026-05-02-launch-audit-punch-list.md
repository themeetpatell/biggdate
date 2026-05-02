# BiggDate Launch Audit — Punch List

Date: 2026-05-02. Mode: B (soft launch this week) + audit-then-fix.

Prerequisite checks done:
- `npm run typecheck` ✅
- `npm run build` ✅
- `npm run repo:check` + `docs:check` ✅
- `npm run lint` ❌ 6 errors, 6 warnings (does not block build, but should fix)

## Severity legend

- **P0** — must fix before any user touches production.
- **P1** — should fix before public launch (this week).
- **P2** — post-launch hardening / nice-to-have.

---

## P0 — Launch blockers

### P0-1. Critical RLS gap on 8 tables (data exposure via anon key)

`supabase/migrations/202604140001_launch_ready.sql` creates these tables with **no RLS**:

- `seen_matches`, `blocked_users`, `soul_knock_responses`, `threads`, `messages`, `usage_counters`, `reports`, plus extends `intros` and `matches` without checking their RLS state.

The browser uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (visible in any page bundle). Any user can hit the Supabase REST API directly and read every row in those tables — including all messages, who blocked whom, who reported whom, and intimate Soul Knock responses.

**Fix:** New migration `202605020001_rls_hardening.sql` that:
1. Adds missing FKs (user_id → auth.users with `ON DELETE CASCADE`) on the 8 tables.
2. Enables RLS on all 8 + verifies on `intros`/`matches`.
3. Adds policies: users can read/write only their own rows. `messages`/`soul_knock_responses` policies check via thread membership.
4. `REVOKE ALL ... FROM anon` on tables that should never be accessed by unauthenticated clients (everything except, say, `pulse_prompts`).

Server routes use `pg` Pool with `SUPABASE_DB_URL` and bypass RLS — so adding RLS won't break the app, only close the browser hole.

### P0-2. Lint errors that violate React 19 strict purity

These will become hard build errors when Next/React tightens enforcement, and a couple cause real bugs today:

- `src/app/dashboard/page.tsx:115` — `Math.random()` in render. Re-renders show different "harmony score". Use a stable derived value or memoize from match.id.
- `src/app/pulse/page.tsx:28` — `Date.now()` in `TimeAgo` render. Same problem. Wrap in `useEffect` + state, or compute on mount.
- `src/app/matches/page.tsx:271` — `setState` (via fetch) inside effect causes cascading renders. Move to a stable callback or use the React Query/SWR pattern.
- `src/components/theme-toggle.tsx:28` — `useEffect(() => setMounted(true), [])` is the canonical hydration pattern. Suppress with eslint-disable comment + reason, or migrate to `next-themes` `ThemeProvider`'s built-in mounted handling.
- `src/app/matches/[id]/preview/page.tsx:412,356` — Unescaped apostrophes (`'` → `&apos;`). Trivial.

### P0-3. Stripe webhook idempotency wired but key validation missing

`src/app/api/billing/webhook/route.ts` uses `process.env.STRIPE_SECRET_KEY!` (non-null assert). If that env var is missing in prod, the route throws with a cryptic error and Stripe retries pile up.

**Fix:** Add explicit guard at top of route: return 503 with a clear log if either env var is missing. Same pattern for `/api/billing/checkout`, `/api/billing/portal`.

### P0-4. AI provider silently falls back to localhost Ollama

`src/lib/ai.ts` — if `GEMINI_API_KEY` is missing in prod and `AI_PROVIDER=gemini`, requests fall through to `http://localhost:11434` and fail. Every Maahi/companion/match-generate call breaks.

**Fix:** Throw at module load if the selected provider's required key is missing in production.

### P0-5. Missing `public/og-image.png`

Referenced in `src/app/layout.tsx` metadata but file does not exist. Every social share / link preview shows a 404. Drop in a 1200×630 PNG. **Cannot generate** — this needs design input. Flag to user.

### P0-6. Blank-screen UX bugs on critical flows

Pages that render `null` while `!profile` (no skeleton, no loading state):
- `src/app/dashboard/page.tsx:269`
- `src/app/matches/page.tsx:269`
- `src/app/messages/page.tsx:35`
- `src/app/messages/[threadId]/page.tsx:96`
- `src/app/companion/page.tsx:115`
- `src/app/profile/verify/page.tsx:65`

For new users with slow connections this looks like the app is broken. Replace with a simple loading skeleton (the Round 3 work added skeletons for `/profile`, `/companion`, `/messages` per runbook — verify those, fix any that still return `null`).

### P0-7. Migration filename collision

Two migrations both named `202604120001_*` (`account_handles.sql` and `profile_expansion.sql`). Supabase migration runner orders by filename; a tie can be non-deterministic across runs.

**Fix:** Rename `202604120001_profile_expansion.sql` → `202604120002_profile_expansion.sql`. Verify it hasn't already been applied to prod (likely safe since prod isn't live).

---

## P1 — Soft-launch quality

### P1-1. Auth `me` route loads on every page; no error UI

`src/app/auth/page.tsx:290–295` shows "refresh and try once more" with no retry button. On a 500 the user is stuck. Add a retry button.

### P1-2. Mobile back-button hazards

`history.back()` and `router.back()` fail on direct nav (no history). Affects:
- `src/app/matches/[id]/preview/page.tsx:67`
- `src/app/profile/verify/page.tsx:74`
- `src/app/messages/[threadId]/page.tsx`

Use `router.back()` with a fallback to a known route.

### P1-3. Input validation gaps on POST routes

The audit flagged ~12 POST/PATCH routes that accept body fields without validation. Highest risk:
- `src/app/api/profile/route.ts` PATCH — accepts arbitrary fields, only normalizes known ones. Add allowlist.
- `src/app/api/profile/upload-photo/route.ts` — uses `file.name` extension. Switch to MIME type only.
- `src/app/api/safety/report/route.ts` — `extraNotes` not length-limited.
- `src/app/api/companion/chat/route.ts`, `src/app/api/chat/route.ts` — `context`/`sessionId` accepted as-is.

Approach: add Zod schemas in a shared `src/lib/validation.ts`, parse body at top of each route. Don't try to do all 12 at once — do the highest-risk 5 (profile patch, upload-photo, safety, companion-chat, chat).

### P1-4. Rate limit missing on abusable mutations

Auth endpoints have rate limiting (per runbook). Missing on:
- `src/app/api/intros/request/route.ts` (Soul Knock spam)
- `src/app/api/messages/[threadId]/route.ts` POST (message spam)
- `src/app/api/pulse/posts/route.ts` (feed spam)
- `src/app/api/safety/report/route.ts` (report flooding)

Use existing `checkRateLimit()` helper with sensible per-user limits.

### P1-5. CSP `unsafe-eval`

`next.config.ts:11` allows `'unsafe-eval'`. May or may not be needed (the AI SDK can require it for some adapters). Verify by removing it locally and running the app — if Maahi/chat works, drop it.

### P1-6. Env-var startup validation

Sentry, Sightengine, Upstash all silently fall back. Add a single `src/lib/env.ts` module that runs at boot (via `instrumentation.ts`) and `log.warn`s for any production-required var that's missing. Don't throw — soft-fail with visible logs.

### P1-7. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` not in `.env.example`

Confirmed missing. Even if you only use redirect-mode checkout (no Elements), it's worth adding for portability.

### P1-8. Hardcoded `console.error` calls

`src/app/api/profile/upload-photo/route.ts:65,105` and a few others. Replace with `log.error()` so they reach Sentry.

---

## P2 — Post-launch

- Unused lint warnings (uploadData, replyCount, trackOnboardingComplete) — cleanup pass.
- `<img>` → `next/image` migration in `src/components/photo-upload.tsx`.
- Composite indexes on `(user_id, created_at)` for pulse_posts/replies/messages-by-sender.
- Apple touch icon + properly-sized PWA icons.
- Sentry alerting + sampling review.
- Funnel analytics events (already on the runbook backlog).

---

## Out of scope (config / external)

These are owner action items, not code I can fix:
- Real legal text for `/privacy` and `/terms` (lawyer / Termly).
- Stripe live keys + webhook secret in Vercel.
- Sentry org + DSN.
- Sightengine credentials.
- `ADMIN_USER_IDS` set to your auth UUID.
- Upstash Redis URL + token.
- Run the new RLS migration + `202605010001_launch_hardening.sql` in Supabase SQL editor.
- Submit sitemap + verify schemas in Google Search Console.

---

## Proposed execution order

1. P0-7 migration rename (1 min, prevents footgun).
2. P0-1 RLS migration (45 min, biggest security win).
3. P0-2 Lint errors (20 min, also fixes real bugs).
4. P0-6 Blank-screen fixes (30 min).
5. P0-3, P0-4 env var guards (15 min).
6. P1-3 input validation top-5 (45 min).
7. P1-4 rate limits (20 min).
8. P1-1, P1-2 small UX fixes (15 min).
9. P1-5, P1-6, P1-7, P1-8 (30 min).

Total P0+P1: ~3.5 hours. Stop after P0 if you want to review before proceeding.

P0-5 (OG image) flagged for owner — I'll generate a placeholder if you want.

## Notes on uncertainty

- The sub-agent that audited API security incorrectly reported a CRITICAL IDOR in `messages/[threadId]/route.ts`. I verified the route does check thread ownership before returning messages. If other findings turn out to be wrong, I'll note as I work through them.
- I have not run the app in a browser to confirm the blank-screen list — found by reading JSX. A real-device pass after these fixes is recommended.
