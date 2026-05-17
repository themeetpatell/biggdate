import { ApiError } from '@biggdate/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLifePreview } from '@/lib/use-life-preview';

export default function LifePreviewScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const previewQuery = useLifePreview(matchId);

  const isPaywalled =
    previewQuery.error instanceof ApiError && previewQuery.error.status === 403;
  const preview = previewQuery.data ?? null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <Button label="Back" variant="secondary" onPress={() => router.back()} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {previewQuery.isPending ? (
            <View style={styles.statusBox}>
              <ActivityIndicator />
              <ThemedText themeColor="textSecondary">
                Imagining a life together…
              </ThemedText>
            </View>
          ) : isPaywalled ? (
            <View style={[styles.statusBox, styles.lockedBox, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="subtitle">A Premium preview</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.centerText}>
                Life Preview imagines the relationship you could build together.
                Upgrade to BiggDate Premium to unlock it.
              </ThemedText>
            </View>
          ) : previewQuery.isError || !preview ? (
            <View style={styles.statusBox}>
              <ThemedText themeColor="textSecondary" style={styles.centerText}>
                We couldn&apos;t generate this preview. Try again later.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.body}>
              <ThemedText type="title">A life with {preview.match.name}</ThemedText>

              <Section title="The arc">
                <ThemedText>{preview.storyArc}</ThemedText>
              </Section>

              <Section title="A day in the life">
                <ThemedText>{preview.dayInTheLife}</ThemedText>
              </Section>

              <Section title="Where you overlap">
                <View style={styles.pills}>
                  {preview.compatibilityMap.valuesOverlap.map((value) => (
                    <View
                      key={value}
                      style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText type="small">{value}</ThemedText>
                    </View>
                  ))}
                </View>
                <Fact label="Communication" value={preview.compatibilityMap.communicationFit} />
                <Fact label="Conflict" value={preview.compatibilityMap.conflictStyle} />
                <Fact label="Growth" value={preview.compatibilityMap.growthTrajectory} />
              </Section>

              <Section title="The hard truth">
                <ThemedText themeColor="textSecondary">{preview.hardTruth}</ThemedText>
              </Section>

              <View style={[styles.noteBox, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  GROWTH SCORE · {preview.growthScore}
                </ThemedText>
                <ThemedText>{preview.transformationNote}</ThemedText>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {title.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  content: {
    padding: Spacing.four,
    flexGrow: 1,
  },
  statusBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.six,
  },
  lockedBox: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
  },
  centerText: { textAlign: 'center', lineHeight: 22 },
  body: { gap: Spacing.five },
  section: { gap: Spacing.two },
  fact: { gap: Spacing.half },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  noteBox: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
