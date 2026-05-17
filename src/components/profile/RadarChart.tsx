"use client";

import { DIMENSIONS } from "./helpers";

export function RadarChart({ scores }: { scores: number[] }) {
  const center = 110;
  const radius = 82;
  const count = scores.length;
  const step = (Math.PI * 2) / count;
  const start = -Math.PI / 2;
  const labels = ["Emo", "Val", "Int", "Rel", "Life", "Fam", "Stab", "Live", "Soul", "Ast"];

  const pointFor = (index: number, scale: number) => ({
    x: center + Math.cos(start + index * step) * scale,
    y: center + Math.sin(start + index * step) * scale,
  });

  const shape = scores
    .map((score, index) => pointFor(index, (score / 100) * radius))
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 220 220" className="h-auto w-full max-w-[260px]">
      {[0.25, 0.5, 0.75, 1].map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: count }, (_, index) => {
            const point = pointFor(index, radius * level);
            return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
        />
      ))}
      {Array.from({ length: count }, (_, index) => {
        const edge = pointFor(index, radius);
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={edge.x}
            y2={edge.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />
        );
      })}
      <polygon points={shape} fill="rgba(212,104,138,0.18)" stroke="#d4688a" strokeWidth="1.6" />
      {scores.map((score, index) => {
        const point = pointFor(index, (score / 100) * radius);
        return <circle key={DIMENSIONS[index].id} cx={point.x} cy={point.y} r="3.5" fill={DIMENSIONS[index].color} />;
      })}
      {labels.map((label, index) => {
        const point = pointFor(index, radius + 18);
        return (
          <text
            key={label}
            x={point.x}
            y={point.y}
            fontSize="7"
            fill="rgba(255,255,255,0.4)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
