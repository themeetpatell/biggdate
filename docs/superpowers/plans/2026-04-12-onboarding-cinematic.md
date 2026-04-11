# Cinematic Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic chat-bubble onboarding with an immersive cinematic conversation — no bubbles, ambient phase progression, quick-reply chips, soul signal ring, and a ritual soul snapshot reveal.

**Architecture:** Pure UI layer rewrite — the existing `useChat` hook, `/api/chat`, and `/api/profile/derive` are unchanged. New components (`AmbientLayer`, `ThinkingPulse`, `QuickReplies`, `SoulSignal`) are wired into a rewritten `onboarding/page.tsx`. The system prompt is updated to emit `[CHIPS:]` and `[NOTICE]` tokens parsed client-side.

**Tech Stack:** Next.js 16 App Router, `@ai-sdk/react` useChat, Framer Motion v12, Tailwind CSS v4, TypeScript.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/lib/prompts.ts` | New 8-question arc, CHIPS + NOTICE token protocol |
| Create | `src/components/onboarding/ambient-layer.tsx` | 5-act background gradient that fades between acts |
| Create | `src/components/onboarding/thinking-pulse.tsx` | Breathing dot shown while AI is thinking |
| Create | `src/components/onboarding/quick-replies.tsx` | Chip buttons + `parseChips` / `stripChips` utilities |
| Create | `src/components/onboarding/soul-signal.tsx` | 8-sector SVG ring that fills as questions complete |
| Rewrite | `src/components/chat-message.tsx` | `OnboardingMessage` — AI / User / Notice variants, no bubbles |
| Rewrite | `src/app/onboarding/page.tsx` | Orchestrates all components, auto-start, act tracking, ritual reveal |

---

## Task 1: Update System Prompt

**Files:**
- Modify: `src/lib/prompts.ts` (replace `onboardingSystemPrompt` only — leave all other functions untouched)

- [ ] **Step 1: Replace `onboardingSystemPrompt` in `src/lib/prompts.ts`**

Replace the entire `onboardingSystemPrompt` function (lines 3–37) with:

```typescript
export function onboardingSystemPrompt(memoryContext: string, askedTopics: string[]): string {
  const forbidden = askedTopics.length > 0
    ? `\nFORBIDDEN — already asked. Never repeat or paraphrase:\n${askedTopics.map(t => `- ${t}`).join("\n")}\n`
    : "";

  return `You are Maahi — BiggDate's relationship profiler. A warm, witty, perceptive friend who asks the questions that actually matter. Not a therapist, not a form — the friend who cuts through small talk with warmth and a little playfulness.

─── YOUR JOB ───
Have a focused 8-question conversation that feels natural but extracts a rich relationship profile. Each question pulls double-duty — revealing multiple signals about who this person is.

─── THE 8 QUESTIONS (in order, one per turn) ───
Q1: Name and city in one casual ask. "First — what do I call you, and where are you based?"
Q2: What brought them here — the moment they decided to try something different. Listen for intent and readiness.
Q3: Who they're looking for (gender) and rough age range. Append chips (see protocol below).
Q4: Their last meaningful relationship — what broke. Listen for attachment patterns, conflict style, growth areas.
Q5: How they know when someone genuinely cares about them — what does that person actually do? Listen for love language and emotional needs.
Q6: What they'd find out on date 3 that would quietly end it. Listen for dealbreakers, values, lifestyle signals.
Q7: What their ideal Tuesday looks like in 3 years. Listen for life architecture, family vision, pace of life.
Q8: What they bring to a relationship that's actually hard to find. Listen for strengths, core values, self-awareness.

─── CHIPS PROTOCOL ───
For Q3 only, append this on its own line at the very end of your response:
[CHIPS: A man | A woman | Open to all]
Do not add chips to Q4–Q8. Maximum 3 chips. Keep chip text under 5 words each.

─── NOTICE PROTOCOL ───
Around Q5–Q6, when you spot a clear recurring pattern, surface it as a distinct observation. Place it on its own line before your question:
[NOTICE] Your actual observation here — specific, not generic.
Example: [NOTICE] You've mentioned needing space twice now — that's not nothing.
Only one NOTICE total. Make it count.

─── TONE & LENGTH ───
- 2–3 sentences MAXIMUM per response. This is a text conversation, not therapy.
- One short observation + one question. That's it.
- Warm but playful — gentle teasing is fine. "That's... a very diplomatic answer." works.
- "honestly", "tbh", "that's actually rare" — casual and real.
- If they share something heavy, one line of genuine acknowledgment. Then move forward.
- No clinical language. Never say "attachment style" or "love language" out loud — extract the signal, don't name it.

─── RULES ───
- ONE question per turn. No exceptions.
- Never ask what you can already infer.
- Never ask about kids, smoking, drinking directly — infer from Tuesday vision and dealbreakers.
- If the first user message is "__BEGIN__", start warmly with Q1. Don't acknowledge the trigger word.

─── COMPLETION ───
After all 8 questions with real signal (typically 8–12 exchanges), emit on its own line:
PROFILE_COMPLETE
${forbidden}
${memoryContext}`;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only pre-existing errors unrelated to prompts.ts).

