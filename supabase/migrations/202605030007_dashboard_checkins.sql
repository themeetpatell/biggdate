create table if not exists dashboard_checkins (
  id text primary key default 'dchk_' || replace(gen_random_uuid()::text, '-', ''),
  user_id uuid not null references account_handles(user_id) on delete cascade,
  checkin_date date not null,
  mood text not null check (mood in ('drained', 'neutral', 'open', 'energized')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create index if not exists idx_dashboard_checkins_user_created
  on dashboard_checkins(user_id, created_at desc);
