# User Journeys

Version: 1.0.0
Date: 2026-05-01

## 1. New User Lifecycle

### Journey A: Signup to First Match

1. User signs up or logs in.
2. User starts onboarding conversation.
3. Phase 1 derive endpoint extracts baseline profile structure.
4. Phase 2 derive endpoint enriches profile depth.
5. User reaches dashboard and triggers/receives daily matches.

Success signals:

- Onboarding complete.
- At least one match generated.

Failure points:

- Auth friction.
- Onboarding drop-off.
- Empty candidate pool.

### Journey B: Match to Conversation

1. User views match preview details.
2. User sends Soul Knock intro request.
3. Recipient answers Soul Knock.
4. If mutual, thread is created.
5. Both users enter messaging thread.

Success signals:

- Intro response rate.
- Mutual thread creation.
- First message sent within 24 hours.

Failure points:

- Intro ignored.
- Plan gate stops recipient response.
- Poor opening quality.

### Journey C: Date Reflection Loop

1. User completes interaction/date.
2. User opens debrief flow.
3. User answers 3 structured reflection prompts.
4. System stores reflection and insight.

Success signals:

- Debrief submission rate.
- Return to match cycle with improved decision confidence.

## 2. Companion and Coaching Journeys

### Journey D: Companion Session

1. User opens companion page.
2. User chats with companion.
3. Plan gate checks usage.
4. Session memory extraction updates persisted memory profile.

Success signals:

- Session completion rate.
- Repeat companion sessions.

### Journey E: Coach Plan

1. User opens coach surface.
2. User asks for plan or chats.
3. System generates coaching plan.

Success signals:

- Plan generation completion.
- Follow-up engagement in profile/matching actions.

## 3. Pulse Community Journeys

### Journey F: Prompt Participation

1. User opens Pulse feed.
2. User fetches active prompt.
3. User submits prompt response post.
4. Others react/reply.

Success signals:

- Prompt participation rate.
- Reply and resonance rates.

Safety controls:

- User flagging and admin moderation.

## 4. Trust and Safety Journeys

### Journey G: Report and Block

1. User reports problematic user.
2. System records report.
3. System blocks reported user and invalidates match cache.

Success signals:

- Time to safety action.
- Reduction in repeated reports on same actor.

### Journey H: Verification

1. User checks verification status.
2. User submits LinkedIn URL and selfie artifact.
3. Admin reviews pending queue.
4. Admin approves/rejects.

Success signals:

- Verification completion rate.
- Verified badge distribution among active users.

## 5. Revenue Journeys

### Journey I: Upgrade Conversion

1. User hits plan gate in feature flow.
2. Upgrade sheet appears with premium value framing.
3. User initiates Stripe checkout.
4. Webhook updates plan status.
5. Feature access expands.

Success signals:

- Checkout start rate after gate.
- Paid conversion rate.

## 6. New-Surface Journeys

### Journey J: Voice Note Send

1. User opens a thread.
2. Holds the microphone control and records up to 60s.
3. Recorder auto-stops at the cap, uploads to the `voice-notes` bucket.
4. Voice note appears inline in the thread; recipient gets a push if subscribed.

### Journey K: In-Thread Date Proposal

1. User sends a proposed date (time + place) inside an active thread.
2. Counterpart accepts, counters, or declines via `/api/messages/[threadId]/proposal-response`.
3. On accept, both users get a calendar handoff link and the proposal moves to `confirmed`.

### Journey L: Daily Soul Knock Email → Reply

1. Daily orchestrator cron picks the day-of-week variant and recipients.
2. Email delivers via Resend; click-through opens the linked match.
3. User sends the Soul Knock from the linked preview; the funnel event is logged to `analytics_events`.

### Journey M: Push Subscription

1. User taps "Enable notifications" in settings.
2. Browser prompts for permission; on accept, `POST /api/push/subscribe` registers the subscription.
3. Future intros, mutual matches, and proposals trigger web push.

### Journey N: Early-Access Redemption

1. User receives a code from the founder via WhatsApp.
2. User enters the code at `/settings/billing`.
3. `POST /api/billing/redeem` validates against `EARLY_ACCESS_CODES` and writes an `active` row to `user_plans` with `stripe_subscription_id = NULL`.
4. Premium entitlements unlock.

### Journey O: Region Block

1. Incoming request hits the proxy.
2. Geo check matches a blocked jurisdiction.
3. User is redirected to `/region-blocked` with a contact path for waitlist signup.

### Journey P: DOB + Consent at Signup

1. User selects DOB on signup; under-18 is hard-blocked.
2. User must check Terms + Privacy consent (stored in the signup consent ledger).
3. Account creation proceeds only after both pass.

## 7. Journey Instrumentation Checklist

For each journey, capture:

- Start event.
- Completion event.
- Drop-off reason taxonomy.
- Time-to-complete distribution.
- Plan segment breakdown.
- PostHog event name (events ship through `src/lib/analytics.ts` after consent).
