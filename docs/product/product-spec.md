# BiggDate Product Spec

Version: 1.0.0
Date: 2026-05-01
Status: Active

## 1. Product Definition

BiggDate is a relationship-first dating product that uses structured onboarding and AI-assisted reflection to optimize for emotional compatibility, not swipe volume.

Core promise: help users understand themselves deeply, meet aligned people, and move from intent to meaningful conversation.

## 2. Problem Statement

Most dating products optimize for engagement loops instead of relationship outcomes.

Users face:

- Low-signal profiles.
- Misaligned intent.
- Shallow conversation starters.
- Weak post-match progression.

BiggDate addresses this by collecting richer user context and driving a guided path from profile depth to match quality and intentional messaging.

## 3. Target User Segments

Primary segments:

- Intentional daters seeking serious compatibility.
- Users who value structured reflection and coaching.
- Users in culturally nuanced dating contexts where values alignment matters.

Secondary segments:

- Growth-minded users using companion/coach features.
- Community contributors using Pulse.

## 4. Product Pillars

1. Self-understanding first:
- Conversational onboarding generates deep profile context.
- Ongoing reflection via companion and debrief.

2. High-signal matching:
- Narrative and values-focused match framing.
- Compatibility signals and friction points.

3. Intentional connection:
- Soul Knock intro mechanism before chat unlock.
- Guided icebreakers and context-rich messaging.

4. Safety and trust:
- Reporting/blocking flows.
- Verification and moderation systems.

5. Sustainable monetization:
- Plan-based limits and upgrades on gated actions.

## 5. Core Feature Domains

### 5.1 Onboarding and Derivation

Capabilities:

- AI-powered onboarding chat.
- Two-phase profile derivation.
- Persisted profile enrichment.

User value:

- Less form fatigue.
- Higher fidelity self-representation.

### 5.2 Profile System

Capabilities:

- Deep profile editing across identity, lifestyle, values, intent, and relationship architecture.
- Visibility and display controls.
- Photo upload and moderation path.

User value:

- Better self-expression and better compatibility input.

### 5.3 Matching and Intros

Capabilities:

- Daily match generation with gating and caching.
- Soul Knock request/response flow.
- Mutual-intro thread unlock and optional photo unlock.

User value:

- Fewer low-quality interactions, better progression into real conversation.

### 5.4 Messaging

Capabilities:

- Thread list and thread detail.
- Read tracking and message creation.

User value:

- Focused conversation after mutual intent.

### 5.5 Companion and Coach

Capabilities:

- Companion chat with memory extraction.
- Daily companion guidance.
- Coach chat and generated coaching plans.
- Public Maahi landing chat experience.

User value:

- Higher emotional clarity and decision support.

### 5.6 Life Preview and Debrief

Capabilities:

- AI life-preview simulation with gating and cache.
- Structured post-date debrief capture.

User value:

- Better decision quality across dating cycles.

### 5.7 Pulse Community

Capabilities:

- Prompt-led anonymous posting.
- Reactions, replies, and flagging.
- Admin moderation controls.

User value:

- Lightweight social signal layer beyond direct matches.

### 5.8 Safety and Verification

Capabilities:

- Report and block APIs.
- Verification submission and admin review.
- Photo moderation queue and resolution.

User value:

- Higher trust and reduced harmful interactions.

### 5.9 Billing and Plans

Capabilities:

- Stripe checkout and portal paths.
- Webhook-driven plan sync.
- Feature gating based on plan and usage counters.

User value:

- Clear free-to-paid progression with premium leverage points.

### 5.10 Voice Notes

Capabilities:

- Record and send up to 60-second voice notes inside threads (`MAX_VOICE_DURATION_SEC`).
- Voice notes stored in the `voice-notes` Supabase bucket with RLS hardening (migrations `202605100001_voice_notes`, `202605140001_voice_notes_storage_rls`).
- Maahi TTS playback for AI-generated content (commit `2aa04ba`).

### 5.11 Push Notifications

Capabilities:

- Web Push via `web-push` and VAPID keys.
- Subscriptions persisted to `push_subscriptions` (migration `202605100001`).
- Trigger paths: new Soul Knock received, mutual match, daily prompt, date proposal updates.
- Native push (APNS / FCM) deferred until the mobile clients ship.

