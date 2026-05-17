# BiggDate — Investor Due Diligence & Product Documentation

Version: 1.0.0
Date: 2026-05-03
Status: Active
Audience: Prospective investors, advisors, strategic partners
Confidentiality: Confidential — share under NDA

---

## Table of Contents

1. Executive Summary
2. Company & Product Overview
3. Problem & Market
4. Solution & Product Pillars
5. Detailed Feature Documentation
6. User Journeys
7. Plans, Pricing & Monetization
8. Technical Architecture
9. Data Model
10. API Surface
11. Trust, Safety & Moderation
12. Compliance, Privacy & Security
13. Observability & Reliability
14. Brand & Positioning
15. Go-to-Market & Distribution
16. Operating Status & Traction
17. Roadmap & 90-Day Plan
18. Risks & Mitigations
19. Team, Governance & Use of Funds
20. Appendix — Environment, Integrations, References

---

## 1. Executive Summary

BiggDate is an AI-assisted dating product built for **intentional relationships**, not swipe volume. The product collects rich, structured user context, generates high-signal matches, runs an intent-first intro mechanism (**Soul Knock**), and supports the relationship lifecycle from profile depth to post-date debrief — backed by an AI Companion (**Maahi**) and AI Coach.

- **Public tagline:** *See your future, not just a profile.*
- **Working mantra:** *Dating that respects your time.*
- **Category:** Relationship-intelligence dating platform.
- **Initial market:** India (Ahmedabad-anchored, India DPDP context). Designed for global English-speaking expansion.
- **Current stage:** MVP feature-complete; open beta with **40 active web users** (founder-onboarded via WhatsApp); native iOS + Android in QA.
- **Billing mode:** **Early Access** is the active mode — Premium unlocked via founder-issued redemption codes at `/settings/billing`. Stripe paths remain in the tree, dormant, and re-activate via `BILLING_MODE=stripe`.
- **Plans:** Free / Premium ($19.99/mo or $54.99/quarter equivalent) / Pro (monthly + quarterly priced — TBD public), with à la carte add-ons (Boost, Life Preview, Super Like, Read Receipts, Incognito, Profile Review, Spotlight) — all seven now have live Stripe price IDs. 7-day free trial on Premium when Stripe mode is active.
- **90-day target:** 1,000 real users, 15% paid conversion, $1,500+ MRR, 70% D7 retention.
- **Tech:** Next.js 16 App Router (proxy boundary in `src/proxy.ts`), React 19, TypeScript strict, Supabase (Auth/Postgres/Storage), Stripe (dual-mode), Resend, Upstash Redis, Sentry, Sightengine, PostHog (consent-gated), Meta Pixel (consent-gated), web-push + VAPID, Gemini (default) + OpenAI fallback via `src/lib/ai.ts` abstraction. Ollama paths were removed.
- **Differentiator:** Structured onboarding + Soul Knock + Life Preview + Maahi companion form a relationship-quality moat that volume-swipe apps cannot easily replicate.

---

## 2. Company & Product Overview

### 2.1 Company snapshot

| Item | Value |
|---|---|
| Product name | BiggDate |
| Domain | biggdate.app |
| Headquarters / jurisdiction | Ahmedabad, India |
| Stage | Pre-launch (private beta) |
| Target launch | Q2 2026 |
| Funding sought | Seed |
| Burn profile | Lean — solo/founder-led engineering |

### 2.2 Product summary

BiggDate is a relationship-first dating product. Where mainstream dating apps optimize for engagement loops (swipe volume, infinite feed, ad-friendly retention), BiggDate optimizes for **relationship outcomes** — fewer dead-end chats, better pre-date signal, higher trust, and a guided path from profile depth to first date and beyond.

Public domain pages already shipped:
- [/](src/app/page.tsx) — marketing home.
- [/how-it-works](src/app/how-it-works/page.tsx) — 7-step user journey with HowTo JSON-LD.
- [/compare](src/app/compare/page.tsx) — BiggDate vs Bumble / Tinder / Hinge / Boo across 11 dimensions.
- [/faq](src/app/faq/page.tsx) — 16 high-intent Q&As with FAQPage JSON-LD.
- [/about](src/app/about/page.tsx), [/contact](src/app/contact/page.tsx).
- [/privacy](src/app/privacy/page.tsx), [/terms](src/app/terms/page.tsx) (placeholder text — final legal review pending).
- [/glossary](src/app/glossary/page.tsx), [/vs](src/app/vs/page.tsx).

---

## 3. Problem & Market

### 3.1 Problem statement

Most dating products optimize for **engagement**, not **outcomes**. Users face:

- Low-signal profiles (photos + a one-line bio).
- Misaligned intent (casual vs serious users on the same surface).
- Shallow conversation starters ("hey").
- Weak post-match progression (matches go cold within hours).

The result is dating fatigue — users churn between apps, lose calendar time, and lose emotional bandwidth without progressing toward real relationships.

### 3.2 Target segments

**Primary segment.** Founders, operators, and ambitious professionals who are emotionally serious but allergic to performative dating behavior. They are time-poor and signal-hungry.

**Secondary segments.**
- Growth-minded daters who value structured reflection and coaching.
- Users in culturally nuanced dating contexts (e.g. Indian metro markets) where values alignment and family context matter.
- Community contributors using Pulse for lightweight social signal.

### 3.3 Market posture

The internal launch reboot ([BIGGDATE_REBOOT.md](BIGGDATE_REBOOT.md)) explicitly rejects inflated TAM claims. The team's working principle is to validate retention and willingness-to-pay on a small real-user cohort before quoting market sizes. This document follows the same discipline.

