import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = path.resolve(process.cwd(), "data", "biggdate.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure data dir exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  // Run migrations
  migrate(_db);

  return _db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

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
      has_kids INTEGER,
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
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

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
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, session_key)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS life_previews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      preview_data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, match_id)
    );

    CREATE TABLE IF NOT EXISTS intros (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      status TEXT DEFAULT 'requested',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS passes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      reason TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS debriefs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT NOT NULL,
      match_name TEXT DEFAULT '',
      feedback TEXT DEFAULT '',
      insight TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id TEXT PRIMARY KEY,
      name TEXT DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      city TEXT DEFAULT '',
      intent TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
    CREATE INDEX IF NOT EXISTS idx_intros_user ON intros(user_id);
  `);
}
