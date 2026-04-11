# BiggDate Platform Rewrite — "Life Previews" Edition

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite BiggDate from React+Vite+Express into a Next.js 16 App Router application with the "Life Preview" concept — AI-generated visions of your future with each match — as the core product differentiator.

**Architecture:** Next.js 16 App Router with Server Components by default, Client Components only for interactive UI. AI SDK v6 for all LLM calls (supporting OpenAI + Ollama via provider pattern). shadcn/ui + Tailwind CSS for UI (replacing 3000 lines of inline CSS). AI Elements for all AI-generated text rendering. JSON file storage initially (Neon Postgres in future phase).

**Tech Stack:** Next.js 16, React 19, AI SDK v6, AI Elements, shadcn/ui, Tailwind CSS, Geist fonts, TypeScript

**Current State:** Monolithic React SPA (src/App.jsx ~3071 lines, all CSS-in-JS) + Express API (server.js ~825 lines) + JSON file storage. Works but not scalable, not unique enough for market disruption.

**What Changes:**
- React+Vite+Express → Next.js 16 App Router (single deployable)
- Inline CSS-in-JS → Tailwind + shadcn/ui dark theme
- OpenAI SDK direct → AI SDK v6 with provider abstraction
- 3 static match cards → **Life Previews** (AI-generated future narratives)
- Raw AI text → AI Elements `<MessageResponse>` everywhere
- localStorage profile → Server-side + localStorage hybrid
- No streaming → Full streaming for all AI responses

---

## File Structure

```
biggdate-next/                          # New Next.js project (sibling to current)
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: Geist fonts, dark theme, metadata
│   │   ├── page.tsx                    # Landing page (Server Component)
│   │   ├── globals.css                 # Tailwind + theme tokens + animations
│   │   ├── discover/
│   │   │   └── page.tsx                # Soul Discovery onboarding (Client Component)
│   │   ├── profile/
│   │   │   └── page.tsx                # Soul Profile / Report screen
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard hub
│   │   ├── matches/
│   │   │   └── page.tsx                # Life Previews browse
│   │   ├── match/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Individual Life Preview detail
│   │   ├── coach/
│   │   │   └── page.tsx                # AI Coach chat
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts            # Streaming AI chat (onboarding + coach)
│   │   │   ├── profile/
│   │   │   │   └── derive/
│   │   │   │       └── route.ts        # Derive soul profile from conversation
│   │   │   ├── matches/
│   │   │   │   └── generate/
│   │   │   │       └── route.ts        # Generate matches with Life Previews
│   │   │   ├── life-preview/
│   │   │   │   └── route.ts            # Generate full Life Preview for a match
│   │   │   ├── coach-plan/
│   │   │   │   └── route.ts            # 30-day coaching plan
│   │   │   ├── daily-intention/
│   │   │   │   └── route.ts            # Daily intention generator
│   │   │   └── waitlist/
│   │   │       └── route.ts            # Waitlist join
│   │   └── opengraph-image.tsx         # Dynamic OG image for social sharing
│   ├── components/
│   │   ├── nav.tsx                     # Global nav bar
│   │   ├── orb-background.tsx          # Animated orb background
│   │   ├── soul-ring.tsx               # Readiness score ring (SVG)
│   │   ├── life-preview-card.tsx       # Life Preview card component
│   │   ├── life-preview-detail.tsx     # Full Life Preview narrative view
│   │   ├── onboarding-chat.tsx         # Onboarding conversation UI
│   │   ├── coach-chat.tsx              # Coach conversation UI
│   │   ├── photo-upload.tsx            # Photo upload with webcam
│   │   ├── profile-badges.tsx          # Attachment/zodiac/value badges
│   │   └── share-soul-card.tsx         # Shareable soul card for IG stories
│   ├── lib/
│   │   ├── ai.ts                       # AI provider setup (AI SDK v6)
│   │   ├── prompts.ts                  # All AI prompt templates
│   │   ├── zodiac.ts                   # Zodiac system (signs, compatibility)
│   │   ├── storage.ts                  # JSON file read/write (server-side)
│   │   ├── profile-store.ts            # Profile localStorage helpers (client)
│   │   ├── types.ts                    # TypeScript types (Profile, Match, LifePreview)
│   │   └── constants.ts                # Design tokens, question bank, config
│   └── components/ui/                  # shadcn/ui components (auto-installed)
│   └── components/ai-elements/         # AI Elements (auto-installed)
├── data/
│   ├── memory.json                     # Session memory (migrated from old)
│   └── platform.json                   # Waitlist, intros, passes (migrated)
├── public/
│   └── fonts/                          # If needed
├── next.config.ts
├── tailwind.config.ts                  # (auto from shadcn init)
├── tsconfig.json
├── package.json
└── .env.local                          # AI provider config
```

---

## Phase 1: Project Scaffolding + Design System

### Task 1: Scaffold Next.js 16 project

**Files:**
- Create: `biggdate-next/` (entire project via create-next-app)

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/themeetpatel/biggdate
npx create-next-app@latest biggdate-next --yes --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

- [ ] **Step 2: Verify project runs**

Run: `cd biggdate-next && npm run dev`
Expected: Next.js dev server starts on localhost:3000

- [ ] **Step 3: Initialize shadcn/ui**

```bash
cd /Users/themeetpatel/biggdate/biggdate-next
npx shadcn@latest init -d
```

- [ ] **Step 4: Fix Geist font (Tailwind v4 + shadcn fix)**

In `src/app/globals.css`, replace the `--font-sans` and `--font-mono` inside `@theme inline` with literal font names:

```css
@theme inline {
  --font-sans: "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace;
}
```

In `src/app/layout.tsx`, move font variable classNames from `<body>` to `<html>`:

```tsx
<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
  <body className="antialiased">
```

- [ ] **Step 5: Install shadcn components we'll need**

```bash
npx shadcn@latest add button card tabs badge separator input textarea dialog sheet scroll-area avatar skeleton
```

- [ ] **Step 6: Install AI SDK + AI Elements**

```bash
npm install ai @ai-sdk/react @ai-sdk/openai
npx ai-elements@latest add message conversation prompt-input
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 with shadcn, AI SDK, AI Elements"
```

### Task 2: Design system — dark theme + animations + tokens

**Files:**
- Modify: `biggdate-next/src/app/globals.css`
- Create: `biggdate-next/src/lib/constants.ts`

