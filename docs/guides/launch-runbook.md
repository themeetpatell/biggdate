# Launch Runbook

Status as of 2026-05-01 (round 4 — GEO/AEO). Revise after every wave.

## Wave 1 — Pre-launch blockers

### ✅ Done — Round 1 (2026-05-01)
- Fixed auth-provider redirect from `/auth` so users with partial profiles (Phase 1 only) go back to `/onboarding` instead of a broken `/dashboard`. `src/components/auth-provider.tsx`.
- Added `/api/health` for uptime monitors (returns 200 with `{status, checks: {db}}`, 503 if DB unreachable).
- Added `/privacy` and `/terms` pages with placeholder text written for India (DPDP, Ahmedabad jurisdiction, 18+).
- Added 18+ age gate + Terms/Privacy consent checkbox on the signup form. Submit is gated on it.
- Added "welcome" event to `/api/notifications/email` and wired it into `auth/callback` (fires only on signup confirmation, not password recovery).
- Wired "match_ready" email into `/api/matches/generate` to fire after successful match generation.
- Added footer links to Privacy / Terms on the auth page.
- Added `src/lib/log.ts` — JSON-line structured logger.
- Added `src/lib/notifications.ts` — fire-and-forget helper for triggering emails from any server route.

### ✅ Done — Round 2 (2026-05-01)
- **Stripe webhook idempotency** via new `stripe_events` table + `recordStripeEvent()`. Duplicate retries are detected and acked without re-processing. Wraps handler in try/catch; failures surface via `log.error` (which now also goes to Sentry). Migration: `202605010001_launch_hardening.sql`.
- **Auth rate limiting** on `/api/auth/login` (5/min/IP), `/api/auth/signup` (3/hour/IP), `/api/auth/forgot-password` (3/10min/IP). Uses Upstash Redis when configured; falls back to in-memory sliding window for dev.
- **Sentry SDK installed** with DSN-driven activation. `instrumentation.ts` (server) + `instrumentation-client.ts` (browser) + `next.config.ts` wraps with `withSentryConfig`. `log.error` forwards to Sentry.
- **Photo moderation pipeline** with Sightengine integration. `POST /api/profile/photo-moderate` records every verdict to `photo_moderation` table; flagged photos return 422 so client doesn't commit URL. Fails open on infra errors.
- **Admin moderation queue UI** at `/admin/photo-moderation`.
- **Mobile polish on profile page** — avatar 96→80px on xs, name heading 2rem→1.6rem on xs.

### ✅ Done — Round 3 (2026-05-01)
- **CSP + HSTS** added to `next.config.ts`. Permissive baseline; 2-year HSTS with `includeSubDomains; preload`.
- **`public/robots.txt`** + **`src/app/sitemap.ts`** + **OG / Twitter card metadata** in `src/app/layout.tsx`.
- **Photo upload compression** — `src/lib/photo-compress.ts`. Cuts typical phone photos 5-20x before upload + moderation.
- **Loading skeletons** for `/profile`, `/companion`, `/messages`.
- **Block-list verification** — bidirectional UNION already in place.
- **Username uniqueness verification** — UNIQUE constraint already in place.
- **Email events confirmed wired**: welcome, match_ready, soul_knock_received, soul_knock_answered, mutual_match.

### ✅ Done — Round 4 (2026-05-01) — GEO / AEO

So that ChatGPT, Perplexity, Google AI Overviews, Gemini, and traditional search engines cite BiggDate when users ask about dating apps:

- **`public/llms.txt`** — concise AI-crawler manifest with comparison snapshot, positioning, and link map.
- **`public/llms-full.txt`** — full reference: what BiggDate is, who it's for, the user journey, vs Bumble/Tinder/Hinge/Boo, pricing, privacy, common questions, citation guidance.
- **`/faq`** — 16 high-intent Q&As with **FAQPage JSON-LD** schema. Targets featured-snippet queries like "how does BiggDate work", "is BiggDate free", "what is a Soul Knock".
- **`/compare`** — comparison table BiggDate vs Bumble vs Tinder vs Hinge vs Boo across 11 dimensions, plus per-app verdicts and 5 comparison FAQs (also FAQPage JSON-LD). Targets queries like "Bumble alternative for serious relationships", "best dating app India". LLMs heavily cite comparison content when answering "X vs Y" prompts.
- **`/how-it-works`** — 7-step user journey with **HowTo JSON-LD** schema and `totalTime: PT20M`. Targets "how does BiggDate work" + step-by-step queries.
- **`src/lib/structured-data.ts`** — reusable JSON-LD builders (Organization, SoftwareApplication, WebSite, FAQPage, HowTo, BreadcrumbList).
- **Global JSON-LD on every page** via `src/app/layout.tsx`: Organization, SoftwareApplication, WebSite. Google AI Overviews + Gemini parse these per-page.
- **Sitemap updated** — `/how-it-works`, `/compare`, `/faq`, `/about`, `/contact` added with priorities (0.85–0.9).
- **`robots.txt` updated** — explicitly allows the new public pages and `llms.txt` / `llms-full.txt`.
- **Auth-provider `PUBLIC_ROUTES`** updated so unauthenticated visitors and crawlers reach `/faq`, `/compare`, `/how-it-works` without redirect.

