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
