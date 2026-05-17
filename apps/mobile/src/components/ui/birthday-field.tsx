import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface BirthdayFieldProps {
  value: Date | null;
  maximumDate: Date;
  onChange: (date: Date) => void;
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Date-of-birth picker. iOS shows an inline spinner; Android opens the
 * platform dialog from a tappable row.
 */
export function BirthdayField({ value, maximumDate, onChange }: BirthdayFieldProps) {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && date) {
      onChange(date);
    }
  }

  return (
    <View style={styles.wrapper}>
      {Platform.OS === 'android' ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={[styles.trigger, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold" themeColor={value ? 'text' : 'textSecondary'}>
            {value ? formatDisplay(value) : 'Select your date of birth'}
          </ThemedText>
        </Pressable>
      ) : null}

      {showPicker ? (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={value ?? maximumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  trigger: {
    height: 52,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
});
