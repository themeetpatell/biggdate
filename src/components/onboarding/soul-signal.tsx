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
 * Compute an SVG arc path segment.
 * Angles in degrees, 0° = top, clockwise.
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
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

  // 8 segments of 40° each with 5° gap (startDeg = i*45+2.5, endDeg = i*45+42.5)
  const segments = Array.from({ length: 8 }, (_, i) => ({
    path: describeArc(14, 14, 10, i * 45 + 2.5, i * 45 + 42.5),
    filled: i < completed,
    label: SECTOR_LABELS[i],
  }));

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center"
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
              animate={{
                stroke: seg.filled ? color : "rgba(255,255,255,0.12)",
              }}
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
              background: "rgba(20,20,20,0.88)",
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
