/**
 * Maahi voice — browser-native text-to-speech for Maahi's replies.
 *
 * Uses the Web Speech API (window.speechSynthesis). No external service,
 * no API key, no cost. Works in Chrome, Edge, Safari; degrades to silent
 * (isSpeechSupported() === false) elsewhere, so callers can hide the UI.
 *
 * The voice is tuned warm and unhurried to match Maahi's character — a
 * close, caring presence, not a system notification.
 */

export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

// Voices load asynchronously in most browsers — getVoices() is empty until
// the `voiceschanged` event fires. We cache the resolved list.
let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (!isSpeechSupported()) return;
  const v = window.speechSynthesis.getVoices();
  if (v.length > 0) cachedVoices = v;
}

if (isSpeechSupported()) {
  refreshVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
}

// Preference order for Maahi's voice — warm, female-leaning English voices,
// India-accented first since that's the primary market.
const VOICE_PREFERENCES = [
  /en-IN/i,
  /Google UK English Female/i,
  /Samantha/i,
  /Google US English/i,
  /en-GB/i,
  /en-US/i,
  /^en/i,
];

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoices.length === 0) refreshVoices();
  for (const pref of VOICE_PREFERENCES) {
    const match = cachedVoices.find(
      (v) => pref.test(v.lang) || pref.test(v.name),
    );
    if (match) return match;
  }
  return cachedVoices[0] ?? null;
}

/**
 * Strip the conversational text down to something natural to hear. Markdown
 * symbols, the ✦ glyph, and stray markers read badly aloud.
 */
function cleanForSpeech(text: string): string {
  return text
    .replace(/[*_`#>]/g, "")
    .replace(/✦/g, "")
    .replace(/\s*\n\s*/g, ". ")
    .replace(/\.{2,}/g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Speak a line of text. Cancels anything currently speaking first so
 * replies never overlap. No-op when speech isn't supported.
 */
export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!isSpeechSupported()) {
    opts.onEnd?.();
    return;
  }
  const cleaned = cleanForSpeech(text);
  if (!cleaned) {
    opts.onEnd?.();
    return;
  }

  // Cancel any in-flight utterance so Maahi never talks over herself.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleaned);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  // Slightly slow and slightly bright — warm, unhurried, present.
  utterance.rate = 0.96;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  utterance.onstart = () => opts.onStart?.();
  utterance.onend = () => opts.onEnd?.();
  utterance.onerror = () => opts.onEnd?.();

  window.speechSynthesis.speak(utterance);
}

/** Stop any in-flight speech immediately. */
export function cancelSpeech(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

/** True while Maahi is currently speaking. */
export function isSpeaking(): boolean {
  return isSpeechSupported() && window.speechSynthesis.speaking;
}