What we will assert:
- Premium dating subscriptions are a proven category (Match Group, Bumble Inc.) with double-digit ARPU.
- The intentional/serious-relationship segment is consistently under-served by swipe-led incumbents.
- India is a large, English-fluent, smartphone-saturated dating market with low penetration in the *intentional* subcategory specifically.

---

## 4. Solution & Product Pillars

BiggDate is built on five product pillars:

1. **Self-understanding first.** Conversational AI onboarding produces deep profile context. Ongoing reflection through Companion and Debrief keeps the model of the user fresh.
2. **High-signal matching.** Match cards lead with narrative context, compatibility signals, and friction points — not just photo + age.
3. **Intentional connection.** The **Soul Knock** intro mechanism gates chat behind a low-cost, high-intent question. Mutual intros unlock a thread; photos may unlock progressively.
4. **Safety and trust.** Reporting, blocking, verification, and photo moderation are first-class flows with admin-side queues.
5. **Sustainable monetization.** Plan-based limits and one-time boost add-ons monetize the *high-leverage* moments (gated actions, premium reflection tools), not attention.

---

## 5. Detailed Feature Documentation

This section covers every shipped feature domain with capability, surface area, plan gating, and operational notes.

### 5.1 Authentication & Identity

**Surfaces.** [/auth/login](src/app/auth/), [/auth/signup](src/app/auth/), forgot/reset-password flows, account deletion in settings.

**Capabilities.**
- Email + password auth via Supabase.
- Email verification.
- 18+ age gate plus Terms / Privacy consent at signup (submit gated on the checkbox).
- Forgot-password and reset-password flows.
- Self-serve account deletion via Supabase admin (`SUPABASE_SERVICE_ROLE_KEY`).
- Auth-provider redirect logic that routes partial-profile users back to onboarding instead of a broken dashboard.

**Reliability controls.**
- Rate limits: login 5/min/IP, signup 3/hour/IP, forgot-password 3/10min/IP. Upstash Redis when configured; in-memory sliding-window fallback for dev.
- Welcome email fires only on confirmed signup, not on password recovery.

### 5.2 Onboarding & Profile Derivation

**Surfaces.** [/onboarding](src/app/onboarding/), [/questions](src/app/questions/), [/soul-card](src/app/soul-card/), [/soul-snapshot](src/app/soul-snapshot/).

**Capabilities.**
- Two-phase AI-driven onboarding chat.
- Phase 1 derive endpoint extracts baseline profile structure (identity, goals, basics).
- Phase 2 derive endpoint enriches values, lifestyle, family/cultural vectors, attachment, growth areas.
- AI-generated profile suggestions the user reviews and edits before saving.
- Profile is considered "complete" when the user has accepted 18+ + Terms/Privacy, finished Phase 1 + Phase 2, saved core fields, and has at least one **approved** profile photo.

**User value.**
- Less form fatigue versus 30-field profile builders.
- Higher fidelity self-representation — better match input.

### 5.3 Profile System

**Surface.** [/profile](src/app/profile/) and the in-app profile editor.

**Profile depth (model).**
- **Identity:** name, age, city, gender, orientation, pronouns.
- **Life context:** work, education, hometown, relocation, residency.
- **Relationship intent and style:** intent, relationship style, timeline.
- **Lifestyle vectors:** sleep, social battery, diet, travel, cleanliness.
- **Family / culture vectors:** family involvement, cultural alignment, marriage type.
- **Psychological vectors:** attachment, readiness, growth areas, strengths.
- **Compatibility vectors:** offers, needs, turn-ons / turn-offs, attraction preferences.
- **Visibility controls and photos.**

**Photos.**
- Client-side compression before upload ([src/lib/photo-compress.ts](src/lib/photo-compress.ts)) — 5–20× reduction on typical phone photos.
- Sightengine moderation; flagged photos return 422 so the client never commits the URL.
- Every verdict logged to `photo_moderation` table for audit.
- **Fail-closed** behavior on infra errors (commit `770934e`): when Sightengine is unreachable or flags NSFW signals, the upload is blocked rather than auto-approved. Trust posture is preferred over upload latency on outage.

### 5.4 Matching & Soul Knock Intros

**Surfaces.** [/matches](src/app/matches/), [/matches/[id]/preview](src/app/matches/), and the intros surface.

**Match generation.**
- AI-generated daily matches with narrative compatibility framing (not just photo + bio).
- Plan-gated by `daily_matches` (Free 5 / Premium 20 / Pro unlimited).
- Match cache invalidates on block/report so users do not re-encounter unsafe actors.

**Soul Knock intro flow.**
1. User views match preview with compatibility signals + friction points.
2. User sends a Soul Knock — a structured, intent-forward intro (not a swipe).
3. Recipient answers the Soul Knock (accept / decline / pass).
4. Mutual response opens a Thread.
5. Photos may unlock progressively after mutual intent.

**Plan gating on intros.**
- `soul_knock`: Free 3 / Premium 15 / Pro unlimited (daily window).

### 5.5 Messaging

**Surface.** [/messages](src/app/messages/), [/messages/[threadId]](src/app/messages/).

**Capabilities.**
- Thread list and thread detail.
- Read tracking — opening a thread marks unread messages read.
- Posting appends to thread.
- Icebreaker suggestions on demand.

**Operational note.** Message refresh is currently polling-based, not WebSocket realtime. Realtime is a planned mid-term upgrade.

### 5.6 AI Companion & Coach (Maahi)

**Surfaces.** [/companion](src/app/companion/), [/coach](src/app/coach/), and the public Maahi landing experience.

