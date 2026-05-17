import type { Profile } from '@biggdate/shared';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoEditor } from '@/components/photo-editor';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useProfile, useUpdateProfile } from '@/lib/use-profile';

export default function ProfileEditScreen() {
  const profileQuery = useProfile();

  if (profileQuery.isPending) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const profile = profileQuery.data?.profile ?? null;
  if (!profile) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Profile unavailable.</ThemedText>
      </ThemedView>
    );
  }

  return <ProfileEditForm profile={profile} />;
}

function ProfileEditForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const [photos, setPhotos] = useState<string[]>(profile.photos ?? []);
  const [name, setName] = useState(profile.name ?? '');
  const [city, setCity] = useState(profile.city ?? '');
  const [jobTitle, setJobTitle] = useState(profile.jobTitle ?? '');
  const [company, setCompany] = useState(profile.company ?? '');
  const [education, setEducation] = useState(profile.education ?? '');
  const [height, setHeight] = useState(profile.height ?? '');
  const [summary, setSummary] = useState(profile.summary ?? '');
  const [interests, setInterests] = useState((profile.interests ?? []).join(', '));
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        city: city.trim(),
        jobTitle: jobTitle.trim() || null,
        company: company.trim() || null,
        education: education.trim() || null,
        height: height.trim() || null,
        summary: summary.trim(),
        photos,
        interests: interests
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your profile.');
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
            <ThemedText type="title">Edit profile</ThemedText>

            <View style={styles.form}>
              <PhotoEditor photos={photos} onChange={setPhotos} />

              <TextField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
              <TextField label="City" value={city} onChangeText={setCity} placeholder="e.g. Dubai" />
              <TextField
                label="Job title"
                value={jobTitle}
                onChangeText={setJobTitle}
                placeholder="e.g. Product Designer"
              />
              <TextField
                label="Company"
                value={company}
                onChangeText={setCompany}
                placeholder="Where you work"
              />
              <TextField
                label="Education"
                value={education}
                onChangeText={setEducation}
                placeholder="e.g. NYU"
              />
              <TextField
                label="Height"
                value={height}
                onChangeText={setHeight}
                placeholder={'e.g. 5’6”'}
              />
              <TextField
                label="About you"
                value={summary}
                onChangeText={setSummary}
                placeholder="A few honest sentences about you"
                multiline
                textAlignVertical="top"
                style={styles.multiline}
              />
              <TextField
                label="Interests"
                value={interests}
                onChangeText={setInterests}
                placeholder="Comma-separated, e.g. hiking, film, cooking"
              />

              {error ? (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.actions}>
              <View style={styles.cancelButton}>
                <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
              </View>
              <View style={styles.saveButton}>
                <Button label="Save" loading={updateProfile.isPending} onPress={handleSave} />
              </View>
            </View>
          </ScrollView>
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
  form: { gap: Spacing.three },
  multiline: {
    height: 120,
    paddingTop: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cancelButton: { flex: 1 },
  saveButton: { flex: 2 },
  error: { color: '#E5484D' },
});
