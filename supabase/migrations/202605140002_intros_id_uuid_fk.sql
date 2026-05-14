-- Fix type mismatch: intros.id was created as text, soul_knock_responses.intro_id
-- was created as uuid. Cast the column and restore the FK for referential integrity.
--
-- Rollback: ALTER TABLE intros ALTER COLUMN id TYPE text USING id::text;
--           (no data is lost — UUIDs are valid text)

BEGIN;

-- Step 1: Cast intros.id to uuid (all existing values must be valid UUIDs)
ALTER TABLE intros
  ALTER COLUMN id TYPE uuid USING id::uuid;

-- Step 2: Set the default to gen_random_uuid() to match other PK patterns
ALTER TABLE intros
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 3: Add the foreign key that was blocked by the type mismatch
ALTER TABLE soul_knock_responses
  ADD CONSTRAINT fk_soul_knock_responses_intro_id
  FOREIGN KEY (intro_id) REFERENCES intros(id) ON DELETE CASCADE;

COMMIT;
