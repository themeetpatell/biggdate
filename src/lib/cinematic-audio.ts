"use client";

// Tiny Web Audio synth used by the simulation page to play cinematic
// stings on chapter beats. Browsers block AudioContext until a user
// gesture, so we lazy-init on first call and silently no-op before that.

type Cue =
  | "chapter"   // soft cinematic bell — chapter entry
  | "swell"     // rising pad — used for slower reveals
  | "spark"     // bright glint — tag pops, particle bursts
  | "heartbeat" // low thump — match-card lock state
  | "knock"     // dual-tone whoosh — soul knock send
  | "sent"      // major chord chime — knock landed
  | "epilogue"; // sustained warm chord — final scene

type Listener = (muted: boolean) => void;

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
// Default off. Cinematic audio is opt-in via a visible toggle — autoplaying
// sound is hostile in public spaces and most mobile browsers gate it anyway.
let muted = true;
const listeners = new Set<Listener>();

function ensure(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctor =
      window.AudioContext ||
      (window as WindowWithWebkitAudio).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.35;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: masterGain! };
}

function envelope(
  c: AudioContext,
  dest: AudioNode,
  freqs: number[],
  type: OscillatorType,
  attack: number,
  hold: number,
  release: number,
  peak = 0.18,
) {
  const now = c.currentTime;
  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(peak, now + attack);
  g.gain.setValueAtTime(peak, now + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + hold + release);
  g.connect(dest);

  const oscs = freqs.map((f) => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, now);
    o.connect(g);
    o.start(now);
    o.stop(now + attack + hold + release + 0.05);
    return o;
  });

  return { stopAt: now + attack + hold + release, oscs };
}

function noiseBurst(c: AudioContext, dest: AudioNode, dur: number, peak = 0.06) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  const g = c.createGain();
  g.gain.setValueAtTime(peak, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  src.connect(filter); filter.connect(g); g.connect(dest);
  src.start();
  src.stop(c.currentTime + dur + 0.05);
}

export const audio = {
  get muted() {
    return muted;
  },
  setMuted(next: boolean) {
    muted = next;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.35;
    listeners.forEach((l) => l(muted));
  },
  toggle() {
    this.setMuted(!muted);
    // Touch ensure() so the toggle itself counts as the user gesture.
    ensure();
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  play(cue: Cue) {
    const ready = ensure();
    if (!ready || muted) return;
    const { ctx: c, master } = ready;

    switch (cue) {
      case "chapter": {
        // Bell — perfect fifth, slow attack, long tail
        envelope(c, master, [196, 294], "sine", 0.04, 0.12, 1.6, 0.18);
        envelope(c, master, [98], "triangle", 0.06, 0.18, 1.2, 0.08);
        break;
      }
      case "swell": {
        envelope(c, master, [110, 165, 220], "sine", 0.6, 0.4, 1.8, 0.10);
        break;
      }
      case "spark": {
        envelope(c, master, [880, 1320], "triangle", 0.005, 0.04, 0.35, 0.10);
        noiseBurst(c, master, 0.18, 0.04);
        break;
      }
      case "heartbeat": {
        // Two thumps
        envelope(c, master, [55], "sine", 0.005, 0.06, 0.35, 0.30);
        setTimeout(() => envelope(c, master, [55], "sine", 0.005, 0.06, 0.4, 0.28), 320);
        break;
      }
      case "knock": {
        envelope(c, master, [330], "sine", 0.005, 0.04, 0.18, 0.18);
        setTimeout(() => envelope(c, master, [262], "sine", 0.005, 0.04, 0.22, 0.14), 110);
        noiseBurst(c, master, 0.5, 0.05);
        break;
      }
      case "sent": {
        // Major chord chime — C E G
        envelope(c, master, [523.25, 659.25, 783.99], "sine", 0.02, 0.18, 1.6, 0.16);
        envelope(c, master, [261.63], "triangle", 0.04, 0.2, 1.4, 0.10);
        break;
      }
      case "epilogue": {
        // Warm sustained pad
        envelope(c, master, [146.83, 220, 293.66, 369.99], "sine", 1.2, 1.0, 3.2, 0.12);
        break;
      }
    }
  },
};
