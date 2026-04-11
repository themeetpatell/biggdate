# BiggDate Launch Readiness — Full Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical security issues, remove dead code, add missing UX/a11y/SEO/perf improvements, and make the app production-ready.

**Architecture:** The app is a Next.js 16 App Router project (React 19, Tailwind 4, shadcn/ui, Vercel AI SDK, Postgres via `pg`). All changes are within the existing `src/` structure. No new frameworks or libraries beyond adding `bcryptjs` for password hashing.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Vercel AI SDK v6, Postgres (Neon)

---

## File Map

### New files
- `src/lib/api-utils.ts` — shared API response helpers + JSON body parser
- `src/app/coach/loading.tsx` — loading skeleton
- `src/app/companion/loading.tsx` — loading skeleton
- `src/app/debrief/loading.tsx` — loading skeleton
- `src/app/profile/loading.tsx` — loading skeleton
- `src/app/soul-snapshot/loading.tsx` — loading skeleton

### Modified files
- `src/lib/auth.ts` — bcrypt password hashing
- `src/lib/db.ts` — fix SSL config
- `src/lib/repo.ts` — fix N+1 query in getMatchForUser, single-query upsertSessionMemory
- `src/lib/require-auth.ts` — no changes (already clean)
- `src/app/api/auth/signup/route.ts` — stronger password requirement
- `src/app/api/auth/login/route.ts` — use api-utils
- `src/app/api/matches/generate/route.ts` — remove raw from error, add cache header
- `src/app/api/profile/derive/route.ts` — remove raw from error
- `src/app/api/life-preview/route.ts` — remove raw from error
- `src/app/api/growth/reflect/route.ts` — remove raw from error
- `src/app/api/waitlist/join/route.ts` — email validation
- `src/app/api/dates/debrief/route.ts` — sanitise user text in prompt
- `src/app/api/coach/chat/route.ts` — consistent error response
- `src/components/bottom-nav.tsx` — aria-labels
- `src/app/globals.css` — focus ring utility
- `src/app/layout.tsx` — add OG metadata
- `src/app/page.tsx` — force-static
- `next.config.ts` — remove better-sqlite3, add security headers
- `.gitignore` — add /dist/
- `package.json` — add bcryptjs

### Files to delete
- `server.js`
- `home.jsx`
- `index.html`
- `vite.config.js`
- `src/App.jsx`
- `src/main.jsx`
- `data/memory.json`
- `data/platform.json`

---

## Task 1: Delete legacy files

**Files:**
- Delete: `server.js`, `home.jsx`, `index.html`, `vite.config.js`, `src/App.jsx`, `src/main.jsx`, `data/memory.json`, `data/platform.json`
- Modify: `.gitignore`

- [ ] **Step 1: Remove legacy files**

```bash
git rm server.js home.jsx index.html vite.config.js src/App.jsx src/main.jsx
rm -f data/memory.json data/platform.json
rmdir data 2>/dev/null || true
```

- [ ] **Step 2: Add `/dist/` to `.gitignore`**

Add this line after the `/build` line in `.gitignore`:

```
/dist/
```

- [ ] **Step 3: Remove dist from git tracking**

```bash
git rm -r --cached dist/
```

- [ ] **Step 4: Verify the app still builds**

```bash
npm run build
```

Expected: Build succeeds. No references to deleted files.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove legacy Vite/Express files, gitignore dist/"
```

---

## Task 2: Fix next.config.ts — remove phantom dependency, add security headers

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts**

Replace the entire file with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "dist",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

This removes `serverExternalPackages: ["better-sqlite3"]` (not installed, not used) and adds security headers.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Builds without errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "fix: remove phantom better-sqlite3 dep, add security headers"
```

---

## Task 3: Fix password hashing — SHA256 to bcrypt

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `package.json` (add bcryptjs)

- [ ] **Step 1: Install bcryptjs**

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Update auth.ts**

Replace the full contents of `src/lib/auth.ts` with:

