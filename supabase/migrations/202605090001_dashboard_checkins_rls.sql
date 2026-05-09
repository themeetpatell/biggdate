-- Fix DB-C3: dashboard_checkins was created without RLS, exposing all users'
-- mood check-ins to any authenticated user via Supabase REST.

ALTER TABLE dashboard_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own checkins"
  ON dashboard_checkins
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
