import { useRouter } from 'expo-router';

import { AiChat } from '@/components/ai-chat';

export default function CoachScreen() {
  const router = useRouter();
  return (
    <AiChat
      endpoint="/api/coach/chat"
      title="Relationship Coach"
      emptyTitle="Your coach"
      emptyText="Practical, honest guidance on your dating life — your patterns, your next move, the hard questions."
      placeholder="Ask your coach"
      onBack={() => router.back()}
    />
  );
}
