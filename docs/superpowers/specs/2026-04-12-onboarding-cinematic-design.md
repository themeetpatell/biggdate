# BiggDate — Cinematic Onboarding Design Spec
**Date:** 2026-04-12  
**Status:** Approved  
**Scope:** `src/app/onboarding/page.tsx`, `src/components/chat-message.tsx`, `src/lib/prompts.ts`  

---

## 1. Problem Statement

The current onboarding is a generic chat bubble UI. It is indistinguishable from any chat SDK demo. It has no quick-reply chips (pure typing = high mobile friction), no visual phase awareness, no streaming personality, and its welcome screen frames the experience as a task ("~5 min", "10 questions") rather than a meaningful ritual. For a product targeting emotionally intelligent 24–35 year-old Indian diaspora users who have high aesthetic standards and are tired of shallow dating apps, this is a critical miss.

---

## 2. Goal

Replace the chat bubble onboarding with a **Cinematic Conversation** — an immersive, atmospheric experience that:
- Captures ~45% of the Profile type (12 key fields) in 8 targeted exchanges
- Feels like being seen by a warm, witty, perceptive friend — not filling out a form
- Has A+B+D visual register: clean/premium + warm/intimate + cinematic/immersive
- Runs on the existing `useChat` + `/api/chat` + `/api/profile/derive` stack with zero API changes

---

## 3. Target Audience

- **Primary GTM:** Indian diaspora — urban, educated, 24–35, emotionally intelligent
- **Global second wave:** Same psychographic across cultures
- **User psyche:** Wants to be deeply known but fears vulnerability. Needs staged intimacy — trust must be earned before depth is reached.
- **AI persona:** Warm close friend + playful/witty (A+D mix). Think: "your most emotionally intelligent best friend who would absolutely roast you for using 'fine' to describe a 4-year relationship."

---

## 4. Conversation Architecture

### Principle: Double-Duty Questions
Every question must feel natural in conversation AND extract 2–3 profile fields. The AI derives, never asks directly.

### 8-Question Arc (captures ~12 profile fields ≈ 45% of Profile type)

| Q# | Sounds like | Profile fields extracted |
|---|---|---|
| Q1 | *"First — what do I call you, and what city are you in?"* | `name`, `city` |
| Q2 | *"What brought you here — like, what was the moment you decided to try something different?"* | `intent`, `readinessScore` (partial) |
| Q3 | *"Quick one — are you looking for someone who's [chip options]? And roughly what age range feels right?"* | `partnerGender`, `orientation`, `partnerAgeMin`, `partnerAgeMax` |
| Q4 | *"Tell me about the last relationship that actually meant something. What broke?"* | `attachment` (inferred), `conflictStyle`, `growthAreas` |
| Q5 | *"How do you know when someone genuinely cares about you — what do they actually do?"* | `loveLanguage`, `needs` |
| Q6 | *"What's the thing that, if you found out on date 3, would quietly end it?"* | `dealbreakers`, `wantsKids` (inferred), `smoking`/`drinking` (inferred) |
| Q7 | *"What does your Tuesday look like in the life you actually want — 3 years from now?"* | `lifeArchitecture`, `familyExpectations`, `wantsKids` |
| Q8 | *"Last one. What do you bring that's actually hard to find?"* | `strengths`, `coreValues`, `offers` |

After Q8: AI delivers one **"Maahi notices" reflection** (mid-conversation pattern callout), then emits `PROFILE_COMPLETE`.

### Remaining 55% of Profile
Fields like `zodiac`, `photos`, `exercise`, detailed `attachmentScore`, `coachingFocus` are built progressively post-onboarding through check-ins, debrief reflections, and companion chat. This is intentional — don't front-load, build over time.

### Completion Signal
`PROFILE_COMPLETE` emitted on its own line after Q8 + reflection, same as current. Client detection and `deriveProfile()` logic unchanged.

---

## 5. System Prompt Changes

### Quick-Reply Chip Protocol
After responses where a structured choice is appropriate, the AI appends:
```
[CHIPS: option1 | option2 | option3]
```
This suffix is parsed client-side and stripped before display. Not every message gets chips — nuanced questions (Q4, Q5, Q8) are text-only. Structured questions (Q3, Q6, Q7 partial) get chips.

### Tone Update
- Warm, witty, slightly playful (A+D mix)
- Can tease gently ("that's... a very diplomatic answer")
- One genuine observation + one question per turn — same discipline
- No clinical language, no therapy-speak
- Indian cultural context awareness: family expectations, arranged/love marriage spectrum, are normal conversational territory — not taboo

