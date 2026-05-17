export interface ProfilePrompt {
  question: string;
  answer: string;
}

export interface Profile {
  name: string;
  age: number | null;
  birthday: string | null;
  zodiac: string | null;
  city: string;
  gender: string | null;
  orientation: string | null;
  pronouns?: string | null;
  hometown?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  education?: string | null;
  height?: string | null;
  religion?: string | null;
  politics?: string | null;
  ethnicity?: string | null;
  partnerGender: string | null;
  intent: "serious" | "casual" | "marriage" | "exploring" | null;
  relationshipStyle?: string | null;
  hasKids: boolean | null;
  wantsKids: "yes" | "no" | "open" | null;
  loveLanguage: string | null;
  drinking: "never" | "social" | "regularly" | null;
  smoking: "never" | "social" | "regularly" | null;
  exercise: "never" | "sometimes" | "often" | null;
  sleepSchedule?: string | null;
  socialBattery?: string | null;
  diet?: string | null;
  weekendStyle?: string | null;
  travelStyle?: string | null;
  cleanliness?: string | null;
  languages?: string[];
  interests?: string[];
  pets?: string[];
  dealbreakers: string[];
  partnerAgeMin: number | null;
  partnerAgeMax: number | null;
  attachment: "Secure" | "Anxious" | "Avoidant" | "Fearful-Avoidant";
  attachmentScore: number;
  readinessScore: number;
  growthAreas: string[];
  strengths: string[];
  coreValues: string[];
  summary: string;
  coachingFocus: string;
  photos: string[];
  prompts?: ProfilePrompt[];
  profileVisibility?: "visible" | "paused" | "hidden";
  showAge?: boolean;
  showCity?: boolean;
  showWork?: boolean;
  showEducation?: boolean;
  // L3 BiggDate: onboarding depth
  conflictStyle: string;
  familyExpectations: string;
  lifeArchitecture: string;
  // L4 BiggDate: Intelligence Card
  offers?: string[];  // What they bring to a relationship
  needs?: string[];   // What they need from a partner
  // L5 BiggDate: Enrichment v2
  attractionPreferences?: string[];
  turnOns?: string[];
  turnOffs?: string[];
  relationshipTimeline?: string | null;
  datingStage?: string | null;
  longDistanceOpen?: string | null;
  emotionalAvailability?: string | null;
  residencyStatus?: string | null;
  relocationOpen?: string | null;
  workIntensity?: string | null;
  familyInvolvement?: string | null;
  culturalAlignment?: string | null;
  marriageType?: string | null;
  loveLanguageGive?: string[];
  loveLanguageReceive?: string[];
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  isVerified?: boolean;
  // L6 BiggDate: Commitment Tracking
  relationshipStatus?: "single" | "dating" | "seeing_someone" | "exclusive" | "engaged" | "married" | null;
  partnerId?: string | null;
}

// L2 BiggDate v2.0: narrative + compatibility signals, no zodiac/score
export interface Match {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  emoji: string;
  // Real-user fields (populated when matched against a real profile)
  matchedUserId?: string;       // auth user ID of the matched real user
  photos?: string[];            // unlocked after mutual intention
  photosUnlocked?: boolean;     // true once both users have sent Soul Knocks
  // Narrative fields
  narrativeIntro: string;       // "You both earn trust slowly — and that's exactly why this works"
  connectionHook: string;       // The emotional core of why they'd click
  tensionPoint: string;         // Honest friction (replaces potentialFriction)
  intentAlignment: "High" | "Medium" | "Low";
  // BiggDate v2.0 compatibility signals
  compatibilitySignals: {
    values: string;             // one-sentence observation about shared/complementary values
    communication: string;      // one-sentence observation about communication fit
    lifeDirection: string;      // one-sentence observation about life architecture alignment
  };
  frictionPoint: string;        // ONE honest observation where they'll need to be intentional
  openingQuestion: string;      // AI-generated shared question both would answer to each other
}

