create table if not exists users (
  id text primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id text primary key,
  user_id text not null unique references users(id) on delete cascade,
  name text not null,
  age integer,
  birthday text,
  zodiac text,
  city text default '',
  gender text,
  orientation text,
  partner_gender text,
  intent text,
  has_kids boolean,
  wants_kids text,
  love_language text,
  drinking text,
  smoking text,
  exercise text,
  dealbreakers text default '[]',
  partner_age_min integer,
  partner_age_max integer,
  attachment text default 'Secure',
  attachment_score integer default 50,
  readiness_score integer default 50,
  growth_areas text default '[]',
  strengths text default '[]',
  core_values text default '[]',
  summary text default '',
  coaching_focus text default '',
  photos text default '[]',
  conflict_style text default '',
  family_expectations text default '',
  life_architecture text default '',
  offers text default '[]',
  needs text default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists session_memory (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  session_key text not null,
  summary text default '',
  traits text default '[]',
  needs text default '[]',
  boundaries text default '[]',
  emotional_patterns text default '[]',
  triggers text default '[]',
  reassurance_style text default '',
  communication_style text default '',
  companion_notes text default '',
  attachment_guess text default '',
  readiness integer,
  previous_questions text default '[]',
  conversation_phase text default 'opening',
  covered_topics text default '[]',
  updated_at timestamptz not null default now(),
  unique(user_id, session_key)
);

create table if not exists matches (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  match_data text not null,
  created_at timestamptz not null default now()
);

create table if not exists match_cache (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  cache_date text not null,
  matches_json text not null,
  created_at timestamptz not null default now(),
  unique(user_id, cache_date)
);

create table if not exists life_previews (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  match_id text not null,
  preview_data text not null,
  created_at timestamptz not null default now(),
  unique(user_id, match_id)
);

create table if not exists intros (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  match_id text not null,
  match_name text default '',
  status text default 'requested',
  icebreakers text default '[]',
  connected_at timestamptz,
  date_nudge_sent_at timestamptz,
  venue_suggestion text default '',
  created_at timestamptz not null default now()
);

create table if not exists passes (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  match_id text not null,
  match_name text default '',
  reason text default '',
  created_at timestamptz not null default now()
);

create table if not exists debriefs (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  match_id text not null,
  match_name text default '',
  feedback text default '',
  insight text default '',
  couple_mode boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists debrief_reflections (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  match_id text not null,
  match_name text default '',
  chemistry_answer text default '',
  surprise_answer text default '',
  decision_answer text default '',
  chemistry_score integer,
  would_see_again boolean,
  ai_insight text default '',
  created_at timestamptz not null default now()
);

create table if not exists waitlist (
  id text primary key,
  name text default '',
  email text unique not null,
  city text default '',
  intent text default '',
  created_at timestamptz not null default now()
);

alter table session_memory add column if not exists conversation_phase text default 'opening';
alter table session_memory add column if not exists covered_topics text default '[]';
alter table profiles add column if not exists offers text default '[]';
alter table profiles add column if not exists needs text default '[]';

create index if not exists idx_profiles_user on profiles(user_id);
create index if not exists idx_sessions_token on sessions(token);
create index if not exists idx_sessions_user on sessions(user_id);
create index if not exists idx_matches_user on matches(user_id);
create index if not exists idx_match_cache_user_date on match_cache(user_id, cache_date);
create index if not exists idx_intros_user on intros(user_id);
create index if not exists idx_passes_user on passes(user_id);
create index if not exists idx_debriefs_user on debriefs(user_id);
create index if not exists idx_debrief_reflections_user on debrief_reflections(user_id);
create index if not exists idx_life_previews_user on life_previews(user_id);