**Companion (Maahi).**
- Conversational companion that helps users reflect, journal, and prepare for dating decisions.
- **Memory extraction:** every session updates a persisted emotional / session memory profile so the companion stays useful over time.
- **Daily companion guidance** as a lightweight daily nudge.
- Plan gate: `maahi_session` (Free 3 / Premium 15 / Pro unlimited, weekly window).

**Coach.**
- Coach chat plus generated coaching plans (multi-step plans the user works through).
- Targets profile, messaging, date prep, and reflection improvements.

### 5.7 Life Preview

**What it is.** An AI simulation that previews what dating or partnering this person could realistically look like — a high-leverage decision tool *before* clearing your calendar for a first date.

**Plan gate.** `life_preview` (Free 0 / Premium 2 / Pro unlimited, monthly window).

**Add-ons.**
- $2.99 single Life Preview.
- $5.99 three-pack Life Preview.

### 5.8 Dates — Concierge & Debrief

**Surface.** [/debrief](src/app/debrief/) plus in-app date flows.

**Date concierge.** Plan a date — venue framing, conversation cues, logistics.

**Date debrief.** A structured 3-prompt post-date reflection. Stored insights flow back into the user's matching context and companion memory, which means the *next* match cycle is informed by what worked or didn't.

### 5.9 Pulse — Anonymous Community Feed

**Surface.** [/pulse](src/app/pulse/).

**Capabilities.**
- Daily admin-curated prompts.
- Anonymous prompt-response posting.
- Reactions, replies, and user flagging.
- Cursor-paginated feed.
- Admin moderation surface — auto-hide on repeated flags or explicit admin action.

**Why Pulse exists.** A lightweight social signal layer that engages users between match cycles without devolving into a generic social feed. Posting is currently restricted to `prompt_response` type by design.

### 5.10 Trust, Safety & Verification

**Surfaces.** [/report](src/app/report/), [/profile/verify](src/app/profile/), and embedded safety actions on every profile / message surface.

**Reporting & blocking.**
- Report a user from any profile or thread surface.
- Block enforces bidirectional separation (UNION query) and invalidates match cache.
- Reports enter admin review: severe reports get **same-day** review; standard reports target **one business day**.

**Verification.**
- LinkedIn URL submission + selfie artifact.
- Admin reviews in pending queue.
- Approval drives a verified badge.

### 5.11 Billing

