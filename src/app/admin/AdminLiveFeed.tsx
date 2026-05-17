"use client";

import { useEffect, useRef, useState } from "react";

interface FeedEvent {
  id: string;
  user_id: string | null;
  event_name: string;
  occurred_at: string;
  name: string | null;
  city: string | null;
}

const POLL_MS = 5000;
const MAX_ITEMS = 40;

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.max(0, Math.round(diff / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function colorFor(eventName: string): string {
  if (eventName === "signup") return "#e91e8c";
  if (eventName.startsWith("onboarding_")) return "#f59e0b";
  if (eventName === "first_paid") return "#22d3ee";
  if (eventName.startsWith("first_")) return "#10b981";
  return "#888";
}

export function AdminLiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const lastSeenRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch("/api/admin/dashboard/feed", { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as { events: FeedEvent[] };
        if (cancelled) return;
        setError(null);
        setEvents(data.events.slice(0, MAX_ITEMS));
        if (data.events[0]) lastSeenRef.current = data.events[0].id;
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    };
    load();
    const interval = setInterval(load, POLL_MS);
    const reltick = setInterval(() => setTick((t) => t + 1), 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(reltick);
    };
  }, []);

  return (
    <div
      style={{ maxHeight: 420, overflowY: "auto", fontSize: 12 }}
      data-tick={tick}
    >
      {error && (
        <div style={{ color: "#f87171", fontSize: 11, marginBottom: 10 }}>
          Feed error: {error}
        </div>
      )}
      {events.length === 0 && !error ? (
        <div style={{ color: "#666", fontSize: 12 }}>Listening for activity…</div>
      ) : (
        events.map((e) => (
          <div
            key={e.id}
            style={{
              display: "flex",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #1a1a1a",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                color: colorFor(e.event_name),
                fontWeight: 700,
                minWidth: 100,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {e.event_name}
            </span>
            <span style={{ color: "#ccc", flex: 1 }}>
              {e.name ?? (e.user_id ? `${e.user_id.slice(0, 8)}…` : "anon")}
              {e.city ? <span style={{ color: "#666" }}> · {e.city}</span> : null}
            </span>
            <span style={{ color: "#555", fontSize: 10 }}>{relTime(e.occurred_at)}</span>
          </div>
        ))
      )}
    </div>
  );
}
