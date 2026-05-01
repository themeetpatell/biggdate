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

## 6. Plan and Access Model

Current gated actions:

- soul_knock
- maahi_session
- life_preview
- daily_matches

Configured limits:

- soul_knock: free 3, premium 15, pro unlimited.
- maahi_session: free 3, premium 15, pro unlimited.
- life_preview: free 0, premium 2, pro unlimited.
- daily_matches: free 5, premium 20, pro unlimited.

Period windows:

- soul_knock and daily_matches: daily.
- maahi_session: weekly.
- life_preview: monthly.

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
- Stripe checkout + webhooks.
- AI provider abstractions (Gemini/OpenAI/Ollama variants).
- Optional moderation provider (Sightengine).
- Resend for email notifications.

Operational constraints:

- Some controls are best-effort by design (notifications, moderation fail-open).
- Real-time messaging uses polling UX in current implementation.

## 10. Release Governance

Every material feature release should update:

- This product spec.
- User journeys.
- API reference for changed endpoints.
- Data model changes with migrations.
