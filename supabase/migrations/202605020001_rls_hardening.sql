-- RLS hardening: closes the browser-side data leak.
--
-- Server API routes use a pg Pool against SUPABASE_DB_URL with database-owner
-- credentials and bypass RLS by design. Browsers receive the public anon key
-- via NEXT_PUBLIC_SUPABASE_ANON_KEY and can hit Supabase REST/Realtime
-- endpoints directly. Without RLS, the anon role can read/write any row.
--
-- This migration adds RLS + missing FKs on every table created in
-- 202604140001_launch_ready.sql, 202604120001_account_handles.sql, and
-- 202604120005_user_plans.sql. Existing FKs use NOT VALID so the migration is
-- safe even if any orphaned rows snuck in during dev.

begin;

-- ─── account_handles ──────────────────────────────────────────────────────
-- Holds email + username for every user. Without RLS the anon role can list
-- every account.
alter table account_handles enable row level security;

drop policy if exists "Users select own handle" on account_handles;
create policy "Users select own handle"
  on account_handles for select using (user_id = auth.uid());

drop policy if exists "Users insert own handle" on account_handles;
create policy "Users insert own handle"
  on account_handles for insert with check (user_id = auth.uid());

drop policy if exists "Users update own handle" on account_handles;
create policy "Users update own handle"
  on account_handles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── seen_matches ─────────────────────────────────────────────────────────
alter table seen_matches
  add constraint seen_matches_user_fk
  foreign key (user_id) references auth.users(id) on delete cascade not valid;

alter table seen_matches enable row level security;

drop policy if exists "Users manage own seen_matches" on seen_matches;
create policy "Users manage own seen_matches"
  on seen_matches for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── blocked_users ────────────────────────────────────────────────────────
alter table blocked_users
  add constraint blocked_users_blocker_fk
    foreign key (blocker_id) references auth.users(id) on delete cascade not valid,
  add constraint blocked_users_blocked_fk
    foreign key (blocked_id) references auth.users(id) on delete cascade not valid;

alter table blocked_users enable row level security;

drop policy if exists "Users manage own blocks" on blocked_users;
create policy "Users manage own blocks"
  on blocked_users for all
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());

-- ─── threads ──────────────────────────────────────────────────────────────
alter table threads
  add constraint threads_user_a_fk
    foreign key (user_a_id) references auth.users(id) on delete cascade not valid,
  add constraint threads_user_b_fk
    foreign key (user_b_id) references auth.users(id) on delete cascade not valid;

alter table threads enable row level security;

drop policy if exists "Users read own threads" on threads;
create policy "Users read own threads"
  on threads for select
  using (user_a_id = auth.uid() or user_b_id = auth.uid());

-- ─── messages ─────────────────────────────────────────────────────────────
alter table messages
  add constraint messages_sender_fk
  foreign key (sender_id) references auth.users(id) on delete cascade not valid;

alter table messages enable row level security;

drop policy if exists "Users read messages in own threads" on messages;
create policy "Users read messages in own threads"
  on messages for select using (
    exists (
      select 1 from threads t
      where t.id = messages.thread_id
        and (t.user_a_id = auth.uid() or t.user_b_id = auth.uid())
    )
  );

drop policy if exists "Users insert messages in own threads" on messages;
create policy "Users insert messages in own threads"
  on messages for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from threads t
      where t.id = messages.thread_id
        and (t.user_a_id = auth.uid() or t.user_b_id = auth.uid())
    )
  );

drop policy if exists "Users update read_at in own threads" on messages;
create policy "Users update read_at in own threads"
  on messages for update using (
    exists (
      select 1 from threads t
      where t.id = messages.thread_id
        and (t.user_a_id = auth.uid() or t.user_b_id = auth.uid())
    )
  );

-- ─── soul_knock_responses ─────────────────────────────────────────────────
-- Pre-existing type mismatch: intros.id is text (from initial schema) but
-- soul_knock_responses.intro_id and threads.intro_id are uuid (from
-- launch_ready). Skipping the intro_id FK rather than rewriting the intros
-- primary key column. RLS still works because membership is checked via
-- threads.intro_id, which is uuid-to-uuid against this column.
alter table soul_knock_responses
  add constraint skr_user_fk
    foreign key (user_id) references auth.users(id) on delete cascade not valid;

alter table soul_knock_responses enable row level security;

drop policy if exists "Users read own soul knock" on soul_knock_responses;
create policy "Users read own soul knock"
  on soul_knock_responses for select using (
    user_id = auth.uid()
    or exists (
      select 1 from threads t
      where t.intro_id = soul_knock_responses.intro_id
        and (t.user_a_id = auth.uid() or t.user_b_id = auth.uid())
    )
  );

drop policy if exists "Users insert own soul knock" on soul_knock_responses;
create policy "Users insert own soul knock"
  on soul_knock_responses for insert with check (user_id = auth.uid());

-- ─── usage_counters ───────────────────────────────────────────────────────
alter table usage_counters
  add constraint usage_counters_user_fk
  foreign key (user_id) references auth.users(id) on delete cascade not valid;

alter table usage_counters enable row level security;

drop policy if exists "Users read own counters" on usage_counters;
create policy "Users read own counters"
  on usage_counters for select using (user_id = auth.uid());

-- ─── reports ──────────────────────────────────────────────────────────────
alter table reports
  add constraint reports_reporter_fk
    foreign key (reporter_id) references auth.users(id) on delete cascade not valid,
  add constraint reports_reported_fk
    foreign key (reported_id) references auth.users(id) on delete cascade not valid;

alter table reports enable row level security;

drop policy if exists "Users insert own reports" on reports;
create policy "Users insert own reports"
  on reports for insert with check (reporter_id = auth.uid());

drop policy if exists "Users read own filed reports" on reports;
create policy "Users read own filed reports"
  on reports for select using (reporter_id = auth.uid());

-- ─── user_plans ───────────────────────────────────────────────────────────
-- user_id is text in this table (legacy). Cast auth.uid() to text for the
-- RLS check.
alter table user_plans enable row level security;

drop policy if exists "Users read own plan" on user_plans;
create policy "Users read own plan"
  on user_plans for select using (user_id = auth.uid()::text);

-- ─── stripe_events ────────────────────────────────────────────────────────
-- Webhook audit log. No browser should ever read this.
alter table stripe_events enable row level security;
-- No policies = no anon/authenticated access. Service role still bypasses.

-- ─── Indexes for new FKs (perf) ───────────────────────────────────────────
create index if not exists idx_seen_matches_user        on seen_matches(user_id);
create index if not exists idx_blocked_users_blocker    on blocked_users(blocker_id);
create index if not exists idx_blocked_users_blocked    on blocked_users(blocked_id);
create index if not exists idx_threads_user_a           on threads(user_a_id);
create index if not exists idx_threads_user_b           on threads(user_b_id);
create index if not exists idx_messages_sender          on messages(sender_id);
create index if not exists idx_skr_user                 on soul_knock_responses(user_id);
create index if not exists idx_skr_intro                on soul_knock_responses(intro_id);
create index if not exists idx_usage_counters_user      on usage_counters(user_id);
create index if not exists idx_reports_reporter         on reports(reporter_id);
create index if not exists idx_reports_reported         on reports(reported_id);

commit;
