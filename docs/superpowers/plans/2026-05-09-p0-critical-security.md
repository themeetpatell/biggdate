# P0 Critical Security Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the 8 critical security holes that must be fixed before the platform handles real users — missing middleware, open email endpoint, delete ordering bug, unvalidated block/pass inputs, and missing RLS on checkins.

**Architecture:** Each fix is surgical and isolated: rename proxy.ts→middleware.ts, harden the failing-open guard, add an admin server layout, replace origin-header auth on the email endpoint with a shared secret, fix delete ordering, add UUID validation to block/pass, and add an RLS migration for dashboard_checkins.

**Tech Stack:** Next.js 16 App Router, Supabase SSR, TypeScript, PostgreSQL migrations

---

## Files Modified

| File | Action | Purpose |
|---|---|---|
| `src/middleware.ts` | Create (rename from proxy.ts) | Fix INFRA-C1: make Next.js actually invoke the auth guard |
| `src/proxy.ts` | Delete | Dead after rename |
| `src/middleware.ts` lines 34-36 | Modify | Fix INFRA-C3: fail closed when env vars missing |
| `src/app/admin/layout.tsx` | Create | Fix INFRA-C2: server-side admin gate |
| `src/app/api/notifications/email/route.ts` | Modify | Fix API-C1: replace origin check with INTERNAL_API_SECRET |
| `src/lib/notifications.ts` | Modify | Fix API-C1: send INTERNAL_API_SECRET header |
| `src/app/api/auth/delete/route.ts` | Modify | Fix API-C2: delete before clearing cookie |
| `src/app/api/safety/block/route.ts` | Modify | Fix API-C3: UUID + self-block validation |
| `src/app/api/intros/pass/route.ts` | Modify | Fix API-C4: try/catch + validation |
| `supabase/migrations/202605090001_dashboard_checkins_rls.sql` | Create | Fix DB-C3: enable RLS on dashboard_checkins |

---

## Task 1: Rename proxy.ts → middleware.ts and fix export name

**Files:**
- Create: `src/middleware.ts`
- Delete: `src/proxy.ts`

- [ ] **Step 1: Create `src/middleware.ts` with correct export**

The file is identical to `src/proxy.ts` except the function is exported as `middleware` (the name Next.js requires) and the failing-open guard is fixed. Copy the full file:

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = [
  "/", "/auth", "/about", "/contact",
  "/simulation", "/how-it-works", "/faq", "/glossary",
  "/terms", "/privacy", "/vs", "/compare", "/onboarding",
];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/")),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes (they handle auth themselves) and static assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public paths don't need auth
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Fail closed: if Supabase is not configured, block access rather than expose protected routes
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Delete `src/proxy.ts`**

```bash
rm /Users/themeetpatel/Startups/biggdate/src/proxy.ts
```

- [ ] **Step 3: Verify Next.js picks up middleware**

```bash
cd /Users/themeetpatel/Startups/biggdate && npm run build 2>&1 | grep -E "middleware|error" | head -20
```

Expected: build succeeds; no "proxy" references remain.

- [ ] **Step 4: Grep for any remaining imports of proxy.ts**

```bash
grep -r "from.*proxy" /Users/themeetpatel/Startups/biggdate/src/ --include="*.ts" --include="*.tsx"
```

Expected: zero results.

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts && git rm src/proxy.ts
git commit -m "fix(infra): rename proxy.ts to middleware.ts so Next.js invokes auth guard

