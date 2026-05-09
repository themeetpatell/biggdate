import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/require-auth";
import { getThreadById, getMessages, createMessage, markMessagesRead } from "@/lib/repo";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_MESSAGE_LEN = 4000;
const MAX_AUDIO_BYTES = 12 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/x-m4a",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
]);

let _adminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  _adminClient = createClient(url, key, { auth: { persistSession: false } });
  return _adminClient;
}

function extensionForMimeType(mimeType: string): string | null {
  switch (mimeType) {
    case "audio/webm":
      return "webm";
    case "audio/mp4":
    case "audio/x-m4a":
      return "m4a";
    case "audio/mpeg":
      return "mp3";
    case "audio/ogg":
      return "ogg";
    case "audio/wav":
      return "wav";
    default:
      return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { threadId } = await params;
  const thread = await getThreadById(threadId, auth.userId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const [messages] = await Promise.all([
    getMessages(threadId),
    markMessagesRead(threadId, auth.userId),
  ]);

  return NextResponse.json({ thread, messages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // 60 messages/min/user — generous for real conversation, blocks spam bots.
  const rl = await checkRateLimit("messages:send", auth.userId, { limit: 60, windowSec: 60 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const { threadId } = await params;
  const thread = await getThreadById(threadId, auth.userId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const audio = formData.get("audio");
    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Voice note file required" }, { status: 400 });
    }

    if (!SUPPORTED_AUDIO_TYPES.has(audio.type)) {
      return NextResponse.json({ error: "Unsupported voice note format" }, { status: 400 });
    }

    if (audio.size <= 0 || audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Voice note must be under 12 MB" }, { status: 400 });
    }

    const ext = extensionForMimeType(audio.type);
    if (!ext) {
      return NextResponse.json({ error: "Unsupported voice note format" }, { status: 400 });
    }

    const durationRaw = formData.get("durationSec");
    const durationParsed =
      typeof durationRaw === "string" ? Number.parseInt(durationRaw, 10) : Number.NaN;
    const durationSec =
      Number.isFinite(durationParsed) && durationParsed > 0
        ? Math.min(durationParsed, 15 * 60)
        : null;

    const path = `${auth.userId}/${threadId}/${Date.now()}-${randomUUID()}.${ext}`;
    const admin = getAdminClient();
    const upload = await admin.storage
      .from("voice-notes")
      .upload(path, audio, {
        cacheControl: "3600",
        contentType: audio.type,
        upsert: false,
      });

    if (upload.error) {
      return NextResponse.json({ error: "Voice note upload failed" }, { status: 500 });
    }

    const { data } = admin.storage.from("voice-notes").getPublicUrl(path);
    const message = await createMessage(threadId, auth.userId, {
      kind: "voice",
      audioUrl: data.publicUrl,
      audioDurationSec: durationSec,
      audioMimeType: audio.type || null,
    });
    return NextResponse.json(message);
  }

  const parsed = (await req.json()) as { body?: unknown };
  const raw = typeof parsed.body === "string" ? parsed.body.trim() : "";
  if (!raw) {
    return NextResponse.json({ error: "Message body required" }, { status: 400 });
  }
  if (raw.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LEN} chars)` },
      { status: 400 },
    );
  }

  const message = await createMessage(threadId, auth.userId, { kind: "text", body: raw });
  return NextResponse.json(message);
}
