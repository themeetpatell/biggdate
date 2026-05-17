# API Reference

Version: 2.0.0
Date: 2026-05-18

A product-focused API reference grouped by domain. The repository currently ships **78 route handlers** under `src/app/api`. For implementation specifics, open the matching `route.ts` file under that path.

Authorization conventions:

- Non-public routes go through `requireAuth` ([src/lib/require-auth.ts](../../src/lib/require-auth.ts)) which accepts either a Supabase session cookie or a `Bearer` token (dual-mode auth, commit `aeac1f1`).
- Plan-gated routes call `requirePlan(action)` then `incrementUsage(action)`.
- Admin routes enforce an `ADMIN_USER_IDS` allowlist on top of `requireAuth`.
- Cron and signed internal calls require the `INTERNAL_API_SECRET` header.

## 1. Health & Diagnostics

- `GET /api/health` — DB-checking probe. Returns 200 with `{ status, checks }`, 503 if Postgres or any wired downstream is unreachable.

## 2. Auth

- `POST /api/auth/signup` — email + password signup. Captures DOB and explicit Terms/Privacy consent (migration `202605170004`).
- `POST /api/auth/login` — rate-limited 5/min/IP. Accepts username or email.
- `POST /api/auth/logout`
- `GET /api/auth/me` — session + profile completion state.
- `POST /api/auth/forgot-password` — rate-limited 3/10min/IP.
- `POST /api/auth/reset-password` — server-side password floor of 10 chars on reset.
- `DELETE /api/auth/delete` — permanent self-serve account deletion via `SUPABASE_SERVICE_ROLE_KEY`.
- `GET /api/auth/export` — support-assisted data export endpoint (DPDP / GDPR posture).
- `GET /auth/callback` — OAuth callback for Google / Apple when `NEXT_PUBLIC_OAUTH_PROVIDERS` is set.

## 3. Onboarding

- `POST /api/onboarding/basics` — tap-first onboarding step (sliders + chips before the first AI prompt). Backing surface for the H3 redesign.

## 4. Profile

- `GET /api/profile` — current user's profile.
- `PATCH /api/profile` — partial updates with field-level validation.
- `POST /api/profile/derive` — two-phase AI profile derivation (Phase 1 baseline + Phase 2 enrichment).
- `POST /api/profile/upload-photo` — storage upload through Supabase Storage.
- `POST /api/profile/photo-moderate` — Sightengine moderation; **fails closed** on infra error; every verdict logged to `photo_moderation`.

## 5. Matches & Intros

### 5.1 Matches

- `GET /api/matches` — daily match list (plan-gated by `daily_matches`).
- `POST /api/matches/generate` — trigger generation; soft-fail JSON parse path returns `[]` and logs to `matches/generate JSON parse failed:`.
- `POST /api/matches/briefing` — narrative compatibility framing for a single candidate.
- `GET /api/matches/[id]/soul-knock-questions` — per-match Soul Knock question suggestions (commit `004aa7a`, commit `0a4a0a0` per-match openers).

### 5.2 Intros (Soul Knock)

- `GET /api/intros` — sender-side intro list.
- `GET /api/intros/received` — recipient-side intro list.
- `POST /api/intros/request` — send a Soul Knock. Plan-gated by `soul_knock` (Free 3 / Premium 15 / Pro unlimited, daily).
- `POST /api/intros/respond` — accept / decline an intro; creates a thread on mutual accept.
- `POST /api/intros/pass` — soft-pass without notifying sender.
- `POST /api/intros/modify` — sender edits an in-flight intro before recipient sees it.
- `POST /api/intros/withdraw` — sender retracts before response.
- `POST /api/intros/score-question` — AI quality scoring on draft Soul Knock questions with experiment-gated soft-block (commit `96f276b`).
- `POST /api/intros/icebreakers` — fallback icebreakers when per-match openers are missing.

## 6. Messaging

- `GET /api/messages` — thread list.
- `GET /api/messages/[threadId]` — thread detail; opening marks unread messages read.
- `POST /api/messages/[threadId]` — append message. Includes DM moderation gate (commit `004aa7a`). Voice notes capped at 60 seconds.
- `POST /api/messages/[threadId]/proposal-response` — accept / decline an in-thread date proposal (commit `b89dd27`).

## 7. AI Surfaces

### 7.1 Companion (Maahi)

- `POST /api/companion/chat` — chat turn. Plan-gated by `maahi_session` (weekly) and `maahi_turn` (per-week turn cap: Free 12 / Premium 100 / Pro unlimited).
- `POST /api/companion/daily` — daily companion nudge.
- `POST /api/companion/memory` — persists session memory extraction.
- `GET /api/companion/quota` — current usage vs. plan limit.

### 7.2 Coach

- `POST /api/coach/chat` — coach chat surface.
- `POST /api/coach/plan` — multi-step coaching plan generation.