Fixes INFRA-C1 and INFRA-C3:
- proxy() was never called by Next.js (wrong filename + wrong export name)
- Also fixes the failing-open guard: missing Supabase env vars now redirect to /auth instead of NextResponse.next()"
```

---

## Task 2: Add server-side admin layout gate

**Files:**
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Create the admin layout**

```typescript
// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();

  if (!session || !ADMIN_USER_IDS.includes(session.userId)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Verify the layout file resolves `getSessionFromCookies`**

```bash
grep -n "getSessionFromCookies" /Users/themeetpatel/Startups/biggdate/src/lib/auth.ts | head -5
```

Expected: function is exported from `src/lib/auth.ts`.

- [ ] **Step 3: Run typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "admin/layout|error" | head -20
```

Expected: no errors on the new file.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "fix(security): add server-side admin gate via layout.tsx

Fixes INFRA-C2: previously any authenticated user could load /admin/* pages.
Now the layout checks ADMIN_USER_IDS before rendering, matching the API route guard."
```

---

## Task 3: Fix internal email endpoint — replace origin check with INTERNAL_API_SECRET

**Files:**
- Modify: `src/app/api/notifications/email/route.ts`
- Modify: `src/lib/notifications.ts`

- [ ] **Step 1: Read the current email route auth guard**

Read lines 109–120 of `src/app/api/notifications/email/route.ts` to confirm the origin-header check location.

- [ ] **Step 2: Replace the origin guard in `email/route.ts`**

Find and replace the existing origin-header block. The guard currently looks like:
```typescript
// existing broken guard (around line 112-116)
const origin = request.headers.get("origin");
const host = request.headers.get("host");
if (origin && !origin.includes(host ?? "")) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

Replace with a shared-secret check at the top of the POST handler, before any body parsing:

```typescript
// New guard — add near the top of the POST function, before body parsing
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;
if (!INTERNAL_SECRET) {
  return NextResponse.json({ error: "Server misconfigured" }, { status: 503 });
}
const authHeader = request.headers.get("x-internal-secret");
if (authHeader !== INTERNAL_SECRET) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

- [ ] **Step 3: Update `notifications.ts` to send the secret header**

Find the `sendNotification` fetch call in `src/lib/notifications.ts` (around line 29-40). Add the header:

```typescript
const secret = process.env.INTERNAL_API_SECRET;
const res = await fetch(`${baseUrl}/api/notifications/email`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(secret ? { "x-internal-secret": secret } : {}),
  },
  body: JSON.stringify({ toUserId, event, data }),
});
```

- [ ] **Step 4: Add `INTERNAL_API_SECRET` to local env for dev**

```bash
grep "INTERNAL_API_SECRET" /Users/themeetpatel/Startups/biggdate/.env.local || echo "INTERNAL_API_SECRET=$(openssl rand -hex 32)" >> /Users/themeetpatel/Startups/biggdate/.env.local
```

- [ ] **Step 5: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "notifications|error" | head -10
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/notifications/email/route.ts src/lib/notifications.ts
git commit -m "fix(security): replace origin-header check with INTERNAL_API_SECRET on email route

Fixes API-C1: the origin check was trivially bypassed by any server-to-server
caller that omits the Origin header. Any authenticated user could spam platform
emails to any user ID. Now requires INTERNAL_API_SECRET header."
```

---

## Task 4: Fix `auth/delete` — delete account before clearing cookie

**Files:**
- Modify: `src/app/api/auth/delete/route.ts`

- [ ] **Step 1: Read the current delete route**

Read `src/app/api/auth/delete/route.ts` in full to understand the exact sequence.

- [ ] **Step 2: Reorder operations and fix error message**

The current code (approximately):
```typescript
// BROKEN: cookie cleared before delete
clearSessionCookie();
const { error } = await adminClient.auth.admin.deleteUser(userId);
if (error) return NextResponse.json({ error: error.message }, { status: 500 });
```

Replace with:
```typescript
// Delete the account first, then clear the cookie on success
const { error } = await adminClient.auth.admin.deleteUser(userId);
if (error) {
  return NextResponse.json(
    { error: "Account deletion failed. Please contact support." },
    { status: 500 }
  );
}
clearSessionCookie();
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "auth/delete" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/auth/delete/route.ts
git commit -m "fix(auth): delete Supabase account before clearing session cookie

Fixes API-C2: previously a failed deleteUser call left the user logged out
with their account still intact and no way to recover. Also stops leaking
raw Supabase error messages to the client."
```

---

## Task 5: Fix `safety/block` — add UUID and self-block validation

**Files:**
- Modify: `src/app/api/safety/block/route.ts`

- [ ] **Step 1: Read the current block route and the report route**

Read both `src/app/api/safety/block/route.ts` and `src/app/api/safety/report/route.ts` to see the UUID_RE pattern that already exists in report.

- [ ] **Step 2: Apply the same validation pattern to block**

Replace the block route's validation section. The existing code roughly:
```typescript
const { blockedId } = await req.json();
if (!blockedId) return NextResponse.json({ error: "Missing blockedId" }, { status: 400 });
```

Replace with the full validated version:
```typescript
let body: { blockedId?: unknown };
try {
  body = await req.json();
} catch {
  return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const blockedId = typeof body.blockedId === "string" ? body.blockedId.trim() : "";

if (!UUID_RE.test(blockedId)) {
  return NextResponse.json({ error: "Invalid blockedId" }, { status: 400 });
}

if (blockedId === auth.userId) {
  return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 });
}
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "safety/block" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/safety/block/route.ts
git commit -m "fix(security): add UUID validation and self-block guard to safety/block