```typescript
import { sql } from "./db";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "bd_session";
const SESSION_EXPIRY_DAYS = 30;
const BCRYPT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Support legacy SHA256 hashes during migration
  if (!hash.startsWith("$2a$") && !hash.startsWith("$2b$")) {
    const { createHash } = await import("node:crypto");
    const legacyHash = createHash("sha256").update(password + "biggdate_salt_2026").digest("hex");
    if (legacyHash === hash) return true;
    return false;
  }
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string): Promise<{ id: string; email: string } | null> {
  const id = `user_${randomUUID()}`;
  const hash = await hashPassword(password);
  try {
    await sql`INSERT INTO users (id, email, password_hash) VALUES (${id}, ${email.toLowerCase()}, ${hash})`;
    return { id, email: email.toLowerCase() };
  } catch {
    return null; // duplicate email
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ id: string; email: string } | null> {
  const rows = await sql`
    SELECT id, email, password_hash FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (!rows.length) return null;
  const row = rows[0] as { id: string; email: string; password_hash: string };
  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) return null;

  // Rehash if still using legacy SHA256
  if (!row.password_hash.startsWith("$2a$") && !row.password_hash.startsWith("$2b$")) {
    const newHash = await hashPassword(password);
    await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${row.id}`;
  }

  return { id: row.id, email: row.email };
}

export async function createSession(userId: string): Promise<string> {
  const id = `sess_${randomUUID()}`;
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 86400000).toISOString();
  await sql`INSERT INTO sessions (id, user_id, token, expires_at) VALUES (${id}, ${userId}, ${token}, ${expiresAt})`;
  return token;
}

export async function validateSession(token: string): Promise<{ userId: string } | null> {
  const rows = await sql`
    SELECT user_id, expires_at FROM sessions WHERE token = ${token}
  `;
  if (!rows.length) return null;
  const row = rows[0] as { user_id: string; expires_at: string };
  if (new Date(row.expires_at) < new Date()) {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return null;
  }
  return { userId: row.user_id };
}

export async function deleteSession(token: string) {
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

export async function getSessionFromCookies(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_DAYS * 86400,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
```

Key changes:
- bcrypt with 12 rounds replaces SHA256
- Legacy hash detection: existing SHA256 hashes auto-migrate on next login
- `hashPassword` and `verifyPassword` are now async

- [ ] **Step 3: Update signup route to require 10+ char passwords**

In `src/app/api/auth/signup/route.ts`, change line 10:

```typescript
  if (password.length < 10) {
    return NextResponse.json({ error: "Password must be at least 10 characters" }, { status: 400 });
  }
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Builds without errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/signup/route.ts package.json package-lock.json
git commit -m "security: replace SHA256 with bcrypt, auto-migrate legacy hashes"
```

---

## Task 4: Fix database SSL

**Files:**
- Modify: `src/lib/db.ts:29`

- [ ] **Step 1: Fix SSL config**

In `src/lib/db.ts`, replace line 29:

```typescript
      ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: true } : undefined,
```

The only change: `false` → `true`. Neon and Supabase provide valid SSL certificates, so this is safe.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "security: enable SSL certificate verification for database connections"
```

---

## Task 5: Stop leaking raw AI output in error responses

**Files:**
- Modify: `src/app/api/matches/generate/route.ts:49`
- Modify: `src/app/api/profile/derive/route.ts:42`
- Modify: `src/app/api/life-preview/route.ts:40`
- Modify: `src/app/api/growth/reflect/route.ts:38`

- [ ] **Step 1: Fix matches/generate error**

In `src/app/api/matches/generate/route.ts`, replace line 49:

```typescript
    return NextResponse.json({ error: "Failed to generate matches" }, { status: 500 });
```

- [ ] **Step 2: Fix profile/derive error**

In `src/app/api/profile/derive/route.ts`, replace line 42:

```typescript
    return NextResponse.json({ error: "Failed to derive profile" }, { status: 500 });
```

- [ ] **Step 3: Fix life-preview error**

In `src/app/api/life-preview/route.ts`, replace line 40:

```typescript
    return NextResponse.json({ error: "Failed to generate life preview" }, { status: 500 });
```

- [ ] **Step 4: Fix growth/reflect error**

In `src/app/api/growth/reflect/route.ts`, replace line 38 (the catch block):

```typescript
  } catch {
    return NextResponse.json({ error: "Failed to process reflection" }, { status: 500 });
  }
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/matches/generate/route.ts src/app/api/profile/derive/route.ts src/app/api/life-preview/route.ts src/app/api/growth/reflect/route.ts
git commit -m "security: stop leaking raw AI output in error responses"
```

---

## Task 6: Sanitise user text in AI prompts

**Files:**
- Modify: `src/app/api/dates/debrief/route.ts`
- Modify: `src/app/api/growth/reflect/route.ts`

- [ ] **Step 1: Add text sanitisation to debrief route**

In `src/app/api/dates/debrief/route.ts`, add after line 11 (after the destructure):

```typescript
  const safeFeedback = (feedback || "").slice(0, 2000).replace(/["""]/g, "'");
```

Then replace the prompt string (line 20-22) to use `safeFeedback` instead of `feedback`:

```typescript
    prompt: `You are a relationship coach doing a post-date debrief. ${profile.name} (${profile.attachment} attachment, ${profile.loveLanguage} love language) just had a date with ${matchName}. Their feedback: "${safeFeedback}"

Provide: 1) A warm acknowledgment 2) What this reveals about their patterns 3) One specific growth insight 4) Whether to pursue or pass, with reasoning. Keep it concise (3-4 paragraphs).`,
```

- [ ] **Step 2: Add text sanitisation to growth/reflect route**

In `src/app/api/growth/reflect/route.ts`, add after line 11 (after the destructure):

```typescript
  const safeReflection = (reflection || "").slice(0, 2000).replace(/["""]/g, "'");
