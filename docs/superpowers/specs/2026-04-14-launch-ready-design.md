# BiggDate — Launch-Ready Design Spec
**Date:** 2026-04-14  
**Status:** Approved  
**Scope:** 6 systems required for public launch

---

## Overview

Six independent systems need to be built or fixed before BiggDate can launch publicly:

1. Real User Matching Engine
2. Feature Gates (tier enforcement)
3. Staged Messaging (Soul Knock → Chat)
4. Photo Unlock
5. Safety (Block + Report)
6. Email Notifications

Implementation order follows dependency: matching must exist before messaging, photos, or gates can be properly tested.

---

## System 1 — Real User Matching Engine

### Decision
Replace AI-generated fictional profiles with real user-to-real user matching. Maahi still generates the narrative/compatibility copy, but it does so by analysing two real profiles together.

### Data Flow
1. User opens dashboard → `POST /api/matches/generate`
2. Check today's cache → return immediately if hit
3. **Hard filter** — query all profiles from Supabase:
   - Exclude self
   - Exclude already-seen matches (via `seen_matches` table)
   - Exclude blocked users (either direction)
   - Filter by `partnerGender`, `partnerAgeMin`, `partnerAgeMax`
4. **Thin pool handling:**
   - 0 real candidates → return `{ matches: [], poolEmpty: true }`
   - 1–2 candidates → pass all (no padding with fake profiles)
   - 3+ candidates → pick up to 5 by `created_at DESC` (newest users seen first)
5. **Single AI call** — send current user's full profile + all candidate profiles → Maahi returns up to 3 match objects using the existing `Match` shape, populated from real profile data
6. Save to DB + cache for today

### Pool Empty State (Dashboard)
When `poolEmpty: true`, show a "Maahi is still building your pool" card instead of sealed match cards. No fake profiles ever shown.

### Schema Changes
```sql
-- Track who a user has already been matched with
CREATE TABLE seen_matches (
  user_id      uuid REFERENCES auth.users,
  matched_user_id uuid REFERENCES auth.users,
  matched_date date,
  PRIMARY KEY (user_id, matched_user_id)
);

-- Block relationships (used in matching filter)
CREATE TABLE blocked_users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES auth.users,
  blocked_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

-- Add matched_user_id to existing matches table
ALTER TABLE matches ADD COLUMN matched_user_id uuid REFERENCES auth.users;
ALTER TABLE matches ADD COLUMN photos_unlocked boolean DEFAULT false;
```

### Match Generation Prompt Change
Current prompt generates fictional people. New prompt receives:
- `userProfile` — the requesting user's full profile
- `candidates[]` — array of real profiles (up to 5)

Maahi selects the best 3 from candidates and generates narrative, compatibility signals, friction point, and opening question for each. The `name`, `age`, `city`, `profession` fields come from real profile data, not invented.

---

## System 2 — Feature Gates

### Decision
Full enforcement of all tier limits on every gated API route.

### Limits

| Action | Free | Premium | Pro |
|---|---|---|---|
| Daily matches shown | 5 | 20 | Unlimited |
| Soul Knock requests sent | 3/day | 15/day | Unlimited |
| Maahi companion sessions | 3/week | 15/week | Unlimited |
| Life Preview | Blocked | 2/month | Unlimited |
| See who liked you | Blocked | ✓ | ✓ |

### Schema
```sql
CREATE TABLE usage_counters (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users,
  action       text,  -- 'soul_knock' | 'maahi_session' | 'life_preview'
  count        integer DEFAULT 0,
  period_start date,
  UNIQUE (user_id, action, period_start)
);
```

### Server Utility
`requirePlan(userId, action)` — checks user's tier from `user_plans` + current usage from `usage_counters`. Returns `{ allowed: boolean, limit: number, used: number }`. Called at the top of every gated route handler.

### Frontend Behaviour
- Gated UI elements render normally but show the existing upgrade sheet on tap when user is on free tier
- No redirects — inline upgrade prompt only
- `GET /api/intros/received` returns `{ locked: true }` for free users → upgrade sheet

---

## System 3 — Staged Messaging

### Decision
Soul Knock exchange is required before full chat opens. Direct chat is the last gate.

### Flow
1. User A sends a Soul Knock question → saved via existing `/api/intros/request`
2. User B receives email notification + sees "Waiting for you" in their matches list
3. User B visits `/matches/[id]/respond` → answers the question (max 280 chars)
4. `POST /api/intros/respond` saves the answer → checks if User A has also answered
5. If both answered → thread is created, both receive email: "You're connected"
6. `/messages` inbox shows active threads; `/messages/[threadId]` is the chat view
7. Chat polls every 30s when open (no WebSocket for v1)
8. Unread count badge appears on the matches tab nav icon