Fixes API-C3: blockedId was accepted with only a truthiness check, allowing
non-UUID strings (corrupted FK inserts) and self-blocking. Matches the pattern
already used in safety/report."
```

---

## Task 6: Fix `intros/pass` — add try/catch and input validation

**Files:**
- Modify: `src/app/api/intros/pass/route.ts`

- [ ] **Step 1: Read the current pass route**

Read `src/app/api/intros/pass/route.ts` in full.

- [ ] **Step 2: Add try/catch and validation**

Replace the body-parsing and validation section. Find the current (broken):
```typescript
const { matchId, matchName, reason } = await req.json();
```

Replace with the full validated version:
```typescript
let body: { matchId?: unknown; matchName?: unknown; reason?: unknown };
try {
  body = await req.json();
} catch {
  return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const matchId = typeof body.matchId === "string" ? body.matchId.trim() : "";
const matchName = typeof body.matchName === "string" ? body.matchName.trim().slice(0, 120) : "";
const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 280) : "";

if (!UUID_RE.test(matchId)) {
  return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
}
if (!matchName) {
  return NextResponse.json({ error: "matchName is required" }, { status: 400 });
}
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "intros/pass" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/intros/pass/route.ts
git commit -m "fix(security): add try/catch and input validation to intros/pass

Fixes API-C4: matchId/matchName/reason were accepted with no type checks,
length caps, or UUID validation. Malformed body caused unhandled 500."
```

---

## Task 7: Add RLS to `dashboard_checkins`

**Files:**
- Create: `supabase/migrations/202605090001_dashboard_checkins_rls.sql`

- [ ] **Step 1: Create the migration**

```sql
-- supabase/migrations/202605090001_dashboard_checkins_rls.sql
-- Fix DB-C3: dashboard_checkins was created without RLS, exposing all users'
-- mood check-ins to any authenticated user via Supabase REST.

ALTER TABLE dashboard_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own checkins"
  ON dashboard_checkins
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

- [ ] **Step 2: Apply the migration locally**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx supabase db push 2>&1 | tail -10
```

Expected: migration applies without error.

- [ ] **Step 3: Verify RLS is enabled**

```bash
npx supabase db diff --use-migra 2>&1 | grep "dashboard_checkins" | head -5
```

Expected: no pending diff for dashboard_checkins.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/202605090001_dashboard_checkins_rls.sql
git commit -m "fix(db): enable RLS on dashboard_checkins table

Fixes DB-C3: the table was created without ENABLE ROW LEVEL SECURITY, making
all users' mood check-ins readable/writable by any authenticated user via
the Supabase REST API."
```

---

## Self-Review

**Spec coverage:**
- INFRA-C1 (middleware missing): Task 1 ✓
- INFRA-C2 (admin pages unguarded): Task 2 ✓
- INFRA-C3 (proxy fails open): Task 1 (fixed in same file) ✓
- API-C1 (email endpoint): Task 3 ✓
- API-C2 (delete ordering): Task 4 ✓
- API-C3 (block validation): Task 5 ✓
- API-C4 (pass validation): Task 6 ✓
- DB-C3 (dashboard_checkins RLS): Task 7 ✓

**No placeholders found.**

**Type consistency:** `getSessionFromCookies` used in Task 2 — confirmed exported from `src/lib/auth.ts`. `UUID_RE` defined inline in Tasks 5 and 6 (consistent pattern from `safety/report`).