- [ ] **Step 1: Configure dark theme in globals.css**

Append to `globals.css` (after shadcn defaults) — our custom BiggDate theme tokens and keyframe animations:

```css
/* BiggDate Design Tokens */
:root {
  --bd-bg: #0A0A0F;
  --bd-surface: #111118;
  --bd-surface-hover: #1A1A24;
  --bd-accent: #B48CFF;
  --bd-accent-soft: rgba(180,140,255,0.15);
  --bd-accent-glow: rgba(180,140,255,0.4);
  --bd-rose: #FF6B8A;
  --bd-rose-glow: rgba(255,107,138,0.3);
  --bd-gold: #F5C842;
  --bd-gold-glow: rgba(245,200,66,0.25);
  --bd-green: #4FFFB0;
  --bd-green-glow: rgba(79,255,176,0.25);
  --bd-text: #F0EEF8;
  --bd-text-muted: #8A87A0;
  --bd-text-faint: #4A4760;
  --bd-border: rgba(255,255,255,0.07);
  --bd-border-glow: rgba(180,140,255,0.25);
}

/* BiggDate Animations */
@keyframes orb1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes orb2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(-50px, 20px) scale(0.9); }
  66% { transform: translate(30px, -40px) scale(1.05); }
}
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(180,140,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(180,140,255,0.6), 0 0 80px rgba(180,140,255,0.2); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```

- [ ] **Step 2: Create constants.ts with design tokens + config**

```ts
// src/lib/constants.ts
export const COLORS = {
  bg: "var(--bd-bg)",
  surface: "var(--bd-surface)",
  surfaceHover: "var(--bd-surface-hover)",
  accent: "var(--bd-accent)",
  accentSoft: "var(--bd-accent-soft)",
  accentGlow: "var(--bd-accent-glow)",
  rose: "var(--bd-rose)",
  roseGlow: "var(--bd-rose-glow)",
  gold: "var(--bd-gold)",
  goldGlow: "var(--bd-gold-glow)",
  green: "var(--bd-green)",
  greenGlow: "var(--bd-green-glow)",
  text: "var(--bd-text)",
  textMuted: "var(--bd-text-muted)",
  textFaint: "var(--bd-text-faint)",
  border: "var(--bd-border)",
  borderGlow: "var(--bd-border-glow)",
} as const;

export const APP_NAME = "BiggDate";
export const APP_TAGLINE = "See your future, not just a profile";

export const ONBOARDING_QUESTION_BANK: Record<number, string[]> = {
  2: ["When something upsets you in a relationship, do you bring it up or let it go?", "Are you someone who talks it out or needs time alone first?"],
  3: ["What keeps going wrong in your relationships, if you're honest?", "What's a pattern you've noticed in the people you end up with?"],
  4: ["What do you actually need in a relationship but rarely say out loud?", "What's something you always hope a partner will just understand?"],
  5: ["Is there anything that makes it hard for you to fully open up?", "What would make you feel safe enough to be 100% yourself?"],
  6: ["What's something you absolutely can't compromise on in a partner?", "What's an instant dealbreaker — something that ends it no matter what?"],
  7: ["What do people usually get wrong about you?", "What's something important that takes time for people to see?"],
  8: ["When do you feel most loved — what does someone do that makes you feel it?", "How do you show someone you care?"],
  9: ["Quick lifestyle check — do you drink? Smoke? How active are you?", "What does a typical week look like for you?"],
  10: ["What age range are you open to?", "How important is it that your partner is from the same city?"],
};
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: dark theme tokens, animations, and design constants"
```

### Task 3: TypeScript types

**Files:**
- Create: `biggdate-next/src/lib/types.ts`

- [ ] **Step 1: Define all core types**

```ts
// src/lib/types.ts

export interface Profile {
  name: string;
  age: number | null;
  birthday: string | null; // MM-DD
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
  photos: string[]; // base64
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
  storyArc: string;        // narrative of first year together
  dayInTheLife: string;     // ordinary Tuesday snapshot
  compatibilityMap: {
    valuesOverlap: string[];
    communicationFit: string;
    conflictStyle: string;
    growthTrajectory: string;
  };
  hardTruth: string;        // what could go wrong + how to navigate
  growthScore: number;       // 0-100: how much this person helps you grow
  transformationNote: string; // what you'd become together
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: TypeScript types for Profile, Match, LifePreview"
```

### Task 4: Zodiac system + utilities

**Files:**
- Create: `biggdate-next/src/lib/zodiac.ts`

- [ ] **Step 1: Port zodiac system to TypeScript**

```ts
// src/lib/zodiac.ts

export const ZODIAC_EMOJI: Record<string, string> = {
  Aries: "\u2648", Taurus: "\u2649", Gemini: "\u264A", Cancer: "\u264B",
  Leo: "\u264C", Virgo: "\u264D", Libra: "\u264E", Scorpio: "\u264F",
  Sagittarius: "\u2650", Capricorn: "\u2651", Aquarius: "\u2652", Pisces: "\u2653",
};

export const ZODIAC_COMPAT: Record<string, { high: string[]; medium: string[] }> = {
  Aries:       { high: ["Leo","Sagittarius","Gemini","Aquarius"],    medium: ["Aries","Libra","Scorpio","Pisces"] },
  Taurus:      { high: ["Virgo","Capricorn","Cancer","Pisces"],       medium: ["Taurus","Scorpio","Libra","Aquarius"] },
  Gemini:      { high: ["Libra","Aquarius","Aries","Leo"],            medium: ["Gemini","Sagittarius","Taurus","Capricorn"] },
  Cancer:      { high: ["Scorpio","Pisces","Taurus","Virgo"],         medium: ["Cancer","Capricorn","Libra","Aries"] },
  Leo:         { high: ["Aries","Sagittarius","Gemini","Libra"],      medium: ["Leo","Aquarius","Virgo","Cancer"] },
  Virgo:       { high: ["Taurus","Capricorn","Cancer","Scorpio"],     medium: ["Virgo","Pisces","Aquarius","Gemini"] },
  Libra:       { high: ["Gemini","Aquarius","Leo","Sagittarius"],     medium: ["Libra","Aries","Taurus","Capricorn"] },
  Scorpio:     { high: ["Cancer","Pisces","Virgo","Capricorn"],       medium: ["Scorpio","Taurus","Leo","Sagittarius"] },
  Sagittarius: { high: ["Aries","Leo","Libra","Aquarius"],            medium: ["Sagittarius","Gemini","Virgo","Pisces"] },
  Capricorn:   { high: ["Taurus","Virgo","Scorpio","Pisces"],         medium: ["Capricorn","Cancer","Leo","Libra"] },
  Aquarius:    { high: ["Gemini","Libra","Aries","Sagittarius"],      medium: ["Aquarius","Leo","Virgo","Taurus"] },
  Pisces:      { high: ["Cancer","Scorpio","Taurus","Capricorn"],     medium: ["Pisces","Virgo","Sagittarius","Gemini"] },
};

export function getZodiacFromBirthday(birthday: string | null): string | null {
  if (!birthday) return null;
  let month: number, day: number;
  const parts = String(birthday).replace(/\s+/g, "-").split("-");
  if (parts.length >= 2) {
    if (parts[0].length === 4) { month = parseInt(parts[1], 10); day = parseInt(parts[2], 10); }
    else { month = parseInt(parts[0], 10); day = parseInt(parts[1], 10); }
  } else return null;
  if (!month || !day || isNaN(month) || isNaN(day)) return null;
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

export function getZodiacCompat(sign1: string, sign2: string): { level: string; label: string; color: string } | null {
  if (!sign1 || !sign2) return null;
  const c = ZODIAC_COMPAT[sign1];
  if (!c) return null;
  if (c.high.includes(sign2)) return { level: "high", label: "Cosmic Match", color: "var(--bd-green)" };
  if (c.medium.includes(sign2)) return { level: "medium", label: "Compatible", color: "var(--bd-gold)" };
  return { level: "low", label: "Growth Pairing", color: "var(--bd-accent)" };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/zodiac.ts
git commit -m "feat: zodiac system ported to TypeScript"
```

