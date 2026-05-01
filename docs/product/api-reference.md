# API Reference

Version: 1.0.0
Date: 2026-05-01

This is a product-focused API reference grouped by domain. For implementation specifics, see route files under src/app/api.

## 1. Health and Diagnostics

- GET /api/health

## 2. Auth

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- DELETE /api/auth/delete

Behavior notes:

- Signup, login, and forgot-password are rate limited.
- Me endpoint returns auth state plus profile availability.

## 3. Profile

- GET /api/profile
- PATCH /api/profile
- POST /api/profile/derive
- POST /api/profile/photo-moderate
- POST /api/profile/upload-photo

Behavior notes:

- Profile derive uses AI and persists partial/full profile patches.
- Upload-photo performs storage upload, moderation, and moderation logging.

## 4. Matches and Intros

Matches:

- GET /api/matches
- POST /api/matches/generate
- POST /api/matches/briefing

Intros:

- GET /api/intros
- POST /api/intros/request
- GET /api/intros/received
- POST /api/intros/respond
- POST /api/intros/pass
- POST /api/intros/icebreakers

Behavior notes:

- Match generation and life-preview related features are plan gated.
- Intro respond can create a thread on mutual response.

## 5. Messaging

- GET /api/messages
- GET /api/messages/[threadId]
- POST /api/messages/[threadId]

Behavior notes:

- Thread reads mark messages as read.
- Posting appends a new message in-thread.

## 6. Companion, Coach, and AI Utilities

Companion:

- POST /api/companion/chat
- POST /api/companion/daily
- POST /api/companion/memory

Coach:

- POST /api/coach/chat
- POST /api/coach/plan

Other AI paths:

- POST /api/chat
- POST /api/maahi
- POST /api/life-preview
- POST /api/dates/concierge
- POST /api/dates/debrief
- POST /api/debrief/structured
- POST /api/growth/reflect

Behavior notes:

- Companion chat uses plan gate and usage counters.
- Memory endpoint extracts and persists emotional/session memory.

## 7. Pulse Community

- GET /api/pulse/prompts/today
- POST /api/pulse/prompts
- GET /api/pulse/posts
- POST /api/pulse/posts
- POST /api/pulse/posts/[id]/react
- GET /api/pulse/posts/[id]/replies
- POST /api/pulse/posts/[id]/replies
- POST /api/pulse/posts/[id]/flag

Behavior notes:

- Prompt creation is admin-only.
- Feed supports cursor pagination.
- Flag volume can trigger moderation behavior.

## 8. Safety and Verification

Safety:

- POST /api/safety/block
- POST /api/safety/report

Verification:

- GET /api/verification/status
- POST /api/verification/linkedin
- POST /api/verification/selfie

Behavior notes:

- Reporting also performs block and match-cache invalidation.

## 9. Billing

- POST /api/billing/checkout
- GET /api/billing/status
- POST /api/billing/portal
- POST /api/billing/webhook

Behavior notes:

- Checkout supports subscription and one-time payment modes.
- Webhook updates plan tier and lifecycle status.
- Stripe events are tracked for idempotency.

## 10. Admin APIs

Photo moderation:

- GET /api/admin/photo-moderation
- POST /api/admin/photo-moderation

Pulse moderation:

- GET /api/admin/pulse/posts
- PATCH /api/admin/pulse/posts/[id]

Verification moderation:

- GET /api/admin/verification
- POST /api/admin/verification/[userId]

Behavior notes:

- Admin routes enforce allowlist checks in addition to auth.

## 11. Authentication and Authorization Pattern

- Most non-public routes require authenticated user context via requireAuth.
- Plan-gated routes call requirePlan and incrementUsage when action is consumed.
- Admin routes use explicit allowlist checks.

## 12. Endpoint Quality Checklist

For any new endpoint:

- Define authentication requirement explicitly.
- Validate and normalize input.
- Return stable error envelopes.
- Add rate limiting if abuse-sensitive.
- Add logging for high-value side effects.
- Update this reference and journey docs.
