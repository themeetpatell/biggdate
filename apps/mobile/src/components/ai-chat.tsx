import { useChat } from '@ai-sdk/react';
import { resolveApiBaseUrl } from '@biggdate/shared';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useMemo, useState } from 'react';
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
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';

const baseUrl = resolveApiBaseUrl(env.apiUrl);

interface AiChatProps {
  /** Backend chat endpoint path, e.g. `/api/maahi`. */
  endpoint: string;
  title: string;
  emptyTitle: string;
  emptyText: string;
  placeholder: string;
  onBack?: () => void;
}

/** Concatenate the text parts of a UI message into a single string. */
function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('');
}

/**
 * Streaming AI chat backed by an AI SDK v6 UI-message-stream endpoint.
 * Uses Expo's streaming-capable `fetch` so tokens render as they arrive,
 * and attaches the Supabase access token per request.
 */
export function AiChat({
  endpoint,
  title,
  emptyTitle,
  emptyText,
  placeholder,
  onBack,
}: AiChatProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: `${baseUrl}${endpoint}`,
        fetch: expoFetch as unknown as typeof globalThis.fetch,
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          const headers: Record<string, string> = {};
          if (token) headers.Authorization = `Bearer ${token}`;
          return headers;
        },
      }),
    [endpoint],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';
  // FlatList is inverted, so render newest-first.
  const ordered = [...messages].reverse();

  function handleSend() {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft('');
    void sendMessage({ text });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          {onBack ? (
            <Pressable accessibilityRole="button" onPress={onBack} hitSlop={8}>
              <ThemedText type="linkPrimary">Back</ThemedText>
            </Pressable>
          ) : null}
          <ThemedText type="smallBold">{title}</ThemedText>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={ordered}
            inverted
            keyExtractor={(message) => message.id}
            contentContainerStyle={styles.messages}
            ListEmptyComponent={
              <View style={styles.empty}>
                <ThemedText type="subtitle">{emptyTitle}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                  {emptyText}
                </ThemedText>
              </View>
            }
            ListHeaderComponent={
              status === 'submitted' ? (
                <View style={styles.thinking}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const mine = item.role === 'user';
              const text = messageText(item);
              if (!text) return null;
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
                      {text}
                    </ThemedText>
                  </View>
                </View>
              );
            }}
          />

          {error ? (
            <ThemedText type="small" style={styles.error}>
              Something went wrong. Try sending that again.
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
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              multiline
            />
            <Pressable
              accessibilityRole="button"
              disabled={busy || !draft.trim()}
              onPress={handleSend}
              style={[
                styles.sendButton,
                { backgroundColor: theme.text, opacity: busy || !draft.trim() ? 0.4 : 1 },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  messages: {
    padding: Spacing.three,
    gap: Spacing.two,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  emptyText: { textAlign: 'center', lineHeight: 22 },
  thinking: {
    paddingVertical: Spacing.two,
    alignItems: 'flex-start',
  },
  bubbleRow: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '85%',
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
