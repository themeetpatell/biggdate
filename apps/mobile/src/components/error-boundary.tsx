import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Button } from './ui/button';
import { Spacing } from '@/constants/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-tree errors in any child subtree (streaming AI chat,
 * realtime subscriptions) and shows a recoverable fallback instead of a
 * white screen. Component-class form is required: hooks cannot implement
 * `componentDidCatch`.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Hook a real logger here (Sentry, etc.) when one is wired up.
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error('ErrorBoundary caught error', error, info);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <ThemedView style={styles.container}>
          <View style={styles.body}>
            <ThemedText type="title">
              {this.props.fallbackTitle ?? 'Something went wrong'}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.message}>
              {this.props.fallbackMessage ??
                'The app hit an unexpected error. Try again, and if this keeps happening, reopen the app.'}
            </ThemedText>
            <Button label="Try again" onPress={this.reset} />
          </View>
        </ThemedView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  body: {
    gap: Spacing.three,
    maxWidth: 360,
    width: '100%',
  },
  message: { lineHeight: 22 },
});