---

## Phase 2: AI Backend (API Routes)

### Task 5: AI provider setup

**Files:**
- Create: `biggdate-next/src/lib/ai.ts`
- Create: `biggdate-next/.env.local`

- [ ] **Step 1: Create .env.local with AI provider config**

```
# AI Provider — supports "openai" or "ollama-cloud"
AI_PROVIDER=ollama-cloud
OLLAMA_CLOUD_HOST=https://ollama.com
OLLAMA_API_KEY=<your-key>
OLLAMA_CLOUD_MODEL=gpt-oss:120b

# For OpenAI:
# AI_PROVIDER=openai
# OPENAI_API_KEY=<your-key>
# OPENAI_MODEL=gpt-4.1
```

- [ ] **Step 2: Create AI provider module**

```ts
// src/lib/ai.ts
import { createOpenAI } from "@ai-sdk/openai";

function getProvider() {
  const aiProvider = (process.env.AI_PROVIDER || "ollama-cloud").toLowerCase();

  if (aiProvider === "openai") {
    return createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  if (aiProvider === "ollama-cloud") {
    return createOpenAI({
      apiKey: process.env.OLLAMA_API_KEY || "ollama",
      baseURL: `${(process.env.OLLAMA_CLOUD_HOST || "https://ollama.com").replace(/\/$/, "")}/v1`,
    });
  }

  // Local ollama
  return createOpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "ollama-local",
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  });
}

let _provider: ReturnType<typeof createOpenAI> | null = null;

export function getAIProvider() {
  if (!_provider) _provider = getProvider();
  return _provider;
}

export function getModel() {
  const aiProvider = (process.env.AI_PROVIDER || "ollama-cloud").toLowerCase();
  if (aiProvider === "openai") return process.env.OPENAI_MODEL || "gpt-4.1";
  if (aiProvider === "ollama-cloud") return process.env.OLLAMA_CLOUD_MODEL || "gpt-oss:120b";
  return process.env.OLLAMA_MODEL || "llama3.1:8b";
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai.ts .env.local
git commit -m "feat: AI SDK v6 provider setup (OpenAI + Ollama)"
```

Note: `.env.local` should already be in `.gitignore` from create-next-app. Verify before committing.

### Task 6: JSON storage helpers

**Files:**
- Create: `biggdate-next/src/lib/storage.ts`
- Create: `biggdate-next/data/memory.json`
- Create: `biggdate-next/data/platform.json`

- [ ] **Step 1: Create storage module**

```ts
// src/lib/storage.ts
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { SessionMemory } from "./types";

const DATA_DIR = path.resolve(process.cwd(), "data");
const MEMORY_FILE = path.join(DATA_DIR, "memory.json");
const PLATFORM_FILE = path.join(DATA_DIR, "platform.json");

function ensureFile(filePath: string, defaultContent: object) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  ensureFile(filePath, fallback as object);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown) {
  ensureFile(filePath, {});
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

// Memory store
type MemoryStore = { sessions: Record<string, SessionMemory> };

export function getSessionMemory(sessionId: string): SessionMemory | null {
  const store = readJson<MemoryStore>(MEMORY_FILE, { sessions: {} });
  return store.sessions?.[sessionId] || null;
}

export function updateSessionMemory(sessionId: string, patch: Partial<SessionMemory>) {
  if (!sessionId) return;
  const store = readJson<MemoryStore>(MEMORY_FILE, { sessions: {} });
  const current = store.sessions[sessionId] || {
    summary: "", traits: [], needs: [], boundaries: [],
    emotionalPatterns: [], triggers: [], reassuranceStyle: "",
    communicationStyle: "", companionNotes: "", attachmentGuess: "",
    readiness: null, previousQuestions: [], lastUpdated: null,
  };

  const mergeArrays = (a: string[], b: string[], max: number) =>
    Array.from(new Set([...a, ...b])).slice(0, max);

  store.sessions[sessionId] = {
    ...current,
    ...patch,
    traits: mergeArrays(current.traits, patch.traits || [], 8),
    needs: mergeArrays(current.needs, patch.needs || [], 8),
    boundaries: mergeArrays(current.boundaries, patch.boundaries || [], 8),
    emotionalPatterns: mergeArrays(current.emotionalPatterns, patch.emotionalPatterns || [], 10),
    triggers: mergeArrays(current.triggers, patch.triggers || [], 10),
    previousQuestions: mergeArrays(current.previousQuestions, patch.previousQuestions || [], 24),
    lastUpdated: new Date().toISOString(),
  };
  writeJson(MEMORY_FILE, store);
}

// Platform store
type PlatformStore = {
  waitlist: Array<{ id: string; name: string; email: string; city: string; intent: string; createdAt: string }>;
  intros: unknown[];
  passes: unknown[];
  debriefs: unknown[];
};

export function readPlatformStore(): PlatformStore {
  return readJson<PlatformStore>(PLATFORM_FILE, { waitlist: [], intros: [], passes: [], debriefs: [] });
}

export function writePlatformStore(store: PlatformStore) {
  writeJson(PLATFORM_FILE, store);
}
```

