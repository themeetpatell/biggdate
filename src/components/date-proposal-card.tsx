"use client";

import { useState } from "react";
import { Calendar, Check, X, ExternalLink } from "lucide-react";
import type { Message, DateProposalMeta } from "@/lib/types";

interface DateProposalCardProps {
  message: Message;
  threadId: string;
  // True when the local user proposed this date.
  isMine: boolean;
  // Called with the server's updated Message after Accept/Decline/Withdraw.
  // Parent should swap the matching message in its messages state.
  onStatusChange: (updated: Message) => void;
}

function formatProposed(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: iso, time: "" };
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time };
}

// Google Calendar handoff URL — works on web, iOS, Android (opens the device's
// native calendar prompt). 90-minute default duration.
function googleCalendarUrl(meta: DateProposalMeta, threadName: string): string {
  const start = new Date(meta.proposedAt);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const toICalUtc = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Date with ${threadName}`,
    dates: `${toICalUtc(start)}/${toICalUtc(end)}`,
    details: meta.notes ? `Notes: ${meta.notes}\n\nVia BiggDate.` : "Via BiggDate.",
    location: meta.venue,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function DateProposalCard({
  message,
  threadId,
  isMine,
  onStatusChange,
}: DateProposalCardProps) {
  const meta = message.meta;
  const [busy, setBusy] = useState<null | "accept" | "decline" | "withdraw">(null);
  const [error, setError] = useState<string | null>(null);

  if (!meta) {
    return (
      <div style={cardStyle("neutral")}>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          Date proposal (missing payload).
        </p>
      </div>
    );
  }

  const { date, time } = formatProposed(meta.proposedAt);

  const respond = async (action: "accept" | "decline" | "withdraw") => {
    if (busy) return;
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/messages/${threadId}/proposal-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id, action }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Couldn't update proposal.");
        return;
      }
      const updated = (await res.json()) as Message;
      onStatusChange(updated);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(null);
    }
  };

  if (meta.status === "accepted") {
    return (
      <div style={cardStyle("accepted")}>
        <Header meta={meta} dateStr={date} timeStr={time} />
        <p style={{ margin: "10px 0 12px", fontSize: 12, fontWeight: 700, color: "var(--bd-success)" }}>
          ✓ Accepted. Add it to your calendar so nobody forgets.
        </p>
        <a
          href={googleCalendarUrl(meta, "your match")}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 999,
            background: "var(--bd-success)",
            color: "var(--bd-bg)",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <Calendar size={14} aria-hidden /> Add to calendar
          <ExternalLink size={12} aria-hidden style={{ opacity: 0.7 }} />
        </a>
      </div>
    );
  }

  if (meta.status === "declined") {
    return (
      <div style={cardStyle("declined")}>
        <Header meta={meta} dateStr={date} timeStr={time} />
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
          {isMine ? "They passed on this one. Try another time?" : "You passed on this one."}
        </p>
      </div>
    );
  }

  if (meta.status === "withdrawn") {
    return (
      <div style={cardStyle("neutral")}>
        <Header meta={meta} dateStr={date} timeStr={time} muted />
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {isMine ? "You withdrew this proposal." : "They withdrew this proposal."}
        </p>
      </div>
    );
  }

  // Pending — buttons differ for proposer vs responder.
  return (
    <div style={cardStyle("pending")}>
      <Header meta={meta} dateStr={date} timeStr={time} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {isMine ? (
          <button
            type="button"
            onClick={() => void respond("withdraw")}
            disabled={busy !== null}
            style={ghostBtn}
          >
            {busy === "withdraw" ? "Withdrawing…" : "Withdraw"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void respond("decline")}
              disabled={busy !== null}
              style={ghostBtn}
            >
              <X size={14} aria-hidden /> {busy === "decline" ? "…" : "Pass"}
            </button>
            <button
              type="button"
              onClick={() => void respond("accept")}
              disabled={busy !== null}
              style={primaryBtn}
            >
              <Check size={14} aria-hidden /> {busy === "accept" ? "…" : "Accept"}
            </button>
          </>
        )}
      </div>
      {error ? (
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--bd-danger)" }}>{error}</p>
      ) : null}
    </div>
  );
}

function Header({
  meta,
  dateStr,
  timeStr,
  muted = false,
}: {
  meta: DateProposalMeta;
  dateStr: string;
  timeStr: string;
  muted?: boolean;
}) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Calendar size={14} aria-hidden style={{ color: "rgba(255,255,255,0.6)" }} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: muted ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.65)",
          }}
        >
          Date proposal
        </span>
      </div>
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 16,
          fontWeight: 700,
          color: muted ? "rgba(255,255,255,0.5)" : "#fff",
        }}
      >
        {dateStr}{timeStr ? ` · ${timeStr}` : ""}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
        {meta.venue}
      </p>
      {meta.notes ? (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
          {meta.notes}
        </p>
      ) : null}
    </>
  );
}

type CardState = "pending" | "accepted" | "declined" | "neutral";

function cardStyle(state: CardState): React.CSSProperties {
  const borders: Record<CardState, string> = {
    pending: "rgba(168,85,247,0.32)",
    accepted: "rgba(79,255,176,0.32)",
    declined: "rgba(251,113,133,0.32)",
    neutral: "rgba(255,255,255,0.10)",
  };
  return {
    padding: "14px 16px",
    borderRadius: 16,
    border: `1px solid ${borders[state]}`,
    background: "rgba(255,255,255,0.04)",
    minWidth: 240,
  };
}

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.04)",
  color: "rgba(255,255,255,0.85)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 14px",
  borderRadius: 999,
  border: "none",
  background: "var(--bd-violet)",
  color: "var(--bd-on-accent)",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
