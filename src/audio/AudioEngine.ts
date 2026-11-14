import { StageKey } from '../types/game';

export interface Note {
  f: number;
  d: number;
}

export interface StageScore {
  padFreqs: number[];
  phrase: Note[];
  voice: 'oud' | 'harp' | 'flute' | 'cello';
  drumPattern: number[] | null;
  drumMs?: number;
  noiseFreq: number;
  noiseQ: number;
  noiseVol: number;
  lfoHz: number;
}

export const STAGE_SCORES: Record<string, StageScore> = {
  jaffa: {
    padFreqs: [82.41, 123.47], // E2 + B2 warm coastal drone
    phrase: [
      { f: 329.63, d: 0.55 }, { f: 349.23, d: 0.35 }, { f: 415.30, d: 0.75 }, { f: 0, d: 0.4 },
      { f: 440.00, d: 0.45 }, { f: 415.30, d: 0.40 }, { f: 349.23, d: 0.50 }, { f: 329.63, d: 0.95 }
    ],
    voice: 'oud',
    drumPattern: [1, 0, 2, 0, 1, 2, 0, 0],
    drumMs: 360,
    noiseFreq: 310, noiseQ: 0.8, noiseVol: 0.055, lfoHz: 0.16
  },
  kinneret: {
    padFreqs: [110.0, 164.81], // A2 + E3 serene lake pad
    phrase: [
      { f: 440.0, d: 0.45 }, { f: 523.25, d: 0.45 }, { f: 659.25, d: 0.80 }, { f: 587.33, d: 0.50 },
      { f: 523.25, d: 0.45 }, { f: 0, d: 0.35 }, { f: 493.88, d: 0.55 }, { f: 440.0, d: 1.0 }
    ],
    voice: 'harp',
    drumPattern: null,
    noiseFreq: 480, noiseQ: 1.3, noiseVol: 0.032, lfoHz: 0.24
  },
  masada: {
    padFreqs: [73.42, 110.0], // D2 + A2 deep desert canyon drone
    phrase: [
      { f: 293.66, d: 0.85 }, { f: 311.13, d: 0.50 }, { f: 369.99, d: 0.95 }, { f: 0, d: 0.55 },
      { f: 440.00, d: 0.65 }, { f: 392.00, d: 0.45 }, { f: 311.13, d: 0.60 }, { f: 293.66, d: 1.1 }
    ],
    voice: 'flute',
    drumPattern: [1, 0, 0, 2, 1, 0, 2, 0],
    drumMs: 420,
    noiseFreq: 640, noiseQ: 3.0, noiseVol: 0.052, lfoHz: 0.13
  },
  kotel: {
    padFreqs: [73.42, 146.83, 220.0], // D2 + D3 + A3 reverent stone chord
    phrase: [
      { f: 293.66, d: 0.70 }, { f: 349.23, d: 0.60 }, { f: 440.00, d: 0.90 }, { f: 0, d: 0.45 },
      { f: 392.00, d: 0.55 }, { f: 349.23, d: 0.55 }, { f: 329.63, d: 0.55 }, { f: 293.66, d: 1.15 }
    ],
    voice: 'cello',
    drumPattern: null,
    noiseFreq: 250, noiseQ: 1.0, noiseVol: 0.022, lfoHz: 0.09
  },
  dawn: {
    padFreqs: [130.81, 196.0, 246.94], // Cmaj7 warm sunrise strings
    phrase: [
      { f: 523.25, d: 0.35 }, { f: 659.25, d: 0.35 }, { f: 783.99, d: 0.45 }, { f: 987.77, d: 0.70 },
      { f: 1046.5, d: 0.85 }, { f: 783.99, d: 0.40 }, { f: 659.25, d: 0.50 }, { f: 523.25, d: 0.90 }
    ],
    voice: 'harp',
    drumPattern: null,
    noiseFreq: 420, noiseQ: 0.7, noiseVol: 0.014, lfoHz: 0.12
  }
};

export class AudioEngine {
  public audioCtx: AudioContext | null = null;
  public soundEnabled = true;

  private masterGain: GainNode | null = null;
  private stageGain: GainNode | null = null;
  private echoIn: GainNode | null = null;

  private padOscs: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private lfoNode: OscillatorNode | null = null;

