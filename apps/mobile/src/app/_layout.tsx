import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/error-boundary';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { queryClient } from '@/lib/query-client';
import { useProfileStatus } from '@/lib/use-profile-status';

// Keep the native splash up until auth + profile status resolve so users
// never see a flash of unstyled content behind the splash.
void SplashScreen.preventAutoHideAsync();

/**
 * Redirects between the auth, onboarding, and app route groups based on
 * session state and whether the signed-in user has a profile yet.
 */
function useProtectedRoute() {
  const { session, loading } = useAuth();
  const profileStatus = useProfileStatus();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!session) {
      if (!inAuthGroup) router.replace('/sign-in');
      return;
    }

    // Signed in — wait for the profile check before routing.
    if (profileStatus.isPending) return;

    const hasProfile = profileStatus.data?.hasProfile ?? false;
    if (!hasProfile) {
      if (!inOnboarding) router.replace('/onboarding');
    } else if (inAuthGroup || inOnboarding) {
      router.replace('/');
    }
  }, [session, loading, profileStatus.isPending, profileStatus.data, segments, router]);
}

function RootNavigator() {
  const { session, loading } = useAuth();
  const profileStatus = useProfileStatus();
  const scheme = useColorScheme();
  useProtectedRoute();

  const resolvingProfile = Boolean(session) && profileStatus.isPending;
  const ready = !loading && !resolvingProfile;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors[scheme === 'dark' ? 'dark' : 'light'].background,
        }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
              <StatusBar style="auto" />
              <RootNavigator />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
