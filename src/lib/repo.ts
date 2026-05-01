import { sql } from "./db";
import { randomUUID } from "node:crypto";
import type {
  Profile,
  ProfilePrompt,
  Match,
  LifePreview,
  SessionMemory,
  DebriefReflection,
  Thread,
  Message,
  SoulKnockResponse,
  UsageCounter,
  GatedAction,
  PlanGateResult,
  PulsePostType,
} from "./types";

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
  const languages = serializeArray(profile.languages);
  const interests = serializeArray(profile.interests);
  const pets = serializeArray(profile.pets);
  const prompts = profile.prompts === undefined ? null : JSON.stringify(profile.prompts);
  const attractionPreferences = serializeArray(profile.attractionPreferences);
  const turnOns = serializeArray(profile.turnOns);
  const turnOffs = serializeArray(profile.turnOffs);
  const loveLanguageGive = serializeArray(profile.loveLanguageGive);
  const loveLanguageReceive = serializeArray(profile.loveLanguageReceive);

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
        pronouns = COALESCE(${profile.pronouns ?? null}, pronouns),
        hometown = COALESCE(${profile.hometown ?? null}, hometown),
        job_title = COALESCE(${profile.jobTitle ?? null}, job_title),
        company = COALESCE(${profile.company ?? null}, company),
        education = COALESCE(${profile.education ?? null}, education),
        height = COALESCE(${profile.height ?? null}, height),
        religion = COALESCE(${profile.religion ?? null}, religion),
        politics = COALESCE(${profile.politics ?? null}, politics),
        ethnicity = COALESCE(${profile.ethnicity ?? null}, ethnicity),
        partner_gender = COALESCE(${profile.partnerGender ?? null}, partner_gender),
        intent = COALESCE(${profile.intent ?? null}, intent),
        relationship_style = COALESCE(${profile.relationshipStyle ?? null}, relationship_style),
        has_kids = COALESCE(${profile.hasKids ?? null}, has_kids),
        wants_kids = COALESCE(${profile.wantsKids ?? null}, wants_kids),
        love_language = COALESCE(${profile.loveLanguage ?? null}, love_language),
        drinking = COALESCE(${profile.drinking ?? null}, drinking),
        smoking = COALESCE(${profile.smoking ?? null}, smoking),
        exercise = COALESCE(${profile.exercise ?? null}, exercise),
        sleep_schedule = COALESCE(${profile.sleepSchedule ?? null}, sleep_schedule),
        social_battery = COALESCE(${profile.socialBattery ?? null}, social_battery),
        diet = COALESCE(${profile.diet ?? null}, diet),
        weekend_style = COALESCE(${profile.weekendStyle ?? null}, weekend_style),
        travel_style = COALESCE(${profile.travelStyle ?? null}, travel_style),
        cleanliness = COALESCE(${profile.cleanliness ?? null}, cleanliness),
        languages = COALESCE(${languages}, languages),
        interests = COALESCE(${interests}, interests),
        pets = COALESCE(${pets}, pets),
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
        prompts = COALESCE(${prompts}, prompts),
        profile_visibility = COALESCE(${profile.profileVisibility ?? null}, profile_visibility),
        show_age = COALESCE(${profile.showAge ?? null}, show_age),
        show_city = COALESCE(${profile.showCity ?? null}, show_city),
        show_work = COALESCE(${profile.showWork ?? null}, show_work),
        show_education = COALESCE(${profile.showEducation ?? null}, show_education),
        conflict_style = COALESCE(${profile.conflictStyle ?? null}, conflict_style),
        family_expectations = COALESCE(${profile.familyExpectations ?? null}, family_expectations),
        life_architecture = COALESCE(${profile.lifeArchitecture ?? null}, life_architecture),
        offers = COALESCE(${offers}, offers),
        needs = COALESCE(${needs}, needs),
        attraction_preferences = COALESCE(${attractionPreferences}, attraction_preferences),
        turn_ons = COALESCE(${turnOns}, turn_ons),
        turn_offs = COALESCE(${turnOffs}, turn_offs),
        relationship_timeline = COALESCE(${profile.relationshipTimeline ?? null}, relationship_timeline),
        dating_stage = COALESCE(${profile.datingStage ?? null}, dating_stage),
        long_distance_open = COALESCE(${profile.longDistanceOpen ?? null}, long_distance_open),
        emotional_availability = COALESCE(${profile.emotionalAvailability ?? null}, emotional_availability),
        residency_status = COALESCE(${profile.residencyStatus ?? null}, residency_status),
        relocation_open = COALESCE(${profile.relocationOpen ?? null}, relocation_open),
        work_intensity = COALESCE(${profile.workIntensity ?? null}, work_intensity),
        family_involvement = COALESCE(${profile.familyInvolvement ?? null}, family_involvement),
        cultural_alignment = COALESCE(${profile.culturalAlignment ?? null}, cultural_alignment),
        marriage_type = COALESCE(${profile.marriageType ?? null}, marriage_type),
        love_language_give = COALESCE(${loveLanguageGive}, love_language_give),
        love_language_receive = COALESCE(${loveLanguageReceive}, love_language_receive),
        linkedin_url = COALESCE(${profile.linkedinUrl ?? null}, linkedin_url),
        website_url = COALESCE(${profile.websiteUrl ?? null}, website_url),
        updated_at = NOW()
      WHERE user_id = ${userId}
    `;
  } else {
    const id = createId("prof");
    await sql`
      INSERT INTO profiles (
        id, user_id, name, age, birthday, zodiac, city, gender, orientation,
        pronouns, hometown, job_title, company, education, height, religion, politics, ethnicity,
        partner_gender, intent, relationship_style, has_kids, wants_kids, love_language, drinking, smoking, exercise,
        sleep_schedule, social_battery, diet, weekend_style, travel_style, cleanliness,
        languages, interests, pets,
        dealbreakers, partner_age_min, partner_age_max, attachment, attachment_score, readiness_score,
        growth_areas, strengths, core_values, summary, coaching_focus, photos, prompts,
        profile_visibility, show_age, show_city, show_work, show_education,
        conflict_style, family_expectations, life_architecture, offers, needs,
        attraction_preferences, turn_ons, turn_offs,
        relationship_timeline, dating_stage, long_distance_open, emotional_availability,
        residency_status, relocation_open, work_intensity,
        family_involvement, cultural_alignment, marriage_type,
        love_language_give, love_language_receive, linkedin_url, website_url
      ) VALUES (
        ${id}, ${userId}, ${profile.name || ""},
        ${profile.age ?? null}, ${profile.birthday ?? null},
        ${profile.zodiac ?? null}, ${profile.city || ""},
        ${profile.gender ?? null}, ${profile.orientation ?? null},
        ${profile.pronouns ?? null}, ${profile.hometown ?? null}, ${profile.jobTitle ?? null},
        ${profile.company ?? null}, ${profile.education ?? null}, ${profile.height ?? null},
        ${profile.religion ?? null}, ${profile.politics ?? null}, ${profile.ethnicity ?? null},
        ${profile.partnerGender ?? null}, ${profile.intent ?? null}, ${profile.relationshipStyle ?? null},
        ${profile.hasKids ?? null}, ${profile.wantsKids ?? null},
        ${profile.loveLanguage ?? null}, ${profile.drinking ?? null},
        ${profile.smoking ?? null}, ${profile.exercise ?? null},
        ${profile.sleepSchedule ?? null}, ${profile.socialBattery ?? null}, ${profile.diet ?? null},
        ${profile.weekendStyle ?? null}, ${profile.travelStyle ?? null}, ${profile.cleanliness ?? null},
        ${languages ?? "[]"}, ${interests ?? "[]"}, ${pets ?? "[]"},
        ${dealbreakers ?? "[]"}, ${profile.partnerAgeMin ?? null}, ${profile.partnerAgeMax ?? null},
        ${profile.attachment || "Secure"}, ${profile.attachmentScore ?? 50},
        ${profile.readinessScore ?? 50},
        ${growthAreas ?? "[]"}, ${strengths ?? "[]"}, ${coreValues ?? "[]"},
        ${profile.summary || ""}, ${profile.coachingFocus || ""}, ${photos ?? "[]"}, ${prompts ?? "[]"},
        ${profile.profileVisibility ?? "visible"}, ${profile.showAge ?? true},
        ${profile.showCity ?? true}, ${profile.showWork ?? true}, ${profile.showEducation ?? true},
        ${profile.conflictStyle || ""}, ${profile.familyExpectations || ""},
        ${profile.lifeArchitecture || ""}, ${offers ?? "[]"}, ${needs ?? "[]"},
        ${attractionPreferences ?? "[]"}, ${turnOns ?? "[]"}, ${turnOffs ?? "[]"},
        ${profile.relationshipTimeline ?? null}, ${profile.datingStage ?? null},
        ${profile.longDistanceOpen ?? null}, ${profile.emotionalAvailability ?? null},
        ${profile.residencyStatus ?? null}, ${profile.relocationOpen ?? null}, ${profile.workIntensity ?? null},
        ${profile.familyInvolvement ?? null}, ${profile.culturalAlignment ?? null}, ${profile.marriageType ?? null},
        ${loveLanguageGive ?? "[]"}, ${loveLanguageReceive ?? "[]"},
        ${profile.linkedinUrl || ""}, ${profile.websiteUrl || ""}
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
    pronouns: row.pronouns as string | null,
    hometown: row.hometown as string | null,
    jobTitle: row.job_title as string | null,
    company: row.company as string | null,
    education: row.education as string | null,
    height: row.height as string | null,
    religion: row.religion as string | null,
    politics: row.politics as string | null,
    ethnicity: row.ethnicity as string | null,
    partnerGender: row.partner_gender as string | null,
    intent: row.intent as Profile["intent"],
    relationshipStyle: row.relationship_style as string | null,
    hasKids: row.has_kids as boolean | null,
    wantsKids: row.wants_kids as Profile["wantsKids"],
    loveLanguage: row.love_language as string | null,
    drinking: row.drinking as Profile["drinking"],
    smoking: row.smoking as Profile["smoking"],
    exercise: row.exercise as Profile["exercise"],
    sleepSchedule: row.sleep_schedule as string | null,
    socialBattery: row.social_battery as string | null,
    diet: row.diet as string | null,
    weekendStyle: row.weekend_style as string | null,
    travelStyle: row.travel_style as string | null,
    cleanliness: row.cleanliness as string | null,
    languages: safeParseJson(row.languages as string, []),
    interests: safeParseJson(row.interests as string, []),
    pets: safeParseJson(row.pets as string, []),
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
    prompts: safeParseJson<ProfilePrompt[]>(row.prompts as string, []),
    profileVisibility: ((row.profile_visibility as string) || "visible") as Profile["profileVisibility"],
    showAge: row.show_age == null ? true : Boolean(row.show_age),
    showCity: row.show_city == null ? true : Boolean(row.show_city),
    showWork: row.show_work == null ? true : Boolean(row.show_work),
    showEducation: row.show_education == null ? true : Boolean(row.show_education),
    conflictStyle: (row.conflict_style as string) || "",
    familyExpectations: (row.family_expectations as string) || "",
    lifeArchitecture: (row.life_architecture as string) || "",
    offers: safeParseJson(row.offers as string, []),
    needs: safeParseJson(row.needs as string, []),
    attractionPreferences: safeParseJson(row.attraction_preferences as string, []),
    turnOns: safeParseJson(row.turn_ons as string, []),
    turnOffs: safeParseJson(row.turn_offs as string, []),
    relationshipTimeline: row.relationship_timeline as string | null,
    datingStage: row.dating_stage as string | null,
    longDistanceOpen: row.long_distance_open as string | null,
    emotionalAvailability: row.emotional_availability as string | null,
    residencyStatus: row.residency_status as string | null,
    relocationOpen: row.relocation_open as string | null,
    workIntensity: row.work_intensity as string | null,
    familyInvolvement: row.family_involvement as string | null,
    culturalAlignment: row.cultural_alignment as string | null,
    marriageType: row.marriage_type as string | null,
    loveLanguageGive: safeParseJson(row.love_language_give as string, []),
    loveLanguageReceive: safeParseJson(row.love_language_receive as string, []),
    linkedinUrl: (row.linkedin_url as string) || null,
    websiteUrl: (row.website_url as string) || null,
  };
}

