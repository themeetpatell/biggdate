import { log } from "./log";

/**
 * Photo moderation via Sightengine.
 *
 * Activates when SIGHTENGINE_USER and SIGHTENGINE_SECRET are set. Without
 * keys, returns `safe` with `provider: null` and emits a warning — useful
 * for local dev where moderation isn't critical.
 *
 * Sightengine docs: https://sightengine.com/docs/nudity-detection-api
 */

export type ModerationVerdict = "safe" | "flagged";

export interface ModerationResult {
  verdict: ModerationVerdict;
  reason: string | null;
  scores: Record<string, number> | null;
  provider: "sightengine" | null;
}

const NUDITY_THRESHOLD = 0.6;
const VIOLENCE_THRESHOLD = 0.6;
const WEAPON_THRESHOLD = 0.6;
const MINOR_THRESHOLD = 0.5;

interface SightengineResponse {
  status?: string;
  error?: { message?: string };
  nudity?: {
    sexual_activity?: number;
    sexual_display?: number;
    erotica?: number;
    raw?: number;
    partial?: number;
  };
  weapon?: { classes?: { firearm?: number; knife?: number } };
  violence?: { prob?: number };
  minor?: { prob?: number };
  faces?: Array<{ minor?: { prob?: number } }>;
}

export async function moderatePhoto(photoUrl: string): Promise<ModerationResult> {
  const user = process.env.SIGHTENGINE_USER;
  const secret = process.env.SIGHTENGINE_SECRET;

  if (!user || !secret) {
    log.warn("photo moderation skipped — SIGHTENGINE_USER/SECRET not configured", {
      photoUrl,
    });
    return { verdict: "safe", reason: null, scores: null, provider: null };
  }

  try {
    const params = new URLSearchParams({
      url: photoUrl,
      models: "nudity-2.1,weapon,violence,offensive,minor",
      api_user: user,
      api_secret: secret,
    });
    const res = await fetch(`https://api.sightengine.com/1.0/check.json?${params}`);
    const data = (await res.json()) as SightengineResponse;

    if (!res.ok || data.status !== "success") {
      const message = data.error?.message || `HTTP ${res.status}`;
      log.warn("sightengine call failed — failing open", { error: message, photoUrl });
      return { verdict: "safe", reason: null, scores: null, provider: null };
    }

    const scores = {
      sexual_activity: data.nudity?.sexual_activity ?? 0,
      sexual_display: data.nudity?.sexual_display ?? 0,
      erotica: data.nudity?.erotica ?? 0,
      nudity_raw: data.nudity?.raw ?? 0,
      nudity_partial: data.nudity?.partial ?? 0,
      firearm: data.weapon?.classes?.firearm ?? 0,
      knife: data.weapon?.classes?.knife ?? 0,
      violence: data.violence?.prob ?? 0,
      minor:
        data.minor?.prob ??
        Math.max(0, ...(data.faces?.map((f) => f.minor?.prob ?? 0) ?? [])),
    };

    const reasons: string[] = [];
    if (scores.sexual_activity >= NUDITY_THRESHOLD) reasons.push("sexual content");
    if (scores.sexual_display >= NUDITY_THRESHOLD) reasons.push("explicit nudity");
    if (scores.nudity_raw >= NUDITY_THRESHOLD) reasons.push("raw nudity");
    if (scores.firearm >= WEAPON_THRESHOLD) reasons.push("firearm");
    if (scores.knife >= WEAPON_THRESHOLD) reasons.push("knife");
    if (scores.violence >= VIOLENCE_THRESHOLD) reasons.push("violence");
    if (scores.minor >= MINOR_THRESHOLD) reasons.push("possible minor");

    if (reasons.length > 0) {
      return {
        verdict: "flagged",
        reason: reasons.join(", "),
        scores,
        provider: "sightengine",
      };
    }

    return { verdict: "safe", reason: null, scores, provider: "sightengine" };
  } catch (err) {
    // Fail open — a moderation outage should not block legitimate uploads.
    // The flagged_users table + reporting flow catches what slipped through.
    log.warn("sightengine threw — failing open", {
      error: err instanceof Error ? err.message : String(err),
      photoUrl,
    });
    return { verdict: "safe", reason: null, scores: null, provider: null };
  }
}

export async function moderatePhotoBuffer(
  buffer: Uint8Array,
  mimeType: string,
): Promise<ModerationResult> {
  const user = process.env.SIGHTENGINE_USER;
  const secret = process.env.SIGHTENGINE_SECRET;

  if (!user || !secret) {
    log.warn("photo moderation skipped — SIGHTENGINE_USER/SECRET not configured");
    return { verdict: "safe", reason: null, scores: null, provider: null };
  }

  try {
    const form = new FormData();
    form.append("media", new Blob([buffer.buffer as ArrayBuffer], { type: mimeType }), "photo");
    form.append("models", "nudity-2.1,weapon,violence,offensive,minor");
    form.append("api_user", user);
    form.append("api_secret", secret);

    const res = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as SightengineResponse;

    if (!res.ok || data.status !== "success") {
      const message = data.error?.message || `HTTP ${res.status}`;
      log.warn("sightengine binary call failed — failing open", { error: message });
      return { verdict: "safe", reason: null, scores: null, provider: null };
    }

    const scores = {
      sexual_activity: data.nudity?.sexual_activity ?? 0,
      sexual_display: data.nudity?.sexual_display ?? 0,
      erotica: data.nudity?.erotica ?? 0,
      nudity_raw: data.nudity?.raw ?? 0,
      nudity_partial: data.nudity?.partial ?? 0,
      firearm: data.weapon?.classes?.firearm ?? 0,
      knife: data.weapon?.classes?.knife ?? 0,
      violence: data.violence?.prob ?? 0,
      minor:
        data.minor?.prob ??
        Math.max(0, ...(data.faces?.map((f) => f.minor?.prob ?? 0) ?? [])),
    };

    const reasons: string[] = [];
    if (scores.sexual_activity >= NUDITY_THRESHOLD) reasons.push("sexual content");
    if (scores.sexual_display >= NUDITY_THRESHOLD) reasons.push("explicit nudity");
    if (scores.nudity_raw >= NUDITY_THRESHOLD) reasons.push("raw nudity");
    if (scores.firearm >= WEAPON_THRESHOLD) reasons.push("firearm");
    if (scores.knife >= WEAPON_THRESHOLD) reasons.push("knife");
    if (scores.violence >= VIOLENCE_THRESHOLD) reasons.push("violence");
    if (scores.minor >= MINOR_THRESHOLD) reasons.push("possible minor");

    if (reasons.length > 0) {
      return { verdict: "flagged", reason: reasons.join(", "), scores, provider: "sightengine" };
    }

    return { verdict: "safe", reason: null, scores, provider: "sightengine" };
  } catch (err) {
    log.warn("sightengine binary threw — failing open", {
      error: err instanceof Error ? err.message : String(err),
    });
    return { verdict: "safe", reason: null, scores: null, provider: null };
  }
}
