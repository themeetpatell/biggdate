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
}

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
  compatibilityScore: number;
  authenticityScore: number;
  intentAlignment: "High" | "Medium" | "Low";
  sharedValues: string[];
  whyTheyWork: string;
  conversationStarter: string;
  potentialFriction: string;
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

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  city: string;
  intent: string;
  createdAt: string;
}
