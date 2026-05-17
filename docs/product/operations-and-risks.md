# Operations and Risks

Version: 1.0.0
Date: 2026-05-01

## 1. Runtime and Infrastructure

- App framework: Next.js 16 App Router with `src/proxy.ts` request boundary.
- Auth and storage: Supabase (Auth + Postgres + Storage).
- Database: Postgres via server-side `pg` pool.
- Payments: dual-mode — Stripe Checkout + Customer Portal + webhooks, or Early Access redemption mode (founder-issued codes via `/api/billing/redeem`).
- Email: Resend, fire-and-forget. Delivery audited via `notification_log`.
- AI providers: Gemini (default — `gemini-2.5-flash`) with OpenAI fallback through the `src/lib/ai.ts` abstraction. Ollama paths were removed (commit `244001b`).
- Push notifications: web-push + VAPID; subscriptions persisted to `push_subscriptions`.
- Photo moderation: Sightengine with **fail-closed** behavior on infra errors (commit `770934e`) — flagged uploads return 422 and the client never commits the URL.
- Background work: Vercel Cron runs `/api/cron/daily-orchestrator` which generates matches, sends the daily Soul Knock email, and rolls up usage counters.
- Analytics: PostHog (product events + funnel) and Meta Pixel (acquisition) load only after the user accepts the consent banner. Vercel Analytics captures page-level metrics independently.

## 2. Reliability Controls

- Rate limiting implemented for key auth routes.
- Plan gate checks for premium-sensitive actions.
- Stripe event idempotency via event ledger.
- Best-effort notification sending to avoid user flow blocking.

## 3. Observability and Error Handling

- Structured logging utility with optional Sentry forwarding.
- Explicit error responses across API routes.
- Health endpoint for service diagnostics.

## 4. Content and Trust Controls

- Photo moderation runs **fail-closed** — uploads are blocked if Sightengine is unreachable or returns NSFW signals; verdicts are persisted in `photo_moderation` for audit.
- User report and block mechanics with bidirectional cache invalidation.
- Pulse post flagging, auto-hide on repeat flags, admin moderation.
- Verification flow: LinkedIn URL + selfie → admin queue → verified badge. Verification submission is rate-limited and audit-logged.
- Outbound message moderation gate on DMs (commit `004aa7a`) catches the worst openers before send.
- Region blocking: requests from blocked jurisdictions hit `/region-blocked`; logic enforced at the proxy boundary.
- Age & consent: signup captures DOB and explicit Terms/Privacy consent (commit `f77b09f` real-age-gate, migration `202605170004`).

## 5. Known Risks

1. Stripe webhook idempotency ordering risk:
- Event id is recorded in `stripe_events` before downstream handling.
- Failure after record can block meaningful retry processing — dead-letter recovery is in the mitigation backlog.

2. Verification selfie payload shape risk:
- Selfie values may be persisted as large URL/base64 payload strings.
- Move to Supabase Storage object pointer is on the backlog.

3. Internal notifications endpoint trust model risk:
- Mitigated by `INTERNAL_API_SECRET` on signed internal calls and cron entrypoints.

4. Notification preference consistency risk:
- UI preference persistence and backend preference reads may diverge until consolidated under a single source of truth.

5. Pulse scope mismatch risk:
- API currently restricts to `prompt_response` posts; broader Pulse copy must stay aligned. Pulse remains low-priority retention glue per `product-decisions.md`.

6. Conversation freshness risk:
- Thread refresh is polling-based; date-proposal acceptance is also polling-driven. Realtime migration is queued.

7. Dual photo moderation path complexity:
- Two endpoints (`/api/profile/upload-photo` and `/api/profile/photo-moderate`) need to be unified behind one shared service contract.

8. AI cost variance risk:
- Maahi turn / session, Life Preview, and match generation are AI-cost dominant. `ai_costs` table now logs per-call usage (commit `fb03221`); plan-gated limits cap free-tier burn.

9. Voice-note storage growth:
- `voice-notes` bucket has its own RLS; messages cap at 60s. Lifecycle policy for old voice notes is pending.

10. Daily Soul Knock email cadence risk:
- Seven day-of-week variants ship through `notification_log`; spam complaints feed into the unsubscribe / preference center at `/api/email/unsubscribe`.

## 6. Mitigation Backlog

Short-term:

- Harden notification endpoint with service token or signed internal calls.
- Normalize selfie upload to object storage and persist pointer only.
- Align photo moderation endpoints behind shared service contract.
- Add explicit dead-letter/recovery flow for Stripe handler failures.

Mid-term:

- Reconcile notification preferences into single source of truth path.
- Introduce realtime transport for thread updates.
- Expand route-level rate limiting to high-cost AI endpoints.

## 7. Operational Runbook Minimums

- Verify migrations applied before deploy.
- Validate Stripe webhook secret and endpoint health.
- Validate email sender domain and Resend key.
- Confirm AI provider key and model selection.
- Run full checks:
  - npm run lint
  - npm run typecheck
  - npm run repo:check
  - npm run docs:check
