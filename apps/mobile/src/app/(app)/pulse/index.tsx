import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PulsePostCard } from '@/components/pulse-post-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePulseFeed, useTodayPrompt } from '@/lib/use-pulse';

export default function PulseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const feed = usePulseFeed('hot');
  const promptQuery = useTodayPrompt();

  const posts = feed.data?.posts ?? [];
  const prompt = promptQuery.data?.prompt ?? null;

  if (feed.isPending) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <ThemedText type="subtitle">Pulse</ThemedText>
                <Button label="Share" onPress={() => router.push('/pulse/compose')} />
              </View>
              {prompt ? (
                <View style={[styles.promptCard, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="smallBold" themeColor="textSecondary">
                    TODAY&apos;S PROMPT
                  </ThemedText>
                  <ThemedText>{prompt.content}</ThemedText>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText type="smallBold">Pulse is quiet right now</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                Be the first to share something honest with the community.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => <PulsePostCard post={item} />}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  header: { gap: Spacing.three },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  promptCard: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  empty: {
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  emptyText: { lineHeight: 20 },
});
