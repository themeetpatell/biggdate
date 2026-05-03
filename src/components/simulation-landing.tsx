"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRouter } from "next/navigation";

// ── Constants ───────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const SLAM = [0.2, 1, 0.2, 1] as const;

// Ambient tints crossfade as you scroll — color-grading the whole page
// like a movie trailer. Each entry is the room light for that chapter.
const TINTS = [
  "rgba(224, 171, 77, 0.20)",   // 0  prologue       — amber dusk
  "rgba(255, 70, 70, 0.16)",    // 1  problem        — red distress
  "rgba(124, 58, 237, 0.18)",   // 2  maahi          — violet awakening
  "rgba(212, 104, 138, 0.18)",  // 3  soul profile   — rose
  "rgba(212, 104, 138, 0.24)",  // 4  match          — pink intensifies
  "rgba(245, 158, 11, 0.22)",   // 5  soul knock     — amber action
  "rgba(79, 255, 176, 0.16)",   // 6  life preview   — green hope
  "rgba(255, 140, 184, 0.28)",  // 7  epilogue       — climax
];

const CHAPTERS = [
  { num: "01", label: "Prologue",   title: "Three months in",          color: "#e2b159" },
  { num: "02", label: "Chapter I",  title: "Why none of it worked",    color: "#ff6b6b" },
  { num: "03", label: "Chapter II", title: "Meet Maahi",               color: "#a78bfa" },
  { num: "04", label: "Chapter III", title: "The version no app saw",  color: "#d4688a" },
  { num: "05", label: "Chapter IV", title: "She's been looking too",   color: "#ff8cb8" },
  { num: "06", label: "Chapter V",  title: "One real opener",          color: "#f59e0b" },
  { num: "07", label: "Chapter VI", title: "Six months in",            color: "#4FFFB0" },
  { num: "08", label: "Epilogue",   title: "Yours is the next one",    color: "#ff8cb8" },
];

// Approx fixed marketing header height — keeps prologue content out from under it.
const HEADER_OFFSET = 96;

// ── Hooks ───────────────────────────────────────────────────────────────────

// Cross-dissolve a section based on its own viewport progress.
// Opacity ramps in over the first 18% of the section's traverse and out over
// the last 18% — adjacent sections overlap, producing trailer-style cuts.
function useSceneFade(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  // Slight scale "push in" as the section travels — Ken-Burns camera creep.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.04]);
  return { opacity, y, scale, scrollYProgress };
}

// ── Kinetic typography helper ───────────────────────────────────────────────

function kineticWords(
  text: string,
  baseDelay = 0,
  stagger = 0.055,
  style?: CSSProperties,
) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <motion.span
      key={`${text}-${i}`}
      initial={{ opacity: 0, y: 38, rotateX: -55, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.82, delay: baseDelay + i * stagger, ease: EASE }}
      style={{ display: "inline-block", whiteSpace: "pre", transformOrigin: "50% 100%", ...style }}
    >
      {w}
      {i < words.length - 1 ? " " : ""}
    </motion.span>
  ));
}

// ── Animated digit counter ──────────────────────────────────────────────────

function DigitCounter({
  to,
  duration = 2200,
  format = (n: number) => n.toLocaleString(),
  style,
  startWhen = true,
}: {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  style?: CSSProperties;
  startWhen?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || !startWhen) return;
    const start = Date.now();
    const id = setInterval(() => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * e));
      if (t >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, to, duration, startWhen]);
  return <span ref={ref} style={style}>{format(n)}</span>;
}

// ── Particle burst (radial spray on key reveals) ────────────────────────────

function ParticleBurst({
  count = 18,
  color = "#fff",
  size = 3,
  spread = 180,
  duration = 1.4,
  trigger,
}: {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  duration?: number;
  trigger: boolean;
}) {
  if (!trigger) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + (i * 0.13);
        const r = spread * (0.55 + (i % 5) * 0.12);
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 0.95, scale: 1.3 }}
            animate={{
              x: Math.cos(a) * r,
              y: Math.sin(a) * r,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration, ease: "easeOut", delay: (i % 6) * 0.02 }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${size * 4}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── White flash on chapter entry (light-leak / cut feel) ────────────────────

function ChapterFlash({ color = "#fff", trigger }: { color?: string; trigger: boolean }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={trigger ? { opacity: [0, 0.22, 0] } : { opacity: 0 }}
      transition={{ duration: 0.7, times: [0, 0.18, 1], ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        pointerEvents: "none",
        mixBlendMode: "screen",
        zIndex: 10,
      }}
    />
  );
}

