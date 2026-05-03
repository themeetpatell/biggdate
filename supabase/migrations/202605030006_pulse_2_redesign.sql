-- Pulse 2.0: Anonymous Threads-like social feed
-- - per-user stats (lifetime hearts, posting streak)
-- - heart triggers to keep stats in sync
-- - relax single-active-prompt restriction (multiple prompts can be active as inspo)

-- ─── Per-user stats ─────────────────────────────────────────────────────────

create table if not exists pulse_user_stats (
  user_id         uuid        primary key references auth.users(id) on delete cascade,
  lifetime_hearts integer     not null default 0,
  current_streak  integer     not null default 0,
  best_streak     integer     not null default 0,
  last_post_date  date,
  updated_at      timestamptz not null default now()
);

alter table pulse_user_stats enable row level security;

create policy "Users read own pulse_user_stats"
  on pulse_user_stats for select using (user_id = auth.uid());

-- ─── Heart trigger: keep author's lifetime_hearts in sync ──────────────────

create or replace function pulse_reaction_bump_author_hearts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  author_id uuid;
begin
  if (tg_op = 'INSERT') then
    select user_id into author_id from pulse_posts where id = new.post_id;
    if author_id is not null and author_id <> new.user_id then
      insert into pulse_user_stats (user_id, lifetime_hearts, updated_at)
        values (author_id, 1, now())
      on conflict (user_id) do update
        set lifetime_hearts = pulse_user_stats.lifetime_hearts + 1,
            updated_at      = now();
    end if;
    return new;
  elsif (tg_op = 'DELETE') then
    select user_id into author_id from pulse_posts where id = old.post_id;
    if author_id is not null and author_id <> old.user_id then
      update pulse_user_stats
        set lifetime_hearts = greatest(lifetime_hearts - 1, 0),
            updated_at      = now()
        where user_id = author_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_pulse_reaction_bump_hearts on pulse_reactions;
create trigger trg_pulse_reaction_bump_hearts
  after insert or delete on pulse_reactions
  for each row execute function pulse_reaction_bump_author_hearts();

-- ─── Post trigger: update streak on new post ───────────────────────────────

create or replace function pulse_post_bump_streak()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_date date;
  prev_streak integer;
  prev_best integer;
  today date := (now() at time zone 'utc')::date;
begin
  select last_post_date, current_streak, best_streak
    into prev_date, prev_streak, prev_best
    from pulse_user_stats where user_id = new.user_id;

  if prev_date is null then
    insert into pulse_user_stats (user_id, current_streak, best_streak, last_post_date, updated_at)
      values (new.user_id, 1, 1, today, now())
    on conflict (user_id) do update
      set current_streak = 1, best_streak = greatest(pulse_user_stats.best_streak, 1),
          last_post_date = today, updated_at = now();
  elsif prev_date = today then
    -- already posted today; no streak change
    null;
  elsif prev_date = today - interval '1 day' then
    update pulse_user_stats
      set current_streak = prev_streak + 1,
          best_streak    = greatest(prev_best, prev_streak + 1),
          last_post_date = today,
          updated_at     = now()
      where user_id = new.user_id;
  else
    -- gap > 1 day: reset to 1
    update pulse_user_stats
      set current_streak = 1,
          best_streak    = greatest(prev_best, 1),
          last_post_date = today,
          updated_at     = now()
      where user_id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_pulse_post_bump_streak on pulse_posts;
create trigger trg_pulse_post_bump_streak
  after insert on pulse_posts
  for each row execute function pulse_post_bump_streak();

-- ─── Backfill lifetime_hearts from existing reactions ──────────────────────

insert into pulse_user_stats (user_id, lifetime_hearts, updated_at)
select p.user_id, count(*)::int, now()
  from pulse_reactions r
  join pulse_posts p on p.id = r.post_id
  where p.user_id <> r.user_id
  group by p.user_id
on conflict (user_id) do update
  set lifetime_hearts = excluded.lifetime_hearts,
      updated_at      = now();

-- ─── Indexes for Hot ranking ───────────────────────────────────────────────

create index if not exists idx_pulse_posts_hot
  on pulse_posts (resonate_count desc, created_at desc)
  where is_hidden = false;

-- ─── Note: pulse_prompts.is_active stays as-is, but app no longer hard-deactivates
-- previous prompts on insert. createPulsePrompt() updated in repo.ts.
