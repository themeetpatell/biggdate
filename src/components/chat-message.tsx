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

  // User message — right-aligned gradient bubble
  if (message.role === "user") {
    return (
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, x: 8, y: 4 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="max-w-[72%] px-4 py-2.5 text-[15px] leading-relaxed text-white"
          style={{
            background: "linear-gradient(135deg, #e8927c, #d4688a)",
            borderRadius: "18px 4px 18px 18px",
            boxShadow: "0 2px 12px rgba(212,104,138,0.25)",
          }}
        >
          {cleaned}
        </div>
      </motion.div>
    );
  }

  // Check for [NOTICE] variant
  const { isNotice, text: noticeText } = parseNotice(cleaned);

  if (isNotice) {
    const color = ACT_COLORS[act];
    return (
      <motion.div
        className="py-1 text-center text-[13px] italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 0.6 }}
        style={{ color, textShadow: `0 0 16px ${color}40` }}
      >
        {noticeText}
      </motion.div>
    );
  }

  // AI message — left-aligned dark glass bubble
  return (
    <motion.div
      className="flex items-end gap-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="max-w-[78%] px-4 py-3 text-[15px] leading-relaxed"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "4px 18px 18px 18px",
          color: "var(--bd-text)",
          backdropFilter: "blur(12px)",
        }}
      >
        {cleaned}
      </div>
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
