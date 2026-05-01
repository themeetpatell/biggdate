# Data Model

Version: 1.0.0
Date: 2026-05-01

## 1. Entity Overview

Core entities:

- AccountHandle: user identity projection (email, username, full name).
- Profile: primary relationship and compatibility model.
- Match: generated candidate payload with narrative and compatibility signals.
- Intro and SoulKnockResponse: pre-chat intent exchange.
- Thread and Message: post-mutual communication.
- SessionMemory: companion memory state and emotional profile.
- DebriefReflection: structured post-date reflection.
- UserPlan and UsageCounter: billing state and access control.
- PulsePrompt, PulsePost, PulseReply, PulseReaction, PulseFlag.
- Safety and moderation entities: reports, blocked_users, photo_moderation.
- StripeEvents: webhook idempotency ledger.

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

- soul_knock
- maahi_session
- life_preview
- daily_matches

Require-plan resolution:

- Plan determined from user_plan status.
- Limit looked up from PLAN_LIMITS table in repo logic.
- Usage counter checked by action + period_start.
- Access granted if used < limit.

## 5. Moderation and Safety Model

Photo moderation:

- Moderation result stores status, provider, scores, reason.
- Flagged items feed admin moderation queue.

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