// ─── Matches ───

export async function saveMatchesForUser(userId: string, matches: Match[]) {
  await sql`DELETE FROM matches WHERE user_id = ${userId}`;
  for (const m of matches) {
    const matchedUserId = m.matchedUserId ?? null;
    const photosUnlocked = m.photosUnlocked ?? false;
    await sql`
      INSERT INTO matches (id, user_id, match_data, matched_user_id, photos_unlocked)
      VALUES (${m.id || createId("match")}, ${userId}, ${JSON.stringify(m)}, ${matchedUserId}, ${photosUnlocked})
    `;
  }
}

export async function getMatchesForUser(userId: string): Promise<Match[]> {
  const rows = await sql`
    SELECT match_data, matched_user_id, photos_unlocked
    FROM matches WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return (rows as { match_data: string; matched_user_id: string | null; photos_unlocked: boolean }[])
    .map((r) => {
      const m = safeParseJson<Match>(r.match_data, null as unknown as Match);
      if (!m) return null;
      return {
        ...m,
        matchedUserId: r.matched_user_id ?? m.matchedUserId,
        photosUnlocked: r.photos_unlocked ?? m.photosUnlocked ?? false,
      };
    })
    .filter(Boolean) as Match[];
}

export async function getMatchForUser(userId: string, matchId: string): Promise<Match | null> {
  const rows = await sql`
    SELECT match_data, matched_user_id, photos_unlocked
    FROM matches WHERE user_id = ${userId} AND id = ${matchId}
  `;
  if (rows.length) {
    const r = rows[0] as { match_data: string; matched_user_id: string | null; photos_unlocked: boolean };
    const m = safeParseJson<Match>(r.match_data, null as unknown as Match);
    if (!m) return null;
    return {
      ...m,
      matchedUserId: r.matched_user_id ?? m.matchedUserId,
      photosUnlocked: r.photos_unlocked ?? m.photosUnlocked ?? false,
    };
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
    // Maahi v3
    stableTraits: safeParseJson(row.stable_traits as string, []),
    growthEdges: safeParseJson(row.growth_edges as string, []),
    currentSituation: (row.current_situation as string) || "",
    recurringThemes: safeParseJson(row.recurring_themes as string, []),
    lastEmotionalState: (row.last_emotional_state as string) || "",
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
    // Maahi v3
    stableTraits: mergeArr(existing?.stableTraits || [], patch.stableTraits || [], 8),
    growthEdges: mergeArr(existing?.growthEdges || [], patch.growthEdges || [], 8),
    currentSituation: patch.currentSituation || existing?.currentSituation || "",
    recurringThemes: mergeArr(existing?.recurringThemes || [], patch.recurringThemes || [], 8),
    lastEmotionalState: patch.lastEmotionalState || existing?.lastEmotionalState || "",
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
        stable_traits = ${JSON.stringify(merged.stableTraits)},
        growth_edges = ${JSON.stringify(merged.growthEdges)},
        current_situation = ${merged.currentSituation},
        recurring_themes = ${JSON.stringify(merged.recurringThemes)},
        last_emotional_state = ${merged.lastEmotionalState},
        updated_at = NOW()
      WHERE user_id = ${userId} AND session_key = ${sessionKey}
    `;
  } else {
    await sql`
      INSERT INTO session_memory (
        id, user_id, session_key, summary, traits, needs, boundaries,
        emotional_patterns, triggers, reassurance_style, communication_style,
        companion_notes, attachment_guess, readiness, previous_questions,
        conversation_phase, covered_topics,
        stable_traits, growth_edges, current_situation, recurring_themes, last_emotional_state
      ) VALUES (
        ${createId("mem")}, ${userId}, ${sessionKey},
        ${merged.summary}, ${JSON.stringify(merged.traits)}, ${JSON.stringify(merged.needs)},
        ${JSON.stringify(merged.boundaries)}, ${JSON.stringify(merged.emotionalPatterns)},
        ${JSON.stringify(merged.triggers)}, ${merged.reassuranceStyle},
        ${merged.communicationStyle}, ${merged.companionNotes}, ${merged.attachmentGuess},
        ${merged.readiness ?? null}, ${JSON.stringify(merged.previousQuestions)},
        ${merged.conversationPhase}, ${JSON.stringify(merged.coveredTopics)},
        ${JSON.stringify(merged.stableTraits)}, ${JSON.stringify(merged.growthEdges)},
        ${merged.currentSituation}, ${JSON.stringify(merged.recurringThemes)},
        ${merged.lastEmotionalState}
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

// ─── User Plans ───

export interface UserPlan {
  id: string;
  userId: string;
  plan: "free" | "premium" | "pro";
  status: "active" | "trialing" | "inactive" | "canceled";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const rows = await sql`SELECT * FROM user_plans WHERE user_id = ${userId} LIMIT 1`;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    plan: (row.plan as "free" | "premium" | "pro") ?? "free",
    status: (row.status as UserPlan["status"]) ?? "inactive",
    stripeCustomerId: (row.stripe_customer_id as string) ?? null,
    stripeSubscriptionId: (row.stripe_subscription_id as string) ?? null,
    trialEndsAt: (row.trial_ends_at as string) ?? null,
    currentPeriodEnd: (row.current_period_end as string) ?? null,
  };
}

export async function upsertUserPlan(userId: string, data: Partial<Omit<UserPlan, "id" | "userId">>) {
  const existing = await getUserPlan(userId);
  if (existing) {
    await sql`
      UPDATE user_plans SET
        plan = COALESCE(${data.plan ?? null}, plan),
        status = COALESCE(${data.status ?? null}, status),
        stripe_customer_id = COALESCE(${data.stripeCustomerId ?? null}, stripe_customer_id),
        stripe_subscription_id = COALESCE(${data.stripeSubscriptionId ?? null}, stripe_subscription_id),
        trial_ends_at = COALESCE(${data.trialEndsAt ?? null}, trial_ends_at),
        current_period_end = COALESCE(${data.currentPeriodEnd ?? null}, current_period_end),
        updated_at = NOW()
      WHERE user_id = ${userId}
    `;
  } else {
    await sql`
      INSERT INTO user_plans (id, user_id, plan, status, stripe_customer_id, stripe_subscription_id, trial_ends_at, current_period_end)
      VALUES (
        ${createId("plan")}, ${userId},
        ${data.plan ?? "free"}, ${data.status ?? "inactive"},
        ${data.stripeCustomerId ?? null}, ${data.stripeSubscriptionId ?? null},
        ${data.trialEndsAt ?? null}, ${data.currentPeriodEnd ?? null}
      )
    `;
  }
}

export async function getUserPlanByStripeCustomer(stripeCustomerId: string): Promise<UserPlan | null> {
  const rows = await sql`SELECT * FROM user_plans WHERE stripe_customer_id = ${stripeCustomerId} LIMIT 1`;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    plan: (row.plan as "free" | "premium" | "pro") ?? "free",
    status: (row.status as UserPlan["status"]) ?? "inactive",
    stripeCustomerId: (row.stripe_customer_id as string) ?? null,
    stripeSubscriptionId: (row.stripe_subscription_id as string) ?? null,
    trialEndsAt: (row.trial_ends_at as string) ?? null,
    currentPeriodEnd: (row.current_period_end as string) ?? null,
  };
}

// ─── Seen Matches ───

export async function markUserSeen(userId: string, matchedUserId: string) {
  await sql`
    INSERT INTO seen_matches (user_id, matched_user_id, matched_date)
    VALUES (${userId}, ${matchedUserId}, CURRENT_DATE)
    ON CONFLICT DO NOTHING
  `;
}

export async function getSeenUserIds(userId: string): Promise<string[]> {
  const rows = await sql`
    SELECT matched_user_id FROM seen_matches WHERE user_id = ${userId}
  `;
  return (rows as { matched_user_id: string }[]).map((r) => r.matched_user_id);
}

// ─── Blocked Users ───

export async function blockUser(blockerId: string, blockedId: string) {
  await sql`
    INSERT INTO blocked_users (id, blocker_id, blocked_id)
    VALUES (${createId("block")}, ${blockerId}, ${blockedId})
    ON CONFLICT (blocker_id, blocked_id) DO NOTHING
  `;
}

export async function getBlockedUserIds(userId: string): Promise<string[]> {
  const rows = await sql`
    SELECT blocked_id AS other_id FROM blocked_users WHERE blocker_id = ${userId}
    UNION
    SELECT blocker_id AS other_id FROM blocked_users WHERE blocked_id = ${userId}
  `;
  return (rows as { other_id: string }[]).map((r) => r.other_id);
}

// ─── Real User Candidates ───

export interface CandidateProfile {
  userId: string;
  email: string;
  profile: Profile;
}

export async function getRealUserCandidates(
  userId: string,
  userProfile: Profile,
): Promise<CandidateProfile[]> {
  const seenIds = await getSeenUserIds(userId);
  const blockedIds = await getBlockedUserIds(userId);
  const excludeIds = Array.from(new Set([userId, ...seenIds, ...blockedIds]));

  // Build query with hard filters
  const partnerGender = userProfile.partnerGender ?? null;
  const ageMin = userProfile.partnerAgeMin ?? null;
  const ageMax = userProfile.partnerAgeMax ?? null;

  // We fetch up to 10 candidates and let the AI pick from them
  const rows = await sql`
    SELECT p.*, ah.email
    FROM profiles p
    JOIN account_handles ah ON ah.user_id = p.user_id
    WHERE p.user_id != ALL(${excludeIds}::text[])
      AND p.profile_visibility = 'visible'
      AND (${partnerGender}::text IS NULL OR p.gender = ${partnerGender})
      AND (${ageMin}::int IS NULL OR p.age >= ${ageMin})
      AND (${ageMax}::int IS NULL OR p.age <= ${ageMax})
    ORDER BY p.created_at DESC
    LIMIT 10
  `;

  return (rows as Record<string, unknown>[]).map((row) => ({
    userId: row.user_id as string,
    email: row.email as string,
    profile: rowToProfile(row),
  }));
}

// ─── Soul Knock Responses ───

export async function saveSoulKnockResponse(
  introId: string,
  userId: string,
  response: string,
): Promise<SoulKnockResponse> {
  const id = createId("skr");
  const now = new Date().toISOString();
  await sql`
    INSERT INTO soul_knock_responses (id, intro_id, user_id, response)
    VALUES (${id}, ${introId}, ${userId}, ${response})
    ON CONFLICT (intro_id, user_id) DO UPDATE SET response = EXCLUDED.response
  `;
  return { id, introId, userId, response, createdAt: now };
}

export async function getSoulKnockResponses(introId: string): Promise<SoulKnockResponse[]> {
  const rows = await sql`
    SELECT * FROM soul_knock_responses WHERE intro_id = ${introId}
  `;
  return (rows as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    introId: row.intro_id as string,
    userId: row.user_id as string,
    response: row.response as string,
    createdAt: row.created_at as string,
  }));
}

// Mark an intro's answered flag for a given side
export async function markIntroAnswered(introId: string, side: "sender" | "receiver") {
  if (side === "sender") {
    await sql`UPDATE intros SET sender_answered = true WHERE id = ${introId}`;
  } else {
    await sql`UPDATE intros SET receiver_answered = true WHERE id = ${introId}`;
  }
}

// Returns the intro row (used to check mutual answer state)
export async function getIntroById(introId: string) {
  const rows = await sql`SELECT * FROM intros WHERE id = ${introId}`;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    matchId: row.match_id as string,
    matchName: row.match_name as string,
    matchedUserId: row.matched_user_id as string | null,
    soulKnockQuestion: row.soul_knock_question as string | null,
    senderAnswered: Boolean(row.sender_answered),
    receiverAnswered: Boolean(row.receiver_answered),
    icebreakers: safeParseJson(row.icebreakers as string, []),
    createdAt: row.created_at as string,
  };
}

// Update intro with matched_user_id + soul_knock_question when sent
export async function updateIntroForSoulKnock(
  introId: string,
  matchedUserId: string,
  soulKnockQuestion: string,
) {
  await sql`
    UPDATE intros
    SET matched_user_id = ${matchedUserId},
        soul_knock_question = ${soulKnockQuestion},
        sender_answered = true
    WHERE id = ${introId}
  `;
}

// Get all intros where this user is the receiver (their soul knock inbox)
export async function getIntrosReceivedByUser(userId: string) {
  const rows = await sql`
    SELECT i.*, p.name AS sender_name, p.photos AS sender_photos
    FROM intros i
    JOIN profiles p ON p.user_id = i.user_id
    WHERE i.matched_user_id = ${userId}
    ORDER BY i.created_at DESC
  `;
  return (rows as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    senderUserId: row.user_id as string,
    senderName: row.sender_name as string,
    senderPhotos: safeParseJson<string[]>(row.sender_photos as string, []),
    matchId: row.match_id as string,
    matchName: row.match_name as string,
    soulKnockQuestion: row.soul_knock_question as string | null,
    senderAnswered: Boolean(row.sender_answered),
    receiverAnswered: Boolean(row.receiver_answered),
    createdAt: row.created_at as string,
  }));
}

// ─── Threads ───

export async function createThread(userAId: string, userBId: string, introId: string): Promise<Thread> {
  const id = createId("thread");
  const now = new Date().toISOString();
  await sql`
    INSERT INTO threads (id, user_a_id, user_b_id, intro_id)
    VALUES (${id}, ${userAId}, ${userBId}, ${introId})
    ON CONFLICT (intro_id) DO NOTHING
  `;
  // Return the actual row (in case DO NOTHING hit)
  const rows = await sql`SELECT * FROM threads WHERE intro_id = ${introId}`;
  const row = rows[0] as Record<string, unknown>;
  return {
    id: row.id as string,
    userAId: row.user_a_id as string,
    userBId: row.user_b_id as string,
    introId: row.intro_id as string,
    createdAt: (row.created_at as string) || now,
  };
}

export async function getThreadsForUser(userId: string): Promise<Thread[]> {
  const rows = await sql`
    SELECT
      t.*,
      CASE WHEN t.user_a_id = ${userId} THEN pb.name ELSE pa.name END AS other_name,
      CASE WHEN t.user_a_id = ${userId} THEN pb.photos ELSE pa.photos END AS other_photos,
      m.body AS last_message,
      m.created_at AS last_message_at,
      (
        SELECT COUNT(*)::int FROM messages
        WHERE thread_id = t.id AND sender_id != ${userId} AND read_at IS NULL
      ) AS unread_count
    FROM threads t
    JOIN profiles pa ON pa.user_id = t.user_a_id
    JOIN profiles pb ON pb.user_id = t.user_b_id
    LEFT JOIN LATERAL (
      SELECT body, created_at FROM messages
      WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1
    ) m ON true
    WHERE t.user_a_id = ${userId} OR t.user_b_id = ${userId}
    ORDER BY COALESCE(m.created_at, t.created_at) DESC
  `;
  return (rows as Record<string, unknown>[]).map((row) => {
    const otherPhotos = safeParseJson<string[]>(row.other_photos as string, []);
    return {
      id: row.id as string,
      userAId: row.user_a_id as string,
      userBId: row.user_b_id as string,
      introId: row.intro_id as string,
      createdAt: row.created_at as string,
      otherUserName: row.other_name as string,
      otherUserPhoto: otherPhotos[0] ?? undefined,
      lastMessage: row.last_message as string | undefined,
      lastMessageAt: row.last_message_at as string | undefined,
      unreadCount: (row.unread_count as number) ?? 0,
    };
  });
}

export async function getThreadById(threadId: string, userId: string): Promise<Thread | null> {
  const rows = await sql`
    SELECT t.*,
      CASE WHEN t.user_a_id = ${userId} THEN pb.name ELSE pa.name END AS other_name,
      CASE WHEN t.user_a_id = ${userId} THEN pb.photos ELSE pa.photos END AS other_photos
    FROM threads t
    JOIN profiles pa ON pa.user_id = t.user_a_id
    JOIN profiles pb ON pb.user_id = t.user_b_id
    WHERE t.id = ${threadId}
      AND (t.user_a_id = ${userId} OR t.user_b_id = ${userId})
  `;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  const otherPhotos = safeParseJson<string[]>(row.other_photos as string, []);
  return {
    id: row.id as string,
    userAId: row.user_a_id as string,
    userBId: row.user_b_id as string,
    introId: row.intro_id as string,
    createdAt: row.created_at as string,
    otherUserName: row.other_name as string,
    otherUserPhoto: otherPhotos[0] ?? undefined,
  };
}

// ─── Messages ───

export async function getMessages(threadId: string): Promise<Message[]> {
  const rows = await sql`
    SELECT * FROM messages WHERE thread_id = ${threadId} ORDER BY created_at ASC
  `;
  return (rows as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    threadId: row.thread_id as string,
    senderId: row.sender_id as string,
    body: row.body as string,
    createdAt: row.created_at as string,
    readAt: (row.read_at as string) || null,
  }));
}

export async function createMessage(threadId: string, senderId: string, body: string): Promise<Message> {
  const id = createId("msg");
  const now = new Date().toISOString();
  await sql`
    INSERT INTO messages (id, thread_id, sender_id, body)
    VALUES (${id}, ${threadId}, ${senderId}, ${body})
  `;
  return { id, threadId, senderId, body, createdAt: now, readAt: null };
}

export async function markMessagesRead(threadId: string, readerId: string) {
  await sql`
    UPDATE messages
    SET read_at = NOW()
    WHERE thread_id = ${threadId} AND sender_id != ${readerId} AND read_at IS NULL
  `;
}

// ─── Photo Unlock ───

export async function unlockPhotosForBothUsers(introId: string) {
  // intro has user_id (sender) and matched_user_id (receiver)
  // matches are keyed by (user_id, match_id) — we find both rows by intro
  await sql`
    UPDATE matches
    SET photos_unlocked = true
    WHERE id IN (
      SELECT m.id FROM matches m
      JOIN intros i ON i.match_id = m.id
      WHERE i.id = ${introId}
        AND (m.user_id = i.user_id OR m.user_id = i.matched_user_id)
    )
  `;
}

// ─── Usage Counters / Plan Gate ───

const PLAN_LIMITS: Record<string, Record<string, number>> = {
  soul_knock:     { free: 3,  premium: 15, pro: Infinity },
  maahi_session:  { free: 3,  premium: 15, pro: Infinity },
  life_preview:   { free: 0,  premium: 2,  pro: Infinity },
  daily_matches:  { free: 5,  premium: 20, pro: Infinity },
};

// Period start for each action: daily | weekly | monthly
function periodStart(action: GatedAction): string {
  const now = new Date();
  if (action === "maahi_session") {
    // start of ISO week (Monday)
    const day = now.getDay(); // 0=Sun
    const diff = (day + 6) % 7;
    now.setDate(now.getDate() - diff);
  } else if (action === "life_preview") {
    now.setDate(1);
  }
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function requirePlan(userId: string, action: GatedAction): Promise<PlanGateResult> {
  const planRow = await getUserPlan(userId);
  const plan = (planRow?.status === "active" || planRow?.status === "trialing")
    ? (planRow.plan ?? "free")
    : "free";

  const limit = PLAN_LIMITS[action]?.[plan] ?? 0;
  if (limit === Infinity) return { allowed: true, limit: -1, used: 0, plan };

  const ps = periodStart(action);
  const rows = await sql`
    SELECT count FROM usage_counters
    WHERE user_id = ${userId} AND action = ${action} AND period_start = ${ps}
  `;
  const used = rows.length ? (rows[0] as { count: number }).count : 0;
  return { allowed: used < limit, limit, used, plan };
}

export async function incrementUsage(userId: string, action: GatedAction) {
  const ps = periodStart(action);
  await sql`
    INSERT INTO usage_counters (id, user_id, action, count, period_start)
    VALUES (${createId("uc")}, ${userId}, ${action}, 1, ${ps})
    ON CONFLICT (user_id, action, period_start)
    DO UPDATE SET count = usage_counters.count + 1
  `;
}

export async function getUsageCounter(userId: string, action: GatedAction): Promise<UsageCounter | null> {
  const ps = periodStart(action);
  const rows = await sql`
    SELECT * FROM usage_counters
    WHERE user_id = ${userId} AND action = ${action} AND period_start = ${ps}
  `;
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    userId: row.user_id as string,
    action: row.action as GatedAction,
    count: row.count as number,
    periodStart: row.period_start as string,
  };
}

// ─── Safety (Block + Report) ───

export async function createReport(
  reporterId: string,
  reportedId: string,
  reason: string,
  extraNotes?: string,
) {
  await sql`
    INSERT INTO reports (id, reporter_id, reported_id, reason, extra_notes)
    VALUES (${createId("rep")}, ${reporterId}, ${reportedId}, ${reason}, ${extraNotes ?? null})
  `;
}

// Invalidate today's match cache (used after block)
export async function invalidateMatchCache(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  await sql`DELETE FROM match_cache WHERE user_id = ${userId} AND cache_date = ${today}`;
}

// ─── Notification Preferences ───

export async function getNotificationPreferences(userId: string): Promise<Record<string, boolean>> {
  const rows = await sql`
    SELECT notification_preferences FROM profiles WHERE user_id = ${userId}
  `;
  if (!rows.length) return { matchReady: true, soulKnock: true, mutualMatch: true };
  const row = rows[0] as { notification_preferences: Record<string, boolean> | string };
  if (typeof row.notification_preferences === "string") {
    return safeParseJson(row.notification_preferences, { matchReady: true, soulKnock: true, mutualMatch: true });
  }
  return row.notification_preferences ?? { matchReady: true, soulKnock: true, mutualMatch: true };
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

// ─── Pulse ───────────────────────────────────────────────────────────────────

export async function getTodayPulsePrompt() {
  const rows = await sql`
    SELECT id, content, published_at, is_active, created_at
    FROM pulse_prompts
    WHERE is_active = true
    ORDER BY published_at DESC
    LIMIT 1
  `;
  if (!rows.length) return null;
  const r = rows[0] as Record<string, unknown>;
  return {
    id: r.id as string,
    content: r.content as string,
    publishedAt: r.published_at as string,
    isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
  };
}

export async function createPulsePrompt(content: string) {
  await sql`UPDATE pulse_prompts SET is_active = false WHERE is_active = true`;
  const id = createId("pp");
  await sql`
    INSERT INTO pulse_prompts (id, content, is_active, published_at, created_at)
    VALUES (${id}, ${content}, true, NOW(), NOW())
  `;
  return id;
}

export async function getPulseFeed(currentUserId: string, cursor?: string, limit = 20) {
  const rows = cursor
    ? await sql`
        SELECT p.id, p.type, p.prompt_id, p.content, p.is_verified,
               p.resonate_count, p.reply_count, p.created_at,
               pr.content AS prompt_content,
               EXISTS(
                 SELECT 1 FROM pulse_reactions r
                 WHERE r.post_id = p.id AND r.user_id = ${currentUserId}
               ) AS is_resonated
        FROM pulse_posts p
        LEFT JOIN pulse_prompts pr ON pr.id = p.prompt_id
        WHERE p.is_hidden = false AND p.created_at < ${cursor}
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `
    : await sql`
        SELECT p.id, p.type, p.prompt_id, p.content, p.is_verified,
               p.resonate_count, p.reply_count, p.created_at,
               pr.content AS prompt_content,
               EXISTS(
                 SELECT 1 FROM pulse_reactions r
                 WHERE r.post_id = p.id AND r.user_id = ${currentUserId}
               ) AS is_resonated
        FROM pulse_posts p
        LEFT JOIN pulse_prompts pr ON pr.id = p.prompt_id
        WHERE p.is_hidden = false
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      type: row.type as PulsePostType,
      promptId: (row.prompt_id as string) || null,
      promptContent: (row.prompt_content as string) || null,
      content: row.content as string,
      isVerified: row.is_verified as boolean,
      resonateCount: row.resonate_count as number,
      replyCount: row.reply_count as number,
      isResonated: row.is_resonated as boolean,
      createdAt: row.created_at as string,
    };
  });
}

