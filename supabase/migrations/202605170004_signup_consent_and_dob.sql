-- Compliance: persist signup-time DOB + consent timestamps on the canonical
-- identity row so we have an audit trail independent of the (mutable)
-- profiles.birthday column the user can edit later.
--
-- DPDPA Sec 6 (consent must be specific + provable), GDPR Art. 7(1) ("the
-- controller shall be able to demonstrate"), CAN-SPAM (proof of marketing
-- opt-in). DOB is captured at signup to enforce the 18+ floor server-side
-- BEFORE the auth.users row is finalised; the column here is the proof.

alter table account_handles
  add column if not exists dob date,
  add column if not exists dob_verified_at timestamptz,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists marketing_consent_at timestamptz;

-- Defensive: refuse DOBs implying an age under 18 at insert/update time.
-- Belt to the application-layer suspenders so a future bug at the API
-- boundary cannot land an underage account in the table.
alter table account_handles
  drop constraint if exists account_handles_dob_min_age;
alter table account_handles
  add constraint account_handles_dob_min_age
  check (dob is null or dob <= (current_date - interval '18 years'));

comment on column account_handles.dob is
  'Date of birth captured at signup. Used to enforce the 18+ floor server-side.';
comment on column account_handles.dob_verified_at is
  'When the server confirmed the DOB cleared the 18+ gate. Audit trail for DPDPA / GDPR / COPPA-equivalent reviews.';
comment on column account_handles.terms_accepted_at is
  'When the user accepted Terms + Privacy at signup. Required for every account.';
comment on column account_handles.marketing_consent_at is
  'When the user opted IN to marketing email (Maahi daily nudges, product news). NULL = no marketing consent on file.';