### Schema
```sql
CREATE TABLE soul_knock_responses (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro_id  uuid REFERENCES intros,
  user_id   uuid REFERENCES auth.users,
  response  text CHECK (char_length(response) <= 280),
  created_at timestamptz DEFAULT now(),
  UNIQUE (intro_id, user_id)
);

CREATE TABLE threads (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id  uuid REFERENCES auth.users,
  user_b_id  uuid REFERENCES auth.users,
  intro_id   uuid REFERENCES intros,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid REFERENCES threads,
  sender_id  uuid REFERENCES auth.users,
  body       text,
  created_at timestamptz DEFAULT now(),
  read_at    timestamptz
);
```

### New Routes
- `POST /api/intros/respond` — save Soul Knock answer; create thread if mutual
- `GET /api/messages` — list all threads for current user with last message + unread count
- `GET /api/messages/[threadId]` — fetch message history
- `POST /api/messages/[threadId]` — send a message
- `GET /api/intros/received` — Soul Knocks sent to current user (gated by plan for "see who liked you")

### New Pages
- `/matches/[id]/respond` — Soul Knock answer page for User B
- `/messages` — inbox
- `/messages/[threadId]` — chat view

---

## System 4 — Photo Unlock

### Decision
Photos unlock only after mutual intention (both users have sent a Soul Knock). All photos visible once chat opens.

### Logic
- Match cards and preview: show emoji/gradient avatar until `photos_unlocked = true`
- `photos_unlocked` is set to `true` on the `matches` row for both users when both Soul Knocks are exchanged (inside `/api/intros/respond` mutual check)
- `/api/matches` GET response includes `photosUnlocked: boolean` and `photos: string[]` (empty until unlocked)
- Chat header shows first photo once thread exists
- No new storage needed — photos already on `Profile.photos[]` in Supabase Storage

---

## System 5 — Safety (Block + Report)

### Decision
Block removes the user from your pool immediately. Report writes a record for manual admin review via Supabase dashboard.

### Trigger Points
Report option appears in:
- Revealed match card (⋯ menu)
- Match preview page (⋯ menu top-right)
- Chat view (⋯ menu)

### Report Flow
1. Tap ⋯ → "Report or Block"
2. Bottom sheet: reason options (`Fake profile`, `Inappropriate content`, `Harassment`, `Other`)
3. Submit → block fires immediately + report row written
4. User disappears from matches; today's cache invalidated

### Schema
```sql
-- blocked_users already defined in System 1

CREATE TABLE reports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  uuid REFERENCES auth.users,
  reported_id  uuid REFERENCES auth.users,
  reason       text,
  extra_notes  text,
  created_at   timestamptz DEFAULT now()
);

-- Supabase view for quick admin triage
CREATE VIEW flagged_users AS
  SELECT reported_id, count(*) as report_count
  FROM reports
  GROUP BY reported_id
  HAVING count(*) >= 3;
```

### New Routes
- `POST /api/safety/block` — inserts into `blocked_users`, invalidates match cache
- `POST /api/safety/report` — calls block logic then inserts into `reports`

---

## System 6 — Email Notifications

### Provider
Resend (simple API, generous free tier, works natively with Next.js).

### Triggers

| Event | When fired | Subject |
|---|---|---|
| Daily matches ready | After match generation completes | "Your matches are waiting, [name]" |
| Soul Knock received | After `/api/intros/request` succeeds | "[Name] sent you a Soul Knock" |
| Soul Knock answered | After `/api/intros/respond` saves response | "[Name] answered your question" |
| Mutual match (chat unlocked) | After thread is created | "You and [Name] are connected" |

### Implementation
- `POST /api/notifications/email` — internal server-side route, not exposed to client
- Called after main DB write in each trigger route
- Simple HTML templates: BiggDate dark theme, one CTA button, ≤4 lines of copy
- Unsubscribe preference stored in profile: `notification_preferences jsonb` column
  - Keys: `matchReady`, `soulKnock`, `mutualMatch` (all default `true`)

---

## Database Migration Summary

All schema changes applied via a single Supabase migration file:
- `seen_matches` (new)
- `blocked_users` (new)
- `soul_knock_responses` (new)
- `threads` (new)
- `messages` (new)
- `usage_counters` (new)
- `reports` (new)
- `flagged_users` view (new)
- `matches` table: add `matched_user_id`, `photos_unlocked` columns
- `profiles` table: add `notification_preferences` jsonb column

---

## Implementation Order

1. Database migration (all tables at once)
2. Real user matching engine (unblocks everything else)
3. Feature gates + usage counters
4. Soul Knock respond flow + thread creation
5. Messages inbox + chat view
6. Photo unlock (wired into respond flow)
7. Safety routes + report UI
8. Email notifications (Resend integration)
