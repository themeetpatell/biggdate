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
