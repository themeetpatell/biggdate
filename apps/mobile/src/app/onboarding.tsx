import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BirthdayField } from '@/components/ui/birthday-field';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MIN_AGE, ageInYears } from '@/lib/age';
import { api } from '@/lib/api';
import {
  GENDER_OPTIONS,
  INTENT_OPTIONS,
  PARTNER_GENDER_OPTIONS,
  type ChoiceOption,
} from '@/lib/onboarding-options';
import { queryClient } from '@/lib/query-client';
import { PROFILE_STATUS_QUERY_KEY } from '@/lib/use-profile-status';

const STEP_META = [
  { title: "When's your birthday?", subtitle: 'You must be 18 or older to use BiggDate.' },
  { title: 'How do you identify?', subtitle: 'This shapes who you see and who sees you.' },
  { title: 'Who would you like to meet?', subtitle: 'Pick the option that fits best.' },
  { title: 'Where are you based?', subtitle: 'We use this to find people near you.' },
  { title: 'What are you here for?', subtitle: 'Be honest — it leads to better matches.' },
];
const TOTAL_STEPS = STEP_META.length;

function maxBirthday(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - MIN_AGE);
  return date;
}

function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState('');
  const [partnerGender, setPartnerGender] = useState('');
  const [city, setCity] = useState('');
  const [intent, setIntent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function currentStepError(): string | null {
    switch (step) {
      case 0:
        if (!birthday) return 'Pick your date of birth.';
        if (ageInYears(birthday) < MIN_AGE) {
          return `You must be at least ${MIN_AGE} to use BiggDate.`;
        }
        return null;
      case 1:
        return gender ? null : 'Choose how you identify.';
      case 2:
        return partnerGender ? null : "Choose who you'd like to meet.";
      case 3:
        return city.trim() ? null : 'Add your city.';
      case 4:
        return intent ? null : "Choose what you're here for.";
      default:
        return null;
    }
  }

  async function handleContinue() {
    const validationError = currentStepError();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/onboarding/basics', {
        birthday: birthday ? toIsoDate(birthday) : '',
        gender,
        partnerGender,
        city: city.trim(),
        intent,
      });
      await queryClient.invalidateQueries({ queryKey: PROFILE_STATUS_QUERY_KEY });
      // The auth guard redirects into the app once the profile exists.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your details.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    setError(null);
    if (step > 0) {
      setStep(step - 1);
    }
  }

  function renderChips(
    options: ChoiceOption[],
    selected: string,
    onSelect: (value: string) => void,
  ) {
    return (
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onPress={() => {
              setError(null);
              onSelect(option.value);
            }}
          />
        ))}
      </View>
    );
  }

  const meta = STEP_META[step];
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <View style={styles.progress}>
            {STEP_META.map((stepMeta, index) => (
              <View
                key={stepMeta.title}
                style={[
                  styles.progressBar,
                  { backgroundColor: index <= step ? theme.text : theme.backgroundElement },
                ]}
              />
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <ThemedView style={styles.header}>
              <ThemedText type="title">{meta.title}</ThemedText>
              <ThemedText themeColor="textSecondary">{meta.subtitle}</ThemedText>
            </ThemedView>

            {step === 0 ? (
              <BirthdayField
                value={birthday}
                maximumDate={maxBirthday()}
                onChange={(date) => {
                  setError(null);
                  setBirthday(date);
                }}
              />
            ) : null}
            {step === 1 ? renderChips(GENDER_OPTIONS, gender, setGender) : null}
            {step === 2
              ? renderChips(PARTNER_GENDER_OPTIONS, partnerGender, setPartnerGender)
              : null}
            {step === 3 ? (
              <TextField
                label="City"
                value={city}
                onChangeText={(text) => {
                  setError(null);
                  setCity(text);
                }}
                placeholder="e.g. Dubai"
              />
            ) : null}
            {step === 4 ? renderChips(INTENT_OPTIONS, intent, setIntent) : null}

            {error ? (
              <ThemedText type="small" style={{ color: theme.error }}>
                {error}
              </ThemedText>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            {step > 0 ? (
              <View style={styles.backButton}>
                <Button label="Back" variant="secondary" onPress={handleBack} />
              </View>
            ) : null}
            <View style={styles.continueButton}>
              <Button
                label={isLastStep ? 'Finish' : 'Continue'}
                loading={submitting}
                onPress={handleContinue}
              />
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
  progress: {
    flexDirection: 'row',
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: { gap: Spacing.two },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  backButton: { flex: 1 },
  continueButton: { flex: 2 },
});
