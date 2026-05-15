-- session_memory grows unbounded as users have more Maahi conversations.
-- At inference time we pass memory fields into the system prompt, so old,
-- low-signal memory inflates input token cost on every Maahi call.
--
-- Policy: prune session_memory rows whose updated_at is older than 90 days.
-- The covered_topics / patterns these represent will be re-derived from the
-- next live conversation if they're still relevant. Recent memory (last 90
-- days) is what Maahi's character depends on.
--
-- This migration runs the prune once at apply time. For ongoing hygiene,
-- schedule the same DELETE on a Supabase cron (or call it from a daily
-- ops route). See seen_matches + stripe_events pruning in 202605090002
-- for the pattern.

DELETE FROM session_memory
WHERE updated_at < NOW() - INTERVAL '90 days';

-- Index supporting the cron DELETE so prune scans don't sequential-scan the
-- full table once it grows.
CREATE INDEX IF NOT EXISTS idx_session_memory_updated_at
  ON session_memory (updated_at);
