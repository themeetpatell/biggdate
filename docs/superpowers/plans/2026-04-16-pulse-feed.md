# Pulse Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Pulse" — an anonymous community feed for verified builders as a core nav tab, with daily prompts, confessions, and Q&A threads unlocked in stages.

**Architecture:** 5 new Postgres tables (pulse_prompts, pulse_posts, pulse_reactions, pulse_replies, pulse_flags) + verification columns on profiles. API routes under `/api/pulse/*` and `/api/verification/*`. UI at `/pulse` as a core nav tab. All posts are user-written — zero AI tokens in the feed itself.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 4 + CSS vars, `pg` via `sql` tagged template, cookie-based auth via `requireAuth()`, inline styles matching existing component patterns.

---

## Task 1: DB Migration — Pulse tables + verification columns

**Files:**
- Create: `supabase/migrations/202604160001_pulse_feed.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/202604160001_pulse_feed.sql
-- Pulse Feed: anonymous community feed for verified builders

-- ─── Verification columns on profiles ─────────────────────────────────────

alter table profiles
  add column if not exists linkedin_url    text default '',
  add column if not exists selfie_url      text default '',
  add column if not exists is_verified     boolean not null default false,
  add column if not exists verified_at     timestamptz;

-- ─── Pulse Prompts ────────────────────────────────────────────────────────

create table if not exists pulse_prompts (
  id           text        primary key,
  content      text        not null,
  published_at timestamptz not null default now(),
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

-- ─── Pulse Posts ──────────────────────────────────────────────────────────

create table if not exists pulse_posts (
  id              text        primary key,
  user_id         uuid        not null references auth.users(id) on delete cascade,
  type            text        not null check (type in ('prompt_response','confession','question')),
  prompt_id       text        references pulse_prompts(id) on delete set null,
  content         text        not null,
  is_verified     boolean     not null default false,
  resonate_count  integer     not null default 0,
  reply_count     integer     not null default 0,
  flag_count      integer     not null default 0,
  is_hidden       boolean     not null default false,
  created_at      timestamptz not null default now()
);

-- ─── Pulse Reactions ──────────────────────────────────────────────────────

create table if not exists pulse_reactions (
  id         text        primary key,
  post_id    text        not null references pulse_posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- ─── Pulse Replies ────────────────────────────────────────────────────────

create table if not exists pulse_replies (
  id             text        primary key,
  post_id        text        not null references pulse_posts(id) on delete cascade,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  content        text        not null,
  is_verified    boolean     not null default false,
  resonate_count integer     not null default 0,
  is_hidden      boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- ─── Pulse Flags ──────────────────────────────────────────────────────────

create table if not exists pulse_flags (
  id         text        primary key,
  post_id    text        not null references pulse_posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  reason     text        default '',
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- ─── RLS ──────────────────────────────────────────────────────────────────

alter table pulse_prompts  enable row level security;
alter table pulse_posts    enable row level security;
alter table pulse_reactions enable row level security;
alter table pulse_replies  enable row level security;
alter table pulse_flags    enable row level security;

-- Prompts: anyone authenticated can read
create policy "Authenticated read pulse_prompts"
  on pulse_prompts for select using (auth.uid() is not null);

-- Posts: authenticated read non-hidden; own write
create policy "Authenticated read pulse_posts"
  on pulse_posts for select using (auth.uid() is not null and is_hidden = false);
create policy "Users insert own pulse_posts"
  on pulse_posts for insert with check (user_id = auth.uid());

-- Reactions: authenticated read; own write
create policy "Authenticated read pulse_reactions"
  on pulse_reactions for select using (auth.uid() is not null);
create policy "Users insert own pulse_reactions"
  on pulse_reactions for insert with check (user_id = auth.uid());
create policy "Users delete own pulse_reactions"
  on pulse_reactions for delete using (user_id = auth.uid());

-- Replies: authenticated read non-hidden; own write
create policy "Authenticated read pulse_replies"
  on pulse_replies for select using (auth.uid() is not null and is_hidden = false);
create policy "Users insert own pulse_replies"
  on pulse_replies for insert with check (user_id = auth.uid());

-- Flags: own read/write
create policy "Users manage own pulse_flags"
  on pulse_flags for all using (user_id = auth.uid());

-- ─── Indexes ──────────────────────────────────────────────────────────────

create index if not exists idx_pulse_posts_created      on pulse_posts(created_at desc);
create index if not exists idx_pulse_posts_user         on pulse_posts(user_id);
create index if not exists idx_pulse_posts_prompt       on pulse_posts(prompt_id);
create index if not exists idx_pulse_reactions_post     on pulse_reactions(post_id);
create index if not exists idx_pulse_replies_post       on pulse_replies(post_id);
create index if not exists idx_pulse_flags_post         on pulse_flags(post_id);
create index if not exists idx_pulse_prompts_active     on pulse_prompts(is_active, published_at desc);
```

- [ ] **Step 2: Apply migration**

Run in Supabase SQL editor or via CLI:
```bash
# Via CLI (if configured):
npx supabase db push

# Or paste the SQL directly into Supabase dashboard > SQL Editor
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/202604160001_pulse_feed.sql
git commit -m "feat: add pulse feed DB migration"
```

---

## Task 2: Pulse types

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add Pulse types at the end of `src/lib/types.ts`**

```typescript
// ─── Pulse Feed ──────────────────────────────────────────────────────────────

export type PulsePostType = 'prompt_response' | 'confession' | 'question';

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
  promptContent: string | null; // joined from pulse_prompts
  content: string;
  isVerified: boolean;
  resonateCount: number;
  replyCount: number;
  isResonated: boolean; // whether current user has resonated
  createdAt: string;
}

export interface PulseReply {
  id: string;
  postId: string;
  content: string;
  isVerified: boolean;
  resonateCount: number;
  createdAt: string;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

Expected: no new TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add pulse feed types"
```

---

## Task 3: Pulse repo functions

**Files:**
- Modify: `src/lib/repo.ts`

- [ ] **Step 1: Add Pulse repo functions at the end of `src/lib/repo.ts`**

