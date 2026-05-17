import { AiChat } from '@/components/ai-chat';

export default function HomeScreen() {
  return (
    <AiChat
      endpoint="/api/maahi"
      title="Maahi"
      emptyTitle="Meet Maahi"
      emptyText="Your relationship companion. Talk through anything — a date that left you unsure, a tricky text, what you actually want."
      placeholder="Tell Maahi what's on your mind"
    />
  );
}
