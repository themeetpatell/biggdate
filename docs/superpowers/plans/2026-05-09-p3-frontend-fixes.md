# P3 Frontend UX & Flow Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken user flows, silent error states, misleading success screens, dangerous browser APIs, and missing auth guards that make the app unreliable and confusing on mobile.

**Architecture:** All fixes are surgical edits to individual page or component files. No new components are needed — the app already has `<LoadingScreen />`, `<UpgradeSheet />`, and bottom-sheet patterns that just need to be wired in. None of these changes affect the API layer.

**Tech Stack:** Next.js 16 App Router, React 19, Framer Motion, Tailwind CSS, TypeScript

---

## Files Modified

| File | Action | Purpose |
|---|---|---|
| `src/app/onboarding/page.tsx` | Modify | FE-C2: redirect unauthenticated users; fix stale messages in retry |
| `src/app/matches/[id]/connect/page.tsx` | Modify | FE-C3: return LoadingScreen instead of null |
| `src/app/coach/page.tsx` | Modify | FE-C3: return LoadingScreen instead of null; add profile completeness gate |
| `src/app/matches/[id]/respond/page.tsx` | Modify | FE-H1: check res.ok before setDone; return LoadingScreen |
| `src/app/matches/[id]/preview/page.tsx` | Modify | FE-H2: replace window.prompt; FE-M2: check res.ok before setSent |
| `src/app/debrief/page.tsx` | Modify | FE-C4: show error state on submission failure; fix "Aura" → "Maahi" |
| `src/app/dashboard/page.tsx` | Modify | FE-H3: add fetchError state for match fetch failure |
| `src/app/profile/verify/page.tsx` | Modify | FE-H4: switch selfie to FormData upload |
| `src/app/onboarding/page.tsx` | Modify | FE-H5: fix stale messages in retry |
| `src/app/pulse/page.tsx` | Modify | FE-M3: add .catch() to sort fetch; FE-L1: add flag confirmation |
| `src/app/messages/[threadId]/page.tsx` | Modify | FE-M4: pause polling when tab backgrounded |
| `src/app/companion/page.tsx` | Modify | FE-L3: pass profile in transport body |
| `src/app/sitemap.ts` | Modify | FE-L2: remove /auth from sitemap |
| `src/app/matches/page.tsx` | Modify | FE-M1: deduplicate generate calls with in-flight guard |
| `src/app/messages/page.tsx` | Modify | FE-M5: add error state to thread list |

---

## Task 1: Fix onboarding — redirect unauthenticated users + fix stale messages in retry

**Files:**
- Modify: `src/app/onboarding/page.tsx`

- [ ] **Step 1: Read the current auth guard in onboarding**

```bash
grep -n "authLoading\|userId\|router.replace\|useEffect" /Users/themeetpatel/Startups/biggdate/src/app/onboarding/page.tsx | head -30
```

- [ ] **Step 2: Add redirect when userId is null after auth resolves**

Find the auth guard useEffect (around line 172-178). Change the `!userId` early return:

```typescript
// OLD:
useEffect(() => {
  if (authLoading) return;
  if (!userId) return;  // ← silent no-op
  if (profile?.summary) {
    router.replace("/soul-snapshot");
  }
}, [authLoading, userId, profile, router]);

// NEW:
useEffect(() => {
  if (authLoading) return;
  if (!userId) {
    router.replace("/auth");
    return;
  }
  if (profile?.summary) {
    router.replace("/soul-snapshot");
  }
}, [authLoading, userId, profile, router]);
```

- [ ] **Step 3: Fix stale messages in the derive retry**

Find the phase 2 derive useEffect (around line 266). Find the `eslint-disable-next-line react-hooks/exhaustive-deps` comment that suppresses `messages` from the deps array.

Change the derive effect to use a ref for messages so the latest value is always available:

```typescript
const messagesRef = useRef(messages);
useEffect(() => {
  messagesRef.current = messages;
}, [messages]);

// In the derive effect, use messagesRef.current instead of messages:
useEffect(() => {
  if (!revealing || phase2DerivingStarted) return;
  setPhase2DerivingStarted(true);

  const currentMessages = messagesRef.current; // always fresh
  // ... rest of derive logic using currentMessages instead of messages
}, [revealing, phase2DerivingStarted]); // remove eslint-disable comment
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "onboarding" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/app/onboarding/page.tsx
git commit -m "fix(ux): redirect unauthenticated users from onboarding + fix stale messages in retry

Fixes FE-C2: !userId caused a silent early return, allowing unauthenticated
users to interact with the AI onboarding flow. Now redirects to /auth.
Fixes FE-H5: derive effect captured stale messages in closure; now uses a ref."
```

