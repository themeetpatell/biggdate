"use client";

import { useEffect, useState } from "react";

interface InactiveUser {
  user_id: string;
  name: string | null;
  city: string | null;
  age: number | null;
  last_active_at: string | null;
  days_inactive: number;
}

const PINK = "#e91e8c";

export function InactiveUsersPanel() {
  const [users, setUsers] = useState<InactiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [days, setDays] = useState(3);
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/admin/dashboard/inactive?days=${days}`, {
          cache: "no-store",
        });
        const data = (await r.json()) as { users: InactiveUser[] };
        if (cancelled) return;
        setUsers(data.users ?? []);
        setSelected(new Set());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === users.length) setSelected(new Set());
    else setSelected(new Set(users.map((u) => u.user_id)));
  };

  const ping = async () => {
    if (selected.size === 0) return;
    setSending(true);
    setFlash(null);
    try {
      const r = await fetch("/api/admin/dashboard/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selected) }),
      });
      const data = (await r.json()) as { count?: number; error?: string };
      if (!r.ok) {
        setFlash(data.error ?? "Ping failed");
      } else {
        setFlash(`Logged ${data.count ?? selected.size} reactivation events.`);
        setSelected(new Set());
      }
    } finally {
      setSending(false);
    }
  };

  const td: React.CSSProperties = {
    padding: "9px 10px",
    borderBottom: "1px solid #222",
    fontSize: 12,
  };
  const th: React.CSSProperties = {
    padding: "8px 10px",
    color: "#666",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #222",
    textAlign: "left",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: 11, color: "#888" }}>
          Inactive ≥
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            style={{
              marginLeft: 8,
              background: "#0c0c0c",
              color: "#e5e5e5",
              border: "1px solid #2a2a2a",
              borderRadius: 6,
              padding: "5px 8px",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </label>

        <span style={{ flex: 1 }} />

        <button
          onClick={ping}
          disabled={selected.size === 0 || sending}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            border: "none",
            background: PINK,
            color: "white",
            cursor: selected.size === 0 ? "not-allowed" : "pointer",
            fontSize: 12,
            fontWeight: 700,
            opacity: selected.size === 0 || sending ? 0.45 : 1,
            fontFamily: "inherit",
          }}
        >
          {sending ? "Pinging…" : `Ping selected (${selected.size})`}
        </button>
      </div>

      {flash && (
        <div
          style={{
            fontSize: 11,
            color: flash.startsWith("Logged") ? "#10b981" : "#f87171",
            marginBottom: 10,
          }}
        >
          {flash}
        </div>
      )}

      {loading ? (
        <p style={{ color: "#666", fontSize: 12 }}>Loading…</p>
      ) : users.length === 0 ? (
        <p style={{ color: "#555", fontSize: 12 }}>
          No users inactive for ≥{days} day{days === 1 ? "" : "s"}.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 28 }}>
                <input
                  type="checkbox"
                  checked={selected.size === users.length && users.length > 0}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th style={th}>Name</th>
              <th style={th}>Age</th>
              <th style={th}>City</th>
              <th style={th}>Days inactive</th>
              <th style={th}>Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td style={td}>
                  <input
                    type="checkbox"
                    checked={selected.has(u.user_id)}
                    onChange={() => toggle(u.user_id)}
                    aria-label={`Select ${u.name ?? u.user_id}`}
                  />
                </td>
                <td style={td}>{u.name ?? <span style={{ color: "#666" }}>—</span>}</td>
                <td style={td}>{u.age ?? "—"}</td>
                <td style={td}>{u.city || "—"}</td>
                <td style={td}>{u.days_inactive}d</td>
                <td style={{ ...td, color: "#888" }}>
                  {u.last_active_at
                    ? new Date(u.last_active_at).toLocaleString()
                    : "never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
