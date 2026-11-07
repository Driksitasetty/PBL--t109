// Web Audio API Synthesizer for Vedic Temple Bell and Emergency Alert Sound
// 100% self-contained, no external audio files required!

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a resonant, divine Indian Temple Bell (Mandir Ghanti / Shankh Dhwani)
 * Uses harmonic overtones (432Hz fundamental, 1.2x, 2.76x, 5.4x) with exponential damping
 */
export function playTempleBell() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.35, now);

  // Fundamental frequency and partials characteristic of brass temple bells
  const partials = [
    { freq: 432, gain: 0.5, decay: 3.5 },
    { freq: 432 * 1.5, gain: 0.3, decay: 2.8 },
    { freq: 432 * 2.76, gain: 0.25, decay: 2.2 },
    { freq: 432 * 4.12, gain: 0.15, decay: 1.6 },
    { freq: 432 * 5.43, gain: 0.1, decay: 1.2 }
  ];

  partials.forEach(({ freq, gain, decay }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay);
  });
}

/**
 * Synthesizes a pulsed emergency alert siren for SOS or Group Member Separation
 */
export function playEmergencyAlert() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.linearRampToValueAtTime(440, now + 0.25);
  osc.frequency.linearRampToValueAtTime(880, now + 0.5);

  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.6);
}
