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
      {([1, 2, 3, 4, 5] as const).map((a) => (
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
