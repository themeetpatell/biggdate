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

export interface LifePreviewCompatibilityMap {
  valuesOverlap: string[];
  communicationFit: string;
  conflictStyle: string;
  growthTrajectory: string;
}

/** Response from `POST /api/life-preview` — an AI "life together" preview. */
export interface LifePreview {
  matchId: string;
  match: Match;
  storyArc: string;
  dayInTheLife: string;
  compatibilityMap: LifePreviewCompatibilityMap;
  hardTruth: string;
  growthScore: number;
  transformationNote: string;
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

/** A Soul Knock the user has received, from `GET /api/intros/received`. */
export interface ReceivedIntro {
  id: string;
  senderUserId: string;
  senderName: string;
  senderPhotos: string[];
  matchId: string;
  matchName: string;
  soulKnockQuestion: string | null;
  senderAnswered: boolean;
  receiverAnswered: boolean;
  createdAt: string;
}

/** Response from `GET /api/intros/received`. Free-plan users get `locked`. */
export interface ReceivedIntrosResponse {
  intros?: ReceivedIntro[];
  locked?: boolean;
}

/** Response from `POST /api/intros/respond`. */
export interface RespondResult {
  mutual: boolean;
  thread: { id: string } | null;
}

/** A messaging thread, as returned by `GET /api/messages`. */
export interface Thread {
  id: string;
  userAId: string;
  userBId: string;
  introId: string;
  createdAt: string;
  otherUserName?: string;
  otherUserPhoto?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

export type MessageKind = "text" | "voice" | "date_proposal";

export type DateProposalStatus = "pending" | "accepted" | "declined" | "withdrawn";

export interface DateProposalMeta {
  proposedAt: string;
  venue: string;
  notes?: string | null;
  status: DateProposalStatus;
  respondedBy?: string | null;
  respondedAt?: string | null;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  kind: MessageKind;
  body: string | null;
  audioUrl?: string | null;
  audioDurationSec?: number | null;
  meta?: DateProposalMeta | null;
  audioMimeType?: string | null;
  createdAt: string;
  readAt: string | null;
}

/** Response from `GET /api/messages`. */
export interface ThreadsResponse {
  threads: Thread[];
}

/** Response from `GET /api/messages/:threadId`. */
export interface ThreadDetailResponse {
  thread: Thread;
  messages: Message[];
  hasReadReceipts: boolean;
}

export type PulsePostType = "prompt_response" | "confession" | "question";
export type PulseSort = "hot" | "new";

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

/** Response from `GET /api/pulse/posts`. */
export interface PulseFeedResponse {
  posts: PulsePost[];
  nextCursor: string | null;
}

/** Response from `GET /api/pulse/prompts/today`. */
export interface PulsePromptsResponse {
  prompt: PulsePrompt | null;
  prompts: PulsePrompt[];
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
