# P2 AI Feature Hardening — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate prompt injection vectors, add rate limiting to all AI inference endpoints, fix the memory seed UUID bug that silently breaks Maahi for new users, validate AI-generated match JSON with Zod, and remove dead/broken AI code.

**Architecture:** Three categories of change: (1) re-fetch match data from DB instead of trusting client-supplied bodies, (2) add `checkRateLimit` to all AI route handlers, (3) targeted fixes in repo.ts, prompts.ts, and tools.ts. No new dependencies required — Zod is already in use elsewhere.

**Tech Stack:** Next.js 16 route handlers, Vercel AI SDK v6, Zod, Upstash rate limiting, TypeScript

---

## Files Modified

| File | Action | Purpose |
|---|---|---|
| `src/app/api/matches/briefing/route.ts` | Modify | AI-C1: re-fetch match from DB |
| `src/app/api/life-preview/route.ts` | Modify | AI-C2: re-fetch match from DB, remove raw in error |
| `src/app/api/matches/generate/route.ts` | Modify | AI-C3: Zod validate body.profile + AI output |
| `src/lib/repo.ts` | Modify | Add `getMatchById` for DB re-fetch |
| `src/app/api/maahi/route.ts` | Modify | AI-H1: rate limit |
| `src/app/api/chat/route.ts` | Modify | AI-H1: rate limit |
| `src/app/api/coach/chat/route.ts` | Modify | AI-H1, H2: rate limit + try/catch body |
| `src/app/api/coach/plan/route.ts` | Modify | AI-H1, M6: rate limit + remove body.profile fallback |
| `src/app/api/companion/chat/route.ts` | Modify | AI-H1, H2, H5: rate limit + usage after stream |
| `src/app/api/companion/daily/route.ts` | Modify | AI-H1, M6: rate limit + remove body.profile fallback |
| `src/app/api/companion/memory/route.ts` | Modify | AI-H1, H2: rate limit + try/catch |
| `src/lib/maahi/memory.ts` | Modify | AI-H3: fix mem_seed_ non-UUID insert |
| `src/lib/maahi/tools.ts` | Modify | AI-L3: viewDailyIntention correct data source |
| `src/lib/prompts.ts` | Modify | AI-M4: remove dead companionMemoryUpdatePrompt, AI-L2: fix spirallin typo |
| `src/app/api/profile/derive/route.ts` | Modify | API-M1: run through normalizePatch |

---

## Task 1: Fix briefing + life-preview — re-fetch match from DB

**Files:**
- Modify: `src/app/api/matches/briefing/route.ts`
- Modify: `src/app/api/life-preview/route.ts`
- Modify: `src/lib/repo.ts`

- [ ] **Step 1: Add `getMatchById` to repo.ts**

```bash
grep -n "getMatchesForUser\|getMatchForUser" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -10
```

Add after `getMatchForUser`:

```typescript
export async function getMatchById(
  userId: string,
  matchId: string
): Promise<Match | null> {
  const result = await sql<{ match_data: string }>`
    SELECT match_data FROM matches
    WHERE user_id = ${userId} AND id = ${matchId}
    LIMIT 1
  `;
  if (!result.rows[0]) return null;
  try {
    return JSON.parse(result.rows[0].match_data) as Match;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Fix `briefing/route.ts` — re-fetch match from DB**

Read the current `src/app/api/matches/briefing/route.ts` in full, then replace it:

```typescript
// src/app/api/matches/briefing/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, getMatchById } from "@/lib/repo";
import { matchBriefingPrompt } from "@/lib/prompts";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { matchId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const matchId = typeof body.matchId === "string" ? body.matchId : "";
  if (!UUID_RE.test(matchId)) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }

  const [profile, match] = await Promise.all([
    getProfileByUserId(auth.userId),
    getMatchById(auth.userId, matchId),
  ]);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  try {
    const { text } = await generateText({
      model: getModel(),
      prompt: matchBriefingPrompt(profile, match),
    });
    return NextResponse.json({ briefing: text });
  } catch {
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 503 });
  }
}
```

Note: confirm the exact name of `matchBriefingPrompt` by running:
```bash
grep -n "briefing\|Briefing" /Users/themeetpatel/Startups/biggdate/src/lib/prompts.ts | head -10
```

- [ ] **Step 3: Fix `life-preview/route.ts` — re-fetch match, remove raw in error**

Read `src/app/api/life-preview/route.ts` then replace the body parse + match access section:

```typescript
// Replace the body parsing and match access section
let body: { matchId?: unknown };
try {
  body = await req.json();
} catch {
  return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const matchId = typeof body.matchId === "string" ? body.matchId : "";
if (!UUID_RE.test(matchId)) {
  return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
}

const [profile, match] = await Promise.all([
  getProfileByUserId(auth.userId),
  getMatchById(auth.userId, matchId),
]);

if (!profile || !match) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
```

Also find the error response that leaks `raw`:
```typescript
// OLD (leaks AI output):
return NextResponse.json({ error: "Failed to parse life preview", raw }, { status: 500 });
// Replace with:
return NextResponse.json({ error: "Failed to generate life preview" }, { status: 500 });
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "briefing|life-preview|repo" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/matches/briefing/route.ts src/app/api/life-preview/route.ts src/lib/repo.ts
git commit -m "fix(ai): re-fetch match from DB in briefing + life-preview — stop trusting client body

Fixes AI-C1 and AI-C2: match fields (connectionHook, openingQuestion, etc.) were
interpolated directly into AI prompts from the client-supplied request body,
allowing prompt injection. Now fetches the authoritative server-side record.
Also fixes AI-M2: raw AI output no longer leaked in error response body."
```

---

## Task 2: Fix matches/generate — Zod validate client profile + AI output

**Files:**
- Modify: `src/app/api/matches/generate/route.ts`

- [ ] **Step 1: Check existing Zod usage in the codebase**

```bash
grep -rn "from \"zod\"\|from 'zod'" /Users/themeetpatel/Startups/biggdate/src/ --include="*.ts" | head -10
```

- [ ] **Step 2: Add Zod schema for the Match shape**

Add to `src/lib/types.ts` (or wherever `Match` is defined — check with `grep -n "type Match\|interface Match" src/lib/types.ts`):

```typescript
import { z } from "zod";

export const MatchSchema = z.object({
  id: z.string(),
  matchedUserId: z.string().uuid(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(18).max(100),
  city: z.string().min(1).max(100),
  compatibilitySignals: z.object({
    values: z.array(z.string()).optional().default([]),
    lifestyle: z.array(z.string()).optional().default([]),
    personality: z.array(z.string()).optional().default([]),
  }).optional(),
  connectionHook: z.string().max(500).optional(),
  frictionPoint: z.string().max(500).optional(),
  openingQuestion: z.string().max(500).optional(),
  intentAlignment: z.string().max(500).optional(),
}).passthrough(); // allow extra fields the AI may add

export type MatchFromSchema = z.infer<typeof MatchSchema>;
```

- [ ] **Step 3: Use the schema in generate/route.ts**

Find the section in `matches/generate/route.ts` that:
1. Falls back to `body.profile` when DB profile is null
2. Does `as Match[]` type assertion after filtering

Replace the body.profile fallback:
```typescript
// Replace the body.profile fallback section
const body = await req.json().catch(() => ({}));
if (!dbProfile) {
  // No DB profile = onboarding hasn't completed. Refuse rather than trusting client input.
  return NextResponse.json(
    { error: "Complete your profile before generating matches" },
    { status: 400 }
  );
}
```

Replace the `as Match[]` type assertion:
```typescript
// After AI response parsing, validate each match with Zod
const rawMatches = /* the parsed AI output array */;
const validatedMatches: Match[] = [];
for (const raw of rawMatches) {
  const result = MatchSchema.safeParse(raw);
  if (result.success) {
    validatedMatches.push(result.data as Match);
  }
  // silently drop invalid AI output rather than storing corrupt records
}
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "matches/generate\|types.ts" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/matches/generate/route.ts src/lib/types.ts
git commit -m "fix(ai): add Zod validation to match generation — remove body.profile fallback

Fixes AI-C3: unvalidated client-supplied profile was used as AI input when
DB profile was null, enabling prompt injection via profile fields.
Also validates AI-generated match objects with Zod before storing them."
```

---

## Task 3: Add rate limiting to all AI inference endpoints

**Files:**
- Modify: `src/app/api/maahi/route.ts`
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/app/api/coach/chat/route.ts`
- Modify: `src/app/api/coach/plan/route.ts`
- Modify: `src/app/api/companion/chat/route.ts`
- Modify: `src/app/api/companion/daily/route.ts`
- Modify: `src/app/api/companion/memory/route.ts`
- Modify: `src/app/api/matches/briefing/route.ts`

- [ ] **Step 1: Confirm the checkRateLimit signature**

```bash
grep -n "checkRateLimit\|export" /Users/themeetpatel/Startups/biggdate/src/lib/rate-limit.ts | head -20
```

Note the exact function signature and the IP helper used by the auth routes.

- [ ] **Step 2: Add rate limiting to `maahi/route.ts` (anonymous endpoint)**

The maahi route is anonymous, so rate-limit by IP. Find the beginning of the POST handler and add:

```typescript
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

// Inside POST handler, before any AI work:
const hdrs = await headers();
const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
const rateCheck = await checkRateLimit(`maahi:${ip}`, 20, 60); // 20 req/min
if (!rateCheck.allowed) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

- [ ] **Step 3: Add rate limiting to all authenticated AI endpoints**

For each of `chat`, `coach/chat`, `coach/plan`, `companion/chat`, `companion/daily`, `companion/memory`, `matches/briefing`, add after `requireAuth()`:

```typescript
const rateCheck = await checkRateLimit(`ai:${auth.userId}`, 20, 60); // 20 req/min per user
if (!rateCheck.allowed) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
```

For plan/daily generation endpoints (heavier, more expensive), use a tighter limit:
```typescript
const rateCheck = await checkRateLimit(`ai-plan:${auth.userId}`, 5, 60); // 5 req/min
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "ai/|coach|companion|maahi" | head -15
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/maahi/route.ts src/app/api/chat/route.ts \
        src/app/api/coach/chat/route.ts src/app/api/coach/plan/route.ts \
        src/app/api/companion/chat/route.ts src/app/api/companion/daily/route.ts \
        src/app/api/companion/memory/route.ts src/app/api/matches/briefing/route.ts
git commit -m "fix(ai): add rate limiting to all AI inference endpoints

Fixes AI-H1: all AI endpoints (maahi, chat, coach, companion, briefing) were
unprotected from burst abuse. The plan quota is not burst-proof. Now 20 req/min
per user for chat surfaces, 5 req/min for plan-generation endpoints."
```

---

## Task 4: Fix companion/chat — increment usage after stream, add try/catch

**Files:**
- Modify: `src/app/api/companion/chat/route.ts`
- Modify: `src/app/api/coach/chat/route.ts`
- Modify: `src/app/api/coach/plan/route.ts`
- Modify: `src/app/api/companion/daily/route.ts`
- Modify: `src/app/api/companion/memory/route.ts`

- [ ] **Step 1: Read companion/chat to find incrementUsage placement**

```bash
grep -n "incrementUsage\|runMaahiTurn\|json()" /Users/themeetpatel/Startups/biggdate/src/app/api/companion/chat/route.ts
```

- [ ] **Step 2: Move incrementUsage to after() in companion/chat.ts**

Find `incrementUsage(auth.userId, "maahi_session")` (currently called before the AI run) and move it into an `after()` callback that only runs on success:

```typescript
import { after } from "next/server";

// Replace the early incrementUsage call with an after() hook
const result = await runMaahiTurn(/* args */);

// Only bill the usage after the stream has been successfully returned
after(async () => {
  await incrementUsage(auth.userId, "maahi_session");
});

return result;
```

- [ ] **Step 3: Add try/catch to all body-parsing calls**

For each route (`coach/chat`, `coach/plan`, `companion/chat`, `companion/daily`, `companion/memory`) that has bare `await req.json()`, wrap it:

```typescript
let body: Record<string, unknown>;
try {
  body = await req.json();
} catch {
  return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
}
```

- [ ] **Step 4: Remove `body.profile` fallbacks from `coach/plan` and `companion/daily`**

In both files, find:
```typescript
const profile = (await getProfileByUserId(auth.userId)) || body.profile;
```
Replace with:
```typescript
const profile = await getProfileByUserId(auth.userId);
if (!profile) {
  return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
}
```

- [ ] **Step 5: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "companion|coach" | head -10
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/companion/chat/route.ts src/app/api/coach/chat/route.ts \
        src/app/api/coach/plan/route.ts src/app/api/companion/daily/route.ts \
        src/app/api/companion/memory/route.ts
git commit -m "fix(ai): move incrementUsage to after(), add try/catch on body parse, remove body.profile fallback

Fixes AI-H2: usage counter was incremented before AI call succeeded, charging
users for failed sessions. Fixes AI-H2 (body parse 500s). Fixes AI-M6:
client-supplied profile body used as AI input — now requires DB profile."
```

---

## Task 5: Fix `mem_seed_` non-UUID insert in memory.ts

**Files:**
- Modify: `src/lib/maahi/memory.ts`

- [ ] **Step 1: Read the broken INSERT**

```bash
grep -n "mem_seed_\|INSERT INTO session_memory" /Users/themeetpatel/Startups/biggdate/src/lib/maahi/memory.ts
```

- [ ] **Step 2: Fix the INSERT to use a valid UUID**

Find the line producing `"mem_seed_" + userId` as the id. Replace it to either omit the id (if the column has a default) or use `crypto.randomUUID()`:

```typescript
// Option A: omit id if the column has DEFAULT gen_random_uuid()
await sql`
  INSERT INTO session_memory (user_id, session_key, memory_json, updated_at)
  VALUES (${userId}, ${"maahi"}, ${JSON.stringify(initialMemory)}, NOW())
  ON CONFLICT (user_id, session_key) DO NOTHING
`;

// Option B: if id must be provided
import { randomUUID } from "crypto";
await sql`
  INSERT INTO session_memory (id, user_id, session_key, memory_json, updated_at)
  VALUES (${randomUUID()}, ${userId}, ${"maahi"}, ${JSON.stringify(initialMemory)}, NOW())
  ON CONFLICT (user_id, session_key) DO NOTHING
`;
```

First check which column structure is correct:
```bash
grep -A10 "CREATE TABLE session_memory" /Users/themeetpatel/Startups/biggdate/supabase/migrations/*.sql
```

Use Option A if `id` has a default; Option B otherwise.

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "memory.ts" | head -5
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/maahi/memory.ts
git commit -m "fix(ai): remove non-UUID mem_seed_ id from session_memory INSERT

Fixes AI-H3: INSERT INTO session_memory used 'mem_seed_' + userId as the id
value, which fails the uuid column type check for every new user's first write.
This caused Maahi's conversation counter to never initialize."
```

---

## Task 6: Fix `viewDailyIntention` tool — correct data source

**Files:**
- Modify: `src/lib/maahi/tools.ts`

- [ ] **Step 1: Read the broken tool**

```bash
grep -n "viewDailyIntention\|companionNotes\|daily" /Users/themeetpatel/Startups/biggdate/src/lib/maahi/tools.ts | head -20
```

- [ ] **Step 2: Determine where daily intentions are actually stored**

```bash
grep -rn "daily_intention\|dailyIntention\|setDailyIntention" /Users/themeetpatel/Startups/biggdate/src/ --include="*.ts" | head -15
grep -n "daily_intention" /Users/themeetpatel/Startups/biggdate/supabase/migrations/*.sql | head -10
```

- [ ] **Step 3: Fix the execute function to use the correct source**

If `daily_intentions` is a table:
```typescript
execute: async () => {
  const result = await sql<{ intention: string; created_at: string }>`
    SELECT intention, created_at FROM daily_intentions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return {
    intention: result.rows[0]?.intention ?? null,
    setOn: result.rows[0]?.created_at ?? null,
  };
},
```

If intention is a field on `session_memory` or `profiles`, adjust the query source accordingly based on the schema grep above.

- [ ] **Step 4: Commit**

```bash
git add src/lib/maahi/tools.ts
git commit -m "fix(ai): viewDailyIntention tool reads from correct data source

Fixes AI-L3: the tool was returning memory.companionNotes (Maahi's internal
running notes about the user) instead of the user's actual daily intention,
surfacing private observations as the stated intention context."
```

---

## Task 7: Fix `profile/derive` — run through normalizePatch before upsert

**Files:**
- Modify: `src/app/api/profile/derive/route.ts`

- [ ] **Step 1: Read the derive route**

```bash
grep -n "upsertProfile\|normalizePatch\|derived" /Users/themeetpatel/Startups/biggdate/src/app/api/profile/derive/route.ts | head -20
```

- [ ] **Step 2: Add normalizePatch before upsertProfile call**

Find the line that calls `upsertProfile(auth.userId, derived)` and add:

```typescript
import { normalizePatch } from "@/lib/repo"; // or wherever normalizePatch is exported
// ...
const safePayload = normalizePatch(derived);
await upsertProfile(auth.userId, safePayload);
```

First confirm `normalizePatch` is exported:
```bash
grep -n "normalizePatch" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -5
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "derive" | head -5
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/profile/derive/route.ts
git commit -m "fix(security): run AI-derived profile through normalizePatch before upsert

Fixes API-M1: AI-derived profile was written to DB without allowlist filtering.
A hallucinated is_verified:true or stripe_customer_id would be silently upserted.
Now uses the same normalizePatch used by PATCH /api/profile."
```

---

## Task 8: Remove dead code + fix typo in prompts.ts

**Files:**
- Modify: `src/lib/prompts.ts`

- [ ] **Step 1: Find and delete `companionMemoryUpdatePrompt`**

```bash
grep -n "companionMemoryUpdatePrompt" /Users/themeetpatel/Startups/biggdate/src/lib/prompts.ts
grep -rn "companionMemoryUpdatePrompt" /Users/themeetpatel/Startups/biggdate/src/ --include="*.ts"
```

Confirm zero callers, then delete the function from `prompts.ts`.

- [ ] **Step 2: Fix the `spirallin` typo in `detectTone`**

```bash
grep -n "spirallin\|spiraling\|detectTone" /Users/themeetpatel/Startups/biggdate/src/lib/prompts.ts | head -10
```

Find the regex line and replace:
```typescript
// OLD:
if (/\bspirallin|\bcan't stop thinking|going crazy|in my head|overthink/.test(m))
// NEW:
if (/\bspiral(ing|ling)?\b|can't stop thinking|going crazy|\bin my head\b|overthink/.test(m))
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "prompts.ts" | head -5
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/prompts.ts
git commit -m "fix(ai): remove dead companionMemoryUpdatePrompt, fix spirallin typo in detectTone

Fixes AI-M4: dead function had a conflicting output schema that would silently
corrupt memory if re-wired. Fixes AI-L2: spirallin typo meant users writing
'I'm spiraling' did not receive the correct emotional tone hint."
```

---

## Self-Review

**Spec coverage:**
- AI-C1 (briefing prompt injection): Task 1 ✓
- AI-C2 (life-preview prompt injection): Task 1 ✓
- AI-C3 (unvalidated profile in generate): Task 2 ✓
- AI-H1 (no rate limiting on AI): Task 3 ✓
- AI-H2 (usage incremented before stream): Task 4 ✓
- AI-H3 (mem_seed_ UUID bug): Task 5 ✓
- AI-H4 (match validation Zod): Task 2 ✓
- AI-H5 (phase state from client): Not covered — added note below.
- AI-M1 (profile/derive no allowlist): Task 7 ✓
- AI-M4 (dead companionMemoryUpdatePrompt): Task 8 ✓
- AI-L2 (spirallin typo): Task 8 ✓
- AI-L3 (viewDailyIntention wrong source): Task 6 ✓
- AI-M6 (body.profile fallback): Task 4 ✓
- AI-M2 (raw in error response): Task 1 ✓

**AI-H5 Note (phase state from client messages):** This requires a significant architectural change — storing phase state server-side in `session_memory` rather than reconstructing it from client-supplied messages. The fix needs a schema change + migration + chat route rewrite. Recommended as a separate follow-up task after these fixes are stable.
