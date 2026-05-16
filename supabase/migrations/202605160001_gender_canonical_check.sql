-- Applied via Supabase MCP on 2026-05-16. Saved here for repo-as-source-of-truth.
--
-- CHECK constraints lock profiles.gender and profiles.partner_gender to the
-- canonical singular title-case values from GENDER_OPTIONS (lib/profile-options.ts).
-- The TS normalizers in upsertProfile catch lowercase/plural at write time; this
-- DB-level backstop prevents the bug from returning if a direct SQL write or
-- future code path bypasses normalization.
--
-- "Everyone" / "Open to all" intentionally NOT in the allowed set:
-- normalizePartnerGender maps them to NULL = "no gender filter".

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_gender_canonical;
ALTER TABLE profiles ADD CONSTRAINT profiles_gender_canonical
  CHECK (
    gender IS NULL
    OR gender IN (
      'Man','Woman','Non-binary','Genderqueer','Genderfluid',
      'Trans man','Trans woman','Agender'
    )
  ) NOT VALID;
ALTER TABLE profiles VALIDATE CONSTRAINT profiles_gender_canonical;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_partner_gender_canonical;
ALTER TABLE profiles ADD CONSTRAINT profiles_partner_gender_canonical
  CHECK (
    partner_gender IS NULL
    OR partner_gender IN (
      'Man','Woman','Non-binary','Genderqueer','Genderfluid',
      'Trans man','Trans woman','Agender'
    )
  ) NOT VALID;
ALTER TABLE profiles VALIDATE CONSTRAINT profiles_partner_gender_canonical;
