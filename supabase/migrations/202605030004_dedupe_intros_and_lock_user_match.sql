-- Remove duplicated intro rows (same sender + same match card) and prevent future duplicates.

with ranked as (
  select
    ctid,
    row_number() over (
      partition by user_id, match_id
      order by created_at desc, id desc
    ) as rn
  from intros
)
delete from intros i
using ranked r
where i.ctid = r.ctid
  and r.rn > 1;

create unique index if not exists intros_user_match_unique
  on intros(user_id, match_id);
