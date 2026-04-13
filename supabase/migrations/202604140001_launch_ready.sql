-- ─── BiggDate Launch-Ready Migration ─────────────────────────────────────────
-- Systems: real user matching, feature gates, messaging, safety, notifications

-- 1. seen_matches — prevents showing same person twice
CREATE TABLE IF NOT EXISTS seen_matches (
  user_id         uuid NOT NULL,
  matched_user_id uuid NOT NULL,
  matched_date    date NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (user_id, matched_user_id)
);

-- 2. blocked_users — mutual exclusion from matching + messaging
CREATE TABLE IF NOT EXISTS blocked_users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

-- 3. Extend matches table with real user link + photo unlock flag
ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS matched_user_id uuid,
  ADD COLUMN IF NOT EXISTS photos_unlocked boolean NOT NULL DEFAULT false;

-- 4. Extend intros with matched_user_id for bidirectional lookup
ALTER TABLE intros
  ADD COLUMN IF NOT EXISTS matched_user_id uuid,
  ADD COLUMN IF NOT EXISTS soul_knock_question text,
  ADD COLUMN IF NOT EXISTS sender_answered boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS receiver_answered boolean NOT NULL DEFAULT false;

-- 5. soul_knock_responses — stores each person's answer to the shared question
CREATE TABLE IF NOT EXISTS soul_knock_responses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro_id    uuid NOT NULL,
  user_id     uuid NOT NULL,
  response    text NOT NULL CHECK (char_length(response) <= 280),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (intro_id, user_id)
);

-- 6. threads — created when both users answer the Soul Knock
CREATE TABLE IF NOT EXISTS threads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id   uuid NOT NULL,
  user_b_id   uuid NOT NULL,
  intro_id    uuid NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 7. messages — individual messages within a thread
CREATE TABLE IF NOT EXISTS messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL,
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  read_at     timestamptz
);
CREATE INDEX IF NOT EXISTS messages_thread_id_idx ON messages(thread_id, created_at DESC);

-- 8. usage_counters — enforce tier limits per action per period
CREATE TABLE IF NOT EXISTS usage_counters (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL,
  action       text NOT NULL,
  count        integer NOT NULL DEFAULT 0,
  period_start date NOT NULL,
  UNIQUE (user_id, action, period_start)
);

-- 9. reports — safety reports for admin review
CREATE TABLE IF NOT EXISTS reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_id uuid NOT NULL,
  reason      text NOT NULL,
  extra_notes text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 10. flagged_users view — users with 3+ reports (admin triage)
CREATE OR REPLACE VIEW flagged_users AS
  SELECT reported_id, count(*)::int AS report_count
  FROM reports
  GROUP BY reported_id
  HAVING count(*) >= 3;

-- 11. notification_preferences on profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb NOT NULL DEFAULT '{"matchReady":true,"soulKnock":true,"mutualMatch":true}'::jsonb;

-- 12. Extend user_plans to include 'pro' tier
ALTER TABLE user_plans
  ALTER COLUMN plan TYPE text;
