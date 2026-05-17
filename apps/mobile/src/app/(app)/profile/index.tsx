import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/use-profile';

const INTENT_LABELS: Record<string, string> = {
  serious: 'Serious relationship',
  casual: 'Something casual',
  marriage: 'Marriage',
  exploring: 'Exploring',
};

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signOut } = useAuth();
  const profileQuery = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  if (profileQuery.isPending) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const profile = profileQuery.data?.profile ?? null;
  const work = profile
    ? [profile.jobTitle, profile.company].filter(Boolean).join(' · ')
    : '';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeAreaView edges={['top']}>
          {profileQuery.isError ? (
            <ThemedText themeColor="textSecondary">
              Could not load your profile. Try again later.
            </ThemedText>
          ) : null}

          {profile ? (
            <View style={styles.body}>
              <View style={styles.identity}>
                {profile.photos.length > 0 ? (
                  <Image
                    source={{ uri: profile.photos[0] }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={[styles.photo, styles.photoEmpty, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="title" themeColor="textSecondary">
                      {profile.name.charAt(0).toUpperCase() || '?'}
                    </ThemedText>
                  </View>
                )}
                <ThemedText type="subtitle">
                  {profile.name}
                  {profile.age ? `, ${profile.age}` : ''}
                </ThemedText>
                <ThemedText themeColor="textSecondary">{profile.city}</ThemedText>
                {profile.isVerified ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    Verified
                  </ThemedText>
                ) : null}
              </View>

              {profile.summary ? (
                <Section title="About">
                  <ThemedText>{profile.summary}</ThemedText>
                </Section>
              ) : null}

              <Section title="Details">
                <Fact
                  label="Looking for"
                  value={profile.intent ? INTENT_LABELS[profile.intent] ?? null : null}
                />
                <Fact label="Work" value={work || null} />
                <Fact label="Education" value={profile.education ?? null} />
                <Fact label="Height" value={profile.height ?? null} />
              </Section>

              {profile.interests && profile.interests.length > 0 ? (
                <Section title="Interests">
                  <View style={styles.pills}>
                    {profile.interests.map((interest) => (
                      <View
                        key={interest}
                        style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
                        <ThemedText type="small">{interest}</ThemedText>
                      </View>
                    ))}
                  </View>
                </Section>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button label="Edit profile" onPress={() => router.push('/profile/edit')} />
            <Button
              label="Relationship Coach"
              variant="secondary"
              onPress={() => router.push('/profile/coach')}
            />
            <Button
              label="Sign out"
              variant="secondary"
              loading={signingOut}
              onPress={handleSignOut}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
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

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.fact}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="small">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: Spacing.four,
    gap: Spacing.five,
  },
  body: { gap: Spacing.five },
  identity: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.two,
  },
  photoEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { gap: Spacing.two },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
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
  actions: { gap: Spacing.two },
});