```

Then use `safeReflection` in the prompt on line 22:

```typescript
Their reflection: "${safeReflection}"
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/dates/debrief/route.ts src/app/api/growth/reflect/route.ts
git commit -m "security: sanitise and truncate user text before AI prompts"
```

---

## Task 7: Add email validation to waitlist

**Files:**
- Modify: `src/app/api/waitlist/join/route.ts`

- [ ] **Step 1: Add email format validation**

Replace the full file:

```typescript
import { NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/repo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { name, email, city, intent } = await req.json();

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const safeName = (name || "").slice(0, 100);
  const safeCity = (city || "").slice(0, 100);
  const safeIntent = (intent || "").slice(0, 50);

  const entry = await addToWaitlist(safeName, email, safeCity, safeIntent);
  if (!entry) {
    return NextResponse.json({ error: "Already on waitlist" }, { status: 409 });
  }

  return NextResponse.json(entry);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/waitlist/join/route.ts
git commit -m "security: validate email format and truncate waitlist inputs"
```

---

## Task 8: Consistent API error response for coach/chat

**Files:**
- Modify: `src/app/api/coach/chat/route.ts:14`

- [ ] **Step 1: Fix inconsistent error response**

In `src/app/api/coach/chat/route.ts`, replace line 13-14:

```typescript
  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 400 });
  }
```

Also add `NextResponse` import. The full import line should be:

```typescript
import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, UIMessage } from "ai";
```

Wait — looking at this route more carefully, it returns a stream not JSON. The error path should stay as NextResponse.json. Add the import:

Replace line 1:

```typescript
import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, UIMessage } from "ai";
```

Replace lines 13-15:

```typescript
  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 400 });
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/coach/chat/route.ts
git commit -m "fix: consistent NextResponse.json error in coach/chat route"
```

---

## Task 9: Fix N+1 query in getMatchForUser

**Files:**
- Modify: `src/lib/repo.ts:157-166`

- [ ] **Step 1: Replace double-query with single query**

In `src/lib/repo.ts`, replace lines 157-166:

```typescript
export async function getMatchForUser(userId: string, matchId: string): Promise<Match | null> {
  // Try exact ID match first
  const rows = await sql`
    SELECT match_data FROM matches WHERE user_id = ${userId} AND id = ${matchId}
  `;
  if (rows.length) {
    return safeParseJson<Match>((rows[0] as { match_data: string }).match_data, null as unknown as Match);
  }
  return null;
}
```

This removes the fallback `getMatchesForUser(userId)` call that loaded ALL matches just to find one by ID.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/repo.ts
git commit -m "perf: eliminate N+1 query in getMatchForUser"
```