```typescript
// ─── Pulse ───────────────────────────────────────────────────────────────────

export async function getTodayPulsePrompt() {
  const rows = await sql`
    SELECT id, content, published_at, is_active, created_at
    FROM pulse_prompts
    WHERE is_active = true
    ORDER BY published_at DESC
    LIMIT 1
  `;
  if (!rows.length) return null;
  const r = rows[0] as Record<string, unknown>;
  return {
    id: r.id as string,
    content: r.content as string,
    publishedAt: r.published_at as string,
    isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
  };
}

export async function createPulsePrompt(content: string) {
  // Deactivate previous prompt
  await sql`UPDATE pulse_prompts SET is_active = false WHERE is_active = true`;
  const id = createId("pp");
  await sql`
    INSERT INTO pulse_prompts (id, content, is_active, published_at, created_at)
    VALUES (${id}, ${content}, true, NOW(), NOW())
  `;
  return id;
}

export async function getPulseFeed(
  currentUserId: string,
  cursor?: string,
  limit = 20
) {
  const rows = cursor
    ? await sql`
        SELECT
          p.id, p.type, p.prompt_id, p.content, p.is_verified,
          p.resonate_count, p.reply_count, p.created_at,
          pr.content AS prompt_content,
          EXISTS(
            SELECT 1 FROM pulse_reactions r
            WHERE r.post_id = p.id AND r.user_id = ${currentUserId}
          ) AS is_resonated
        FROM pulse_posts p
        LEFT JOIN pulse_prompts pr ON pr.id = p.prompt_id
        WHERE p.is_hidden = false AND p.created_at < ${cursor}
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `
    : await sql`
        SELECT
          p.id, p.type, p.prompt_id, p.content, p.is_verified,
          p.resonate_count, p.reply_count, p.created_at,
          pr.content AS prompt_content,
          EXISTS(
            SELECT 1 FROM pulse_reactions r
            WHERE r.post_id = p.id AND r.user_id = ${currentUserId}
          ) AS is_resonated
        FROM pulse_posts p
        LEFT JOIN pulse_prompts pr ON pr.id = p.prompt_id
        WHERE p.is_hidden = false
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      type: row.type as PulsePostType,
      promptId: (row.prompt_id as string) || null,
      promptContent: (row.prompt_content as string) || null,
      content: row.content as string,
      isVerified: row.is_verified as boolean,
      resonateCount: row.resonate_count as number,
      replyCount: row.reply_count as number,
      isResonated: row.is_resonated as boolean,
      createdAt: row.created_at as string,
    };
  });
}

export async function createPulsePost({
  userId,
  type,
  promptId,
  content,
  isVerified,
}: {
  userId: string;
  type: PulsePostType;
  promptId?: string;
  content: string;
  isVerified: boolean;
}) {
  const id = createId("ppost");
  await sql`
    INSERT INTO pulse_posts (id, user_id, type, prompt_id, content, is_verified, created_at)
    VALUES (${id}, ${userId}, ${type}, ${promptId ?? null}, ${content}, ${isVerified}, NOW())
  `;
  return id;
}

export async function togglePulseReaction(postId: string, userId: string): Promise<boolean> {
  const existing = await sql`
    SELECT id FROM pulse_reactions WHERE post_id = ${postId} AND user_id = ${userId}
  `;
  if (existing.length) {
    await sql`DELETE FROM pulse_reactions WHERE post_id = ${postId} AND user_id = ${userId}`;
    await sql`UPDATE pulse_posts SET resonate_count = resonate_count - 1 WHERE id = ${postId} AND resonate_count > 0`;
    return false; // removed
  } else {
    const id = createId("pr");
    await sql`INSERT INTO pulse_reactions (id, post_id, user_id, created_at) VALUES (${id}, ${postId}, ${userId}, NOW())`;
    await sql`UPDATE pulse_posts SET resonate_count = resonate_count + 1 WHERE id = ${postId}`;
    return true; // added
  }
}

export async function getPulseReplies(postId: string) {
  const rows = await sql`
    SELECT id, content, is_verified, resonate_count, created_at
    FROM pulse_replies
    WHERE post_id = ${postId} AND is_hidden = false
    ORDER BY created_at ASC
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      postId,
      content: row.content as string,
      isVerified: row.is_verified as boolean,
      resonateCount: row.resonate_count as number,
      createdAt: row.created_at as string,
    };
  });
}

export async function createPulseReply({
  postId,
  userId,
  content,
  isVerified,
}: {
  postId: string;
  userId: string;
  content: string;
  isVerified: boolean;
}) {
  const id = createId("prely");
  await sql`
    INSERT INTO pulse_replies (id, post_id, user_id, content, is_verified, created_at)
    VALUES (${id}, ${postId}, ${userId}, ${content}, ${isVerified}, NOW())
  `;
  await sql`UPDATE pulse_posts SET reply_count = reply_count + 1 WHERE id = ${postId}`;
  return id;
}

export async function flagPulsePost(postId: string, userId: string, reason: string) {
  // Upsert flag
  const id = createId("pf");
  await sql`
    INSERT INTO pulse_flags (id, post_id, user_id, reason, created_at)
    VALUES (${id}, ${postId}, ${userId}, ${reason}, NOW())
    ON CONFLICT (post_id, user_id) DO NOTHING
  `;
  // Increment flag count and auto-hide at 3
  await sql`
    UPDATE pulse_posts
    SET
      flag_count = flag_count + 1,
      is_hidden = CASE WHEN flag_count + 1 >= 3 THEN true ELSE is_hidden END
    WHERE id = ${postId}
  `;
}

export async function getUserVerificationStatus(userId: string): Promise<boolean> {
  const rows = await sql`
    SELECT is_verified FROM profiles WHERE user_id = ${userId} LIMIT 1
  `;
  if (!rows.length) return false;
  return (rows[0] as Record<string, unknown>).is_verified as boolean;
}

export async function saveVerificationSubmission(
  userId: string,
  linkedinUrl: string,
  selfieUrl: string
) {
  await sql`
    UPDATE profiles
    SET linkedin_url = ${linkedinUrl}, selfie_url = ${selfieUrl}
    WHERE user_id = ${userId}
  `;
}

export async function approveVerification(userId: string) {
  await sql`
    UPDATE profiles
    SET is_verified = true, verified_at = NOW()
    WHERE user_id = ${userId}
  `;
}

// Admin: get flagged posts for moderation
export async function getFlaggedPulsePosts() {
  const rows = await sql`
    SELECT id, type, content, is_verified, resonate_count, reply_count,
           flag_count, is_hidden, created_at
    FROM pulse_posts
    WHERE flag_count > 0
    ORDER BY flag_count DESC, created_at DESC
    LIMIT 50
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      type: row.type as PulsePostType,
      promptId: null,
      promptContent: null,
      content: row.content as string,
      isVerified: row.is_verified as boolean,
      resonateCount: row.resonate_count as number,
      replyCount: row.reply_count as number,
      flagCount: row.flag_count as number,
      isHidden: row.is_hidden as boolean,
      isResonated: false,
      createdAt: row.created_at as string,
    };
  });
}

