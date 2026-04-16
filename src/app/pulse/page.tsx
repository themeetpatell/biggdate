"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { PulsePost, PulsePrompt, PulseReply } from "@/lib/types";

function PinkTick() {
  return (
    <span
      title="Verified Builder"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 15, height: 15, borderRadius: "50%",
        background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
        marginLeft: 4, flexShrink: 0,
      }}
    >
      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function TimeAgo({ iso }: { iso: string }) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return <span>now</span>;
  if (mins < 60) return <span>{mins}m</span>;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return <span>{hrs}h</span>;
  return <span>{Math.floor(hrs / 24)}d</span>;
}

function AnonDot({ verified }: { verified: boolean }) {
  // Small avatar dot — verified gets pink gradient, unverified gets muted
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
      background: verified
        ? "linear-gradient(135deg, #e91e8c, #ff6ec7)"
        : "var(--bd-border)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {verified ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      )}
    </div>
  );
}

function PostCard({
  post,
  onResonate,
  onFlag,
}: {
  post: PulsePost;
  onResonate: (id: string) => void;
  onFlag: (id: string) => void;
}) {
  // Three states: closed | thread (show replies) | replying (show replies + input focused)
  const [threadState, setThreadState] = useState<"closed" | "thread" | "replying">("closed");
  const [replies, setReplies] = useState<PulseReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canReply = post.type === "prompt_response" || post.type === "question";
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

  // "N replies" button — expand/collapse thread without focusing input
  const handleViewThread = () => {
    if (threadOpen) { setThreadState("closed"); return; }
    loadReplies();
    setThreadState("thread");
  };

  // "Reply" button — open thread AND focus input
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
          { id: d.id, postId: post.id, content: replyText.trim(), isVerified: false, resonateCount: 0, createdAt: new Date().toISOString() },
        ]);
        setReplyText("");
        setThreadState("thread"); // back to view-only after posting
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

  const replyCount = post.replyCount + replies.filter(r => !post.replyCount).length;

  return (
    <div style={{ marginBottom: 10 }}>
      {/* ── Original post ── */}
      <div style={{
        background: "var(--bd-surface)",
        borderRadius: threadOpen ? "16px 16px 0 0" : 16,
        border: "1px solid var(--bd-border)",
        borderBottom: threadOpen ? "none" : "1px solid var(--bd-border)",
        padding: "16px 18px",
      }}>
        {post.promptContent && (
          <p style={{
            fontSize: 11, color: "var(--bd-accent)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
          }}>
            {post.promptContent}
          </p>
        )}

        <p style={{ fontSize: 15, color: "var(--bd-text)", lineHeight: 1.6, marginBottom: 14 }}>
          {post.content}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Resonate */}
          <button
            onClick={() => onResonate(post.id)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              color: post.isResonated ? "#e91e8c" : "var(--bd-text-faint)",
              fontSize: 13, fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={post.isResonated ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {post.resonateCount > 0 && <span>{post.resonateCount}</span>}
          </button>

          {/* View thread (only if replies exist) */}
          {canReply && post.replyCount > 0 && (
            <button
              onClick={handleViewThread}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: threadOpen ? "var(--bd-accent)" : "var(--bd-text-faint)",
                fontSize: 13, fontWeight: 500,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post.replyCount}
            </button>
          )}

          {/* Reply button — always visible for threadable posts */}
          {canReply && (
            <button
              onClick={handleReply}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "var(--bd-text-faint)", fontSize: 13, fontWeight: 500,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 17 4 12 9 7" />
                <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
              </svg>
              Reply
            </button>
          )}

          <div style={{ flex: 1 }} />

          {/* Tick + time */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {post.isVerified && <PinkTick />}
            <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>
              <TimeAgo iso={post.createdAt} />
            </span>
          </div>

          {/* Flag */}
          <button
            onClick={handleFlag}
            title="Report"
            style={{ background: "none", border: "none", cursor: "pointer",
              color: "var(--bd-text-faint)", opacity: 0.3, padding: 0, lineHeight: 1 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Thread panel (Threads-style left-line) ── */}
      {threadOpen && (
        <div style={{
          background: "var(--bd-surface)",
          border: "1px solid var(--bd-border)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "0 0 16px 16px",
          padding: "0 18px 16px",
        }}>
          {/* Thin divider line */}
          <div style={{ height: 1, background: "var(--bd-border)", marginBottom: 14 }} />

          {loadingReplies && (
            <p style={{ fontSize: 13, color: "var(--bd-text-faint)", paddingLeft: 36, marginBottom: 10 }}>
              Loading thread…
            </p>
          )}

          {/* Reply rows with left connector line */}
          {replies.map((reply, i) => (
            <div key={reply.id} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {/* Avatar + vertical line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <AnonDot verified={reply.isVerified} />
                {i < replies.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 12, marginTop: 4,
                    background: "var(--bd-border)", borderRadius: 1 }} />
                )}
              </div>
              {/* Reply content */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 14, color: "var(--bd-text-muted)", lineHeight: 1.55, margin: "0 0 4px" }}>
                  {reply.content}
                </p>
                <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>
                  <TimeAgo iso={reply.createdAt} />
                </span>
              </div>
            </div>
          ))}

          {/* Reply input — only shown in "replying" state */}
          {threadState === "replying" ? (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: replies.length > 0 ? 4 : 0 }}>
              <AnonDot verified={false} />
              <div style={{ flex: 1 }}>
                <input
                  ref={inputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add to thread…"
                  maxLength={300}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(); } }}
                  onBlur={() => { if (!replyText.trim()) setThreadState(post.replyCount > 0 ? "thread" : "closed"); }}
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
            /* Collapsed reply hint */
            replies.length > 0 && (
              <button
                onClick={handleReply}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 0", width: "100%", textAlign: "left",
                }}
              >
                <AnonDot verified={false} />
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

function ComposeSheet({
  prompt,
  onClose,
  onPosted,
}: {
  prompt: PulsePrompt | null;
  onClose: () => void;
  onPosted: (post: PulsePost) => void;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (content.trim().length < 5 || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/pulse/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "prompt_response", promptId: prompt?.id, content: content.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error ?? "Failed to post"); return; }
      onPosted({
        id: d.id, type: "prompt_response",
        promptId: prompt?.id ?? null, promptContent: prompt?.content ?? null,
        content: content.trim(), isVerified: false,
        resonateCount: 0, replyCount: 0, isResonated: false,
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
          width: "100%", maxWidth: 480, margin: "0 auto",
          background: "var(--bd-surface)", borderRadius: "20px 20px 0 0",
          padding: "24px 20px 44px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "var(--bd-accent)", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Respond anonymously
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none",
            color: "var(--bd-text-faint)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        {prompt && (
          <p style={{
            fontSize: 14, color: "var(--bd-text-muted)", lineHeight: 1.55,
            padding: "10px 14px", background: "var(--bd-bg)", borderRadius: 10, marginBottom: 14,
          }}>
            {prompt.content}
          </p>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your honest take…"
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
            width: "100%", marginTop: 14,
            background: content.trim().length >= 5 ? "var(--bd-accent)" : "var(--bd-border)",
            color: content.trim().length >= 5 ? "black" : "var(--bd-text-faint)",
            border: "none", borderRadius: 12, padding: "14px",
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

export default function PulsePage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [prompt, setPrompt] = useState<PulsePrompt | null>(null);
  const [posts, setPosts] = useState<PulsePost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) { router.replace("/auth"); return; }
    Promise.all([
      fetch("/api/pulse/prompts/today").then((r) => r.json()),
      fetch("/api/pulse/posts").then((r) => r.json()),
    ]).then(([pd, fd]) => {
      setPrompt(pd.prompt ?? null);
      setPosts(fd.posts ?? []);
      setNextCursor(fd.nextCursor ?? null);
      setLoading(false);
    });
  }, [userId, router]);

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || !nextCursor || loadingMore) return;
      setLoadingMore(true);
      const r = await fetch(`/api/pulse/posts?cursor=${encodeURIComponent(nextCursor)}`);
      const d = await r.json();
      setPosts((prev) => [...prev, ...(d.posts ?? [])]);
      setNextCursor(d.nextCursor ?? null);
      setLoadingMore(false);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [nextCursor, loadingMore]);

  const handleResonate = async (postId: string) => {
    const r = await fetch(`/api/pulse/posts/${postId}/react`, { method: "POST" });
    const { resonated } = await r.json();
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== postId ? p : {
          ...p,
          isResonated: resonated,
          resonateCount: resonated ? p.resonateCount + 1 : Math.max(0, p.resonateCount - 1),
        }
      )
    );
  };

  const handleFlag = async (postId: string) => {
    await fetch(`/api/pulse/posts/${postId}/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "reported" }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 0" }}>
        <div style={{ height: 28, width: 80, borderRadius: 8, background: "var(--bd-surface)", marginBottom: 20 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            background: "var(--bd-surface)", borderRadius: 16, padding: 20,
            marginBottom: 10, opacity: 1 - i * 0.2,
          }}>
            <div style={{ height: 13, width: "55%", borderRadius: 6, background: "var(--bd-border)", marginBottom: 10 }} />
            <div style={{ height: 13, width: "85%", borderRadius: 6, background: "var(--bd-border)", marginBottom: 7 }} />
            <div style={{ height: 13, width: "70%", borderRadius: 6, background: "var(--bd-border)" }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ padding: "20px 0 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--bd-text)", margin: 0 }}>Pulse</h1>
          <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>anonymous · builders only</span>
        </div>

        {/* Today's prompt */}
        {prompt && (
          <div
            onClick={() => setShowCompose(true)}
            style={{
              background: "linear-gradient(135deg, rgba(233,30,140,0.1), rgba(233,30,140,0.03))",
              border: "1px solid rgba(233,30,140,0.22)",
              borderRadius: 16, padding: "16px 18px", marginBottom: 16, cursor: "pointer",
            }}
          >
            <p style={{ fontSize: 11, color: "#e91e8c", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>
              Today&apos;s prompt
            </p>
            <p style={{ fontSize: 15, color: "var(--bd-text)", lineHeight: 1.55, margin: "0 0 8px" }}>
              {prompt.content}
            </p>
            <p style={{ fontSize: 12, color: "rgba(233,30,140,0.7)", margin: 0 }}>
              Tap to respond anonymously →
            </p>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🤫</div>
            <p style={{ fontSize: 16, color: "var(--bd-text)", fontWeight: 600, marginBottom: 6 }}>
              Be the first to share
            </p>
            <p style={{ fontSize: 14, color: "var(--bd-text-faint)" }}>
              Respond to today&apos;s prompt anonymously
            </p>
          </div>
        )}

        {/* Feed */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onResonate={handleResonate} onFlag={handleFlag} />
        ))}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loadingMore && (
            <span style={{ fontSize: 12, color: "var(--bd-text-faint)" }}>Loading more…</span>
          )}
        </div>
      </div>

      {/* FAB */}
      {prompt && (
        <button
          onClick={() => setShowCompose(true)}
          style={{
            position: "fixed", bottom: 88, right: 20,
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
            border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(233,30,140,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, fontSize: 26, color: "white", fontWeight: 300,
          }}
        >
          +
        </button>
      )}

      {/* Compose sheet */}
      {showCompose && (
        <ComposeSheet
          prompt={prompt}
          onClose={() => setShowCompose(false)}
          onPosted={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}
    </div>
  );
}
