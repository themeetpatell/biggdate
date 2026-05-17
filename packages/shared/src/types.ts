/**
 * Response contracts for the backend `/api/*` routes consumed by native
 * clients. These mirror the JSON shapes returned by the route handlers.
 * Keep them in sync when a route's response shape changes.
 */

export type ProfileIntent = "serious" | "casual" | "marriage" | "exploring";
export type FrequencyLevel = "never" | "social" | "regularly";
export type ExerciseLevel = "never" | "sometimes" | "often";

export interface ProfilePrompt {
  question: string;
  answer: string;
}

/**
 * User profile — a focused subset of the backend profile shape covering the
 * fields the native app currently reads or edits. Extend as screens land.
 */
export interface Profile {
  name: string;
  age: number | null;
  birthday: string | null;
  city: string;
  gender: string | null;
  pronouns?: string | null;
  hometown?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  education?: string | null;
  height?: string | null;
  intent: ProfileIntent | null;
  relationshipStyle?: string | null;
  summary: string;
  interests?: string[];
  languages?: string[];
  coreValues?: string[];
  drinking: FrequencyLevel | null;
  smoking: FrequencyLevel | null;
  exercise: ExerciseLevel | null;
  photos: string[];
  prompts?: ProfilePrompt[];
  isVerified?: boolean;
}

/** Response from `GET /api/auth/me`. */
export interface MeResponse {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  phoneCountryIso2: string | null;
  hasProfile: boolean;
  profile: Profile | null;
}

/** Response from `GET /api/profile` and `PATCH /api/profile`. */
export interface ProfileResponse {
  profile: Profile | null;
}

export type IntentAlignment = "High" | "Medium" | "Low";

export interface MatchCompatibilitySignals {
  values: string;
  communication: string;
  lifeDirection: string;
}

/** A curated match, as returned by `GET /api/matches`. */
export interface Match {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  emoji: string;
  matchedUserId?: string;
  photos?: string[];
  photosUnlocked?: boolean;
  narrativeIntro: string;
  connectionHook: string;
  tensionPoint: string;
  intentAlignment: IntentAlignment;
  compatibilitySignals: MatchCompatibilitySignals;
  frictionPoint: string;
  openingQuestion: string;
}

export type IntroStatus = "pending" | "answered";

/** An intro (Soul Knock) the user has sent, from `GET /api/intros`. */
export interface Intro {
  id: string;
  matchId: string;
  matchName: string;
  matchedUserId: string | null;
  soulKnockQuestion: string | null;
  senderAnswered: boolean;
  receiverAnswered: boolean;
  createdAt: string;
  status: IntroStatus;
}

export interface BillingAddon {
  addonId: string;
  usesRemaining: number | null;
  expiresAt: string | null;
}

/** Response from `GET /api/billing/status`. */
export interface BillingStatusResponse {
  plan: string;
  status: string;
  isPremium: boolean;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  addons: BillingAddon[];
}

/** Error envelope returned by route handlers on failure. */
export interface ApiErrorResponse {
  error: string;
}