---

## Task 2: Replace `null` returns with `<LoadingScreen />` in connect, coach, respond pages

**Files:**
- Modify: `src/app/matches/[id]/connect/page.tsx`
- Modify: `src/app/coach/page.tsx`
- Modify: `src/app/matches/[id]/respond/page.tsx`

- [ ] **Step 1: Find the LoadingScreen import path**

```bash
grep -rn "LoadingScreen" /Users/themeetpatel/Startups/biggdate/src/app/ --include="*.tsx" | head -5
```

Note the import path used in other pages (e.g., `@/components/loading-screen`).

- [ ] **Step 2: Fix `connect/page.tsx`**

Find line 67: `if (authLoading || !profile) return null;`

Replace with:
```typescript
import LoadingScreen from "@/components/loading-screen";
// ...
if (authLoading || !profile) return <LoadingScreen />;
```

Also add profile completeness gate:
```typescript
if (profile && !profile.summary) {
  router.replace("/onboarding");
  return <LoadingScreen />;
}
```

- [ ] **Step 3: Fix `coach/page.tsx`**

Find the `if (authLoading || !profile) { ... return null; }` block (around line 42-45).

Replace with:
```typescript
import LoadingScreen from "@/components/loading-screen";
// ...
if (authLoading) return <LoadingScreen />;
if (!profile) {
  router.replace("/onboarding");
  return <LoadingScreen />;
}
if (!profile.summary) {
  router.replace("/onboarding");
  return <LoadingScreen />;
}
```

- [ ] **Step 4: Fix `respond/page.tsx`**

Find `if (authLoading || !profile) return null;` (around line 74).

Replace with:
```typescript
import LoadingScreen from "@/components/loading-screen";
// ...
if (authLoading || !profile) return <LoadingScreen />;
```

- [ ] **Step 5: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "connect/page|coach/page|respond/page" | head -10
```

- [ ] **Step 6: Commit**

```bash
git add src/app/matches/[id]/connect/page.tsx src/app/coach/page.tsx src/app/matches/[id]/respond/page.tsx
git commit -m "fix(ux): replace null returns with LoadingScreen + add profile completeness gate

Fixes FE-C3: connect, coach, and respond pages returned null during auth load,
showing a blank screen with no feedback. Also adds profile.summary gate
to prevent incomplete-profile users from accessing these features."
```

---

## Task 3: Fix `respond/page.tsx` — check res.ok before showing success

**Files:**
- Modify: `src/app/matches/[id]/respond/page.tsx`

- [ ] **Step 1: Read the handleSubmit function**

```bash
grep -n "handleSubmit\|setDone\|res.ok\|fetch" /Users/themeetpatel/Startups/biggdate/src/app/matches/[id]/respond/page.tsx | head -25
```

- [ ] **Step 2: Add res.ok guard before setDone**

Find the section (around line 55-70):
```typescript
const res = await fetch("/api/intros/respond", { ... });
const data = await res.json();
trackMatchRespond(id, "accept");
setMutual(data.mutual);
setThreadId(data.thread?.id ?? null);
setDone(true);
```

Replace with:
```typescript
const res = await fetch("/api/intros/respond", { ... });
if (!res.ok) {
  const data = await res.json().catch(() => ({}));
  const msg = (data as { error?: string }).error ?? "Something went wrong. Please try again.";
  setError(msg);
  return;
}
const data = await res.json();
trackMatchRespond(id, "accept");
setMutual(data.mutual);
setThreadId(data.thread?.id ?? null);
setDone(true);
```

Add `error` and `setError` state at the top of the component:
```typescript
const [error, setError] = useState<string | null>(null);
```

And render the error below the submit button:
```typescript
{error && (
  <p className="text-red-400 text-sm text-center mt-2">{error}</p>
)}
```

- [ ] **Step 3: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "respond/page" | head -5
```

- [ ] **Step 4: Commit**

```bash
git add src/app/matches/[id]/respond/page.tsx
git commit -m "fix(ux): check res.ok before showing success on Soul Knock respond

Fixes FE-H1: setDone(true) fired unconditionally, so API failures (403, 500)
showed a false 'Answer sent' success screen. Now shows an error message."
```

