import { sql } from "./db";
import { randomUUID } from "node:crypto";
import type { Profile, Match, LifePreview, SessionMemory, DebriefReflection } from "./types";

function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

// ─── Account Handles ───

export async function getAccountHandleByUserId(userId: string) {
  const rows = await sql`
    SELECT user_id, email, username, full_name
    FROM account_handles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    userId: row.user_id as string,
    email: row.email as string,
    username: row.username as string,
    fullName: (row.full_name as string) || "",
  };
}

export async function getAccountHandleByUsername(username: string) {
  const rows = await sql`
    SELECT user_id, email, username, full_name
    FROM account_handles
    WHERE username = ${username}
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    userId: row.user_id as string,
    email: row.email as string,
    username: row.username as string,
    fullName: (row.full_name as string) || "",
  };
}

export async function upsertAccountHandle({
  userId,
  email,
  username,
  fullName,
}: {
  userId: string;
  email: string;
  username: string;
  fullName: string;
}) {
  await sql`
    INSERT INTO account_handles (user_id, email, username, full_name)
    VALUES (${userId}, ${email}, ${username}, ${fullName})
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      username = EXCLUDED.username,
      full_name = EXCLUDED.full_name,
      updated_at = NOW()
  `;
}

// ─── Profile ───

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const rows = await sql`SELECT * FROM profiles WHERE user_id = ${userId}`;
  if (!rows.length) return null;
  return rowToProfile(rows[0] as Record<string, unknown>);
}