---

## Task 10: Add missing loading.tsx files (5 pages)

**Files:**
- Create: `src/app/coach/loading.tsx`
- Create: `src/app/companion/loading.tsx`
- Create: `src/app/debrief/loading.tsx`
- Create: `src/app/profile/loading.tsx`
- Create: `src/app/soul-snapshot/loading.tsx`

- [ ] **Step 1: Create coach loading**

Create `src/app/coach/loading.tsx`:

```tsx
import { LoadingScreen } from "@/components/loading-screen";

export default function CoachLoading() {
  return <LoadingScreen message="Preparing your coach..." />;
}
```

- [ ] **Step 2: Create companion loading**

Create `src/app/companion/loading.tsx`:

```tsx
import { LoadingScreen } from "@/components/loading-screen";

export default function CompanionLoading() {
  return <LoadingScreen message="Connecting to Aura..." />;
}
```

- [ ] **Step 3: Create debrief loading**

Create `src/app/debrief/loading.tsx`:

```tsx
import { LoadingScreen } from "@/components/loading-screen";

export default function DebriefLoading() {
  return <LoadingScreen message="Loading your debrief..." />;
}
```

- [ ] **Step 4: Create profile loading**

Create `src/app/profile/loading.tsx`:

```tsx
import { LoadingScreen } from "@/components/loading-screen";

export default function ProfileLoading() {
  return <LoadingScreen message="Loading your profile..." />;
}
```

- [ ] **Step 5: Create soul-snapshot loading**

Create `src/app/soul-snapshot/loading.tsx`:

```tsx
import { LoadingScreen } from "@/components/loading-screen";

export default function SoulSnapshotLoading() {
  return <LoadingScreen message="Preparing your soul snapshot..." />;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/coach/loading.tsx src/app/companion/loading.tsx src/app/debrief/loading.tsx src/app/profile/loading.tsx src/app/soul-snapshot/loading.tsx
git commit -m "ux: add loading.tsx skeletons for 5 pages missing them"
```

---

## Task 11: Accessibility — aria-labels on bottom nav

**Files:**
- Modify: `src/components/bottom-nav.tsx`

- [ ] **Step 1: Add nav aria-label and link aria-labels**

In `src/components/bottom-nav.tsx`, replace the `<nav>` tag (line 53-55):

```tsx
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bd-glass border-t"
      style={{ borderColor: "var(--bd-border)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
```

Replace the `<Link>` element (lines 64-84):

```tsx
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 px-4 py-2 transition-all"
            >
```

Add `role="img"` and `aria-hidden="true"` to all SVGs. In the `NavIcon` component, wrap each SVG with `aria-hidden`:

Replace line 19-21 (the home SVG opening):

```tsx
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
```

Apply the same `aria-hidden="true"` attribute to all four SVGs (home, heart, sparkle, user) at lines 19, 25, 30, 36.

- [ ] **Step 2: Commit**

```bash
git add src/components/bottom-nav.tsx
git commit -m "a11y: add aria-labels to bottom nav, aria-current for active page"
```

---

## Task 12: Accessibility — focus ring styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add focus-visible ring styles**

Add after the `@layer base` block (after line 130):

```css
/* ─── Focus visible ─── */
:focus-visible {
  outline: 2px solid var(--bd-accent);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--bd-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "a11y: add visible focus ring styles for keyboard navigation"
```

---

## Task 13: SEO — OG metadata and static landing page

**Files:**
- Modify: `src/app/layout.tsx:7-17`
- Modify: `src/app/page.tsx` (add static export)

