"use client";

import type { UIMessage } from "ai";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

export function ChatMessage({ message }: { message: UIMessage }) {
  const textParts = message.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") || "";

  if (!textParts) return null;

  return (
    <Message from={message.role}>
      <MessageContent>
        {message.role === "assistant" ? (
          <MessageResponse>{textParts}</MessageResponse>
        ) : (
          <p>{textParts}</p>
        )}
      </MessageContent>
    </Message>
  );
}
