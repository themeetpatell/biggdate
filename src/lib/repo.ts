import { getDb } from "./db";
import { randomUUID } from "node:crypto";
import type { Profile, Match, LifePreview, SessionMemory } from "./types";

function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

// ─── Profile ───

export function getProfileByUserId(userId: string): Profile | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return rowToProfile(row);
}

export function upsertProfile(userId: string, profile: Partial<Profile>) {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM profiles WHERE user_id = ?").get(userId) as { id: string } | undefined;

  if (existing) {
    db.prepare(`
      UPDATE profiles SET
        name = coalesce(?, name), age = coalesce(?, age), birthday = coalesce(?, birthday),
        zodiac = coalesce(?, zodiac), city = coalesce(?, city), gender = coalesce(?, gender),
        orientation = coalesce(?, orientation), partner_gender = coalesce(?, partner_gender),
        intent = coalesce(?, intent), has_kids = ?, wants_kids = coalesce(?, wants_kids),
        love_language = coalesce(?, love_language), drinking = coalesce(?, drinking),
        smoking = coalesce(?, smoking), exercise = coalesce(?, exercise),
        dealbreakers = ?, partner_age_min = coalesce(?, partner_age_min),
        partner_age_max = coalesce(?, partner_age_max),
        attachment = coalesce(?, attachment), attachment_score = coalesce(?, attachment_score),
        readiness_score = coalesce(?, readiness_score),
        growth_areas = ?, strengths = ?, core_values = ?,
        summary = coalesce(?, summary), coaching_focus = coalesce(?, coaching_focus),
        photos = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      profile.name, profile.age, profile.birthday,
      profile.zodiac, profile.city, profile.gender,
      profile.orientation, profile.partnerGender,
      profile.intent, profile.hasKids === null ? null : profile.hasKids ? 1 : 0, profile.wantsKids,
      profile.loveLanguage, profile.drinking,
      profile.smoking, profile.exercise,
      JSON.stringify(profile.dealbreakers || []), profile.partnerAgeMin,
      profile.partnerAgeMax,
      profile.attachment, profile.attachmentScore,
      profile.readinessScore,
      JSON.stringify(profile.growthAreas || []), JSON.stringify(profile.strengths || []), JSON.stringify(profile.coreValues || []),
      profile.summary, profile.coachingFocus,
      JSON.stringify(profile.photos || []),
      userId,
    );
  } else {
    const id = createId("prof");
    db.prepare(`
      INSERT INTO profiles (id, user_id, name, age, birthday, zodiac, city, gender, orientation,
        partner_gender, intent, has_kids, wants_kids, love_language, drinking, smoking, exercise,
        dealbreakers, partner_age_min, partner_age_max, attachment, attachment_score, readiness_score,
        growth_areas, strengths, core_values, summary, coaching_focus, photos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, userId, profile.name || "", profile.age, profile.birthday,
      profile.zodiac, profile.city || "", profile.gender,
      profile.orientation, profile.partnerGender,
      profile.intent, profile.hasKids === null ? null : profile.hasKids ? 1 : 0, profile.wantsKids,
      profile.loveLanguage, profile.drinking, profile.smoking, profile.exercise,
      JSON.stringify(profile.dealbreakers || []), profile.partnerAgeMin, profile.partnerAgeMax,
      profile.attachment || "Secure", profile.attachmentScore || 50, profile.readinessScore || 50,
      JSON.stringify(profile.growthAreas || []), JSON.stringify(profile.strengths || []),
      JSON.stringify(profile.coreValues || []), profile.summary || "", profile.coachingFocus || "",
      JSON.stringify(profile.photos || []),
    );
  }
}

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    name: row.name as string,
    age: row.age as number | null,
    birthday: row.birthday as string | null,
    zodiac: row.zodiac as string | null,
    city: row.city as string,
    gender: row.gender as string | null,
    orientation: row.orientation as string | null,
    partnerGender: row.partner_gender as string | null,
    intent: row.intent as Profile["intent"],
    hasKids: row.has_kids === null ? null : Boolean(row.has_kids),
    wantsKids: row.wants_kids as Profile["wantsKids"],
    loveLanguage: row.love_language as string | null,
    drinking: row.drinking as Profile["drinking"],
    smoking: row.smoking as Profile["smoking"],
    exercise: row.exercise as Profile["exercise"],
    dealbreakers: safeParseJson(row.dealbreakers as string, []),
    partnerAgeMin: row.partner_age_min as number | null,
    partnerAgeMax: row.partner_age_max as number | null,
    attachment: (row.attachment as Profile["attachment"]) || "Secure",
    attachmentScore: (row.attachment_score as number) || 50,
    readinessScore: (row.readiness_score as number) || 50,
    growthAreas: safeParseJson(row.growth_areas as string, []),
    strengths: safeParseJson(row.strengths as string, []),
    coreValues: safeParseJson(row.core_values as string, []),
    summary: (row.summary as string) || "",
    coachingFocus: (row.coaching_focus as string) || "",
    photos: safeParseJson(row.photos as string, []),
  };
}

