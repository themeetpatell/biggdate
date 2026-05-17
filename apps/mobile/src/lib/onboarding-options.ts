/**
 * Choice options for the basics onboarding step. Values are the canonical
 * lowercase strings the backend `/api/onboarding/basics` route accepts.
 */

export interface ChoiceOption {
  value: string;
  label: string;
}

export const GENDER_OPTIONS: ChoiceOption[] = [
  { value: 'man', label: 'Man' },
  { value: 'woman', label: 'Woman' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'genderqueer', label: 'Genderqueer' },
  { value: 'genderfluid', label: 'Genderfluid' },
  { value: 'trans man', label: 'Trans man' },
  { value: 'trans woman', label: 'Trans woman' },
  { value: 'agender', label: 'Agender' },
];

export const PARTNER_GENDER_OPTIONS: ChoiceOption[] = [
  { value: 'everyone', label: 'Everyone' },
  ...GENDER_OPTIONS,
];

export const INTENT_OPTIONS: ChoiceOption[] = [
  { value: 'serious', label: 'A serious relationship' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'casual', label: 'Something casual' },
  { value: 'exploring', label: 'Still exploring' },
];
