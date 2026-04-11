"use client";

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      {/* Animated orb */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--bd-accent), var(--bd-rose))",
            animation: "spin-slow 3s linear infinite",
            opacity: 0.7,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--bd-bg)",
            margin: "3px",
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center text-xl"
          style={{ animation: "float 2s ease-in-out infinite" }}
        >
          ✨
        </div>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid var(--bd-accent)",
            animation: "pulseRing 1.5s ease-out infinite",
          }}
        />
      </div>
      <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
        {message}
      </p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ background: "var(--bd-surface)", borderColor: "var(--bd-border)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="bd-shimmer h-5 w-32 rounded mb-2" />
          <div className="bd-shimmer h-3 w-24 rounded" />
        </div>
        <div className="bd-shimmer h-10 w-10 rounded-full" />
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="bd-shimmer h-5 w-20 rounded-full" />
        <div className="bd-shimmer h-5 w-16 rounded-full" />
      </div>
      <div className="bd-shimmer h-4 w-full rounded mb-2" />
      <div className="bd-shimmer h-4 w-3/4 rounded mb-4" />
      <div className="bd-shimmer h-10 w-full rounded-xl" />
    </div>
  );
}

export function PreviewSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 page-enter">
      <div className="bd-shimmer h-4 w-24 rounded mb-6" />
      <div className="text-center mb-8">
        <div className="bd-shimmer h-8 w-48 rounded mx-auto mb-3" />
        <div className="flex justify-center gap-2">
          <div className="bd-shimmer h-5 w-24 rounded-full" />
          <div className="bd-shimmer h-5 w-28 rounded-full" />
        </div>
      </div>
      <div className="bd-shimmer h-20 w-20 rounded-full mx-auto mb-6" />
      <div
        className="rounded-2xl p-6 border mb-6"
        style={{ background: "var(--bd-surface)", borderColor: "var(--bd-border)" }}
      >
        <div className="bd-shimmer h-4 w-full rounded mb-2" />
        <div className="bd-shimmer h-4 w-5/6 rounded mb-2" />
        <div className="bd-shimmer h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}
