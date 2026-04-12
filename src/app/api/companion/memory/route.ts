import { generateText, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { maahiMemoryExtractionPrompt, maahiEmotionClassifierPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getSessionMemoryDb, getProfileByUserId, upsertSessionMemory } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { messages }: { messages: UIMessage[] } = await req.json();

  const [existing, profile] = await Promise.all([
    getSessionMemoryDb(auth.userId, "companion"),
    getProfileByUserId(auth.userId),
  ]);

  // Build transcript from messages
  const transcript = messages
    .map((m) => {
      const text =
        m.parts
          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("") ?? "";
      return text ? `${m.role === "user" ? "User" : "Maahi"}: ${text}` : null;
    })
    .filter(Boolean)
    .join("\n");

  if (!transcript) return new Response("ok");

  // Get the last user message for emotion classification
  const lastUserMsg =
    [...messages]
      .reverse()
      .find((m) => m.role === "user")
      ?.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

  const profileSummary = profile
    ? `${profile.attachment} attachment, ${profile.loveLanguage} love language, intent: ${profile.intent}`
    : undefined;

  // Run memory extraction + emotion classification in parallel
  const [memResult, emotionResult] = await Promise.allSettled([
    generateText({
      model: getModel(),
      prompt: maahiMemoryExtractionPrompt(transcript),
    }),
    lastUserMsg
      ? generateText({
          model: getModel(),
          prompt: maahiEmotionClassifierPrompt({
            message: lastUserMsg,
            profileSummary,
          }),
        })
      : Promise.resolve(null),
  ]);

  let patch: Record<string, unknown> = {};

  // Parse memory extraction
  if (memResult.status === "fulfilled") {
    try {
      const clean = memResult.value.text.replace(/```(?:json)?|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.shouldSave !== false) {
        patch = parsed;
      }
    } catch {
      // skip on parse failure
    }
  }

  // Parse emotion classification → store as lastEmotionalState
  let lastEmotionalState = "";
  if (emotionResult.status === "fulfilled" && emotionResult.value) {
    try {
      const clean = emotionResult.value.text.replace(/```(?:json)?|```/g, "").trim();
      const emotion = JSON.parse(clean);
      lastEmotionalState = [
        emotion.primaryEmotion,
        emotion.intensity ? `(${emotion.intensity}/10)` : "",
        emotion.suggestedMode ? `→ ${emotion.suggestedMode}` : "",
      ]
        .filter(Boolean)
        .join(" ");
    } catch {
      // skip
    }
  }

  await upsertSessionMemory(auth.userId, "companion", {
    summary: (patch.summary as string) || undefined,
    emotionalPatterns: (patch.emotionalPatterns as string[]) || [],
    triggers: (patch.triggers as string[]) || [],
    boundaries: (patch.boundaries as string[]) || [],
    needs: (patch.needs as string[]) || [],
    reassuranceStyle: (patch.reassuranceStyle as string) || undefined,
    communicationStyle: (patch.communicationStyle as string) || undefined,
    stableTraits: (patch.stableTraits as string[]) || [],
    growthEdges: (patch.growthEdges as string[]) || [],
    currentSituation: (patch.currentSituation as string) || undefined,
    ...(lastEmotionalState ? { lastEmotionalState } : {}),
  });

  return new Response("ok");
}