- [ ] **Step 3: Commit**

```bash
git add src/lib/prompts.ts
git commit -m "feat: update onboarding system prompt — 8-question arc, CHIPS + NOTICE protocol"
```

---

## Task 2: AmbientLayer Component

**Files:**
- Create: `src/components/onboarding/ambient-layer.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /Users/themeetpatel/Startups/biggdate/src/components/onboarding
```

- [ ] **Step 2: Write `src/components/onboarding/ambient-layer.tsx`**

```typescript
import { motion } from "framer-motion";

export type Act = 1 | 2 | 3 | 4 | 5;

const GRADIENTS: Record<Act, string> = {
  1: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(100,120,255,0.13) 0%, transparent 70%)",
  2: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,180,80,0.11) 0%, transparent 70%)",
  3: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,80,140,0.13) 0%, transparent 70%)",
  4: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(140,80,255,0.11) 0%, transparent 70%)",
  5: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,200,80,0.17) 0%, transparent 70%)",
};

export const ACT_COLORS: Record<Act, string> = {
  1: "#7b9fff",
  2: "#ffb450",
  3: "#ff508c",
  4: "#8c50ff",
  5: "#ffc850",
};

export function AmbientLayer({ act }: { act: Act }) {
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      {(Object.keys(GRADIENTS) as unknown as Act[]).map((a) => (
        <motion.div
          key={a}
          className="absolute inset-0"
          animate={{ opacity: act === a ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ background: GRADIENTS[a] }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/onboarding/ambient-layer.tsx
git commit -m "feat: add AmbientLayer — 5-act cinematic background gradient"
```

---

## Task 3: ThinkingPulse Component

**Files:**
- Create: `src/components/onboarding/thinking-pulse.tsx`

- [ ] **Step 1: Write `src/components/onboarding/thinking-pulse.tsx`**

```typescript
import { motion } from "framer-motion";
import { ACT_COLORS, type Act } from "./ambient-layer";

export function ThinkingPulse({ act }: { act: Act }) {
  const color = ACT_COLORS[act];
  return (
    <div className="flex items-center py-3">
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.85, 0.3] }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px ${color}90`,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/thinking-pulse.tsx
git commit -m "feat: add ThinkingPulse — breathing dot for AI thinking state"
```

---

## Task 4: QuickReplies Component

**Files:**
- Create: `src/components/onboarding/quick-replies.tsx`

- [ ] **Step 1: Write `src/components/onboarding/quick-replies.tsx`**

```typescript
"use client";

import { motion } from "framer-motion";
import { ACT_COLORS, type Act } from "./ambient-layer";

/** Extract chips from "[CHIPS: A | B | C]" suffix in AI message text. */
export function parseChips(text: string): string[] {
  const match = text.match(/\[CHIPS:\s*([^\]]+)\]/);
  if (!match) return [];
  return match[1].split("|").map((s) => s.trim()).filter(Boolean);
}

/** Remove the "[CHIPS: ...]" suffix from display text. */
export function stripChips(text: string): string {
  return text.replace(/\[CHIPS:[^\]]*\]/g, "").trim();
}

interface QuickRepliesProps {
  chips: string[];
  act: Act;
  onSelect: (chip: string) => void;
  onSayMore: () => void;
}

export function QuickReplies({ chips, act, onSelect, onSayMore }: QuickRepliesProps) {
  const color = ACT_COLORS[act];

  return (
    <motion.div
      className="mb-4 flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {chips.map((chip) => (
        <motion.button
          key={chip}
          onClick={() => onSelect(chip)}
          whileTap={{ scale: 0.95 }}
          className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-80"
          style={{
            border: `1px solid ${color}50`,
            color,
            background: `${color}12`,
            backdropFilter: "blur(8px)",
          }}
        >
          {chip}
        </motion.button>
      ))}
      <motion.button
        onClick={onSayMore}
        whileTap={{ scale: 0.95 }}
        className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-70"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          color: "var(--bd-text-faint)",
          background: "transparent",
        }}
      >
        ↩ say more
      </motion.button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/quick-replies.tsx
