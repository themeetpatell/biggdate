import type { Message } from '@biggdate/shared';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';
import { queryClient } from '@/lib/query-client';
import { subscribeToThreadMessages } from '@/lib/realtime';
import { threadQueryKey, useSendMessage, useThread } from '@/lib/use-messages';

const MAX_MESSAGE_LEN = 4000;

function messagePreview(message: Message): string {
  if (message.kind === 'voice') return '[Voice note]';
  if (message.kind === 'date_proposal') return '[Date proposal]';
  return message.body ?? '';
}

export default function ThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const theme = useTheme();
  const { session } = useAuth();
  const threadQuery = useThread(threadId);
  const sendMessage = useSendMessage(threadId);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!threadId) return;
    return subscribeToThreadMessages(threadId, () => {
      void queryClient.invalidateQueries({ queryKey: threadQueryKey(threadId) });
    });
  }, [threadId]);

  const myId = session?.user.id ?? '';
  const messages = threadQuery.data?.messages ?? [];
  // FlatList is inverted, so render newest-first.
  const ordered = [...messages].reverse();
  const title = threadQuery.data?.thread.otherUserName ?? 'Conversation';

  async function handleSend() {
    const text = draft.trim();
    if (!text) return;
    setError(null);
    setDraft('');
    try {
      await sendMessage.mutateAsync(text);
    } catch (e) {
      setDraft(text);
      setError(e instanceof Error ? e.message : 'Message failed to send.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="smallBold">{title}</ThemedText>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {threadQuery.isPending ? (
            <View style={styles.centered}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={ordered}
              inverted
              keyExtractor={(message) => message.id}
              contentContainerStyle={styles.messages}
              renderItem={({ item }) => {
                const mine = item.senderId === myId;
                return (
                  <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
                    <View
                      style={[
                        styles.bubble,
                        { backgroundColor: mine ? theme.text : theme.backgroundElement },
                      ]}>
                      <ThemedText
                        type="small"
                        style={{ color: mine ? theme.background : theme.text }}>
                        {messagePreview(item)}
                      </ThemedText>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Say hello and start the conversation.
                  </ThemedText>
                </View>
              }
            />
          )}

          {error ? (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          ) : null}

          <View style={[styles.inputBar, { borderTopColor: theme.backgroundElement }]}>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, backgroundColor: theme.backgroundElement },
              ]}
              value={draft}
              onChangeText={setDraft}
              placeholder="Message"
              placeholderTextColor={theme.textSecondary}
              maxLength={MAX_MESSAGE_LEN}
              multiline
            />
            <Pressable
              accessibilityRole="button"
              disabled={sendMessage.isPending || !draft.trim()}
              onPress={handleSend}
              style={[
                styles.sendButton,
                {
                  backgroundColor: theme.text,
                  opacity: sendMessage.isPending || !draft.trim() ? 0.4 : 1,
                },
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.background }}>
                Send
              </ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  messages: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    fontSize: 16,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#E5484D',
    paddingHorizontal: Spacing.three,
  },
});
