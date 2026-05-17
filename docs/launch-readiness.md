# Launch Readiness

## Billing Model — Early Access (Active)

For the pre-launch period BiggDate runs in **early-access** mode. Premium is
free and is unlocked by redeeming a one-line coupon code at `/settings/billing`.
Codes are issued by the founder via WhatsApp; there is no Stripe checkout
exposed to users.

- `BILLING_MODE=early_access` (and `NEXT_PUBLIC_BILLING_MODE=early_access`) in
  Vercel env vars.
- `EARLY_ACCESS_CODES` holds the comma-separated list of valid codes (start
  with `themeetpatel`).
- `NEXT_PUBLIC_EARLY_ACCESS_WHATSAPP` is the operator phone shown in the "DM
  us on WhatsApp" CTA (default `+919824341414`).
- Stripe code paths (`/api/billing/checkout`, `/api/billing/portal`, the
  webhook) remain in the tree, dormant. The instrumentation hook no longer
  demands Stripe secrets in this mode.

**Operator runbook**

1. Mint a new code: append it to the `EARLY_ACCESS_CODES` value in Vercel and
   redeploy.
2. Hand the code out on WhatsApp.
3. Watch the `user_plans` table for new `status='active'` rows with
   `stripe_subscription_id IS NULL` — that's the redemption funnel.
4. To rotate or invalidate a code, remove it from the env list and redeploy.
   Existing redemptions stay valid (already written to `user_plans`).

**Flipping back to Stripe**

1. Configure the Stripe price IDs and `STRIPE_*` secrets per `.env.example`.
2. Set `BILLING_MODE=stripe` and `NEXT_PUBLIC_BILLING_MODE=stripe`.
3. Redeploy. The `UpgradeSheet` will start routing clicks back to
   `/api/billing/checkout`, the redeem endpoint will return 503, and Stripe
   webhooks will resume updating `user_plans` rows.

## Product Gaps

- Launch positioning is final: BiggDate is an AI-assisted dating app for intentional relationships, built around richer profiles, curated intros, safety controls, and premium relationship tools. Public tagline: "See your future, not just a profile."
- Plan names are final: Free, Premium, and Pro. Internal plan IDs stay `free`, `premium`, and `pro`. Paid add-ons stay Boost, Life Preview, Super Like, Read Receipts, Incognito, Profile Review, and Spotlight.
- Onboarding is complete when the user has accepted 18+ eligibility plus Terms/Privacy, finished Phase 1 and Phase 2 onboarding, saved core profile fields, and has at least one approved profile photo before full discovery.
- Empty-state copy is final:
  - Discovery: "No matches yet. Finish your profile and check back after the next match refresh."
  - Intros: "No pending intros. Send a Soul Knock when a match feels worth exploring."
  - Messages: "No messages yet. Accepted intros will appear here."
  - Pulse: "No posts yet. Start a thoughtful prompt for the community."
  - Billing: "No active plan. Choose Premium or Pro when you are ready to unlock more."
- Moderation ownership is final: founder/operator owns daily user abuse review and support responses; CTO/founding engineer owns provider failures, security incidents, admin tooling, and data access issues.
- Deletion/export expectations are final: account deletion is permanent and self-serve where exposed in settings; data export is support-assisted until self-serve export ships, with a target response within 7 calendar days.

## 2026-05-17 Audit — Fixes shipped + still open

**Shipped this pass:**
- B1 positioning unified: "AI Dating App for Intentional Adults" across `<head>` metadata, hero, empty states. Removed "founders & operators" framing from `/matches` empty state.
- B2 consent banner: `src/components/consent-banner.tsx` mounts globally; GTM, Meta Pixel, Microsoft Clarity now load **only** after the user accepts. `noscript` pixel fallbacks removed.
- B3 viewport: `userScalable: true`, `maximumScale: 5` (WCAG 1.4.4).
- B4 harmonyScore: fake `|| 82` / `charCodeAt % 16` fallbacks removed in `matches/page.tsx` and `dashboard/page.tsx`; orb only renders when a real score is present.
- B5 password floor: signup + reset min 10 chars (login keeps 6 for legacy accounts).
- B6 OAuth: Google + Apple buttons gated by `NEXT_PUBLIC_OAUTH_PROVIDERS` env (e.g. `google,apple`). Server callback already supports the code exchange. **Operator TODO:** enable Google + Apple providers in the Supabase dashboard before flipping the env on.
- H1 photo-after proof: copy line added above the matches list explaining the unlock model.
- H2 bottom nav: Pulse out, Chats (with unread badge) in.
- H4 phone optional: removed from required signup fields client + server.
- H5 dark theme: `forcedTheme` removed; system preference honored, dark still default.
- H6 cinematic audio: defaults to muted; opt-in via the existing toggle.
- H8 safety: `/matches/[id]/preview` kebab replaced with a clearly-recognizable shield icon + `aria-label`.
- H9 AI-down fallback (matches surface): distinct "Maahi is catching her breath" UI when `/api/matches/generate` returns 5xx, separate from honest empty state. Retry CTA included.

