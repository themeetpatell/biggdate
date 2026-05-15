import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

function getProviderName(): string {
  return (process.env.AI_PROVIDER || "gemini").toLowerCase();
}

function requireKey(provider: string, envName: string): string {
  const value = process.env[envName];
  if (!value) {
    throw new Error(
      `AI_PROVIDER=${provider} requires ${envName} to be set. ` +
        `Either configure ${envName} or change AI_PROVIDER.`,
    );
  }
  return value;
}

export function getModel(): LanguageModel {
  const provider = getProviderName();

  if (provider === "gemini") {
    const google = createGoogleGenerativeAI({
      apiKey: requireKey("gemini", "GEMINI_API_KEY"),
    });
    return google(process.env.GEMINI_MODEL || "gemini-2.5-flash");
  }

  if (provider === "openai") {
    const openai = createOpenAI({
      apiKey: requireKey("openai", "OPENAI_API_KEY"),
    });
    return openai(process.env.OPENAI_MODEL || "gpt-4.1");
  }

  throw new Error(
    `Unknown AI_PROVIDER "${provider}". Expected one of: gemini, openai.`,
  );
}
