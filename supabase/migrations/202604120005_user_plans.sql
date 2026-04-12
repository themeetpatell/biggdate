create table if not exists user_plans (
  id text primary key,
  user_id text not null unique,
  plan text not null default 'free',
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists user_plans_user_id_idx on user_plans (user_id);
create index if not exists user_plans_stripe_customer_id_idx on user_plans (stripe_customer_id);
create index if not exists user_plans_stripe_subscription_id_idx on user_plans (stripe_subscription_id);
