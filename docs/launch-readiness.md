# Launch Readiness

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

**202605140002 — intros.id uuid + FK**
```sql
BEGIN;
ALTER TABLE soul_knock_responses DROP CONSTRAINT IF EXISTS fk_soul_knock_responses_intro_id;
ALTER TABLE intros ALTER COLUMN id TYPE text USING id::text;
COMMIT;
```
Before rolling back, verify no orphaned rows: `SELECT COUNT(*) FROM soul_knock_responses skr LEFT JOIN intros i ON skr.intro_id::text = i.id WHERE i.id IS NULL`

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
