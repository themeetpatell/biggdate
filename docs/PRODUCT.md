# BiggDate — Product Spec and Implementation Audit

> **Version:** 2.0
> **Last Reviewed:** 2026-04-11
> **Status:** Canonical for the current Next.js codebase
> **Audience:** Product, design, engineering

---

## Table of Contents

1. [What This Document Is](#1-what-this-document-is)
2. [Executive Summary](#2-executive-summary)
3. [Current Product Truth](#3-current-product-truth)
4. [Implementation Status Matrix](#4-implementation-status-matrix)
5. [Live User Journey](#5-live-user-journey)
6. [Screens and Experiences](#6-screens-and-experiences)
7. [AI System Design](#7-ai-system-design)
8. [Data Model](#8-data-model)
9. [API Surface](#9-api-surface)
10. [Design System](#10-design-system)
11. [Technical Architecture](#11-technical-architecture)
12. [Gaps Between Vision and Build](#12-gaps-between-vision-and-build)
13. [Recommended Priorities](#13-recommended-priorities)

---

## 1. What This Document Is

Related document:

- `docs/STRATEGY.md` is the forward-looking market and product strategy.
- `docs/PRODUCT.md` remains the canonical description of what is actually built in this repository today.

The previous `PRODUCT.md` described a March 2026 prototype:

- Vite + React SPA
- Express backend
- flat JSON storage
- localStorage-heavy persistence
- photo upload flow
- zodiac-heavy match framing

That is no longer the canonical implementation.

This document describes the app that currently exists in the repository:

- Next.js 16 App Router
- React 19
- route handlers under `src/app/api/*`
- cookie-based auth
- Postgres persistence via `pg`
- a product direction centered on **Soul Discovery -> Life Preview -> Guided Connection -> Debrief -> Aura**

It also separates:

- what is **live**
- what is **partially implemented**
- what is still **vision / roadmap**

---

## 2. Executive Summary

BiggDate is no longer best described as "AI dating with 3 intros and a report."

The current product is closer to:

1. **Relationship profiling** through a staged AI conversation.
2. **Narrative matching** through emotionally legible, AI-generated matches.
3. **Life Preview** as the signature artifact: a cinematic compatibility read on what a relationship with a match might actually feel like.
4. **Guided connection** through intros, icebreakers, and date ideas.
5. **Reflection and companionship** through structured post-date debriefs and Aura, the ongoing AI companion.

The strongest differentiated idea in the live app is not zodiac matching or "3 curated intros."
It is the shift from profile browsing to **emotional foresight**.

The current build already supports that direction well enough to document honestly:

- Authenticated users
- server-backed profiles
- session memory during onboarding
- daily cached AI matches
- cached Life Previews
- intro/pass actions
- date conversation support
- debrief reflection
- persistent AI companion

The biggest problem is documentation drift, not lack of product thinking. The old doc is describing a different app.

---

## 3. Current Product Truth

### Positioning

**Current tagline in code:** "See your future, not just a profile."

That is directionally right.

BiggDate is currently positioned as a premium, AI-mediated dating product for people who want:

- fewer but more meaningful introductions
- emotional clarity before investing time
- language for their own patterns
- guided movement from curiosity to real-world connection

### Core Loop

The live product loop is:

1. **Soul Discovery**
   The user completes an AI-guided onboarding conversation that moves through opening, history, values, and life-architecture phases.
2. **Profile Derivation**
   The transcript is turned into a structured relationship profile with readiness, attachment, values, needs, strengths, and life-direction data.
3. **Life Previews**
   The system generates three AI matches and then generates a richer forecast for each match.
4. **Connection Support**
   If the user wants to proceed, BiggDate supports the move toward conversation and a date with intros, icebreakers, and venue ideas.
5. **Reflection**
   The user records a structured debrief and gets AI insight.
6. **Aura**
   The user continues with an always-available relationship companion.

### Canonical Product Identity

If the team has to summarize the current product in one sentence:

**BiggDate helps people understand themselves, preview the emotional reality of a match, and date with more context and less projection.**

---

## 4. Implementation Status Matrix

| Capability | Status | Notes |
|---|---|---|
| Marketing landing page | Live | Strong premium positioning and anti-swipe framing |
| Email/password auth | Live | Cookie-based sessions stored in Postgres |
| AI onboarding chat | Live | Uses streaming, onboarding phases, and memory extraction |
| Session memory during onboarding | Live | Persisted in `session_memory` table |
| Structured profile derivation | Live | Stored in `profiles` table |
| Soul profile report | Live | Present as `/report`, but not the primary first destination |
| Intelligence card / soul snapshot | Live | Present as `/soul-snapshot` and `/soul-card` |
| Dashboard | Live | Includes readiness, daily intention, and key actions |
| AI-generated matches | Live | Generated daily and cached per user |
| Life Preview | Live | Core differentiated experience |
| Intro request / pass | Live | Stored in DB |
| Match briefing | Partial | API exists, but current UX emphasizes Life Preview more than briefing |
| Icebreakers | Live | Generated for connection flow |
| Date concierge / venue ideas | Live | Basic AI-generated suggestions |
| Structured post-date debrief | Live | Three-question debrief flow implemented |
| Growth reflection endpoint | Partial | API exists but is not the center of the current UX |
| Aura companion | Live | Persistent AI chat experience |
| Separate coach chat | Partial | Route exists, but Aura is more central in live navigation |
| Waitlist join API | Live | Exists, but not central to current authenticated flow |
| Photo upload flow | Not live | Legacy concept only; not part of current Next flow |
| Webcam capture | Not live | Only present in legacy `src/App.jsx` |
| LocalStorage profile persistence | Not live | Replaced by auth + DB |
| Flat-file JSON persistence | Not live | Replaced by Postgres for the live app |
| Real user-to-user matching | Not live | Matches are AI-generated personas, not real members |
| In-app messaging between matched users | Not live | Not implemented |
| Referral mechanics | Not live | Not implemented |
| Human concierge layer | Not live | Not implemented |
| Voice-first onboarding | Not live | Not implemented |

---

## 5. Live User Journey

```text
Landing
  ->
Auth
  ->
Onboarding Chat
  ->
Profile Derivation
  ->
Soul Snapshot / Report
  ->
Dashboard
  ->
Matches
  ->
Life Preview
  ->
Connect
  ->
Debrief
  ->
Aura
```

### Entry Rules

- Unauthenticated users land on `/` or `/auth`.
- Authenticated users without a profile are directed to `/onboarding`.
- Authenticated users with a profile can access `/dashboard` and the rest of the product.

### Returning User Behavior

Returning state is no longer driven by `localStorage`.
It is driven by:

- session cookie
- `users`
- `sessions`
- `profiles`
- cached match data

This is a major architectural improvement over the old doc.

---

## 6. Screens and Experiences

### 6.1 Landing (`/`)

Purpose:

- explain the anti-swipe thesis
- make Life Preview feel novel
- convert visitors into auth flow

Current messaging emphasizes:

- emotional architecture
- intentional intros
- post-date growth
- premium, opinionated product design

The landing page is closer to a luxury dating intelligence product than a typical consumer dating app.

### 6.2 Auth (`/auth`)

Purpose:

- simple account creation and login
- gates all stateful product flows

Behavior:

- sign up or log in with email and password
- after auth, route to `/dashboard` if a profile exists
- otherwise route to `/onboarding`

### 6.3 Onboarding (`/onboarding`)

Purpose:

- derive a psychologically meaningful dating profile through chat

Mechanics:

- streaming chat via AI SDK
- `sessionId` scoped onboarding session
- server-side memory extraction
- `PROFILE_COMPLETE` trigger when the conversation has enough signal
- transcript submission to `/api/profile/derive`

What the live onboarding is actually optimized for:

- relationship history
- core needs
- non-negotiables
- life architecture
- conflict style
- family expectations
- what the person offers in a relationship

Important change from the old doc:

- the current system explicitly avoids some direct form-like questioning
- it tries to infer lifestyle and family signal indirectly
- the prompt is more "relationship profiler" than "friendly questionnaire"

### 6.4 Soul Snapshot (`/soul-snapshot`)

Purpose:

- provide a compact, shareable "relationship intelligence" artifact immediately after onboarding

Current contents include:

- readiness score
- attachment framing
- values and strengths
- offers and needs
- a compact intelligence-card style presentation

This route is effectively the first emotional payoff after onboarding.

### 6.5 Report (`/report`)

Purpose:

- provide a richer profile breakdown and optional 30-day growth plan

Current sections:

- readiness
- summary
- strengths
- growth areas
- values
- profile details
- optional generated coaching plan

Reality check:

- the report exists and works
- it is not currently the primary post-onboarding route
- the soul snapshot has become the more immediate reveal artifact

### 6.6 Dashboard (`/dashboard`)

Purpose:

- home base for authenticated returning users

Current modules:

- readiness ring
- daily intention
- action cards
- growth snapshot
- links into matches, Aura, debrief, and soul card

Notable product shift:

- the dashboard is lighter and more directional than the old "hub with many metrics"
- it mainly exists to route the user into the core experiences

### 6.7 Matches (`/matches`)

Purpose:

- generate and browse narrative matches

Current match card structure:

- identity basics
- narrative intro
- compatibility signals:
  values
  communication
  life direction
- friction point
- opening question

This is materially different from the old score-heavy, zodiac-heavy spec.

The live product prefers:

- emotionally legible language
- signal-based explanation
- less dashboard-gamification

### 6.8 Life Preview (`/matches/[id]/preview`)

Purpose:

- show the user what a relationship with a match might actually feel like

This is the current flagship feature.

Current preview includes:

- story arc
- day-in-the-life
- compatibility map
- hard truth
- growth score
- transformation note

This is the strongest product wedge in the current app and should be treated as the core brand artifact.

### 6.9 Connect (`/matches/[id]/connect`)

Purpose:

- help the user move from abstract compatibility to an actual first interaction

Current support includes:

- generated conversation starters
- "ready to meet?" nudge
- AI-generated venue/date ideas
- jump to post-date debrief

This is lighter than a full concierge system, but directionally strong.

### 6.10 Debrief (`/debrief`)

Purpose:

- turn lived dating experience into structured learning

Current flow:

1. identify the match
2. answer three reflective questions
3. get AI insight
4. save reflection to DB

This is more focused and better than the original over-specified debrief schema in the old doc.

### 6.11 Aura (`/companion`)

Purpose:

- be the persistent relationship companion

Aura is currently the most natural recurring-use feature in the product.

It supports:

- emotional processing
- date anxiety
- celebration
- pattern recognition
- daily growth prompts

### 6.12 Coach (`/coach`)

Purpose:

- separate coaching chat

Status:

- implemented
- secondary to Aura in current product hierarchy

If the team keeps both Aura and Coach, the distinction should become sharper. Right now Aura is the more coherent brand.

### 6.13 Profile (`/profile`) and Soul Card (`/soul-card`)

Purpose:

- allow users to inspect their profile
- present a more compact or shareable identity artifact

These routes are useful, but not yet the center of the value proposition.

---

## 7. AI System Design

### 7.1 Providers

Current supported provider modes in code:

| Provider | Mode | Default Model |
|---|---|---|
| OpenAI | `openai` | `gpt-4.1` |
| Ollama Cloud | `ollama-cloud` | `gpt-oss:120b` |
| Local Ollama | local fallback | `llama3.1:8b` |

Important note:

- the old doc described Gemini as default
- the current `src/lib/ai.ts` does not implement Gemini
- the live code defaults to `ollama-cloud`

### 7.2 Onboarding Intelligence

The onboarding system prompt is phase-based:

1. opening
2. history
3. values
4. life-architecture
5. complete

This is stronger than the old rigid 14-question framing because it:

- reduces questionnaire feel
- supports inference
- adapts the conversation

### 7.3 Memory

Session memory persists:

- summary
- traits
- needs
- boundaries
- emotional patterns
- triggers
- reassurance style
- communication style
- companion notes
- attachment guess
- readiness estimate
- previous questions
- conversation phase
- covered topics

This lets onboarding become progressively more coherent and less repetitive.

### 7.4 Match Generation Philosophy

The current prompt explicitly says:

- no compatibility scores as the core frame
- no zodiac as the core frame
- be specific about emotional and psychological truth

That is a meaningful product upgrade over the older spec.

### 7.5 Life Preview Philosophy

Life Preview is designed to answer:

- what the relationship would feel like
- where they fit
- where they will struggle
- how they might grow together

That is BiggDate's clearest moat in the current build.

---

## 8. Data Model

### 8.1 Primary Persistent Entities

Current Postgres-backed entities include:

- `users`
- `sessions`
- `profiles`
- `session_memory`
- `matches`
- `match_cache`
- `life_previews`
- `intros`
- `passes`
- `debriefs`
- `debrief_reflections`
- `waitlist`

### 8.2 Profile Shape

The current canonical profile includes:

- identity and intent basics
- attachment and readiness
- values, strengths, growth areas
- conflict style
- family expectations
- life architecture
- `offers`
- `needs`

Compared with the old doc, the current profile is:

- less lifestyle-form-heavy
- more psychologically legible
- better aligned with a narrative match product

### 8.3 Match Shape

The current `Match` object is centered on:

- narrative intro
- connection hook
- tension point
- compatibility signals
- friction point
- opening question

This is the correct direction.

It is much more differentiated than another grid of scores.

---

## 9. API Surface

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Onboarding and Profile

- `POST /api/chat`
- `POST /api/profile/derive`
- `POST /api/coach/plan`

### Matching

- `GET /api/matches`
- `POST /api/matches/generate`
- `POST /api/matches/briefing`
- `POST /api/life-preview`

### Intros and Dating Support

- `GET /api/intros`
- `POST /api/intros/request`
- `POST /api/intros/pass`
- `POST /api/intros/icebreakers`
- `POST /api/dates/concierge`

### Reflection and Companion

- `POST /api/debrief/structured`
- `POST /api/dates/debrief`
- `POST /api/growth/reflect`
- `POST /api/companion/chat`
- `POST /api/companion/daily`
- `POST /api/coach/chat`

### Acquisition

- `POST /api/waitlist/join`

### Notes on API Reality

- Some APIs are current-core.
- Some are transitional.

Current-core:

- chat
- profile derive
- matches generate
- life preview
- intros request/pass
- debrief structured
- companion chat/daily

Transitional or secondary:

- matches briefing
- coach chat
- dates debrief
- growth reflect

---

## 10. Design System

### Visual Direction

The current live product uses:

- near-black backgrounds
- luminous accent colors
- glassmorphism
- cinematic radial orbs
- premium dating-tech editorial tone

### Product Tone

The live UI is strongest when it sounds:

- perceptive
- emotionally intelligent
- premium
- slightly sharp
- anti-generic

It is weakest when it falls back to:

- self-help cliches
- generic wellness phrasing
- dashboard-speak

### Current Brand Truth

The UI already suggests a better brand than the old doc:

- not "dating app with AI"
- more "relationship intelligence system"

That framing should become explicit across product and marketing.

---

## 11. Technical Architecture

### Stack

| Layer | Current Implementation |
|---|---|
| Frontend framework | Next.js 16 App Router |
| React | React 19 |
| Styling | Tailwind 4 + custom theme variables |
| AI integration | Vercel AI SDK |
| Database | Postgres via `pg` |
| Authentication | cookie sessions + `users` / `sessions` tables |
| Build output | `dist/` configured as Next build directory |

### Canonical App Surface

The canonical product now lives in:

```text
src/app/
src/components/
src/lib/
```

### Legacy Artifacts Still in Repo

These files are no longer canonical:

- `src/App.jsx`
- `server.js`
- `home.jsx`
- `vite.config.js`

They represent the older monolithic prototype and should not be used as the source of truth for product documentation.

### Persistence Shift

The most important architecture change since the old doc:

- from `localStorage` and JSON files
- to authenticated, server-backed persistence

That change makes multi-user product behavior plausible.

---

## 12. Gaps Between Vision and Build

### 12.1 What the Build Already Nails

- strong premium landing page
- psychologically richer onboarding
- differentiated match presentation
- excellent core idea in Life Preview
- practical bridge from match to first interaction
- real server-backed state

### 12.2 What the Old Spec Overstated

- photo upload is not live
- webcam flow is not live
- Gemini is not a current provider
- localStorage is no longer canonical
- flat JSON is no longer canonical
- "3 curated intros per week" is product language, not enforced product logic
- zodiac is no longer a first-class match frame in the live UX

### 12.3 What Is Still Missing

- real marketplace of actual users
- real mutual matching
- messaging after intro
- trust and safety systems
- payment and tier enforcement
- robust growth-history visualization
- clear distinction between Aura and Coach
- stronger analytics instrumentation

### 12.4 The Product Risk

The current product is compelling as a concept simulator.
It becomes a real business only when:

- the match graph is real
- connection flow is real
- outcomes can be measured against real human behavior

Until then, the app is a strong AI product prototype with genuine brand signal, but not yet a full dating marketplace.

---

## 13. Recommended Priorities

### Priority 1: Make the Product Story Coherent

Pick one central narrative and organize the app around it:

**Soul Discovery -> Life Preview -> Connect -> Debrief -> Aura**

Everything secondary should support that.

### Priority 2: Reduce Product Split-Brain

Decide what happens to:

- `report` vs `soul-snapshot`
- `coach` vs `companion`
- `match briefing` vs `life preview`

Right now all of these exist, but the hierarchy is not fully clean.

### Priority 3: Turn AI Personas Into Real Social Product

Highest leverage roadmap items:

1. real user profile graph
2. real matching between users
3. intro acceptance / mutuality
4. messaging or guided exchange
5. trust-and-safety foundations

### Priority 4: Keep the Differentiated Wedge

Do not regress toward generic dating-app mechanics.

The defensible wedge is:

- emotional clarity
- narrative compatibility
- foresight before investment
- reflection after experience

### Priority 5: Clean Up Legacy Surface Area

Engineering cleanup should include:

- formal deprecation of legacy Vite/Express files
- cleaner lint boundaries
- one canonical product document
- one canonical IA for profile, preview, coach, and debrief flows

---

## Closing

The repo is implementing a better product than the old `PRODUCT.md` admitted.

The old story was:

- AI onboarding
- profile report
- curated matches

The current story is stronger:

- understand yourself
- preview the relationship
- connect with context
- learn from what happens

That is the version of BiggDate worth building.
