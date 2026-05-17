import { Ionicons } from '@expo/vector-icons';
import type { PulsePost } from '@biggdate/shared';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useReactToPost } from '@/lib/use-pulse';

const TYPE_LABEL: Record<PulsePost['type'], string> = {
  prompt_response: 'Prompt response',
  confession: 'Confession',
  question: 'Question',
};

export function PulsePostCard({ post }: { post: PulsePost }) {
  const theme = useTheme();
  const react = useReactToPost();
  const [resonated, setResonated] = useState(post.isResonated);
  const [count, setCount] = useState(post.resonateCount);

  function handleReact() {
    const next = !resonated;
    setResonated(next);
    setCount((current) => current + (next ? 1 : -1));
    react.mutate(post.id, {
      onError: () => {
        setResonated(!next);
        setCount((current) => current + (next ? -1 : 1));
      },
    });
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.meta}>
        <ThemedText type="small" themeColor="textSecondary">
          {TYPE_LABEL[post.type]}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {post.isVerified ? `${post.authorHandle} · Verified` : post.authorHandle}
        </ThemedText>
      </View>

      {post.type === 'prompt_response' && post.promptContent ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.prompt}>
          “{post.promptContent}”
        </ThemedText>
      ) : null}

      <ThemedText>{post.content}</ThemedText>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: resonated }}
          onPress={handleReact}
          style={styles.reaction}
          hitSlop={8}>
          <Ionicons
            name={resonated ? 'heart' : 'heart-outline'}
            size={18}
            color={resonated ? theme.error : theme.textSecondary}
          />
          <ThemedText type="small" themeColor="textSecondary">
            {count}
          </ThemedText>
        </Pressable>
        <View style={styles.reaction}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary">
            {post.replyCount}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  prompt: {
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.four,
    marginTop: Spacing.one,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
