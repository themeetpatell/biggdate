"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRouter } from "next/navigation";

// ── Constants ─────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const N = 8;
const BAR_H = 52;

const CHAPTERS = [
  { num: "Prologue",    title: "The Old World" },
  { num: "Chapter 01", title: "The System Is Broken" },
  { num: "Chapter 02", title: "Enter Maahi" },
  { num: "Chapter 03", title: "Your Soul Profile" },
  { num: "Chapter 04", title: "The Match" },
  { num: "Chapter 05", title: "The Soul Knock" },
  { num: "Chapter 06", title: "Life Preview" },
  { num: "Epilogue",   title: "A New Beginning" },
];

const TINTS = [
  "rgba(212,104,138,0.13)",
  "rgba(255,60,60,0.11)",
  "rgba(124,58,237,0.14)",
  "rgba(79,70,229,0.12)",
  "rgba(232,121,160,0.14)",
  "rgba(245,158,11,0.11)",
  "rgba(16,185,129,0.11)",
  "rgba(212,104,138,0.18)",
];

const ACCENT = [
  "#d4688a", "#ff4444", "#7c3aed", "#4f46e5",
  "#e879a0", "#f59e0b", "#10b981", "#d4688a",
];

// ── Shared animation variants ─────────────────────────────────────────────────

const SCENE_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 38 : -38 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -38 : 38 }),
};

// ── Utility: typewriter text ──────────────────────────────────────────────────

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let alive = true;
    const pre = setTimeout(() => {
      if (!alive) return;
      let i = 0;
      const id = setInterval(() => {
        if (!alive) { clearInterval(id); return; }
        if (i < text.length) setShown(text.slice(0, ++i));
        else { setDone(true); clearInterval(id); }
      }, 17);
    }, delay);
    return () => { alive = false; clearTimeout(pre); };
  }, [text, delay]);
  return <>{shown}{!done && <span style={{ opacity: 0.55 }}>|</span>}</>;
}

// ── Scene 0: Prologue — "The Old World" ──────────────────────────────────────

const RAIN = [
  "swipe →", "← nope", "hey", "hey", "hey!",
  "matched!", "👻 ghosted", "unmatched", "❌", "no reply",
  "swipe →", "← skip", "try again", "💔 ghosted", "hey",
  "matched!", "unmatch", "swipe →", "← nope", "hey",
];