export async function createPulsePost({
  userId, type, promptId, content, isVerified,
}: {
  userId: string;
  type: PulsePostType;
  promptId?: string;
  content: string;
  isVerified: boolean;
}) {
  const id = createId("ppost");
  await sql`
    INSERT INTO pulse_posts (id, user_id, type, prompt_id, content, is_verified, created_at)
    VALUES (${id}, ${userId}, ${type}, ${promptId ?? null}, ${content}, ${isVerified}, NOW())
  `;
  return id;
}

export async function togglePulseReaction(postId: string, userId: string): Promise<boolean> {
  const existing = await sql`
    SELECT id FROM pulse_reactions WHERE post_id = ${postId} AND user_id = ${userId}
  `;
  if (existing.length) {
    await sql`DELETE FROM pulse_reactions WHERE post_id = ${postId} AND user_id = ${userId}`;
    await sql`
      UPDATE pulse_posts SET resonate_count = GREATEST(resonate_count - 1, 0) WHERE id = ${postId}
    `;
    return false;
  }
  const id = createId("pr");
  await sql`INSERT INTO pulse_reactions (id, post_id, user_id, created_at) VALUES (${id}, ${postId}, ${userId}, NOW())`;
  await sql`UPDATE pulse_posts SET resonate_count = resonate_count + 1 WHERE id = ${postId}`;
  return true;
}

