# Data Model

Version: 2.0.0
Date: 2026-05-18

The current schema spans **36 migrations** under [supabase/migrations/](../../supabase/migrations/). This document captures the conceptual model; the SQL files are source of truth.

## 1. Entity Overview

Core entities:

- AccountHandle: user identity projection (email, username, full name, phone). Phone optional (commit `f77b09f`).
- Profile: primary relationship and compatibility model.
- Match: generated candidate payload with narrative and compatibility signals.
- Intro and SoulKnockResponse: pre-chat intent exchange (`intros.id` is `text`; FK enforced on `soul_knock_responses.intro_id` per migration `202605140002`).
- Thread and Message: post-mutual communication.
- VoiceNote (storage object + thread message reference, bucket `voice-notes`).
- DateProposal: in-thread date scheduler state (migration `202605170003`).
- Commitment: per-user commitment markers (migration `202605100003`).
- SessionMemory: Maahi memory state with TTL pruning (migrations `202604120002`, `202605030001`, `202605150002`).
- DebriefReflection: structured post-date reflection.
- UserPlan and UsageCounter: billing state and gated-action accounting.
- UserAddon: per-user add-on entitlements (Boost, Read Receipts, Incognito, Spotlight, etc. — migration `202605150001`).
- PulsePrompt, PulsePost, PulseReply, PulseReaction, PulseFlag (Pulse 2 redesign — migration `202605030006`).
- Safety and moderation entities: reports, blocked_users, photo_moderation.
- VerificationRecord and verified-badge state.
- PushSubscription: web-push endpoints + VAPID keys (migration `202605100001`).
- NotificationLog: every transactional email / push delivery (migration `202605170001`).
- DailySoulEmail: orchestration state for the day-of-week email rotation (migration `202605170002`).
- AnalyticsEvent, AiCostLog, Experiment: instrumentation tables (migrations `202605150003`, `202605150004`, `202605150005`).
- DashboardCheckin: lightweight check-in state for the dashboard surface (migrations `202605030007`, `202605090001`).
- SignupConsent: DOB + Terms/Privacy acceptance ledger (migration `202605170004`).
- StripeEvents: webhook idempotency ledger (Stripe mode only).
- EarlyAccessRedemption: tracked through `user_plans.status='active'` with `stripe_subscription_id IS NULL`.

## 2. Relationship Map

- User 1:1 Profile.
- User 1:1 AccountHandle.
- User 1:many Match records (time-scoped cache/persistence).
- User 1:many Intro (sender) and Intro (receiver).
- Intro 1:many SoulKnockResponse.
- Mutual Intro pair -> 1 Thread.
- Thread 1:many Message.
- User 1:many DebriefReflection.
- User 1:1 UserPlan.
- User 1:many UsageCounter (action + period).
- User 1:many PulsePost and PulseReply.
- PulsePost 1:many PulseReply, PulseReaction, PulseFlag.

## 3. Profile Model Depth

Profile includes:

- Identity: name, age, city, gender, orientation, pronouns.
- Life context: work, education, hometown, relocation, residency.
- Relationship intent and style: intent, relationship style, timeline.
- Lifestyle vectors: sleep, social battery, diet, travel, cleanliness.
- Family/culture vectors: family involvement, cultural alignment, marriage type.
- Psychological vectors: attachment, readiness, growth areas, strengths.
- Compatibility vectors: offers, needs, turn-ons/offs, attraction preferences.
- Visibility controls and photos.

## 4. Access Control Model

GatedAction values:

- soul_knock (daily)
- maahi_session (weekly)
- maahi_turn (weekly)
- life_preview (monthly)
- daily_matches (daily)

Require-plan resolution:

- Plan determined from `user_plans.status` (`free` | `premium` | `pro` | early-access `active`).
- Limit looked up from the `PLAN_LIMITS` table in [src/lib/repo.ts](../../src/lib/repo.ts).
- Usage counter checked by `(action, period_start)`.
- Access granted if `used < limit`.

Add-on entitlements (Boost, Incognito, Read Receipts, Spotlight, Super Like, Profile Review, Life Preview credits) live in `user_addons` and are enforced server-side per surface.

## 5. Moderation and Safety Model

Photo moderation:

- Sightengine integration is **fail-closed**: when the provider is unreachable or returns NSFW signals the upload is blocked and a 422 is returned to the client.
- Every verdict persisted to `photo_moderation` with status, provider, scores, and reason.
- Flagged items feed the admin moderation queue at `/admin/photo-moderation`.

Pulse moderation:

- User flags create moderation signals.
- Auto-hide can be triggered by repeated flags.
- Admin can set isHidden explicitly.

Safety:

- Report creation includes reason and optional notes.
- Block relationship enforces separation and cache invalidation.

## 6. Billing Model

UserPlan captures:

- plan tier (free/premium/pro).
- status (active, trialing, canceled, inactive).
- stripeCustomerId and stripeSubscriptionId.
- current period and trial boundaries.

StripeEvents table supports idempotent webhook processing.

## 7. Data Lifecycle Guidance

- Profile and plan tables are source of truth for personalization and access.
- Match and preview data can be cached and regenerated.
- Moderation and safety records should be retained for auditability.
- Session memory should be bounded and versioned as schema evolves.
