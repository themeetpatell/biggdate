-- Keep only the latest Soul Knock per sender/receiver pair, then enforce uniqueness.

with ranked as (
  select
    ctid,
    row_number() over (
      partition by user_id, matched_user_id
      order by created_at desc, id desc
    ) as rn
  from intros
  where matched_user_id is not null
)
delete from intros i
using ranked r
where i.ctid = r.ctid
  and r.rn > 1;

create unique index if not exists intros_user_matched_user_unique
  on intros(user_id, matched_user_id)
  where matched_user_id is not null;
