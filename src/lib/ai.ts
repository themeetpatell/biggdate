import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

function getProviderName(): string {
  return (process.env.AI_PROVIDER || "gemini").toLowerCase();
}

export function getModel(): LanguageModel {
  const provider = getProviderName();

  if (provider === "gemini") {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    return google(process.env.GEMINI_MODEL || "gemini-2.5-flash");
  }

  if (provider === "openai") {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
    return openai(process.env.OPENAI_MODEL || "gpt-4.1");
  }

  if (provider === "ollama-cloud") {
    const ollama = createOpenAI({
      apiKey: process.env.OLLAMA_API_KEY || "ollama",
      baseURL: `${(process.env.OLLAMA_CLOUD_HOST || "https://ollama.com").replace(/\/$/, "")}/v1`,
    });
    return ollama(process.env.OLLAMA_CLOUD_MODEL || "gpt-oss:120b");
  }

  // Local ollama (default for dev)
  const ollama = createOpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "ollama-local",
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  });
  return ollama(process.env.OLLAMA_MODEL || "llama3.1:8b");
}
