-- Launch hardening: remove seeded/demo accounts so matching is real-user only.
-- Safe no-op if no seed users exist.

delete from auth.users
where email like '%@seed.biggdate.app'
   or email like '%+seed@%';