### "Maahi Notices" Moments
Mid-conversation (typically around Q5–Q6), when a pattern emerges, the AI surfaces it distinctly:
- Prefixed with `[NOTICE]` token, stripped client-side, rendered as a separate visual variant
- Example: `[NOTICE] Wait — you've circled back to independence twice now. That's not random.`
- Rendered as: italic, centered, smaller, with a subtle glow border in the current act's accent color

---

## 6. UI Architecture

### Three Layers (all in `onboarding/page.tsx`)

```
┌─────────────────────────────────────┐
│  AMBIENT LAYER (z-0, fixed)         │
│  Full-screen radial gradient that   │
│  evolves across 5 acts via CSS      │
│  custom property --act (1–5).       │
│  2s transition, pointer-events none │
├─────────────────────────────────────┤
│  CONTENT LAYER (z-10)               │
│  No chat bubbles. Two zones:        │
│  - AI: large prose, left-anchored,  │
│    materializes word-by-word        │
│  - User: right-anchored, warm       │
│    gradient text, no box/bubble     │
│  - Notice: centered, italic, glow   │
├─────────────────────────────────────┤
│  INPUT LAYER (z-20)                 │
│  Quick-reply chips (3 options) +    │
│  expandable textarea below.         │
│  Chips appear after streaming ends. │
└─────────────────────────────────────┘
```

### Scroll
Replace `StickToBottom` / `Conversation` wrapper with a standard `overflow-y-auto` container with `scroll-behavior: smooth`. Auto-scroll to bottom on new message via `useEffect` + `scrollIntoView`. Simpler, more controllable.

---

## 7. Component Specifications

### 7.1 `AmbientLayer` (new)
- `position: fixed; inset: 0; z-index: 0; pointer-events: none`
- Driven by `--act` CSS variable (1–5) set on `<html>` or wrapper `div`
- Radial gradient from center, transitions over `2s ease`

| Act | Phase | Color (oklch) | Mood |
|---|---|---|---|
| 1 | Opening | `oklch(8% 0.01 260)` | Near black, barely blue — safe |
| 2 | Story | `oklch(10% 0.04 30)` | Trace amber — intimacy building |
| 3 | Pattern | `oklch(9% 0.06 350)` | Rose undertone — emotionally charged |
| 4 | Architecture | `oklch(8% 0.05 280)` | Violet depth — big picture |
| 5 | Reveal | `oklch(11% 0.08 55)` | Golden arrival — earned, complete |

Act advances: Q1–Q2 = Act 1, Q3–Q4 = Act 2, Q5–Q6 = Act 3, Q7 = Act 4, Q8+ = Act 5.

### 7.2 `OnboardingMessage` (replaces `ChatMessage` for onboarding)
Two render paths:

**AI message:**
- No avatar, no bubble box
- `text-xl` (mobile) / `text-2xl` (desktop), Geist font, `font-light`, `leading-relaxed`
- Left-anchored, `max-w-[85%]`
- Streams token-by-token — leverage existing streaming from `useChat` as-is; no changes to streaming logic. The token-by-token output naturally creates the "materializing text" effect.
- Color: `var(--bd-text)` with `opacity-90`

**User answer:**
- Right-anchored, `text-base`, `font-normal`
- No bubble box — just text with warm gradient: `background: linear-gradient(135deg, #e8927c, #d4688a); -webkit-background-clip: text; -webkit-text-fill-color: transparent`
- `max-w-[75%]`

**Notice variant** (`[NOTICE]` prefix detected):
- Strip `[NOTICE]` token
- Render: `text-sm italic text-center` with left border `2px solid currentActColor`, `opacity-80`
- Slight indentation, centered in viewport

### 7.3 `QuickReplies` (new component)
- Appears below AI message once streaming is complete AND chips are present
- 3 pill chips: `px-4 py-2 rounded-full text-sm border border-current/20 backdrop-blur-sm`
- Color matches current act's accent
- One "↩ say more" ghost chip always present — expands textarea instead of sending
- Tapping a chip: sends chip text as message + fades out all chips
- Chips fade in with `opacity: 0 → 1, translateY: 8px → 0` over `200ms`
- On mobile: horizontally scrollable row if chips overflow
- Chip data: parsed from `[CHIPS: a | b | c]` suffix, stripped from displayed text

### 7.4 `ThinkingPulse` (replaces streaming indicator)
- Single 8px circle, `border-radius: 50%`
- Animation: `scale(0.8) opacity(0.3)` → `scale(1.2) opacity(0.8)` → back, `1.4s ease-in-out infinite`
- Color: current act's accent color
- Appears immediately on user send; disappears when first streaming token arrives
- Positioned left-anchored, same indentation as AI messages

