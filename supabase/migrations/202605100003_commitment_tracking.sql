-- L6 BiggDate: Commitment Tracking

-- Add relationship status and partner tracking to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS relationship_status TEXT CHECK (relationship_status IN ('single', 'dating', 'seeing_someone', 'exclusive', 'engaged', 'married')),
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create an explicit couples table for the ecosystem 
CREATE TABLE IF NOT EXISTS couples (
    id TEXT PRIMARY KEY,
    user_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('seeing_each_other', 'exclusive', 'engaged', 'married', 'broken_up')),
    established_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_a_id, user_b_id)
);

CREATE INDEX IF NOT EXISTS couples_user_a_id_idx ON couples(user_a_id);
CREATE INDEX IF NOT EXISTS couples_user_b_id_idx ON couples(user_b_id);

-- Enable RLS
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own couple record
CREATE POLICY "Users can view their own couple record"
    ON couples FOR SELECT
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Allow service role to manage couples (inserts/updates via API)
CREATE POLICY "Service role manages couples"
    ON couples FOR ALL
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
