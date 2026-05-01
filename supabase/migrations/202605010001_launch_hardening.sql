-- Launch hardening: webhook idempotency + photo moderation queue.

-- Stripe webhook event log — used to deduplicate retries.
-- Stripe retries with the same event.id on non-2xx, so a unique key on event_id
-- gives us bulletproof idempotency.
create table if not exists stripe_events (
  event_id    text        primary key,
  type        text        not null,
  received_at timestamptz not null default now()
);

-- Photo moderation queue. Every uploaded profile photo passes through here.
-- Status:
--   pending  — awaiting moderation result
--   safe     — auto-approved
--   flagged  — auto-blocked or human review needed
--   rejected — admin marked as policy violation
create table if not exists photo_moderation (
  id            text        primary key,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  photo_url     text        not null,
  status        text        not null default 'pending',
  provider      text                 default null,
  scores        jsonb                default null,
  reason        text                 default null,
  reviewed_by   uuid                 default null,
  reviewed_at   timestamptz          default null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_photo_moderation_user   on photo_moderation(user_id);
create index if not exists idx_photo_moderation_status on photo_moderation(status);

alter table photo_moderation enable row level security;
create policy "Users see own moderation entries" on photo_moderation
  for select using (user_id = auth.uid());