### 7.5 `SoulSignal` (new — corner presence indicator)
- Fixed position: `bottom-6 left-6`, `z-index: 20`
- 28px circular SVG ring (like a clock with 8 sectors)
- Starts empty. Each completed question fills one sector clockwise with current act's accent color
- On hover/tap: expands to a small tooltip listing understood themes ("Knows your intent ✓", "Sees your patterns ✓")
- Subtle glow shadow matching act color
- Does NOT appear until after Q1 completes (first message exchange)

### 7.6 Welcome Screen (redesign)
- Full screen. Ambient Layer visible (Act 1).
- No header steps, no progress bar, no stat grid
- Center content (vertically and horizontally):
  - Small wordmark: `BiggDate` — `text-sm tracking-widest opacity-50`
  - Headline: `"Tell me something real and I'll show you who you are."` — `text-3xl font-light`
  - Subline: `"Private. No forms. Just a conversation."` — `text-sm opacity-50`
- AI sends **first message automatically** 1.2s after page load via `useEffect` + `sendMessage`. No "Begin Discovery" button.
- On first AI message: welcome screen fades out (`opacity: 0` over `600ms`), content layer fades in.

### 7.7 Soul Snapshot Reveal (ritual transition)
When `PROFILE_COMPLETE` detected (same logic as current):
1. Chips disappear immediately
2. Input layer fades out (`opacity: 0`, `300ms`)
3. Ambient layer transitions to Act 5 gold (`2s`)
4. Content layer fades to 20% opacity (`1s`)
5. Centered text appears: `"We see you."` — `text-2xl font-light` — holds for `2s`
6. `deriveProfile()` runs in background during steps 3–5
7. On profile ready: `router.push('/soul-snapshot')` — use CSS opacity transition as the crossfade mechanism (View Transitions API as progressive enhancement if browser supports it)

---

## 8. Header Redesign

During conversation (post-welcome):
- No step indicators (Values/Attachment/Boundaries/Profile) — remove entirely
- No progress bar
- Minimal: just wordmark on left, `SoulSignal` in bottom-left corner
- Header becomes nearly invisible: `8px padding`, just the wordmark at `opacity-40`

---

## 9. Input Area Redesign

- Only visible after first AI message (not on welcome screen)
- No rounded box container — open, minimal
- Textarea: `bg-transparent border-0 border-b border-white/10 focus:border-white/30` — like writing on a surface, not into a box
- Placeholder rotates based on act:
  - Act 1: `"What feels true right now..."`
  - Act 2: `"Take your time..."`
  - Act 3: `"Be honest..."`
  - Act 4: `"Dream a little..."`
  - Act 5: `"Last thing..."`
- Send button: minimal arrow, right-aligned, only active when text is present
- `QuickReplies` appear above the input area, not inside it

---

## 10. Files Changed

| File | Change type |
|---|---|
| `src/app/onboarding/page.tsx` | Full rewrite — cinematic layout, AmbientLayer, welcome auto-start, ritual reveal |
| `src/components/chat-message.tsx` | Full rewrite → `OnboardingMessage` with AI/user/notice variants |
| `src/lib/prompts.ts` | `onboardingSystemPrompt` updated — 8-question arc, chip protocol, notice token |
| `src/components/onboarding/quick-replies.tsx` | New component |
| `src/components/onboarding/thinking-pulse.tsx` | New component |
| `src/components/onboarding/soul-signal.tsx` | New component |
| `src/components/onboarding/ambient-layer.tsx` | New component |

**No changes to:** `/api/chat`, `/api/profile/derive`, `src/lib/types.ts`, `src/lib/db.ts`, `src/lib/repo.ts`

---

## 11. Success Criteria

- [ ] Onboarding completion rate measurably higher (target: 70%+ vs estimated current 40-50%)
- [ ] 8 questions capture `name`, `city`, `intent`, `partnerGender`, `orientation`, `partnerAgeMin/Max`, `attachment`, `conflictStyle`, `loveLanguage`, `dealbreakers`, `lifeArchitecture`, `strengths`, `coreValues` — 13+ fields
- [ ] Quick-reply chips appear on Q3, Q6, Q7 (structured questions)
- [ ] Ambient background visibly shifts at act boundaries
- [ ] No chat bubbles visible anywhere in the flow
- [ ] ThinkingPulse appears between user send and first AI token
- [ ] SoulSignal fills correctly across 8 questions
- [ ] Soul Snapshot reveal plays the ritual transition (not just a redirect)
- [ ] Welcome screen AI message fires automatically at 1.2s, no button required
- [ ] Mobile-first: all chips usable with one thumb, no horizontal overflow on 390px viewport
