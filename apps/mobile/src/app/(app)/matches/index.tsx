import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MatchCard } from '@/components/match-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useSentIntros } from '@/lib/use-intros';
import { useGenerateMatches, useMatches } from '@/lib/use-matches';

export default function MatchesScreen() {
  const router = useRouter();
  const matchesQuery = useMatches();
  const sentIntros = useSentIntros();
  const generateMatches = useGenerateMatches();
  const [error, setError] = useState<string | null>(null);

  const matches = matchesQuery.data ?? [];
  const knockedMatchIds = new Set((sentIntros.data ?? []).map((intro) => intro.matchId));

  async function handleGenerate() {
    setError(null);
    try {
      await generateMatches.mutateAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not find matches right now.');
    }
  }

  if (matchesQuery.isPending) {
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
          data={matches}
          keyExtractor={(match) => match.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <ThemedText type="subtitle" style={styles.heading}>
              Matches
            </ThemedText>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText type="smallBold">No matches yet</ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.emptyText}>
                We curate a small set of intentional matches for you each day.
              </ThemedText>
              {error ? (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              ) : null}
              <Button
                label="Find today's matches"
                loading={generateMatches.isPending}
                onPress={handleGenerate}
              />
            </View>
          }
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              knockSent={knockedMatchIds.has(item.id)}
              onPress={() =>
                router.push({ pathname: '/matches/[id]', params: { id: item.id } })
              }
            />
          )}
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
  heading: {
    marginBottom: Spacing.one,
  },
  empty: {
    gap: Spacing.three,
    paddingVertical: Spacing.six,
  },
  emptyText: {
    lineHeight: 20,
  },
  error: { color: '#E5484D' },
});