- [ ] **Step 2: Create initial data files**

```bash
mkdir -p /Users/themeetpatel/biggdate/biggdate-next/data
echo '{"sessions":{}}' > /Users/themeetpatel/biggdate/biggdate-next/data/memory.json
echo '{"waitlist":[],"intros":[],"passes":[],"debriefs":[]}' > /Users/themeetpatel/biggdate/biggdate-next/data/platform.json
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.ts data/
git commit -m "feat: JSON storage helpers for memory and platform data"
```

### Task 7: AI prompt templates

**Files:**
- Create: `biggdate-next/src/lib/prompts.ts`

- [ ] **Step 1: Create all prompt templates**

```ts
// src/lib/prompts.ts
import type { Profile, Match } from "./types";

export function onboardingSystemPrompt(memoryContext: string): string {
  return `You are the BiggDate soul discovery companion — warm, perceptive, emotionally intelligent. Your job is a 7-10 question deep conversation to understand this person's relationship patterns, attachment style, values, and what they truly need in love.

Rules:
- Ask ONE question at a time
- React to their answer with a brief, insightful acknowledgment (1 sentence) before asking the next question
- Be conversational, not clinical
- If they give short answers, gently probe deeper
- Never list multiple questions
- Collect: name, age, birthday, city, relationship intent, attachment patterns, values, dealbreakers, lifestyle
- When you've gathered enough (7+ exchanges), respond with EXACTLY this on its own line: PROFILE_COMPLETE

${memoryContext}`;
}

export function profileDerivePrompt(transcript: string): string {
  return `You are generating a final relationship profile from onboarding chat.
Return STRICT JSON only (no markdown, no explanation) with this exact shape:
{
  "name": "string",
  "age": number_or_null,
  "birthday": "MM-DD or null",
  "zodiac": "sign or null",
  "city": "string",
  "gender": "string or null",
  "orientation": "straight|gay|bisexual|other or null",
  "partnerGender": "string or null",
  "intent": "serious|casual|marriage|exploring or null",
  "hasKids": true_or_false_or_null,
  "wantsKids": "yes|no|open or null",
  "loveLanguage": "string or null",
  "drinking": "never|social|regularly or null",
  "smoking": "never|social|regularly or null",
  "exercise": "never|sometimes|often or null",
  "dealbreakers": ["string"],
  "partnerAgeMin": number_or_null,
  "partnerAgeMax": number_or_null,
  "attachment": "Secure|Anxious|Avoidant|Fearful-Avoidant",
  "attachmentScore": 0-100,
  "readinessScore": 0-100,
  "growthAreas": ["string","string","string"],
  "strengths": ["string","string","string"],
  "coreValues": ["string","string","string"],
  "summary": "string",
  "coachingFocus": "string"
}

Derive zodiac from birthday if mentioned. Use null for missing fields.
Transcript:
${transcript}`;
}

export function matchGenerationPrompt(profile: Profile): string {
  const zodiacNote = profile.zodiac
    ? `User is ${profile.zodiac}. Prefer compatible signs.`
    : "Zodiac unknown.";

  return `Generate exactly 3 highly compatible matches for this profile.
Profile: ${JSON.stringify(profile)}

${zodiacNote}
Intent: ${profile.intent || "serious"}. All matches must align.
${profile.partnerGender ? `Seeking: ${profile.partnerGender}.` : ""}
${profile.partnerAgeMin || profile.partnerAgeMax ? `Age range: ${profile.partnerAgeMin || 18}-${profile.partnerAgeMax || 99}.` : ""}

Return ONLY a JSON array. Each match:
name, age, city, profession, gender, zodiac, zodiacCompatNotes,
attachment, loveLanguage, intent, hasKids, wantsKids,
drinking, smoking, exercise,
compatibilityScore (0-100), authenticityScore (0-100),
intentAlignment ("High"|"Medium"|"Low"),
sharedValues (2 strings), whyTheyWork, conversationStarter, potentialFriction, emoji`;
}

export function lifePreviewPrompt(profile: Profile, match: Match): string {
  return `You are a world-class relationship psychologist and narrative storyteller. Based on two real soul profiles, generate a vivid, emotionally honest "Life Preview" — a cinematic vision of what life could look like if these two people got together.

YOUR PROFILE (the user):
${JSON.stringify({ name: profile.name, age: profile.age, attachment: profile.attachment, loveLanguage: profile.loveLanguage, coreValues: profile.coreValues, growthAreas: profile.growthAreas, strengths: profile.strengths, intent: profile.intent, zodiac: profile.zodiac })}

THEIR PROFILE (the match):
${JSON.stringify(match)}

Return STRICT JSON only:
{
  "storyArc": "A vivid 3-4 paragraph narrative of how your first year together might unfold. Include specific moments, turning points, and emotional texture. Reference their actual attachment styles, love languages, and values. Make it feel like reading a beautiful short story about real people. Be honest about challenges too.",

  "dayInTheLife": "A snapshot of an ordinary Tuesday together, 6-8 specific moments from morning to night. Reference their real habits, love languages, and personality quirks. Make it feel warm and lived-in, not idealized.",

  "compatibilityMap": {
    "valuesOverlap": ["3 specific shared values"],
    "communicationFit": "How their communication styles mesh — be specific about patterns",
    "conflictStyle": "How they'd fight and make up — based on attachment styles",
    "growthTrajectory": "How they'd make each other better people over time"
  },

  "hardTruth": "2-3 sentences about the biggest risk in this relationship and a specific strategy to navigate it. Reference their actual attachment patterns.",

  "growthScore": 0-100,

  "transformationNote": "One powerful sentence about who you'd become together that you couldn't become alone."
}

Be specific, not generic. Use their names. Reference real psychological patterns. This should feel like it was written by someone who deeply understands both people.`;
}

export function coachingPlanPrompt(profile: Profile): string {
  return `Based on this soul profile, create a warm, inspiring 30-day relationship readiness coaching plan.
