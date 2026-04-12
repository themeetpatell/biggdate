-- Run this once in Supabase SQL Editor to create auth users for all 14 seed personas.
-- Password for every account: BiggDate2026!
-- After running, call `npm run seed` to populate the profiles table.

DO $$
DECLARE
  pass TEXT := crypt('BiggDate2026!', gen_salt('bf'));
BEGIN

  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'arjun.mehta@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Arjun Mehta"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'nikhil.rao@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Nikhil Rao"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'ananya.bose@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Ananya Bose"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'rohan.sharma@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Rohan Sharma"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'aditya.verma@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Aditya Verma"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'shreya.reddy@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Shreya Reddy"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'priya.kapoor@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Kapoor"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'vikram.nair@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Vikram Nair"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'tanvi.desai@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Tanvi Desai"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'kabir.patel@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Kabir Patel"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'kavya.shah@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Kavya Shah"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'dev.iyer@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Dev Iyer"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'meera.joshi@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Meera Joshi"}', '', '', '', ''),

    ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'nisha.pillai@seed.biggdate.app', pass, NOW(), NOW(), NOW(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Nisha Pillai"}', '', '', '', '')

  ON CONFLICT (id) DO NOTHING;

END $$;
