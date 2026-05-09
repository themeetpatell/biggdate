"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";
import { trackMessageSent } from "@/lib/gtm";
import { subscribeToThreadMessages } from "@/lib/realtime";
import type { Thread, Message } from "@/lib/types";

function formatDuration(totalSec: number | null | undefined) {
  if (!totalSec || totalSec < 1) return "0:00";
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ChatPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const router = useRouter();
  const { profile, userId: myId, loading: authLoading } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [recordingSupported, setRecordingSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTimeSec, setRecordingTimeSec] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [voiceMimeType, setVoiceMimeType] = useState<string | null>(null);
  const [voiceDurationSec, setVoiceDurationSec] = useState<number | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMessages = useCallback(async (initial = false) => {
    try {
      const res = await fetch(`/api/messages/${threadId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (initial) setThread(data.thread);
      setMessages(data.messages ?? []);
    } finally {
      if (initial) setPageLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    loadMessages(true);

    const unsubscribe = subscribeToThreadMessages(threadId, (payload) => {
      const row = payload.new;
      // Skip messages sent by the current user — already handled by optimistic UI
      if (row.sender_id === myId) return;
      const incoming: Message = {
        id: row.id,
        threadId: row.thread_id,
        senderId: row.sender_id,
        kind: row.kind ?? "text",
        body: row.body ?? null,
        audioUrl: row.audio_url ?? null,
        audioDurationSec: row.audio_duration_sec ?? null,
        audioMimeType: row.audio_mime_type ?? null,
        createdAt: row.created_at,
        readAt: row.read_at ?? null,
      };
      setMessages((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    });

    return () => unsubscribe();
  }, [profile, authLoading, router, loadMessages, threadId, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setRecordingSupported(
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia,
    );
  }, []);

  const stopActiveStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const clearVoiceDraft = useCallback(() => {
    if (voicePreviewUrl) URL.revokeObjectURL(voicePreviewUrl);
    setVoiceBlob(null);
    setVoicePreviewUrl(null);
    setVoiceMimeType(null);
    setVoiceDurationSec(null);
    setComposerError(null);
  }, [voicePreviewUrl]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      stopActiveStream();
      if (voicePreviewUrl) URL.revokeObjectURL(voicePreviewUrl);
    };
  }, [stopActiveStream, voicePreviewUrl]);

  const sendText = async () => {
    if (!body.trim() || sending) return;
    const text = body.trim();
    setBody("");
    setComposerError(null);

    const optimistic: Message = {
      id: `opt_${Date.now()}`,
      threadId,
      senderId: myId ?? "me",
      kind: "text",
      body: text,
      audioUrl: null,
      audioDurationSec: null,
      audioMimeType: null,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    setSending(true);
    try {
      const res = await fetch(`/api/messages/${threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (res.ok) {
        const msg = await res.json();
        trackMessageSent(threadId);
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? msg : m)),
        );
      } else {
        // Remove optimistic on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setBody(text);
      }
    } finally {
      setSending(false);
    }
  };

  const sendVoiceNote = useCallback(async () => {
    if (!voiceBlob || !voicePreviewUrl || sending) return;
    setSending(true);
    setComposerError(null);

    const optimistic: Message = {
      id: `opt_voice_${Date.now()}`,
      threadId,
      senderId: myId ?? "me",
      kind: "voice",
      body: null,
      audioUrl: voicePreviewUrl,
      audioDurationSec: voiceDurationSec,
      audioMimeType: voiceMimeType,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    const fileExt = voiceMimeType?.includes("mpeg")
      ? "mp3"
      : voiceMimeType?.includes("ogg")
        ? "ogg"
        : voiceMimeType?.includes("wav")
          ? "wav"
          : voiceMimeType?.includes("mp4") || voiceMimeType?.includes("m4a")
            ? "m4a"
            : "webm";
    const audioFile = new File([voiceBlob], `voice-note.${fileExt}`, {
      type: voiceMimeType ?? voiceBlob.type ?? "audio/webm",
    });
    const formData = new FormData();
    formData.append("audio", audioFile);
    if (voiceDurationSec) formData.append("durationSec", String(voiceDurationSec));

    try {
      const res = await fetch(`/api/messages/${threadId}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const msg = await res.json();
        trackMessageSent(threadId);
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== optimistic.id) return m;
            if (m.audioUrl?.startsWith("blob:")) URL.revokeObjectURL(m.audioUrl);
            return msg;
          }),
        );
        clearVoiceDraft();
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setComposerError("Voice note failed to send. Try again.");
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setComposerError("Voice note failed to send. Try again.");
    } finally {
      setSending(false);
    }
  }, [clearVoiceDraft, myId, sending, threadId, voiceBlob, voiceDurationSec, voiceMimeType, voicePreviewUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!recordingSupported || recording || sending) return;
    clearVoiceDraft();
    setComposerError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      voiceChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      setRecordingTimeSec(0);

      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      const supportedMimeType = preferredMimeTypes.find(
        (type) =>
          typeof MediaRecorder !== "undefined" &&
          typeof MediaRecorder.isTypeSupported === "function" &&
          MediaRecorder.isTypeSupported(type),
      );
      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecording(false);
        stopActiveStream();

        const mimeType = recorder.mimeType || voiceChunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(voiceChunksRef.current, { type: mimeType });
        const durationMs = recordingStartedAtRef.current
          ? Date.now() - recordingStartedAtRef.current
          : 0;
        recordingStartedAtRef.current = null;
        if (blob.size === 0 || durationMs < 500) {
          setComposerError("Voice note was too short. Hold to record a little longer.");
          return;
        }
        const nextUrl = URL.createObjectURL(blob);
        setVoiceBlob(blob);
        setVoicePreviewUrl(nextUrl);
        setVoiceMimeType(mimeType);
        setVoiceDurationSec(Math.max(1, Math.round(durationMs / 1000)));
      };

      recorder.start();
      setRecording(true);
      recordingTimerRef.current = setInterval(() => {
        if (!recordingStartedAtRef.current) return;
        setRecordingTimeSec(Math.max(1, Math.floor((Date.now() - recordingStartedAtRef.current) / 1000)));
      }, 250);
    } catch {
      stopActiveStream();
      setComposerError("Mic access is blocked. Allow microphone access to send a voice note.");
    }
  }, [clearVoiceDraft, recording, recordingSupported, sending, stopActiveStream]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  if (authLoading || !profile) return <LoadingScreen message="Opening conversation…" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100svh", background: "#0A0A0F" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "env(safe-area-inset-top, 16px) 16px 14px",
        paddingTop: `calc(env(safe-area-inset-top, 0px) + 16px)`,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}>
        <button onClick={() => router.push("/messages")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 20, padding: "0 4px 0 0", lineHeight: 1 }}>
          ←
        </button>

        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: thread?.otherUserPhoto
            ? `url(${thread.otherUserPhoto}) center/cover`
            : "linear-gradient(135deg, rgba(212,104,138,0.3), rgba(168,85,247,0.3))",
          border: "1.5px solid rgba(255,255,255,0.1)",
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {thread?.otherUserName ?? "…"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {pageLoading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.3)", borderTopColor: "#a855f7", animation: "spin 1s linear infinite" }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p style={{ fontSize: 28, margin: "0 0 12px" }}>👋</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
              You&apos;re connected. Say something real.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = myId ? msg.senderId === myId : msg.senderId === "me";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 8 }}>
                  <div style={{
                    maxWidth: "72%",
                    background: isMine
                      ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                      : "rgba(255,255,255,0.07)",
                    borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "10px 14px",
                  }}>
                    {msg.kind === "voice" && msg.audioUrl ? (
                      <div style={{ display: "grid", gap: 8, minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Voice note
                          </span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.72)" }}>
                            {formatDuration(msg.audioDurationSec)}
                          </span>
                        </div>
                        <audio
                          controls
                          preload="metadata"
                          src={msg.audioUrl}
                          style={{ width: "100%", height: 36, opacity: 0.92 }}
                        />
                      </div>
                    ) : (
                      <p style={{ fontSize: 15, color: "#fff", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
                        {msg.body}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: `12px 12px calc(12px + env(safe-area-inset-bottom, 0px))`,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.98)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
        flexShrink: 0,
      }}>
        {recording ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 18,
            background: "linear-gradient(135deg, rgba(225,29,72,0.18), rgba(168,85,247,0.18))",
            border: "1px solid rgba(244,114,182,0.28)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fb7185", boxShadow: "0 0 0 6px rgba(251,113,133,0.18)" }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Recording voice note</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.64)" }}>{formatDuration(recordingTimeSec)}</p>
              </div>
            </div>
            <button
              onClick={stopRecording}
              style={{
                border: "none",
                borderRadius: 999,
                background: "#fff",
                color: "#111",
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Stop
            </button>
          </div>
        ) : null}

        {voicePreviewUrl ? (
          <div style={{
            display: "grid",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Voice note ready</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.64)" }}>{formatDuration(voiceDurationSec)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={clearVoiceDraft}
                  disabled={sending}
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 999,
                    background: "transparent",
                    color: "rgba(255,255,255,0.75)",
                    padding: "8px 12px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Discard
                </button>
                <button
                  onClick={sendVoiceNote}
                  disabled={sending}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    background: "#a855f7",
                    color: "#fff",
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
            <audio controls preload="metadata" src={voicePreviewUrl} style={{ width: "100%" }} />
          </div>
        ) : null}

        {composerError ? (
          <p style={{ margin: 0, fontSize: 12, color: "#fda4af" }}>{composerError}</p>
        ) : null}

        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}>
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={!recordingSupported || sending || !!voicePreviewUrl}
            title={recordingSupported ? "Record voice note" : "Voice notes need microphone support"}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: recording
                ? "#fb7185"
                : recordingSupported && !voicePreviewUrl
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              cursor: recordingSupported && !voicePreviewUrl ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            {recording ? "■" : "🎙"}
          </button>
          <textarea
            ref={inputRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKey}
            placeholder={voicePreviewUrl ? "Send your voice note or discard it…" : "Say something…"}
            rows={1}
            disabled={recording || !!voicePreviewUrl}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "10px 16px",
              fontSize: 15,
              color: "#fff",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: "auto",
              opacity: recording || voicePreviewUrl ? 0.55 : 1,
            }}
          />
          <button
            onClick={sendText}
            disabled={!body.trim() || sending || recording || !!voicePreviewUrl}
            style={{
              width: 42, height: 42,
              borderRadius: "50%",
              background: body.trim() && !recording && !voicePreviewUrl ? "#a855f7" : "rgba(168,85,247,0.2)",
              border: "none",
              cursor: body.trim() && !recording && !voicePreviewUrl ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
              fontSize: 18,
              color: "#fff",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
