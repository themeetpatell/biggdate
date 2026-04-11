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
  // L4 Bandhan: Intelligence Card
  offers?: string[];  // What they bring to a relationship
  needs?: string[];   // What they need from a partner
}

// L2 Bandhan v2.0: narrative + compatibility signals, no zodiac/score
export interface Match {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  emoji: string;
  // Narrative fields
  narrativeIntro: string;       // "You both earn trust slowly — and that's exactly why this works"
  connectionHook: string;       // The emotional core of why they'd click
  tensionPoint: string;         // Honest friction (replaces potentialFriction)
  intentAlignment: "High" | "Medium" | "Low";
  // Bandhan v2.0 compatibility signals
  compatibilitySignals: {
    values: string;             // one-sentence observation about shared/complementary values
    communication: string;      // one-sentence observation about communication fit
    lifeDirection: string;      // one-sentence observation about life architecture alignment
  };
  frictionPoint: string;        // ONE honest observation where they'll need to be intentional
  openingQuestion: string;      // AI-generated shared question both would answer to each other
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
