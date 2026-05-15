# BiggDate · Product Decisions — Fix / Add / Remove

A founder's punch list built from the full feature audit, the investor Q&A risks, and the brand principle that *every line should clarify, motivate, or convert*. Items are tagged by priority and sequenced for the 90-day plan.

**Priority key**
- **P0** — Blocks open beta or creates trust/credibility risk. Ship before opening the door.
- **P1** — Required to validate PMF, measure unit economics, or close a seed-meeting objection.
- **P2** — Compounds over months. Important, not urgent.

---

## FIX — Things that exist but aren't right

### P0 · Trust & launch readiness

**Photo moderation fail-open behavior.** `src/lib/photo-moderation.ts` currently allows uploads when Sightengine is unreachable. For NSFW categories specifically, fail-closed: queue the upload for human review instead of auto-approving. Trust posture matters more than upload latency on an outage.

**Legal copy on `/privacy` and `/terms`.** Placeholder text is on the pre-launch blocker list. Get a lawyer (or Termly) to finalize before open beta — this is the single cheapest legal mitigation in the stack and the single biggest credibility hole.

**18+ age gate is a checkbox, not verification.** Acceptable for closed beta. Before paid acquisition, add at minimum a birthdate field with consistent enforcement across all surfaces (currently inconsistent between onboarding and profile editor). Government-ID verification is a P1 path, not P0, but the gate has to be real.

**Recent "strip fake features" commit (`f67a501`) needs follow-through.** Audit every public-facing marketing page (`/`, `/how-it-works`, `/compare`, `/faq`) against actual product behavior. The brand book's rule 4 — "Is the claim provable by product behavior?" — should be re-applied to every marketing line before open beta.

**Stripe entitlement enforcement on add-ons.** Recent commits (`a05817e`) added Incognito + Read Receipts enforcement. Audit the remaining add-ons (Boost, Super Like, Profile Review, Spotlight) — any that are sold but not enforced should be removed from pricing immediately (see REMOVE).

### P1 · Measurement & instrumentation

**Conversion funnel instrumentation.** Vercel Analytics gives pageviews, not funnel. Before paid acquisition (week 4+), add PostHog or Mixpanel with explicit events for the conversion path: landing → signup → onboarding-phase-1-complete → onboarding-phase-2-complete → first-match-viewed → first-Soul-Knock-sent → first-thread → first-date-debrief → first-paid. Without this, the $1M of seed CAC learning is wasted.

**AI cost monitoring per user.** `usage_counters` tracks plan limits but not actual inference cost. Add per-user $ tracking with daily roll-ups. This is the single most important number for the unit-economics conversation in month 6 onward, and it does not exist today.

**Cohort retention dashboard.** D1/D7/D30 retention by signup week, segmented by acquisition channel. Internal-only. The 90-day plan calls for 70% D7 retention as a PMF signal — we have no way to measure that today.

**Outcome-tracking → match-generation closed loop.** `debrief_reflections` data exists in the schema but does not appear to feed back into next-cycle match generation. This is the data moat from Q15 of the investor Q&A — wire it. Without the loop, "we learn from outcomes" is a story, not a feature.

**Email delivery observability.** Emails are fire-and-forget through Resend. Add delivery-failure logging and a daily ops dashboard. Missing welcome / match-ready emails are silent retention killers.

### P1 · Product UX

**Messaging is polling-based, not realtime.** Migrate to Supabase Realtime channels for `messages` and `threads`. Polling architectures hit a wall at moderate concurrency, and the user-perceived latency is the difference between a "live" product and a "fine" product.

**Voice notes infra exists but the messaging UI doesn't expose them.** Either ship the voice-note send/record/play UI in threads, or remove the migration. Half-built features in production are technical debt that compounds.

**Verification ops tooling.** Founder-as-reviewer in the admin queue is fine at <100 verifications/week. At 1,000 it isn't. Build a bulk-approval keyboard-shortcut interface, auto-flag mismatched LinkedIn names, and surface confidence scoring. Trust ops time is a real cost line.

### P2 · Polish

**Maahi conversation memory pruning.** `session_memory` grows unbounded. Add a retention policy (last 90 days of granular memory, summarized history older than that) before this becomes an inference-cost problem.

**Match cache rebuild after block.** Cache invalidates on block, which is correct, but a stale empty state until next cron run is a bad UX. Trigger an immediate match-regeneration for the blocker.

