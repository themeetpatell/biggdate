-- Per-user add-on entitlements. Granted via coupon redemption during early
-- access, by Stripe checkout once paid mode is enabled, or by ops promos.
--
-- One row per granted add-on instance. Subscription-type addons use
-- `expires_at`; one-time addons decrement `uses_remaining`.

create table if not exists user_addons (
  id text primary key,
  user_id text not null,
  addon_id text not null,
  status text not null default 'active',         -- 'active' | 'consumed' | 'expired'
  source text not null default 'coupon',         -- 'coupon' | 'stripe' | 'promo'
  redeemed_code text,
  uses_remaining int,                            -- null = unlimited or N/A (subscription)
  granted_at timestamptz not null default now(),
  expires_at timestamptz,                        -- null = no expiry
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_addons_user_id_idx on user_addons (user_id);
create index if not exists user_addons_user_status_idx on user_addons (user_id, status);
create index if not exists user_addons_user_addon_idx on user_addons (user_id, addon_id);