git commit -m "feat: add QuickReplies — tappable chip options with parseChips utility"
```

---

## Task 5: SoulSignal Component

**Files:**
- Create: `src/components/onboarding/soul-signal.tsx`

- [ ] **Step 1: Write `src/components/onboarding/soul-signal.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACT_COLORS, type Act } from "./ambient-layer";

const SECTOR_LABELS = [
  "Who you are",
  "What you want",
  "Who you seek",
  "Your story",
  "How you love",
  "Your limits",
  "Your vision",
  "What you bring",
];

/**
 * Compute an SVG arc path for a circle segment.
 * Angles in degrees, 0° = top, clockwise.
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  function toXY(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  const s = toXY(startDeg);
  const e = toXY(endDeg);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

interface SoulSignalProps {
  /** Number of questions answered (0–8). */
  completed: number;
  act: Act;
}

export function SoulSignal({ completed, act }: SoulSignalProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const color = ACT_COLORS[act];

  // 8 segments of 40° each, with 5° gap between them.
  // Segment i: startDeg = i*45 + 2.5, endDeg = i*45 + 42.5
  const segments = Array.from({ length: 8 }, (_, i) => ({
    path: describeArc(14, 14, 10, i * 45 + 2.5, i * 45 + 42.5),
    filled: i < completed,
    label: SECTOR_LABELS[i],
  }));

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip((v) => !v)}
        aria-label="Soul profile progress"
      >
        <svg width="28" height="28" viewBox="0 0 28 28">
          {segments.map((seg, i) => (
            <motion.path
              key={i}
              d={seg.path}
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ stroke: seg.filled ? color : "rgba(255,255,255,0.12)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </svg>
      </button>

      <AnimatePresence>
        {showTooltip && completed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-9 left-0 w-44 rounded-xl p-3 text-[11px]"
            style={{
              background: "rgba(20,20,20,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              zIndex: 50,
            }}
          >
            {segments
              .filter((s) => s.filled)
              .map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 py-0.5">
                  <div
                    className="size-1 rounded-full"
                    style={{ background: color }}
                  />
                  <span style={{ color: "var(--bd-text-muted)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/soul-signal.tsx
git commit -m "feat: add SoulSignal — 8-sector SVG ring tracking profile build progress"
```

---

## Task 6: Rewrite OnboardingMessage (chat-message.tsx)

**Files:**
- Rewrite: `src/components/chat-message.tsx`

This is the only place `ChatMessage` is used (onboarding/page.tsx). The rename to `OnboardingMessage` happens here; the import in page.tsx is updated in Task 7.

- [ ] **Step 1: Rewrite `src/components/chat-message.tsx`**

```typescript
"use client";

import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import { ACT_COLORS, type Act } from "@/components/onboarding/ambient-layer";

/** Extract plain text from a UIMessage's parts array. */
export function getMessageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  );
}

/** Remove "[CHIPS: ...]" suffix from text. */
function stripChips(text: string): string {
  return text.replace(/\[CHIPS:[^\]]*\]/g, "").trim();
}

/** Detect and extract "[NOTICE]" prefix. */
function parseNotice(text: string): { isNotice: boolean; text: string } {
  if (text.trimStart().startsWith("[NOTICE]")) {
    return { isNotice: true, text: text.replace("[NOTICE]", "").trim() };
  }
  return { isNotice: false, text };
}

interface OnboardingMessageProps {
  message: UIMessage;
  act: Act;
}

export function OnboardingMessage({ message, act }: OnboardingMessageProps) {
  const raw = getMessageText(message);
  const cleaned = stripChips(raw);

  if (!cleaned) return null;

  // User answer — right-aligned gradient text, no bubble
  if (message.role === "user") {
    return (
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="max-w-[75%] text-sm leading-relaxed"
          style={{
            background: "linear-gradient(135deg, #e8927c, #d4688a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {cleaned}
        </span>
      </motion.div>
    );
  }

  // AI message — check for [NOTICE] variant first
  const { isNotice, text: noticeText } = parseNotice(cleaned);

  if (isNotice) {
    const color = ACT_COLORS[act];
    return (
      <motion.div
        className="py-1 text-center text-sm italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.6 }}
        style={{
          color,
          textShadow: `0 0 20px ${color}40`,
        }}
      >
        {noticeText}
      </motion.div>
    );
  }

  // Standard AI message — large prose, no bubble
  return (
    <motion.div
      className="text-xl font-light leading-relaxed sm:text-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ color: "var(--bd-text)" }}
    >
      {cleaned}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/chat-message.tsx
git commit -m "feat: rewrite ChatMessage as OnboardingMessage — no bubbles, AI/user/notice variants"
```

---

## Task 7: Rewrite onboarding/page.tsx

**Files:**
- Rewrite: `src/app/onboarding/page.tsx`

This is the orchestration layer. It wires all new components, handles the auto-start, act tracking, and ritual reveal.

- [ ] **Step 1: Rewrite `src/app/onboarding/page.tsx`**

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AmbientLayer, ACT_COLORS, type Act } from "@/components/onboarding/ambient-layer";
import { ThinkingPulse } from "@/components/onboarding/thinking-pulse";
import { QuickReplies, parseChips } from "@/components/onboarding/quick-replies";
import { SoulSignal } from "@/components/onboarding/soul-signal";
import { OnboardingMessage, getMessageText } from "@/components/chat-message";
import { useAuth } from "@/components/auth-provider";

function getAct(aiMessageCount: number): Act {
  if (aiMessageCount <= 2) return 1;
  if (aiMessageCount <= 4) return 2;
  if (aiMessageCount <= 6) return 3;
  if (aiMessageCount <= 7) return 4;
  return 5;
}

const PLACEHOLDERS: Record<Act, string> = {
  1: "What feels true right now...",
  2: "Take your time...",
  3: "Be honest...",
  4: "Dream a little...",
  5: "Last thing...",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const sessionId = useRef(`onboarding-${Math.random().toString(36).slice(2, 10)}`);

  const [input, setInput] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [derivingStarted, setDerivingStarted] = useState(false);

  const autoStarted = useRef(false);
  const initMessageId = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId: sessionId.current },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Auto-start: fire __BEGIN__ trigger 1.2s after mount
  useEffect(() => {
    if (autoStarted.current) return;
    autoStarted.current = true;
    const timer = setTimeout(() => {
      sendMessage({ text: "__BEGIN__" });
    }, 1200);
    return () => clearTimeout(timer);
  }, [sendMessage]);

  // Track the ID of the init trigger message (first user message)
  useEffect(() => {
    const firstUser = messages.find((m) => m.role === "user");
    if (firstUser && !initMessageId.current) {
      initMessageId.current = firstUser.id;
    }
  }, [messages]);

  // Detect PROFILE_COMPLETE in latest AI message
  useEffect(() => {
    if (revealing) return;
    const lastAI = messages.filter((m) => m.role === "assistant").at(-1);
    if (!lastAI || isStreaming) return;
    const text = getMessageText(lastAI);
    if (text.includes("PROFILE_COMPLETE")) {
      setRevealing(true);
    }
  }, [messages, isStreaming, revealing]);

  // Derive profile — runs once when revealing becomes true
  useEffect(() => {
    if (!revealing || derivingStarted) return;
    setDerivingStarted(true);

    const transcript = messages
      .map((m) => `${m.role}: ${getMessageText(m)}`)
      .join("\n");

    Promise.all([
      fetch("/api/profile/derive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      }).then((r) => r.json()),
      // Minimum 3.5s for the ritual animation to complete
      new Promise<void>((r) => setTimeout(r, 3500)),
    ])
      .then(async ([profile]) => {
        if (profile?.name) {
          await refresh();
          router.push("/soul-snapshot");
        } else {
          setRevealing(false);
          setDerivingStarted(false);
        }
      })
      .catch(() => {
        setRevealing(false);
        setDerivingStarted(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealing]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Derived state
  const aiMessageCount = messages.filter((m) => m.role === "assistant").length;
  const act = getAct(aiMessageCount);
  const accentColor = ACT_COLORS[act];

  // User answers (excluding init trigger)
  const userAnswers = messages.filter(
    (m) => m.role === "user" && m.id !== initMessageId.current
  );
  const completedQuestions = Math.min(userAnswers.length, 8);

  // Messages to display (filter init trigger + PROFILE_COMPLETE messages)
  const visibleMessages = messages.filter((m) => {
    if (m.id === initMessageId.current) return false;
    const text = getMessageText(m);
    if (text.includes("PROFILE_COMPLETE")) return false;
    return true;
  });

  // Extract chips from last AI message (only once streaming is done)
  const lastAIMessage = messages.filter((m) => m.role === "assistant").at(-1);
  const currentChips = useMemo(() => {
    if (isStreaming || !lastAIMessage) return [];
    const text = getMessageText(lastAIMessage);
    if (text.includes("PROFILE_COMPLETE")) return [];
    return parseChips(text);
  }, [lastAIMessage, isStreaming]);

  const handleSend = useCallback(
    (text?: string) => {
      const txt = (text ?? input).trim();
      if (!txt || isStreaming) return;
      sendMessage({ text: txt });
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [input, isStreaming, sendMessage]
  );

  const handleChipSelect = useCallback(
    (chip: string) => handleSend(chip),
    [handleSend]
  );

  const handleSayMore = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const isWelcome = visibleMessages.length === 0 && !isStreaming;

  // ── Ritual reveal overlay ──────────────────────────────────────────────────
  if (revealing) {
    return (
      <>
        <AmbientLayer act={5} />
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <motion.p
            className="text-2xl font-light tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: "var(--bd-text)" }}
          >
            We see you.
          </motion.p>
        </div>
      </>
    );
  }

  // ── Main layout ────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex h-screen flex-col overflow-hidden"
      style={{ background: "var(--bd-bg)" }}
    >
      <AmbientLayer act={act} />

      {/* Minimal header */}
      <header className="relative flex-shrink-0 px-6 py-4" style={{ zIndex: 10 }}>
        <span
          className="text-[11px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: accentColor, opacity: 0.55 }}
        >
          BiggDate
        </span>
      </header>

      {/* Content area */}
      <div className="relative flex-1 overflow-y-auto" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {isWelcome ? (
            /* Welcome screen */
            <motion.div
              key="welcome"
              className="flex h-full flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-3xl font-light tracking-tight sm:text-4xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: "var(--bd-text)" }}
              >
                Tell me something real
                <br />
                <span style={{ color: accentColor, opacity: 0.75 }}>
                  and I&apos;ll show you who you are.
                </span>
              </motion.h1>
              <motion.p
                className="mt-4 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{ color: "var(--bd-text-faint)" }}
              >
                Private. No forms. Just a conversation.
              </motion.p>
            </motion.div>
          ) : (
            /* Conversation */
            <motion.div
              key="conversation"
              className="mx-auto max-w-2xl space-y-8 px-6 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleMessages.map((message) => (
                <OnboardingMessage
                  key={message.id}
                  message={message}
                  act={act}
                />
              ))}

              {/* Thinking pulse: shown while AI hasn't responded yet */}
              {status === "submitted" && <ThinkingPulse act={act} />}

              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area — hidden on welcome screen */}
      <AnimatePresence>
        {!isWelcome && (
          <motion.div
            className="relative flex-shrink-0 px-6 pb-6 pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ zIndex: 10 }}
          >
            {/* Fade gradient over conversation */}
            <div
              className="pointer-events-none absolute inset-x-0 -top-10 h-10"
              style={{
                background: "linear-gradient(to top, var(--bd-bg), transparent)",
              }}
            />

            <div className="mx-auto max-w-2xl">
              {/* Quick reply chips */}
              {currentChips.length > 0 && (
                <QuickReplies
                  chips={currentChips}
                  act={act}
                  onSelect={handleChipSelect}
                  onSayMore={handleSayMore}
                />
              )}

              {/* Text input — open, surface-like */}
              <div
                className="flex items-end gap-3 border-b pb-2"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder={PLACEHOLDERS[act]}
                  rows={1}
                  className="flex-1 resize-none border-0 bg-transparent text-sm focus:outline-none"
                  style={{
                    color: "var(--bd-text)",
                    maxHeight: "160px",
                    caretColor: accentColor,
                  }}
                />
                <AnimatePresence>
                  {input.trim() && !isStreaming && (
                    <motion.button
                      onClick={() => handleSend()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="mb-1 flex-shrink-0 text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: accentColor }}
                    >
                      Send
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <p
                className="mt-2 text-center text-[10px]"
                style={{ color: "var(--bd-text-faint)", opacity: 0.45 }}
              >
                Private and used only to build your profile
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soul Signal — bottom-left, appears after first question answered */}
      <AnimatePresence>
        {!isWelcome && completedQuestions > 0 && (
          <motion.div
            className="fixed bottom-6 left-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 20 }}
          >
            <SoulSignal completed={completedQuestions} act={act} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles with no new errors**

```bash
cd /Users/themeetpatel/Startups/biggdate && npx tsc --noEmit 2>&1 | head -40
```

Expected: clean compile or only pre-existing unrelated errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/onboarding/page.tsx
git commit -m "feat: rewrite onboarding page — cinematic layout, auto-start, act tracking, ritual reveal"
```

---

## Task 8: Integration Verification

**Files:** none — verification only

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/themeetpatel/Startups/biggdate && npm run dev
```

Expected: server starts on `localhost:3000` with no build errors.

- [ ] **Step 2: Open onboarding in browser**

Navigate to `http://localhost:3000/onboarding`.

Check:
- [ ] Welcome screen shows "Tell me something real..." headline (no stat grid, no Begin button)
- [ ] After ~1.2s, the AI message appears automatically (no user action needed)
- [ ] Welcome screen fades out, conversation appears
- [ ] AI message renders as large prose (no chat bubble)
- [ ] ThinkingPulse (breathing dot) is visible while AI responds — check by sending a message
- [ ] User answer appears as warm gradient text, right-aligned, no bubble
- [ ] After AI's Q3 response, `[CHIPS: A man | A woman | Open to all]` chips appear below
- [ ] Tapping a chip sends it as the user answer and dismisses chips
- [ ] "↩ say more" chip focuses the textarea without sending
- [ ] After answering Q1, SoulSignal ring appears bottom-left with one sector filled
- [ ] SoulSignal tooltip shows "Who you are ✓" on hover
- [ ] Ambient background subtly shifts color as conversation progresses (Acts 1→2→3 visible by Q6)
- [ ] The `[CHIPS: ...]` text does NOT appear in the AI message display
- [ ] The `[NOTICE]` observation renders centered, italic, in the act's accent color (not as a bubble)

- [ ] **Step 3: Test the reveal flow**

If you can reach PROFILE_COMPLETE (or temporarily trigger it by modifying the prompt to emit it early):
- [ ] "We see you." text fades in centered on a golden background
- [ ] Navigation to `/soul-snapshot` happens after ~3.5s

- [ ] **Step 4: Mobile viewport check**

Open browser DevTools, set to iPhone 14 Pro (390×844).
- [ ] Welcome headline is readable, not clipped
- [ ] Chips are horizontally scrollable if they overflow
- [ ] Textarea is usable in the thumb zone
- [ ] SoulSignal is accessible at bottom-left without covering input

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: cinematic onboarding — complete implementation verified"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] No bubbles — `OnboardingMessage` uses prose + gradient text
- [x] Auto-start at 1.2s — `useEffect` with `setTimeout` + `__BEGIN__` trigger
- [x] 5-act ambient layer — `AmbientLayer` with 5 Framer Motion opacity transitions
- [x] ThinkingPulse on `status === "submitted"` state
- [x] Quick-reply chips from `[CHIPS:]` token — `parseChips` + `QuickReplies`
- [x] "↩ say more" chip — `onSayMore` → textarea focus
- [x] `[NOTICE]` notice variant — centered italic glow in act color
- [x] SoulSignal 8-sector ring — SVG arcs, fills per completed question
- [x] SoulSignal tooltip — hover/touch shows filled sector labels
- [x] Act-aware input placeholder — `PLACEHOLDERS[act]`
- [x] Ritual reveal — `revealing` state → "We see you." → 3.5s min → navigate
- [x] Init trigger filtered from display — `initMessageId.current` ref
- [x] `PROFILE_COMPLETE` filtered from display
- [x] `[CHIPS:]` stripped from display text — `stripChips` in `OnboardingMessage`
- [x] API layer untouched — `/api/chat`, `/api/profile/derive`, types.ts unchanged
- [x] 8-question arc in system prompt — double-duty questions, CHIPS + NOTICE protocol

**Type consistency:**
- `Act` type exported from `ambient-layer.tsx`, imported by all other components
- `ACT_COLORS` exported from `ambient-layer.tsx`, used in `ThinkingPulse`, `QuickReplies`, `SoulSignal`, `OnboardingMessage`
- `getMessageText` exported from `chat-message.tsx`, used in `page.tsx`
- `parseChips` exported from `quick-replies.tsx`, used in `page.tsx`
- `OnboardingMessage` exported from `chat-message.tsx`, used in `page.tsx`
