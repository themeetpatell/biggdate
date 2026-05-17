<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into BiggDate. Both client-side and server-side tracking are wired up using `posthog-js` (browser) and `posthog-node` (server), with a reverse proxy configured for ad-blocker resilience. Users are identified in PostHog using their Supabase user ID, ensuring client and server events are correlated under one person profile.

## Files created or modified

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Added `posthog.init()` below existing Sentry init — uses `/ingest` reverse proxy, `capture_exceptions: true` |
| `src/lib/posthog-server.ts` | New file — singleton `getPostHogClient()` for server-side PostHog Node client |
| `next.config.ts` | Added PostHog `/ingest` rewrites + `skipTrailingSlashRedirect: true`; added PostHog domains to CSP `connect-src` |
| `.env.local` | Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `posthog.identify()` | Identifies the authenticated user client-side when auth state loads | `src/components/auth-provider.tsx` |
| `user_logged_out` | User explicitly logged out; resets PostHog distinct ID | `src/components/auth-provider.tsx` |
| `user_logged_in` | Successful login — server-side identify + capture | `src/app/api/auth/login/route.ts` |
| `onboarding_basics_submitted` | User completed the 5-tap basics form and advanced to AI chat | `src/app/onboarding/basics/page.tsx` |
| `onboarding_completed` | Both onboarding phases finished and Soul Profile derived | `src/app/onboarding/page.tsx` |
| `icebreaker_copied` | User copied an AI-generated icebreaker on the match connect page | `src/app/matches/[id]/connect/page.tsx` |
| `date_ideas_requested` | User clicked "Get Date Ideas" for AI-curated venue suggestions | `src/app/matches/[id]/connect/page.tsx` |
| `checkout_initiated` | Stripe Checkout session created (subscription or payment) | `src/app/api/billing/checkout/route.ts` |
| `subscription_activated` | Stripe webhook confirmed subscription active or trialing | `src/app/api/billing/webhook/route.ts` |
| `soul_knock_sent` | User sent a Soul Knock intro request to a match | `src/app/api/intros/request/route.ts` |
| `thread_unlocked` | Both users answered — mutual match thread opened | `src/app/api/intros/respond/route.ts` |

## Next steps

We've built a dashboard and 5 insights for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1595607)
- [Onboarding conversion funnel](/insights/Vvtup5NA) — Login → Basics submitted → Onboarding completed
- [Soul Knock → Thread Unlock conversion](/insights/Maif24Jo) — Measures match-making quality
- [Checkout → Subscription activation](/insights/3lHOFTxv) — Revenue conversion funnel
- [Daily engagement: Soul Knocks & Matches](/insights/E9MevK0Q) — Core engagement health signal
- [New users over time (DAU)](/insights/Z6kmK67t) — Daily active users trend

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