### 5.12 Date Proposals

Capabilities:

- In-thread date scheduler (commit `b89dd27`): propose a date, accept / counter, calendar handoff.
- Backed by `date_proposals` (migration `202605170003`) and `POST /api/messages/[threadId]/proposal-response`.

### 5.13 Commitment Tracking

Capabilities:

- Lightweight per-user commitment markers (migration `202605100003`, `POST /api/commitment`).
- Used by Maahi context and the Date Concierge to ground advice in stated intent.

### 5.14 Daily Soul Knock Email & Orchestrator

Capabilities:

- Vercel Cron entry at `/api/cron/daily-orchestrator` runs daily.
- Generates the daily match batch, sends the **Daily Soul Knock email** (7 day-of-week variants — commit `a5aeab1`), and rolls forward usage counters.
- All deliveries audited in `notification_log` (migration `202605170001`); user-facing unsubscribe at `/api/email/unsubscribe`.

### 5.15 Experiments & A/B

Capabilities:

- Lightweight experiment assignment table (`experiments`, migration `202605150005`) with funnel-event tracking in `analytics_events` (migration `202605150003`).
- Used to gate Soul Knock quality scoring soft-block, onboarding redesigns, and pricing experiments.

### 5.16 AI Cost Instrumentation

Capabilities:

- Per-call cost logging into `ai_costs` (migration `202605150004`).
- Surfaces include Maahi turn, Coach plan, Life Preview, match generation, profile derive, and Soul Knock scoring.
- Daily roll-ups support per-user gross-margin tracking.

### 5.17 Region Blocking & Age / Consent Capture

Capabilities:

- Requests from blocked jurisdictions are redirected to `/region-blocked` at the proxy boundary.
- Signup captures DOB + explicit Terms / Privacy consent (migration `202605170004`, commit `f77b09f`).
- Settings drawer exposes a Consent Reset link (commit `c5c974a`) for users who want to re-evaluate analytics opt-in.

## 6. Plan and Access Model

Current gated actions:

- soul_knock
- maahi_session
- maahi_turn
- life_preview
- daily_matches

Configured limits:

- soul_knock: free 3, premium 15, pro unlimited (daily).
- maahi_session: free 3, premium 15, pro unlimited (weekly).
- maahi_turn: free 12, premium 100, pro unlimited (weekly).
- life_preview: free 0, premium 2, pro unlimited (monthly).
- daily_matches: free 5, premium 20, pro unlimited (daily).

Limits are enforced in [src/lib/repo.ts](../../src/lib/repo.ts) via `requirePlan` + `incrementUsage`.

## 7. Product Success Metrics

Acquisition:

- Signup conversion rate.
- Onboarding completion rate.

Activation:

- Time to first generated matches.
- Intro request rate.

Engagement:

- Intro response rate.
- Mutual thread creation rate.
- Message depth per thread.

Outcome quality:

- Debrief completion rate.
- Repeat matching cycles per active user.

Monetization:

- Upgrade conversion from gated prompts.
- Trial to paid conversion.

Safety and trust:

- Report rate per active user.
- Verification adoption rate.
- Moderation resolution latency.

## 8. Non-Goals (Current Phase)

- Infinite feed-style swiping loop.
- Broad social graph expansion.
- Complex multi-tenant B2B feature set.

## 9. Constraints and Dependencies

External dependencies:

- Supabase Auth, Storage, and Postgres.
- Stripe (subscription + add-ons) **or** Early Access redemption mode (`BILLING_MODE`).
- AI provider abstraction with Gemini (default) and OpenAI fallback. Ollama paths were removed.
- Sightengine for photo moderation (**fail-closed**).
- Resend for transactional email; PostHog + Meta Pixel for analytics (consent-gated); web-push + VAPID for push.

Operational constraints:

- Email and push are fire-and-forget; failures audited via `notification_log`.
- Photo moderation is fail-closed — uploads are blocked on Sightengine outage rather than auto-approved.
- Thread refresh and date-proposal acceptance are polling-based; realtime migration is queued.

## 10. Release Governance

Every material feature release should update:

- This product spec.
- User journeys.
- API reference for changed endpoints.
- Data model changes with migrations.
