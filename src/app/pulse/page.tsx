"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { trackPulsePostCreated, trackPulseReaction } from "@/lib/gtm";
import type { PulsePost, PulsePostType, PulsePrompt, PulseReply, PulseSort, PulseUserStats } from "@/lib/types";

function PinkTick() {
  return (
    <span
      title="Verified Builder"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 13, height: 13, borderRadius: "50%",
        background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
        flexShrink: 0,
      }}
    >
      <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const subscribeToMinute = (cb: () => void) => {
  const id = setInterval(cb, 60000);
  return () => clearInterval(id);
};

function TimeAgo({ iso }: { iso: string }) {
  const now = useSyncExternalStore(subscribeToMinute, () => Date.now(), () => 0);
  if (now === 0) return <span>·</span>;
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return <span>now</span>;
  if (mins < 60) return <span>{mins}m</span>;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return <span>{hrs}h</span>;
  return <span>{Math.floor(hrs / 24)}d</span>;
}

// Deterministic gradient per anon handle so threads have visual continuity.
function handleColor(handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 35) % 360}, 65%, 45%))`;
}

function AnonAvatar({ handle, size = 26 }: { handle: string; size?: number }) {
  const initial = handle.replace(/^Anon-/, "").charAt(0);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: handleColor(handle),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 700, color: "white", letterSpacing: "0.02em",
    }}>{initial}</div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function FireBadge() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 10, fontWeight: 700, color: "#ff9a3c",
      padding: "2px 7px", borderRadius: 10,
      background: "rgba(255,154,60,0.12)",
      textTransform: "uppercase", letterSpacing: "0.05em",
    }}>🔥 trending</span>
  );
}

function PostCard({
  post,
  isTrending,
  hidePromptLabel,
  onResonate,
  onFlag,
}: {
  post: PulsePost;
  isTrending: boolean;
  hidePromptLabel: boolean;
  onResonate: (id: string) => void;
  onFlag: (id: string) => void;
}) {
  const [threadState, setThreadState] = useState<"closed" | "thread" | "replying">("closed");
  const [replies, setReplies] = useState<PulseReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const threadOpen = threadState !== "closed";

  const loadReplies = useCallback(async () => {
    if (loadingReplies || replies.length > 0) return;
    setLoadingReplies(true);
    try {
      const r = await fetch(`/api/pulse/posts/${post.id}/replies`);
      const d = await r.json();
      setReplies(d.replies ?? []);
    } finally {
      setLoadingReplies(false);
    }
  }, [post.id, loadingReplies, replies.length]);

  const handleViewThread = () => {
    if (threadOpen) { setThreadState("closed"); return; }
    loadReplies();
    setThreadState("thread");
  };

  const handleReply = () => {
    loadReplies();
    setThreadState("replying");
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const submitReply = async () => {
    if (!replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      const r = await fetch(`/api/pulse/posts/${post.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      if (r.ok) {
        const d = await r.json();
        setReplies((prev) => [
          ...prev,
          {
            id: d.id,
            postId: post.id,
            content: replyText.trim(),
            isVerified: false,
            authorHandle: d.authorHandle ?? "Anon-You",
            resonateCount: 0,
            createdAt: new Date().toISOString(),
          },
        ]);
        setReplyText("");
        setThreadState("thread");
      }
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleFlag = async () => {
    setFlagged(true);
    onFlag(post.id);
  };

  if (flagged) return null;

  return (
    <div style={{ marginBottom: 10 }}>
      {/* ── Original post ── */}
      <div style={{
        background: "var(--bd-surface)",
        borderRadius: threadOpen ? "16px 16px 0 0" : 16,
        border: "1px solid var(--bd-border)",
        borderBottom: threadOpen ? "none" : "1px solid var(--bd-border)",
        padding: "14px 16px 12px",
      }}>
        {/* Author row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <AnonAvatar handle={post.authorHandle} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--bd-text)" }}>
            {post.authorHandle}
            {post.isAuthor && (
              <span style={{ fontSize: 11, color: "var(--bd-text-faint)", fontWeight: 500, marginLeft: 6 }}>
                (you)
              </span>
            )}
          </span>
          {post.isVerified && <PinkTick />}
          <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>·</span>
          <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>
            <TimeAgo iso={post.createdAt} />
          </span>
          {isTrending && (
            <>
              <div style={{ flex: 1 }} />
              <FireBadge />
            </>
          )}
          {!isTrending && <div style={{ flex: 1 }} />}
          <button
            onClick={handleFlag}
            title="Report"
            style={{ background: "none", border: "none", cursor: "pointer",
              color: "var(--bd-text-faint)", opacity: 0.35, padding: 0, lineHeight: 1 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </button>
        </div>

        {/* Prompt label — only when the prompt isn't already in the inspo carousel */}
        {post.type === "prompt_response" && post.promptContent && !hidePromptLabel && (
          <p style={{
            fontSize: 11, color: "var(--bd-accent)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px",
          }}>
            ↳ {post.promptContent}
          </p>
        )}

        {/* Question pill */}
        {post.type === "question" && (
          <span style={{
            display: "inline-block", fontSize: 10, fontWeight: 700,
            color: "#9ad0ff", background: "rgba(154,208,255,0.1)",
            padding: "2px 7px", borderRadius: 10, marginBottom: 8,
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            Question
          </span>
        )}

        <p style={{ fontSize: 15, color: "var(--bd-text)", lineHeight: 1.55, margin: "0 0 12px" }}>
          {post.content}
        </p>

        {/* Action row — heart prominent, reply secondary */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => onResonate(post.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: post.isResonated ? "rgba(233,30,140,0.13)" : "transparent",
              border: post.isResonated ? "1px solid rgba(233,30,140,0.3)" : "1px solid transparent",
              borderRadius: 999, padding: "5px 11px", cursor: "pointer",
              color: post.isResonated ? "#e91e8c" : "var(--bd-text-faint)",
              fontSize: 13, fontWeight: 700,
              transition: "all 0.15s",
            }}
          >
            <HeartIcon filled={post.isResonated} />
            <span>{post.resonateCount}</span>
          </button>

          <button
            onClick={post.replyCount > 0 ? handleViewThread : handleReply}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              color: threadOpen ? "var(--bd-accent)" : "var(--bd-text-faint)",
              fontSize: 13, fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {post.replyCount > 0 ? post.replyCount : "Reply"}
          </button>
        </div>
      </div>

      {/* ── Thread panel ── */}
      {threadOpen && (
        <div style={{
          background: "var(--bd-surface)",
          border: "1px solid var(--bd-border)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "0 0 16px 16px",
          padding: "0 16px 14px",
        }}>
          <div style={{ height: 1, background: "var(--bd-border)", marginBottom: 12 }} />

          {loadingReplies && (
            <p style={{ fontSize: 13, color: "var(--bd-text-faint)", paddingLeft: 36, marginBottom: 10 }}>
              Loading thread…
            </p>
          )}

          {replies.map((reply, i) => (
            <div key={reply.id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <AnonAvatar handle={reply.authorHandle} size={26} />
                {i < replies.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 12, marginTop: 4,
                    background: "var(--bd-border)", borderRadius: 1 }} />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--bd-text)" }}>
                    {reply.authorHandle}
                  </span>
                  {reply.isVerified && <PinkTick />}
                  <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>
                    <TimeAgo iso={reply.createdAt} />
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--bd-text-muted)", lineHeight: 1.5, margin: 0 }}>
                  {reply.content}
                </p>
              </div>
            </div>
          ))}

          {threadState === "replying" ? (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: replies.length > 0 ? 4 : 0 }}>
              <AnonAvatar handle="Anon-You" size={26} />
              <div style={{ flex: 1 }}>
                <input
                  ref={inputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add to thread…"
                  maxLength={300}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(); } }}
                  onBlur={() => { if (!replyText.trim()) setThreadState(post.replyCount > 0 || replies.length > 0 ? "thread" : "closed"); }}
                  style={{
                    width: "100%", background: "transparent",
                    border: "none", borderBottom: "1px solid var(--bd-border)",
                    padding: "6px 0", fontSize: 14,
                    color: "var(--bd-text)", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {replyText.trim().length >= 3 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button
                      onClick={submitReply}
                      disabled={submittingReply}
                      style={{
                        background: "var(--bd-accent)", color: "black", border: "none",
                        borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {submittingReply ? "…" : "Post"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            replies.length > 0 && (
              <button
                onClick={handleReply}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 0", width: "100%", textAlign: "left",
                }}
              >
                <AnonAvatar handle="Anon-You" size={26} />
                <span style={{ fontSize: 13, color: "var(--bd-text-faint)", fontStyle: "italic" }}>
                  Add to thread…
                </span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function TypeChip({
  value, label, active, onClick,
}: { value: PulsePostType; label: string; active: boolean; onClick: (v: PulsePostType) => void }) {
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        background: active ? "var(--bd-accent)" : "transparent",
        color: active ? "black" : "var(--bd-text-muted)",
        border: active ? "1px solid var(--bd-accent)" : "1px solid var(--bd-border)",
        borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700,
        cursor: "pointer", letterSpacing: "0.02em",
      }}
    >
      {label}
    </button>
  );
}

function ComposeSheet({
  prompts,
  initialPromptId,
  onClose,
  onPosted,
}: {
  prompts: PulsePrompt[];
  initialPromptId?: string;
  onClose: () => void;
  onPosted: (post: PulsePost) => void;
}) {
  const [type, setType] = useState<PulsePostType>(initialPromptId ? "prompt_response" : "confession");
  const [promptId, setPromptId] = useState<string | undefined>(initialPromptId);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedPrompt = prompts.find((p) => p.id === promptId);

  const switchType = (t: PulsePostType) => {
    setType(t);
    if (t !== "prompt_response") setPromptId(undefined);
  };

  const placeholder =
    type === "question" ? "Ask the room something honest…"
      : type === "prompt_response" ? "Share your honest take…"
      : "What's on your mind, anonymously…";

  const submit = async () => {
    if (content.trim().length < 5 || submitting) return;
    if (type === "prompt_response" && !promptId) {
      setError("Pick a prompt or switch to free post");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/pulse/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, promptId, content: content.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error ?? "Failed to post"); return; }
      trackPulsePostCreated();
      onPosted({
        id: d.id,
        type,
        promptId: promptId ?? null,
        promptContent: selectedPrompt?.content ?? null,
        content: content.trim(),
        isVerified: false,
        isAuthor: true,
        authorHandle: "Anon-You",
        resonateCount: 0,
        replyCount: 0,
        isResonated: false,
        createdAt: new Date().toISOString(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "var(--bd-app-max-w)", margin: "0 auto",
          background: "var(--bd-surface)", borderRadius: "20px 20px 0 0",
          padding: "20px 18px 36px",
          maxHeight: "85vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: "var(--bd-accent)", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>
            Post anonymously
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none",
            color: "var(--bd-text-faint)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
          <TypeChip value="confession" label="Free post" active={type === "confession"} onClick={switchType} />
          <TypeChip value="question" label="Question" active={type === "question"} onClick={switchType} />
          {prompts.length > 0 && (
            <TypeChip value="prompt_response" label="On a prompt" active={type === "prompt_response"} onClick={switchType} />
          )}
        </div>

        {type === "prompt_response" && prompts.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "var(--bd-text-faint)", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Pick a prompt
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {prompts.map((p) => {
                const active = p.id === promptId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPromptId(p.id)}
                    style={{
                      background: active ? "rgba(233,30,140,0.12)" : "var(--bd-bg)",
                      border: active ? "1px solid rgba(233,30,140,0.5)" : "1px solid var(--bd-border)",
                      borderRadius: 10, padding: "9px 12px", fontSize: 13,
                      color: "var(--bd-text-muted)", lineHeight: 1.45, textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {p.content}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          autoFocus
          style={{
            width: "100%", minHeight: 120, background: "var(--bd-bg)",
            border: "1px solid var(--bd-border)", borderRadius: 12,
            padding: "12px 14px", fontSize: 15, color: "var(--bd-text)",
            resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.55,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: "var(--bd-text-faint)" }}>
            {content.length}/500 · stays anonymous
          </span>
          {error && <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>}
        </div>

        <button
          onClick={submit}
          disabled={content.trim().length < 5 || submitting}
          style={{
            width: "100%", marginTop: 12,
            background: content.trim().length >= 5 ? "var(--bd-accent)" : "var(--bd-border)",
            color: content.trim().length >= 5 ? "black" : "var(--bd-text-faint)",
            border: "none", borderRadius: 12, padding: "13px",
            fontSize: 15, fontWeight: 700,
            cursor: content.trim().length >= 5 ? "pointer" : "default",
            transition: "all 0.15s",
          }}
        >
          {submitting ? "Posting…" : "Post Anonymously"}
        </button>
      </div>
    </div>
  );
}

function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--bd-text)", lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "var(--bd-text-faint)", marginTop: 2,
        textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}

function StatsStrip({ stats }: { stats: PulseUserStats | null }) {
  if (!stats) return null;
  return (
    <div style={{
      background: "var(--bd-surface)", border: "1px solid var(--bd-border)",
      borderRadius: 14, padding: "12px 8px", marginBottom: 14,
      display: "flex", alignItems: "center", gap: 4,
    }}>
      <StatPill value={stats.heartsToday} label="❤ today" />
      <div style={{ width: 1, height: 28, background: "var(--bd-border)" }} />
      <StatPill value={stats.lifetimeHearts} label="lifetime" />
      <div style={{ width: 1, height: 28, background: "var(--bd-border)" }} />
      <StatPill value={stats.currentStreak > 0 ? `${stats.currentStreak}🔥` : "0"} label="streak" />
    </div>
  );
}

const HINT_KEY = "biggdate-pulse-hint-dismissed-v1";

function subscribeToHintKey(cb: () => void) {
  const handler = (e: StorageEvent) => { if (e.key === HINT_KEY) cb(); };
  window.addEventListener("storage", handler);
  window.addEventListener(HINT_KEY, cb);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(HINT_KEY, cb);
  };
}

function HowItWorksHint() {
  const dismissed = useSyncExternalStore(
    subscribeToHintKey,
    () => localStorage.getItem(HINT_KEY) === "1",
    () => true, // SSR: hide by default to avoid flash
  );
  if (dismissed) return null;
  const dismiss = () => {
    localStorage.setItem(HINT_KEY, "1");
    window.dispatchEvent(new Event(HINT_KEY));
  };
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(233,30,140,0.08), rgba(233,30,140,0.02))",
      border: "1px solid rgba(233,30,140,0.18)",
      borderRadius: 12, padding: "11px 13px", marginBottom: 12,
      display: "flex", alignItems: "flex-start", gap: 10,
    }}>
      <span style={{ fontSize: 16, lineHeight: 1.2 }}>💡</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: "var(--bd-text)", lineHeight: 1.5, margin: "0 0 2px" }}>
          <strong>No follows here.</strong> You can&apos;t track a person — only their words.
        </p>
        <p style={{ fontSize: 12, color: "var(--bd-text-faint)", lineHeight: 1.5, margin: 0 }}>
          Tap ❤ to send love on a post. Your hearts grow that author&apos;s lifetime score (anonymously). Top posts climb the Hot tab.
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          background: "none", border: "none", color: "var(--bd-text-faint)",
          cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0,
        }}
      >✕</button>
    </div>
  );
}

