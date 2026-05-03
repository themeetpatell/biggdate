-- Add phone number capture for signup follow-up and contact continuity.

alter table account_handles
  add column if not exists phone_number text;

create index if not exists idx_account_handles_phone_number
  on account_handles(phone_number);
