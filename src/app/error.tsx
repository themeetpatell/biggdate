"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-5xl" style={{ animation: "float 3s ease-in-out infinite" }}>
        💔
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--bd-text-muted)" }}>
          {error.message || "An unexpected error occurred. Don't worry — your profile is safe."}
        </p>
      </div>
      <Button
        onClick={reset}
        className="bg-[var(--bd-accent)] text-black font-semibold rounded-full px-8"
      >
        Try Again
      </Button>
    </div>
  );
}
