export interface Profile {
  name: string;
  age: number | null;
  birthday: string | null;
  zodiac: string | null;
  city: string;
  gender: string | null;
  orientation: string | null;
  partnerGender: string | null;
  intent: "serious" | "casual" | "marriage" | "exploring" | null;
  hasKids: boolean | null;
  wantsKids: "yes" | "no" | "open" | null;
  loveLanguage: string | null;
  drinking: "never" | "social" | "regularly" | null;
  smoking: "never" | "social" | "regularly" | null;
  exercise: "never" | "sometimes" | "often" | null;
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
  // L3 Bandhan: onboarding depth
  conflictStyle: string;
  familyExpectations: string;
  lifeArchitecture: string;
}

// L1 Bandhan: narrative-first match — no compatibility score
export interface Match {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  gender: string;
  zodiac: string;
  zodiacCompatNotes: string;
  attachment: string;
  loveLanguage: string;
  intent: string;
  hasKids: boolean;
  wantsKids: string;
  drinking: string;
  smoking: string;
  exercise: string;
  // Narrative fields — replaces compatibilityScore
  narrativeIntro: string;     // "You both earn trust slowly — and that's exactly why this works"
  connectionHook: string;     // The emotional core of why they'd click
  tensionPoint: string;       // Honest friction (replaces potentialFriction)
  sharedValues: string[];
  whyTheyWork: string;
  conversationStarter: string;
  authenticityScore: number;
  intentAlignment: "High" | "Medium" | "Low";
  emoji: string;
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
}

// L4 Bandhan: structured 3-Q post-date reflection
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

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  city: string;
  intent: string;
  createdAt: string;
}
