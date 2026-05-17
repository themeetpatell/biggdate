import type { ReceivedIntro, Thread } from '@biggdate/shared';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useReceivedIntros } from '@/lib/use-intros';
import { useThreads } from '@/lib/use-messages';

export default function MessagesScreen() {
  const threadsQuery = useThreads();
  const threads = threadsQuery.data?.threads ?? [];

  if (threadsQuery.isPending) {
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
          data={threads}
          keyExtractor={(thread) => thread.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<MessagesHeader />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText type="smallBold">No conversations yet</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                A chat opens once you and a match both answer a Soul Knock.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => <ThreadRow thread={item} />}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

function MessagesHeader() {
  const theme = useTheme();
  const router = useRouter();
  const receivedQuery = useReceivedIntros();
  const data = receivedQuery.data;
  const pending = (data?.intros ?? []).filter((intro) => !intro.receiverAnswered);

  return (
    <View style={styles.header}>
      <ThemedText type="subtitle">Messages</ThemedText>

      {data?.locked ? (
        <View style={[styles.lockedCard, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Someone may have knocked</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Upgrade to BiggDate Premium to see who has sent you a Soul Knock.
          </ThemedText>
        </View>
      ) : pending.length > 0 ? (
        <View style={styles.knocks}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            SOUL KNOCKS
          </ThemedText>
          {pending.map((intro) => (
            <KnockRow key={intro.id} intro={intro} onPress={() =>
              router.push({ pathname: '/messages/respond', params: { introId: intro.id } })
            } />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function KnockRow({ intro, onPress }: { intro: ReceivedIntro; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.knockRow,
        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.85 : 1 },
      ]}>
      <ThemedText type="smallBold">{intro.senderName}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Knocked on you — tap to answer
      </ThemedText>
    </Pressable>
  );
}

function ThreadRow({ thread }: { thread: Thread }) {
  const theme = useTheme();
  const router = useRouter();
  const name = thread.otherUserName ?? 'BiggDate match';
  const unread = thread.unreadCount ?? 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: '/messages/[threadId]', params: { threadId: thread.id } })
      }
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}>
      {thread.otherUserPhoto ? (
        <Image source={{ uri: thread.otherUserPhoto }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.avatarEmpty, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}
      <View style={styles.rowBody}>
        <ThemedText type="smallBold">{name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {thread.lastMessage ?? 'Say hello'}
        </ThemedText>
      </View>
      {unread > 0 ? (
        <View style={[styles.unread, { backgroundColor: theme.text }]}>
          <ThemedText type="small" style={{ color: theme.background }}>
            {unread}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
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
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.one,
  },
  lockedCard: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  knocks: { gap: Spacing.two },
  knockRow: {
    gap: Spacing.half,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  empty: {
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  emptyText: { lineHeight: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: Spacing.half,
  },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
