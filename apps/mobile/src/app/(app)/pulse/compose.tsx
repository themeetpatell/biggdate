import type { PulsePostType, PulsePrompt } from '@biggdate/shared';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCreatePulsePost, useTodayPrompt } from '@/lib/use-pulse';

const MIN_LEN = 5;
const MAX_LEN = 500;

export default function PulseComposeScreen() {
  const promptQuery = useTodayPrompt();

  if (promptQuery.isPending) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return <ComposeForm prompt={promptQuery.data?.prompt ?? null} />;
}

function ComposeForm({ prompt }: { prompt: PulsePrompt | null }) {
  const theme = useTheme();
  const router = useRouter();
  const createPost = useCreatePulsePost();
  const [type, setType] = useState<PulsePostType>(prompt ? 'prompt_response' : 'confession');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const typeOptions: { value: PulsePostType; label: string }[] = [
    ...(prompt ? [{ value: 'prompt_response' as const, label: 'Answer the prompt' }] : []),
    { value: 'confession', label: 'Confession' },
    { value: 'question', label: 'Question' },
  ];

  async function handlePost() {
    setError(null);
    const text = content.trim();
    if (text.length < MIN_LEN) {
      setError(`Write at least ${MIN_LEN} characters.`);
      return;
    }
    try {
      await createPost.mutateAsync({
        type,
        promptId: type === 'prompt_response' ? prompt?.id : undefined,
        content: text,
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not share your post.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex} edges={['top']}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <ThemedText type="title">Share to Pulse</ThemedText>

            <View style={styles.chips}>
              {typeOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={type === option.value}
                  onPress={() => {
                    setError(null);
                    setType(option.value);
                  }}
                />
              ))}
            </View>

            {type === 'prompt_response' && prompt ? (
              <View style={[styles.promptCard, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  PROMPT
                </ThemedText>
                <ThemedText>{prompt.content}</ThemedText>
              </View>
            ) : null}

            <TextField
              label="Your post"
              value={content}
              onChangeText={setContent}
              placeholder="Say something honest"
              multiline
              textAlignVertical="top"
              maxLength={MAX_LEN}
              style={styles.input}
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
            <View style={styles.postButton}>
              <Button label="Post" loading={createPost.isPending} onPress={handlePost} />
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  promptCard: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  input: {
    height: 160,
    paddingTop: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  cancelButton: { flex: 1 },
  postButton: { flex: 2 },
  error: { color: '#E5484D' },
});