export async function getPulseReplies(postId: string) {
  const rows = await sql`
    SELECT id, content, is_verified, resonate_count, created_at
    FROM pulse_replies
    WHERE post_id = ${postId} AND is_hidden = false
    ORDER BY created_at ASC
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      postId,
      content: row.content as string,
      isVerified: row.is_verified as boolean,
      resonateCount: row.resonate_count as number,
      createdAt: row.created_at as string,
    };
  });
}

export async function createPulseReply({
  postId, userId, content, isVerified,
}: {
  postId: string;
  userId: string;
  content: string;
  isVerified: boolean;
}) {
  const id = createId("prely");
  await sql`
    INSERT INTO pulse_replies (id, post_id, user_id, content, is_verified, created_at)
    VALUES (${id}, ${postId}, ${userId}, ${content}, ${isVerified}, NOW())
  `;
  await sql`UPDATE pulse_posts SET reply_count = reply_count + 1 WHERE id = ${postId}`;
  return id;
}

export async function flagPulsePost(postId: string, userId: string, reason: string) {
  const id = createId("pf");
  await sql`
    INSERT INTO pulse_flags (id, post_id, user_id, reason, created_at)
    VALUES (${id}, ${postId}, ${userId}, ${reason}, NOW())
    ON CONFLICT (post_id, user_id) DO NOTHING
  `;
  await sql`
    UPDATE pulse_posts
    SET flag_count = flag_count + 1,
        is_hidden  = CASE WHEN flag_count + 1 >= 3 THEN true ELSE is_hidden END
    WHERE id = ${postId}
  `;
}

export async function getUserVerificationStatus(userId: string): Promise<boolean> {
  const rows = await sql`SELECT is_verified FROM profiles WHERE user_id = ${userId} LIMIT 1`;
  if (!rows.length) return false;
  return (rows[0] as Record<string, unknown>).is_verified as boolean;
}

export async function saveVerificationSubmission(
  userId: string,
  linkedinUrl: string,
  selfieUrl: string
) {
  await sql`
    UPDATE profiles SET linkedin_url = ${linkedinUrl}, selfie_url = ${selfieUrl}
    WHERE user_id = ${userId}
  `;
}

export async function approveVerification(userId: string) {
  await sql`
    UPDATE profiles SET is_verified = true, verified_at = NOW()
    WHERE user_id = ${userId}
  `;
}

export async function getFlaggedPulsePosts() {
  const rows = await sql`
    SELECT id, type, content, is_verified, resonate_count, reply_count,
           flag_count, is_hidden, created_at
    FROM pulse_posts
    WHERE flag_count > 0
    ORDER BY flag_count DESC, created_at DESC
    LIMIT 50
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      type: row.type as PulsePostType,
      content: row.content as string,
      isVerified: row.is_verified as boolean,
      resonateCount: row.resonate_count as number,
      replyCount: row.reply_count as number,
      flagCount: row.flag_count as number,
      isHidden: row.is_hidden as boolean,
      createdAt: row.created_at as string,
    };
  });
}