- [ ] **Step 1: Add Open Graph metadata to layout**

In `src/app/layout.tsx`, replace the metadata export (lines 7-17):

```typescript
export const metadata: Metadata = {
  title: "BiggDate — See Your Future, Not Just a Profile",
  description:
    "AI-powered dating that shows you what life looks like with someone before you ever meet. Soul profiling, Life Previews, and relationship coaching.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BiggDate",
  },
  openGraph: {
    title: "BiggDate — See Your Future, Not Just a Profile",
    description: "AI-powered dating that reads the emotional architecture of a match before you invest your time.",
    siteName: "BiggDate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiggDate — See Your Future, Not Just a Profile",
    description: "AI-powered dating that reads the emotional architecture of a match before you invest your time.",
  },
};
```

- [ ] **Step 2: Force-static on landing page**

Add this line at the top of `src/app/page.tsx` (after the imports, before the constants):

```typescript
export const dynamic = "force-static";
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Landing page should show as static in build output.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "seo: add OG/Twitter meta, force-static on landing page"
```

---

## Task 14: Performance — cache headers on match generation

**Files:**
- Modify: `src/app/api/matches/generate/route.ts`

- [ ] **Step 1: Add Cache-Control header to cached response**

In `src/app/api/matches/generate/route.ts`, replace line 17:

```typescript
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "private, max-age=3600" },
    });
  }
```

This tells the browser it can reuse the response for 1 hour without refetching.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/matches/generate/route.ts
git commit -m "perf: add Cache-Control header on cached match responses"
```

---

## Task 15: Final build verification

- [ ] **Step 1: Clean build**

```bash
rm -rf dist/
npm run build
```

Expected: Clean build, no errors, no warnings about missing deps.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors. If there are pre-existing ones unrelated to our changes, note them but don't fix.

- [ ] **Step 3: Start and smoke test**

```bash
npm run dev
```

Manually verify:
- Landing page loads (`/`)
- Auth flow works (`/auth`)
- Dashboard loads after login (`/dashboard`)
- Bottom nav has aria-labels (inspect in browser dev tools)
- Focus ring visible when tabbing through nav

- [ ] **Step 4: Final commit if any fixups needed**

```bash
git add -A
git commit -m "chore: post-audit fixups"
```

---

## Summary of what this plan covers

| Audit Finding | Task |
|---|---|
| CRITICAL: SHA256 password hashing | Task 3 |
| CRITICAL: DB SSL `rejectUnauthorized: false` | Task 4 |
| CRITICAL: `better-sqlite3` phantom dep | Task 2 |
| CRITICAL: Error responses leak raw AI output | Task 5 |
| IMPORTANT: Dead legacy files (3500+ lines) | Task 1 |
| IMPORTANT: `dist/` committed to git | Task 1 |
| IMPORTANT: No security headers | Task 2 |
| IMPORTANT: Prompt injection in debrief/reflect | Task 6 |
| IMPORTANT: Waitlist no email validation | Task 7 |
| IMPORTANT: Inconsistent error responses | Task 8 |
| IMPORTANT: Min password 6 chars | Task 3 |
| IMPORTANT: N+1 query getMatchForUser | Task 9 |
| IMPORTANT: 5 pages missing loading.tsx | Task 10 |
| IMPORTANT: No aria-labels on nav | Task 11 |
| IMPORTANT: No focus ring styles | Task 12 |
| IMPORTANT: No OG metadata | Task 13 |
| IMPORTANT: Landing page not static | Task 13 |
| IMPORTANT: No cache headers on API | Task 14 |
| MINOR: No CSP/security headers | Task 2 |
| Final verification | Task 15 |

## Not in scope (future work)

- Rate limiting on login (needs Redis/Upstash — separate task)
- `generateMetadata` on dynamic routes like `/matches/[id]/preview` (needs product decision on what to expose)
- Credential rotation for `.env.local` (manual ops task, not code)
- `aria-live` regions on chat messages (larger refactor of chat components)
- `next/font` optimization (cosmetic, system fonts are fine for launch)