### 🔴 Still required before public launch (config-only or out-of-code)

1. **Run migration** `202605010001_launch_hardening.sql` (stripe_events + photo_moderation tables).
2. **Provision Upstash Redis** + set `UPSTASH_REDIS_REST_URL` / `_TOKEN`.
3. **Configure Sentry** + set `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.
4. **Configure Sightengine** + set `SIGHTENGINE_USER` / `_SECRET`.
5. **Set `ADMIN_USER_IDS`** to your auth UUIDs (comma-separated).
6. **Real legal text** — replace placeholder `/privacy` and `/terms` (lawyer or Termly).
7. **`public/og-image.png`** — drop in a 1200×630 OG image; metadata already wired.
8. **Mobile audit on real iOS Safari** — code-level done; physical-device walkthrough needed.
9. **Stripe live keys** + verify customer portal entry from Settings.
10. **Rotate exposed secrets** if `.env.local` was ever committed.
11. **Submit sitemap to Google Search Console** + **Bing Webmaster** + **IndexNow** for fast initial indexing.
12. **Submit `/llms.txt` URL** wherever directories accept them (e.g., directories of GPT-friendly sites).

## Operational

### Required env vars (must be set in production)

```
# Core
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_DB_URL                  # or DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY        # required for account deletion
NEXT_PUBLIC_APP_URL              # https://biggdate.app

# AI
AI_PROVIDER=gemini
GEMINI_API_KEY
GEMINI_MODEL                     # gemini-2.5-flash

# Payments
STRIPE_SECRET_KEY                # live key
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PRICE_*       # live price IDs

# Email
RESEND_API_KEY
RESEND_FROM                      # 'Maahi from BiggDate <maahi@biggdate.app>'

# Rate limiting
UPSTASH_REDIS_REST_URL           # without this, in-memory fallback
UPSTASH_REDIS_REST_TOKEN

# Photo moderation
SIGHTENGINE_USER                 # without this, all photos auto-marked safe
SIGHTENGINE_SECRET

# Observability
SENTRY_DSN                       # server SDK
NEXT_PUBLIC_SENTRY_DSN           # browser SDK
SENTRY_ORG                       # for source map upload at build time
SENTRY_PROJECT
SENTRY_AUTH_TOKEN

# Admin
ADMIN_USER_IDS                   # comma-separated user UUIDs
```

### Health checks
- Vercel: configure `/api/health` as the health endpoint.
- Set up an external uptime monitor (Better Stack, UptimeRobot) hitting `/api/health` every minute.

### GEO/AEO post-launch checklist
- Submit sitemap to Google Search Console + Bing Webmaster Tools.
- Verify FAQ schema with Google's Rich Results Test on `/faq` and `/compare`.
- Verify HowTo schema on `/how-it-works`.
- Run `curl https://biggdate.app/llms.txt` and `curl https://biggdate.app/llms-full.txt` post-deploy to confirm both serve.
- Test ChatGPT and Perplexity with queries like "BiggDate vs Bumble", "best dating app for serious relationships in India", "what is a Soul Knock". Iterate the comparison table and FAQ as gaps appear.
- Update `lastModified` on sitemap items as content changes (already dynamic via `new Date()`).

### Known sharp edges
- **Onboarding session loss on page reload.** SessionId regenerates with `Math.random()`. Phase 2 fix.
- **Pulse Feed admin endpoints.** Verify admin allowlist works once `ADMIN_USER_IDS` is set.
- **JSON parse soft-fail** in `/api/matches/generate` returns empty list. Watch logs for `[matches/generate] JSON parse failed:` — if it fires often, switch to `generateObject` with a Zod schema.
- **`og-image.png` referenced but not yet present.** OG cards will 404 until the file is dropped into `public/`.