**`/api/health` should check more than DB.** Add Supabase auth, Stripe API, and AI provider reachability to the health probe. Vercel's deploy gates are only as good as the health signal.

---

## ADD — Gaps to fill

### Pre-open-beta (next 30 days)

**Government-ID verification path.** Integrate Veriff or Persona behind the existing verification queue as an opt-in upgrade. Don't require it for all users — make it the basis of an "ID-Verified" badge above the existing LinkedIn + selfie badge. This is the trust-tier escalation the investor Q&A promises (Q26) and the differentiator we'll need when a verification scandal hits a competitor.

**A/B test infrastructure.** Lightweight feature-flag + variant assignment via the existing `user_plans` or a new `experiments` table. Required by week 3's "funnel optimization to 40% completion" milestone — can't optimize what you can't test.

**Push notification flow for Soul Knock + match-ready.** `push_subscriptions` schema exists; the trigger logic doesn't. Push notifications drive 30–50% of D7 retention in dating apps. Web push first; APNS/FCM ship with the mobile app.

### 30–60 days (validate PMF)

**Native mobile app (iOS first).** The biggest single gap. Architect as a thin client over the existing API surface (the codebase is already client-agnostic). iOS first because the wedge persona over-indexes there and Apple Pay closes faster than Google Pay in our target geos.

**Referral mechanism.** Verified-user invites verified-user with a structural incentive (e.g., one free Life Preview each). This is the channel that becomes the moat — wire it before paid acquisition starts, so the data on earned vs. paid is comparable.

**Self-serve data export.** Required for DPDP (India) and GDPR (EU) credibility. The 7-day support-assisted SLA in `operations-and-risks.md` is fine for closed beta — not for open beta with any EU traffic.

**Soul Knock question quality scoring.** Use the AI provider to score draft Soul Knock questions before send. Reject one-word "hey"-tier openers with a soft-block prompt: *"This is the moment that decides if they reply. Want help making it sharper?"* The mechanic only works if the floor is enforced.

### 60–90 days (de-risk, prepare Series A story)

**Maahi voice mode.** Voice notes infrastructure exists. A spoken Maahi conversation — even text-to-speech first, voice-input second — is a moat competitors can't ship in 6 months and a brand asset that maps to the "warm, brutally caring strategist" archetype better than text alone.

**Couples-stage products (post-pairing).** The `couples` table is already in the schema. Ship the first couples-Maahi mode (Anniversary, Conflict Repair, Decision Together) as an early access surface for users whose `couples` row goes to `exclusive` or beyond. This is the LTV unlock answer to Q19 of the investor Q&A.

**Multi-language (Hindi).** Hindi-language onboarding + Maahi for the Indian market. The wedge persona is English-fluent, but unlocking the Tier-2 cities India narrative requires real bilingual support — and the Maahi voice changes meaningfully in Hindi vs. translated English.

### Post-PMF

**Date-after-debrief follow-through tracking.** Did the second date happen? Did it become exclusive? This is the granular outcome signal that, accumulated, becomes the fine-tuning dataset described in Q15.

**Trust score / safety reputation (internal).** Invisible to users, used to prioritize the moderation queue and detect coordinated bad-actor patterns. Compounds in value as user base grows.

**Verified-couples public stories.** Opt-in feature — verified couples who got engaged through BiggDate become referral content with their consent. The acquisition flywheel Q23 depends on this artifact existing.

**Identity verification renewal.** Verified status should expire after 12 months and re-verify. Standard fraud-control hygiene.

---

## REMOVE or DEFER — Things that don't earn their place

### Cut now

**Add-ons that aren't built.** Per the recent `f67a501` "strip fake features" commit's spirit: remove **Super Like**, **Profile Review**, and **Spotlight** from the pricing surface entirely until they're implemented and entitlement-enforced. Selling vapor is the fastest way to lose the trust we're charging a premium for. Boost, Life Preview, Read Receipts, Incognito stay because they're real.

**Pulse reactions and nested replies.** Pulse may survive (see DEFER below), but emoji reactions and nested replies are engagement-loop bait that contradicts the brand thesis. The brand book's anti-pattern list: "Effortless love hacks. Viral dating tricks." Reactions are the dating-app equivalent. Strip them. A daily anonymous prompt with replies is enough.

