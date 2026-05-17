import type { Match } from '@biggdate/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSendSoulKnock, useSentIntros, usePassMatch } from '@/lib/use-intros';
import { useMatches } from '@/lib/use-matches';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const matchesQuery = useMatches();

  if (matchesQuery.isPending) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const match = (matchesQuery.data ?? []).find((entry) => entry.id === id) ?? null;
  if (!match) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Match not found.</ThemedText>
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return <MatchDetail match={match} />;
}

function MatchDetail({ match }: { match: Match }) {
  const theme = useTheme();
  const router = useRouter();
  const sentIntros = useSentIntros();
  const sendSoulKnock = useSendSoulKnock();
  const passMatch = usePassMatch();
  const [error, setError] = useState<string | null>(null);

  const knockSent = (sentIntros.data ?? []).some((intro) => intro.matchId === match.id);

  async function handleSoulKnock() {
    setError(null);
    try {
      await sendSoulKnock.mutateAsync({
        matchId: match.id,
        matchName: match.name,
        matchedUserId: match.matchedUserId,
        soulKnockQuestion: match.openingQuestion,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send your Soul Knock.');
    }
  }

  async function handlePass() {
    setError(null);
    try {
      await passMatch.mutateAsync({ matchId: match.id, matchName: match.name });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not pass on this match.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.body}>
          <View style={styles.identity}>
            <ThemedText style={styles.emoji}>{match.emoji}</ThemedText>
            <ThemedText type="subtitle">
              {match.name}, {match.age}
            </ThemedText>
            <ThemedText themeColor="textSecondary">
              {match.profession} · {match.city}
            </ThemedText>
            <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textSecondary">
                {match.intentAlignment} intent fit
              </ThemedText>
            </View>
          </View>

          <Section title="Why you">
            <ThemedText>{match.narrativeIntro}</ThemedText>
            <ThemedText themeColor="textSecondary">{match.connectionHook}</ThemedText>
          </Section>

          <Section title="Compatibility">
            <Signal label="Values" text={match.compatibilitySignals.values} />
            <Signal label="Communication" text={match.compatibilitySignals.communication} />
            <Signal label="Life direction" text={match.compatibilitySignals.lifeDirection} />
          </Section>

          <Section title="Worth being intentional about">
            <ThemedText themeColor="textSecondary">{match.frictionPoint}</ThemedText>
          </Section>

          <View style={[styles.questionBox, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              OPENING QUESTION
            </ThemedText>
            <ThemedText>{match.openingQuestion}</ThemedText>
          </View>

          <Button
            label="Preview a life together"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/matches/life-preview',
                params: { matchId: match.id },
              })
            }
          />

          {error ? (
            <ThemedText type="small" style={{ color: theme.error }}>
              {error}
            </ThemedText>
          ) : null}

          {knockSent ? (
            <ThemedText themeColor="textSecondary" style={styles.sentNote}>
              Soul Knock sent — you&apos;ll hear back when they answer.
            </ThemedText>
          ) : (
            <View style={styles.actions}>
              <Button
                label="Send a Soul Knock"
                loading={sendSoulKnock.isPending}
                onPress={handleSoulKnock}
              />
              <Button
                label="Pass"
                variant="secondary"
                loading={passMatch.isPending}
                onPress={handlePass}
              />
            </View>
          )}
          </View>
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

function Signal({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.signal}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  content: { padding: Spacing.four },
  body: { gap: Spacing.five },
  identity: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  emoji: {
    fontSize: 56,
    lineHeight: 64,
  },
  badge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
    marginTop: Spacing.one,
  },
  section: { gap: Spacing.two },
  signal: { gap: Spacing.half },
  questionBox: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  actions: { gap: Spacing.two },
  sentNote: { textAlign: 'center' },
});