Profile: ${JSON.stringify(profile)}
Format as 3 phases of 10 days each. Be specific and actionable but poetic. Each phase: title + 2-3 practices. Keep it under 400 words.`;
}

export function dailyIntentionPrompt(profile: Profile): string {
  return `Based on this relationship profile, write a single powerful daily intention for their love life journey. Make it personal to their specific attachment style and growth areas. 1-2 sentences. Contemplative, poetic, and actionable. No quotes. No preamble.

Profile: ${JSON.stringify({ name: profile.name, attachment: profile.attachment, growthAreas: profile.growthAreas, coachingFocus: profile.coachingFocus, readinessScore: profile.readinessScore })}`;
}

export function coachSystemPrompt(profile: Profile): string {
  return `You are the BiggDate relationship coach — warm, wise, direct. You know this person's soul profile deeply:

Name: ${profile.name}
Attachment: ${profile.attachment} (score: ${profile.attachmentScore})
Readiness: ${profile.readinessScore}/100
Growth Areas: ${(profile.growthAreas || []).join(", ")}
Strengths: ${(profile.strengths || []).join(", ")}
Values: ${(profile.coreValues || []).join(", ")}
Focus: ${profile.coachingFocus}

Be their trusted advisor. Give specific, actionable guidance. Reference their patterns. Challenge them lovingly when needed. Keep responses concise (2-4 sentences unless they ask for more).`;
}

export function memoryExtractionPrompt(transcript: string): string {
  return `Extract stable user relationship signals from this conversation. Return STRICT JSON only with keys: summary (string), traits (string[]), needs (string[]), boundaries (string[]), emotionalPatterns (string[]), triggers (string[]), reassuranceStyle (string), communicationStyle (string), companionNotes (string), attachmentGuess (string), readiness (number 0-100 or null). Keep concise.