function InspoCarousel({
  prompts,
  onPick,
}: {
  prompts: PulsePrompt[];
  onPick: (promptId: string) => void;
}) {
  if (prompts.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 11, color: "var(--bd-text-faint)", marginBottom: 7,
        textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Need inspo? →
      </p>
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
        scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
      }}>
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            style={{
              flex: "0 0 auto", maxWidth: 240,
              background: "linear-gradient(135deg, rgba(233,30,140,0.1), rgba(233,30,140,0.03))",
              border: "1px solid rgba(233,30,140,0.22)",
              borderRadius: 12, padding: "10px 12px", fontSize: 13,
              color: "var(--bd-text)", lineHeight: 1.4,
              textAlign: "left", cursor: "pointer", whiteSpace: "normal",
            }}
          >
            {p.content}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortTab({
  value, label, active, onClick,
}: { value: PulseSort; label: string; active: boolean; onClick: (v: PulseSort) => void }) {
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        flex: 1, background: "transparent", border: "none",
        padding: "10px 0", cursor: "pointer", position: "relative",
        fontSize: 14, fontWeight: 700,
        color: active ? "var(--bd-text)" : "var(--bd-text-faint)",
      }}
    >
      {label}
      {active && (
        <div style={{
          position: "absolute", bottom: -1, left: "30%", right: "30%",
          height: 2, background: "var(--bd-accent)", borderRadius: 2,
        }} />
      )}
    </button>
  );
}