**Two of the four AI provider fallbacks.** The `ai.ts` abstraction supports Gemini, OpenAI, Ollama Cloud, and local Ollama. At today's scale this is over-engineered. Keep Gemini (default) and OpenAI (premium fallback for high-stakes calls like Life Preview). Drop the two Ollama paths until self-hosted economics actually matter. Less surface area, fewer bugs, faster prompt iteration.

**Dashboard mood check-ins** (drained/neutral/open/energized). Tagged "experimental/in-development" in the audit. No clear product use today, and the brand book is allergic to data collection without immediate user benefit. Either fold it into Maahi as a session-opener prompt, or remove the table.

### Consolidate

**Maahi's 16 modes → 6.** Sixteen is brainstorm output, not a validated taxonomy. Most users will use 3–4 of them; the rest create decision paralysis on the mode picker. Proposed consolidation:

- **Listen** (absorbs Come Here Mode, Soft Landing)
- **See your patterns** (absorbs Pattern Mirror, Reality Check, Green Flag Reader)
- **Reply** (absorbs Text Back, Profile Whisperer)
- **Hold the line** (absorbs Boundary Backbone, Self-Respect Reset, Pace Check)
- **Decide** (absorbs Decision Clarity, Repair After Conflict)
- **Plan & celebrate** (absorbs Date Spark, Date Debrief, Tiny Victory Party)

Family & Culture Fit deserves to be its own seventh mode given the India strategy. The other consolidations preserve every system prompt's *content* — they just remove the picker friction. Backend stays flexible; UI tightens.

### Defer

**Pulse community (entire surface).** Hold the migrations, dark the route. The investor Q&A already concedes this is "lowest priority surface" and "retention glue, cut if it doesn't earn its place." Don't ship Pulse to open beta. Re-evaluate at day 60 against actual retention data — if D7 retention is hitting 70% without Pulse, it doesn't need to exist. If retention is soft and Pulse is the hypothesized fix, *then* enable it.

**Pro tier pricing.** The audit shows Pro entitlements are TBD. Don't price it. Keep the tier defined in `user_plans` and gate it to founder-issued comps for the few power users who exceed Premium limits. Set the public price only when 60-day usage data tells us what unlimited-everything actually costs to serve.

**Mobile push subscription endpoint** for users without native app. Web push is fine. Defer the full APNS/FCM service infrastructure until the iOS app ships — they're the same workstream.

**Glossary marketing page** (`/glossary`). Doesn't serve SEO/AEO meaningfully and dilutes the focused marketing surface. Park it.

---

## Recommended sequencing

**Week 1–2 (now → open beta)**
- All P0 FIX items
- Marketing-claim audit + add-on stripping (REMOVE: Super Like, Profile Review, Spotlight from pricing)
- Maahi mode consolidation (16 → 6 in UI)
- Pulse darked
- Conversion funnel instrumentation (PostHog or equivalent)

**Week 3–6 (open beta → 500 users)**
- A/B test infrastructure live
- Push notifications wired (web first)
- Soul Knock quality scoring
- Referral mechanism
- Realtime messaging migration
- Outcome → match-generation feedback loop
- Native iOS app development starts

**Week 7–12 (500 → 1,000 users, prepare Series A narrative)**
- iOS app beta
- Self-serve data export
- Government-ID verification opt-in tier
- AI cost dashboard
- Cohort retention dashboard
- Couples-stage Maahi (alpha)
- Hindi localization (alpha)

**Post-PMF (Month 4+)**
- Public couples stories
- Verification renewal
- Trust score system
- Maahi voice mode
- Pulse re-evaluated against retention data (ship or kill)
- Pro pricing set based on real usage data

---

## Cross-cutting principles

1. **Every shipped feature should be claim-provable.** If it's on the pricing page, it works. If it's on the marketing site, it ships exactly that. The "strip fake features" commit is the standard, not the exception.

2. **Outcomes over engagement, in the codebase too.** When in doubt between a feature that drives session count and a feature that drives outcome quality, pick outcome quality. Pulse reactions are the test case — they fail it.

3. **Don't ship instrumentation later.** Funnel events, AI cost tracking, cohort retention — these are P1, not P3. The seed conversation in 90 days is won or lost on whether you can show real numbers.

4. **Consolidate before scaling.** Sixteen Maahi modes, four AI providers, six unimplemented add-ons. Strip down before adding mobile, ID verification, couples products. Less surface, sharper product.

5. **Defer is not delete.** Pulse, Pro pricing, and the glossary page stay in the codebase. They wait for data, not opinion.