// ─── Matches ───

export function saveMatchesForUser(userId: string, matches: Match[]) {
  const db = getDb();
  // Clear old matches
  db.prepare("DELETE FROM matches WHERE user_id = ?").run(userId);
  const stmt = db.prepare("INSERT INTO matches (id, user_id, match_data) VALUES (?, ?, ?)");
  for (const m of matches) {
    stmt.run(m.id || createId("match"), userId, JSON.stringify(m));
  }
}

export function getMatchesForUser(userId: string): Match[] {
  const db = getDb();
  const rows = db.prepare("SELECT match_data FROM matches WHERE user_id = ? ORDER BY created_at DESC").all(userId) as { match_data: string }[];
  return rows.map((r) => safeParseJson<Match>(r.match_data, null as unknown as Match)).filter(Boolean);
}

export function getMatchForUser(userId: string, matchId: string): Match | null {
  const db = getDb();
  const row = db.prepare("SELECT match_data FROM matches WHERE user_id = ? AND id = ?").get(userId, matchId) as { match_data: string } | undefined;
  if (!row) {
    // Also check by match_data.id
    const all = getMatchesForUser(userId);
    return all.find((m) => m.id === matchId) || null;
  }
  return safeParseJson<Match>(row.match_data, null as unknown as Match);
}

// ─── Life Previews ───

export function saveLifePreview(userId: string, matchId: string, preview: LifePreview) {
  const db = getDb();
  const id = createId("lp");
  db.prepare(`
    INSERT OR REPLACE INTO life_previews (id, user_id, match_id, preview_data)
    VALUES (?, ?, ?, ?)
  `).run(id, userId, matchId, JSON.stringify(preview));
}

export function getLifePreview(userId: string, matchId: string): LifePreview | null {
  const db = getDb();
  const row = db.prepare("SELECT preview_data FROM life_previews WHERE user_id = ? AND match_id = ?").get(userId, matchId) as { preview_data: string } | undefined;
  if (!row) return null;
  return safeParseJson<LifePreview>(row.preview_data, null as unknown as LifePreview);
}

// ─── Session Memory ───

export function getSessionMemoryDb(userId: string, sessionKey: string): SessionMemory | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM session_memory WHERE user_id = ? AND session_key = ?").get(userId, sessionKey) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    summary: (row.summary as string) || "",
    traits: safeParseJson(row.traits as string, []),
    needs: safeParseJson(row.needs as string, []),
    boundaries: safeParseJson(row.boundaries as string, []),
    emotionalPatterns: safeParseJson(row.emotional_patterns as string, []),
    triggers: safeParseJson(row.triggers as string, []),
    reassuranceStyle: (row.reassurance_style as string) || "",
    communicationStyle: (row.communication_style as string) || "",
    companionNotes: (row.companion_notes as string) || "",
    attachmentGuess: (row.attachment_guess as string) || "",
    readiness: row.readiness as number | null,
    previousQuestions: safeParseJson(row.previous_questions as string, []),
    lastUpdated: (row.updated_at as string) || null,
  };
}

