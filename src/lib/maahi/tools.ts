import { tool, type ToolSet } from "ai";
import { z } from "zod";
import {
  getProfileByUserId,
  getMatchesForUser,
  getDebriefReflectionsForUser,
} from "@/lib/repo";
import { getMaahiMemory } from "./memory";
import { SCENE_TOOL_WHITELIST } from "./scenes";
import type { MaahiScene } from "./scenes";

/**
 * Tool layer — gives Maahi the ability to read live state about the
 * user (profile, matches, recent date debriefs, her own memory of them).
 *
 * Every tool is gated by the userId baked into the closure — if Maahi
 * is in an anonymous scene she can't reach any of these. The scene
 * whitelist in `scenes.ts` controls *which* of the available tools are
 * exposed per scene, so e.g. a match-discussion scene only sees match
 * tools.
 */
export function buildMaahiTools(input: { scene: MaahiScene; userId: string | null }): ToolSet | undefined {
  const { scene, userId } = input;
  const whitelist = SCENE_TOOL_WHITELIST[scene];
  if (!whitelist || whitelist.length === 0) return undefined;
  if (!userId) return undefined;

  const all = makeAllTools(userId);
  const allowed: ToolSet = {};
  for (const name of whitelist) {
    const t = (all as ToolSet)[name];
    if (t) allowed[name] = t;
  }
  return Object.keys(allowed).length > 0 ? allowed : undefined;
}

