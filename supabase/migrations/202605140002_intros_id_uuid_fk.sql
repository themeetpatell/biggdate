-- Fix type mismatch: intros.id is TEXT with "intro_<uuid>" format (from createId()),
-- but soul_knock_responses.intro_id and threads.intro_id were declared uuid.
-- This caused ALL Soul Knock and thread inserts to fail with invalid uuid errors.
--
-- Fix: change both columns to text. The "Users read own soul knock" policy
-- references intro_id in a join expression, so we drop and recreate it around
-- the column type change. threads.intro_id has no policy expressions, safe to
-- alter directly. FK is then added between the now-matching text columns.

BEGIN;

-- Drop policies that reference intro_id on soul_knock_responses
DROP POLICY IF EXISTS "Users read own soul knock" ON soul_knock_responses;
DROP POLICY IF EXISTS "Users insert own soul knock" ON soul_knock_responses;

-- soul_knock_responses.intro_id: uuid → text
ALTER TABLE soul_knock_responses
  ALTER COLUMN intro_id TYPE text USING intro_id::text;

-- threads.intro_id: uuid → text (no policy expressions reference this column)
ALTER TABLE threads
  ALTER COLUMN intro_id TYPE text USING intro_id::text;

-- Recreate soul_knock_responses policies (join is now text-to-text)
CREATE POLICY "Users read own soul knock"
  ON soul_knock_responses FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM threads t
      WHERE t.intro_id = soul_knock_responses.intro_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users insert own soul knock"
  ON soul_knock_responses FOR INSERT WITH CHECK (user_id = auth.uid());

-- FK: both columns are now text, matching intros.id "intro_<uuid>" format
ALTER TABLE soul_knock_responses
  ADD CONSTRAINT fk_soul_knock_responses_intro_id
  FOREIGN KEY (intro_id) REFERENCES intros(id) ON DELETE CASCADE;

COMMIT;
