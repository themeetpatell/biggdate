ALTER TABLE messages
  ALTER COLUMN body DROP NOT NULL;

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS audio_url text,
  ADD COLUMN IF NOT EXISTS audio_duration_sec integer,
  ADD COLUMN IF NOT EXISTS audio_mime_type text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'messages_kind_check'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT messages_kind_check
      CHECK (kind IN ('text', 'voice'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'messages_content_check'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT messages_content_check
      CHECK (
        (kind = 'text' AND body IS NOT NULL AND length(trim(body)) > 0)
        OR (kind = 'voice' AND audio_url IS NOT NULL)
      );
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-notes', 'voice-notes', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public voice notes are readable'
  ) THEN
    CREATE POLICY "Public voice notes are readable"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'voice-notes');
  END IF;
END $$;
