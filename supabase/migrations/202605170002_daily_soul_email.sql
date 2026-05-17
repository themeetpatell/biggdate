-- Daily Soul Knock email — extend notification_log idempotency to cover the
-- new email-channel daily blast. Previously the unique index only deduped
-- 'match_of_the_day' and 'pulse_prompt'; without this change, a cron retry on
-- the same UTC day could double-send the daily email.
--
-- This is purely an index-predicate change. No data is rewritten and no
-- per-row schema changes. Safe to re-run; both DROP and CREATE are guarded.

drop index if exists uq_notification_log_daily_blast;

create unique index if not exists uq_notification_log_daily_blast
  on notification_log (user_id, kind, sent_day)
  where kind in ('match_of_the_day', 'pulse_prompt', 'daily_soul_email');

-- Rollback (manual):
--   drop index if exists uq_notification_log_daily_blast;
--   create unique index uq_notification_log_daily_blast
--     on notification_log (user_id, kind, sent_day)
--     where kind in ('match_of_the_day', 'pulse_prompt');
