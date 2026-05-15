-- A/B test infrastructure. Required for the week-3 funnel-optimization
-- milestone in the 90-day plan — you can't optimize a funnel you can't
-- split-test.
--
-- Two tables:
--   experiments         — the experiment definitions (variants + status)
--   experiment_exposures — one row per (user, experiment) recording which
--                          variant the user was assigned
--
-- Variant assignment itself is deterministic (hash of user_id + experiment
-- id) so it needs no storage to be stable — see src/lib/experiments.ts.
-- The exposures table exists for analysis: it records WHEN a user was first
-- exposed, which is what conversion math joins against.

create table if not exists experiments (
  id text primary key,                  -- 'exp_<slug>', e.g. 'exp_soul_knock_floor'
  name text not null,                   -- human label
  description text default '',
  -- variants is a JSON array of variant keys, e.g. ["control","v1"].
  -- The first entry is the implicit control / fallback.
  variants jsonb not null default '["control"]'::jsonb,
  -- weights is an optional JSON array of integers parallel to variants.
  -- null = equal split. e.g. [50,50] or [80,10,10].
  weights jsonb,
  status text not null default 'draft', -- 'draft' | 'running' | 'completed'
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz
);

create table if not exists experiment_exposures (
  id text primary key,
  experiment_id text not null references experiments(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  variant text not null,
  exposed_at timestamptz not null default now(),
  -- One exposure row per user per experiment. Re-assignment is deterministic
  -- so we only ever record the first exposure.
  unique (experiment_id, user_id)
);

create index if not exists idx_exp_exposures_experiment
  on experiment_exposures (experiment_id, variant);
create index if not exists idx_exp_exposures_user
  on experiment_exposures (user_id);

alter table experiments enable row level security;
alter table experiment_exposures enable row level security;
-- Experiments + exposures are server/ops surfaces. Clients never read or
-- write directly; assignment happens server-side via the service role.
create policy "no client read exp"  on experiments         for select using (false);
create policy "no client write exp" on experiments         for insert with check (false);
create policy "no client read expo"  on experiment_exposures for select using (false);
create policy "no client write expo" on experiment_exposures for insert with check (false);

-- Per-variant exposure + conversion view. Joins exposures to analytics_
-- events so you can read "variant v1 had 120 exposures, 18 first_paid"
-- without hand-writing the join each time. Conversion events are counted
-- only if they occurred at or after the exposure timestamp.
create or replace view experiment_results as
select
  e.experiment_id,
  e.variant,
  count(distinct e.user_id)                                              as exposures,
  count(distinct ev.user_id) filter (where ev.event_name = 'first_soul_knock_sent') as soul_knock_users,
  count(distinct ev.user_id) filter (where ev.event_name = 'first_thread_unlocked') as thread_users,
  count(distinct ev.user_id) filter (where ev.event_name = 'first_paid')            as paid_users
from experiment_exposures e
left join analytics_events ev
  on ev.user_id = e.user_id
  and ev.occurred_at >= e.exposed_at
group by e.experiment_id, e.variant;
