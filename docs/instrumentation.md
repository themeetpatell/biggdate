# Instrumentation

Two tables, two emitters. Designed so the unit-economics and PMF
conversations in the next two investor meetings have real numbers behind
them.

## Tables

| Table | Migration | Purpose |
|---|---|---|
| `analytics_events` | `202605150003` | Funnel events (signup → first_paid). |
| `ai_costs` | `202605150004` | Per-call inference cost log. |

Both have RLS denying client read/write — they're internal/ops surfaces.
The service role bypasses RLS for export to a future PostHog/Mixpanel
adapter or a CSV dump.

## Views

| View | Source | Use |
|---|---|---|
| `cohort_retention` | `analytics_events` | D0/D1/D7/D14/D30 retention by signup day. |
| `ai_cost_per_user_30d` | `ai_costs` | $/active-user/30-day window for unit economics. |
| `ai_cost_by_route_30d` | `ai_costs` | Surface-level cost breakdown for optimization. |

## Emitting funnel events

```ts
import { track, trackFirst } from "@/lib/analytics";

// Every-occurrence:
await track({
  name: "soul_knock_sent",
  userId,
  properties: { matchId, recipientUserId },
});

// First-time-only (idempotent per user):
await trackFirst({
  name: "first_soul_knock_sent",
  userId,
  properties: { matchId },
});
```

Add new event names to the `AnalyticsEventName` union in
`src/lib/analytics.ts` as you wire new emit sites. Keeping it a union is
deliberate — it gives a discoverable list of every event we capture.

## Logging AI calls

```ts
import { logAiCall } from "@/lib/ai-costs";

const aiStart = Date.now();
try {
  const result = await generateText({ model: getModel(), prompt });
  await logAiCall({
    route: "matches/generate",       // surface that originated the call
    userId,
    usage: result.usage,             // input/output tokens
    durationMs: Date.now() - aiStart,
  });
} catch (err) {
  await logAiCall({
    route: "matches/generate",
    userId,
    durationMs: Date.now() - aiStart,
    error: err instanceof Error ? err.message : "unknown",
  });
  throw err;
}
```

Both emitters are fire-and-forget. A log failure never blocks the request
— it goes to Sentry and the user-facing path completes.

## Wired surfaces

As of this commit, the following surfaces emit events / log AI costs.
The pattern is identical for any remaining surface; copy from these.

### Funnel events

| Event | Site | Type |
|---|---|---|
| `signup` | `src/app/api/auth/signup/route.ts` | every |
| `onboarding_phase1_complete` | `src/app/api/profile/derive/route.ts` | first |
| `onboarding_phase2_complete` | `src/app/api/profile/derive/route.ts` | first |
| `soul_knock_sent` | `src/app/api/intros/request/route.ts` | every |
| `first_soul_knock_sent` | `src/app/api/intros/request/route.ts` | first |
| `thread_unlocked` | `src/app/api/intros/respond/route.ts` | every |
| `first_thread_unlocked` | `src/app/api/intros/respond/route.ts` | first (both users) |
| `match_generated` | `src/app/api/matches/generate/route.ts` | every |
| `first_match_viewed` | `src/app/api/matches/generate/route.ts` | first |
| `life_preview_generated` | `src/app/api/life-preview/route.ts` | every |
| `checkout_completed` | `src/app/api/billing/webhook/route.ts` | every |
| `first_paid` | `src/app/api/billing/webhook/route.ts` | first |

### AI cost log

Every AI surface is wired. Streaming routes log via the `onFinish`
callback (usage resolves only when the stream completes); non-streaming
routes log inline after `generateText`.

| Route key | Site | Kind |
|---|---|---|
| `profile/derive:basic` / `:psychological` | `src/app/api/profile/derive/route.ts` | generateText |
| `matches/generate` | `src/app/api/matches/generate/route.ts` | generateText |
| `matches/briefing` | `src/app/api/matches/briefing/route.ts` | generateText |
| `life-preview` | `src/app/api/life-preview/route.ts` | generateText |
| `companion/daily` | `src/app/api/companion/daily/route.ts` | generateText |
| `companion/memory` | `src/app/api/companion/memory/route.ts` | generateText |
| `coach/plan` | `src/app/api/coach/plan/route.ts` | generateText |
| `coach/chat` | `src/app/api/coach/chat/route.ts` | streamText (onFinish) |
| `chat:onboarding:<phase>` | `src/app/api/chat/route.ts` | streamText (onFinish) |
| `chat:memory-extraction` | `src/app/api/chat/route.ts` | generateText (in `after()`) |
| `intros/icebreakers` | `src/app/api/intros/icebreakers/route.ts` | generateText |
| `debrief/structured` | `src/app/api/debrief/structured/route.ts` | generateText |
| `dates/concierge` | `src/app/api/dates/concierge/route.ts` | generateText |
| `dates/debrief` | `src/app/api/dates/debrief/route.ts` | generateText |
| `growth/reflect` | `src/app/api/growth/reflect/route.ts` | generateText |

### Logging a streamText call

```ts
const aiStart = Date.now();
const result = streamText({
  model: getModel(),
  system,
  messages,
  onFinish: ({ usage }) => {
    void logAiCall({ route: "coach/chat", userId, usage, durationMs: Date.now() - aiStart });
  },
});
return result.toUIMessageStreamResponse();
```

## Pricing table

`PRICE_PER_MTOK` in `src/lib/ai-costs.ts` is the source of truth for cost
estimation. When provider prices change:

1. Update the entry for the affected model.
2. Optionally backfill historical `cost_usd` via a one-shot script (we do
   not mutate `cost_usd` on every read — denormalization is intentional).

## What this isn't (yet)

- **External analytics provider.** PostHog/Mixpanel/Amplitude integration
  is intentionally deferred. The `analytics_events` table is the source
  of truth; an adapter forwards to whichever provider we eventually pick.
- **Real-time streaming.** All emits are synchronous DB inserts. At our
  scale this is fine. When we cross ~1M events/day, replace with a queue
  (Redis stream or a hosted event pipeline).
- **Client-side events.** Today every emit is server-side. Once we ship
  mobile, the same `analytics_events` table accepts client-emitted events
  via a `/api/analytics` POST endpoint (not yet built).
