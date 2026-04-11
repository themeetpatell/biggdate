create table if not exists account_handles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  username     text not null unique,
  full_name    text default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_account_handles_username on account_handles(username);
create index if not exists idx_account_handles_email on account_handles(email);