Conversation:
${transcript}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/prompts.ts
git commit -m "feat: AI prompt templates including Life Preview generation"
```

### Task 8: Streaming chat API route

**Files:**
- Create: `biggdate-next/src/app/api/chat/route.ts`

- [ ] **Step 1: Create streaming chat endpoint**

```ts
// src/app/api/chat/route.ts
import { streamText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { getSessionMemory } from "@/lib/storage";

export async function POST(req: Request) {
  const { messages, systemPrompt, sessionId } = await req.json();

  const provider = getAIProvider();
  const modelId = getModel();

  // Build memory context
  const memory = sessionId ? getSessionMemory(sessionId) : null;
  const memoryContext = memory
    ? `Known user memory:\n- Summary: ${memory.summary || ""}\n- Traits: ${(memory.traits || []).join(", ")}\n- Attachment: ${memory.attachmentGuess || "unknown"}\n- Readiness: ${memory.readiness ?? "unknown"}`
    : "No prior user memory.";

  const fullSystem = `${systemPrompt || "You are a helpful assistant."}\n\n${memoryContext}`;

  const result = streamText({
    model: provider(modelId),
    system: fullSystem,
    messages, // AI SDK v6 accepts useChat messages directly
  });

  return result.toUIMessageStreamResponse();
}
```

Note: AI SDK v6 uses `toUIMessageStreamResponse()` for chat UIs using `useChat`. `streamText` accepts the `{ role, content }` message format from `useChat` directly — no conversion needed.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: streaming chat API route with session memory"
```

### Task 9: Profile derive API route

**Files:**
- Create: `biggdate-next/src/app/api/profile/derive/route.ts`

- [ ] **Step 1: Create profile derivation endpoint**

```ts
// src/app/api/profile/derive/route.ts
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { profileDerivePrompt } from "@/lib/prompts";
import { updateSessionMemory } from "@/lib/storage";
import type { Profile } from "@/lib/types";

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

const FALLBACK_PROFILE: Partial<Profile> = {
  attachment: "Anxious", attachmentScore: 70, readinessScore: 65,
  growthAreas: ["Clarify non-negotiables", "Strengthen communication", "Choose consistency over chemistry"],
  strengths: ["Emotionally expressive", "Self-reflective", "Values deep connection"],
  coreValues: ["Trust", "Consistency", "Growth"],
  summary: "You seek emotional depth and consistency. You're ready for meaningful love.",
  coachingFocus: "Choose aligned people and communicate needs directly.",
};

export async function POST(req: Request) {
  const { conversation, sessionId } = await req.json();

  const transcript = (conversation || [])
    .filter((m: { content: string }) => m && typeof m.content === "string")
    .slice(-30)
    .map((m: { role: string; content: string }) => `${m.role?.toUpperCase()}: ${m.content}`)
    .join("\n");

  if (!transcript) {
    return Response.json({ error: "conversation is required" }, { status: 400 });
  }

  const provider = getAIProvider();
  const modelId = getModel();

  try {
    const { text } = await generateText({
      model: provider(modelId),
      prompt: profileDerivePrompt(transcript),
      temperature: 0.4,
      maxTokens: 900,
    });

    const profile = extractJson(text) || { ...FALLBACK_PROFILE, name: "Friend" };

    if (sessionId) {
      updateSessionMemory(sessionId, {
        summary: (profile as Profile).summary || "",
        traits: (profile as Profile).strengths || [],
        needs: (profile as Profile).coreValues || [],
        attachmentGuess: (profile as Profile).attachment || "",
        readiness: typeof (profile as Profile).readinessScore === "number" ? (profile as Profile).readinessScore : null,
      });
    }

    return Response.json({ profile });
  } catch (error) {
    return Response.json({ error: (error as Error).message || "Failed to derive profile" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/profile/derive/route.ts
git commit -m "feat: profile derivation API route"
```

### Task 10: Match generation + Life Preview API routes

**Files:**
- Create: `biggdate-next/src/app/api/matches/generate/route.ts`
- Create: `biggdate-next/src/app/api/life-preview/route.ts`

- [ ] **Step 1: Create match generation endpoint**

```ts
// src/app/api/matches/generate/route.ts
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { matchGenerationPrompt } from "@/lib/prompts";

function extractJsonArray(text: string): unknown[] | null {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

export async function POST(req: Request) {
  const { profile } = await req.json();
  if (!profile) return Response.json({ error: "profile required" }, { status: 400 });

  const provider = getAIProvider();
  const modelId = getModel();

  try {
    const { text } = await generateText({
      model: provider(modelId),
      prompt: matchGenerationPrompt(profile),
      temperature: 0.8,
      maxTokens: 1400,
    });

    const matches = extractJsonArray(text);
    if (!Array.isArray(matches) || !matches.length) {
      return Response.json({ error: "Could not parse matches" }, { status: 500 });
    }

    // Add IDs to matches
    const withIds = matches.slice(0, 3).map((m, i) => ({
      ...m as object,
      id: `match_${Date.now()}_${i}`,
    }));

    return Response.json({ matches: withIds });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create Life Preview generation endpoint**

```ts
// src/app/api/life-preview/route.ts
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { lifePreviewPrompt } from "@/lib/prompts";

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

export async function POST(req: Request) {
  const { profile, match } = await req.json();
  if (!profile || !match) {
    return Response.json({ error: "profile and match required" }, { status: 400 });
  }

  const provider = getAIProvider();
  const modelId = getModel();

  // Life Preview returns structured JSON — use generateText (not streaming)
  // The client shows a loading animation while this generates, then reveals sections progressively
  try {
    const { text } = await generateText({
      model: provider(modelId),
      prompt: lifePreviewPrompt(profile, match),
      temperature: 0.85,
      maxTokens: 2000,
    });

    const preview = extractJson(text);
    if (!preview) {
      return Response.json({ error: "Could not parse Life Preview" }, { status: 500 });
    }
    return Response.json({ preview });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/matches/ src/app/api/life-preview/
git commit -m "feat: match generation + Life Preview streaming API routes"
```

### Task 11: Supporting API routes (coach-plan, daily-intention, waitlist)

**Files:**
- Create: `biggdate-next/src/app/api/coach-plan/route.ts`
- Create: `biggdate-next/src/app/api/daily-intention/route.ts`
- Create: `biggdate-next/src/app/api/waitlist/route.ts`

- [ ] **Step 1: Create coach-plan route**

```ts
// src/app/api/coach-plan/route.ts
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { coachingPlanPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  const { profile } = await req.json();
  if (!profile) return Response.json({ error: "profile required" }, { status: 400 });

  try {
    const { text } = await generateText({
      model: getAIProvider()(getModel()),
      prompt: coachingPlanPrompt(profile),
      temperature: 0.8,
      maxTokens: 900,
    });
    return Response.json({ plan: text });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create daily-intention route**

```ts
// src/app/api/daily-intention/route.ts
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { dailyIntentionPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  const { profile } = await req.json();
  if (!profile) return Response.json({ error: "profile required" }, { status: 400 });

  try {
    const { text } = await generateText({
      model: getAIProvider()(getModel()),
      prompt: dailyIntentionPrompt(profile),
      temperature: 0.92,
      maxTokens: 100,
    });
    return Response.json({ intention: text.trim().replace(/^["']|["']$/g, "") });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create waitlist route**

```ts
// src/app/api/waitlist/route.ts
import { readPlatformStore, writePlatformStore, createId } from "@/lib/storage";

export async function POST(req: Request) {
  const { name, email, city, intent = "long-term" } = await req.json();
  if (!name?.trim() || !email?.trim() || !city?.trim()) {
    return Response.json({ error: "name, email, city required" }, { status: 400 });
  }

  const store = readPlatformStore();
  const existing = store.waitlist.find(
    (e) => e.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (existing) return Response.json({ joined: true, entry: existing, duplicate: true });

  const entry = {
    id: createId("wl"),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    city: city.trim(),
    intent,
    createdAt: new Date().toISOString(),
  };
  store.waitlist.push(entry);
  writePlatformStore(store);
  return Response.json({ joined: true, entry, duplicate: false });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/coach-plan/ src/app/api/daily-intention/ src/app/api/waitlist/
git commit -m "feat: coach-plan, daily-intention, waitlist API routes"
```

---

## Phase 3: Core UI Components

### Task 12: Root layout + Nav

**Files:**
- Modify: `biggdate-next/src/app/layout.tsx`
- Create: `biggdate-next/src/components/nav.tsx`

- [ ] **Step 1: Update root layout with dark theme + metadata**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BiggDate — See Your Future, Not Just a Profile",
  description: "AI-powered dating that shows you what life looks like with someone before you ever meet. Soul profiling, Life Previews, and relationship coaching.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="antialiased bg-[var(--bd-bg)] text-[var(--bd-text)] min-h-screen">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create nav component**

```tsx
// src/components/nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <nav className="px-6 py-5 flex items-center justify-between border-b border-[var(--bd-border)] bg-[var(--bd-bg)]/80 backdrop-blur-xl sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--bd-accent)] to-[var(--bd-rose)] flex items-center justify-center text-sm font-bold animate-[glow_3s_ease_infinite]">
          ✦
        </div>
        <span className="text-xl font-bold tracking-tight">BiggDate</span>
      </Link>

      {isLanding ? (
        <div className="px-4 py-2 rounded-full border border-[var(--bd-border)] text-xs text-[var(--bd-text-muted)]">
          Beta · Invite Only
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {[
            { href: "/dashboard", label: "Home" },
            { href: "/matches", label: "Life Previews" },
            { href: "/coach", label: "Coach" },
            { href: "/profile", label: "Profile" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                pathname === href
                  ? "bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border border-[var(--bd-border-glow)]"
                  : "text-[var(--bd-text-muted)] hover:text-[var(--bd-text)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/components/nav.tsx
git commit -m "feat: root layout with dark theme + nav component"
```

### Task 13: Orb background + Soul ring components

**Files:**
- Create: `biggdate-next/src/components/orb-background.tsx`
- Create: `biggdate-next/src/components/soul-ring.tsx`

- [ ] **Step 1: Create orb background**

```tsx
// src/components/orb-background.tsx
const CONFIGS = {
  default: [
    { color: "180,140,255", x: "15%", y: "20%", size: 500, anim: "orb1 12s ease-in-out infinite" },
    { color: "255,107,138", x: "75%", y: "60%", size: 400, anim: "orb2 15s ease-in-out infinite" },
    { color: "79,255,176", x: "50%", y: "85%", size: 300, anim: "orb1 18s ease-in-out infinite reverse" },
  ],
  match: [
    { color: "255,107,138", x: "20%", y: "15%", size: 500, anim: "orb2 13s ease-in-out infinite" },
    { color: "180,140,255", x: "70%", y: "70%", size: 400, anim: "orb1 17s ease-in-out infinite" },
  ],
  report: [
    { color: "245,200,66", x: "10%", y: "30%", size: 450, anim: "orb1 14s ease-in-out infinite" },
    { color: "180,140,255", x: "80%", y: "20%", size: 350, anim: "orb2 16s ease-in-out infinite" },
  ],
} as const;

type Variant = keyof typeof CONFIGS;

export function OrbBackground({ variant = "default" }: { variant?: Variant }) {
  const orbs = CONFIGS[variant] || CONFIGS.default;
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, rgba(${orb.color},0.18) 0%, rgba(${orb.color},0.06) 50%, transparent 70%)`,
            animation: orb.anim,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create soul ring (readiness score)**

```tsx
// src/components/soul-ring.tsx
interface SoulRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function SoulRing({ score, size = 140, strokeWidth = 11 }: SoulRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={center} cy={center} r={radius} fill="none"
          stroke="url(#soulGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-[1.8s] ease-[cubic-bezier(0.4,0,0.2,1)]"
        />
        <defs>
          <linearGradient id="soulGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bd-accent)" />
            <stop offset="100%" stopColor="var(--bd-rose)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold tracking-tighter text-[var(--bd-accent)]">{score}</div>
        <div className="text-[10px] text-[var(--bd-text-muted)] uppercase tracking-widest">Readiness</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/orb-background.tsx src/components/soul-ring.tsx
git commit -m "feat: orb background + soul ring components"
```

### Task 14: Profile store (client-side localStorage)

**Files:**
- Create: `biggdate-next/src/lib/profile-store.ts`

- [ ] **Step 1: Create client-side profile helpers**

```ts
// src/lib/profile-store.ts
"use client";

import type { Profile } from "./types";

const PROFILE_KEY = "biggdate_profile";
const SESSION_KEY = "soulmap_session_id";
const STREAK_KEY = "biggdate_streak";

export function getStoredProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(STREAK_KEY);
  } catch {}
}

export function getSessionId(): string {
  if (typeof window === "undefined") return `onboarding-${Math.random().toString(36).slice(2, 10)}`;
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = `onboarding-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(SESSION_KEY, created);
  return created;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/profile-store.ts
git commit -m "feat: client-side profile localStorage helpers"
```

---

## Phase 4: Screens

### Task 15: Landing page

**Files:**
- Modify: `biggdate-next/src/app/page.tsx`

- [ ] **Step 1: Build landing page**

The landing page is a Server Component (no interactivity except the CTA links). It should include:
- Nav (Beta badge)
- Hero: "See your future, not just a profile" — gradient text
- 3 feature cards: Soul Discovery, Life Previews, Growth Coaching
- Stats bar: "79% of daters burned out", "11% find algorithms good", "3x better dates"
- "The Problem" manifesto section
- Comparison table (Every Other App vs BiggDate)
- Final CTA → /discover

Build it using shadcn Card, Badge, Button, and Separator components + Tailwind utilities. Keep the dark glassmorphism aesthetic but clean it up with design-system tokens.

Key: The hero should emphasize **Life Previews** as the differentiator — "See what life looks like with someone before you meet."

- [ ] **Step 2: Verify landing page renders**

Run: `npm run dev`
Visit: http://localhost:3000
Expected: Landing page renders with dark theme, orb background, gradient hero text

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: landing page with Life Preview positioning"
```

### Task 16: Soul Discovery (onboarding) page

**Files:**
- Create: `biggdate-next/src/components/onboarding-chat.tsx`
- Create: `biggdate-next/src/app/discover/page.tsx`

- [ ] **Step 1: Create onboarding chat component**

This is a Client Component using `useChat` from `@ai-sdk/react`. It streams the AI conversation, tracks question count, detects PROFILE_COMPLETE signal, then calls `/api/profile/derive` to generate the soul profile.

Key features:
- Streaming AI responses
- Voice input via Web Speech API (optional, with fallback)
- Progress indicator (question X of ~10)
- On PROFILE_COMPLETE: derive profile → save to localStorage → redirect to /profile

Use AI Elements `<MessageResponse>` for rendering AI messages (handles markdown properly).

- [ ] **Step 2: Create discover page**

```tsx
// src/app/discover/page.tsx
import { OnboardingChat } from "@/components/onboarding-chat";
import { OrbBackground } from "@/components/orb-background";
import { Nav } from "@/components/nav";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen relative">
      <OrbBackground />
      <div className="relative z-10">
        <Nav />
        <div className="max-w-2xl mx-auto px-5 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bd-accent-soft)] border border-[var(--bd-border-glow)] text-xs text-[var(--bd-accent)] font-medium uppercase tracking-wider mb-6">
            <span className="animate-pulse">◆</span> Soul Discovery
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Let&apos;s understand you</h1>
          <p className="text-[var(--bd-text-muted)] text-sm mb-8">
            A 5-minute conversation that understands you better than years of swiping.
          </p>
          <OnboardingChat />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify onboarding flow works**

Run: `npm run dev`
Visit: http://localhost:3000/discover
Expected: Chat interface appears, can type messages, AI streams responses

- [ ] **Step 4: Commit**

```bash
git add src/components/onboarding-chat.tsx src/app/discover/page.tsx
git commit -m "feat: soul discovery onboarding with streaming AI chat"
```

### Task 17: Soul Profile (report) page

**Files:**
- Create: `biggdate-next/src/app/profile/page.tsx`
- Create: `biggdate-next/src/components/profile-badges.tsx`

- [ ] **Step 1: Create profile badges component**

Small reusable component for attachment style, zodiac, core values badges.

- [ ] **Step 2: Create profile page**

Client Component that reads profile from localStorage. Displays:
- Name + summary hero
- Readiness score ring
- Attachment style card
- Core values + strengths + growth areas (in shadcn Tabs)
- Zodiac badge
- 30-day coaching plan (fetched from /api/coach-plan on mount)
- CTA: "See Your Life Previews →" → /matches

Render the coaching plan with AI Elements `<MessageResponse>` for proper markdown.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/page.tsx src/components/profile-badges.tsx
git commit -m "feat: soul profile page with readiness ring, tabs, coaching plan"
```

### Task 18: Dashboard page

**Files:**
- Create: `biggdate-next/src/app/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

Client Component. The central hub. Displays:
- Welcome back + name + summary
- Readiness ring
- Daily intention (fetched from /api/daily-intention, rendered with `<MessageResponse>`)
- 3 action cards: "Life Previews" → /matches, "Coach" → /coach, "Profile" → /profile
- Growth snapshot (coaching focus, top strength, growth edge)
- Agent status bar ("Your AI agent is active")

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: dashboard hub with daily intention + action cards"
```

### Task 19: Life Previews (matches) page — THE CORE INNOVATION

**Files:**
- Create: `biggdate-next/src/components/life-preview-card.tsx`
- Create: `biggdate-next/src/app/matches/page.tsx`

- [ ] **Step 1: Create Life Preview card component**

This is the key differentiator. NOT a Tinder card. Each card shows:
- Match name, age, city, profession
- Zodiac compatibility badge
- Growth score (how much this person helps you grow)
- One-line "transformation note" — who you'd become together
- "See Your Future →" CTA button
- Subtle gradient border based on compatibility level

- [ ] **Step 2: Create matches page**

Client Component that:
1. Fetches matches from /api/matches/generate on mount (with loading skeleton)
2. Displays 3 Life Preview cards in a grid
3. Each card links to /match/[id] for the full Life Preview
4. "Refresh Matches" button to regenerate

- [ ] **Step 3: Commit**

```bash
git add src/components/life-preview-card.tsx src/app/matches/page.tsx
git commit -m "feat: Life Preview cards — matches page"
```

### Task 20: Individual Life Preview detail page — THE WOW MOMENT

**Files:**
- Create: `biggdate-next/src/components/life-preview-detail.tsx`
- Create: `biggdate-next/src/app/match/[id]/page.tsx`

- [ ] **Step 1: Create Life Preview detail component**

This is where the magic happens. When a user clicks "See Your Future", this page streams a full Life Preview:

Sections (each rendered with `<MessageResponse>` for beautiful markdown):
1. **The Story Arc** — cinematic first-year narrative
2. **A Day in Your Life Together** — ordinary Tuesday snapshot
3. **Compatibility Map** — visual cards for values, communication, conflict, growth
4. **The Hard Truth** — honest risk assessment + navigation strategy
5. **Growth Score** — ring visualization + transformation note

Each section streams in progressively as the AI generates it.

Bottom CTAs:
- "I Want This Life" → request intro (saves to platform store)
- "Not For Me" → pass (saves reason)

- [ ] **Step 2: Create match detail page**

```tsx
// src/app/match/[id]/page.tsx
import { LifePreviewDetail } from "@/components/life-preview-detail";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LifePreviewDetail matchId={id} />;
}
```

The LifePreviewDetail component (Client) reads the match from localStorage (where matches page stored them) and streams the Life Preview.

- [ ] **Step 3: Commit**

```bash
git add src/components/life-preview-detail.tsx src/app/match/
git commit -m "feat: Life Preview detail — AI-generated future narrative"
```

### Task 21: Coach page

**Files:**
- Create: `biggdate-next/src/components/coach-chat.tsx`
- Create: `biggdate-next/src/app/coach/page.tsx`

- [ ] **Step 1: Create coach chat component**

Client Component using `useChat` with the coach system prompt. Streams responses. Uses AI Elements `<MessageResponse>` for rendering.

- [ ] **Step 2: Create coach page**

```tsx
// src/app/coach/page.tsx
import { CoachChat } from "@/components/coach-chat";
import { OrbBackground } from "@/components/orb-background";
import { Nav } from "@/components/nav";

export default function CoachPage() {
  return (
    <div className="min-h-screen relative">
      <OrbBackground />
      <div className="relative z-10">
        <Nav />
        <div className="max-w-3xl mx-auto px-5 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(79,255,176,0.1)] border border-[rgba(79,255,176,0.25)] text-xs text-[var(--bd-green)] font-medium uppercase tracking-wider mb-6">
            ◆ BiggDate Coach
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your growth partner</h1>
          <p className="text-[var(--bd-text-muted)] text-sm mb-8">
            Ask anything about relationships, dating, or personal growth.
          </p>
          <CoachChat />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/coach-chat.tsx src/app/coach/page.tsx
git commit -m "feat: AI coach chat with streaming"
```

---

## Phase 5: Polish + Integration

### Task 22: Route protection + redirects

**Files:**
- Create: `biggdate-next/src/app/dashboard/layout.tsx` (or similar pattern)

- [ ] **Step 1: Add client-side route guards**

For now (no auth yet), use a simple pattern: pages that require a profile check localStorage on mount and redirect to /discover if no profile exists. Pages that don't need a profile (landing, discover) work without.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: client-side route guards for profile-required pages"
```

### Task 23: Shareable Soul Card

**Files:**
- Create: `biggdate-next/src/components/share-soul-card.tsx`
- Create: `biggdate-next/src/app/opengraph-image.tsx`

- [ ] **Step 1: Create shareable soul card component**

A visually stunning card showing:
- Name + zodiac
- Attachment style
- Readiness score
- Core values
- "Discover yours at biggdate.com"

With a "Share to Stories" button that captures the card as an image (html2canvas or similar).

- [ ] **Step 2: Create OG image**

Dynamic OG image using Satori that shows the app name and tagline for social sharing.

- [ ] **Step 3: Commit**

```bash
git add src/components/share-soul-card.tsx src/app/opengraph-image.tsx
git commit -m "feat: shareable soul card + OG image"
```

### Task 24: Final integration test + cleanup

- [ ] **Step 1: Test full flow**

1. Visit / → landing renders
2. Click "Begin Your Journey" → /discover
3. Complete onboarding chat → profile derived → redirect to /profile
4. View soul profile → click "See Life Previews"
5. /matches → 3 cards load
6. Click a card → /match/[id] → Life Preview streams
7. /dashboard renders with daily intention
8. /coach streams AI responses

- [ ] **Step 2: Clean up any TypeScript errors**

Run: `npx tsc --noEmit`
Fix any type errors.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: BiggDate v2 — Life Previews rewrite complete"
```

---

## Future Phases (Not in this plan)

These are documented for context but will be separate plans:

1. **Auth (Clerk)** — real user accounts, JWT, protected routes
2. **Database (Neon Postgres)** — replace JSON file storage
3. **Photo upload (Vercel Blob)** — replace localStorage base64
4. **Real-time messaging** — WebSocket between matched users
5. **Agent-to-agent matching** — real users, not AI-generated matches
6. **Payments (Stripe)** — Free/Core/Concierge tiers
7. **PWA** — mobile-first experience
8. **Waitlist virality** — referral mechanics, position tracking