export async function upsertProfile(userId: string, profile: Partial<Profile>) {
  const existing = await sql`SELECT id FROM profiles WHERE user_id = ${userId}`;

  const serializeArray = (value: string[] | undefined) =>
    value === undefined ? null : JSON.stringify(value);

  const dealbreakers = serializeArray(profile.dealbreakers);
  const growthAreas = serializeArray(profile.growthAreas);
  const strengths = serializeArray(profile.strengths);
  const coreValues = serializeArray(profile.coreValues);
  const photos = serializeArray(profile.photos);
  const offers = serializeArray(profile.offers);
  const needs = serializeArray(profile.needs);

  if (existing.length) {
    await sql`
      UPDATE profiles SET
        name = COALESCE(${profile.name ?? null}, name),
        age = COALESCE(${profile.age ?? null}, age),
        birthday = COALESCE(${profile.birthday ?? null}, birthday),
        zodiac = COALESCE(${profile.zodiac ?? null}, zodiac),
        city = COALESCE(${profile.city ?? null}, city),
        gender = COALESCE(${profile.gender ?? null}, gender),
        orientation = COALESCE(${profile.orientation ?? null}, orientation),
        partner_gender = COALESCE(${profile.partnerGender ?? null}, partner_gender),
        intent = COALESCE(${profile.intent ?? null}, intent),
        has_kids = COALESCE(${profile.hasKids ?? null}, has_kids),
        wants_kids = COALESCE(${profile.wantsKids ?? null}, wants_kids),
        love_language = COALESCE(${profile.loveLanguage ?? null}, love_language),
        drinking = COALESCE(${profile.drinking ?? null}, drinking),
        smoking = COALESCE(${profile.smoking ?? null}, smoking),
        exercise = COALESCE(${profile.exercise ?? null}, exercise),
        dealbreakers = COALESCE(${dealbreakers}, dealbreakers),
        partner_age_min = COALESCE(${profile.partnerAgeMin ?? null}, partner_age_min),
        partner_age_max = COALESCE(${profile.partnerAgeMax ?? null}, partner_age_max),
        attachment = COALESCE(${profile.attachment ?? null}, attachment),
        attachment_score = COALESCE(${profile.attachmentScore ?? null}, attachment_score),
        readiness_score = COALESCE(${profile.readinessScore ?? null}, readiness_score),
        growth_areas = COALESCE(${growthAreas}, growth_areas),
        strengths = COALESCE(${strengths}, strengths),
        core_values = COALESCE(${coreValues}, core_values),
        summary = COALESCE(${profile.summary ?? null}, summary),
        coaching_focus = COALESCE(${profile.coachingFocus ?? null}, coaching_focus),
        photos = COALESCE(${photos}, photos),
        conflict_style = COALESCE(${profile.conflictStyle ?? null}, conflict_style),
        family_expectations = COALESCE(${profile.familyExpectations ?? null}, family_expectations),
        life_architecture = COALESCE(${profile.lifeArchitecture ?? null}, life_architecture),
        offers = COALESCE(${offers}, offers),
        needs = COALESCE(${needs}, needs),
        updated_at = NOW()
      WHERE user_id = ${userId}
    `;
  } else {
    const id = createId("prof");
    await sql`
      INSERT INTO profiles (
        id, user_id, name, age, birthday, zodiac, city, gender, orientation,
        partner_gender, intent, has_kids, wants_kids, love_language, drinking, smoking, exercise,
        dealbreakers, partner_age_min, partner_age_max, attachment, attachment_score, readiness_score,
        growth_areas, strengths, core_values, summary, coaching_focus, photos,
        conflict_style, family_expectations, life_architecture, offers, needs
      ) VALUES (
        ${id}, ${userId}, ${profile.name || ""},
        ${profile.age ?? null}, ${profile.birthday ?? null},
        ${profile.zodiac ?? null}, ${profile.city || ""},
        ${profile.gender ?? null}, ${profile.orientation ?? null},
        ${profile.partnerGender ?? null}, ${profile.intent ?? null},
        ${profile.hasKids ?? null}, ${profile.wantsKids ?? null},
        ${profile.loveLanguage ?? null}, ${profile.drinking ?? null},
        ${profile.smoking ?? null}, ${profile.exercise ?? null},
        ${dealbreakers ?? "[]"}, ${profile.partnerAgeMin ?? null}, ${profile.partnerAgeMax ?? null},
        ${profile.attachment || "Secure"}, ${profile.attachmentScore ?? 50},
        ${profile.readinessScore ?? 50},
        ${growthAreas ?? "[]"}, ${strengths ?? "[]"}, ${coreValues ?? "[]"},
        ${profile.summary || ""}, ${profile.coachingFocus || ""}, ${photos ?? "[]"},
        ${profile.conflictStyle || ""}, ${profile.familyExpectations || ""},
        ${profile.lifeArchitecture || ""}, ${offers ?? "[]"}, ${needs ?? "[]"}
      )
    `;
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
    hasKids: row.has_kids as boolean | null,
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
    conflictStyle: (row.conflict_style as string) || "",
    familyExpectations: (row.family_expectations as string) || "",
    lifeArchitecture: (row.life_architecture as string) || "",
    offers: safeParseJson(row.offers as string, []),
    needs: safeParseJson(row.needs as string, []),
  };
}

// ─── Matches ───

export async function saveMatchesForUser(userId: string, matches: Match[]) {
  await sql`DELETE FROM matches WHERE user_id = ${userId}`;
  for (const m of matches) {
    await sql`
      INSERT INTO matches (id, user_id, match_data)
      VALUES (${m.id || createId("match")}, ${userId}, ${JSON.stringify(m)})
    `;
  }
}

