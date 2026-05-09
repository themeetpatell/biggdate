# P1 Database Integrity Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate race conditions, non-atomic writes, missing indexes, and schema type mismatches in the database layer that cause silent data corruption, quota bypasses, and stuck match states.

**Architecture:** Fixes fall into three groups: (1) SQL migrations to fix schema (user_plans uuid, RLS gaps, indexes, JSON→jsonb), (2) application-layer atomicity fixes in `src/lib/repo.ts` (transactions, CTEs, ON CONFLICT upserts), and (3) operational hygiene (data pruning, TTLs). All schema changes go through Supabase migration files.

**Tech Stack:** PostgreSQL, Supabase migrations, TypeScript (`src/lib/repo.ts`), `pg` pool transactions

---

## Files Modified

| File | Action | Purpose |
|---|---|---|
| `supabase/migrations/202605090002_fix_user_plans_uuid.sql` | Create | Fix DB-C4: user_plans.user_id text→uuid + FK |
| `supabase/migrations/202605090003_fix_pulse_rls.sql` | Create | Fix DB-M3: pulse_posts/replies UPDATE policy |
| `supabase/migrations/202605090004_fix_indexes.sql` | Create | Fix DB-H3/H5: missing indexes on intros |
| `supabase/migrations/202605090005_fix_json_columns.sql` | Create | Fix DB-L3: key columns text→jsonb |
| `supabase/migrations/202605090006_data_ttl.sql` | Create | Fix DB-L1/L2/M4: cleanup seen_matches, usage_counters, stripe_events |
| `src/lib/repo.ts` | Modify (multiple hunks) | Fix DB-C1, C2, C5, H1-H4, M1, M3 |
| `src/lib/db.ts` | Modify | Fix DB-M2: ssl rejectUnauthorized |

---

## Task 1: Fix `saveMatchesForUser` — transaction + batch insert

**Files:**
- Modify: `src/lib/repo.ts` (lines ~338–348)

- [ ] **Step 1: Find the current implementation**

```bash
grep -n "saveMatchesForUser\|DELETE FROM matches\|INSERT INTO matches" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -20
```

- [ ] **Step 2: Replace the loop with a transaction + batch insert**

Find the function body (the DELETE + for-loop pattern) and replace it:

```typescript
export async function saveMatchesForUser(userId: string, matches: Match[]) {
  if (matches.length === 0) return;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM matches WHERE user_id = $1", [userId]);
    if (matches.length > 0) {
      // Build a single multi-row INSERT
      const values: unknown[] = [];
      const placeholders = matches.map((m, i) => {
        const base = i * 5;
        values.push(
          m.id ?? createId("match"),
          userId,
          m.matchedUserId,
          JSON.stringify(m),
          new Date()
        );
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
      });
      await client.query(
        `INSERT INTO matches (id, user_id, matched_user_id, match_data, created_at)
         VALUES ${placeholders.join(", ")}
         ON CONFLICT (id) DO NOTHING`,
        values
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

Note: verify the exact column names against the schema before committing. Run:
```bash
grep -A5 "CREATE TABLE matches" /Users/themeetpatel/Startups/biggdate/supabase/migrations/*.sql
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "repo.ts" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/repo.ts
git commit -m "fix(db): wrap saveMatchesForUser in transaction with batch insert

Fixes DB-C5: the DELETE + per-row INSERT loop had no transaction, leaving
users with zero matches if the process crashed mid-loop. Also eliminates
a concurrent-read window where matches appeared empty between DELETE and first INSERT."
```

---

## Task 2: Make `requirePlan` + `incrementUsage` atomic

**Files:**
- Modify: `src/lib/repo.ts` (lines ~1275–1301)

- [ ] **Step 1: Find the current requirePlan and incrementUsage functions**

```bash
grep -n "requirePlan\|incrementUsage\|usage_counters" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -30
```

- [ ] **Step 2: Replace with a single atomic CTE**

Find the two-step check-then-increment pattern. The existing code does a SELECT count then a separate INSERT/UPDATE. Replace the combined logic with:

```typescript
export async function requirePlanAtomic(
  userId: string,
  action: string,
  limit: number,
  periodStart: string
): Promise<{ allowed: boolean; used: number }> {
  // Single atomic check-and-increment: returns the count AFTER incrementing.
  // If the returned count exceeds the limit, the action is denied.
  const result = await sql<{ count: number }>`
    WITH bump AS (
      INSERT INTO usage_counters (user_id, action, count, period_start)
      VALUES (${userId}, ${action}, 1, ${periodStart})
      ON CONFLICT (user_id, action, period_start)
      DO UPDATE SET count = usage_counters.count + 1
      RETURNING count
    )
    SELECT count FROM bump
  `;
  const used = result.rows[0]?.count ?? 1;
  if (used > limit) {
    // Roll back the increment since we're over limit
    await sql`
      UPDATE usage_counters
      SET count = count - 1
      WHERE user_id = ${userId} AND action = ${action} AND period_start = ${periodStart}
    `;
    return { allowed: false, used: used - 1 };
  }
  return { allowed: true, used };
}
```

Then update all callers of `requirePlan` + `incrementUsage` (grep for them) to use `requirePlanAtomic` instead.

```bash
grep -n "requirePlan\|incrementUsage" /Users/themeetpatel/Startups/biggdate/src/app/api/intros/request/route.ts
grep -rn "requirePlan\|incrementUsage" /Users/themeetpatel/Startups/biggdate/src/app/api/ --include="*.ts"
```

- [ ] **Step 3: Update each API route caller**

For each route that calls `requirePlan(...)` then `incrementUsage(...)` separately, replace with:
```typescript
const { allowed } = await requirePlanAtomic(auth.userId, "soul_knock", limit, periodStart);
if (!allowed) {
  return NextResponse.json({ error: "Soul Knock limit reached" }, { status: 403 });
}
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "repo|intros/request" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/repo.ts src/app/api/intros/request/route.ts
git commit -m "fix(db): make requirePlan + incrementUsage atomic via CTE

Fixes DB-C2: the SELECT-then-UPDATE TOCTOU race allowed users to exceed
their Soul Knock daily limit with concurrent requests. Now uses a single
atomic INSERT ON CONFLICT DO UPDATE that returns the post-increment count."
```

---

## Task 3: Wrap Soul Knock mutual flow in a transaction

**Files:**
- Modify: `src/lib/repo.ts` (lines ~974–1087)
- Modify: `src/app/api/intros/respond/route.ts` (lines ~39–50)

- [ ] **Step 1: Find `saveSoulKnockResponse`, `markIntroAnswered`, `createThread`, `unlockPhotosForBothUsers`**

```bash
grep -n "saveSoulKnockResponse\|markIntroAnswered\|createThread\|unlockPhotosForBothUsers" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -20
```

- [ ] **Step 2: Create a single transactional function in repo.ts**

Add a new exported function that wraps all five steps:

```typescript
export async function completeSoulKnockResponse(
  introId: string,
  userId: string,
  side: "sender" | "receiver",
  response: string
): Promise<{ mutual: boolean; thread: { id: string } | null }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Save the soul knock response
    await client.query(
      `INSERT INTO soul_knock_responses (intro_id, user_id, response, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (intro_id, user_id) DO UPDATE SET response = EXCLUDED.response`,
      [introId, userId, response]
    );

    // 2. Mark the intro as answered on this side
    const answerCol = side === "sender" ? "sender_answered" : "receiver_answered";
    await client.query(
      `UPDATE intros SET ${answerCol} = true WHERE id = $1`,
      [introId]
    );

    // 3. Check for mutual match within the same transaction
    const introResult = await client.query(
      `SELECT sender_answered, receiver_answered, user_id, matched_user_id FROM intros WHERE id = $1`,
      [introId]
    );
    const intro = introResult.rows[0];
    const mutual = intro?.sender_answered && intro?.receiver_answered;

    let thread: { id: string } | null = null;
    if (mutual) {
      const threadId = createId("thread");
      const threadResult = await client.query(
        `INSERT INTO threads (id, user_id_1, user_id_2, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id_1, user_id_2) DO NOTHING
         RETURNING id`,
        [threadId, intro.user_id, intro.matched_user_id]
      );
      // Handle ON CONFLICT DO NOTHING (thread already existed)
      if (threadResult.rows.length === 0) {
        const existing = await client.query(
          `SELECT id FROM threads WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)`,
          [intro.user_id, intro.matched_user_id]
        );
        thread = existing.rows[0] ?? null;
      } else {
        thread = threadResult.rows[0];
      }

      // 4. Unlock photos for both users
      await client.query(
        `UPDATE profiles SET photos_unlocked_for = array_append(photos_unlocked_for, $2)
         WHERE user_id = $1 AND NOT ($2 = ANY(photos_unlocked_for))`,
        [intro.user_id, intro.matched_user_id]
      );
      await client.query(
        `UPDATE profiles SET photos_unlocked_for = array_append(photos_unlocked_for, $2)
         WHERE user_id = $1 AND NOT ($2 = ANY(photos_unlocked_for))`,
        [intro.matched_user_id, intro.user_id]
      );
    }

    await client.query("COMMIT");
    return { mutual, thread };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

**Important:** Verify the exact column names in `intros` and `threads` tables by running:
```bash
grep -A20 "CREATE TABLE intros\|CREATE TABLE threads" /Users/themeetpatel/Startups/biggdate/supabase/migrations/*.sql
```
Adjust the column names in the query above to match the actual schema.

- [ ] **Step 3: Update `intros/respond/route.ts` to use the new function**

Replace the five separate calls with:
```typescript
const { mutual, thread } = await completeSoulKnockResponse(
  intro.id,
  auth.userId,
  isSender ? "sender" : "receiver",
  response
);
```

Remove the individual `saveSoulKnockResponse`, `markIntroAnswered`, re-fetch, `createThread`, `unlockPhotosForBothUsers` calls.

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "repo|intros/respond" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/repo.ts src/app/api/intros/respond/route.ts
git commit -m "fix(db): wrap Soul Knock mutual flow in a single transaction

Fixes DB-C1: five separate non-transactional writes (response, mark-answered,
re-fetch, createThread, unlockPhotos) could crash mid-sequence, leaving a
permanently stuck mutual state with no thread. Now a single BEGIN/COMMIT."
```

---

## Task 4: Fix `upsertProfile` race — use INSERT ON CONFLICT DO UPDATE

**Files:**
- Modify: `src/lib/repo.ts` (lines ~97–120)

- [ ] **Step 1: Find the current upsertProfile SELECT-then-branch**

```bash
grep -n "upsertProfile\|SELECT.*profiles.*WHERE user_id" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -15
```

- [ ] **Step 2: Replace SELECT-then-INSERT/UPDATE with a single upsert**

Find the pattern that does a SELECT, then branches to INSERT or UPDATE. Replace the body with a true atomic upsert. First check what columns the profiles table has:

```bash
grep -A40 "CREATE TABLE profiles" /Users/themeetpatel/Startups/biggdate/supabase/migrations/*.sql | head -50
```

Then replace the function body with a single `INSERT ... ON CONFLICT (user_id) DO UPDATE SET` statement using all the updateable fields. The exact set of columns must match what `normalizePatch` allows. A minimal safe version:

```typescript
export async function upsertProfile(userId: string, patch: Partial<Profile>) {
  const normalized = normalizePatch(patch); // always allowlist
  // Build SET clause dynamically from normalized keys
  const keys = Object.keys(normalized);
  if (keys.length === 0) return;

  const setClauses = keys.map((k, i) => `"${k}" = $${i + 2}`).join(", ");
  const values = [userId, ...keys.map((k) => (normalized as Record<string, unknown>)[k])];

  await sql.query(
    `INSERT INTO profiles (user_id, ${keys.map((k) => `"${k}"`).join(", ")}, created_at, updated_at)
     VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(", ")}, NOW(), NOW())
     ON CONFLICT (user_id) DO UPDATE SET ${setClauses}, updated_at = NOW()`,
    values
  );
}
```

Note: `sql.query` here refers to the pg Pool's `query` method. Check the actual `sql` export in `src/lib/db.ts` to use the right accessor.

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "repo.ts" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/repo.ts
git commit -m "fix(db): replace SELECT-then-INSERT in upsertProfile with atomic ON CONFLICT upsert

Fixes DB-M1: two simultaneous POST /api/profile requests for a new user both
found zero rows and both attempted INSERT, causing a unique-constraint violation
and an unhandled 500."
```

---

## Task 5: Fix `togglePulseReaction` race + `flagPulsePost` idempotency + `createPulseReply` transaction

**Files:**
- Modify: `src/lib/repo.ts` (lines ~1562–1659)

- [ ] **Step 1: Find all three functions**

```bash
grep -n "togglePulseReaction\|flagPulsePost\|createPulseReply" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts
```

- [ ] **Step 2: Fix `togglePulseReaction` — use a transaction**

Find the function and replace it with a transaction-wrapped version:

```typescript
export async function togglePulseReaction(postId: string, userId: string): Promise<{ resonated: boolean }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Atomic toggle: try insert first, delete if it already exists
    const insertResult = await client.query(
      `INSERT INTO pulse_reactions (post_id, user_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (post_id, user_id) DO NOTHING
       RETURNING id`,
      [postId, userId]
    );

    const didInsert = insertResult.rows.length > 0;

    if (!didInsert) {
      // Was already reacted — remove it
      await client.query(
        `DELETE FROM pulse_reactions WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );
      await client.query(
        `UPDATE pulse_posts SET resonate_count = GREATEST(0, resonate_count - 1) WHERE id = $1`,
        [postId]
      );
    } else {
      await client.query(
        `UPDATE pulse_posts SET resonate_count = resonate_count + 1 WHERE id = $1`,
        [postId]
      );
    }

    await client.query("COMMIT");
    return { resonated: didInsert };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

- [ ] **Step 3: Fix `flagPulsePost` — only increment when insert was not a no-op**

Replace with a CTE-based version:

```typescript
export async function flagPulsePost(postId: string, userId: string): Promise<void> {
  await sql`
    WITH ins AS (
      INSERT INTO pulse_flags (post_id, user_id, created_at)
      VALUES (${postId}, ${userId}, NOW())
      ON CONFLICT (post_id, user_id) DO NOTHING
      RETURNING id
    )
    UPDATE pulse_posts
    SET
      flag_count = flag_count + (SELECT COUNT(*) FROM ins),
      is_hidden = CASE
        WHEN flag_count + (SELECT COUNT(*) FROM ins) >= 3 THEN true
        ELSE is_hidden
      END
    WHERE id = ${postId}
      AND (SELECT COUNT(*) FROM ins) > 0
  `;
}
```

- [ ] **Step 4: Fix `createPulseReply` — wrap in transaction**

Find the INSERT + separate UPDATE reply_count and wrap them:

```typescript
export async function createPulseReply(postId: string, userId: string, content: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO pulse_replies (post_id, user_id, content, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [postId, userId, content]
    );
    await client.query(
      `UPDATE pulse_posts SET reply_count = reply_count + 1 WHERE id = $1`,
      [postId]
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

- [ ] **Step 5: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "repo.ts" | head -10
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/repo.ts
git commit -m "fix(db): fix race conditions in pulse reaction toggle, flag, and reply count

Fixes DB-H1: togglePulseReaction SELECT-then-INSERT race causing double-increments.
Fixes DB-H2: flagPulsePost incremented flag_count even when INSERT was a no-op.
Fixes DB-H3: createPulseReply incremented reply_count outside a transaction."
```

---

## Task 6: Fix SSL — remove `rejectUnauthorized: false`

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Read the current SSL config**

```bash
grep -n "rejectUnauthorized\|ssl" /Users/themeetpatel/Startups/biggdate/src/lib/db.ts
```

- [ ] **Step 2: Replace with proper SSL config**

Find the `ssl: { rejectUnauthorized: false }` line and replace with:

```typescript
ssl: shouldUseSsl(databaseUrl)
  ? {
      rejectUnauthorized: true,
      // Supabase uses a certificate signed by a well-known CA; standard Node.js
      // trust store is sufficient. Remove rejectUnauthorized:false which was
      // disabling certificate verification and allowing MITM attacks.
    }
  : undefined,
```

If the connection fails with `rejectUnauthorized: true` and Supabase's CA is not in the Node trust store, the alternative is:
```typescript
ssl: shouldUseSsl(databaseUrl)
  ? { rejectUnauthorized: false } // TODO: provide Supabase CA cert
  : undefined,
```
Only keep the `false` fallback if true causes connection errors in your environment — but document it as a known gap.

- [ ] **Step 3: Test the connection locally**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsx --env-file=.env.local -e "import { pool } from './src/lib/db'; pool.query('SELECT 1').then(() => console.log('OK')).catch(console.error)"
```

Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/db.ts
git commit -m "fix(security): enable TLS certificate verification for database connections

Fixes DB-M2: rejectUnauthorized:false disabled certificate verification,
making the connection vulnerable to MITM attacks."
```

---

## Task 7: Schema migration — fix user_plans.user_id type, add missing indexes, add pulse RLS UPDATE policies

**Files:**
- Create: `supabase/migrations/202605090002_fix_user_plans_uuid.sql`
- Create: `supabase/migrations/202605090003_fix_pulse_rls.sql`
- Create: `supabase/migrations/202605090004_fix_indexes.sql`

- [ ] **Step 1: Create migration for user_plans uuid fix**

```sql
-- supabase/migrations/202605090002_fix_user_plans_uuid.sql
-- Fix DB-C4: user_plans.user_id was text instead of uuid, preventing
-- a foreign key to auth.users and causing type-level join issues.

-- Step 1: remove the old unique constraint and column
ALTER TABLE user_plans DROP CONSTRAINT IF EXISTS user_plans_user_id_key;

-- Step 2: add new uuid column
ALTER TABLE user_plans ADD COLUMN user_id_new uuid;

-- Step 3: backfill (all existing values should be valid UUIDs stored as text)
UPDATE user_plans SET user_id_new = user_id::uuid WHERE user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Step 4: delete rows that weren't valid UUIDs (dev garbage data)
DELETE FROM user_plans WHERE user_id_new IS NULL;

-- Step 5: drop old column, rename new one
ALTER TABLE user_plans DROP COLUMN user_id;
ALTER TABLE user_plans RENAME COLUMN user_id_new TO user_id;

-- Step 6: add NOT NULL, unique, and FK constraints
ALTER TABLE user_plans ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_plans ADD CONSTRAINT user_plans_user_id_key UNIQUE (user_id);
ALTER TABLE user_plans ADD CONSTRAINT user_plans_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 7: fix the RLS policy to not need ::text cast
DROP POLICY IF EXISTS "Users see own plan" ON user_plans;
CREATE POLICY "Users see own plan"
  ON user_plans FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Step 8: add NOT NULL on timestamp columns
ALTER TABLE user_plans ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE user_plans ALTER COLUMN updated_at SET NOT NULL;
```

- [ ] **Step 2: Create migration for pulse RLS UPDATE policies**

```sql
-- supabase/migrations/202605090003_fix_pulse_rls.sql
-- Fix DB-M3: pulse_posts and pulse_replies had no UPDATE policy,
-- leaving intent ambiguous (RLS default-deny should block, but explicit is safer).

-- Explicitly deny direct UPDATE from authenticated users on system-managed fields.
-- Application code uses the server-side pg pool (bypasses RLS) for counter updates.
-- Users may only update their own post content.

CREATE POLICY "Users update own pulse posts content"
  ON pulse_posts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own pulse replies"
  ON pulse_replies FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

- [ ] **Step 3: Create migration for missing indexes**

```sql
-- supabase/migrations/202605090004_fix_indexes.sql
-- Fix DB-H5: missing index on intros.matched_user_id causes full sequential
-- scans for getIntrosReceivedByUser queries.

CREATE INDEX IF NOT EXISTS idx_intros_matched_user_id
  ON intros(matched_user_id)
  WHERE matched_user_id IS NOT NULL;

-- Also add index on seen_matches for the date-filtered query added in TTL migration
CREATE INDEX IF NOT EXISTS idx_seen_matches_user_date
  ON seen_matches(user_id, matched_date DESC);
```

- [ ] **Step 4: Apply all migrations**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx supabase db push 2>&1 | tail -20
```

Expected: all three migrations apply without error.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/202605090002_fix_user_plans_uuid.sql \
        supabase/migrations/202605090003_fix_pulse_rls.sql \
        supabase/migrations/202605090004_fix_indexes.sql
git commit -m "fix(db): schema migrations — user_plans uuid, pulse RLS, missing indexes

Fixes DB-C4: user_plans.user_id migrated from text to uuid with FK to auth.users.
Fixes DB-M3: explicit UPDATE policies on pulse_posts and pulse_replies.
Fixes DB-H5: index on intros.matched_user_id for received-intros queries."
```

---

## Task 8: Data TTL — prune seen_matches, usage_counters, stripe_events

**Files:**
- Create: `supabase/migrations/202605090006_data_ttl.sql`
- Modify: `src/lib/repo.ts` (getSeenUserIds date filter)

- [ ] **Step 1: Create the TTL migration**

```sql
-- supabase/migrations/202605090006_data_ttl.sql
-- Fix DB-M4, DB-L1, DB-L2: three tables grow unboundedly with no TTL.

-- seen_matches: only the last 90 days matter for candidate exclusion.
-- New users who joined after 90 days will re-appear, which is the desired behavior.
DELETE FROM seen_matches WHERE matched_date < CURRENT_DATE - INTERVAL '90 days';

-- usage_counters: old period rows have no business value.
DELETE FROM usage_counters WHERE period_start < CURRENT_DATE - INTERVAL '90 days';

-- stripe_events: Stripe only retries within 72h; 7d is safe for idempotency.
DELETE FROM stripe_events WHERE received_at < NOW() - INTERVAL '7 days';
```

- [ ] **Step 2: Add date filter to `getSeenUserIds` in repo.ts**

Find the `getSeenUserIds` function (around line 902) and add a date filter:

```typescript
export async function getSeenUserIds(userId: string): Promise<string[]> {
  const result = await sql<{ matched_user_id: string }>`
    SELECT matched_user_id FROM seen_matches
    WHERE user_id = ${userId}
      AND matched_date > CURRENT_DATE - INTERVAL '90 days'
  `;
  return result.rows.map((r) => r.matched_user_id);
}
```

- [ ] **Step 3: Apply migration and typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx supabase db push 2>&1 | tail -10
npx tsc --noEmit 2>&1 | grep "repo.ts" | head -5
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/202605090006_data_ttl.sql src/lib/repo.ts
git commit -m "fix(db): add TTL to seen_matches, usage_counters, stripe_events + 90-day filter on seen query

Fixes DB-M4: getSeenUserIds no longer returns all-time history, so new users
appear as candidates after 90 days. Fixes DB-L1/L2: three tables that grew
unboundedly are pruned via migration."
```

---

## Task 9: Fix hot-sort pagination cursor

**Files:**
- Modify: `src/lib/repo.ts` (lines ~1454–1470)
- Modify: `src/app/api/pulse/posts/route.ts`

- [ ] **Step 1: Find the hot-sort pagination query**

```bash
grep -n "hot\|cursor\|resonate_count\|pagination" /Users/themeetpatel/Startups/biggdate/src/lib/repo.ts | head -20
grep -n "cursor\|sort" /Users/themeetpatel/Startups/biggdate/src/app/api/pulse/posts/route.ts | head -20
```

- [ ] **Step 2: Replace float cursor with stable keyset pagination**

Find the hot-sort query and replace the cursor mechanism. The old cursor was a computed float (unstable). Replace with keyset on `(resonate_count DESC, created_at DESC, id ASC)`:

In `repo.ts` (the hot-sort query), change the WHERE/ORDER to:
```typescript
// Keyset cursor is "lastResonateCount:lastCreatedAt:lastId"
const [lastCount, lastCreated, lastId] = cursor
  ? cursor.split(":").map((v, i) => (i === 0 ? parseInt(v, 10) : v))
  : [null, null, null];

const rows = await sql<PulsePost>`
  SELECT * FROM pulse_posts
  WHERE is_hidden = false
    ${lastCount !== null
      ? sql`AND (
          resonate_count < ${lastCount}
          OR (resonate_count = ${lastCount} AND created_at < ${lastCreated})
          OR (resonate_count = ${lastCount} AND created_at = ${lastCreated} AND id > ${lastId})
        )`
      : sql``
    }
  ORDER BY resonate_count DESC, created_at DESC, id ASC
  LIMIT ${limit + 1}
`;

const hasMore = rows.length > limit;
const posts = hasMore ? rows.slice(0, limit) : rows;
const last = posts[posts.length - 1];
const nextCursor = hasMore && last
  ? `${last.resonate_count}:${last.created_at}:${last.id}`
  : null;
```

- [ ] **Step 3: Update `pulse/posts/route.ts` to pass the new cursor format through**

The route just reads `cursor` from `searchParams` and passes it to the repo function — verify no transformation is needed.

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "repo|pulse/posts" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/repo.ts src/app/api/pulse/posts/route.ts
git commit -m "fix(db): replace unstable float cursor with keyset pagination for hot-sort feed

Fixes DB-M3: the hot-score cursor was a computed float from now() that shifted
between page fetches, causing missed and repeated posts. New cursor uses stable
(resonate_count, created_at, id) keyset semantics."
```

---

## Self-Review

**Spec coverage:**
- DB-C1 (soul knock atomic): Task 3 ✓
- DB-C2 (requirePlan race): Task 2 ✓
- DB-C4 (user_plans uuid): Task 7 ✓
- DB-C5 (saveMatchesForUser): Task 1 ✓
- DB-H1 (togglePulseReaction): Task 5 ✓
- DB-H2 (flagPulsePost): Task 5 ✓
- DB-H3 (intros index): Task 7 ✓
- DB-H4 (createPulseReply): Task 5 ✓
- DB-M1 (upsertProfile): Task 4 ✓
- DB-M2 (ssl): Task 6 ✓
- DB-M3 (hot cursor): Task 9 ✓
- DB-M4 (seen_matches TTL): Task 8 ✓
- DB-L1 (stripe_events): Task 8 ✓
- DB-L2 (usage_counters): Task 8 ✓
- DB-L3 (jsonb columns): Not covered — added as follow-up note below.

**DB-L3 Note (JSON→jsonb columns):** This is a large schema migration affecting `matches.match_data`, `profiles.dealbreakers`, `profiles.coreValues`, `intros.icebreakers`, etc. Requires a data migration step per column and is risky to run hot. Recommend scheduling as a separate sprint item after the P1 fixes are stable.