### 7.3 Other AI surfaces

- `POST /api/chat` — onboarding chat tool layer.
- `POST /api/maahi` — public Maahi landing chat (anonymous demo).
- `POST /api/life-preview` — Life Preview AI simulation. Plan-gated by `life_preview` (monthly).
- `POST /api/dates/concierge` — date planning helper.
- `POST /api/dates/debrief` — date debrief capture (legacy single-shot).
- `POST /api/debrief/structured` — structured 3-prompt debrief; insights feed back into matching context.
- `POST /api/growth/reflect` — growth / journaling reflection.
- `POST /api/commitment` — commitment tracking (per migration `202605100003`).

All AI surfaces emit per-call cost telemetry into the `ai_costs` table (commit `fb03221`, `71c5e77`).

## 8. Pulse Community

- `GET /api/pulse/prompts/today` — current day's admin-curated prompt.
- `POST /api/pulse/prompts` — admin-only prompt creation.
- `GET /api/pulse/posts` — cursor-paginated feed.
- `POST /api/pulse/posts` — anonymous prompt-response post (only `prompt_response` type is allowed).
- `POST /api/pulse/posts/[id]/react` — emoji reaction.
- `GET /api/pulse/posts/[id]/replies` — replies for a post.
- `POST /api/pulse/posts/[id]/replies` — append reply.
- `POST /api/pulse/posts/[id]/flag` — user flag, feeds moderation auto-hide.
- `GET /api/pulse/stats` — aggregate engagement counters.

## 9. Safety & Verification

### 9.1 Safety

- `POST /api/safety/block` — bidirectional block (UNION enforced) plus match cache invalidation.
- `POST /api/safety/report` — abuse report. Severe reports get same-day admin review; standard reports one business day.

### 9.2 Verification

- `GET /api/verification/status` — pending / approved / rejected.
- `POST /api/verification/linkedin` — LinkedIn URL submission.
- `POST /api/verification/selfie` — selfie artifact submission.

## 10. Billing

Two billing modes; the active mode is controlled by `BILLING_MODE` env var.

- `POST /api/billing/checkout` — Stripe Checkout (subscription + one-time). Returns 503 when `BILLING_MODE=early_access`.
- `POST /api/billing/portal` — Stripe Customer Portal. Returns 503 when `BILLING_MODE=early_access`.
- `GET /api/billing/status` — `{ isPremium, plan, status }`.
- `POST /api/billing/webhook` — Stripe webhook with idempotency via `stripe_events`.
- `POST /api/billing/redeem` — **Early Access** Premium redemption against `EARLY_ACCESS_CODES`. Returns 503 when `BILLING_MODE=stripe`.
- `POST /api/billing/redeem-addon` — redeem an add-on coupon code (`ADDON_COUPON_CODES`).

## 11. Push Notifications

- `POST /api/push/subscribe` — register a browser web-push subscription. Backed by `push_subscriptions` table (migration `202605100001`).

## 12. Email

- `POST /api/notifications/email` — internal email send hook (signed via `INTERNAL_API_SECRET`).
- `GET /api/email/unsubscribe` — one-click unsubscribe handler. Logged to `notification_log`.

## 13. Cron

- `POST /api/cron/daily-orchestrator` — Vercel Cron entry point. Generates daily matches, sends Daily Soul Knock email (7 day-of-week variants), and rolls forward usage counters. Requires `INTERNAL_API_SECRET`.

## 14. Admin

### 14.1 Dashboard

- `GET /api/admin/dashboard/feed` — recent operational events.
- `GET /api/admin/dashboard/inactive` — users at risk of churn.
- `GET /api/admin/dashboard/ping` — admin liveness probe.

### 14.2 Photo moderation

- `GET /api/admin/photo-moderation` — pending photo queue.
- `POST /api/admin/photo-moderation` — approve / reject.

### 14.3 Pulse moderation

- `GET /api/admin/pulse/posts`
- `PATCH /api/admin/pulse/posts/[id]` — set `isHidden`.
- `GET /api/admin/pulse/prompts`
- `PATCH /api/admin/pulse/prompts/[id]` — manage the prompt rotation.

### 14.4 Verification

- `GET /api/admin/verification` — pending queue.
- `POST /api/admin/verification/[userId]` — approve / reject.

## 15. Endpoint Quality Checklist

Required for any new endpoint:

- Authentication requirement is explicit (`requireAuth`, `requireAdmin`, or `requireInternal`).
- Input validated and normalized at the boundary.
- Stable error envelope (`{ error: { code, message } }`).
- Rate limiting added when abuse-sensitive.
- AI surfaces log to `ai_costs` and respect plan-gated limits.
- High-value side effects (billing writes, moderation verdicts, intros, blocks) are logged.
- This reference and `user-journeys.md` are updated in the same PR.
