// Tiny sound effects, synthesised with WebAudio: no audio files, no network.
// Every sound is a short oscillator blip so the game stays fully self-contained.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, dur, type = 'sine', vol = 0.12, when = 0) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A satisfying two-note chime for a found difference.
  found() {
    this.tone(660, 0.14, 'sine', 0.14);
    this.tone(990, 0.22, 'sine', 0.12, 0.09);
  }

  // A low buzz for a wrong click.
  wrong() {
    this.tone(140, 0.18, 'square', 0.06);
  }

  // A soft blip when a hint is spent.
  hint() {
    this.tone(520, 0.1, 'triangle', 0.1);
    this.tone(780, 0.12, 'triangle', 0.08, 0.07);
  }

  // A rising arpeggio for a finished level.
  win() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, 'sine', 0.12, i * 0.11));
  }

  // A quiet tick for button presses.
  tick() {
    this.tone(880, 0.05, 'sine', 0.05);
  }

  // A ticking warning in the last ten seconds.
  countdownTick() {
    this.tone(1180, 0.05, 'square', 0.035);
  }
}
