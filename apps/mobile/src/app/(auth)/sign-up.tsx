import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';

const MIN_PASSWORD_LENGTH = 10;
const MIN_USERNAME_LENGTH = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const theme = useTheme();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (!fullName.trim()) return 'Enter your full name.';
    if (username.trim().length < MIN_USERNAME_LENGTH) {
      return `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
    }
    if (!/^[a-z0-9._]+$/.test(username.trim().toLowerCase())) {
      return 'Username can use only letters, numbers, periods, and underscores.';
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return 'Enter your email.';
    if (!EMAIL_PATTERN.test(trimmedEmail)) return 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return null;
  }

  async function handleSubmit() {
    setError(null);
    setNotice(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    try {
      const result = await signUp({ fullName, username, email, password, phone });
      if (result.status === 'pending_confirmation') {
        setNotice(result.message);
      }
      // On 'authenticated' the auth guard redirects into the app.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <ThemedView style={styles.header}>
              <ThemedText type="title">Create account</ThemedText>
              <ThemedText themeColor="textSecondary">
                Join BiggDate and start meeting intentionally.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.form}>
              <TextField
                label="Full name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                autoComplete="name"
              />
              <TextField
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                autoCapitalize="none"
                autoComplete="username-new"
              />
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                inputMode="email"
                autoComplete="email"
              />
              <TextField
                label="Phone (optional)"
                value={phone}
                onChangeText={setPhone}
                placeholder="+971 50 000 0000"
                keyboardType="phone-pad"
                autoComplete="tel"
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                secureTextEntry
                autoComplete="new-password"
              />

              {error ? (
                <ThemedText type="small" style={{ color: theme.error }}>
                  {error}
                </ThemedText>
              ) : null}
              {notice ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {notice}
                </ThemedText>
              ) : null}

              <Button label="Create account" loading={submitting} onPress={handleSubmit} />
            </ThemedView>

            <ThemedView style={styles.footer}>
              <ThemedText type="small" themeColor="textSecondary">
                Already have an account?{' '}
              </ThemedText>
              <Link href="/sign-in">
                <ThemedText type="linkPrimary">Sign in</ThemedText>
              </Link>
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.five,
  },
  header: { gap: Spacing.two },
  form: { gap: Spacing.three },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