function SortTabs({ sort, onChange }: { sort: PulseSort; onChange: (s: PulseSort) => void }) {
  return (
    <div style={{
      display: "flex", borderBottom: "1px solid var(--bd-border)",
      marginBottom: 14,
    }}>
      <SortTab value="hot" label="Hot" active={sort === "hot"} onClick={onChange} />
      <SortTab value="new" label="New" active={sort === "new"} onClick={onChange} />
    </div>
  );
}

export default function PulsePage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [prompts, setPrompts] = useState<PulsePrompt[]>([]);
  const [posts, setPosts] = useState<PulsePost[]>([]);
  const [stats, setStats] = useState<PulseUserStats | null>(null);
  const [sort, setSort] = useState<PulseSort>("hot");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composePromptId, setComposePromptId] = useState<string | undefined>();
  const loaderRef = useRef<HTMLDivElement>(null);

  // Initial load: prompts + stats once, posts on every sort change
  useEffect(() => {
    if (!userId) { router.replace("/auth"); return; }
    Promise.all([
      fetch("/api/pulse/prompts/today").then((r) => r.json()),
      fetch("/api/pulse/stats").then((r) => r.json()),
    ]).then(([pd, sd]) => {
      setPrompts(pd.prompts ?? (pd.prompt ? [pd.prompt] : []));
      setStats(sd.stats ?? null);
    });
  }, [userId, router]);

  // Reload feed whenever sort changes (loading flag is set by changeSort or initial state)
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetch(`/api/pulse/posts?sort=${sort}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setPosts(d.posts ?? []);
        setNextCursor(d.nextCursor ?? null);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId, sort]);

  const changeSort = (s: PulseSort) => {
    if (s === sort) return;
    setLoading(true);
    setPosts([]);
    setNextCursor(null);
    setSort(s);
  };

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || !nextCursor || loadingMore) return;
      setLoadingMore(true);
      const r = await fetch(
        `/api/pulse/posts?sort=${sort}&cursor=${encodeURIComponent(nextCursor)}`
      );
      const d = await r.json();
      setPosts((prev) => [...prev, ...(d.posts ?? [])]);
      setNextCursor(d.nextCursor ?? null);
      setLoadingMore(false);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [nextCursor, loadingMore, sort]);

  const handleResonate = async (postId: string) => {
    // Optimistic
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId ? p : {
          ...p,
          isResonated: !p.isResonated,
          resonateCount: p.isResonated ? Math.max(0, p.resonateCount - 1) : p.resonateCount + 1,
        }
      )
    );
    try {
      const r = await fetch(`/api/pulse/posts/${postId}/react`, { method: "POST" });
      const { resonated } = await r.json();
      trackPulseReaction(postId, resonated ? "resonate" : "un-resonate");
    } catch {
      // Revert on failure (rare)
      setPosts((prev) =>
        prev.map((p) =>
          p.id !== postId ? p : {
            ...p,
            isResonated: !p.isResonated,
            resonateCount: p.isResonated ? Math.max(0, p.resonateCount - 1) : p.resonateCount + 1,
          }
        )
      );
    }
  };

  const handleFlag = async (postId: string) => {
    await fetch(`/api/pulse/posts/${postId}/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "reported" }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const openCompose = (promptId?: string) => {
    setComposePromptId(promptId);
    setShowCompose(true);
  };

  // Trending threshold: top quartile of resonateCount in current feed (min 3 hearts)
  const trendingThreshold = (() => {
    if (posts.length < 4) return Infinity;
    const sorted = [...posts].map((p) => p.resonateCount).sort((a, b) => b - a);
    const q1 = sorted[Math.floor(sorted.length * 0.25)] ?? 0;
    return Math.max(3, q1);
  })();

  // Prompt IDs already shown in the inspo carousel — don't repeat them on cards
  const carouselPromptIds = new Set(prompts.map((p) => p.id));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", paddingBottom: 100 }}>
      <div style={{ maxWidth: "var(--bd-app-max-w)", margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ padding: "20px 0 12px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--bd-text)", margin: 0 }}>Pulse</h1>
        </div>

        <StatsStrip stats={stats} />

        <HowItWorksHint />

        <InspoCarousel prompts={prompts} onPick={(id) => openCompose(id)} />

        <SortTabs sort={sort} onChange={changeSort} />

        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: "var(--bd-surface)", borderRadius: 16, padding: 20,
                marginBottom: 10, opacity: 1 - i * 0.18,
              }}>
                <div style={{ height: 13, width: "55%", borderRadius: 6, background: "var(--bd-border)", marginBottom: 10 }} />
                <div style={{ height: 13, width: "85%", borderRadius: 6, background: "var(--bd-border)", marginBottom: 7 }} />
                <div style={{ height: 13, width: "70%", borderRadius: 6, background: "var(--bd-border)" }} />
              </div>
            ))}
          </>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🤫</div>
            <p style={{ fontSize: 16, color: "var(--bd-text)", fontWeight: 600, marginBottom: 6 }}>
              Be the first to share
            </p>
            <p style={{ fontSize: 14, color: "var(--bd-text-faint)" }}>
              Tap + to drop something honest
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isTrending={post.resonateCount >= trendingThreshold}
                hidePromptLabel={!!post.promptId && carouselPromptIds.has(post.promptId)}
                onResonate={handleResonate}
                onFlag={handleFlag}
              />
            ))}
            <div ref={loaderRef} style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {loadingMore && (
                <span style={{ fontSize: 12, color: "var(--bd-text-faint)" }}>Loading more…</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* FAB — always available now, not gated on prompt */}
      <button
        onClick={() => openCompose()}
        aria-label="New post"
        style={{
          position: "fixed", bottom: 88, right: 20,
          width: 54, height: 54, borderRadius: "50%",
          background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(233,30,140,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, fontSize: 28, color: "white", fontWeight: 300,
        }}
      >
        +
      </button>

      {showCompose && (
        <ComposeSheet
          prompts={prompts}
          initialPromptId={composePromptId}
          onClose={() => { setShowCompose(false); setComposePromptId(undefined); }}
          onPosted={(post) => {
            setPosts((prev) => [post, ...prev]);
            // Refresh stats after a successful post (streak/posts_today)
            fetch("/api/pulse/stats").then((r) => r.json()).then((d) => setStats(d.stats ?? null));
          }}
        />
      )}
    </div>
  );
}