function makeAllTools(userId: string): ToolSet {
  return {
    viewMyProfile: tool({
      description:
        "Read the logged-in user's complete in-app profile. Use this whenever they ask anything about themselves, their profile, preferences, lifestyle, attachment, values, readiness, dealbreakers, prompts, visibility, or what BiggDate knows about them. Always answer from this data instead of guessing.",
      inputSchema: z.object({}),
      execute: async () => {
        const p = await getProfileByUserId(userId);
        if (!p) return { available: false, reason: "no profile yet" };
        return {
          available: true,
          profile: p,
          sections: {
            identity: {
              name: p.name,
              age: p.age,
              birthday: p.birthday,
              zodiac: p.zodiac,
              city: p.city,
              hometown: p.hometown ?? null,
              gender: p.gender,
              orientation: p.orientation,
              pronouns: p.pronouns ?? null,
              height: p.height ?? null,
              religion: p.religion ?? null,
              politics: p.politics ?? null,
              ethnicity: p.ethnicity ?? null,
              languages: p.languages ?? [],
              isVerified: p.isVerified ?? false,
            },
            workAndEducation: {
              jobTitle: p.jobTitle ?? null,
              company: p.company ?? null,
              education: p.education ?? null,
              workIntensity: p.workIntensity ?? null,
              linkedinUrl: p.linkedinUrl ?? null,
              websiteUrl: p.websiteUrl ?? null,
            },
            datingIntent: {
              intent: p.intent,
              partnerGender: p.partnerGender,
              partnerAgeMin: p.partnerAgeMin,
              partnerAgeMax: p.partnerAgeMax,
              relationshipStyle: p.relationshipStyle ?? null,
              datingStage: p.datingStage ?? null,
              relationshipTimeline: p.relationshipTimeline ?? null,
              longDistanceOpen: p.longDistanceOpen ?? null,
              relocationOpen: p.relocationOpen ?? null,
              marriageType: p.marriageType ?? null,
              hasKids: p.hasKids,
              wantsKids: p.wantsKids,
              familyInvolvement: p.familyInvolvement ?? null,
              culturalAlignment: p.culturalAlignment ?? null,
              familyExpectations: p.familyExpectations,
            },
            relationshipPsychology: {
              attachment: p.attachment,
              attachmentScore: p.attachmentScore,
              readinessScore: p.readinessScore,
              emotionalAvailability: p.emotionalAvailability ?? null,
              loveLanguage: p.loveLanguage,
              loveLanguageGive: p.loveLanguageGive ?? [],
              loveLanguageReceive: p.loveLanguageReceive ?? [],
              conflictStyle: p.conflictStyle,
              lifeArchitecture: p.lifeArchitecture,
              coachingFocus: p.coachingFocus,
              summary: p.summary,
            },
            valuesAndFit: {
              coreValues: p.coreValues ?? [],
              strengths: p.strengths ?? [],
              growthAreas: p.growthAreas ?? [],
              offers: p.offers ?? [],
              needs: p.needs ?? [],
              dealbreakers: p.dealbreakers ?? [],
              attractionPreferences: p.attractionPreferences ?? [],
              turnOns: p.turnOns ?? [],
              turnOffs: p.turnOffs ?? [],
            },
            lifestyle: {
              drinking: p.drinking,
              smoking: p.smoking,
              exercise: p.exercise,
              sleepSchedule: p.sleepSchedule ?? null,
              socialBattery: p.socialBattery ?? null,
              diet: p.diet ?? null,
              weekendStyle: p.weekendStyle ?? null,
              travelStyle: p.travelStyle ?? null,
              cleanliness: p.cleanliness ?? null,
              interests: p.interests ?? [],
              pets: p.pets ?? [],
            },
            profileContent: {
              prompts: p.prompts ?? [],
              photos: p.photos ?? [],
              profileVisibility: p.profileVisibility ?? "visible",
              showAge: p.showAge ?? true,
              showCity: p.showCity ?? true,
              showWork: p.showWork ?? true,
              showEducation: p.showEducation ?? true,
            },
          },
        };
      },
    }),

    viewMyMatches: tool({
      description:
        "List the user's current matches with their narrative intro, connection hook, tension point, and friction point. Use this when they ask about a match or who they've been matched with.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(10).optional().describe("How many matches to return; default 5"),
      }),
      execute: async ({ limit }) => {
        const matches = await getMatchesForUser(userId);
        const slice = matches.slice(0, limit ?? 5);
        return {
          count: slice.length,
          matches: slice.map((m) => ({
            id: m.id,
            name: m.name,
            age: m.age,
            city: m.city,
            profession: m.profession,
            connectionHook: m.connectionHook,
            tensionPoint: m.tensionPoint,
            frictionPoint: m.frictionPoint,
            narrativeIntro: m.narrativeIntro,
            intentAlignment: m.intentAlignment,
          })),
        };
      },
    }),

    viewLatestDebrief: tool({
      description:
        "Read the most recent post-date debrief reflection — chemistry, what surprised them, decision, AI insight. Use when discussing a recent date.",
      inputSchema: z.object({}),
      execute: async () => {
        const reflections = await getDebriefReflectionsForUser(userId);
        if (reflections.length === 0) return { available: false };
        const latest = reflections[0];
        return {
          available: true,
          matchName: latest.matchName,
          chemistry: latest.chemistryAnswer,
          surprise: latest.surpriseAnswer,
          decision: latest.decisionAnswer,
          chemistryScore: latest.chemistryScore,
          wouldSeeAgain: latest.wouldSeeAgain,
          insight: latest.aiInsight,
          when: latest.createdAt,
        };
      },
    }),

    viewMyPatterns: tool({
      description:
        "Read what you (Maahi) remember about the user — emotional patterns, repeating relationship loops, healthy shifts they've made, growth trend. Use when they ask 'do I keep doing X?', 'am I getting better?', or anything about their patterns.",
      inputSchema: z.object({}),
      execute: async () => {
        const memory = await getMaahiMemory(userId);
        if (!memory) return { available: false };
        return {
          available: true,
          summary: memory.summary || null,
          repeatingPatterns: memory.patternEngine?.repeatingPatterns ?? [],
          selfSabotageLoops: memory.patternEngine?.selfSabotageLoops ?? [],
          healthyShifts: memory.patternEngine?.healthyShifts ?? [],
          partnerSelectionBias: memory.patternEngine?.partnerSelectionBias ?? [],
          growthTrend: memory.patternEngine?.growthTrend ?? null,
          relationshipStage: memory.relationshipCore?.relationshipStage ?? null,
          mainBlock: memory.relationshipCore?.mainBlock ?? null,
          handledBetterThisTime:
            memory.relationshipOS?.growthHistory?.handledBetterThisTime ?? [],
          conversationCount: memory.conversationCount,
        };
      },
    }),

    viewDailyIntention: tool({
      description:
        "Read the user's daily intention and check-in streak. Use when grounding the conversation in today's stated focus.",
      inputSchema: z.object({}),
      execute: async () => {
        const memory = await getMaahiMemory(userId);
        return {
          intention: memory?.companionNotes || null,
          conversationCount: memory?.conversationCount ?? 0,
        };
      },
    }),
  };
}
