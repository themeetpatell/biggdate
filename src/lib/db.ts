import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sql = neon(process.env.DATABASE_URL);

export async function migrate() {
  // Users
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Profiles — includes L3 Bandhan onboarding depth fields
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      age INTEGER,
      birthday TEXT,
      zodiac TEXT,
      city TEXT DEFAULT '',
      gender TEXT,
      orientation TEXT,
      partner_gender TEXT,
      intent TEXT,
      has_kids BOOLEAN,
      wants_kids TEXT,
      love_language TEXT,
      drinking TEXT,
      smoking TEXT,
      exercise TEXT,
      dealbreakers TEXT DEFAULT '[]',
      partner_age_min INTEGER,
      partner_age_max INTEGER,
      attachment TEXT DEFAULT 'Secure',
      attachment_score INTEGER DEFAULT 50,
      readiness_score INTEGER DEFAULT 50,
      growth_areas TEXT DEFAULT '[]',
      strengths TEXT DEFAULT '[]',
      core_values TEXT DEFAULT '[]',
      summary TEXT DEFAULT '',
      coaching_focus TEXT DEFAULT '',
      photos TEXT DEFAULT '[]',
      conflict_style TEXT DEFAULT '',
      family_expectations TEXT DEFAULT '',
      life_architecture TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Auth sessions
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // AI conversation memory
  await sql`
    CREATE TABLE IF NOT EXISTS session_memory (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_key TEXT NOT NULL,
      summary TEXT DEFAULT '',
      traits TEXT DEFAULT '[]',
      needs TEXT DEFAULT '[]',
      boundaries TEXT DEFAULT '[]',
      emotional_patterns TEXT DEFAULT '[]',
      triggers TEXT DEFAULT '[]',
      reassurance_style TEXT DEFAULT '',
      communication_style TEXT DEFAULT '',
      companion_notes TEXT DEFAULT '',
      attachment_guess TEXT DEFAULT '',
      readiness INTEGER,
      previous_questions TEXT DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, session_key)
    )
  `;

  // Matches — stored JSON blobs per user
  await sql`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_data TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // L1 Bandhan: daily match cache — one row per user per day
  await sql`
    CREATE TABLE IF NOT EXISTS match_cache (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cache_date TEXT NOT NULL,
      matches_json TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, cache_date)
    )
  `;

  // Life previews
  await sql`
    CREATE TABLE IF NOT EXISTS life_previews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      preview_data TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, match_id)
    )
  `;

  // Intros — L2 Bandhan: includes icebreakers, connection tracking, date concierge
  await sql`
    CREATE TABLE IF NOT EXISTS intros (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      status TEXT DEFAULT 'requested',
      icebreakers TEXT DEFAULT '[]',
      connected_at TIMESTAMPTZ,
      date_nudge_sent_at TIMESTAMPTZ,
      venue_suggestion TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS passes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      reason TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Legacy freeform debriefs (kept for backwards compat)
  await sql`
    CREATE TABLE IF NOT EXISTS debriefs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      feedback TEXT DEFAULT '',
      insight TEXT DEFAULT '',
      couple_mode BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // L4 Bandhan: structured 3-Q post-date reflections + chemistry calibration
  await sql`
    CREATE TABLE IF NOT EXISTS debrief_reflections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      chemistry_answer TEXT DEFAULT '',
      surprise_answer TEXT DEFAULT '',
      decision_answer TEXT DEFAULT '',
      chemistry_score INTEGER,
      would_see_again BOOLEAN,
      ai_insight TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id TEXT PRIMARY KEY,
      name TEXT DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      city TEXT DEFAULT '',
      intent TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_match_cache_user_date ON match_cache(user_id, cache_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_intros_user ON intros(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_debrief_reflections_user ON debrief_reflections(user_id)`;
}