export function upsertSessionMemory(userId: string, sessionKey: string, patch: Partial<SessionMemory>) {
  const db = getDb();
  const existing = getSessionMemoryDb(userId, sessionKey);

  const mergeArr = (a: string[], b: string[], max: number) =>
    Array.from(new Set([...a, ...b])).slice(0, max);

  const merged: SessionMemory = {
    summary: patch.summary || existing?.summary || "",
    traits: mergeArr(existing?.traits || [], patch.traits || [], 8),
    needs: mergeArr(existing?.needs || [], patch.needs || [], 8),
    boundaries: mergeArr(existing?.boundaries || [], patch.boundaries || [], 8),
    emotionalPatterns: mergeArr(existing?.emotionalPatterns || [], patch.emotionalPatterns || [], 10),
    triggers: mergeArr(existing?.triggers || [], patch.triggers || [], 10),
    reassuranceStyle: patch.reassuranceStyle || existing?.reassuranceStyle || "",
    communicationStyle: patch.communicationStyle || existing?.communicationStyle || "",
    companionNotes: patch.companionNotes || existing?.companionNotes || "",
    attachmentGuess: patch.attachmentGuess || existing?.attachmentGuess || "",
    readiness: patch.readiness ?? existing?.readiness ?? null,
    previousQuestions: mergeArr(existing?.previousQuestions || [], patch.previousQuestions || [], 24),
    lastUpdated: new Date().toISOString(),
  };

  if (existing) {
    db.prepare(`
      UPDATE session_memory SET summary=?, traits=?, needs=?, boundaries=?,
        emotional_patterns=?, triggers=?, reassurance_style=?, communication_style=?,
        companion_notes=?, attachment_guess=?, readiness=?, previous_questions=?, updated_at=datetime('now')
      WHERE user_id=? AND session_key=?
    `).run(
      merged.summary, JSON.stringify(merged.traits), JSON.stringify(merged.needs),
      JSON.stringify(merged.boundaries), JSON.stringify(merged.emotionalPatterns),
      JSON.stringify(merged.triggers), merged.reassuranceStyle, merged.communicationStyle,
      merged.companionNotes, merged.attachmentGuess, merged.readiness,
      JSON.stringify(merged.previousQuestions), userId, sessionKey,
    );
  } else {
    db.prepare(`
      INSERT INTO session_memory (id, user_id, session_key, summary, traits, needs, boundaries,
        emotional_patterns, triggers, reassurance_style, communication_style,
        companion_notes, attachment_guess, readiness, previous_questions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      createId("mem"), userId, sessionKey, merged.summary,
      JSON.stringify(merged.traits), JSON.stringify(merged.needs),
      JSON.stringify(merged.boundaries), JSON.stringify(merged.emotionalPatterns),
      JSON.stringify(merged.triggers), merged.reassuranceStyle, merged.communicationStyle,
      merged.companionNotes, merged.attachmentGuess, merged.readiness,
      JSON.stringify(merged.previousQuestions),
    );
  }
}

// ─── Intros / Passes / Debriefs ───

export function createIntro(userId: string, matchId: string, matchName: string) {
  const db = getDb();
  const id = createId("intro");
  db.prepare("INSERT INTO intros (id, user_id, match_id, match_name) VALUES (?, ?, ?, ?)").run(id, userId, matchId, matchName);
  return { id, matchId, matchName, status: "requested", createdAt: new Date().toISOString() };
}

export function getIntrosForUser(userId: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM intros WHERE user_id = ? ORDER BY created_at DESC").all(userId);
}

export function createPass(userId: string, matchId: string, matchName: string, reason: string) {
  const db = getDb();
  db.prepare("INSERT INTO passes (id, user_id, match_id, match_name, reason) VALUES (?, ?, ?, ?, ?)").run(createId("pass"), userId, matchId, matchName, reason);
}

export function createDebrief(userId: string, matchId: string, matchName: string, feedback: string, insight: string) {
  const db = getDb();
  db.prepare("INSERT INTO debriefs (id, user_id, match_id, match_name, feedback, insight) VALUES (?, ?, ?, ?, ?, ?)").run(createId("debrief"), userId, matchId, matchName, feedback, insight);
}

// ─── Waitlist ───

export function addToWaitlist(name: string, email: string, city: string, intent: string) {
  const db = getDb();
  const id = createId("wl");
  try {
    db.prepare("INSERT INTO waitlist (id, name, email, city, intent) VALUES (?, ?, ?, ?, ?)").run(id, name, email.toLowerCase(), city, intent);
    return { id, email: email.toLowerCase() };
  } catch {
    return null; // duplicate
  }
}

// ─── Helpers ───

function safeParseJson<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
