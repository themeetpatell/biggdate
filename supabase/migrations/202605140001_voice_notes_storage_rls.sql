-- Add upload ownership policy to voice-notes bucket.
-- Without this, any authenticated user could write to any path in the bucket.
-- Pattern mirrors the profile-photos bucket: enforce that the first folder segment
-- in the storage path equals the uploader's user ID.
--
-- NOTE: Supabase storage RLS uses CREATE POLICY on storage.objects,
-- not the storage.policies table (which does not exist in Supabase Postgres).

-- Allow authenticated users to upload only to their own subfolder
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Users upload own voice notes'
  ) THEN
    CREATE POLICY "Users upload own voice notes"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'voice-notes'
      AND (storage.foldername(name))[1] = (auth.uid())::text
    );
  END IF;
END $$;

-- Allow authenticated users to delete only their own voice notes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Users delete own voice notes'
  ) THEN
    CREATE POLICY "Users delete own voice notes"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'voice-notes'
      AND (storage.foldername(name))[1] = (auth.uid())::text
    );
  END IF;
END $$;
