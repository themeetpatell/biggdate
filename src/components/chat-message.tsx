"use client";

import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react"; // used by legacy ChatMessage
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
  return text
    .replace(/\[CHIPS:[^\]]*\]/g, "")
    .replace(/\[MULTISELECT:[^\]]*\]/g, "")
    .replace(/\[AGERANGE\]/g, "")
    .replace(/\[DATEPICKER\]/g, "")
    .trim();
}

/**
 * Extract an embedded "[NOTICE] ..." from anywhere in the text.
 * Returns the notice string and the remaining message with the tag removed.
 */
function extractNotice(text: string): { notice: string | null; remaining: string } {
  const match = text.match(/\[NOTICE\]\s*([^\n[]+)/);
  if (!match) return { notice: null, remaining: text };
  return {
    notice: match[1].trim(),
    remaining: text.replace(match[0], "").trim(),
  };
}

interface OnboardingMessageProps {
  message: UIMessage;
  act: Act;
}

export function OnboardingMessage({ message, act }: OnboardingMessageProps) {
  const raw = getMessageText(message);
  const cleaned = stripChips(raw);
  const color = ACT_COLORS[act];

  if (!cleaned) return null;

  // User message — right-aligned gradient pill
  if (message.role === "user") {
    return (
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, x: 10, y: 4 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="max-w-[68%] px-5 py-3 text-[15px] leading-relaxed text-white"
          style={{
            background: "linear-gradient(135deg, #e8927c, #d4688a)",
            borderRadius: "22px 5px 22px 22px",
            boxShadow:
              "0 4px 20px rgba(212,104,138,0.28), 0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          {cleaned}
        </div>
      </motion.div>
    );
  }

  // AI message — extract any embedded [NOTICE] then render notice + text
  const { notice, remaining } = extractNotice(cleaned);

  return (
    <>
      {notice && (
        <motion.div
          className="py-1 text-center text-[13px] italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 0.6 }}
          style={{ color, textShadow: `0 0 16px ${color}40` }}
        >
          {notice}
        </motion.div>
      )}
      {remaining && (
        <motion.div
          className="flex items-start gap-3 pr-14"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mt-[10px] flex-shrink-0">
            <motion.div
              className="size-[6px] rounded-full"
              style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.2, 0.85] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p
            className="flex-1 text-[16px] leading-[1.8]"
            style={{ color: "var(--bd-text)" }}
          >
            {remaining}
          </p>
        </motion.div>
      )}
    </>
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
