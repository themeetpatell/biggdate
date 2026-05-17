-- In-app date scheduler. Extends the messages table so a thread can carry
-- a structured "date proposal" card alongside text/voice messages.
--
-- Schema additions:
--   - meta jsonb nullable column — holds DateProposalMeta payload
--     ({proposedAt, venue, notes?, status, respondedBy?, respondedAt?}).
--   - messages.kind enum gains 'date_proposal'.
--   - messages_content_check broadened so kind='date_proposal' rows require
--     meta IS NOT NULL.
--
-- All existing text/voice rows remain valid. Safe to re-run.

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS meta jsonb;

ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_kind_check;

ALTER TABLE messages
  ADD CONSTRAINT messages_kind_check
    CHECK (kind IN ('text', 'voice', 'date_proposal'));

ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_content_check;

ALTER TABLE messages
  ADD CONSTRAINT messages_content_check
    CHECK (
      (kind = 'text'           AND body IS NOT NULL AND length(trim(body)) > 0)
      OR (kind = 'voice'        AND audio_url IS NOT NULL)
      OR (kind = 'date_proposal' AND meta IS NOT NULL)
    );

-- Rollback (manual; data-loss for any date_proposal rows):
--   DELETE FROM messages WHERE kind = 'date_proposal';
--   ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_kind_check;
--   ALTER TABLE messages ADD CONSTRAINT messages_kind_check
--     CHECK (kind IN ('text','voice'));
--   ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_content_check;
--   ALTER TABLE messages ADD CONSTRAINT messages_content_check CHECK (
--     (kind = 'text' AND body IS NOT NULL AND length(trim(body)) > 0)
--     OR (kind = 'voice' AND audio_url IS NOT NULL));
--   ALTER TABLE messages DROP COLUMN IF EXISTS meta;
