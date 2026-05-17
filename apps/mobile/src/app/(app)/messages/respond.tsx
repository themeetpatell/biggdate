import type { ReceivedIntro } from '@biggdate/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useReceivedIntros, useRespondToKnock } from '@/lib/use-intros';

const MAX_RESPONSE_LEN = 280;

export default function RespondScreen() {
  const { introId } = useLocalSearchParams<{ introId: string }>();
  const router = useRouter();
  const receivedQuery = useReceivedIntros();

  if (receivedQuery.isPending) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const intro =
    (receivedQuery.data?.intros ?? []).find((entry) => entry.id === introId) ?? null;

  if (!intro) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Soul Knock not found.</ThemedText>
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return <RespondForm intro={intro} />;
}

function RespondForm({ intro }: { intro: ReceivedIntro }) {
  const theme = useTheme();
  const router = useRouter();
  const respond = useRespondToKnock();
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const question =
    intro.soulKnockQuestion ?? 'They sent you a Soul Knock — answer to open the conversation.';

  async function handleSubmit() {
    const text = response.trim();
    if (!text) {
      setError('Write a short, honest answer.');
      return;
    }
    setError(null);
    try {
      const result = await respond.mutateAsync({ introId: intro.id, response: text });
      if (result.mutual && result.thread) {
        router.replace({
          pathname: '/messages/[threadId]',
          params: { threadId: result.thread.id },
        });
      } else {
        router.back();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send your answer.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex} edges={['top']}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                SOUL KNOCK FROM
              </ThemedText>
              <ThemedText type="title">{intro.senderName}</ThemedText>
            </View>

            <View style={[styles.questionBox, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                THEIR QUESTION
              </ThemedText>
              <ThemedText>{question}</ThemedText>
            </View>

            <TextField
              label="Your answer"
              value={response}
              onChangeText={setResponse}
              placeholder="A few honest sentences"
              multiline
              textAlignVertical="top"
              maxLength={MAX_RESPONSE_LEN}
              style={styles.answerInput}
            />

            {error ? (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <View style={styles.cancelButton}>
              <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
            </View>
            <View style={styles.submitButton}>
              <Button label="Send answer" loading={respond.isPending} onPress={handleSubmit} />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
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
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: { gap: Spacing.one },
  questionBox: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  answerInput: {
    height: 120,
    paddingTop: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  cancelButton: { flex: 1 },
  submitButton: { flex: 2 },
  error: { color: '#E5484D' },
});