  private phraseTimer: any = null;
  private foleyTimer: any = null;
  private drumTimer: any = null;

  private currentStage = 'jaffa';
  private phraseStep = 0;
  private drumStep = 0;
  private sequenceId = 0;
  private activeNotes: OscillatorNode[] = [];

  public ensureAudio(): void {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.initAudioBus();
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(enabled ? 1.0 : 0.0, this.audioCtx.currentTime);
    }
    if (enabled) {
      this.startStageSoundscape(this.currentStage);
    } else {
      this.stopStageSoundscape();
    }
  }

  private initAudioBus(): void {
    if (!this.audioCtx || this.masterGain) return;

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this.soundEnabled ? 1.0 : 0.0;
    this.masterGain.connect(this.audioCtx.destination);

    this.stageGain = this.audioCtx.createGain();
    this.stageGain.gain.value = 1.0;
    this.stageGain.connect(this.masterGain);

    // Delay / echo network
    const delay = this.audioCtx.createDelay(1.0);
    delay.delayTime.value = 0.34;
    const fb = this.audioCtx.createGain();
    fb.gain.value = 0.36;
    const echoFilter = this.audioCtx.createBiquadFilter();
    echoFilter.type = 'lowpass';
    echoFilter.frequency.value = 1150;
    const echoWet = this.audioCtx.createGain();
    echoWet.gain.value = 0.38;

    this.echoIn = this.audioCtx.createGain();
    this.echoIn.gain.value = 1.0;
    this.echoIn.connect(this.stageGain);
    this.echoIn.connect(delay);
    delay.connect(echoFilter);
    echoFilter.connect(fb);
    fb.connect(delay);
    echoFilter.connect(echoWet);
    echoWet.connect(this.stageGain);
  }

  public startStageSoundscape(stageKey: string): void {
    this.currentStage = stageKey;
    if (!this.soundEnabled || !this.audioCtx || this.audioCtx.state !== 'running') return;
    this.initAudioBus();

    this.stopStageSoundscape();

    if (this.stageGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.stageGain.gain.cancelScheduledValues(now);
      this.stageGain.gain.setValueAtTime(0.001, now);
      this.stageGain.gain.linearRampToValueAtTime(1.0, now + 0.22);
    }

    const score = STAGE_SCORES[stageKey] || STAGE_SCORES.jaffa;
    const currentSeq = this.sequenceId;

    // Drones / Pads
    score.padFreqs.forEach((freq) => {
      if (!this.audioCtx || !this.stageGain) return;
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      g.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      osc.connect(g);
      g.connect(this.stageGain);
      osc.start();
      this.padOscs.push(osc);
    });

    // Melodic sequencer
    this.phraseStep = 0;
    const playNextNote = () => {
      if (!this.soundEnabled || !this.audioCtx || this.sequenceId !== currentSeq) return;
      const note = score.phrase[this.phraseStep];
      this.phraseStep = (this.phraseStep + 1) % score.phrase.length;

      if (note.f > 0) {
        this.playMelodicNote(note.f, note.d, score.voice);
      }
      this.phraseTimer = setTimeout(playNextNote, (note.d + 0.15) * 1000);
    };
    this.phraseTimer = setTimeout(playNextNote, 600);

    // Percussion
    if (score.drumPattern && score.drumMs) {
      this.drumStep = 0;
      this.drumTimer = setInterval(() => {
        if (!this.soundEnabled || !score.drumPattern || this.sequenceId !== currentSeq) return;
        const hit = score.drumPattern[this.drumStep % score.drumPattern.length];
        this.drumStep++;
        if (hit > 0) {
          this.playDrumHit(hit);
        }
      }, score.drumMs);
    }
  }

  public stopStageSoundscape(): void {
    this.sequenceId++;
    if (this.phraseTimer) {
      clearTimeout(this.phraseTimer);
      this.phraseTimer = null;
    }
    if (this.drumTimer) {
      clearInterval(this.drumTimer);
      this.drumTimer = null;
    }
    this.padOscs.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch (e) {}
    });
    this.padOscs = [];

    this.activeNotes.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch (e) {}
    });
    this.activeNotes = [];
  }

  private playMelodicNote(freq: number, duration: number, voice: string): void {
    if (!this.audioCtx || !this.echoIn) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();

      osc.type = voice === 'oud' ? 'triangle' : voice === 'flute' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.045, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(g);
      g.connect(this.echoIn);

      this.activeNotes.push(osc);
      osc.onended = () => {
        const idx = this.activeNotes.indexOf(osc);
        if (idx !== -1) this.activeNotes.splice(idx, 1);
      };

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {}
  }

  private playDrumHit(type: number): void {
    if (!this.audioCtx || !this.stageGain) return;
    try {
      const now = this.audioCtx.currentTime;
      if (type === 1) {
        // Dum
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, now);
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.16);
        g.gain.setValueAtTime(0.09, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(g);
        g.connect(this.stageGain);
        osc.start(now);
        osc.stop(now + 0.24);
      } else {
        // Tek
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(g);
        g.connect(this.stageGain);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  // --- Procedural Sound Effects ---
  public playBoing(pitch = 280): void {
    if (!this.soundEnabled || !this.audioCtx || !this.masterGain) return;
    try {
      const now = this.audioCtx.currentTime;
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(pitch, now);
      o.frequency.exponentialRampToValueAtTime(pitch * 2.2, now + 0.18);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      o.connect(g);
      g.connect(this.masterGain);
      o.start(now);
      o.stop(now + 0.26);
    } catch (e) {}
  }

  public playBell(freq = 660): void {
    if (!this.soundEnabled || !this.audioCtx || !this.masterGain) return;
    try {
      const now = this.audioCtx.currentTime;
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      o.connect(g);
      g.connect(this.masterGain);
      o.start(now);
      o.stop(now + 0.75);
    } catch (e) {}
  }

  public playWhoosh(): void {
    if (!this.soundEnabled || !this.audioCtx || !this.masterGain) return;
    try {
      const now = this.audioCtx.currentTime;
      const bufLen = Math.floor(this.audioCtx.sampleRate * 0.18);
      const buf = this.audioCtx.createBuffer(1, bufLen, this.audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
      const src = this.audioCtx.createBufferSource();
      src.buffer = buf;
      const bp = this.audioCtx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(320, now);
      bp.frequency.exponentialRampToValueAtTime(1100, now + 0.18);
      const g = this.audioCtx.createGain();
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.masterGain);
      src.start(now);
    } catch (e) {}
  }

  public playSpooky(): void {
    if (!this.soundEnabled || !this.audioCtx || !this.masterGain) return;
    try {
      const now = this.audioCtx.currentTime;
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(130, now);
      o.frequency.exponentialRampToValueAtTime(65, now + 1.2);
      g.gain.setValueAtTime(0.07, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      o.connect(g);
      g.connect(this.masterGain);
      o.start(now);
      o.stop(now + 1.35);
    } catch (e) {}
  }

  public playRescueFanfare(isFinale: boolean): void {
    if (!this.soundEnabled || !this.audioCtx) return;
    const notes = isFinale ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBell(freq);
      }, idx * 140);
    });
  }

  public playMeow(): void {
    if (!this.soundEnabled || !this.audioCtx || !this.masterGain) return;
    try {
      const now = this.audioCtx.currentTime;
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(520, now);
      o.frequency.linearRampToValueAtTime(760, now + 0.12);
      o.frequency.exponentialRampToValueAtTime(420, now + 0.34);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      o.connect(g);
      g.connect(this.masterGain);
      o.start(now);
      o.stop(now + 0.38);
    } catch (e) {}
  }

  public playQuack(): void {
    if (!this.soundEnabled || !this.audioCtx || !this.masterGain) return;
    try {
      for (let q = 0; q < 2; q++) {
        const now = this.audioCtx.currentTime + q * 0.14;
        const o = this.audioCtx.createOscillator();
        const bp = this.audioCtx.createBiquadFilter();
        const g = this.audioCtx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(340, now);
        o.frequency.exponentialRampToValueAtTime(240, now + 0.09);
        bp.type = 'bandpass';
        bp.frequency.value = 950;
        bp.Q.value = 2.5;
        g.gain.setValueAtTime(0.09, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        o.connect(bp);
        bp.connect(g);
        g.connect(this.masterGain);
        o.start(now);
        o.stop(now + 0.11);
      }
    } catch (e) {}
  }
}
