"use client";

import { useEffect, useState } from "react";

interface FlaggedPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  status: string;
  provider: string | null;
  scores: Record<string, number> | null;
  reason: string | null;
  createdAt: string;
}

export default function AdminPhotoModerationPage() {
  const [entries, setEntries] = useState<FlaggedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetch("/api/admin/photo-moderation")
      .then(async (r) => {
        if (r.status === 403) {
          setForbidden(true);
          return { entries: [] };
        }
        return r.json();
      })
      .then((d) => {
        setEntries(d.entries ?? []);
        setLoading(false);
      });
  }, []);

  const resolve = async (id: string, status: "safe" | "rejected") => {
    await fetch("/api/admin/photo-moderation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  if (forbidden) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center" style={{ color: "var(--bd-text)" }}>
        <h1 className="text-xl">Forbidden</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--bd-text-faint)" }}>
          Your account is not on the admin allowlist.
        </p>
      </main>
    );
  }

  return (
    <main
      className="mx-auto max-w-5xl px-6 py-12"
      style={{ color: "var(--bd-text)" }}
    >
      <header className="mb-8">
        <h1 className="text-2xl font-light tracking-tight">Photo moderation queue</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--bd-text-faint)" }}>
          Auto-flagged photos awaiting review. Mark each as safe (false positive) or rejected (policy violation).
        </p>
      </header>

      {loading && (
        <p className="text-sm" style={{ color: "var(--bd-text-faint)" }}>
          Loading…
        </p>
      )}

      {!loading && entries.length === 0 && (
        <div
          className="rounded-2xl border px-6 py-10 text-center text-sm"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            color: "var(--bd-text-faint)",
          }}
        >
          Queue is empty. Nothing to review.
        </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="overflow-hidden rounded-2xl border"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(20,24,40,0.6)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.photoUrl}
              alt="Flagged photo awaiting review"
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-3 p-4 text-[13px]">
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>
                  Reason
                </p>
                <p className="mt-1">{entry.reason || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>
                  User
                </p>
                <p className="mt-1 font-mono text-[11px]">{entry.userId}</p>
              </div>
              {entry.scores && (
                <details className="text-[11px]">
                  <summary className="cursor-pointer" style={{ color: "var(--bd-text-faint)" }}>
                    Scores
                  </summary>
                  <pre className="mt-2 max-h-32 overflow-auto rounded bg-black/40 p-2 text-[10px]">
                    {JSON.stringify(entry.scores, null, 2)}
                  </pre>
                </details>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => resolve(entry.id, "safe")}
                  className="flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(120,255,160,0.3)", color: "#a8f5c0" }}
                >
                  Mark safe
                </button>
                <button
                  onClick={() => resolve(entry.id, "rejected")}
                  className="flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(255,80,120,0.3)", color: "#ff8aa8" }}
                >
                  Reject
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
