-- Missing index on intros.matched_user_id — needed for the inbox query that
-- filters WHERE matched_user_id = $userId on every page load.
CREATE INDEX IF NOT EXISTS intros_matched_user_id_idx ON intros (matched_user_id);

-- Missing index on seen_matches for the getRealUserCandidates exclusion query.
CREATE INDEX IF NOT EXISTS seen_matches_user_id_idx ON seen_matches (user_id);

-- Prune seen_matches older than 90 days so the exclusion list doesn't grow
-- unbounded and slow down candidate queries over time.
DELETE FROM seen_matches WHERE matched_date < NOW() - INTERVAL '90 days';

-- Prune stripe_events older than 90 days (idempotency only needs recent window).
DELETE FROM stripe_events WHERE received_at < NOW() - INTERVAL '90 days';

-- Prune usage_counters from past periods (they are no longer needed for gating).
-- Keep current period + one prior period for auditability.
DELETE FROM usage_counters
WHERE period_start < (CURRENT_DATE - INTERVAL '35 days');
