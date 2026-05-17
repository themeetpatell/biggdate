-- Notification log: one row per (user, channel, kind) delivery attempt.
-- Source of truth for whether we already sent something. Two guarantees:
--   1) Daily blasts (match_of_the_day, pulse_prompt) — unique on
--      (user_id, kind, sent_day) so the cron can run more than once a day
--      without double-pushing.
--   2) Reactivation pings — unique on source_event_id so each admin-targeted
--      analytics event is delivered at most once.

create table if not exists notification_log (
  id              text primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  channel         text not null,                  -- 'push' | 'email'
  kind            text not null,                  -- 'match_of_the_day' | 'pulse_prompt' | 'reactivation'
  source_event_id text,                           -- analytics_events.id for reactivation pings
  sent_day        date not null default (now() at time zone 'utc')::date,
  status          text not null default 'sent',   -- 'sent' | 'failed' | 'no_subscription'
  error           text,
  sent_at         timestamptz not null default now()
);

create index if not exists idx_notification_log_user_kind_day
  on notification_log (user_id, kind, sent_day);

create unique index if not exists uq_notification_log_daily_blast
  on notification_log (user_id, kind, sent_day)
  where kind in ('match_of_the_day', 'pulse_prompt');

create unique index if not exists uq_notification_log_reactivation_source
  on notification_log (source_event_id)
  where source_event_id is not null;

alter table notification_log enable row level security;
-- Internal table. Service role bypasses RLS for the cron worker.
create policy "no client read" on notification_log for select using (false);
create policy "no client write" on notification_log for insert with check (false);
