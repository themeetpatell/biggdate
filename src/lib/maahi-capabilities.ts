export const MAAHI_CAPABILITIES = [
  {
    id: "listen",
    label: "Deep listening",
    shortLabel: "Listen",
    description: "Stay with the feeling before solving.",
    starter: "I need to talk this through",
    systemDirective:
      "Prioritize emotional presence over solving. Reflect the hidden feeling, steady their nervous system, then ask one clean question only if it opens them up.",
  },
  {
    id: "patterns",
    label: "Pattern spotting",
    shortLabel: "Patterns",
    description: "Find the loop under the moment.",
    starter: "Help me see the pattern here",
    systemDirective:
      "Look for recurring behavior, unmet needs, triggers, or healthier shifts. Name one likely pattern in plain language, tie it to their current moment, and avoid clinical labels unless they ask.",
  },
  {
    id: "reply",
    label: "Reply craft",
    shortLabel: "Reply",
    description: "Write the message without losing self-respect.",
    starter: "Help me write the text",
    systemDirective:
      "Help them choose what they actually want to communicate, then craft one text that is clear, warm, and boundaried. If context is missing, ask for it before drafting.",
  },
  {
    id: "date_plan",
    label: "Date planning",
    shortLabel: "Plan",
    description: "Turn interest into a grounded next step.",
    starter: "Help me plan the date",
    systemDirective:
      "Move from vague interest to one concrete next step. Keep plans specific, low-pressure, and aligned with their values, safety, pace, and energy.",
  },
  {
    id: "debrief",
    label: "Date debrief",
    shortLabel: "Debrief",
    description: "Process what happened and what it means.",
    starter: "Debrief my last date with me",
    systemDirective:
      "Help them separate chemistry, anxiety, projection, and real signal. Reflect what they noticed, then guide one decision or next observation.",
  },
] as const;

export type MaahiCapability = (typeof MAAHI_CAPABILITIES)[number]["id"];
export type MaahiCapabilityDetails = (typeof MAAHI_CAPABILITIES)[number];

export const DEFAULT_MAAHI_CAPABILITY: MaahiCapability = "listen";

const DEFAULT_MAAHI_CAPABILITY_DETAILS = MAAHI_CAPABILITIES[0];
const MAAHI_CAPABILITY_IDS: ReadonlySet<string> = new Set(
  MAAHI_CAPABILITIES.map((capability) => capability.id),
);

export function isMaahiCapability(value: unknown): value is MaahiCapability {
  return typeof value === "string" && MAAHI_CAPABILITY_IDS.has(value);
}

export function resolveMaahiCapability(value: unknown): MaahiCapability {
  return isMaahiCapability(value) ? value : DEFAULT_MAAHI_CAPABILITY;
}

export function getMaahiCapabilityDetails(
  capability: MaahiCapability,
): MaahiCapabilityDetails {
  return (
    MAAHI_CAPABILITIES.find((candidate) => candidate.id === capability) ??
    DEFAULT_MAAHI_CAPABILITY_DETAILS
  );
}

export function maahiCapabilityPrompt(capability: MaahiCapability): string {
  const details = getMaahiCapabilityDetails(capability);

  return [
    `CURRENT CAPABILITY MODE: ${details.label}.`,
    details.systemDirective,
    "Treat the mode as the shape of this turn, not a topic to announce.",
  ].join("\n");
}
