# Operations and Risks

Version: 1.0.0
Date: 2026-05-01

## 1. Runtime and Infrastructure

- App framework: Next.js App Router.
- Auth and storage: Supabase.
- Database: Postgres via server-side pg pool.
- Payments: Stripe checkout + webhooks.
- Email: Resend.
- AI providers: Gemini/OpenAI/Ollama via abstraction layer.

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

- Photo moderation with provider fallback behavior.
- User report and block mechanics.
- Pulse post flagging and admin moderation.
- Verification flow and admin approval path.

## 5. Known Risks

1. Stripe webhook idempotency ordering risk:
- Event id is recorded before downstream handling.
- Failure after record can block meaningful retry processing.

2. Verification selfie payload shape risk:
- Selfie values may be persisted as large URL/base64 payload strings.
- May increase PII handling and storage complexity.

3. Internal notifications endpoint trust model risk:
- Origin/host heuristic may be insufficient as sole protection.

4. Notification preference consistency risk:
- UI preference persistence and backend preference reads may diverge if not synchronized.

5. Pulse scope mismatch risk:
- API currently restricts to prompt_response type only.
- Product messaging may drift if broader posting is implied.

6. Conversation freshness risk:
- Thread refresh currently polling-based rather than realtime subscriptions.

7. Dual photo moderation path complexity:
- Separate endpoints can produce inconsistent client semantics and status handling.

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
