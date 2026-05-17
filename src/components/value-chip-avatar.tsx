"use client";

import { useMemo } from "react";

// Tiny deterministic 32-bit hash (FNV-1a variant). Same name always renders
// the same avatar across sessions and devices. NOT cryptographic.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Curated brand-tinted palette so avatars always feel on-brand.
const BRAND_HUES: Array<[number, number, number]> = [
  [338, 70, 64], // rose-warm
  [262, 85, 70], // lavender
  [222, 80, 64], // blue
  [165, 65, 62], // mint
  [42,  82, 64], // gold
  [318, 70, 66], // pink
];

function pickHue(seed: number, offset: number): string {
  const idx = (seed + offset) % BRAND_HUES.length;
  const [h, s, l] = BRAND_HUES[idx];
  return `hsl(${h} ${s}% ${l}%)`;
}

interface ValueChipAvatarProps {
  name: string | null | undefined;
  size?: number;
  // When provided AND non-empty, the chip pills carry the value words.
  // Otherwise both chips fall back to the brand sparkle glyph.
  values?: string[];
  // If set, renders the photo directly and skips the abstract treatment.
  photoUrl?: string | null;
  // Optional accessibility label. Defaults to "{name} avatar".
  ariaLabel?: string;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function ValueChipAvatar({
  name,
  size = 48,
  values,
  photoUrl,
  ariaLabel,
}: ValueChipAvatarProps) {
  const safeName = (name || "?").trim() || "?";
  const seed = useMemo(() => hashString(safeName), [safeName]);

  if (photoUrl) {
    return (
      <div
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `url(${photoUrl}) center/cover`,
          border: "1.5px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      />
    );
  }

  const initial = safeName[0]!.toUpperCase();
  const hueA = pickHue(seed, 0);
  const hueB = pickHue(seed, 2);
  const hueC = pickHue(seed, 4);
  const angle = seed % 360;

  const chip1 = values?.[0]?.trim()?.slice(0, 10);
  const chip2 = values?.[1]?.trim()?.slice(0, 10);

  const animationName = `bdAvatarOrbit_${seed % 1000}`;
  const jitterX = ((seed >> 4) & 0xff) / 255;
  const jitterY = ((seed >> 8) & 0xff) / 255;

  return (
    <div
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel ?? `${safeName} avatar`}
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `
          radial-gradient(circle at ${20 + jitterX * 40}% ${30 + jitterY * 30}%, ${hueA} 0%, transparent 55%),
          radial-gradient(circle at ${80 - jitterX * 30}% ${70 - jitterY * 30}%, ${hueB} 0%, transparent 55%),
          linear-gradient(${angle}deg, ${hueC}30 0%, ${hueA}20 100%)
        `,
        border: "1px solid rgba(255,255,255,0.10)",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: `inset 0 0 ${Math.round(size * 0.25)}px rgba(255,255,255,0.08)`,
      }}
    >
      {/* Soft veil — adds mesh-gradient feel without a real filter */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Centered initial — anchors the avatar visually */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.max(11, Math.round(size * 0.34)),
          fontWeight: 700,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: "0.02em",
          textShadow: "0 1px 6px rgba(0,0,0,0.35)",
        }}
      >
        {initial}
      </div>

      {/* Floating chip 1 — top-right */}
      {size >= 40 && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: Math.round(size * 0.08),
            right: Math.round(size * 0.04),
            padding: `${Math.max(2, Math.round(size * 0.04))}px ${Math.round(size * 0.12)}px`,
            borderRadius: 999,
            fontSize: Math.max(7, Math.round(size * 0.16)),
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.18)",
            animation: `${animationName} 8s ease-in-out infinite`,
            transformOrigin: "center",
          }}
        >
          {chip1 ?? "✦"}
        </span>
      )}

      {/* Floating chip 2 — bottom-left, offset start */}
      {size >= 40 && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: Math.round(size * 0.08),
            left: Math.round(size * 0.04),
            padding: `${Math.max(2, Math.round(size * 0.04))}px ${Math.round(size * 0.12)}px`,
            borderRadius: 999,
            fontSize: Math.max(7, Math.round(size * 0.16)),
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.22)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.12)",
            animation: `${animationName} 10s ease-in-out -3s infinite`,
            transformOrigin: "center",
          }}
        >
          {chip2 ?? "✦"}
        </span>
      )}

      <style>{`
        @keyframes ${animationName} {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(${1 + (seed % 3)}px, ${-(1 + ((seed >> 2) % 3))}px) rotate(${-4 + (seed % 9)}deg); }
        }
        @media ${REDUCED_MOTION_QUERY} {
          @keyframes ${animationName} {
            from, to { transform: none; }
          }
        }
      `}</style>
    </div>
  );
}
