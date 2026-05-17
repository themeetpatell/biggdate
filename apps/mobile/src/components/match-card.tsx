import type { Match } from '@biggdate/shared';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface MatchCardProps {
  match: Match;
  knockSent: boolean;
  onPress: () => void;
}

export function MatchCard({ match, knockSent, onPress }: MatchCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.9 : 1 },
      ]}>
      <View style={styles.header}>
        <ThemedText style={styles.emoji}>{match.emoji}</ThemedText>
        <View style={styles.identity}>
          <ThemedText type="smallBold">
            {match.name}, {match.age}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {match.profession} · {match.city}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="small" numberOfLines={3}>
        {match.narrativeIntro}
      </ThemedText>

      <View style={styles.footer}>
        <View style={[styles.badge, { backgroundColor: theme.background }]}>
          <ThemedText type="small" themeColor="textSecondary">
            {match.intentAlignment} intent fit
          </ThemedText>
        </View>
        {knockSent ? (
          <ThemedText type="small" themeColor="textSecondary">
            Soul Knock sent
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  emoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  identity: {
    flex: 1,
    gap: Spacing.half,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
  },
});
