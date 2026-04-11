"use client";

import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
  const trimmed = text.trimStart();
  if (trimmed.startsWith("[NOTICE]")) {
    return { isNotice: true, text: trimmed.replace("[NOTICE]", "").trim() };
  }
  return { isNotice: false, text: trimmed };
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

  // Check for [NOTICE] variant
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

// ── Legacy bubble-style component used by /coach and /companion ────────────

export function ChatMessage({ message }: { message: UIMessage }) {
  const text = getMessageText(message);
  if (!text) return null;

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[75%] px-4 py-2.5 text-[14.5px] leading-relaxed"
          style={{
            background: "linear-gradient(135deg, rgba(232,146,124,0.92), rgba(212,104,138,0.88))",
            color: "#fff",
            borderRadius: "20px 4px 20px 20px",
            boxShadow: "0 8px 24px rgba(212,104,138,0.2)",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5">
      <div
        className="mb-1 flex size-6 shrink-0 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(123,159,255,0.2), rgba(212,104,138,0.15))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Sparkles className="size-3 text-white/60" />
      </div>
      <div
        className="max-w-[80%] px-4 py-2.5 text-[14.5px] leading-relaxed"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--bd-text)",
          borderRadius: "4px 20px 20px 20px",
          backdropFilter: "blur(16px)",
        }}
      >
        {text}
      </div>
    </div>
  );
}