export async function setPulsePostVisibility(postId: string, isHidden: boolean) {
  await sql`UPDATE pulse_posts SET is_hidden = ${isHidden} WHERE id = ${postId}`;
}

export async function getPendingVerifications() {
  const rows = await sql`
    SELECT user_id, linkedin_url, selfie_url, is_verified
    FROM profiles
    WHERE linkedin_url != '' AND selfie_url != '' AND is_verified = false
    ORDER BY updated_at DESC
    LIMIT 50
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      userId: row.user_id as string,
      linkedinUrl: row.linkedin_url as string,
      selfieUrl: row.selfie_url as string,
    };
  });
}

// ─── Stripe webhook idempotency ───

/**
 * Records a Stripe event ID. Returns true if this is a fresh event,
 * false if it has already been processed. Stripe sends retries with the
 * same event.id, so this prevents double-processing.
 */
export async function recordStripeEvent(eventId: string, type: string): Promise<boolean> {
  const rows = await sql`
    INSERT INTO stripe_events (event_id, type)
    VALUES (${eventId}, ${type})
    ON CONFLICT (event_id) DO NOTHING
    RETURNING event_id
  `;
  return rows.length > 0;
}

// ─── Photo moderation ───

export type PhotoModerationStatus = "pending" | "safe" | "flagged" | "rejected";

export interface PhotoModerationEntry {
  id: string;
  userId: string;
  photoUrl: string;
  status: PhotoModerationStatus;
  provider: string | null;
  scores: Record<string, unknown> | null;
  reason: string | null;
  createdAt: string;
}

export async function recordPhotoModeration(params: {
  userId: string;
  photoUrl: string;
  status: PhotoModerationStatus;
  provider?: string;
  scores?: Record<string, unknown>;
  reason?: string;
}): Promise<string> {
  const id = createId("mod");
  await sql`
    INSERT INTO photo_moderation (id, user_id, photo_url, status, provider, scores, reason)
    VALUES (
      ${id},
      ${params.userId},
      ${params.photoUrl},
      ${params.status},
      ${params.provider ?? null},
      ${params.scores ? JSON.stringify(params.scores) : null},
      ${params.reason ?? null}
    )
  `;
  return id;
}

export async function getFlaggedPhotos(): Promise<PhotoModerationEntry[]> {
  const rows = await sql`
    SELECT id, user_id, photo_url, status, provider, scores, reason, created_at
    FROM photo_moderation
    WHERE status = 'flagged'
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      userId: row.user_id as string,
      photoUrl: row.photo_url as string,
      status: row.status as PhotoModerationStatus,
      provider: (row.provider as string) || null,
      scores: (row.scores as Record<string, unknown>) || null,
      reason: (row.reason as string) || null,
      createdAt: (row.created_at as string) ?? new Date().toISOString(),
    };
  });
}

export async function resolvePhotoModeration(
  id: string,
  reviewerId: string,
  status: "safe" | "rejected",
): Promise<void> {
  await sql`
    UPDATE photo_moderation
    SET status = ${status}, reviewed_by = ${reviewerId}, reviewed_at = NOW()
    WHERE id = ${id}
  `;
}