// ── Chapter title stamp (slams in at the top of each scene) ─────────────────

function ChapterStamp({
  num,
  label,
  title,
  color,
  align = "center",
}: {
  num: string;
  label: string;
  title: string;
  color: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: SLAM }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: 14,
        marginBottom: 28,
      }}
    >
      <motion.span
        initial={{ scale: 0.5, letterSpacing: "0.4em", opacity: 0 }}
        whileInView={{ scale: 1, letterSpacing: "-0.04em", opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.68, ease: SLAM }}
        style={{
          fontSize: 56,
          fontWeight: 900,
          color,
          lineHeight: 0.9,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 28px ${color}55`,
        }}
      >
        {num}
      </motion.span>
      <span style={{ width: 1, height: 36, background: `linear-gradient(to bottom, transparent, ${color}88, transparent)` }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.42)", textTransform: "uppercase", letterSpacing: "0.32em", fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700 }}>
          {title}
        </span>
      </div>
    </motion.div>
  );
}

// ── Section frame ───────────────────────────────────────────────────────────

function SceneSection({
  ref,
  children,
  paddingTop = 0,
  flashColor,
}: {
  ref: RefObject<HTMLElement | null>;
  children: ReactNode;
  paddingTop?: number;
  flashColor?: string;
}) {
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ChapterFlash trigger={inView && !!flashColor} color={flashColor} />
      {children}
    </section>
  );
}

// ── Utility: typewriter text ────────────────────────────────────────────────

function TypewriterText({ text, delay = 0, start }: { text: string; delay?: number; start: boolean }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
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
  }, [text, delay, start]);
  return <>{shown}{!done && <span style={{ opacity: 0.55 }}>|</span>}</>;
}

// ── Scene 0: Prologue — "The Old World" ─────────────────────────────────────

const RAIN_WORDS = [
  "swipe →", "← nope", "hey", "hey", "hey!",
  "matched!", "👻 ghosted", "unmatched", "❌", "no reply",
  "swipe →", "← skip", "try again", "💔 ghosted", "hey",
  "matched!", "unmatch", "swipe →", "← nope", "hey",
  "K", "lol", "hey", "u up?", "nm u",
  "?", "ghosted", "blocked", "swipe →", "← pass",
  "hey hey", "you there?", "whyyy", "...", "delete",
  "deleted", "match", "unmatch", "swipe →", "tinder",
];

function ScenePrologue() {
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const c = CHAPTERS[0];

  return (
    <SceneSection ref={ref} paddingTop={HEADER_OFFSET} flashColor="#e2b15922">
      {/* Decorative rain — denser, depth-layered */}
      <motion.div
        aria-hidden
        style={{
          opacity,
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {RAIN_WORDS.map((w, i) => {
          const layer = i % 3; // 0 = far, 1 = mid, 2 = close
          const fz = layer === 0 ? 9 : layer === 1 ? 11 : 14;
          const op = layer === 0 ? 0.14 : layer === 1 ? 0.22 : 0.32;
          return (
            <motion.span
              key={i}
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: "115vh", opacity: [0, op, op, 0] }}
              transition={{
                duration: layer === 0 ? 8 : layer === 1 ? 6 : 4.2,
                delay: i * 0.18,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                left: `${(i * 7.13) % 96 + 1}%`,
                fontSize: fz,
                color: i % 5 === 0 ? "rgba(255,80,80,0.55)" : `rgba(255,255,255,${op + 0.05})`,
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                filter: layer === 0 ? "blur(1px)" : "none",
              }}
            >
              {w}
            </motion.span>
          );
        })}
      </motion.div>

      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 760,
          padding: "0 28px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.55em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.18em" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ fontSize: 11, textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 56, fontWeight: 500 }}
        >
          BiggDate presents
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 56 }}>
          {[
            { val: 3_200_000_000, label: "swipes today",       big: false, color: "rgba(255,255,255,0.55)" },
            { val: 847,           label: "matches this year",  big: false, color: "rgba(255,255,255,0.55)" },
            { val: 0,             label: "of them stayed",     big: true,  color: "#ff5555" },
          ].map(({ val, label, big, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.78, delay: 0.4 + i * 0.22, ease: EASE }}
              style={{ display: "flex", alignItems: "baseline", gap: 10, position: "relative" }}
            >
              {big && (
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  style={{
                    position: "absolute", left: -18, top: -10, right: -18, bottom: -10,
                    borderRadius: 20,
                    boxShadow: `0 0 60px ${color}, inset 0 0 30px ${color}33`,
                    pointerEvents: "none",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: big ? 76 : 30,
                  fontWeight: 900,
                  color,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: big ? "-0.04em" : "-0.02em",
                  textShadow: big ? `0 0 32px ${color}` : "none",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <DigitCounter
                  to={val}
                  duration={big ? 1600 : 2400}
                  format={big ? (n) => String(n) : (n) => n.toLocaleString()}
                />
              </span>
              <span style={{ fontSize: big ? 16 : 14, color: "rgba(255,255,255,0.34)" }}>{label}</span>
            </motion.div>
          ))}
        </div>

        <h1 style={{ fontSize: "clamp(40px, 6.4vw, 84px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: 0, maxWidth: 700, letterSpacing: "-0.035em", perspective: 800 }}>
          {kineticWords("There has to be", 1.45, 0.06)}
          <br />
          {kineticWords("a better way.", 1.85, 0.07, { color: "#d4688a", textShadow: "0 0 30px rgba(212,104,138,0.6)" })}
        </h1>
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 1: The Problem ────────────────────────────────────────────────────

const GHOST_CARDS = [
  { name: "Aariv, 28 · VC Analyst",   when: "14 months ago", outcome: "👻  Ghosted after 3 messages" },
  { name: "Ananya, 31 · Founder",     when: "9 months ago",  outcome: "🔴  Never responded" },
  { name: "Riya, 27 · Product Lead",  when: "6 weeks ago",   outcome: "❌  Unmatched before coffee" },
];

function SceneProblem() {
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const c = CHAPTERS[1];

  return (
    <SceneSection ref={ref} flashColor="#ff444433">
      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 600,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <h2 style={{ fontSize: "clamp(30px, 4.8vw, 64px)", fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.1, margin: "0 0 44px", maxWidth: 580, letterSpacing: "-0.028em", perspective: 800 }}>
          {kineticWords("The apps weren’t built", 0.1, 0.05)}
          <br />
          {kineticWords("for people", 0.4, 0.05)}{" "}
          {kineticWords("like you.", 0.6, 0.07, { color: "#ff6b6b", textShadow: "0 0 28px rgba(255,107,107,0.55)" })}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480 }}>
          {GHOST_CARDS.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, delay: 0.6 + i * 0.18, ease: EASE }}
              style={{
                position: "relative",
                borderRadius: 16,
                border: "1px solid rgba(255,70,70,0.22)",
                background: "rgba(255,40,40,0.05)",
                padding: "14px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                overflow: "hidden",
              }}
            >
              {/* Pulsing red edge */}
              <motion.div
                aria-hidden
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
                  background: "linear-gradient(to bottom, transparent, #ff4444, transparent)",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{card.when}</p>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,110,110,0.78)", flexShrink: 0, textAlign: "right" }}>{card.outcome}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          style={{ marginTop: 36, fontSize: 15, color: "rgba(255,255,255,0.34)", fontStyle: "italic", textAlign: "center" }}
        >
          You deserve better than a stranger and a gamble.
        </motion.p>
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 2: Enter Maahi ────────────────────────────────────────────────────

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
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const c = CHAPTERS[2];

  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timers = CHAT_MS.map((d, i) => setTimeout(() => setVisible(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <SceneSection ref={ref} flashColor="#a78bfa44">
      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 520,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        {/* Avatar with pulsating aura */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          {/* Outer aura rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              aria-hidden
              animate={inView ? { scale: [1, 2.4], opacity: [0.4, 0] } : {}}
              transition={{ duration: 2.6, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute", inset: 0,
                width: 72, height: 72, borderRadius: "50%",
                border: "1px solid rgba(167,139,250,0.4)",
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.2, opacity: 0, rotate: -180 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: SLAM }}
            style={{
              position: "relative",
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #d4688a, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30,
              boxShadow: "0 0 0 8px rgba(124,58,237,0.10), 0 0 64px rgba(124,58,237,0.55)",
              zIndex: 1,
            }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block" }}
            >
              ✨
            </motion.span>
          </motion.div>

          <ParticleBurst trigger={inView} count={20} color="#d4688a" size={3} spread={140} duration={1.7} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 10, color: "rgba(212,104,138,0.65)", marginBottom: 32, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700 }}
        >
          Maahi · AI Guide
        </motion.p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 440 }}>
          {CHAT_LINES.slice(0, visible).map((msg, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: msg.from === "user" ? 30 : -30,
                y: 14,
                scale: 0.88,
                filter: "blur(6px)",
              }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                padding: "11px 16px",
                borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.from === "user"
                  ? "linear-gradient(135deg, #7c3aed, #d4688a)"
                  : "rgba(255,255,255,0.08)",
                border: msg.from === "maahi" ? "1px solid rgba(167,139,250,0.18)" : "none",
                fontSize: 14, color: "#fff", lineHeight: 1.47,
                boxShadow: msg.from === "user"
                  ? "0 12px 32px rgba(124,58,237,0.35)"
                  : "0 6px 24px rgba(0,0,0,0.25)",
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 3: Soul Profile ───────────────────────────────────────────────────

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
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const c = CHAPTERS[3];

  const [pct, setPct] = useState(0);
  const [tagN, setTagN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 2800;
    const id = setInterval(() => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setPct(e);
      if (t >= 1) clearInterval(id);
    }, 16);
    const timers = SOUL_TAGS.map((_, i) => setTimeout(() => setTagN(i + 1), 600 + i * 240));
    return () => { clearInterval(id); timers.forEach(clearTimeout); };
  }, [inView]);

  const R = 86, SZ = 200, CX = SZ / 2, CY = SZ / 2;
  const CIRC = 2 * Math.PI * R;

  return (
    <SceneSection ref={ref} flashColor="#7c3aed33">
      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 520,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.92, ease: SLAM }}
          style={{ position: "relative", marginBottom: 36 }}
        >
          {/* Outer rotating dashed orbit */}
          <motion.div
            aria-hidden
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: -18,
              borderRadius: "50%",
              border: "1px dashed rgba(167,139,250,0.28)",
            }}
          />
          {/* Inner pulse */}
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 18,
              borderRadius: "50%",
              boxShadow: "inset 0 0 80px rgba(124,58,237,0.5)",
            }}
          />

          <svg width={SZ} height={SZ} style={{ transform: "rotate(-90deg)", display: "block" }}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={14} />
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="url(#soulGrad)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - pct)}
              style={{ filter: "drop-shadow(0 0 12px rgba(212,104,138,0.5))" }}
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
            <motion.p
              animate={pct >= 1 ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.6 }}
              style={{ margin: 0, fontSize: 38, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}
            >
              {Math.round(pct * 100)}%
            </motion.p>
            <p style={{ margin: "2px 0 0", fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700 }}>soul match</p>
          </div>

          <ParticleBurst trigger={inView} count={26} color="#d4688a" size={2.5} spread={170} duration={1.8} />
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 460 }}>
          {SOUL_TAGS.slice(0, tagN).map((tag) => (
            <motion.span
              key={tag.label}
              initial={{ opacity: 0, scale: 0.5, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: SLAM }}
              style={{
                padding: "6px 14px", borderRadius: 999,
                border: `1px solid ${tag.color}40`, background: `${tag.color}14`,
                fontSize: 11.5, color: tag.color, fontWeight: 700,
                boxShadow: `0 4px 18px ${tag.color}22`,
                letterSpacing: "0.01em",
              }}
            >
              {tag.label}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 4: The Match ──────────────────────────────────────────────────────

const SIGNALS = [
  { label: "Values",        text: "Both prioritize depth over breadth",        color: "#4FFFB0" },
  { label: "Communication", text: "Both need processing time before reacting", color: "#d4688a" },
  { label: "Life Direction","text": "Both building something that lasts",       color: "#f59e0b" },
];

function SceneMatch() {
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const c = CHAPTERS[4];

  const [revealed, setRevealed] = useState(false);
  const [sigN, setSigN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRevealed(true), 1700);
    return () => clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    if (!revealed) return;
    const timers = SIGNALS.map((_, i) => setTimeout(() => setSigN(i + 1), i * 400));
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  return (
    <SceneSection ref={ref} flashColor="#ff8cb844">
      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 520,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <motion.div
          initial={{ scale: 0.82, opacity: 0, rotateY: -25 }}
          whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.78, ease: SLAM }}
          style={{
            position: "relative",
            width: "100%", maxWidth: 420, borderRadius: 28,
            border: revealed ? "1px solid rgba(255,140,184,0.36)" : "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(145deg, rgba(22,16,30,0.98), rgba(12,9,20,0.99))",
            padding: "28px 24px",
            boxShadow: revealed
              ? "0 50px 130px rgba(255,140,184,0.25), 0 0 0 1px rgba(255,140,184,0.08)"
              : "0 28px 70px rgba(0,0,0,0.7)",
            transition: "border-color 0.55s, box-shadow 0.55s",
            perspective: 800,
          }}
        >
          {/* Holographic shimmer when revealed */}
          {revealed && (
            <motion.div
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                borderRadius: 28,
                pointerEvents: "none",
              }}
            />
          )}

          {!revealed ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "20px 0", position: "relative" }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(255,140,184,0.10)", border: "1px solid rgba(255,140,184,0.26)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                  boxShadow: "0 0 40px rgba(255,140,184,0.3)",
                }}
              >🔒</motion.div>
              <p style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#fff" }}>Soul Match #1</p>
              <div style={{
                padding: "5px 16px", borderRadius: 999,
                background: "rgba(79,255,176,0.08)", border: "1px solid rgba(79,255,176,0.24)",
                fontSize: 12, color: "#4FFFB0", fontWeight: 700, letterSpacing: "0.06em",
              }}>87% harmony</div>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.5, letterSpacing: "0.04em" }}
              >
                Maahi is revealing your match…
              </motion.p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}
                  >
                    Arya, 29
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 }}
                    style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}
                  >
                    Mumbai · Product Designer
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, ease: SLAM }}
                  style={{
                    padding: "5px 13px", borderRadius: 999, flexShrink: 0,
                    background: "rgba(79,255,176,0.10)", border: "1px solid rgba(79,255,176,0.28)",
                    fontSize: 12, color: "#4FFFB0", fontWeight: 800, letterSpacing: "0.06em",
                  }}
                >
                  <DigitCounter to={87} duration={900} format={(n) => `${n}%`} />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  margin: 0, fontSize: 13.5, color: "rgba(255,140,184,0.92)", fontStyle: "italic", lineHeight: 1.6,
                  paddingLeft: 14, borderLeft: "2px solid rgba(255,140,184,0.4)",
                }}
              >
                &ldquo;She earns trust slowly and builds deep — and your complexity doesn&apos;t scare her one bit.&rdquo;
              </motion.p>

              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {SIGNALS.slice(0, sigN).map((s) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -22, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.42, ease: EASE }}
                    style={{ display: "flex", gap: 11, alignItems: "flex-start" }}
                  >
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "4px 10px",
                      borderRadius: 999, background: `${s.color}14`,
                      color: s.color, border: `1px solid ${s.color}30`,
                      flexShrink: 0, marginTop: 2,
                      letterSpacing: "0.04em",
                    }}>{s.label}</span>
                    <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <ParticleBurst trigger={revealed} count={32} color="#ff8cb8" size={3.5} spread={260} duration={2} />
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 5: The Soul Knock ─────────────────────────────────────────────────

function SceneSoulKnock() {
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const c = CHAPTERS[5];

  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase("sending"), 1500);
    const t2 = setTimeout(() => setPhase("sent"),    3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  return (
    <SceneSection ref={ref} flashColor="#f59e0b44">
      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 580,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <h2 style={{ fontSize: "clamp(28px, 4.4vw, 52px)", fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.15, margin: "0 0 40px", maxWidth: 560, letterSpacing: "-0.028em", perspective: 800 }}>
          {kineticWords("One intentional message.", 0.1, 0.05)}
          <br />
          {kineticWords("Not 47 “hey”s.", 0.55, 0.05, { color: "rgba(255,255,255,0.32)" })}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.4, duration: 0.7, ease: SLAM }}
          style={{
            position: "relative",
            width: "100%", maxWidth: 440,
            borderRadius: 22, border: "1px solid rgba(245,158,11,0.18)",
            background: "rgba(255,255,255,0.03)",
            padding: "22px",
            boxShadow: "0 30px 80px rgba(245,158,11,0.12)",
          }}
        >
          <p style={{ margin: "0 0 10px", fontSize: 10, color: "rgba(245,158,11,0.55)", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700 }}>
            Your intention for Arya
          </p>
          <div style={{
            borderRadius: 12, border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.04)", padding: "14px 16px",
            marginBottom: 16, minHeight: 88,
            fontSize: 13.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.6,
          }}>
            <TypewriterText
              text="I'm curious about what you're building. Most people work to escape. I think you work to arrive somewhere."
              delay={550}
              start={inView}
            />
          </div>

          <motion.button
            animate={{
              background: phase === "sent"
                ? "linear-gradient(135deg, #4FFFB0, #22d3ee)"
                : phase === "sending"
                ? "linear-gradient(135deg, #f59e0b, #d4688a)"
                : "linear-gradient(135deg, #ff8cb8, #d4688a)",
              scale: phase === "sending" ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: phase === "sending" ? 0.8 : 0.6, repeat: phase === "sending" ? Infinity : 0 }}
            style={{ width: "100%", padding: "14px 0", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 800, color: "#0A0A0F", letterSpacing: "0.04em" }}
          >
            {phase === "idle" ? "Send Soul Knock ✦" : phase === "sending" ? "Sending…" : "✓ Soul Knock Sent"}
          </motion.button>

          {phase === "sending" && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.18, opacity: 0.7 }}
                  animate={{ scale: 12, opacity: 0 }}
                  transition={{ duration: 3.2, delay: i * 0.36, ease: "easeOut" }}
                  style={{
                    position: "absolute", width: 60, height: 60, borderRadius: "50%",
                    border: "1px solid rgba(245,158,11,0.5)",
                    boxShadow: "0 0 40px rgba(245,158,11,0.3)",
                  }}
                />
              ))}
            </div>
          )}

          <ParticleBurst trigger={phase === "sent"} count={36} color="#4FFFB0" size={3} spread={280} duration={2} />
        </motion.div>
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 6: Life Preview ───────────────────────────────────────────────────

const MILESTONES = [
  { week: "Week 2",  icon: "☕", text: "First coffee. She was exactly like her profile. Better, actually." },
  { week: "Month 2", icon: "🌆", text: "She met your best friend last Thursday. They already follow each other." },
  { week: "Month 4", icon: "✈️", text: "You changed a travel plan. Not because you had to. Because you wanted to." },
  { week: "Month 6", icon: "🏠", text: "You're looking at apartments together. That's new for you." },
];

function SceneLifePreview() {
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const c = CHAPTERS[6];

  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timers = MILESTONES.map((_, i) => setTimeout(() => setCount(i + 1), 320 + i * 540));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <SceneSection ref={ref} flashColor="#4FFFB033">
      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 580,
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <h2 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.18, margin: "0 0 40px", maxWidth: 540, letterSpacing: "-0.025em", perspective: 800 }}>
          {kineticWords("See where it goes", 0.1, 0.05)}
          <br />
          {kineticWords("before you go there.", 0.5, 0.05, { color: "#4FFFB0", textShadow: "0 0 28px rgba(79,255,176,0.5)" })}
        </h2>

        <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
          {/* Timeline spine with light traveling through */}
          <div style={{
            position: "absolute", left: 25, top: 28, bottom: 28, width: 1,
            background: "linear-gradient(to bottom, rgba(79,255,176,0.6), rgba(79,255,176,0.05))",
          }} />
          {inView && (
            <motion.div
              aria-hidden
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              style={{
                position: "absolute", left: 22, width: 7, height: 60,
                borderRadius: 999,
                background: "linear-gradient(to bottom, transparent, #4FFFB0, transparent)",
                filter: "blur(3px)",
              }}
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {MILESTONES.slice(0, count).map((m, i) => (
              <motion.div
                key={m.week}
                initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ display: "flex", gap: 16, alignItems: "flex-start", position: "relative" }}
              >
                <motion.div
                  animate={i === count - 1 ? { boxShadow: ["0 0 0 rgba(79,255,176,0)", "0 0 32px rgba(79,255,176,0.6)", "0 0 0 rgba(79,255,176,0)"] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(79,255,176,0.10)", border: "1px solid rgba(79,255,176,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0, zIndex: 1,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {m.icon}
                </motion.div>
                <div style={{ paddingTop: 6 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 10, color: "#4FFFB0", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.16em" }}>
                    {m.week}
                  </p>
                  <p style={{ margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>
                    {m.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </SceneSection>
  );
}

// ── Scene 7: Epilogue ───────────────────────────────────────────────────────

function SceneEpilogue() {
  const ref = useRef<HTMLElement>(null);
  const { opacity, y, scale } = useSceneFade(ref);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const router = useRouter();
  const c = CHAPTERS[7];

  return (
    <SceneSection ref={ref} flashColor="#ff8cb855">
      {/* Love glow */}
      <motion.div
        aria-hidden
        style={{
          opacity,
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 75% 55% at 50% 52%, rgba(255,140,184,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Orbiting micro-orbs */}
      <motion.div
        aria-hidden
        style={{ opacity, position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[
          { w: 220, h: 220, c: "rgba(255,140,184,0.12)", dur: 14 },
          { w: 360, h: 360, c: "rgba(212,104,138,0.09)", dur: 22 },
          { w: 540, h: 540, c: "rgba(124,58,237,0.07)",  dur: 32 },
          { w: 780, h: 780, c: "rgba(79,255,176,0.04)",  dur: 42 },
        ].map(({ w, h, c, dur }, i) => (
          <motion.div
            key={i}
            animate={{ rotate: [0, i % 2 === 0 ? 360 : -360] }}
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
      </motion.div>

      {/* Floating hearts */}
      {inView && (
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {Array.from({ length: 14 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ y: "110vh", opacity: 0, scale: 0.4 + (i % 4) * 0.2 }}
              animate={{ y: "-15vh", opacity: [0, 0.7, 0.7, 0] }}
              transition={{
                duration: 8 + (i % 5) * 1.5,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                left: `${(i * 13.7) % 96 + 2}%`,
                fontSize: 10 + (i % 4) * 4,
                color: i % 3 === 0 ? "#ff8cb8" : i % 3 === 1 ? "#d4688a" : "#a78bfa",
                filter: i % 2 === 0 ? "blur(0.5px)" : "none",
              }}
            >
              ♥
            </motion.span>
          ))}
        </div>
      )}

      <motion.div
        style={{
          opacity, y, scale,
          position: "relative",
          width: "100%",
          maxWidth: 760,
          padding: "0 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChapterStamp {...c} />

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.22em" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4 }}
          style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", marginBottom: 44, fontWeight: 600 }}
        >
          ✦ The End — And The Beginning
        </motion.p>

        <h1 style={{ fontSize: "clamp(36px, 6.4vw, 84px)", fontWeight: 900, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", maxWidth: 760, letterSpacing: "-0.04em", perspective: 800 }}>
          {kineticWords("Every great love story", 0.2, 0.06)}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 30, scale: 0.92, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, delay: 1, ease: SLAM }}
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff8cb8 0%, #d4688a 50%, #7c3aed 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            } as CSSProperties}
          >
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #ff8cb8 0%, #d4688a 50%, #7c3aed 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              } as CSSProperties}
            >
              had a first conversation.
            </motion.span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 1.6, ease: EASE }}
          style={{ fontSize: "clamp(17px, 2.5vw, 24px)", color: "rgba(255,255,255,0.5)", margin: "0 0 64px", maxWidth: 360, fontWeight: 400 }}
        >
          Yours is waiting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 2.0, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}
        >
          {/* Pulse halo behind CTA */}
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.05, 0.45] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
              width: 280, height: 56, borderRadius: 999,
              boxShadow: "0 0 60px rgba(212,104,138,0.55)",
              pointerEvents: "none",
            }}
          />

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/onboarding")}
            style={{
              position: "relative",
              padding: "18px 56px", borderRadius: 999,
              fontSize: 16, fontWeight: 800, color: "#0A0A0F",
              background: "linear-gradient(135deg, #ff8cb8 0%, #d4688a 50%, #7c3aed 100%)",
              border: "none", cursor: "pointer",
              boxShadow: "0 28px 80px rgba(212,104,138,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset",
              letterSpacing: "0.02em",
            }}
          >
            Start your profile — it&apos;s free →
          </motion.button>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", margin: 0, letterSpacing: "0.02em" }}>
            Private beta · 500+ verified professionals already inside
          </p>
        </motion.div>
      </motion.div>
    </SceneSection>
  );
}

// ── Persistent cinematic backdrop ───────────────────────────────────────────

function CinematicBackdrop({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const tintColor = useTransform(
    scrollYProgress,
    TINTS.map((_, i) => i / (TINTS.length - 1)),
    TINTS,
  );
  const tintBg = useTransform(
    tintColor,
    (c) => `radial-gradient(ellipse 80% 60% at 50% 50%, ${c} 0%, transparent 70%)`,
  );

  // Subtle camera "push in" on the ambient layer
  const ambientScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // Light ray rotation tied to scroll — cinematic drift
  const rayRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);
  // Vignette intensifies slightly toward the middle, eases at edges
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 0.7, 0.55]);

  // Memoize particle positions so they don't reshuffle on every render
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: (i * 17.13) % 100,
        top: (i * 23.7) % 100,
        size: 1 + ((i * 37) % 20) / 10,
        dur: 9 + (i % 6) * 2.2,
        delay: (i * 0.41) % 7,
        drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 10),
      })),
    [],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: (i * 17.3) % 100,
        top: (i * 13.7) % 100,
        size: (((i * 137) % 10) / 10) * 1.8 + 0.4,
        delay: (i * 0.37) % 5,
        dur: 2.2 + (i % 5) * 0.6,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        width: "100%",
        marginBottom: "-100vh",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Base gradient bg */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #0a0807 0%, #14110b 50%, #050403 100%)",
        }}
      />

      {/* Stars (slowly drifting in) */}
      <motion.div style={{ position: "absolute", inset: 0, scale: ambientScale }}>
        {stars.map((s, i) => (
          <div
            key={i}
            className="bd-star"
            style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "rgba(255,225,172,0.55)",
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              boxShadow: s.size > 1.4 ? "0 0 6px rgba(255,225,172,0.4)" : "none",
            }}
          />
        ))}
      </motion.div>

      {/* Floating dust particles */}
      <div style={{ position: "absolute", inset: 0 }}>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, x: 0 }}
            animate={{ y: [-30, 30, -30], x: [-p.drift / 2, p.drift / 2, -p.drift / 2] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(255,225,172,0.3)",
              boxShadow: "0 0 4px rgba(255,225,172,0.4)",
              filter: p.size > 2 ? "blur(0.5px)" : "none",
            }}
          />
        ))}
      </div>

      {/* Light rays */}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "180vmax",
          height: "180vmax",
          transform: "translate(-50%, -50%)",
          rotate: rayRotate,
          mixBlendMode: "screen",
          opacity: 0.45,
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: i % 2 === 0 ? 1.5 : 0.8,
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              transformOrigin: "50% 50%",
              background: `linear-gradient(to bottom, transparent 0%, rgba(255,225,172,${0.04 + (i % 3) * 0.02}) 45%, rgba(255,225,172,${0.02 + (i % 3) * 0.01}) 55%, transparent 100%)`,
              filter: "blur(1.5px)",
            }}
          />
        ))}
      </motion.div>

      {/* Top + bottom warm glow */}
      <div
        style={{
          position: "absolute", inset: 0,
          background:
            "radial-gradient(circle at 50% 0%, rgba(255, 199, 102, 0.12) 0%, transparent 36%), radial-gradient(circle at 50% 100%, rgba(66, 39, 21, 0.30) 0%, transparent 50%)",
        }}
      />

      {/* Scroll-driven ambient tint */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          background: tintBg,
        }}
      />

      {/* Cinematic vignette */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 50%, rgba(0,0,0,1) 100%)",
          opacity: vignetteOpacity,
        }}
      />

      {/* Film grain */}
      <motion.div
        className="bd-grain"
        style={{
          position: "absolute", inset: 0,
          scale: ambientScale,
          opacity: 0.10,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
        }}
      />

      {/* Subtle scanlines */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(255,255,255,0.025) 3px, transparent 4px)",
          mixBlendMode: "overlay",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Camera frame brackets (corner crop marks) */}
      {([
        { top: 24, left: 24, deg: 0 },
        { top: 24, right: 24, deg: 90 },
        { bottom: 24, right: 24, deg: 180 },
        { bottom: 24, left: 24, deg: 270 },
      ] as const).map(({ deg, ...pos }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 18, height: 18,
            transform: `rotate(${deg}deg)`,
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, width: 14, height: 1.5, background: "rgba(255,225,172,0.32)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: 1.5, height: 14, background: "rgba(255,225,172,0.32)" }} />
        </div>
      ))}
    </div>
  );
}

// ── Top scroll progress hairline ────────────────────────────────────────────

function ScrollProgressBar({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 2,
        background: "linear-gradient(to right, #d4688a, #f59e0b, #4FFFB0)",
        boxShadow: "0 0 12px rgba(212,104,138,0.6)",
        scaleX: scrollYProgress,
        transformOrigin: "0% 50%",
        width: "100%",
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export function SimulationLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <CinematicBackdrop scrollYProgress={scrollYProgress} />
      <ScrollProgressBar scrollYProgress={scrollYProgress} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <ScenePrologue />
        <SceneProblem />
        <SceneMaahi />
        <SceneSoulProfile />
        <SceneMatch />
        <SceneSoulKnock />
        <SceneLifePreview />
        <SceneEpilogue />
      </div>

      <style>{`
        .bd-star { animation: simStar linear infinite; }
        @keyframes simStar {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
