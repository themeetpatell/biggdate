import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = Number(process.env.PORT || 8787);
const provider = (process.env.AI_PROVIDER || "ollama").toLowerCase();
const openAiModel = process.env.OPENAI_MODEL || "gpt-4.1";
const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1:8b";
const ollamaCloudModel = process.env.OLLAMA_CLOUD_MODEL || "gpt-oss:120b";
const defaultModel = provider === "openai"
  ? openAiModel
  : provider === "ollama-cloud"
    ? ollamaCloudModel
    : ollamaModel;
const memoryFile = path.resolve("data", "memory.json");
const platformStoreFile = path.resolve("data", "platform.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function ensureMemoryFile() {
  const dir = path.dirname(memoryFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(memoryFile)) {
    fs.writeFileSync(memoryFile, JSON.stringify({ sessions: {} }, null, 2));
  }
}

function ensurePlatformStoreFile() {
  const dir = path.dirname(platformStoreFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(platformStoreFile)) {
    fs.writeFileSync(
      platformStoreFile,
      JSON.stringify({ waitlist: [], intros: [], passes: [], debriefs: [] }, null, 2),
    );
  }
}

function readMemoryStore() {
  ensureMemoryFile();
  try {
    return JSON.parse(fs.readFileSync(memoryFile, "utf-8"));
  } catch {
    return { sessions: {} };
  }
}

function writeMemoryStore(store) {
  ensureMemoryFile();
  fs.writeFileSync(memoryFile, JSON.stringify(store, null, 2));
}

function readPlatformStore() {
  ensurePlatformStoreFile();
  try {
    return JSON.parse(fs.readFileSync(platformStoreFile, "utf-8"));
  } catch {
    return { waitlist: [], intros: [], passes: [], debriefs: [] };
  }
}

function writePlatformStore(store) {
  ensurePlatformStoreFile();
  fs.writeFileSync(platformStoreFile, JSON.stringify(store, null, 2));
}

function createRecordId(prefix) {
  return `${prefix}_${randomUUID()}`;
}

function getClientFromRequest(req) {
  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return {
      mode: "openai-compatible",
      client: new OpenAI({ apiKey }),
      keyRequired: true,
      hasEnvKey: Boolean(process.env.OPENAI_API_KEY),
      provider,
    };
  }

  if (provider === "ollama-cloud") {
    const host = process.env.OLLAMA_CLOUD_HOST || "https://ollama.com";
    const apiKey = process.env.OLLAMA_API_KEY;
    if (!apiKey) return null;
    return {
      mode: "ollama-cloud",
      host: host.replace(/\/$/, ""),
      apiKey,
      keyRequired: true,
      hasEnvKey: Boolean(process.env.OLLAMA_API_KEY),
      provider,
    };
  }

  const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1";
  const apiKey = process.env.OLLAMA_API_KEY || "ollama-local";
  return {
    mode: "openai-compatible",
    client: new OpenAI({ apiKey, baseURL }),
    keyRequired: false,
    hasEnvKey: Boolean(process.env.OLLAMA_API_KEY),
    provider,
    baseURL,
  };
}