export async function getMatchesForUser(userId: string): Promise<Match[]> {
  const rows = await sql`
    SELECT match_data FROM matches WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return (rows as { match_data: string }[])
    .map((r) => safeParseJson<Match>(r.match_data, null as unknown as Match))
    .filter(Boolean);
}

export async function getMatchForUser(userId: string, matchId: string): Promise<Match | null> {
  const rows = await sql`
    SELECT match_data FROM matches WHERE user_id = ${userId} AND id = ${matchId}
  `;
  if (rows.length) {
    return safeParseJson<Match>((rows[0] as { match_data: string }).match_data, null as unknown as Match);
  }
  const all = await getMatchesForUser(userId);
  return all.find((m) => m.id === matchId) || null;
}

// ─── L1 BiggDate: Daily match cache ───

export async function getCachedMatches(userId: string, date: string): Promise<Match[] | null> {
  const rows = await sql`
    SELECT matches_json FROM match_cache WHERE user_id = ${userId} AND cache_date = ${date}
  `;
  if (!rows.length) return null;
  return safeParseJson<Match[]>((rows[0] as { matches_json: string }).matches_json, null as unknown as Match[]);
}

export async function setCachedMatches(userId: string, date: string, matches: Match[]) {
  const id = createId("mc");
  await sql`
    INSERT INTO match_cache (id, user_id, cache_date, matches_json)
    VALUES (${id}, ${userId}, ${date}, ${JSON.stringify(matches)})
    ON CONFLICT (user_id, cache_date) DO UPDATE SET matches_json = EXCLUDED.matches_json
  `;
}

// ─── Life Previews ───

export async function saveLifePreview(userId: string, matchId: string, preview: LifePreview) {
  const id = createId("lp");
  await sql`
    INSERT INTO life_previews (id, user_id, match_id, preview_data)
    VALUES (${id}, ${userId}, ${matchId}, ${JSON.stringify(preview)})
    ON CONFLICT (user_id, match_id) DO UPDATE SET preview_data = EXCLUDED.preview_data
  `;
}

export async function getLifePreview(userId: string, matchId: string): Promise<LifePreview | null> {
  const rows = await sql`
    SELECT preview_data FROM life_previews WHERE user_id = ${userId} AND match_id = ${matchId}
  `;
  if (!rows.length) return null;
  return safeParseJson<LifePreview>((rows[0] as { preview_data: string }).preview_data, null as unknown as LifePreview);
}

// ─── Session Memory ───

export async function getSessionMemoryDb(userId: string, sessionKey: string): Promise<SessionMemory | null> {
  const rows = await sql`
    SELECT * FROM session_memory WHERE user_id = ${userId} AND session_key = ${sessionKey}
  `;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
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
    conversationPhase: ((row.conversation_phase as string) || "opening") as SessionMemory["conversationPhase"],
    coveredTopics: safeParseJson(row.covered_topics as string, []),
  };
}

export async function upsertSessionMemory(userId: string, sessionKey: string, patch: Partial<SessionMemory>) {
  const existing = await getSessionMemoryDb(userId, sessionKey);

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
    conversationPhase: patch.conversationPhase || existing?.conversationPhase || "opening",
    coveredTopics: mergeArr(existing?.coveredTopics || [], patch.coveredTopics || [], 30),
  };

  if (existing) {
    await sql`
      UPDATE session_memory SET
        summary = ${merged.summary},
        traits = ${JSON.stringify(merged.traits)},
        needs = ${JSON.stringify(merged.needs)},
        boundaries = ${JSON.stringify(merged.boundaries)},
        emotional_patterns = ${JSON.stringify(merged.emotionalPatterns)},
        triggers = ${JSON.stringify(merged.triggers)},
        reassurance_style = ${merged.reassuranceStyle},
        communication_style = ${merged.communicationStyle},
        companion_notes = ${merged.companionNotes},
        attachment_guess = ${merged.attachmentGuess},
        readiness = ${merged.readiness ?? null},
        previous_questions = ${JSON.stringify(merged.previousQuestions)},
        conversation_phase = ${merged.conversationPhase},
        covered_topics = ${JSON.stringify(merged.coveredTopics)},
        updated_at = NOW()
      WHERE user_id = ${userId} AND session_key = ${sessionKey}
    `;
  } else {
    await sql`
      INSERT INTO session_memory (
        id, user_id, session_key, summary, traits, needs, boundaries,
        emotional_patterns, triggers, reassurance_style, communication_style,
        companion_notes, attachment_guess, readiness, previous_questions,
        conversation_phase, covered_topics
      ) VALUES (
        ${createId("mem")}, ${userId}, ${sessionKey},
        ${merged.summary}, ${JSON.stringify(merged.traits)}, ${JSON.stringify(merged.needs)},
        ${JSON.stringify(merged.boundaries)}, ${JSON.stringify(merged.emotionalPatterns)},
        ${JSON.stringify(merged.triggers)}, ${merged.reassuranceStyle},
        ${merged.communicationStyle}, ${merged.companionNotes}, ${merged.attachmentGuess},
        ${merged.readiness ?? null}, ${JSON.stringify(merged.previousQuestions)},
        ${merged.conversationPhase}, ${JSON.stringify(merged.coveredTopics)}
      )
    `;
  }
}

// ─── Intros / Passes / Debriefs ───

export async function createIntro(userId: string, matchId: string, matchName: string, icebreakers: string[] = []) {
  const id = createId("intro");
  await sql`
    INSERT INTO intros (id, user_id, match_id, match_name, icebreakers)
    VALUES (${id}, ${userId}, ${matchId}, ${matchName}, ${JSON.stringify(icebreakers)})
  `;
  return { id, matchId, matchName, status: "requested", icebreakers, createdAt: new Date().toISOString() };
}

export async function getIntrosForUser(userId: string) {
  const rows = await sql`SELECT * FROM intros WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      ...row,
      icebreakers: safeParseJson(row.icebreakers as string, []),
    };
  });
}