export async function setPulsePostVisibility(postId: string, isHidden: boolean) {
  await sql`UPDATE pulse_posts SET is_hidden = ${isHidden} WHERE id = ${postId}`;
}

// Admin: get pending verification submissions
export async function getPendingVerifications() {
  const rows = await sql`
    SELECT user_id, linkedin_url, selfie_url, is_verified, verified_at
    FROM profiles
    WHERE linkedin_url != '' AND selfie_url != '' AND is_verified = false
    ORDER BY updated_at DESC
    LIMIT 50
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      userId: row.user_id as string,
      linkedinUrl: row.linkedin_url as string,
      selfieUrl: row.selfie_url as string,
      isVerified: row.is_verified as boolean,
    };
  });
}
```

- [ ] **Step 2: Add the import for `PulsePostType` in `repo.ts`** (it's already in types.ts; import it at the top of repo.ts)

In `src/lib/repo.ts`, the existing imports section already imports from `./types`. Add `PulsePostType` to that import:

```typescript
import type {
  Profile,
  ProfilePrompt,
  Match,
  LifePreview,
  SessionMemory,
  DebriefReflection,
  Thread,
  Message,
  SoulKnockResponse,
  UsageCounter,
  GatedAction,
  PlanGateResult,
  PulsePostType,   // add this
} from "./types";
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/repo.ts src/lib/types.ts
git commit -m "feat: add pulse repo functions and types"
```

---

## Task 4: Verification API

**Files:**
- Create: `src/app/api/verification/linkedin/route.ts`
- Create: `src/app/api/verification/selfie/route.ts`
- Create: `src/app/api/verification/status/route.ts`

- [ ] **Step 1: Create LinkedIn verification endpoint**

```typescript
// src/app/api/verification/linkedin/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { saveVerificationSubmission, getUserVerificationStatus } from "@/lib/repo";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { linkedinUrl } = await req.json();
  if (!linkedinUrl || !linkedinUrl.includes("linkedin.com")) {
    return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
  }

  // Get existing selfie_url so we don't overwrite it
  const rows = await sql`SELECT selfie_url FROM profiles WHERE user_id = ${auth.userId} LIMIT 1`;
  const selfieUrl = rows.length ? (rows[0] as Record<string, unknown>).selfie_url as string : "";

  await saveVerificationSubmission(auth.userId, linkedinUrl, selfieUrl || "");
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create selfie verification endpoint**

```typescript
// src/app/api/verification/selfie/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { sql } from "@/lib/db";
import { saveVerificationSubmission } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { selfieUrl } = await req.json();
  if (!selfieUrl || typeof selfieUrl !== "string") {
    return NextResponse.json({ error: "selfieUrl is required" }, { status: 400 });
  }

  // Get existing linkedin_url so we don't overwrite it
  const rows = await sql`SELECT linkedin_url FROM profiles WHERE user_id = ${auth.userId} LIMIT 1`;
  const linkedinUrl = rows.length ? (rows[0] as Record<string, unknown>).linkedin_url as string : "";

  await saveVerificationSubmission(auth.userId, linkedinUrl || "", selfieUrl);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create verification status endpoint**

```typescript
// src/app/api/verification/status/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { sql } from "@/lib/db";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const rows = await sql`
    SELECT is_verified, linkedin_url, selfie_url
    FROM profiles WHERE user_id = ${auth.userId} LIMIT 1
  `;
  if (!rows.length) return NextResponse.json({ isVerified: false, hasLinkedin: false, hasSelfie: false });
  const r = rows[0] as Record<string, unknown>;
  return NextResponse.json({
    isVerified: r.is_verified as boolean,
    hasLinkedin: Boolean(r.linkedin_url),
    hasSelfie: Boolean(r.selfie_url),
  });
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/verification/
git commit -m "feat: add verification API routes"
```

---

## Task 5: Pulse prompts API

**Files:**
- Create: `src/app/api/pulse/prompts/today/route.ts`
- Create: `src/app/api/pulse/prompts/route.ts`

- [ ] **Step 1: Create today's prompt endpoint**

```typescript
// src/app/api/pulse/prompts/today/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getTodayPulsePrompt } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const prompt = await getTodayPulsePrompt();
  return NextResponse.json({ prompt });
}
```

- [ ] **Step 2: Create admin prompt creation endpoint**

```typescript
// src/app/api/pulse/prompts/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { createPulsePrompt } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { content } = await req.json();
  if (!content || content.trim().length < 10) {
    return NextResponse.json({ error: "Prompt content too short" }, { status: 400 });
  }

  const id = await createPulsePrompt(content.trim());
  return NextResponse.json({ id });
}
```

- [ ] **Step 3: Add `ADMIN_USER_IDS` to `.env.local`**

```bash
# Add to .env.local:
# ADMIN_USER_IDS=your-supabase-user-uuid-here
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/pulse/prompts/
git commit -m "feat: add pulse prompts API"
```

---

## Task 6: Pulse posts API (list + create)

**Files:**
- Create: `src/app/api/pulse/posts/route.ts`

- [ ] **Step 1: Create posts list + create endpoint**

```typescript
// src/app/api/pulse/posts/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPulseFeed, createPulsePost, getUserVerificationStatus } from "@/lib/repo";
import type { PulsePostType } from "@/lib/types";

const PHASE: PulsePostType[] = ["prompt_response"]; // expand as user count grows

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") ?? undefined;

  const posts = await getPulseFeed(auth.userId, cursor);
  const nextCursor = posts.length === 20 ? posts[posts.length - 1].createdAt : null;

  return NextResponse.json({ posts, nextCursor });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { type, promptId, content } = await req.json() as {
    type: PulsePostType;
    promptId?: string;
    content: string;
  };

  if (!PHASE.includes(type)) {
    return NextResponse.json({ error: "Post type not available yet" }, { status: 403 });
  }
  if (!content || content.trim().length < 5) {
    return NextResponse.json({ error: "Content too short" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "Content too long (max 500 chars)" }, { status: 400 });
  }
  if (type === "prompt_response" && !promptId) {
    return NextResponse.json({ error: "promptId required for prompt_response" }, { status: 400 });
  }

  const isVerified = await getUserVerificationStatus(auth.userId);

  const id = await createPulsePost({
    userId: auth.userId,
    type,
    promptId,
    content: content.trim(),
    isVerified,
  });

  return NextResponse.json({ id });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/pulse/posts/route.ts
git commit -m "feat: add pulse posts list and create API"
```

---

## Task 7: Pulse post interactions (react, replies, flag)

**Files:**
- Create: `src/app/api/pulse/posts/[id]/react/route.ts`
- Create: `src/app/api/pulse/posts/[id]/replies/route.ts`
- Create: `src/app/api/pulse/posts/[id]/flag/route.ts`

- [ ] **Step 1: Create react endpoint**

```typescript
// src/app/api/pulse/posts/[id]/react/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { togglePulseReaction } from "@/lib/repo";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const resonated = await togglePulseReaction(id, auth.userId);
  return NextResponse.json({ resonated });
}
```

- [ ] **Step 2: Create replies endpoint**

```typescript
// src/app/api/pulse/posts/[id]/replies/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPulseReplies, createPulseReply, getUserVerificationStatus } from "@/lib/repo";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const replies = await getPulseReplies(id);
  return NextResponse.json({ replies });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const { content } = await req.json();

  if (!content || content.trim().length < 3) {
    return NextResponse.json({ error: "Reply too short" }, { status: 400 });
  }
  if (content.trim().length > 300) {
    return NextResponse.json({ error: "Reply too long (max 300 chars)" }, { status: 400 });
  }

  const isVerified = await getUserVerificationStatus(auth.userId);
  const replyId = await createPulseReply({
    postId: id,
    userId: auth.userId,
    content: content.trim(),
    isVerified,
  });

  return NextResponse.json({ id: replyId });
}
```

- [ ] **Step 3: Create flag endpoint**

```typescript
// src/app/api/pulse/posts/[id]/flag/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { flagPulsePost } from "@/lib/repo";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const { reason = "" } = await req.json().catch(() => ({}));
  await flagPulsePost(id, auth.userId, reason);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/pulse/posts/
git commit -m "feat: add pulse interactions API (react, replies, flag)"
```

---

## Task 8: Admin API routes

**Files:**
- Create: `src/app/api/admin/pulse/posts/route.ts`
- Create: `src/app/api/admin/pulse/posts/[id]/route.ts`
- Create: `src/app/api/admin/verification/route.ts`
- Create: `src/app/api/admin/verification/[userId]/route.ts`

- [ ] **Step 1: Create admin flagged posts list**

```typescript
// src/app/api/admin/pulse/posts/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getFlaggedPulsePosts } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const posts = await getFlaggedPulsePosts();
  return NextResponse.json({ posts });
}
```

- [ ] **Step 2: Create admin post visibility toggle**

```typescript
// src/app/api/admin/pulse/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { setPulsePostVisibility } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { isHidden } = await req.json();
  await setPulsePostVisibility(id, isHidden);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create admin pending verifications list**

```typescript
// src/app/api/admin/verification/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPendingVerifications } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const verifications = await getPendingVerifications();
  return NextResponse.json({ verifications });
}
```

- [ ] **Step 4: Create admin approve verification**

```typescript
// src/app/api/admin/verification/[userId]/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { approveVerification } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await params;
  await approveVerification(userId);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: add admin API routes for pulse moderation and verification"
```

---

## Task 9: Pulse feed page UI (`/pulse`)

**Files:**
- Create: `src/app/pulse/page.tsx`
- Create: `src/app/pulse/loading.tsx`

- [ ] **Step 1: Create loading skeleton**

```typescript
// src/app/pulse/loading.tsx
export default function PulseLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", padding: "0 0 100px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 0" }}>
        <div style={{ height: 28, width: 80, borderRadius: 8, background: "var(--bd-surface)", marginBottom: 20 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: "var(--bd-surface)", borderRadius: 16, padding: 20, marginBottom: 12, opacity: 1 - i * 0.2 }}>
            <div style={{ height: 14, width: "60%", borderRadius: 6, background: "var(--bd-border)", marginBottom: 10 }} />
            <div style={{ height: 14, width: "90%", borderRadius: 6, background: "var(--bd-border)", marginBottom: 6 }} />
            <div style={{ height: 14, width: "75%", borderRadius: 6, background: "var(--bd-border)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the Pulse feed page**

```typescript
// src/app/pulse/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { PulsePost, PulsePrompt, PulseReply } from "@/lib/types";

function PinkTick() {
  return (
    <span title="Verified Builder" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, borderRadius: "50%",
      background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
      marginLeft: 4, flexShrink: 0,
    }}>
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function TimeAgo({ iso }: { iso: string }) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return <span>now</span>;
  if (mins < 60) return <span>{mins}m</span>;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return <span>{hrs}h</span>;
  return <span>{Math.floor(hrs / 24)}d</span>;
}

function PostCard({
  post,
  onResonate,
  onFlag,
}: {
  post: PulsePost;
  onResonate: (id: string) => void;
  onFlag: (id: string) => void;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<PulseReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const canReply = post.type === "prompt_response" || post.type === "question";

  const loadReplies = useCallback(async () => {
    if (loadingReplies) return;
    setLoadingReplies(true);
    try {
      const r = await fetch(`/api/pulse/posts/${post.id}/replies`);
      const d = await r.json();
      setReplies(d.replies ?? []);
    } finally {
      setLoadingReplies(false);
    }
  }, [post.id, loadingReplies]);

  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) loadReplies();
    setShowReplies((v) => !v);
  };

  const submitReply = async () => {
    if (!replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      const r = await fetch(`/api/pulse/posts/${post.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      if (r.ok) {
        const d = await r.json();
        setReplies((prev) => [...prev, {
          id: d.id, postId: post.id, content: replyText.trim(),
          isVerified: false, resonateCount: 0, createdAt: new Date().toISOString(),
        }]);
        setReplyText("");
      }
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div style={{
      background: "var(--bd-surface)", borderRadius: 16,
      border: "1px solid var(--bd-border)", padding: "16px 18px",
      marginBottom: 10,
    }}>
      {/* Prompt label */}
      {post.promptContent && (
        <p style={{ fontSize: 11, color: "var(--bd-accent)", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          {post.promptContent}
        </p>
      )}

      {/* Content */}
      <p style={{ fontSize: 15, color: "var(--bd-text)", lineHeight: 1.55, marginBottom: 12 }}>
        {post.content}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Resonate */}
        <button
          onClick={() => onResonate(post.id)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            color: post.isResonated ? "#e91e8c" : "var(--bd-text-faint)",
            fontSize: 13, fontWeight: 500,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24"
            fill={post.isResonated ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {post.resonateCount > 0 && post.resonateCount}
        </button>

        {/* Replies */}
        {canReply && (
          <button
            onClick={toggleReplies}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              color: "var(--bd-text-faint)", fontSize: 13, fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {post.replyCount > 0 ? post.replyCount : "Reply"}
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Verified tick + time */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {post.isVerified && <PinkTick />}
          <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>
            <TimeAgo iso={post.createdAt} />
          </span>
        </div>

        {/* Flag */}
        <button
          onClick={() => onFlag(post.id)}
          style={{ background: "none", border: "none", cursor: "pointer",
            color: "var(--bd-text-faint)", opacity: 0.4, padding: 0 }}
          title="Report this post"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </button>
      </div>

      {/* Replies thread */}
      {showReplies && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--bd-border)" }}>
          {loadingReplies && (
            <p style={{ fontSize: 13, color: "var(--bd-text-faint)" }}>Loading...</p>
          )}
          {replies.map((reply) => (
            <div key={reply.id} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 14, color: "var(--bd-text-muted)", lineHeight: 1.5 }}>
                {reply.content}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                {reply.isVerified && <PinkTick />}
                <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>
                  <TimeAgo iso={reply.createdAt} />
                </span>
              </div>
            </div>
          ))}

          {/* Reply input */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply anonymously..."
              maxLength={300}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(); } }}
              style={{
                flex: 1, background: "var(--bd-bg)", border: "1px solid var(--bd-border)",
                borderRadius: 10, padding: "8px 12px", fontSize: 13,
                color: "var(--bd-text)", outline: "none",
              }}
            />
            <button
              onClick={submitReply}
              disabled={!replyText.trim() || submittingReply}
              style={{
                background: "var(--bd-accent)", color: "black", border: "none",
                borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600,
                cursor: replyText.trim() ? "pointer" : "default",
                opacity: replyText.trim() ? 1 : 0.4,
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ComposeSheet({
  prompt,
  onClose,
  onPosted,
}: {
  prompt: PulsePrompt | null;
  onClose: () => void;
  onPosted: (post: PulsePost) => void;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/pulse/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt_response",
          promptId: prompt?.id,
          content: content.trim(),
        }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Failed to post"); return; }
      onPosted({
        id: d.id, type: "prompt_response",
        promptId: prompt?.id ?? null, promptContent: prompt?.content ?? null,
        content: content.trim(), isVerified: false,
        resonateCount: 0, replyCount: 0, isResonated: false,
        createdAt: new Date().toISOString(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end",
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, margin: "0 auto",
          background: "var(--bd-surface)",
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "var(--bd-accent)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Respond anonymously
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none",
            color: "var(--bd-text-faint)", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        {prompt && (
          <p style={{ fontSize: 14, color: "var(--bd-text-muted)", marginBottom: 14,
            padding: "10px 14px", background: "var(--bd-bg)", borderRadius: 10, lineHeight: 1.5 }}>
            {prompt.content}
          </p>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your honest take..."
          maxLength={500}
          autoFocus
          style={{
            width: "100%", minHeight: 120, background: "var(--bd-bg)",
            border: "1px solid var(--bd-border)", borderRadius: 12,
            padding: "12px 14px", fontSize: 15, color: "var(--bd-text)",
            resize: "none", outline: "none", boxSizing: "border-box",
            lineHeight: 1.5,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--bd-text-faint)" }}>
            {content.length}/500 · stays anonymous
          </span>
          {error && <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>}
        </div>

        <button
          onClick={submit}
          disabled={content.trim().length < 5 || submitting}
          style={{
            width: "100%", marginTop: 14,
            background: content.trim().length >= 5 ? "var(--bd-accent)" : "var(--bd-surface)",
            color: content.trim().length >= 5 ? "black" : "var(--bd-text-faint)",
            border: "none", borderRadius: 12, padding: "14px",
            fontSize: 15, fontWeight: 700, cursor: content.trim().length >= 5 ? "pointer" : "default",
            transition: "all 0.15s",
          }}
        >
          {submitting ? "Posting..." : "Post Anonymously"}
        </button>
      </div>
    </div>
  );
}

export default function PulsePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<PulsePrompt | null>(null);
  const [posts, setPosts] = useState<PulsePost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { router.replace("/auth"); return; }
    const load = async () => {
      const [promptRes, feedRes] = await Promise.all([
        fetch("/api/pulse/prompts/today"),
        fetch("/api/pulse/posts"),
      ]);
      const { prompt: p } = await promptRes.json();
      const { posts: ps, nextCursor: nc } = await feedRes.json();
      setPrompt(p);
      setPosts(ps ?? []);
      setNextCursor(nc);
      setLoading(false);
    };
    load();
  }, [user, router]);

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || !nextCursor || loadingMore) return;
      setLoadingMore(true);
      const r = await fetch(`/api/pulse/posts?cursor=${encodeURIComponent(nextCursor)}`);
      const d = await r.json();
      setPosts((prev) => [...prev, ...(d.posts ?? [])]);
      setNextCursor(d.nextCursor);
      setLoadingMore(false);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [nextCursor, loadingMore]);

  const handleResonate = async (postId: string) => {
    const r = await fetch(`/api/pulse/posts/${postId}/react`, { method: "POST" });
    const { resonated } = await r.json();
    setPosts((prev) => prev.map((p) =>
      p.id !== postId ? p : {
        ...p,
        isResonated: resonated,
        resonateCount: resonated ? p.resonateCount + 1 : Math.max(0, p.resonateCount - 1),
      }
    ));
  };

  const handleFlag = async (postId: string) => {
    await fetch(`/api/pulse/posts/${postId}/flag`, { method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "reported" }) });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
        {/* Header */}
        <div style={{ padding: "20px 0 8px", display: "flex",
          justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--bd-text)" }}>Pulse</h1>
          <span style={{ fontSize: 12, color: "var(--bd-text-faint)" }}>anonymous · builders only</span>
        </div>

        {/* Today's prompt banner */}
        {prompt && (
          <div
            onClick={() => setShowCompose(true)}
            style={{
              background: "linear-gradient(135deg, rgba(233,30,140,0.12), rgba(233,30,140,0.04))",
              border: "1px solid rgba(233,30,140,0.25)",
              borderRadius: 16, padding: "16px 18px", marginBottom: 16, cursor: "pointer",
            }}
          >
            <p style={{ fontSize: 11, color: "#e91e8c", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              Today's prompt
            </p>
            <p style={{ fontSize: 15, color: "var(--bd-text)", lineHeight: 1.5 }}>
              {prompt.content}
            </p>
            <p style={{ fontSize: 12, color: "var(--bd-text-faint)", marginTop: 8 }}>
              Tap to respond anonymously →
            </p>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🤫</p>
            <p style={{ fontSize: 16, color: "var(--bd-text)", fontWeight: 600, marginBottom: 6 }}>
              Be the first to share
            </p>
            <p style={{ fontSize: 14, color: "var(--bd-text-faint)" }}>
              Respond to today's prompt anonymously
            </p>
          </div>
        )}

        {/* Feed */}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onResonate={handleResonate}
            onFlag={handleFlag}
          />
        ))}

        {/* Infinite scroll loader */}
        <div ref={loaderRef} style={{ height: 40, display: "flex",
          alignItems: "center", justifyContent: "center" }}>
          {loadingMore && (
            <span style={{ fontSize: 12, color: "var(--bd-text-faint)" }}>Loading more...</span>
          )}
        </div>
      </div>

      {/* Compose FAB */}
      {prompt && (
        <button
          onClick={() => setShowCompose(true)}
          style={{
            position: "fixed", bottom: 90, right: 20,
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
            border: "none", cursor: "pointer", fontSize: 24, color: "white",
            boxShadow: "0 4px 20px rgba(233,30,140,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}
        >
          +
        </button>
      )}

      {/* Compose sheet */}
      {showCompose && (
        <ComposeSheet
          prompt={prompt}
          onClose={() => setShowCompose(false)}
          onPosted={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/app/pulse/
git commit -m "feat: add pulse feed page UI"
```

---

## Task 10: Bottom nav — add Pulse tab

**Files:**
- Modify: `src/components/bottom-nav.tsx`

- [ ] **Step 1: Add Pulse icon function after `ChatIcon` in `bottom-nav.tsx`**

```typescript
function PulseIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth={active ? 2.2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
```

- [ ] **Step 2: Update `NAV_ITEMS` to include Pulse**

Replace the existing `NAV_ITEMS` array:

```typescript
const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Today" },
  { href: "/matches", icon: "heart", label: "Connect" },
  { href: "/pulse", icon: "pulse", label: "Pulse" },
  { href: "/messages", icon: "chat", label: "Messages" },
  { href: "/companion", icon: "sparkle", label: "Maahi" },
];
```

- [ ] **Step 3: Add `hasPulse` state for dot indicator and add Pulse icon render**

Add state near `unreadCount`:
```typescript
const [hasPulseUpdate, setHasPulseUpdate] = useState(false);

useEffect(() => {
  if (!profile) return;
  fetch("/api/pulse/prompts/today")
    .then((r) => r.json())
    .then((d) => { if (d.prompt) setHasPulseUpdate(true); })
    .catch(() => {});
}, [profile]);
```

In the render, add the Pulse icon case after the `chat` case and before `sparkle`:

```typescript
{item.icon === "pulse" && (
  <div style={{ position: "relative" }}>
    <PulseIcon active={active} />
    {hasPulseUpdate && !active && (
      <div style={{
        position: "absolute", top: -3, right: -3,
        width: 8, height: 8, borderRadius: "50%",
        background: "#e91e8c", border: "2px solid #262626",
      }} />
    )}
  </div>
)}
```

Also remove `/profile` from NAV_ITEMS since we now have 5 items (Today, Connect, Pulse, Messages, Maahi). Move profile access to the dashboard or a settings entry point.

- [ ] **Step 4: Add `/pulse` to the hidden nav paths exclusion check if needed**

The existing exclusion list only hides nav on marketing + auth pages. `/pulse` should show the nav — no change needed.

- [ ] **Step 5: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 6: Commit**

```bash
git add src/components/bottom-nav.tsx
git commit -m "feat: add Pulse tab to bottom nav with dot indicator"
```

---

## Task 11: Admin moderation page (`/admin/pulse`)

**Files:**
- Create: `src/app/admin/pulse/page.tsx`

- [ ] **Step 1: Create admin Pulse page**

```typescript
// src/app/admin/pulse/page.tsx
"use client";

import { useEffect, useState } from "react";

interface FlaggedPost {
  id: string; type: string; content: string;
  isVerified: boolean; flagCount: number;
  isHidden: boolean; createdAt: string;
}

interface PendingVerification {
  userId: string; linkedinUrl: string; selfieUrl: string;
}

export default function AdminPulsePage() {
  const [posts, setPosts] = useState<FlaggedPost[]>([]);
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [tab, setTab] = useState<"flags" | "verifications">("flags");

  useEffect(() => {
    fetch("/api/admin/pulse/posts").then(r => r.json()).then(d => setPosts(d.posts ?? []));
    fetch("/api/admin/verification").then(r => r.json()).then(d => setVerifications(d.verifications ?? []));
  }, []);

  const hidePost = async (id: string) => {
    await fetch(`/api/admin/pulse/posts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: true }),
    });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const restorePost = async (id: string) => {
    await fetch(`/api/admin/pulse/posts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: false }),
    });
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isHidden: false } : p));
  };

  const approveVerification = async (userId: string) => {
    await fetch(`/api/admin/verification/${userId}`, { method: "POST" });
    setVerifications(prev => prev.filter(v => v.userId !== userId));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", padding: 24, fontFamily: "monospace" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Admin · Pulse</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {(["flags", "verifications"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: tab === t ? "#e91e8c" : "#1a1a1a", color: "white",
            fontSize: 13, fontWeight: 600,
          }}>
            {t === "flags" ? `Flagged Posts (${posts.length})` : `Verifications (${verifications.length})`}
          </button>
        ))}
      </div>

      {tab === "flags" && (
        <div>
          {posts.length === 0 && <p style={{ color: "#666", fontSize: 14 }}>No flagged posts.</p>}
          {posts.map(post => (
            <div key={post.id} style={{
              background: "#111", borderRadius: 10, padding: 16, marginBottom: 12,
              border: post.isHidden ? "1px solid #333" : "1px solid #e91e8c44",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#888" }}>{post.type} · {post.flagCount} flags · {post.isHidden ? "hidden" : "visible"}</span>
                <span style={{ fontSize: 11, color: "#666" }}>{post.id}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>{post.content}</p>
              <div style={{ display: "flex", gap: 8 }}>
                {!post.isHidden && (
                  <button onClick={() => hidePost(post.id)} style={{
                    padding: "6px 14px", borderRadius: 6, border: "none",
                    background: "#c0392b", color: "white", cursor: "pointer", fontSize: 13,
                  }}>Hide</button>
                )}
                {post.isHidden && (
                  <button onClick={() => restorePost(post.id)} style={{
                    padding: "6px 14px", borderRadius: 6, border: "none",
                    background: "#27ae60", color: "white", cursor: "pointer", fontSize: 13,
                  }}>Restore</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "verifications" && (
        <div>
          {verifications.length === 0 && <p style={{ color: "#666", fontSize: 14 }}>No pending verifications.</p>}
          {verifications.map(v => (
            <div key={v.userId} style={{
              background: "#111", borderRadius: 10, padding: 16, marginBottom: 12,
              border: "1px solid #333",
            }}>
              <p style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>User: {v.userId}</p>
              <p style={{ fontSize: 13, marginBottom: 4 }}>
                LinkedIn: <a href={v.linkedinUrl} target="_blank" rel="noreferrer"
                  style={{ color: "#e91e8c" }}>{v.linkedinUrl}</a>
              </p>
              {v.selfieUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.selfieUrl} alt="Selfie" style={{ width: 120, height: 120,
                  objectFit: "cover", borderRadius: 8, marginBottom: 12, marginTop: 8 }} />
              )}
              <button onClick={() => approveVerification(v.userId)} style={{
                padding: "8px 18px", borderRadius: 6, border: "none",
                background: "#e91e8c", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}>
                ✓ Approve Pink Tick
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin pulse moderation and verification page"
```

---

## Task 12: Verification UI (`/profile/verify`)

**Files:**
- Create: `src/app/profile/verify/page.tsx`

- [ ] **Step 1: Create verification page**

```typescript
// src/app/profile/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function VerifyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<{ isVerified: boolean; hasLinkedin: boolean; hasSelfie: boolean } | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) { router.replace("/auth"); return; }
    fetch("/api/verification/status")
      .then(r => r.json())
      .then(d => {
        setStatus(d);
      });
  }, [user, router]);

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelfieFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setSelfiePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      if (linkedinUrl) {
        const r = await fetch("/api/verification/linkedin", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedinUrl }),
        });
        if (!r.ok) { setMessage("Invalid LinkedIn URL"); setSaving(false); return; }
      }

      if (selfieFile) {
        // Convert to base64 data URL and store directly
        // In production this should upload to Supabase Storage instead
        const selfieUrl = selfiePreview;
        const r = await fetch("/api/verification/selfie", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selfieUrl }),
        });
        if (!r.ok) { setMessage("Selfie upload failed"); setSaving(false); return; }
      }

      setMessage("Submitted! Your verification is under review. You'll get your pink tick once approved.");
      setStatus(prev => prev ? { ...prev, hasLinkedin: Boolean(linkedinUrl || prev.hasLinkedin), hasSelfie: Boolean(selfieFile || prev.hasSelfie) } : prev);
    } finally {
      setSaving(false);
    }
  };

  const card: React.CSSProperties = {
    background: "var(--bd-surface)", borderRadius: 16,
    border: "1px solid var(--bd-border)", padding: "20px 20px", marginBottom: 12,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none",
            color: "var(--bd-text-faint)", cursor: "pointer", fontSize: 20 }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--bd-text)" }}>Get Verified</h1>
        </div>

        {status?.isVerified ? (
          <div style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12l5 5L20 7" stroke="white" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--bd-text)", marginBottom: 6 }}>
              You're a Verified Builder
            </p>
            <p style={{ fontSize: 14, color: "var(--bd-text-faint)" }}>
              Your pink tick appears on all your Pulse posts.
            </p>
          </div>
        ) : (
          <>
            <div style={card}>
              <p style={{ fontSize: 13, color: "var(--bd-text-faint)", lineHeight: 1.6, marginBottom: 0 }}>
                Verify your identity to get a pink tick on your Pulse posts. Your name stays hidden — the tick just shows you're a real person in the builder community.
              </p>
            </div>

            {/* LinkedIn */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--bd-text)" }}>LinkedIn Profile</span>
                {status?.hasLinkedin && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>✓ Submitted</span>}
              </div>
              <input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                style={{
                  width: "100%", background: "var(--bd-bg)",
                  border: "1px solid var(--bd-border)", borderRadius: 10,
                  padding: "10px 14px", fontSize: 14, color: "var(--bd-text)",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Selfie */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--bd-text)" }}>Selfie</span>
                {status?.hasSelfie && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>✓ Submitted</span>}
              </div>
              <p style={{ fontSize: 13, color: "var(--bd-text-faint)", marginBottom: 12 }}>
                A clear photo of your face. Used only for identity verification — never shown publicly.
              </p>
              <label style={{ display: "block", cursor: "pointer" }}>
                <input type="file" accept="image/*" capture="user"
                  onChange={handleSelfieChange} style={{ display: "none" }} />
                {selfiePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selfiePreview} alt="Selfie preview"
                    style={{ width: 100, height: 100, objectFit: "cover",
                      borderRadius: 12, border: "2px solid var(--bd-accent)" }} />
                ) : (
                  <div style={{
                    width: 100, height: 100, borderRadius: 12,
                    border: "2px dashed var(--bd-border)",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 4,
                  }}>
                    <span style={{ fontSize: 24 }}>📸</span>
                    <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>Upload</span>
                  </div>
                )}
              </label>
            </div>

            {message && (
              <p style={{ fontSize: 14, color: "#22c55e", marginBottom: 12, lineHeight: 1.5 }}>
                {message}
              </p>
            )}

            <button
              onClick={submit}
              disabled={saving || (!linkedinUrl && !selfieFile)}
              style={{
                width: "100%", padding: "14px",
                background: "var(--bd-accent)", color: "black",
                border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: "pointer", opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Submitting..." : "Submit for Verification"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/profile/verify/
git commit -m "feat: add verification UI page"
```

---

## Task 13: Dashboard widget — Today on Pulse

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Add Pulse widget to dashboard**

Find the section in `src/app/dashboard/page.tsx` where action cards or modules are listed. Add a Pulse widget by inserting this component and rendering it near the top of the dashboard content:

First, add state and effect in the component:

```typescript
const [pulsePrompt, setPulsePrompt] = useState<{ content: string } | null>(null);

useEffect(() => {
  fetch("/api/pulse/prompts/today")
    .then(r => r.json())
    .then(d => { if (d.prompt) setPulsePrompt(d.prompt); })
    .catch(() => {});
}, []);
```

Then add the widget JSX in the render (after the existing readiness/intention section):

```typescript
{pulsePrompt && (
  <div
    onClick={() => router.push("/pulse")}
    style={{
      background: "linear-gradient(135deg, rgba(233,30,140,0.08), rgba(233,30,140,0.02))",
      border: "1px solid rgba(233,30,140,0.2)",
      borderRadius: 16, padding: "14px 16px", marginBottom: 12, cursor: "pointer",
    }}
  >
    <p style={{ fontSize: 11, color: "#e91e8c", fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
      Today on Pulse
    </p>
    <p style={{ fontSize: 14, color: "var(--bd-text)", lineHeight: 1.5 }}
      style={{ WebkitLineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical" }}>
      {pulsePrompt.content}
    </p>
    <p style={{ fontSize: 12, color: "var(--bd-text-faint)", marginTop: 6 }}>
      Respond anonymously →
    </p>
  </div>
)}
```

Note: the nested `style` prop above needs to be combined. Use this corrected version:

```typescript
{pulsePrompt && (
  <div
    onClick={() => router.push("/pulse")}
    style={{
      background: "linear-gradient(135deg, rgba(233,30,140,0.08), rgba(233,30,140,0.02))",
      border: "1px solid rgba(233,30,140,0.2)",
      borderRadius: 16, padding: "14px 16px", marginBottom: 12, cursor: "pointer",
    }}
  >
    <p style={{ fontSize: 11, color: "#e91e8c", fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
      Today on Pulse
    </p>
    <p style={{
      fontSize: 14, color: "var(--bd-text)", lineHeight: 1.5,
      WebkitLineClamp: 2, overflow: "hidden",
      display: "-webkit-box", WebkitBoxOrient: "vertical",
    } as React.CSSProperties}>
      {pulsePrompt.content}
    </p>
    <p style={{ fontSize: 12, color: "var(--bd-text-faint)", marginTop: 6 }}>
      Respond anonymously →
    </p>
  </div>
)}
```

- [ ] **Step 2: Add `router` import if not present**

```typescript
import { useRouter } from "next/navigation";
// Already likely present — check and add if missing
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add Pulse prompt widget to dashboard"
```

---

## Task 14: Post-debrief nudge to Pulse

**Files:**
- Modify: `src/app/debrief/page.tsx`

- [ ] **Step 1: Add Pulse nudge to the debrief result step**

In the `step === "result"` section, find the two buttons at the bottom ("Another Debrief" and "Talk to Aura"). Add a third button before them:

```typescript
{step === "result" && result && (
  // ... existing result cards ...
  <div style={{ marginBottom: 16 }}>
    <button
      onClick={async () => {
        // Pre-fill a confession with an anonymised version
        await fetch("/api/pulse/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "prompt_response",
            content: `Just went on a date. ${result.insight.slice(0, 200)}`,
            promptId: undefined,
          }),
        }).catch(() => {});
        router.push("/pulse");
      }}
      style={{
        width: "100%", padding: "12px",
        background: "rgba(233,30,140,0.1)",
        border: "1px solid rgba(233,30,140,0.25)",
        borderRadius: 12, fontSize: 14, color: "#e91e8c",
        fontWeight: 600, cursor: "pointer", marginBottom: 0,
      }}
    >
      Share this moment on Pulse (anonymous) →
    </button>
  </div>
)}
```

Place this div just before the `<div className="flex gap-3">` buttons block.

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/app/debrief/page.tsx
git commit -m "feat: add post-debrief Pulse nudge"
```

---

## Task 15: Landing page teaser section

**Files:**
- Modify: `src/app/page.tsx` (or `src/components/cinematic-landing.tsx`)

- [ ] **Step 1: Identify where to add the teaser**

Check `src/app/page.tsx` — if it renders `<CinematicLanding />`, open `src/components/cinematic-landing.tsx`. Otherwise edit `src/app/page.tsx` directly. Add the teaser section before the final CTA block.

- [ ] **Step 2: Add the teaser component**

```typescript
function PulseTeaserSection() {
  const TEASER_POSTS = [
    "Haven't been on a date in 4 months. Fundraising does that.",
    "My green flag: someone who doesn't need constant reassurance during a rough sprint week.",
    "Cancelled plans 3 times this month because of work. She hasn't left yet. That's something.",
  ];

  return (
    <section style={{ padding: "80px 24px", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ fontSize: 11, color: "#e91e8c", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, textAlign: "center" }}>
        Pulse · from the community
      </p>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: "white",
        textAlign: "center", marginBottom: 8, lineHeight: 1.3 }}>
        What builders are really saying about dating
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)",
        textAlign: "center", marginBottom: 32 }}>
        Anonymous. Verified builders only.
      </p>

      <div style={{ position: "relative" }}>
        {TEASER_POSTS.map((text, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "16px 18px", marginBottom: 10,
            filter: i > 0 ? "blur(3px)" : "none",
            userSelect: "none",
          }}>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>
              {i > 0 ? text.replace(/./g, "·") : text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 14, height: 14, borderRadius: "50%",
                background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
              }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Verified Builder</span>
            </div>
          </div>
        ))}

        {/* Blur overlay with CTA */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(to bottom, transparent, var(--bd-bg))",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: 12,
        }}>
          <a href="/auth" style={{
            display: "inline-block", padding: "12px 28px",
            background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
            color: "white", borderRadius: 999, fontSize: 14, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 4px 20px rgba(233,30,140,0.35)",
          }}>
            Join to read →
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Render `<PulseTeaserSection />` in the landing page**

Add `<PulseTeaserSection />` before the final sign-up CTA section in the landing component.

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/cinematic-landing.tsx
git commit -m "feat: add Pulse teaser section to landing page"
```

---

## Task 16: Smoke test checklist

- [ ] Run `npm run dev` and verify:
  - `/pulse` loads and shows the daily prompt banner
  - Compose sheet opens on FAB tap
  - Posting a prompt response appears in the feed
  - Resonate button toggles and updates count
  - Bottom nav shows Pulse tab with pink dot
  - `/pulse` is excluded from bottom nav hidden routes check? No — nav should show on `/pulse`. Verify it does.
  - `/admin/pulse` loads (use admin user ID)
  - `/profile/verify` loads and LinkedIn + selfie inputs work
  - Dashboard shows "Today on Pulse" widget

- [ ] Seed one prompt via admin API or direct SQL:

```sql
INSERT INTO pulse_prompts (id, content, is_active, published_at, created_at)
VALUES ('pp_seed_001', 'What does dating look like when you''re in the middle of a fundraise?', true, NOW(), NOW());
```

- [ ] Final commit

```bash
git add .
git commit -m "feat: complete Pulse feed implementation"
```
