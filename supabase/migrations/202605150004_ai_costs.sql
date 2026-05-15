-- Per-call AI inference cost log. The single most important number for the
-- unit-economics conversation in month 6 onward — and it doesn't exist
-- anywhere in the system today. We log every AI call with its surface
-- (route), provider, model, token counts, and estimated USD cost so the
-- ops dashboard can answer:
--
--   - What's our $/active-user/month?
--   - Which surface burns the most tokens?
--   - When the next model release shifts pricing, what changes?
--
-- We do not gate AI calls on logging — log failures must never block a
-- generation. The logger in src/lib/ai-costs.ts is fire-and-forget.

create table if not exists ai_costs (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  route text not null,                 -- surface that originated the call: 'companion/chat', 'matches/generate', 'life-preview', 'coach/plan', etc.
  provider text not null,              -- 'gemini' | 'openai'
  model text not null,                 -- 'gemini-2.5-flash' | 'gpt-4.1' | ...
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  -- cost_usd is a denormalized convenience column. It's computed at log time
  -- from the price table in src/lib/ai-costs.ts so the dashboard can sum
  -- without re-pricing. When model prices change we backfill via a one-shot
  -- script, not by mutating this column on every read.
  cost_usd numeric(10, 6) not null default 0,
  duration_ms int,                     -- null if streaming and not captured
  error text,                          -- non-null = call failed; tokens may be 0
  occurred_at timestamptz not null default now()
);

create index if not exists idx_ai_costs_user_time
  on ai_costs (user_id, occurred_at desc);
create index if not exists idx_ai_costs_route_time
  on ai_costs (route, occurred_at desc);
create index if not exists idx_ai_costs_occurred_at
  on ai_costs (occurred_at);

alter table ai_costs enable row level security;
create policy "no client read" on ai_costs for select using (false);
create policy "no client write" on ai_costs for insert with check (false);

-- Per-user 30-day cost view for the ops dashboard. Tells us the
-- $/active-user number this VC will ask in month 6.
create or replace view ai_cost_per_user_30d as
select
  user_id,
  sum(cost_usd)::numeric(10, 4) as cost_usd_30d,
  sum(input_tokens)             as input_tokens_30d,
  sum(output_tokens)            as output_tokens_30d,
  count(*)                      as calls_30d
from ai_costs
where occurred_at >= now() - interval '30 days'
  and user_id is not null
group by user_id;

-- Per-surface 30-day cost view. Shows which routes are expensive so we
-- can optimize the right ones first.
create or replace view ai_cost_by_route_30d as
select
  route,
  sum(cost_usd)::numeric(10, 4) as cost_usd_30d,
  sum(input_tokens)             as input_tokens_30d,
  sum(output_tokens)            as output_tokens_30d,
  count(*)                      as calls_30d,
  count(distinct user_id)       as users_30d
from ai_costs
where occurred_at >= now() - interval '30 days'
group by route
order by cost_usd_30d desc;