function ScenePrologue() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", textAlign: "center" }}>

      {/* Raining words */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {RAIN.map((w, i) => (
          <motion.span
            key={i}
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.24, 0.24, 0] }}
            transition={{ duration: 5 + (i % 4) * 0.7, delay: i * 0.32, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              left: `${(i * 4.85) % 93 + 2}%`,
              fontSize: 11,
              color: i % 3 === 0 ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.16)",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}
          >
            {w}
          </motion.span>
        ))}
      </div>

      {/* Presents line */}
      <motion.div
        initial={{ opacity: 0, letterSpacing: "0.55em" }}
        animate={{ opacity: 1, letterSpacing: "0.18em" }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ fontSize: 11, textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 52, fontWeight: 500 }}
      >
        BiggDate presents
      </motion.div>

      {/* Stacked stats */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 44 }}>
        {[
          { val: "3,200,000,000", label: "swipes today", big: false, delay: 0.45 },
          { val: "847",           label: "matches this year", big: false, delay: 0.68 },
          { val: "0",             label: "of them stayed", big: true,  delay: 0.91 },
        ].map(({ val, label, big, delay }) => (
          <motion.div
            key={val}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, delay, ease: EASE }}
            style={{ display: "flex", alignItems: "baseline", gap: 8 }}
          >
            <span style={{ fontSize: big ? 44 : 24, fontWeight: 900, color: big ? "#ff5555" : "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
              {val}
            </span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.28)" }}>{label}</span>
          </motion.div>
        ))}
      </div>

      {/* Hero line */}
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 1.55, ease: EASE }}
        style={{ fontSize: "clamp(34px, 5.5vw, 68px)", fontWeight: 900, color: "#fff", lineHeight: 1.07, margin: 0, maxWidth: 640, letterSpacing: "-0.03em" }}
      >
        There has to be
        <br />
        <span style={{ color: "#d4688a" }}>a better way.</span>
      </motion.h1>

      {/* Scroll pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.38, 0] }}
        transition={{ duration: 2.2, delay: 2.6, repeat: Infinity }}
        style={{ position: "absolute", bottom: 22, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}
      >
        Scroll to continue ↓
      </motion.div>
    </div>
  );
}

// ── Scene 1: The Problem ──────────────────────────────────────────────────────

const GHOST_CARDS = [
  { name: "Alex, 28 · VC Analyst",   when: "14 months ago", outcome: "👻  Ghosted after 3 messages" },
  { name: "Jordan, 31 · Founder",    when: "9 months ago",  outcome: "🔴  Never responded" },
  { name: "Sam, 27 · Product Lead",  when: "6 weeks ago",   outcome: "❌  Unmatched before coffee" },
];

function SceneProblem() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#ff4444", marginBottom: 20, fontWeight: 700 }}
      >
        ◼ Exhibit A
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
        style={{ fontSize: "clamp(24px, 4vw, 54px)", fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.12, margin: "0 0 40px", maxWidth: 540, letterSpacing: "-0.025em" }}
      >
        The apps weren't built
        <br />
        for people <span style={{ color: "#ff6b6b" }}>like you.</span>
      </motion.h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 430 }}>
        {GHOST_CARDS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.32 + i * 0.16, ease: EASE }}
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,70,70,0.18)",
              background: "rgba(255,40,40,0.04)",
              padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.26)" }}>{c.when}</p>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,110,110,0.75)", flexShrink: 0, textAlign: "right" }}>{c.outcome}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}
        style={{ marginTop: 32, fontSize: 14, color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}
      >
        You deserve better than a stranger and a gamble.
      </motion.p>
    </div>
  );
}

// ── Scene 2: Enter Maahi ──────────────────────────────────────────────────────

const CHAT_LINES = [
  { from: "maahi", text: "Hi. I'm Maahi." },
  { from: "maahi", text: "I'm not here to match you." },
  { from: "maahi", text: "I'm here to understand you." },
  { from: "maahi", text: "What does your ideal Sunday morning look like?" },
  { from: "user",  text: "Slow. Coffee. Maybe a run. No phone till noon." },
  { from: "maahi", text: "That tells me more than 400 right swipes ever could." },
];
const CHAT_MS = [320, 1050, 1720, 2520, 3480, 4520];

function SceneMaahi() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timers = CHAT_MS.map((d, i) => setTimeout(() => setVisible(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px" }}>
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.35, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          width: 54, height: 54, borderRadius: "50%",
          background: "linear-gradient(135deg, #d4688a, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, marginBottom: 8,
          boxShadow: "0 0 0 8px rgba(124,58,237,0.07), 0 0 44px rgba(124,58,237,0.38)",
        }}
      >✨</motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: 10, color: "rgba(212,104,138,0.55)", marginBottom: 26, letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        Maahi · AI Guide
      </motion.p>

      {/* Chat */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 370 }}>
        <AnimatePresence>
          {CHAT_LINES.slice(0, visible).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.38, ease: EASE }}
              style={{
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                padding: "10px 15px",
                borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.from === "user"
                  ? "linear-gradient(135deg, #7c3aed, #d4688a)"
                  : "rgba(255,255,255,0.08)",
                border: msg.from === "maahi" ? "1px solid rgba(255,255,255,0.1)" : "none",
                fontSize: 13, color: "#fff", lineHeight: 1.47,
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Scene 3: Soul Profile ─────────────────────────────────────────────────────

const SOUL_TAGS = [
  { label: "Securely Attached",  color: "#4FFFB0" },
  { label: "Earns Trust Slowly", color: "#d4688a" },
  { label: "Values Depth",       color: "#7c3aed" },
  { label: "Quality Time",       color: "#f59e0b" },
  { label: "Reflective Comms",   color: "#3b82f6" },
  { label: "Partnership Intent", color: "#ec4899" },
  { label: "Growth Focused",     color: "#6ee7b7" },
  { label: "Ready to Commit",    color: "#fbbf24" },
];

function SceneSoulProfile() {
  const [pct, setPct] = useState(0);
  const [tagN, setTagN] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 2800;
    const id = setInterval(() => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setPct(e);
      if (t >= 1) clearInterval(id);
    }, 16);
    const timers = SOUL_TAGS.map((_, i) => setTimeout(() => setTagN(i + 1), 480 + i * 255));
    return () => { clearInterval(id); timers.forEach(clearTimeout); };
  }, []);

  const R = 72, SZ = 168, CX = SZ / 2, CY = SZ / 2;
  const CIRC = 2 * Math.PI * R;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 28, fontWeight: 700 }}
      >
        ◼ Soul Profile Forming
      </motion.p>

      {/* SVG arc */}
      <motion.div
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.72, ease: EASE }}
        style={{ position: "relative", marginBottom: 30 }}
      >
        <svg width={SZ} height={SZ} style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
          <circle
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke="url(#soulGrad)"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - pct)}
          />
          <defs>
            <linearGradient id="soulGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#d4688a" />
              <stop offset="100%" stopColor="#4FFFB0" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
            {Math.round(pct * 100)}%
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 9, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.12em" }}>soul match</p>
        </div>
      </motion.div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 390 }}>
        {SOUL_TAGS.slice(0, tagN).map((tag) => (
          <motion.span
            key={tag.label}
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{
              padding: "5px 13px", borderRadius: 999,
              border: `1px solid ${tag.color}33`, background: `${tag.color}10`,
              fontSize: 11, color: tag.color, fontWeight: 600,
            }}
          >
            {tag.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// ── Scene 4: The Match ────────────────────────────────────────────────────────

const SIGNALS = [
  { label: "Values",        text: "Both prioritize depth over breadth",        color: "#4FFFB0" },
  { label: "Communication", text: "Both need processing time before reacting", color: "#d4688a" },
  { label: "Life Direction","text": "Both building something that lasts",       color: "#f59e0b" },
];

function SceneMatch() {
  const [revealed, setRevealed] = useState(false);
  const [sigN, setSigN] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const timers = SIGNALS.map((_, i) => setTimeout(() => setSigN(i + 1), i * 400));
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#d4688a", marginBottom: 28, fontWeight: 700 }}
      >
        ◼ Maahi Found Someone
      </motion.p>

      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.62, ease: EASE }}
        style={{
          width: "100%", maxWidth: 370, borderRadius: 26,
          border: revealed ? "1px solid rgba(212,104,138,0.32)" : "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(145deg, rgba(22,16,30,0.98), rgba(12,9,20,0.99))",
          padding: "26px 22px",
          boxShadow: revealed
            ? "0 40px 100px rgba(212,104,138,0.18), 0 0 0 1px rgba(212,104,138,0.07)"
            : "0 24px 60px rgba(0,0,0,0.65)",
          transition: "border-color 0.55s, box-shadow 0.55s",
        }}
      >
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="sealed"
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.28 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "20px 0" }}
            >
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: "rgba(212,104,138,0.08)", border: "1px solid rgba(212,104,138,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>🔒</div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>Soul Match #1</p>
              <div style={{
                padding: "5px 16px", borderRadius: 999,
                background: "rgba(79,255,176,0.07)", border: "1px solid rgba(79,255,176,0.2)",
                fontSize: 12, color: "#4FFFB0", fontWeight: 700,
              }}>87% harmony</div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.5 }}>
                Maahi is revealing your match…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>Arya, 29</p>
                  <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(255,255,255,0.36)" }}>Mumbai · Product Designer</p>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 999, flexShrink: 0,
                  background: "rgba(79,255,176,0.08)", border: "1px solid rgba(79,255,176,0.22)",
                  fontSize: 11, color: "#4FFFB0", fontWeight: 700,
                }}>87%</div>
              </div>

              <p style={{
                margin: 0, fontSize: 13, color: "rgba(212,104,138,0.88)", fontStyle: "italic", lineHeight: 1.6,
                paddingLeft: 12, borderLeft: "2px solid rgba(212,104,138,0.3)",
              }}>
                "She earns trust slowly and builds deep — and your complexity doesn't scare her one bit."
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SIGNALS.slice(0, sigN).map((s) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.34, ease: EASE }}
                    style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                  >
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 9px",
                      borderRadius: 999, background: `${s.color}10`,
                      color: s.color, border: `1px solid ${s.color}28`,
                      flexShrink: 0, marginTop: 2,
                    }}>{s.label}</span>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.48 }}>{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Scene 5: The Soul Knock ───────────────────────────────────────────────────

function SceneSoulKnock() {
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("sending"), 1500);
    const t2 = setTimeout(() => setPhase("sent"),    3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 20, fontWeight: 700 }}
      >
        ◼ The Soul Knock
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ease: EASE }}
        style={{ fontSize: "clamp(22px, 3.6vw, 44px)", fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.18, margin: "0 0 36px", maxWidth: 490, letterSpacing: "-0.025em" }}
      >
        One intentional message.
        <br />
        <span style={{ color: "rgba(255,255,255,0.26)" }}>Not 47 "hey"s.</span>
      </motion.h2>

      {/* Message card */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: EASE }}
        style={{ width: "100%", maxWidth: 390, borderRadius: 22, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "20px" }}
      >
        <p style={{ margin: "0 0 8px", fontSize: 10, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Your intention for Arya
        </p>
        <div style={{
          borderRadius: 12, border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.04)", padding: "13px 15px",
          marginBottom: 14, minHeight: 82,
          fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.56,
        }}>
          <TypewriterText
            text="I'm curious about what you're building. Most people work to escape. I think you work to arrive somewhere."
            delay={550}
          />
        </div>

        <motion.button
          animate={{
            background: phase === "sent"
              ? "linear-gradient(135deg, #4FFFB0, #22d3ee)"
              : "linear-gradient(135deg, #ff8cb8, #d4688a)",
          }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", padding: "13px 0", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#0A0A0F", letterSpacing: "0.02em" }}
        >
          {phase === "idle" ? "Send Soul Knock ✦" : phase === "sending" ? "Sending…" : "✓ Soul Knock Sent"}
        </motion.button>
      </motion.div>

      {/* Ripples */}
      {phase === "sending" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.18, opacity: 0.65 }}
              animate={{ scale: 9, opacity: 0 }}
              transition={{ duration: 2.8, delay: i * 0.44, ease: "easeOut" }}
              style={{ position: "absolute", width: 50, height: 50, borderRadius: "50%", border: "1px solid rgba(245,158,11,0.42)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Scene 6: Life Preview ─────────────────────────────────────────────────────

const MILESTONES = [
  { week: "Week 2",  icon: "☕", text: "First coffee. She was exactly like her profile. Better, actually." },
  { week: "Month 2", icon: "🌆", text: "She met your best friend last Thursday. They already follow each other." },
  { week: "Month 4", icon: "✈️", text: "You changed a travel plan. Not because you had to. Because you wanted to." },
  { week: "Month 6", icon: "🏠", text: "You're looking at apartments together. That's new for you." },
];

function SceneLifePreview() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timers = MILESTONES.map((_, i) => setTimeout(() => setCount(i + 1), 220 + i * 520));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#10b981", marginBottom: 14, fontWeight: 700 }}
      >
        ◼ 6-Month Life Preview
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, ease: EASE }}
        style={{ fontSize: "clamp(20px, 3.2vw, 38px)", fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.2, margin: "0 0 38px", maxWidth: 480, letterSpacing: "-0.02em" }}
      >
        See where it goes
        <span style={{ color: "#4FFFB0" }}> before you go there.</span>
      </motion.h2>

      <div style={{ position: "relative", width: "100%", maxWidth: 430 }}>
        {/* Timeline spine */}
        <div style={{
          position: "absolute", left: 25, top: 28, bottom: 28, width: 1,
          background: "linear-gradient(to bottom, rgba(79,255,176,0.55), rgba(79,255,176,0.04))",
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {MILESTONES.slice(0, count).map((m) => (
            <motion.div
              key={m.week}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: "50%",
                background: "rgba(79,255,176,0.07)", border: "1px solid rgba(79,255,176,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0, zIndex: 1,
              }}>
                {m.icon}
              </div>
              <div style={{ paddingTop: 6 }}>
                <p style={{ margin: "0 0 3px", fontSize: 10, color: "#4FFFB0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {m.week}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
                  {m.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scene 7: Epilogue ─────────────────────────────────────────────────────────

function SceneEpilogue() {
  const router = useRouter();
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 24px", textAlign: "center" }}>
      {/* Love glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 72% 52% at 50% 52%, rgba(212,104,138,0.16) 0%, transparent 70%)",
      }} />

      {/* Orbiting micro-orbs */}
      {[
        { w: 260, h: 260, c: "rgba(212,104,138,0.07)", dur: 18 },
        { w: 400, h: 400, c: "rgba(124,58,237,0.05)",  dur: 26 },
      ].map(({ w, h, c, dur }, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", width: w, height: h,
            borderRadius: "50%", border: `1px solid ${c}`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ))}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
        style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 40 }}
      >
        ✦ The End — And The Beginning
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, delay: 0.38, ease: EASE }}
        style={{ fontSize: "clamp(30px, 5.5vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1.06, margin: "0 0 22px", maxWidth: 640, letterSpacing: "-0.035em" }}
      >
        Every great love story
        <br />
        <span style={{
          background: "linear-gradient(135deg, #ff8cb8 0%, #d4688a 50%, #7c3aed 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        } as React.CSSProperties}>
          had a first conversation.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.72, ease: EASE }}
        style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "rgba(255,255,255,0.4)", margin: "0 0 56px", maxWidth: 340 }}
      >
        Yours is waiting.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1.15, ease: EASE }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}
      >
        <button
          onClick={() => router.push("/onboarding")}
          style={{
            padding: "17px 52px", borderRadius: 999,
            fontSize: 15, fontWeight: 800, color: "#0A0A0F",
            background: "linear-gradient(135deg, #ff8cb8 0%, #d4688a 50%, #7c3aed 100%)",
            border: "none", cursor: "pointer",
            boxShadow: "0 24px 70px rgba(212,104,138,0.42)",
            letterSpacing: "0.01em",
          }}
        >
          Start your profile — it's free →
        </button>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
          Private beta · 500+ verified professionals already inside
        </p>
      </motion.div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const SCENE_COMPONENTS = [
  ScenePrologue, SceneProblem, SceneMaahi, SceneSoulProfile,
  SceneMatch, SceneSoulKnock, SceneLifePreview, SceneEpilogue,
];

export function SimulationLanding() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [scene, setScene] = useState(0);
  const [dir, setDir] = useState(1);

  // Thin progress bar at top of bar
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(Math.floor(v * N), N - 1);
    if (next !== scene) {
      setDir(next > scene ? 1 : -1);
      setScene(next);
    }
  });

  const CurrentScene = SCENE_COMPONENTS[scene];
  const chap = CHAPTERS[scene];

  return (
    <>
      {/* Scroll container — N × 100vh gives us the scroll space */}
      <div ref={containerRef} style={{ height: `${N * 100}vh`, position: "relative" }}>
        {/* Sticky stage */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#030308" }}>

          {/* ── Stars ── */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Array.from({ length: 55 }, (_, i) => {
              const sz = (((i * 137) % 10) / 10) * 1.8 + 0.4;
              return (
                <div
                  key={i}
                  className="bd-star"
                  style={{
                    position: "absolute",
                    left: `${(i * 17.3) % 100}%`,
                    top: `${(i * 13.7) % 100}%`,
                    width: sz, height: sz,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.55)",
                    animationDelay: `${(i * 0.37) % 5}s`,
                    animationDuration: `${2.2 + (i % 5) * 0.6}s`,
                  }}
                />
              );
            })}
          </div>

          {/* ── Scene ambient tint (transitions smoothly between scenes) ── */}
          <motion.div
            aria-hidden
            animate={{ background: `radial-gradient(ellipse 68% 50% at 50% 50%, ${TINTS[scene]} 0%, transparent 68%)` }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />

          {/* ────────────────── TOP BAR ────────────────── */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: BAR_H,
            background: "rgba(3,3,8,0.94)", backdropFilter: "blur(14px)",
            zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>
                BIGG<span style={{ color: "#d4688a" }}>DATE</span>
              </span>
            </button>

            {/* Animated progress line */}
            <motion.div
              style={{
                position: "absolute", bottom: 0, left: 0, height: 1.5,
                background: `linear-gradient(to right, ${ACCENT[scene]}, ${ACCENT[(scene + 1) % N]})`,
                width: barWidth,
              }}
            />

            {/* Skip */}
            <button
              onClick={() => router.push("/onboarding")}
              style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em" }}
            >
              Skip to signup →
            </button>
          </div>

          {/* ────────────────── SCENE CONTENT ────────────────── */}
          <div style={{ position: "absolute", top: BAR_H, bottom: BAR_H, left: 0, right: 0 }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={scene}
                custom={dir}
                variants={SCENE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.44, ease: EASE }}
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <CurrentScene />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ────────────────── PROGRESS DOTS (right side) ────────────────── */}
          <div style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 7, zIndex: 50,
          }}>
            {CHAPTERS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === scene ? 3 : 2.5,
                  height: i === scene ? 26 : 8,
                  background: i === scene ? ACCENT[scene] : "rgba(255,255,255,0.17)",
                  boxShadow: i === scene ? `0 0 10px ${ACCENT[scene]}` : "none",
                }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ borderRadius: 99 }}
              />
            ))}
          </div>

          {/* ────────────────── BOTTOM BAR ────────────────── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: BAR_H,
            background: "rgba(3,3,8,0.94)", backdropFilter: "blur(14px)",
            zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            {/* Chapter label — animates on scene change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.28 }}
                style={{ display: "flex", gap: 10, alignItems: "center" }}
              >
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {chap.num}
                </span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.06)" }}>—</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 500 }}>
                  {chap.title}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Scene counter */}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.1em" }}>
              {String(scene + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        .bd-star {
          animation: simStar linear infinite;
        }
        @keyframes simStar {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