// Messaging
export interface Thread {
  id: string;
  userAId: string;
  userBId: string;
  introId: string;
  createdAt: string;
  // Hydrated fields
  otherUserName?: string;
  otherUserPhoto?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

// In-app date proposal payload — stored in messages.meta when kind='date_proposal'.
// Status starts at "pending" when the proposer sends. The responder flips
// it to "accepted" or "declined". "withdrawn" is the proposer cancelling
// before a response. App-layer validators bound venue ≤200 chars,
// notes ≤500 chars, proposedAt within the next 90 days.
export interface DateProposalMeta {
  proposedAt: string;     // ISO 8601 timestamptz
  venue: string;
  notes?: string | null;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  respondedBy?: string | null;
  respondedAt?: string | null;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  kind: "text" | "voice" | "date_proposal";
  body: string | null;
  audioUrl?: string | null;
  audioDurationSec?: number | null;
  // Structured payload — populated for kind='date_proposal'.
  meta?: DateProposalMeta | null;
  audioMimeType?: string | null;
  createdAt: string;
  readAt: string | null;
}

// Soul Knock response
export interface SoulKnockResponse {
  id: string;
  introId: string;
  userId: string;
  response: string;
  createdAt: string;
}

// Usage counter
export type GatedAction = "soul_knock" | "maahi_session" | "maahi_turn" | "life_preview" | "daily_matches";

export interface UsageCounter {
  userId: string;
  action: GatedAction;
  count: number;
  periodStart: string;
}

// Plan gate result
export interface PlanGateResult {
  allowed: boolean;
  limit: number;
  used: number;
  plan: "free" | "premium" | "pro";
}

export interface LifePreview {
  matchId: string;
  match: Match;
  storyArc: string;
  dayInTheLife: string;
  compatibilityMap: {
    valuesOverlap: string[];
    communicationFit: string;
    conflictStyle: string;
    growthTrajectory: string;
  };
  hardTruth: string;
  growthScore: number;
  transformationNote: string;
}

export interface SessionMemory {
  summary: string;
  traits: string[];
  needs: string[];
  boundaries: string[];
  emotionalPatterns: string[];
  triggers: string[];
  reassuranceStyle: string;
  communicationStyle: string;
  companionNotes: string;
  attachmentGuess: string;
  readiness: number | null;
  previousQuestions: string[];
  lastUpdated: string | null;
  conversationPhase: "opening" | "history" | "values" | "life-architecture" | "complete";
  coveredTopics: string[];
  // Maahi v3 fields
  stableTraits: string[];
  growthEdges: string[];
  currentSituation: string;
  recurringThemes: string[];
  lastEmotionalState: string;
  // Relationship OS core
  relationshipCore: Partial<{
    relationshipStage:
      | "healing"
      | "exploring"
      | "interested"
      | "anxious"
      | "dating"
      | "confused"
      | "attached"
      | "conflicted"
      | "exiting"
      | "rebuilding"
      | "committed";
    mainBlock:
      | "trust"
      | "fear of rejection"
      | "poor selection"
      | "low self-worth"
      | "emotional unavailability";
    nextBestAction:
      | "pause"
      | "message"
      | "reflect"
      | "clarify"
      | "meet"
      | "repair"
      | "boundary"
      | "wait"
      | "ask"
      | "exit";
    partnerLifeGoal: "casual companionship" | "serious relationship" | "marriage" | "life-building partner";
    progressScore: number;
  }>;
  patternEngine: Partial<{
    repeatingPatterns: string[];
    selfSabotageLoops: string[];
    healthyShifts: string[];
    partnerSelectionBias: string[];
    growthTrend: "improving" | "stagnant" | "regressing";
  }>;
  relationshipOS: Partial<{
    stableIdentity: {
      values: string[];
      boundaries: string[];
      attachmentTendencies: string;
      familyCultureViews: string;
      lifeGoals: string;
    };
    datingStyle: {
      textingPattern: string;
      pacing: string;
      conflictTendencies: string;
      reassuranceNeeds: string;
      attractionPatterns: string;
    };
    currentReality: {
      whoTheyAreTalkingTo: string;
      howInvestedTheyAre: string;
      activeConfusion: string;
      recentDate: string;
      recentDisappointment: string;
    };
    growthHistory: {
      improved: string[];
      repeated: string[];
      handledBetterThisTime: string[];
    };
    loveState: {
      emotionalNeedNow: string;
      openLoops: string[];
      recentWins: string[];
      currentRisk: string;
      nextTenderAction: string;
    };
    maahiLearning: {
      whatComfortsThem: string[];
      whatMakesThemDefensive: string[];
      toneTheyRespondTo: string[];
      adviceTheyIgnored: string[];
      adviceTheyActedOn: string[];
      phrasesThatLanded: string[];
      phrasesToAvoid: string[];
      responsePatternsThatWork: string[];
      responsePatternsToAvoid: string[];
    };
  }>;
  conversationCount: number;
}

// L4 BiggDate: structured 3-Q post-date reflection
export interface DebriefReflection {
  id: string;
  matchId: string;
  matchName: string;
  chemistryAnswer: string;
  surpriseAnswer: string;
  decisionAnswer: string;
  chemistryScore: number | null;
  wouldSeeAgain: boolean | null;
  aiInsight: string;
  createdAt: string;
}

// ─── Pulse Feed ──────────────────────────────────────────────────────────────

export type PulsePostType = "prompt_response" | "confession" | "question";

export interface PulsePrompt {
  id: string;
  content: string;
  publishedAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface PulsePost {
  id: string;
  type: PulsePostType;
  promptId: string | null;
  promptContent: string | null;
  content: string;
  isVerified: boolean;
  isAuthor: boolean;
  authorHandle: string;
  resonateCount: number;
  replyCount: number;
  isResonated: boolean;
  createdAt: string;
}

export interface PulseReply {
  id: string;
  postId: string;
  content: string;
  isVerified: boolean;
  authorHandle: string;
  resonateCount: number;
  createdAt: string;
}

export type PulseSort = "hot" | "new";

export interface PulseUserStats {
  lifetimeHearts: number;
  currentStreak: number;
  bestStreak: number;
  postsToday: number;
  heartsToday: number;
}