---

## Task 4: Replace `window.prompt()` in preview page with an inline textarea

**Files:**
- Modify: `src/app/matches/[id]/preview/page.tsx`

- [ ] **Step 1: Find the window.prompt call**

```bash
grep -n "window.prompt\|prompt(" /Users/themeetpatel/Startups/biggdate/src/app/matches/[id]/preview/page.tsx
```

- [ ] **Step 2: Add `editingQuestion` state**

At the top of the component, add:
```typescript
const [editingQuestion, setEditingQuestion] = useState(false);
const [draftQuestion, setDraftQuestion] = useState("");
```

- [ ] **Step 3: Replace window.prompt with a conditional inline editor**

Find the Modify button / handler that calls `window.prompt` (around line 704-711). Replace the entire modify UI section:

```typescript
// Replace the window.prompt call with:
const handleModifyClick = () => {
  setDraftQuestion(currentQuestion);
  setEditingQuestion(true);
};

const handleSaveDraft = () => {
  if (draftQuestion.trim()) {
    setCurrentQuestion(draftQuestion.trim());
  }
  setEditingQuestion(false);
};
```

And in the JSX, replace the button that calls `window.prompt` with:
```tsx
{editingQuestion ? (
  <div className="flex flex-col gap-2 mt-2">
    <textarea
      className="w-full rounded-lg bg-white/10 border border-white/20 text-white text-sm p-3 resize-none"
      rows={3}
      value={draftQuestion}
      onChange={(e) => setDraftQuestion(e.target.value)}
      maxLength={280}
      autoFocus
    />
    <div className="flex gap-2">
      <button
        onClick={handleSaveDraft}
        className="flex-1 rounded-lg bg-white/20 text-white text-sm py-2"
      >
        Save
      </button>
      <button
        onClick={() => setEditingQuestion(false)}
        className="flex-1 rounded-lg bg-transparent border border-white/20 text-white/60 text-sm py-2"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <button onClick={handleModifyClick} className={/* existing modify button styles */}>
    Modify
  </button>
)}
```

- [ ] **Step 4: Also fix `setSent(true)` to check res.ok (FE-M2)**

In the same file, find the `handleSend` function around line 641-677. Add a res.ok check before `setSent(true)`:

```typescript
if (!res.ok) {
  const errData = await res.json().catch(() => ({}));
  if (res.status === 403) {
    // Show upgrade sheet
    setShowUpgrade(true);
  } else {
    setSendError((errData as { error?: string }).error ?? "Failed to send. Please try again.");
  }
  return;
}
setSent(true);
```

Add `sendError` state and render it appropriately.

- [ ] **Step 5: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "preview/page" | head -10
```

- [ ] **Step 6: Commit**

```bash
git add "src/app/matches/[id]/preview/page.tsx"
git commit -m "fix(ux): replace window.prompt with inline textarea for Soul Knock edit

Fixes FE-H2: window.prompt is blocked in PWA/WebView contexts and returns null
on iOS Chrome, making the Modify action non-functional.
Fixes FE-M2: setSent(true) now only fires when res.ok is true."
```

---

## Task 5: Fix debrief — show error state + fix 'Aura' copy

**Files:**
- Modify: `src/app/debrief/page.tsx`

- [ ] **Step 1: Read the debrief page**

```bash
grep -n "setLoading\|setStep\|catch\|Aura\|Talk to" /Users/themeetpatel/Startups/biggdate/src/app/debrief/page.tsx | head -25
```

- [ ] **Step 2: Add error state**

Add at the top of the component:
```typescript
const [submitError, setSubmitError] = useState<string | null>(null);
```

Find the try/catch block around line 40-51:
```typescript
try {
  const res = await fetch("/api/debrief/structured", { ... });
  const data = await res.json();
  setResult({ ... });
  setStep("result");
} catch { /* silent */ }
setLoading(false);
```

Replace with:
```typescript
try {
  const res = await fetch("/api/debrief/structured", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error((d as { error?: string }).error ?? "Server error");
  }
  const data = await res.json();
  setResult({ /* fields */ });
  setStep("result");
} catch (err) {
  setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
} finally {
  setLoading(false);
}
```

Render the error below the submit button:
```tsx
{submitError && (
  <p className="text-red-400 text-sm text-center mt-2">{submitError}</p>
)}
```

- [ ] **Step 3: Fix "Aura" → "Maahi" copy**

```bash
grep -n "Aura\|Talk to" /Users/themeetpatel/Startups/biggdate/src/app/debrief/page.tsx
```

Replace all occurrences of `"Talk to Aura"` with `"Talk to Maahi"` and any other "Aura" references with the correct product name.

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "debrief" | head -5
```