**Surfaces.** Settings → Billing, [/api/billing/*](src/app/api/billing/).

**Endpoints.**
- `POST /api/billing/checkout` — Stripe Checkout (subscription + one-time modes).
- `POST /api/billing/webhook` — handles `checkout.session.completed`, `customer.subscription.{created,updated,deleted}`. Idempotency via `stripe_events` ledger.
- `POST /api/billing/portal` — Stripe Customer Portal entry.
- `GET /api/billing/status` — returns `{ isPremium, plan, status }`.

**Components.**
- [src/components/settings-drawer.tsx](src/components/settings-drawer.tsx) — Account / Notifications / Discovery / Privacy & Safety / Billing / Danger Zone.
- [src/components/upgrade-sheet.tsx](src/components/upgrade-sheet.tsx) — monthly/annual toggle, 7-day free trial, feature list, à la carte boosts.

### 5.12 Admin & Moderation Operations

**Surfaces.** [/admin/*](src/app/admin/) — gated by `ADMIN_USER_IDS` allowlist.

**Capabilities.**
- Photo moderation queue with approve / reject.
- Pulse post moderation (set `isHidden`).
- Verification queue with approve / reject.
- Admin actions are logged for audit.

**Ownership.**
- Founder/operator owns daily user-abuse review and support responses.
- CTO/founding engineer owns provider failures, security incidents, admin tooling, and data access issues.

### 5.13 Notifications & Email

**Wired email events** (via Resend, fire-and-forget through [src/lib/notifications.ts](src/lib/notifications.ts)):
- `welcome` — on confirmed signup.
- `match_ready` — after successful match generation.
- `soul_knock_received` — to recipient on intro request.
- `soul_knock_answered` — to sender on response.
- `mutual_match` — on mutual acceptance.

Templates live in [docs/email-templates](docs/email-templates).

### 5.14 GEO / AEO (Answer Engine Optimization)

Shipped to make ChatGPT, Perplexity, Google AI Overviews, and Gemini cite BiggDate when users ask about dating apps:
- [public/llms.txt](public/llms.txt) and [public/llms-full.txt](public/llms-full.txt).
- FAQPage JSON-LD on `/faq` and `/compare` (5 comparison FAQs).
- HowTo JSON-LD with `totalTime: PT20M` on `/how-it-works`.
- Global Organization / SoftwareApplication / WebSite JSON-LD on every page via [src/app/layout.tsx](src/app/layout.tsx).
- Sitemap at [src/app/sitemap.ts](src/app/sitemap.ts) with priorities (0.85–0.9 for new public pages).
- [public/robots.txt](public/robots.txt) explicitly allows new public pages and `llms.txt`.

---

## 6. User Journeys

### Journey A — Signup to First Match
Signup → onboarding chat → Phase 1 derive → Phase 2 derive → first photo approved → dashboard → first daily matches.

### Journey B — Match to Conversation
Match preview → Soul Knock sent → recipient answers → mutual → Thread created → first message within 24 hours.

### Journey C — Date Reflection Loop
Date completed → debrief opened → 3 structured prompts → reflection stored → next match cycle informed by reflection.

### Journey D — Companion Session
Companion opened → chat → plan gate check → session memory extracted and persisted.

### Journey E — Coach Plan
Coach surface → user asks for plan → plan generated → follow-up engagement in profile/match actions.

### Journey F — Pulse Participation
Pulse feed → today's prompt fetched → user posts response → others react / reply → optional flagging.

### Journey G — Report & Block
Concerning behavior → report → block applied → match cache invalidated → admin review.

### Journey H — Verification
LinkedIn URL + selfie → admin queue → approval → verified badge.

### Journey I — Upgrade Conversion
Plan gate hit → upgrade sheet → Stripe Checkout → webhook updates plan → feature access expands.

---

## 7. Plans, Pricing & Monetization

### 7.1 Plans

| Plan | Price | Positioning |
|---|---|---|
| Free | $0 | Core profile, limited discovery, limited Soul Knocks, messaging after accepted intros |
| **Premium** | **$19.99 / mo** or **$149.99 / yr** ($12.49/mo equivalent) | Higher discovery + Soul Knock limits, Life Preview credits, full relationship tools |
| Pro | TBD (highest tier) | Highest limits and advanced tools for heavy users |

A **7-day free trial** is offered on Premium.

### 7.2 Plan limits (gated actions)

| Action | Free | Premium | Pro | Window |
|---|---|---|---|---|
| `soul_knock` | 3 | 15 | unlimited | daily |
| `daily_matches` | 5 | 20 | unlimited | daily |
| `maahi_session` | 3 | 15 | unlimited | weekly |
| `life_preview` | 0 | 2 | unlimited | monthly |

Limits are enforced server-side via `requirePlan` + `incrementUsage` (see [src/lib/repo.ts](src/lib/repo.ts)).

### 7.3 À la carte add-ons

| Add-on | Price | Mechanic |
|---|---|---|
| Boost | $4.99 | Time-boxed visibility lift |
| Life Preview (single) | $2.99 | One Life Preview credit |
| Life Preview (3-pack) | $5.99 | Three Life Preview credits |
| Super Like | TBD | Pre-purchased high-intent intro |
| Read Receipts | TBD | Visibility toggle |
| Incognito | TBD | Privacy toggle |
| Profile Review | TBD | AI / human review |
| Spotlight | TBD | Premium discovery placement |

Stripe price IDs are environment-driven: `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`, `_ANNUAL`, `_BOOST`, `_LIFE_PREVIEW`, `_LIFE_PREVIEW_3`.

### 7.4 Revenue model summary

- **Subscription ARPU anchor:** $19.99/mo (or $149.99/yr).
- **Trial → paid funnel:** 7-day free trial as the default path; gated-action upgrade prompts as the in-app conversion driver.
- **Add-on revenue:** one-time boosts capture intent at high-leverage moments (a strong match, a key date) without raising base price.
- **Unit economics levers:** AI cost reduction (caching + cheaper providers), mobile-driven retention, and acquisition channel concentration.

### 7.5 Success metrics

| Layer | Metric |
|---|---|
| Acquisition | Signup conversion, onboarding completion |
| Activation | Time to first match, intro request rate |
| Engagement | Intro response rate, mutual thread rate, message depth |
| Outcome | Debrief completion, repeat match cycles |
| Monetization | Upgrade conversion from gated prompts, trial → paid |
| Trust | Reports / active user, verification adoption, moderation latency |

---

## 8. Technical Architecture

### 8.1 Stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript strict.
- **Styling:** Tailwind CSS 4, shadcn/ui, framer-motion, base-ui/react.
- **Auth + DB:** Supabase Auth + Postgres + Storage; direct `pg` for server-side data access.
- **Payments:** Stripe (Checkout + Customer Portal + Webhooks).
- **AI:** AI SDK v6 with Gemini (default — `gemini-2.5-flash`) and OpenAI as the premium / high-stakes fallback via [src/lib/ai.ts](src/lib/ai.ts) abstraction. Ollama and Ollama Cloud paths were removed (commit `244001b`) to reduce surface area pre-launch.
- **Email:** Resend (`maahi@biggdate.app` sender).
- **Rate limiting:** Upstash Redis with in-memory fallback for dev.
- **Photo moderation:** Sightengine.
- **Observability:** Sentry (server + browser via [instrumentation.ts](instrumentation.ts) and [instrumentation-client.ts](instrumentation-client.ts)) + Vercel Analytics.
- **Hosting:** Vercel (Fluid Compute).

### 8.2 Repository layout

- [src/app](src/app) — App Router routes and route handlers.
- [src/components](src/components) — shared UI and product components.
- [src/lib](src/lib) — repositories, providers, auth, billing, AI, moderation, logging, utilities.
- [src/proxy.ts](src/proxy.ts) — request proxy / auth boundary (Next 16 replaces middleware.ts with proxy.ts).
- [supabase/migrations](supabase/migrations) — database schema migrations (36 currently).
- [scripts](scripts) — repo and docs checks plus seed scripts.
- [docs](docs) — user, developer, product, brand, standards docs.

### 8.3 Build & quality gates

- `npm run lint` — ESLint.
- `npm run typecheck` — TypeScript strict.
- `npm run repo:check` — repo structure validation.
- `npm run docs:check` — required docs and link validation.
- `npm run check` — all of the above.
- `npm run ci` — checks plus production build.

### 8.4 Security headers

CSP and HSTS configured in [next.config.ts](next.config.ts). HSTS is 2-year with `includeSubDomains; preload`.

---

## 9. Data Model

### 9.1 Core entities

- **AccountHandle** — user identity projection (email, username, full name).
- **Profile** — primary relationship and compatibility model.
- **Match** — generated candidate payload with narrative + compatibility signals.
- **Intro** + **SoulKnockResponse** — pre-chat intent exchange.
- **Thread** + **Message** — post-mutual communication.
- **SessionMemory** — Maahi memory state and emotional profile.
- **DebriefReflection** — structured post-date reflection.
- **UserPlan** + **UsageCounter** — billing state and access control.
- **PulsePrompt**, **PulsePost**, **PulseReply**, **PulseReaction**, **PulseFlag**.
- **Safety / moderation:** reports, blocked_users, photo_moderation.
- **StripeEvents** — webhook idempotency ledger.

### 9.2 Relationship map

- User 1:1 Profile, 1:1 AccountHandle, 1:1 UserPlan.
- User 1:many Match (time-scoped cache + persistence).
- User 1:many Intro (sender) and Intro (receiver).
- Intro 1:many SoulKnockResponse.
- Mutual Intro pair → 1 Thread → 1:many Message.
- User 1:many DebriefReflection, 1:many UsageCounter.
- User 1:many PulsePost / PulseReply.
- PulsePost 1:many PulseReply / PulseReaction / PulseFlag.

### 9.3 Migrations (chronological)

1. `202604110001_initial_schema.sql` — initial schema.
2. `202604120001_account_handles.sql` — account handle projection.
3. `202604120001a_profile_expansion.sql` — profile expansion.
4. `202604120002_maahi_memory_v3.sql` — companion memory.
5. `202604120003_profile_lifestyle_fields.sql` — lifestyle vectors.
6. `202604120004_profile_photo_storage.sql` — photo storage.
7. `202604120005_user_plans.sql` — plan / billing tables.
8. `202604120006_profile_enrichment_v2.sql` — Phase-2 enrichment.
9. `202604140001_launch_ready.sql` — launch readiness migration.
10. `202604160001_pulse_feed.sql` — Pulse community.
11. `202605010001_launch_hardening.sql` — `stripe_events` + `photo_moderation` tables.
12. `202605020001_rls_hardening.sql` — Row-Level Security hardening.

---

## 10. API Surface

The product exposes **78 route handlers** across these domains. Full endpoint list in [docs/product/api-reference.md](docs/product/api-reference.md).

### 10.1 Health
- `GET /api/health` — DB-checking health endpoint (200 with `{status, checks: {db}}`, 503 if DB unreachable). Wired for Vercel and external uptime monitors.

### 10.2 Auth
`POST /api/auth/{signup,login,logout,forgot-password,reset-password}`, `GET /api/auth/me`, `DELETE /api/auth/delete`. Rate-limited.

### 10.3 Profile
`GET/PATCH /api/profile`, `POST /api/profile/derive`, `POST /api/profile/photo-moderate`, `POST /api/profile/upload-photo`.

### 10.4 Matches & Intros
- Matches: `GET /api/matches`, `POST /api/matches/generate`, `POST /api/matches/briefing`.
- Intros: `GET /api/intros`, `POST /api/intros/{request,respond,pass,icebreakers}`, `GET /api/intros/received`.

### 10.5 Messaging
`GET /api/messages`, `GET/POST /api/messages/[threadId]`.

### 10.6 AI surfaces
- Companion: `POST /api/companion/{chat,daily,memory}`.
- Coach: `POST /api/coach/{chat,plan}`.
- Other: `POST /api/{chat,maahi,life-preview,dates/concierge,dates/debrief,debrief/structured,growth/reflect}`.

### 10.7 Pulse
`GET /api/pulse/prompts/today`, `POST /api/pulse/prompts` (admin), `GET/POST /api/pulse/posts`, `POST /api/pulse/posts/[id]/{react,replies,flag}`, `GET /api/pulse/posts/[id]/replies`.

### 10.8 Safety & verification
`POST /api/safety/{block,report}`, `GET /api/verification/status`, `POST /api/verification/{linkedin,selfie}`.

### 10.9 Billing
`POST /api/billing/{checkout,portal,webhook}`, `GET /api/billing/status`.

### 10.10 Admin
`GET/POST /api/admin/photo-moderation`, `GET /api/admin/pulse/posts`, `PATCH /api/admin/pulse/posts/[id]`, `GET /api/admin/verification`, `POST /api/admin/verification/[userId]`.

### 10.11 Authorization pattern
- Most non-public routes go through `requireAuth` ([src/lib/require-auth.ts](src/lib/require-auth.ts)).
- Plan-gated routes call `requirePlan` and `incrementUsage`.
- Admin routes enforce explicit `ADMIN_USER_IDS` allowlist.

---

## 11. Trust, Safety & Moderation

### 11.1 Photo moderation
- Sightengine integration in [src/lib/photo-moderation.ts](src/lib/photo-moderation.ts).
- Every verdict recorded to `photo_moderation` (status, provider, scores, reason).
- Flagged uploads return 422 — the client never commits the URL.
- **Fail-closed** behavior on infra errors and NSFW signals (commit `770934e`) — uploads are blocked rather than auto-approved.
- Admin moderation queue at `/admin/photo-moderation`.

### 11.2 Reporting & blocking
- Bidirectional block enforced via UNION query.
- Reports enter admin review with documented SLAs (severe same-day, standard one business day).
- Match cache invalidates on block / report.

### 11.3 Pulse moderation
- User flags create moderation signals.
- Auto-hide on repeated flags.
- Admin can set `isHidden` explicitly.

### 11.4 Verification
- LinkedIn URL + selfie submission.
- Admin queue with approve / reject.
- Verified badge on profile after approval.

### 11.5 Empty-state copy (final)
- Discovery: *"No matches yet. Finish your profile and check back after the next match refresh."*
- Intros: *"No pending intros. Send a Soul Knock when a match feels worth exploring."*
- Messages: *"No messages yet. Accepted intros will appear here."*
- Pulse: *"No posts yet. Start a thoughtful prompt for the community."*
- Billing: *"No active plan. Choose Premium or Pro when you are ready to unlock more."*

---

## 12. Compliance, Privacy & Security

### 12.1 Eligibility
- 18+ only. Signup blocked unless the user confirms eligibility and accepts Terms + Privacy.

### 12.2 Privacy / Terms
- `/privacy` and `/terms` ship today with placeholder text covering India DPDP, Ahmedabad jurisdiction, and 18+ eligibility. **Final legal review pending** (lawyer or Termly) — flagged as a launch blocker.
- Privacy must cover: Supabase auth/profile/photos/messages, AI provider processing, Stripe billing, Resend email, Upstash rate limiting, Sentry/Vercel Analytics, Sightengine moderation, admin review, deletion/export, and India DPDP.

### 12.3 Deletion & export
- Account deletion is **permanent** and self-serve where exposed in settings (uses `SUPABASE_SERVICE_ROLE_KEY`).
- Data export is support-assisted until self-serve export ships; target response within **7 calendar days**.

### 12.4 Rate-limiting baselines
- `/api/auth/login`: 5 / min / IP.
- `/api/auth/signup`: 3 / hour / IP.
- `/api/auth/forgot-password`: 3 / 10min / IP.
Tune post-launch using abuse rate, support tickets, signup conversion.

### 12.5 Secret rotation
- **Owner:** CTO / founding engineer.
- **Cadence:** quarterly, plus immediate rotation after suspected exposure, vendor change, team access change, or production incident.
- **Scope:** Vercel env vars, Supabase anon/service/database credentials, Stripe keys/webhooks, Resend, Sentry, Upstash, Sightengine, AI provider keys.

### 12.6 Application security
- CSP and HSTS configured in [next.config.ts](next.config.ts).
- 2-year HSTS with `includeSubDomains; preload`.
- Stripe webhook idempotency via `stripe_events` ledger ([src/lib/stripe.ts](src/lib/stripe.ts) + handler).
- RLS hardening via `202605020001_rls_hardening.sql`.

### 12.7 Compliance posture
- Designed against India DPDP context (jurisdiction Ahmedabad).
- Architecture is portable to other regulatory regimes with localized policy text.

---

## 13. Observability & Reliability

### 13.1 Logging
- [src/lib/log.ts](src/lib/log.ts) — JSON-line structured logger.
- `log.error` forwards to Sentry when DSN is configured.

### 13.2 Sentry
- Server SDK via [instrumentation.ts](instrumentation.ts).
- Browser SDK via [instrumentation-client.ts](instrumentation-client.ts).
- `next.config.ts` wraps with `withSentryConfig` for source-map upload at build time.
- Required env: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

### 13.3 Health
- `/api/health` returns 200 with DB check, 503 if DB unreachable. Wired for Vercel and external uptime monitors (Better Stack, UptimeRobot recommended).

### 13.4 AI failure modes
- AI provider abstraction supports Gemini (default) and OpenAI fallback. Ollama paths were removed.
- Match generation has a soft-fail JSON parse path returning empty list — watched via logs (`[matches/generate] JSON parse failed:`).
- Companion / coach / life-preview routes are plan-gated to bound cost.

### 13.5 Stripe failure modes
- `stripe_events` table records every event id before downstream handling.
- Failures surface via `log.error` → Sentry.
- Mitigation backlog includes explicit dead-letter / recovery flow for Stripe handler failures.

### 13.6 Performance
- Loading skeletons on `/profile`, `/companion`, `/messages`.
- Photo upload compression cuts typical phone photos 5-20× before upload + moderation.
- Mobile polish on profile page (avatar 96→80px on xs, name heading 2rem→1.6rem on xs).
- Vercel Fluid Compute reduces cold starts.

---

## 14. Brand & Positioning

(Source of truth: [docs/brand/brand-book-handbook.md](docs/brand/brand-book-handbook.md).)

### 14.1 North star
BiggDate exists to **replace low-signal dating chaos with high-signal relationship clarity**.

### 14.2 Positioning statement
> For busy, thoughtful people tired of low-signal dating loops, BiggDate is the dating product that combines deep profile context, intentional matching, and guided relationship clarity so every interaction has a better chance of becoming real.

### 14.3 Personality
Sharp, warm, confident, unapologetically honest, high-standard. **Voice archetype:** the brutally caring strategist.

### 14.4 Tone sliders
Boldness 7/10, Warmth 7/10, Formality 3/10, Humor 4/10.

### 14.5 Messaging pillars
1. **Time is a relationship asset.**
2. **Context beats chemistry theater.**
3. **Clarity is kinder.**
4. **Dating with standards is not being difficult.**

### 14.6 Lexicon
- **Owns:** high-signal dating, relationship clarity, intentional matching, dating intel, Soul Knock, compatibility signals, calendar debt, real-life fit.
- **Avoids:** perfect match, soulmate guarantee, effortless love hacks, viral dating tricks, manipulation language.

### 14.7 Visual identity
Cinematic, premium, emotionally charged. Dark-forward gradients with magenta + electric blue accents; high-contrast surfaces with controlled glow; rounded geometry and layered glass-like treatments.

---

## 15. Go-to-Market & Distribution

### 15.1 Acquisition channels (planned)
- LinkedIn posts — founder networks (primary signal-to-cost channel for the target segment).
- Reddit — r/india, r/IndianStreetBets, dating-adjacent subs.
- Twitter/X — startup and founder communities.
- Personal-network email outreach.

### 15.2 GEO/AEO foundation (already shipped)
The product is built so AI assistants and search engines surface BiggDate when users ask about dating apps:
- `llms.txt` and `llms-full.txt` for AI crawlers.
- `/faq` (16 high-intent Q&As, FAQPage JSON-LD).
- `/compare` (BiggDate vs Bumble / Tinder / Hinge / Boo across 11 dimensions, FAQPage JSON-LD).
- `/how-it-works` (HowTo JSON-LD, `totalTime: PT20M`).
- Global Organization / SoftwareApplication / WebSite JSON-LD on every page.
- Dynamic sitemap with priorities (0.85–0.9) for new public pages.

### 15.3 Post-launch GEO/AEO checklist
- Submit sitemap to Google Search Console + Bing Webmaster Tools + IndexNow.
- Verify FAQ schema with Google's Rich Results Test on `/faq` and `/compare`.
- Verify HowTo schema on `/how-it-works`.
- Curl-verify `llms.txt` and `llms-full.txt` post-deploy.
- Test ChatGPT and Perplexity with queries like *"BiggDate vs Bumble"*, *"best dating app for serious relationships in India"*, *"what is a Soul Knock"*. Iterate the comparison table and FAQ as gaps appear.

---

## 16. Operating Status & Traction

### 16.1 Today (2026-05-03)
- **40 active web beta users** (founder-onboarded via WhatsApp). Native iOS + Android in QA. The team is explicitly **not** quoting waitlist numbers it cannot back up.
- MVP feature-complete across onboarding, profile, matching, intros (Soul Knock + quality scoring), messaging (with voice notes + DM moderation + date proposals), companion (Maahi 16 modes), coach, Life Preview, debrief, Pulse, verification, safety, billing (Early Access + Stripe), commitment tracking, push notifications, admin dashboard.
- Public marketing pages live: home, /how-it-works, /compare, /faq, /about, /contact, /privacy, /terms, /glossary, /vs, /simulation, /community-guidelines, /scam-warning, /cookies, /imprint, /region-blocked.
- **36 database migrations** applied locally; production migration apply tracked in `launch-readiness.md`.

### 16.2 Launch readiness — Wave 1 complete
- ✅ Auth-provider redirect fix for partial-profile users.
- ✅ `/api/health`, `/privacy`, `/terms` pages.
- ✅ 18+ age gate + Terms/Privacy consent on signup.
- ✅ Welcome + match_ready emails wired.
- ✅ Stripe webhook idempotency via `stripe_events`.
- ✅ Auth rate limiting (Upstash Redis, in-memory fallback).
- ✅ Sentry SDK installed.
- ✅ Photo moderation pipeline + admin queue UI.
- ✅ CSP + HSTS, robots.txt, sitemap, OG/Twitter card metadata.
- ✅ Photo upload compression.
- ✅ Loading skeletons.
- ✅ All five email events confirmed wired.
- ✅ Full GEO/AEO surface (llms.txt, FAQ schema, HowTo schema, comparison page, JSON-LD).

### 16.3 Outstanding pre-launch blockers
1. Run migration `202605010001_launch_hardening.sql` in production.
2. Provision Upstash Redis + set env keys.
3. Configure Sentry org/project/auth token + set DSNs.
4. Configure Sightengine credentials.
5. Set `ADMIN_USER_IDS`.
6. Replace placeholder `/privacy` and `/terms` with real legal text (lawyer or Termly).
7. Drop `public/og-image.png` (1200×630).
8. Mobile audit on real iOS Safari device.
9. Stripe live keys + verify customer portal entry from Settings.
10. Rotate exposed secrets if `.env.local` was ever committed.
11. Submit sitemap to Google Search Console + Bing + IndexNow.
12. Submit `/llms.txt` URL to LLM-friendly directories.

---

## 17. Roadmap & 90-Day Plan

(Source: [BIGGDATE_REBOOT.md](BIGGDATE_REBOOT.md).)

### 17.1 90-day mission

| Phase | Days | Target | Success metric |
|---|---|---|---|
| Get real users | 1–30 | 100 users | 50+ organic signups, 20+ matches |
| Validate PMF | 31–60 | 500 users | 15% paid conversion, 70% D7 retention |
| Technical de-risking | 61–90 | 1,000 users | Mobile app live, 80% AI cost reduction, mobile users >50% |

### 17.2 Weekly milestones

| Week | Users | Deliverable | Metric |
|---|---|---|---|
| 1 | 0 → 25 | Photo + messaging UI | 10 signups |
| 2 | 25 → 75 | Acquisition campaigns | 50 signups |
| 3 | 75 → 150 | Funnel optimization | 40% completion rate |
| 4 | 150 → 300 | PMF validation | 10 paying users |
| 5 | 300 → 500 | Channel scaling | $500 MRR |
| 6 | 500 → 750 | Mobile app beta | 50 mobile users |
| 7 | 750 → 1,000 | Cost optimization | 50% AI cost reduction |
| 8–12 | 1,000+ | Full product | Sustainable growth |

### 17.3 Mid-term technical roadmap

- Realtime transport for thread updates (replace polling).
- Reconcile notification preferences into a single source of truth.
- Expand route-level rate limiting to high-cost AI endpoints.
- Normalize selfie upload to object storage and persist pointer only.
- Align dual photo-moderation paths behind one shared service contract.
- Harden internal notifications endpoint with service token / signed internal calls.
- Add explicit dead-letter / recovery flow for Stripe handler failures.
- Mobile app (React Native or Flutter) — auth, matching, messaging.

### 17.4 Seed-round success criteria

By Month 3, the team aims to demonstrate:
- 1,000 real users.
- 15% paid conversion.
- $1,500+ MRR.
- 70% D7 retention.
- Working mobile app.
- Proven acquisition channels.
- Reduced AI dependency.

---

## 18. Risks & Mitigations

| # | Risk | Mitigation |
|---|---|---|
| 1 | Stripe webhook idempotency / ordering | Event id recorded before handler; documented dead-letter / recovery flow as next step |
| 2 | Verification selfie payload may be large URL/base64 | Move to object storage and persist pointer only |
| 3 | Internal notifications endpoint trust model | Add service token or signed internal calls |
| 4 | Notification preference UI/backend drift | Reconcile to single source of truth |
| 5 | Pulse scope mismatch (API restricts to prompt_response only) | Keep product copy aligned; expand carefully |
| 6 | Conversation freshness (polling not realtime) | Migrate to realtime subscriptions mid-term |
| 7 | Dual photo-moderation paths | Unify behind shared service contract |
| 8 | Heavy AI dependency / cost | Provider abstraction, caching, cheaper models, plan-gated cost ceiling |
| 9 | Empty match pool at low user counts | Plan-gated daily refresh + briefing copy + manual seeding |
| 10 | Legal / regulatory text not finalized | Lawyer or Termly review before public launch |
| 11 | Single founder / engineer key-person risk | Documented runbooks, repo standards, rotation cadence |
| 12 | Acquisition channel concentration | Test 4 channels in parallel weeks 1–4, double down on top 2 |

---

## 19. Team, Governance & Use of Funds

### 19.1 Roles & ownership

| Domain | Owner |
|---|---|
| Daily user-abuse review + support | Founder / operator |
| Provider failures, security incidents, admin tooling, data access | CTO / founding engineer |
| Secret rotation | CTO / founding engineer |
| Core positioning + tagline | Founders |
| Product microcopy | Product + design |
| Growth campaigns + social | Growth lead with founder review for major launches |
| Migration apply (prod) | Documented apply owner — pending assignment |
| Incident runbook + rollback | Pending assignment |

### 19.2 Repo and operating standards
[docs/standards/repository-standards.md](docs/standards/repository-standards.md), [CONTRIBUTING.md](CONTRIBUTING.md), [docs/dev-guide.md](docs/dev-guide.md).

### 19.3 Use of funds (indicative, seed)

| Category | % | Notes |
|---|---|---|
| Engineering (mobile + AI cost reduction) | 40% | Native mobile, AI caching/fallback, real-time transport |
| Growth (acquisition + AEO/SEO) | 30% | LinkedIn / Reddit / X experiments, comparison content |
| Trust & safety + compliance | 15% | Legal review, moderation tooling, verification ops |
| G&A + reserve | 15% | Runway buffer |

---

## 20. Appendix

### 20.1 Required production environment variables

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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL
NEXT_PUBLIC_STRIPE_PRICE_BOOST
NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW
NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3

# Email
RESEND_API_KEY
RESEND_FROM                      # 'Maahi from BiggDate <maahi@biggdate.app>'

# Rate limiting
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN

# Photo moderation
SIGHTENGINE_USER
SIGHTENGINE_SECRET

# Observability
SENTRY_DSN
NEXT_PUBLIC_SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT
SENTRY_AUTH_TOKEN

# Admin
ADMIN_USER_IDS                   # comma-separated user UUIDs
```

### 20.2 Third-party integrations summary

| Vendor | Purpose | Failure mode |
|---|---|---|
| Supabase | Auth + Postgres + Storage | Hard dependency; `/api/health` checks DB |
| Stripe | Payments + subscription lifecycle | Webhook idempotency via `stripe_events` |
| Resend | Transactional email | Fire-and-forget; never blocks user flow |
| Upstash Redis | Rate limiting | In-memory sliding-window fallback |
| Sightengine | Photo moderation | Fail-closed with audit log (`photo_moderation`) |
| Sentry | Error monitoring | Optional via DSN |
| Vercel Analytics | Pageview / web vitals | Optional |
| Gemini (default) / OpenAI (fallback) | AI generation | Provider abstraction in `src/lib/ai.ts`; Ollama removed |
| PostHog | Product analytics + funnel events | Loaded only after consent |
| Meta Pixel | Acquisition tracking | Loaded only after consent |
| web-push (VAPID) | Browser push notifications | Fire-and-forget; failures logged |

### 20.3 Documentation index
- [README.md](README.md)
- [docs/README.md](docs/README.md)
- [docs/user-guide.md](docs/user-guide.md)
- [docs/dev-guide.md](docs/dev-guide.md)
- [docs/launch-readiness.md](docs/launch-readiness.md)
- [docs/guides/launch-runbook.md](docs/guides/launch-runbook.md)
- [docs/product/product-spec.md](docs/product/product-spec.md)
- [docs/product/data-model.md](docs/product/data-model.md)
- [docs/product/api-reference.md](docs/product/api-reference.md)
- [docs/product/user-journeys.md](docs/product/user-journeys.md)
- [docs/product/operations-and-risks.md](docs/product/operations-and-risks.md)
- [docs/brand/brand-book-handbook.md](docs/brand/brand-book-handbook.md)
- [docs/brand/content-strategy.md](docs/brand/content-strategy.md)
- [docs/standards/repository-standards.md](docs/standards/repository-standards.md)
- [BIGGDATE_REBOOT.md](BIGGDATE_REBOOT.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

### 20.4 Source disclaimer

This document was assembled from the active codebase, migrations, and project docs as of 2026-05-03. Every claim about a feature, endpoint, env var, or limit is grounded in the linked file. Forward-looking statements (90-day plan, seed criteria, use of funds) are management projections subject to change as the company learns from real users.

---

*BiggDate — Dating that respects your time.*