## 2026-05-17 Audit — Medium polish pass

**Shipped (M1, M3, M5, M8, M9, M10, M11, M12):**
- M1 `timeAgo` now rolls into weeks/months/years instead of "732d ago".
- M3 already correct — `trackSignUp()` fires after the `pending_confirmation` early-return, so it never fires for unconfirmed signups.
- M5 sentinel scrubbing: `stripChips` in `src/components/chat-message.tsx` now strips `__BEGIN__` and `__BEGIN_PHASE_2__` in addition to `PHASE_*_DONE`, so AI hallucinations of trigger strings can't leak to the UI.
- M8 already shipped in the blocker pass — "Private beta access" → "Early access".
- M9 voice notes capped at **60 seconds** (`MAX_VOICE_DURATION_SEC` in `src/app/messages/[threadId]/page.tsx`); UI shows `0:00 / 1:00`; recorder auto-stops at the cap.
- M10 OG locale changed `en_IN → en` to avoid biasing social previews/indexing while the phone picker stays global. (WhatsApp default remains `+91` since founder/operator is in India — that's a phone format default, not a content-locale claim.)
- M11 already shipped — login mode now hints "Use your username or email and password."
- M12 already addressed by H2 — `/messages` is now in the nav with its own `startsWith` match, so Chats highlights correctly and Connect no longer claims the active state while the user is in a thread.

**Deferred — needs design or vendor choice:**
- **M2 theme tokens.** Hardcoded hex (`#0A0A0F`, `#a855f7`, `#262626`, etc.) scattered across `messages`, `matches`, `bottom-nav`, `messages/[threadId]`. Migration: codemod each file to use CSS vars (`var(--bd-bg)`, `var(--bd-accent)`, etc.). Half-day task per surface; do it during the next visual-polish sprint.
- **M4 Soul Knock canned questions.** `/matches/[id]/preview` falls back to the same three questions for every match. Target: a per-match `openingQuestion` field generated alongside match scoring, with the three curated fallbacks as last resort. Requires a small `/api/intros/icebreakers` change to take match context and an upstream prompt tweak.
- **M6 Selfie verification — no liveness, no expiry.** `/profile/verify` accepts a single file upload. Production-grade liveness requires a vendor (Persona, Veriff, FaceTec, or Sumsub). Cost: ~$0.15–$0.50 per check. Add an `expires_at` column to `verification_records` and re-prompt every 12 months for trust signals.
- **M7 Profile page split.** `src/app/profile/page.tsx` is 3,019 lines in one file. Refactor into `<ProfileHero/>`, `<ProfileBasics/>`, `<ProfileLifestyle/>`, `<ProfileDating/>`, `<ProfileGallery/>`, `<ProfileVisibility/>` under `src/components/profile/`. Each section can lazy-load. Estimated 4–8h.

**Still open — scope for next sprint:**

- **H3 — Onboarding tap-first redesign.** Today: 17 free-form AI prompts (`BASIC_SPINE_LEN = 8`, `PSYCH_SPINE_LEN = 9`). Target: 6 tap-based basics (sliders + chips) before a teaser match, psych phase moved to a post-match "complete your Soul Profile" flow. Estimated lift: 25-40% completion. Touches `/onboarding/page.tsx`, `/api/chat`, and the chat tooling layer. Multi-day effort.
- **H7 — Avatar polish.** Today: first letter on a gradient ring. Target: animated abstract avatar derived from the user's top 2 core values (chips on a soft-blur background). Cosmetic but improves perceived quality of match cards. Half-day effort.
- **H9 extensions — AI-down fallback in onboarding + Maahi coach.** Matches surface done; the `useChat` flows in onboarding and `/companion` still swallow errors. Hook into `status === "error"` from `@ai-sdk/react` and show a retry + offline note.
- **AI safety on user messages.** Outbound DMs are not filtered. Bumble-style harassment detector recommended before public launch.
- **In-app date scheduling.** Calendar handoff for accepted intros would meaningfully reduce ghost-rate.

## UX Gaps

- End-to-end QA for signup, onboarding, discovery, intro, messaging, billing, and delete account.
- Mobile pass for dense screens and modal flows.
- Error-state copy for AI, upload, billing, and moderation failures.
- Accessibility pass for keyboard focus, contrast, labels, and form errors.

## Backend Gaps

- Production smoke tests for all critical route domains.
- Webhook replay verification in Stripe test mode.
- Database backup and restore drill.
- Admin audit trail review for sensitive actions.

## Infra Gaps

- CI is present, but deployment gates need to be connected to protected branches.
- Production env vars must be configured in Vercel.
- Supabase migrations need a documented apply owner.
- Incident runbook and rollback process need owner assignment.

## Migration Rollback Runbook

Apply migrations with `supabase db push` or via the Supabase dashboard SQL editor. Run rollbacks in reverse order inside a transaction. Rollback owner: CTO/founding engineer. Always verify on staging first.

**202605140002 — intros.id uuid + FK (soul_knock_responses.intro_id, threads.intro_id → text, FK added)**

This migration retypes two columns from `uuid` → `text` so they can reference `intros.id` (which is `text` in `intro_<uuid>` format from `createId()`), drops/recreates two RLS policies that join on `intro_id`, then adds a FK. Rollback reverses each step in order.

> **Data-loss warning.** Any row inserted into `soul_knock_responses` or `threads` *after* this migration may carry an `intro_id` like `intro_a1b2...`, which is not a valid `uuid` literal. Reverting the column type to `uuid` requires deleting those rows first. Pre-launch this is empty; post-launch this means losing Soul Knock responses and threads that reference the affected intros. Confirm with product before running.

Pre-flight checks (must all return 0 unless you accept data loss):
```sql
-- Rows whose intro_id can't cast back to uuid (must be 0 to revert without data loss)
SELECT COUNT(*) FROM soul_knock_responses WHERE intro_id !~ '^[0-9a-fA-F-]{36}$';
SELECT COUNT(*) FROM threads             WHERE intro_id !~ '^[0-9a-fA-F-]{36}$';
```

Rollback:
```sql
BEGIN;

-- 1. Drop the FK added by this migration
ALTER TABLE soul_knock_responses DROP CONSTRAINT IF EXISTS fk_soul_knock_responses_intro_id;

-- 2. Drop the recreated text-to-text policies before the column type changes
DROP POLICY IF EXISTS "Users read own soul knock" ON soul_knock_responses;
DROP POLICY IF EXISTS "Users insert own soul knock" ON soul_knock_responses;

-- 3. (Only if pre-flight returned 0) revert column types. If any rows exist with
--    non-uuid intro_id values, this ALTER will fail. Delete or fix them first.
ALTER TABLE soul_knock_responses ALTER COLUMN intro_id TYPE uuid USING intro_id::uuid;
ALTER TABLE threads              ALTER COLUMN intro_id TYPE uuid USING intro_id::uuid;

-- 4. Recreate the original policies (semantics identical; join now uuid-to-uuid)
CREATE POLICY "Users read own soul knock"
  ON soul_knock_responses FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM threads t
      WHERE t.intro_id = soul_knock_responses.intro_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  );
CREATE POLICY "Users insert own soul knock"
  ON soul_knock_responses FOR INSERT WITH CHECK (user_id = auth.uid());

COMMIT;
```

Verification after rollback:
```sql
-- FK gone
SELECT 1 FROM pg_constraint WHERE conname = 'fk_soul_knock_responses_intro_id'; -- expect 0 rows
-- Column types reverted
SELECT data_type FROM information_schema.columns
 WHERE table_name IN ('soul_knock_responses','threads') AND column_name = 'intro_id';
-- Policies present
SELECT polname FROM pg_policy WHERE polrelid = 'soul_knock_responses'::regclass;
```

If rollback proceeds with non-empty affected tables, document the deleted row count and inform the on-call before resuming traffic — Soul Knock state and thread linkage will be lost for those intros.

**202605140001 — voice-notes storage RLS**
```sql
DELETE FROM storage.policies WHERE bucket_id = 'voice-notes' AND name IN ('Users upload own voice notes', 'Users delete own voice notes');
```

**202605090001 — dashboard_checkins RLS**
```sql
DROP POLICY IF EXISTS "Users manage own checkins" ON dashboard_checkins;
```

## Compliance And Security Gaps

- Privacy policy and terms must cover actual data flows: Supabase auth/profile/photos/messages, AI provider processing, Stripe billing, Resend email, Upstash rate limiting, Sentry/Vercel Analytics, Sightengine photo moderation, admin review, deletion/export, and India DPDP context.
- Age eligibility is 18+ only. Signup must stay blocked unless the user confirms eligibility and accepts Terms and Privacy.
- Abuse reporting policy is final: safety/profile reports and Pulse flags enter admin review; severe safety reports receive same-day review, standard reports receive one-business-day review.
- Secret rotation owner is CTO/founding engineer. Cadence is quarterly, plus immediate rotation after suspected exposure, vendor change, team access change, or production incident.
- Rotation scope: Vercel env vars, Supabase anon/service/database credentials, Stripe keys/webhooks, Resend, Sentry, Upstash, Sightengine, and AI provider keys.
- Production rate-limit baselines are login 5/min/IP, signup 3/hour/IP, and forgot-password 3/10min/IP. Tune after launch week using abuse rate, support tickets, and signup conversion.

## Analytics And Monitoring Gaps

- Define activation, intro, match, message, checkout, and retention events.
- Add funnel dashboards for onboarding through first intro.
- Add alerting for auth, billing webhook, AI provider, and database errors.
- Review Sentry sampling and PII scrubbing before launch.

## Critical Launch Blockers

- Production env vars are not yet verified.
- Stripe test-mode checkout and webhook replay are not yet verified.
- Supabase migrations and backup/restore are not yet verified.
- Final legal review of `/privacy` and `/terms` against the data-flow list is not complete.
- Support-assisted data export process needs an owner before launch.
- End-to-end QA across critical user workflows is not complete.
