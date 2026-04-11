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