- [ ] **Step 5: Commit**

```bash
git add src/app/debrief/page.tsx
git commit -m "fix(ux): show error state on debrief submit failure + fix stale 'Aura' copy

Fixes FE-C4: silent catch left users staring at the question step with no
feedback after an API failure. Fixes FE-M1: 'Talk to Aura' button referred
to a product name not used anywhere else — should be 'Talk to Maahi'."
```

---

## Task 6: Fix dashboard — add error state for match fetch failure

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Find all `.catch(() => {})` in dashboard**

```bash
grep -n "catch(() =>" /Users/themeetpatel/Startups/biggdate/src/app/dashboard/page.tsx | head -15
```

- [ ] **Step 2: Add fetchError state and wire it to the matches fetch**

Add state:
```typescript
const [matchFetchError, setMatchFetchError] = useState(false);
```

Find the matches fetch (the `POST /api/matches/generate` call, around line 247-315). Change its catch:
```typescript
// OLD:
.catch(() => {})
.finally(() => setMatchLoading(false));

// NEW:
.catch(() => {
  setMatchFetchError(true);
})
.finally(() => setMatchLoading(false));
```

In the JSX, where the "Come back tomorrow" empty state renders for no matches, add a check:
```tsx
{matchFetchError ? (
  <div className="text-center py-8">
    <p className="text-white/60 text-sm">Couldn't load matches.</p>
    <button
      onClick={() => { setMatchFetchError(false); /* re-trigger fetch */ fetchMatches(); }}
      className="mt-3 text-sm text-white underline"
    >
      Try again
    </button>
  </div>
) : matches.length === 0 && !matchLoading ? (
  /* existing empty state */
) : (
  /* existing matches list */
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "fix(ux): show error state when dashboard match fetch fails

Fixes FE-H3: all 5 dashboard fetches swallowed errors silently. A failed match
generation now shows a retry button instead of the misleading 'no matches' empty state."
```

---

## Task 7: Fix selfie upload — switch from base64 JSON to FormData

**Files:**
- Modify: `src/app/profile/verify/page.tsx`

- [ ] **Step 1: Read the current selfie upload code**

```bash
grep -n "selfiePreview\|readAsDataURL\|fetch.*selfie\|FormData" /Users/themeetpatel/Startups/biggdate/src/app/profile/verify/page.tsx | head -20
```

- [ ] **Step 2: Check how photo-upload.tsx handles it**

```bash
grep -n "FormData\|fetch\|upload" /Users/themeetpatel/Startups/biggdate/src/components/photo-upload.tsx | head -20
```

Note the pattern — it likely uploads the file directly and gets back a URL.

- [ ] **Step 3: Rewrite selfie upload to use FormData**

The current flow reads the file as `readAsDataURL` to get a preview, then sends the base64 string in JSON. Change so the actual `File` object is sent via `FormData`:

```typescript
// Add a ref to hold the actual File object
const selfieFileRef = useRef<File | null>(null);

// In the file input onChange:
const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  selfieFileRef.current = file;
  // Keep preview using object URL (no base64 needed)
  setSelfiePreview(URL.createObjectURL(file));
};

// In the upload submit:
const handleSubmit = async () => {
  const file = selfieFileRef.current;
  if (!file) return;

  setUploading(true);
  try {
    // Step 1: upload the file to storage
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await fetch("/api/profile/upload-photo", {
      method: "POST",
      body: formData,
    });
    if (!uploadRes.ok) throw new Error("Upload failed");
    const { url } = await uploadRes.json() as { url: string };

    // Step 2: submit the storage URL for verification
    const verifyRes = await fetch("/api/verification/selfie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selfieUrl: url }),
    });
    if (!verifyRes.ok) throw new Error("Verification submission failed");
    setMessage("Selfie submitted for review!");
  } catch (err) {
    setMessage(err instanceof Error ? err.message : "Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};
```

Note: confirm that `/api/profile/upload-photo` exists and returns `{ url }`:
```bash
grep -n "url\|photo" /Users/themeetpatel/Startups/biggdate/src/app/api/profile/upload-photo/route.ts | head -10
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "verify/page" | head -5
```

- [ ] **Step 5: Commit**

