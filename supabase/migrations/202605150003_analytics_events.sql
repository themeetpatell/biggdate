-- Funnel events for cohort retention, conversion analysis, and the unit-
-- economics conversation in the next investor meeting. We emit events
-- directly to this table and a future PostHog/Mixpanel adapter forwards
-- from here in batch. Local-first means we never lose events to an outage
-- in the external analytics provider.
--
-- Events to emit (initial set):
--   - signup
--   - onboarding_phase1_complete
--   - onboarding_phase2_complete
--   - first_match_viewed
--   - first_soul_knock_sent
--   - first_thread_unlocked
--   - first_paid
--
-- The same table also captures arbitrary action events (paid_action,
-- maahi_session_started, life_preview_generated, etc.) so we can compute
-- broader engagement metrics without adding more tables.
--
-- Properties is jsonb so each event can carry its own context (route,
-- match_id, plan, etc.) without schema drift.

create table if not exists analytics_events (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  -- session_id is best-effort. Useful for correlating multi-step flows even
  -- when the user isn't signed in (signup funnel pre-auth).
  session_id text,
  client text default 'web',                      -- 'web' | 'ios' | 'android' | 'server'
  occurred_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_user
  on analytics_events (user_id, occurred_at desc);
create index if not exists idx_analytics_events_name_time
  on analytics_events (event_name, occurred_at desc);
create index if not exists idx_analytics_events_session
  on analytics_events (session_id);

alter table analytics_events enable row level security;
-- Users cannot read their own events from the client. Analytics is an
-- internal/ops surface. Service role bypasses RLS for batch export.
create policy "no client read" on analytics_events for select using (false);
create policy "no client write" on analytics_events for insert with check (false);

-- Retention: 13 months. Cohort retention curves only need 12 months of
-- history; 1 extra month for month-over-month delta queries. Older data can
-- be archived to cold storage if needed.
create index if not exists idx_analytics_events_occurred_at
  on analytics_events (occurred_at);

-- Daily cohort retention view. Counts distinct users who signed up on a
-- given day and the count still active (any event) on day N after signup.
-- Materialized lazily by query; if usage outgrows this approach we promote
-- to a materialized view with scheduled refresh.
create or replace view cohort_retention as
with signups as (
  select
    user_id,
    date_trunc('day', occurred_at)::date as signup_day
  from analytics_events
  where event_name = 'signup'
    and user_id is not null
),
activity as (
  select
    user_id,
    date_trunc('day', occurred_at)::date as active_day
  from analytics_events
  where user_id is not null
  group by user_id, date_trunc('day', occurred_at)::date
)
select
  s.signup_day,
  count(distinct s.user_id) filter (where a.active_day = s.signup_day)               as d0,
  count(distinct s.user_id) filter (where a.active_day = s.signup_day + 1)           as d1,
  count(distinct s.user_id) filter (where a.active_day = s.signup_day + 7)           as d7,
  count(distinct s.user_id) filter (where a.active_day = s.signup_day + 14)          as d14,
  count(distinct s.user_id) filter (where a.active_day = s.signup_day + 30)          as d30,
  count(distinct s.user_id)                                                          as cohort_size
from signups s
left join activity a on a.user_id = s.user_id
group by s.signup_day
order by s.signup_day desc;
