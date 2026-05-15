import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { log } from "@/lib/log";
import {
  getProfileByUserId,
  getAccountHandleByUserId,
  getIntrosForUser,
  getIntrosReceivedByUser,
  getThreadsForUser,
  getMessages,
  getDebriefReflectionsForUser,
  getUserPlan,
  getActiveAddons,
} from "@/lib/repo";
import { getMaahiMemory } from "@/lib/maahi/memory";

/**
 * Self-serve data export. Returns everything BiggDate holds that the user
 * owns, as a single downloadable JSON file. Required for DPDP (India) and
 * GDPR (EU) — the support-assisted 7-day process is fine for closed beta
 * but not for open beta with any EU traffic.
 *
 * GET /api/auth/export → application/json with Content-Disposition
 * attachment so browsers download rather than render it.
 */
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Export is expensive (many queries) — cap it well below anything a real
  // user would need. One export per 10 minutes is generous.
  const rl = await checkRateLimit("auth:export", auth.userId, {
    limit: 3,
    windowSec: 600,
  });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const [
      profile,
      account,
      introsSent,
      introsReceived,
      threads,
      debriefs,
      plan,
      addons,
      maahiMemory,
    ] = await Promise.all([
      getProfileByUserId(auth.userId),
      getAccountHandleByUserId(auth.userId),
      getIntrosForUser(auth.userId),
      getIntrosReceivedByUser(auth.userId),
      getThreadsForUser(auth.userId),
      getDebriefReflectionsForUser(auth.userId),
      getUserPlan(auth.userId),
      getActiveAddons(auth.userId),
      getMaahiMemory(auth.userId),
    ]);

    // Messages live per-thread — gather them after we know the thread list.
    const conversations = await Promise.all(
      threads.map(async (thread) => ({
        thread,
        messages: await getMessages(thread.id),
      })),
    );

    const payload = {
      exportMeta: {
        generatedAt: new Date().toISOString(),
        userId: auth.userId,
        format: "biggdate-data-export-v1",
        note: "This file contains the personal data BiggDate holds for your account.",
      },
      account,
      profile,
      intros: { sent: introsSent, received: introsReceived },
      conversations,
      debriefReflections: debriefs,
      billing: { plan, addons },
      maahiMemory,
    };

    const filename = `biggdate-export-${new Date().toISOString().slice(0, 10)}.json`;
    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    log.error("data export failed", err, { userId: auth.userId });
    return NextResponse.json(
      { error: "Export failed. Please try again or contact support." },
      { status: 500 },
    );
  }
}