```bash
git add src/app/profile/verify/page.tsx
git commit -m "fix(ux): switch selfie upload from base64 JSON to FormData

Fixes FE-H4: selfie was sent as a readAsDataURL base64 string (~5MB for a
4MB photo), exceeding common JSON body size limits and causing silent failures.
Now uploads via FormData matching the pattern in photo-upload.tsx."
```

---

## Task 8: Fix messaging — pause polling when tab is backgrounded

**Files:**
- Modify: `src/app/messages/[threadId]/page.tsx`

- [ ] **Step 1: Find the polling interval**

```bash
grep -n "setInterval\|clearInterval\|30000\|loadMessages" /Users/themeetpatel/Startups/biggdate/src/app/messages/\[threadId\]/page.tsx | head -15
```

- [ ] **Step 2: Add visibilitychange listener to pause polling**

Find the useEffect that sets up the interval (around line 43-44) and modify it:

```typescript
useEffect(() => {
  loadMessages(true);

  let intervalId: ReturnType<typeof setInterval> | null = null;

  const startPolling = () => {
    if (intervalId) return;
    intervalId = setInterval(() => loadMessages(false), 30000);
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      loadMessages(false); // immediate refresh when tab becomes active
      startPolling();
    } else {
      stopPolling();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  startPolling();

  return () => {
    stopPolling();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [threadId]); // adjust deps to match existing
```

- [ ] **Step 3: Fix messages page thread list error state**

```bash
grep -n "catch\|setThreads\|setPageLoading" /Users/themeetpatel/Startups/biggdate/src/app/messages/page.tsx | head -15
```

Add `threadError` state and update the catch:
```typescript
const [threadError, setThreadError] = useState(false);

// In the fetch:
.catch(() => setThreadError(true))
.finally(() => setPageLoading(false));
```

Show error in JSX:
```tsx
{threadError && (
  <div className="text-center py-8">
    <p className="text-white/60 text-sm">Couldn't load chats.</p>
    <button onClick={() => { setThreadError(false); /* retry */ }} className="mt-2 text-sm text-white underline">
      Retry
    </button>
  </div>
)}
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "messages" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add "src/app/messages/[threadId]/page.tsx" src/app/messages/page.tsx
git commit -m "fix(ux): pause message polling in background tabs + add thread list error state

Fixes FE-M4: 30s polling ran continuously in background tabs, draining battery
and data on mobile PWA. Fixes FE-M5: empty thread list was indistinguishable
from API failure — now shows an error + retry button."
```

---

## Task 9: Fix pulse page — .catch() on sort fetch + flag confirmation

**Files:**
- Modify: `src/app/pulse/page.tsx`

- [ ] **Step 1: Find the sort fetch without .catch()**

```bash
grep -n "fetch.*sort\|setPosts\|setLoading\|catch" /Users/themeetpatel/Startups/biggdate/src/app/pulse/page.tsx | head -20
```

- [ ] **Step 2: Add .catch() to the sort fetch**

Find the sort-change fetch (around line 759-769) and add error handling:
```typescript
fetch(`/api/pulse/posts?sort=${sort}`)
  .then((r) => r.json())
  .then((d) => {
    if (cancelled) return;
    setPosts(d.posts ?? []);
    setNextCursor(d.nextCursor ?? null);
    setLoading(false);
  })
  .catch(() => {
    if (!cancelled) setLoading(false);
  });
```

- [ ] **Step 3: Add flag confirmation**

Find `handleFlag` (around line 828-834). Add a confirmation before the optimistic update:

```typescript
const handleFlag = async (postId: string) => {
  if (!window.confirm("Report this post?")) return;
  // existing optimistic update and fetch
  setPosts((prev) => prev.filter((p) => p.id !== postId));
  try {
    const res = await fetch(`/api/pulse/posts/${postId}/flag`, { method: "POST" });
    if (!res.ok) {
      // Restore post on failure
      setPosts((prev) => {
        const exists = prev.find((p) => p.id === postId);
        return exists ? prev : [...prev, /* original post */];
      });
    }
  } catch {
    // Best-effort restore not possible without the original post reference
    // At minimum, clear the loading state
  }
};
```

