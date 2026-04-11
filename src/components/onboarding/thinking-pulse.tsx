import { motion } from "framer-motion";
import { ACT_COLORS, type Act } from "./ambient-layer";

export function ThinkingPulse({ act }: { act: Act }) {
  const color = ACT_COLORS[act];
  return (
    // Align dot with the presence indicator used in AI messages (gap-3 row, mt-[10px])
    <div className="flex items-start gap-3 py-2 pr-14">
      <div className="mt-[10px] flex-shrink-0">
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 8px ${color}90`,
          }}
        />
      </div>
    </div>
  );
}
