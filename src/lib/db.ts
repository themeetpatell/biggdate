import { Pool } from "pg";

type SqlRow = Record<string, unknown>;

let pool: Pool | undefined;

function getDatabaseUrl(): string | undefined {
  return process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
}

function shouldUseSsl(databaseUrl: string) {
  try {
    const { hostname } = new URL(databaseUrl);
    return hostname !== "localhost" && hostname !== "127.0.0.1";
  } catch {
    return true;
  }
}

function getPool() {
  if (!pool) {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      throw new Error("SUPABASE_DB_URL or DATABASE_URL environment variable is required");
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined,
      max: process.env.NODE_ENV === "production" ? 10 : 5,
      allowExitOnIdle: process.env.NODE_ENV !== "production",
    });
  }

  return pool;
}

function compileQuery(strings: TemplateStringsArray, values: unknown[]) {
  let text = "";

  for (let index = 0; index < strings.length; index += 1) {
    text += strings[index];
    if (index < values.length) {
      text += `$${index + 1}`;
    }
  }

  return { text, values };
}

export async function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const { text, values: params } = compileQuery(strings, values);
  const result = await getPool().query(text, params);
  return result.rows as SqlRow[];
}

export function hasDatabaseConfig() {
  return Boolean(getDatabaseUrl());
}

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS profiles (
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
    offers TEXT DEFAULT '[]',
    needs TEXT DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS session_memory (
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
    conversation_phase TEXT DEFAULT 'opening',
    covered_topics TEXT DEFAULT '[]',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, session_key)
  )`,
  `CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS match_cache (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cache_date TEXT NOT NULL,
    matches_json TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, cache_date)
  )`,
  `CREATE TABLE IF NOT EXISTS life_previews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id TEXT NOT NULL,
    preview_data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, match_id)
  )`,
  `CREATE TABLE IF NOT EXISTS intros (
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
  )`,
  `CREATE TABLE IF NOT EXISTS passes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id TEXT NOT NULL,
    match_name TEXT DEFAULT '',
    reason TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS debriefs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id TEXT NOT NULL,
    match_name TEXT DEFAULT '',
    feedback TEXT DEFAULT '',
    insight TEXT DEFAULT '',
    couple_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS debrief_reflections (
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
  )`,
  `CREATE TABLE IF NOT EXISTS waitlist (
    id TEXT PRIMARY KEY,
    name TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    city TEXT DEFAULT '',
    intent TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `ALTER TABLE session_memory ADD COLUMN IF NOT EXISTS conversation_phase TEXT DEFAULT 'opening'`,
  `ALTER TABLE session_memory ADD COLUMN IF NOT EXISTS covered_topics TEXT DEFAULT '[]'`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS offers TEXT DEFAULT '[]'`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS needs TEXT DEFAULT '[]'`,
  `CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_match_cache_user_date ON match_cache(user_id, cache_date)`,
  `CREATE INDEX IF NOT EXISTS idx_intros_user ON intros(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_passes_user ON passes(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_debriefs_user ON debriefs(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_debrief_reflections_user ON debrief_reflections(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_life_previews_user ON life_previews(user_id)`,
];

export async function migrate() {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    for (const statement of SCHEMA_STATEMENTS) {
      await client.query(statement);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
