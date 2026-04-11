import { createOpenAI } from "@ai-sdk/openai";

function getProvider() {
  const aiProvider = (process.env.AI_PROVIDER || "ollama-cloud").toLowerCase();

  if (aiProvider === "openai") {
    return createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  if (aiProvider === "ollama-cloud") {
    return createOpenAI({
      apiKey: process.env.OLLAMA_API_KEY || "ollama",
      baseURL: `${(process.env.OLLAMA_CLOUD_HOST || "https://ollama.com").replace(/\/$/, "")}/v1`,
    });
  }

  // Local ollama
  return createOpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "ollama-local",
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  });
}

let _provider: ReturnType<typeof createOpenAI> | null = null;

export function getAIProvider() {
  if (!_provider) _provider = getProvider();
  return _provider;
}

export function getModel() {
  const aiProvider = (process.env.AI_PROVIDER || "ollama-cloud").toLowerCase();
  if (aiProvider === "openai") return process.env.OPENAI_MODEL || "gpt-4.1";
  if (aiProvider === "ollama-cloud")
    return process.env.OLLAMA_CLOUD_MODEL || "gpt-oss:120b";
  return process.env.OLLAMA_MODEL || "llama3.1:8b";
}