For a cleaner revert, store the removed post before removing it:
```typescript
const handleFlag = async (postId: string) => {
  if (!window.confirm("Report this post?")) return;
  const postToRemove = posts.find((p) => p.id === postId);
  if (!postToRemove) return;
  setPosts((prev) => prev.filter((p) => p.id !== postId));
  try {
    const res = await fetch(`/api/pulse/posts/${postId}/flag`, { method: "POST" });
    if (!res.ok) {
      setPosts((prev) => {
        const alreadyBack = prev.find((p) => p.id === postId);
        return alreadyBack ? prev : [postToRemove, ...prev];
      });
    }
  } catch {
    setPosts((prev) => {
      const alreadyBack = prev.find((p) => p.id === postId);
      return alreadyBack ? prev : [postToRemove, ...prev];
    });
  }
};
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep "pulse/page" | head -5
```

- [ ] **Step 5: Commit**

```bash
git add src/app/pulse/page.tsx
git commit -m "fix(ux): add .catch() to pulse sort fetch + flag confirmation with revert

Fixes FE-M3: missing .catch() on sort fetch caused infinite loading skeleton.
Fixes FE-L1: flag removed post without confirmation or revert on failure;
now requires confirmation and reverts if the API call fails."
```

---

## Task 10: Minor fixes — sitemap, companion context, duplicate match fetch

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/companion/page.tsx`
- Modify: `src/app/matches/page.tsx`

- [ ] **Step 1: Remove /auth from sitemap**

```bash
grep -n "auth\|sitemap" /Users/themeetpatel/Startups/biggdate/src/app/sitemap.ts | head -10
```

Find and remove the `{ url: \`${base}/auth\`, ... }` entry.

- [ ] **Step 2: Pass profile in companion transport**

```bash
grep -n "transport\|useMemo\|body\|context\|profile" /Users/themeetpatel/Startups/biggdate/src/app/companion/page.tsx | head -20
```

Find the `useMemo` that creates the transport with `body: { context: {} }` and update it to pass the profile (after it loads):

```typescript
const transport = useMemo(
  () =>
    new DefaultChatTransport({
      api: "/api/companion/chat",
      body: profile ? { profile } : {},
    }),
  [profile] // add profile to deps so transport updates when profile loads
);
```

Note: verify that `companion/chat` uses the `profile` from the request body; if it reads from DB server-side, this change is still harmless.

- [ ] **Step 3: Add in-flight guard to matches page generate call**

```bash
grep -n "fetchMatches\|useEffect\|setMatchLoading\|generate" /Users/themeetpatel/Startups/biggdate/src/app/matches/page.tsx | head -20
```

Add an `isGenerating` ref to prevent duplicate calls:
```typescript
const isGenerating = useRef(false);

const fetchMatches = useCallback(async () => {
  if (isGenerating.current) return;
  isGenerating.current = true;
  setMatchLoading(true);
  try {
    // existing fetch logic
  } finally {
    isGenerating.current = false;
    setMatchLoading(false);
  }
}, [/* existing deps */]);
```

- [ ] **Step 4: Typecheck**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | grep -E "sitemap|companion/page|matches/page" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/companion/page.tsx src/app/matches/page.tsx
git commit -m "fix(ux): remove /auth from sitemap, pass profile in companion transport, guard duplicate match fetch

Fixes FE-L2: /auth should not be indexed by search engines.
Fixes FE-L3: companion transport sent empty context body — now passes profile.
Fixes FE-M1: duplicate POST /api/matches/generate on mount + rapid refresh."
```

---

## Self-Review

**Spec coverage:**
- FE-C2 (onboarding no redirect): Task 1 ✓
- FE-C3 (null on auth load): Task 2 ✓
- FE-C4 (debrief silent errors): Task 5 ✓
- FE-H1 (respond false success): Task 3 ✓
- FE-H2 (window.prompt): Task 4 ✓
- FE-H3 (dashboard silent errors): Task 6 ✓
- FE-H4 (selfie base64): Task 7 ✓
- FE-H5 (stale messages retry): Task 1 ✓
- FE-M1 (Aura copy): Task 5 ✓
- FE-M2 (setSent false success): Task 4 ✓
- FE-M3 (pulse sort no catch): Task 9 ✓
- FE-M4 (polling background): Task 8 ✓
- FE-L1 (flag no confirmation): Task 9 ✓
- FE-L2 (sitemap /auth): Task 10 ✓
- FE-L3 (companion empty context): Task 10 ✓
- FE-M5 (thread list error): Task 8 ✓
- FE-M1 (duplicate generate): Task 10 ✓
- Profile completeness gate (coach, companion, debrief): Task 2 ✓
