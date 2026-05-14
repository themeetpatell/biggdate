-- Add upload ownership policy to voice-notes bucket.
-- Without this, any authenticated user could write to any path in the bucket.
-- Pattern mirrors the profile-photos bucket: enforce that the first folder segment
-- in the storage path equals the uploader's user ID.

-- Allow authenticated users to upload only to their own subfolder
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, command)
VALUES (
  'voice-notes',
  'Users upload own voice notes',
  '(auth.uid() IS NOT NULL)',
  '((storage.foldername(name))[1] = (auth.uid())::text)',
  'INSERT'
)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to delete only their own voice notes
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, command)
VALUES (
  'voice-notes',
  'Users delete own voice notes',
  '((storage.foldername(name))[1] = (auth.uid())::text)',
  NULL,
  'DELETE'
)
ON CONFLICT DO NOTHING;
