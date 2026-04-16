-- BiggDate: Pulse Feed + Verification
-- Run in Supabase SQL editor or via CLI

-- ─── Verification columns on profiles ──────────────────────────────────────

alter table profiles
  add column if not exists linkedin_url  text        default '',
  add column if not exists selfie_url    text        default '',
  add column if not exists is_verified   boolean     not null default false,
  add column if not exists verified_at   timestamptz;

-- ─── Pulse Prompts ──────────────────────────────────────────────────────────

create table if not exists pulse_prompts (
  id           text        primary key,
  content      text        not null,
  published_at timestamptz not null default now(),
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

-- ─── Pulse Posts ────────────────────────────────────────────────────────────

create table if not exists pulse_posts (
  id             text        primary key,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  type           text        not null check (type in ('prompt_response','confession','question')),
  prompt_id      text        references pulse_prompts(id) on delete set null,
  content        text        not null,
  is_verified    boolean     not null default false,
  resonate_count integer     not null default 0,
  reply_count    integer     not null default 0,
  flag_count     integer     not null default 0,
  is_hidden      boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- ─── Pulse Reactions ────────────────────────────────────────────────────────

create table if not exists pulse_reactions (
  id         text        primary key,
  post_id    text        not null references pulse_posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- ─── Pulse Replies ──────────────────────────────────────────────────────────

create table if not exists pulse_replies (
  id             text        primary key,
  post_id        text        not null references pulse_posts(id) on delete cascade,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  content        text        not null,
  is_verified    boolean     not null default false,
  resonate_count integer     not null default 0,
  is_hidden      boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- ─── Pulse Flags ────────────────────────────────────────────────────────────

create table if not exists pulse_flags (
  id         text        primary key,
  post_id    text        not null references pulse_posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  reason     text        default '',
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table pulse_prompts   enable row level security;
alter table pulse_posts     enable row level security;
alter table pulse_reactions enable row level security;
alter table pulse_replies   enable row level security;
alter table pulse_flags     enable row level security;

create policy "Auth read pulse_prompts"
  on pulse_prompts for select using (auth.uid() is not null);

create policy "Auth read pulse_posts"
  on pulse_posts for select using (auth.uid() is not null and is_hidden = false);
create policy "Users insert pulse_posts"
  on pulse_posts for insert with check (user_id = auth.uid());

create policy "Auth read pulse_reactions"
  on pulse_reactions for select using (auth.uid() is not null);
create policy "Users insert pulse_reactions"
  on pulse_reactions for insert with check (user_id = auth.uid());
create policy "Users delete pulse_reactions"
  on pulse_reactions for delete using (user_id = auth.uid());

create policy "Auth read pulse_replies"
  on pulse_replies for select using (auth.uid() is not null and is_hidden = false);
create policy "Users insert pulse_replies"
  on pulse_replies for insert with check (user_id = auth.uid());

create policy "Users manage pulse_flags"
  on pulse_flags for all using (user_id = auth.uid());

-- ─── Indexes ────────────────────────────────────────────────────────────────

create index if not exists idx_pulse_posts_created   on pulse_posts(created_at desc);
create index if not exists idx_pulse_posts_user      on pulse_posts(user_id);
create index if not exists idx_pulse_posts_prompt    on pulse_posts(prompt_id);
create index if not exists idx_pulse_reactions_post  on pulse_reactions(post_id);
create index if not exists idx_pulse_replies_post    on pulse_replies(post_id);
create index if not exists idx_pulse_flags_post      on pulse_flags(post_id);
create index if not exists idx_pulse_prompts_active  on pulse_prompts(is_active, published_at desc);
