"use client";

import { useEffect, useState } from "react";

interface FlaggedPost {
  id: string;
  type: string;
  content: string;
  isVerified: boolean;
  flagCount: number;
  isHidden: boolean;
  createdAt: string;
}

interface PendingVerification {
  userId: string;
  linkedinUrl: string;
  selfieUrl: string;
}

interface Prompt {
  id: string;
  content: string;
  publishedAt: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPulsePage() {
  const [posts, setPosts] = useState<FlaggedPost[]>([]);
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tab, setTab] = useState<"flags" | "verifications" | "prompts">("prompts");
  const [loading, setLoading] = useState(true);
  const [newPrompt, setNewPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [promptError, setPromptError] = useState("");

  const loadAll = () =>
    Promise.all([
      fetch("/api/admin/pulse/posts").then((r) => r.json()),
      fetch("/api/admin/verification").then((r) => r.json()),
      fetch("/api/admin/pulse/prompts").then((r) => r.json()),
    ]).then(([pd, vd, prd]) => {
      setPosts(pd.posts ?? []);
      setVerifications(vd.verifications ?? []);
      setPrompts(prd.prompts ?? []);
      setLoading(false);
    });

  useEffect(() => { loadAll(); }, []);

  const hidePost = async (id: string) => {
    await fetch(`/api/admin/pulse/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: true }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const restorePost = async (id: string) => {
    await fetch(`/api/admin/pulse/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: false }),
    });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isHidden: false } : p));
  };

  const approveVerification = async (userId: string) => {
    await fetch(`/api/admin/verification/${userId}`, { method: "POST" });
    setVerifications((prev) => prev.filter((v) => v.userId !== userId));
  };

  const createPrompt = async () => {
    const content = newPrompt.trim();
    if (content.length < 10) {
      setPromptError("Min 10 characters.");
      return;
    }
    setSavingPrompt(true);
    setPromptError("");
    try {
      const r = await fetch("/api/admin/pulse/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const d = await r.json();
      if (!r.ok) {
        setPromptError(d.error ?? "Failed to create");
        return;
      }
      setNewPrompt("");
      const list = await fetch("/api/admin/pulse/prompts").then((x) => x.json());
      setPrompts(list.prompts ?? []);
    } finally {
      setSavingPrompt(false);
    }
  };

  const togglePromptActive = async (p: Prompt) => {
    await fetch(`/api/admin/pulse/prompts/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    setPrompts((prev) => prev.map((x) => x.id === p.id ? { ...x, isActive: !p.isActive } : x));
  };

  const deletePrompt = async (id: string) => {
    if (!confirm("Delete this prompt? Posts that referenced it will keep their content but lose the prompt label.")) return;
    await fetch(`/api/admin/pulse/prompts/${id}`, { method: "DELETE" });
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const s = {
    page: { minHeight: "100vh", background: "#090909", color: "#e5e5e5", padding: 28, fontFamily: "ui-monospace, monospace" } as React.CSSProperties,
    tabBtn: (active: boolean): React.CSSProperties => ({
      padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
      background: active ? "#e91e8c" : "#1c1c1c", color: "white",
      fontSize: 13, fontWeight: 600,
    }),
    card: { background: "#111", borderRadius: 10, padding: 18, marginBottom: 14, border: "1px solid #222" } as React.CSSProperties,
    btn: (color: string): React.CSSProperties => ({
      padding: "7px 16px", borderRadius: 6, border: "none",
      background: color, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600,
    }),
    input: {
      width: "100%", background: "#0c0c0c", color: "#e5e5e5",
      border: "1px solid #2a2a2a", borderRadius: 8,
      padding: "10px 12px", fontSize: 14, fontFamily: "inherit",
      outline: "none", boxSizing: "border-box" as const,
    },
  };

  const activeCount = prompts.filter((p) => p.isActive).length;

  return (
    <div style={s.page}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Admin · Pulse</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        <button style={s.tabBtn(tab === "prompts")} onClick={() => setTab("prompts")}>
          Prompts ({activeCount}/{prompts.length})
        </button>
        <button style={s.tabBtn(tab === "flags")} onClick={() => setTab("flags")}>
          Flagged Posts ({posts.length})
        </button>
        <button style={s.tabBtn(tab === "verifications")} onClick={() => setTab("verifications")}>
          Verifications ({verifications.length})
        </button>
      </div>

      {loading && <p style={{ color: "#666", fontSize: 14 }}>Loading…</p>}

      {!loading && tab === "prompts" && (
        <div>
          <div style={{ ...s.card, borderColor: "#e91e8c33" }}>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              New prompt
            </p>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="e.g. What's a hard truth about your last 30 days?"
              maxLength={200}
              rows={3}
              style={{ ...s.input, resize: "vertical", marginBottom: 10 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#666" }}>
                {newPrompt.length}/200 {promptError && <span style={{ color: "#f87171", marginLeft: 10 }}>· {promptError}</span>}
              </span>
              <button
                style={{ ...s.btn("#e91e8c"), opacity: savingPrompt || newPrompt.trim().length < 10 ? 0.5 : 1 }}
                disabled={savingPrompt || newPrompt.trim().length < 10}
                onClick={createPrompt}
              >
                {savingPrompt ? "Saving…" : "+ Add prompt"}
              </button>
            </div>
          </div>

          {prompts.length === 0 ? (
            <p style={{ color: "#555", fontSize: 14 }}>No prompts yet. Add one above.</p>
          ) : (
            prompts.map((p) => (
              <div key={p.id} style={{ ...s.card, borderColor: p.isActive ? "#e91e8c33" : "#222", opacity: p.isActive ? 1 : 0.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: p.isActive ? "#e91e8c" : "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {p.isActive ? "● Active" : "○ Inactive"}
                  </span>
                  <span style={{ fontSize: 10, color: "#444" }}>
                    {new Date(p.publishedAt).toLocaleDateString()} · {p.id}
                  </span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 14, color: "#ddd" }}>
                  {p.content}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={s.btn(p.isActive ? "#555" : "#27ae60")}
                    onClick={() => togglePromptActive(p)}
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button style={s.btn("#c0392b")} onClick={() => deletePrompt(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && tab === "flags" && (
        <div>
          {posts.length === 0 && <p style={{ color: "#555", fontSize: 14 }}>No flagged posts.</p>}
          {posts.map((post) => (
            <div key={post.id} style={{ ...s.card, borderColor: post.isHidden ? "#222" : "#e91e8c33" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#666" }}>
                  {post.type} · {post.flagCount} flags · {post.isHidden ? "hidden" : "visible"}
                </span>
                <span style={{ fontSize: 10, color: "#444" }}>{post.id}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14, color: "#ccc" }}>{post.content}</p>
              <div style={{ display: "flex", gap: 8 }}>
                {!post.isHidden && (
                  <button style={s.btn("#c0392b")} onClick={() => hidePost(post.id)}>Hide</button>
                )}
                {post.isHidden && (
                  <button style={s.btn("#27ae60")} onClick={() => restorePost(post.id)}>Restore</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "verifications" && (
        <div>
          {verifications.length === 0 && <p style={{ color: "#555", fontSize: 14 }}>No pending verifications.</p>}
          {verifications.map((v) => (
            <div key={v.userId} style={s.card}>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>User ID: {v.userId}</p>
              <p style={{ fontSize: 13, marginBottom: 8 }}>
                LinkedIn:{" "}
                <a href={v.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#e91e8c" }}>
                  {v.linkedinUrl}
                </a>
              </p>
              {v.selfieUrl && v.selfieUrl.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.selfieUrl}
                  alt="Selfie"
                  style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 10, marginBottom: 14 }}
                />
              ) : v.selfieUrl ? (
                <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>Selfie URL: {v.selfieUrl}</p>
              ) : null}
              <button style={s.btn("#e91e8c")} onClick={() => approveVerification(v.userId)}>
                ✓ Approve Pink Tick
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