async function createCompletion({ clientConfig, model, temperature, maxTokens, messages }) {
  if (clientConfig.mode === "ollama-cloud") {
    const response = await fetch(`${clientConfig.host}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${clientConfig.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Ollama cloud request failed.");
    }

    return data?.message?.content || "I’m here with you. Tell me more.";
  }

  const completion = await clientConfig.client.chat.completions.create({
    model,
    temperature,
    max_tokens: maxTokens,
    messages,
  });

  return completion.choices?.[0]?.message?.content || "I’m here with you. Tell me more.";
}

function clipMessages(messages = []) {
  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant") && typeof message.content === "string")
    .slice(-20)
    .map((message) => ({ role: message.role, content: message.content.slice(0, 1500) }));
}

function getSessionMemory(sessionId) {
  const store = readMemoryStore();
  return store.sessions?.[sessionId] || null;
}

function updateSessionMemory(sessionId, patch) {
  if (!sessionId) return;
  const store = readMemoryStore();
  const current = store.sessions?.[sessionId] || {
    summary: "",
    traits: [],
    needs: [],
    boundaries: [],
    emotionalPatterns: [],
    triggers: [],
    reassuranceStyle: "",
    communicationStyle: "",
    companionNotes: "",
    attachmentGuess: "",
    readiness: null,
    previousQuestions: [],
    lastUpdated: null,
  };
  const merged = {
    ...current,
    ...patch,
    traits: Array.from(new Set([...(current.traits || []), ...((patch && patch.traits) || [])])).slice(0, 8),
    needs: Array.from(new Set([...(current.needs || []), ...((patch && patch.needs) || [])])).slice(0, 8),
    boundaries: Array.from(new Set([...(current.boundaries || []), ...((patch && patch.boundaries) || [])])).slice(0, 8),
    emotionalPatterns: Array.from(new Set([...(current.emotionalPatterns || []), ...((patch && patch.emotionalPatterns) || [])])).slice(0, 10),
    triggers: Array.from(new Set([...(current.triggers || []), ...((patch && patch.triggers) || [])])).slice(0, 10),
    previousQuestions: Array.from(new Set([...(current.previousQuestions || []), ...((patch && patch.previousQuestions) || [])])).slice(-24),
    lastUpdated: new Date().toISOString(),
  };
  store.sessions[sessionId] = merged;
  writeMemoryStore(store);
}

function extractAssistantQuestions(messages = []) {
  return messages
    .filter((message) => message?.role === "assistant" && typeof message.content === "string")
    .flatMap((message) => {
      const found = message.content.match(/[^?\n]{4,140}\?/g) || [];
      return found.map((item) => item.trim().replace(/\s+/g, " "));
    });
}

function extractJsonObject(text = "") {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function extractJsonArray(text = "") {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackProfileFromConversation(conversation = []) {
  const firstUserMessage = conversation.find((item) => item?.role === "user" && typeof item.content === "string")?.content || "Friend";
  return {
    name: firstUserMessage.split(" ")[0] || "Friend",
    city: "Unknown",
    attachment: "Anxious",
    attachmentScore: 70,
    readinessScore: 65,
    growthAreas: ["Clarify non-negotiables", "Strengthen communication under stress", "Choose consistency over chemistry spikes"],
    strengths: ["Emotionally expressive", "Willing to self-reflect", "Values deep connection"],
    coreValues: ["Trust", "Consistency", "Growth"],
    summary: "You seek emotional depth and consistency. You’re ready for meaningful love with grounded boundaries.",
    coachingFocus: "Choose aligned people early and communicate needs directly.",
  };
}

async function learnSessionMemory({ clientConfig, model, sessionId, messages }) {
  if (!sessionId || !messages?.length) return;
  const observedQuestions = extractAssistantQuestions(messages);
  if (observedQuestions.length) {
    updateSessionMemory(sessionId, { previousQuestions: observedQuestions });
  }

  const transcript = messages
    .slice(-16)
    .map((item) => `${item.role.toUpperCase()}: ${item.content}`)
    .join("\n");

  const memoryPrompt = `Extract stable user relationship signals from this conversation. Return STRICT JSON only with keys: summary (string), traits (string[]), needs (string[]), boundaries (string[]), emotionalPatterns (string[]), triggers (string[]), reassuranceStyle (string), communicationStyle (string), companionNotes (string), attachmentGuess (string), readiness (number 0-100 or null). Keep it concise and avoid invented facts.\n\nConversation:\n${transcript}`;

  try {
    const text = await createCompletion({
      clientConfig,
      model,
      temperature: 0.2,
      maxTokens: 260,
      messages: [{ role: "user", content: memoryPrompt }],
    });

    const parsed = JSON.parse((text || "").trim());
    updateSessionMemory(sessionId, {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      traits: Array.isArray(parsed.traits) ? parsed.traits.filter(Boolean) : [],
      needs: Array.isArray(parsed.needs) ? parsed.needs.filter(Boolean) : [],
      boundaries: Array.isArray(parsed.boundaries) ? parsed.boundaries.filter(Boolean) : [],
      emotionalPatterns: Array.isArray(parsed.emotionalPatterns) ? parsed.emotionalPatterns.filter(Boolean) : [],
      triggers: Array.isArray(parsed.triggers) ? parsed.triggers.filter(Boolean) : [],
      reassuranceStyle: typeof parsed.reassuranceStyle === "string" ? parsed.reassuranceStyle : "",
      communicationStyle: typeof parsed.communicationStyle === "string" ? parsed.communicationStyle : "",
      companionNotes: typeof parsed.companionNotes === "string" ? parsed.companionNotes : "",
      attachmentGuess: typeof parsed.attachmentGuess === "string" ? parsed.attachmentGuess : "",
      readiness: typeof parsed.readiness === "number" ? Math.max(0, Math.min(100, parsed.readiness)) : null,
    });
  } catch {
    // Non-blocking: chat should still work even if memory extraction fails.
  }
}

app.get("/api/health", (_req, res) => {
  const hasEnvKey = provider === "openai"
    ? Boolean(process.env.OPENAI_API_KEY)
    : Boolean(process.env.OLLAMA_API_KEY);
  const keyRequired = provider === "openai" || provider === "ollama-cloud";
  res.json({ ok: true, provider, hasEnvKey, keyRequired });
});

app.post("/api/chat", async (req, res) => {
  const clientConfig = getClientFromRequest(req);
  if (!clientConfig) {
    const message = provider === "openai"
      ? "Missing API key. Set OPENAI_API_KEY in .env (then restart server) or send x-ai-key header."
      : "Missing API key. Set OLLAMA_API_KEY in .env (then restart server) or send x-ai-key header.";
    return res.status(400).json({ error: message });
  }

  const {
    systemPrompt = "You are a helpful assistant.",
    messages = [],
    userMessage = "",
    sessionId = "default",
    model = defaultModel,
    temperature = 0.7,
    maxTokens = 450,
  } = req.body || {};

  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ error: "userMessage is required." });
  }

  const memory = getSessionMemory(sessionId);
  const memoryContext = memory
    ? `Known user memory:\n- Summary: ${memory.summary || ""}\n- Traits: ${(memory.traits || []).join(", ")}\n- Needs: ${(memory.needs || []).join(", ")}\n- Boundaries: ${(memory.boundaries || []).join(", ")}\n- Emotional patterns: ${(memory.emotionalPatterns || []).join(", ")}\n- Triggers: ${(memory.triggers || []).join(", ")}\n- Reassurance style: ${memory.reassuranceStyle || ""}\n- Communication style: ${memory.communicationStyle || ""}\n- Companion notes: ${memory.companionNotes || ""}\n- Attachment guess: ${memory.attachmentGuess || ""}\n- Readiness: ${memory.readiness ?? "unknown"}\n- Previously asked questions: ${(memory.previousQuestions || []).join(" | ") || "none"}`
    : "No prior user memory yet.";

  const clipped = clipMessages(messages);
  const openAiMessages = [
    { role: "system", content: `${systemPrompt}\n\n${memoryContext}` },
    ...clipped,
    { role: "user", content: userMessage },
  ];

  try {
    const response = await createCompletion({
      clientConfig,
      model,
      temperature,
      maxTokens,
      messages: openAiMessages,
    });

    const updatedTranscript = [...clipped, { role: "user", content: userMessage }, { role: "assistant", content: response }];
    void learnSessionMemory({ clientConfig, model, sessionId, messages: updatedTranscript });

    return res.json({ response });
  } catch (error) {
    const status = error?.status || 500;
    return res.status(status).json({
      error: error?.message || "Failed to get AI response.",
    });
  }
});

app.post("/api/coach-plan", async (req, res) => {
  const clientConfig = getClientFromRequest(req);
  if (!clientConfig) {
    const message = provider === "openai"
      ? "Missing API key. Set OPENAI_API_KEY in .env (then restart server) or send x-ai-key header."
      : "Missing API key. Set OLLAMA_API_KEY in .env (then restart server) or send x-ai-key header.";
    return res.status(400).json({ error: message });
  }

  const { profile, model = defaultModel } = req.body || {};
  if (!profile) {
    return res.status(400).json({ error: "profile is required." });
  }

  const prompt = `Based on this soul profile, create a warm, inspiring 30-day relationship readiness coaching plan.\nProfile: ${JSON.stringify(profile)}\nFormat as 3 phases of 10 days each. Be specific and actionable but poetic. Each phase: title + 2-3 practices. Keep it under 400 words. No markdown headers, just flowing text with clear phase labels like "Phase 1 (Days 1-10):" etc.`;

  try {
    const plan = await createCompletion({
      clientConfig,
      model,
      temperature: 0.8,
      maxTokens: 900,
      messages: [{ role: "user", content: prompt }],
    });

    return res.json({ plan });
  } catch (error) {
    const status = error?.status || 500;
    return res.status(status).json({ error: error?.message || "Failed to generate coaching plan." });
  }
});

app.post("/api/profile/derive", async (req, res) => {
  const clientConfig = getClientFromRequest(req);
  if (!clientConfig) {
    const message = provider === "openai"
      ? "Missing API key. Set OPENAI_API_KEY in .env (then restart server) or send x-ai-key header."
      : "Missing API key. Set OLLAMA_API_KEY in .env (then restart server) or send x-ai-key header.";
    return res.status(400).json({ error: message });
  }

  const { conversation = [], sessionId = "default", model = defaultModel } = req.body || {};
  const transcript = (Array.isArray(conversation) ? conversation : [])
    .filter((item) => item && typeof item.content === "string")
    .slice(-30)
    .map((item) => `${item.role?.toUpperCase()}: ${item.content}`)
    .join("\n");

  if (!transcript) {
    return res.status(400).json({ error: "conversation is required." });
  }

  const prompt = `You are generating a final relationship profile from onboarding chat.
Return STRICT JSON only (no markdown, no explanation) with this exact shape:
{
  "name": "string",
  "city": "string",
  "attachment": "Secure|Anxious|Avoidant|Fearful-Avoidant",
  "attachmentScore": 0,
  "readinessScore": 0,
  "growthAreas": ["string", "string", "string"],
  "strengths": ["string", "string", "string"],
  "coreValues": ["string", "string", "string"],
  "summary": "string",
  "coachingFocus": "string"
}

Use only evidence from the transcript.
Transcript:
${transcript}`;

  try {
    const responseText = await createCompletion({
      clientConfig,
      model,
      temperature: 0.4,
      maxTokens: 900,
      messages: [{ role: "user", content: prompt }],
    });

    const profile = extractJsonObject(responseText) || fallbackProfileFromConversation(conversation);
    updateSessionMemory(sessionId, {
      summary: profile.summary || "",
      traits: profile.strengths || [],
      needs: profile.coreValues || [],
      attachmentGuess: profile.attachment || "",
      readiness: typeof profile.readinessScore === "number" ? profile.readinessScore : null,
    });
    return res.json({ profile });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to derive profile." });
  }
});

app.post("/api/matches/generate", async (req, res) => {
  const clientConfig = getClientFromRequest(req);
  if (!clientConfig) {
    const message = provider === "openai"
      ? "Missing API key. Set OPENAI_API_KEY in .env (then restart server) or send x-ai-key header."
      : "Missing API key. Set OLLAMA_API_KEY in .env (then restart server) or send x-ai-key header.";
    return res.status(400).json({ error: message });
  }

  const { profile, model = defaultModel } = req.body || {};
  if (!profile) return res.status(400).json({ error: "profile is required." });

  const prompt = `Generate exactly 3 highly compatible matches for this profile.
Profile: ${JSON.stringify(profile)}

Return ONLY a JSON array. Each item must include:
name, age, city, profession, attachment, compatibilityScore (0-100), authenticityScore (0-100), intentAlignment ("High"|"Medium"|"Low"), sharedValues (2 strings), whyTheyWork, conversationStarter, potentialFriction, emoji`;

  try {
    const responseText = await createCompletion({
      clientConfig,
      model,
      temperature: 0.8,
      maxTokens: 1400,
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = extractJsonArray(responseText);
    if (!Array.isArray(parsed) || !parsed.length) {
      return res.status(500).json({ error: "Could not parse matches." });
    }
    return res.json({ matches: parsed.slice(0, 3) });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to generate matches." });
  }
});

app.post("/api/matches/briefing", async (req, res) => {
  const clientConfig = getClientFromRequest(req);
  if (!clientConfig) {
    const message = provider === "openai"
      ? "Missing API key. Set OPENAI_API_KEY in .env (then restart server) or send x-ai-key header."
      : "Missing API key. Set OLLAMA_API_KEY in .env (then restart server) or send x-ai-key header.";
    return res.status(400).json({ error: message });
  }

  const { profile, match, model = defaultModel } = req.body || {};
  if (!profile || !match) return res.status(400).json({ error: "profile and match are required." });

  const prompt = `You are a relationship strategist. Create an agent briefing.
Profile: ${JSON.stringify(profile)}
Match: ${JSON.stringify(match)}

Return STRICT JSON only:
{
  "briefing": "2-4 short paragraphs",
  "dateIdeas": ["idea1", "idea2", "idea3"],
  "preDateQuestions": ["q1", "q2", "q3"],
  "watchFors": ["w1", "w2", "w3"]
}`;

  try {
    const responseText = await createCompletion({
      clientConfig,
      model,
      temperature: 0.75,
      maxTokens: 1100,
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = extractJsonObject(responseText);
    if (!parsed) {
      return res.json({ briefing: responseText });
    }
    return res.json({ briefing: JSON.stringify(parsed) });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to generate briefing." });
  }
});

app.post("/api/waitlist/join", (req, res) => {
  const { name = "", email = "", city = "", intent = "long-term" } = req.body || {};
  if (!name.trim() || !email.trim() || !city.trim()) {
    return res.status(400).json({ error: "name, email, and city are required." });
  }

  const store = readPlatformStore();
  const existing = store.waitlist.find(
    (entry) => entry.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (existing) {
    return res.json({ joined: true, entry: existing, duplicate: true });
  }

  const entry = {
    id: createRecordId("wl"),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    city: city.trim(),
    intent,
    createdAt: new Date().toISOString(),
  };
  store.waitlist.push(entry);
  writePlatformStore(store);
  return res.json({ joined: true, entry, duplicate: false });
});

app.post("/api/intros/request", async (req, res) => {
  const { profile, match, notes = "", model = defaultModel } = req.body || {};
  if (!profile || !match) {
    return res.status(400).json({ error: "profile and match are required." });
  }

  const store = readPlatformStore();
  const intro = {
    id: createRecordId("intro"),
    profileName: profile.name || "Unknown",
    matchName: match.name || "Unknown",
    profile,
    match,
    notes,
    status: "requested",
    createdAt: new Date().toISOString(),
  };

  const clientConfig = getClientFromRequest(req);
  if (clientConfig) {
    try {
      const conciergePrompt = `Create a concise date concierge package in STRICT JSON only.
Profile: ${JSON.stringify(profile)}
Match: ${JSON.stringify(match)}

Return:
{
  "datePlan": ["idea1", "idea2", "idea3"],
  "logistics": "single short paragraph",
  "preDateTips": ["tip1", "tip2", "tip3"]
}`;

      const conciergeResponse = await createCompletion({
        clientConfig,
        model,
        temperature: 0.7,
        maxTokens: 800,
        messages: [{ role: "user", content: conciergePrompt }],
      });

      const parsed = extractJsonObject(conciergeResponse);
      if (parsed) {
        intro.concierge = parsed;
      }
    } catch {
      // Non-blocking; intro request should still be captured.
    }
  }

  store.intros.push(intro);
  writePlatformStore(store);
  return res.json({ requested: true, intro });
});

app.post("/api/intros/pass", (req, res) => {
  const { profile, match, reason = "" } = req.body || {};
  if (!profile || !match) {
    return res.status(400).json({ error: "profile and match are required." });
  }

  const store = readPlatformStore();
  const passRecord = {
    id: createRecordId("pass"),
    profileName: profile.name || "Unknown",
    matchName: match.name || "Unknown",
    reason,
    createdAt: new Date().toISOString(),
  };
  store.passes.push(passRecord);
  writePlatformStore(store);
  return res.json({ passed: true, pass: passRecord });
});

app.get("/api/intros", (req, res) => {
  const { profileName = "" } = req.query;
  const store = readPlatformStore();
  const intros = profileName
    ? store.intros.filter((intro) => intro.profileName?.toLowerCase() === String(profileName).toLowerCase())
    : store.intros;
  return res.json({ intros });
});

app.post("/api/dates/debrief", async (req, res) => {
  const { profile, match, notes = "", rating = 0, secondDateIntent = false, model = defaultModel } = req.body || {};
  if (!profile || !match || !notes.trim()) {
    return res.status(400).json({ error: "profile, match, and notes are required." });
  }

  const store = readPlatformStore();
  const debrief = {
    id: createRecordId("debrief"),
    profileName: profile.name || "Unknown",
    matchName: match.name || "Unknown",
    notes,
    rating,
    secondDateIntent: Boolean(secondDateIntent),
    createdAt: new Date().toISOString(),
  };

  const clientConfig = getClientFromRequest(req);
  if (clientConfig) {
    try {
      const prompt = `You are a world-class relationship coach. Based on this date debrief, return STRICT JSON only:
{
  "summary": "2 short paragraphs",
  "signals": ["signal1", "signal2", "signal3"],
  "nextStep": "single clear recommendation",
  "riskFlags": ["risk1", "risk2"]
}

Profile: ${JSON.stringify(profile)}
Match: ${JSON.stringify(match)}
Debrief notes: ${notes}
Date rating: ${rating}/10
Second date intent: ${Boolean(secondDateIntent)}`;

      const analysisText = await createCompletion({
        clientConfig,
        model,
        temperature: 0.5,
        maxTokens: 900,
        messages: [{ role: "user", content: prompt }],
      });

      const analysis = extractJsonObject(analysisText);
      if (analysis) {
        debrief.analysis = analysis;
      }
    } catch {
      // Non-blocking for persistence.
    }
  }

  store.debriefs.push(debrief);
  writePlatformStore(store);
  return res.json({ saved: true, debrief });
});

app.listen(port, () => {
  ensureMemoryFile();
  ensurePlatformStoreFile();
  console.log(`API listening on http://localhost:${port}`);
});