export async function updateIntroWithIcebreakers(introId: string, icebreakers: string[]) {
  await sql`UPDATE intros SET icebreakers = ${JSON.stringify(icebreakers)} WHERE id = ${introId}`;
}

export async function updateIntroDateNudge(introId: string, venueSuggestion: string) {
  await sql`
    UPDATE intros SET date_nudge_sent_at = NOW(), venue_suggestion = ${venueSuggestion}
    WHERE id = ${introId}
  `;
}

export async function createPass(userId: string, matchId: string, matchName: string, reason: string) {
  await sql`
    INSERT INTO passes (id, user_id, match_id, match_name, reason)
    VALUES (${createId("pass")}, ${userId}, ${matchId}, ${matchName}, ${reason})
  `;
}

export async function createDebrief(userId: string, matchId: string, matchName: string, feedback: string, insight: string) {
  await sql`
    INSERT INTO debriefs (id, user_id, match_id, match_name, feedback, insight)
    VALUES (${createId("debrief")}, ${userId}, ${matchId}, ${matchName}, ${feedback}, ${insight})
  `;
}

// ─── L4 BiggDate: Structured debrief reflections ───

export async function createDebriefReflection(
  userId: string,
  matchId: string,
  matchName: string,
  answers: { chemistry: string; surprise: string; decision: string },
  chemistryScore: number | null,
  wouldSeeAgain: boolean | null,
  aiInsight: string,
): Promise<DebriefReflection> {
  const id = createId("dr");
  await sql`
    INSERT INTO debrief_reflections (
      id, user_id, match_id, match_name,
      chemistry_answer, surprise_answer, decision_answer,
      chemistry_score, would_see_again, ai_insight
    ) VALUES (
      ${id}, ${userId}, ${matchId}, ${matchName},
      ${answers.chemistry}, ${answers.surprise}, ${answers.decision},
      ${chemistryScore ?? null}, ${wouldSeeAgain ?? null}, ${aiInsight}
    )
  `;
  return {
    id, matchId, matchName,
    chemistryAnswer: answers.chemistry,
    surpriseAnswer: answers.surprise,
    decisionAnswer: answers.decision,
    chemistryScore, wouldSeeAgain, aiInsight,
    createdAt: new Date().toISOString(),
  };
}

export async function getDebriefReflectionsForUser(userId: string): Promise<DebriefReflection[]> {
  const rows = await sql`
    SELECT * FROM debrief_reflections WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return (rows as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    matchId: row.match_id as string,
    matchName: row.match_name as string,
    chemistryAnswer: (row.chemistry_answer as string) || "",
    surpriseAnswer: (row.surprise_answer as string) || "",
    decisionAnswer: (row.decision_answer as string) || "",
    chemistryScore: row.chemistry_score as number | null,
    wouldSeeAgain: row.would_see_again as boolean | null,
    aiInsight: (row.ai_insight as string) || "",
    createdAt: (row.created_at as string) || "",
  }));
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
