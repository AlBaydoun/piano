/**
 * The instrument.
 *
 * Everything is synthesised with the Web Audio API — no sample downloads, so
 * the whole app stays a few hundred kilobytes and works offline. Each note is
 * a small additive stack: a handful of detuned harmonics whose upper partials
 * decay faster than the fundamental (which is what makes a struck string
 * sound like a struck string), plus a very short filtered noise burst standing
 * in for the hammer.
 */

import { midiToFrequency } from './theory.js';

/** Relative amplitude and decay multiplier for each partial. */
const PARTIALS = [
  { ratio: 1, gain: 1.0, decay: 1.0 },
  { ratio: 2, gain: 0.42, decay: 0.72 },
  { ratio: 3, gain: 0.2, decay: 0.55 },
  { ratio: 4, gain: 0.11, decay: 0.42 },
  { ratio: 5, gain: 0.06, decay: 0.32 },
  { ratio: 6, gain: 0.035, decay: 0.26 },
];

export class PianoEngine {
  constructor() {
    /** @type {AudioContext|null} */
    this.ctx = null;
    this.master = null;
    this.reverb = null;
    this.reverbSend = null;
    /** @type {Map<number, object>} notes that are currently sounding */
    this.voices = new Map();
    /** @type {Set<number>} notes released while the sustain pedal is down */
    this.pedalHeld = new Set();
    this.sustain = false;
    this.volume = 0.75;
    this.muted = false;
    this._noiseBuffer = null;
    /** Listeners notified whenever a note starts or stops, for UI highlighting. */
    this.listeners = new Set();
  }

  /** Browsers only allow audio after a gesture, so this is called lazily. */
  async resume() {
    if (!this.ctx) this._create();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    return this.ctx;
  }

  get ready() {
    return Boolean(this.ctx) && this.ctx.state === 'running';
  }

  _create() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();

    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume;

    // A gentle low-pass keeps the additive synthesis from sounding brittle.
    const tone = this.ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 7000;
    tone.Q.value = 0.4;

    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this._impulseResponse(1.9, 2.4);
    this.reverbSend = this.ctx.createGain();
    this.reverbSend.gain.value = 0.22;

    tone.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.reverbSend.connect(this.reverb);
    this.reverb.connect(this.master);

    this.bus = tone;
  }

  /** Exponentially decaying noise, which is a serviceable small-room reverb. */
  _impulseResponse(seconds, decay) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = this.ctx.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  _noise() {
    if (!this._noiseBuffer) {
      const length = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
      this._noiseBuffer = buffer;
    }
    return this._noiseBuffer;
  }

  setVolume(value) {
    this.volume = Math.min(1, Math.max(0, value));
    if (this.master) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
  }

  setMuted(muted) {
    this.muted = muted;
    this.setVolume(this.volume);
  }

  onNoteChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _emit(midi, active, source) {
    for (const listener of this.listeners) listener(midi, active, source);
  }

  /**
   * Start a note.
   * @param {number} midi
   * @param {{velocity?: number, source?: string, when?: number}} [opts]
   */
  noteOn(midi, opts = {}) {
    const { velocity = 0.8, source = 'ui', when } = opts;
    if (!this.ctx) this._create();
    const ctx = this.ctx;
    const time = when ?? ctx.currentTime;

    if (this.voices.has(midi)) this._stopVoice(midi, time, 0.03);
    this.pedalHeld.delete(midi);

    const frequency = midiToFrequency(midi);
    // Bass notes ring far longer than treble ones.
    const decay = 1.4 + 9 * Math.pow(2, -(midi - 21) / 24);
    const level = 0.16 * velocity;

    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 1;
    voiceGain.connect(this.bus);
    voiceGain.connect(this.reverbSend);

    const oscillators = [];
    for (const partial of PARTIALS) {
      const partialFrequency = frequency * partial.ratio;
      if (partialFrequency > ctx.sampleRate / 2) continue;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = partialFrequency;
      // Real strings are slightly inharmonic; a touch of detune adds life.
      osc.detune.value = (partial.ratio - 1) * 2.5;

      const gain = ctx.createGain();
      const peak = level * partial.gain;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), time + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.00008, time + decay * partial.decay);

      osc.connect(gain);
      gain.connect(voiceGain);
      osc.start(time);
      oscillators.push({ osc, gain });
    }

    // Hammer noise: a click that gives the attack some bite.
    const noise = ctx.createBufferSource();
    noise.buffer = this._noise();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = Math.min(frequency * 3.2, 9000);
    noiseFilter.Q.value = 0.8;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05 * velocity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(voiceGain);
    noise.start(time);
    noise.stop(time + 0.12);

    const voice = { oscillators, voiceGain, startedAt: time, decay };
    this.voices.set(midi, voice);
    this._emit(midi, true, source);

    // Reclaim nodes once the note has decayed on its own.
    voice.timer = setTimeout(() => {
      if (this.voices.get(midi) === voice) this._stopVoice(midi, ctx.currentTime, 0.05);
    }, (decay + 0.4) * 1000);
  }

  /** Release a note, honouring the sustain pedal. */
  noteOff(midi, opts = {}) {
    const { source = 'ui' } = opts;
    if (!this.voices.has(midi)) {
      this.pedalHeld.delete(midi);
      this._emit(midi, false, source);
      return;
    }
    if (this.sustain) {
      this.pedalHeld.add(midi);
      this._emit(midi, false, source);
      return;
    }
    this._stopVoice(midi, this.ctx.currentTime, 0.22);
    this._emit(midi, false, source);
  }

  _stopVoice(midi, time, release) {
    const voice = this.voices.get(midi);
    if (!voice) return;
    this.voices.delete(midi);
    clearTimeout(voice.timer);
    const end = time + release;
    try {
      voice.voiceGain.gain.cancelScheduledValues(time);
      voice.voiceGain.gain.setValueAtTime(Math.max(voice.voiceGain.gain.value, 0.0001), time);
      voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, end);
    } catch {
      /* the node may already be finished */
    }
    for (const { osc } of voice.oscillators) {
      try {
        osc.stop(end + 0.02);
      } catch {
        /* already stopped */
      }
    }
    setTimeout(() => {
      try {
        voice.voiceGain.disconnect();
      } catch {
        /* already disconnected */
      }
    }, (release + 0.2) * 1000);
  }

  /** Sustain pedal (MIDI CC 64, or the space bar). */
  setSustain(down) {
    this.sustain = down;
    if (!down) {
      for (const midi of this.pedalHeld) {
        if (this.voices.has(midi)) this._stopVoice(midi, this.ctx.currentTime, 0.28);
      }
      this.pedalHeld.clear();
    }
  }

  /** Silence everything immediately. */
  allNotesOff() {
    const time = this.ctx ? this.ctx.currentTime : 0;
    for (const midi of [...this.voices.keys()]) {
      this._stopVoice(midi, time, 0.08);
      this._emit(midi, false, 'system');
    }
    this.pedalHeld.clear();
  }

  /** Play a note for a fixed duration — used by demos and playback. */
  playNote(midi, duration = 0.6, opts = {}) {
    this.noteOn(midi, opts);
    setTimeout(() => this.noteOff(midi, opts), duration * 1000);
  }

  /** Play notes one after another. Returns a cancel function. */
  playSequence(notes, { noteDuration = 0.5, gap = 0.08, velocity = 0.8 } = {}) {
    const timers = [];
    notes.forEach((midi, index) => {
      timers.push(setTimeout(() => this.playNote(midi, noteDuration, { velocity }), index * (noteDuration + gap) * 1000));
    });
    return () => timers.forEach(clearTimeout);
  }

  /** Play notes together. */
  playChord(notes, duration = 1.2, { velocity = 0.7 } = {}) {
    notes.forEach((midi, index) => {
      // A tiny spread makes a block chord sound played rather than triggered.
      setTimeout(() => this.playNote(midi, duration, { velocity }), index * 12);
    });
  }
}

/**
 * A click track. Uses look-ahead scheduling (schedule slightly into the
 * future on a coarse timer) so the beat stays rock steady even when the
 * main thread is busy rendering.
 */
export class Metronome {
  constructor(engine) {
    this.engine = engine;
    this.tempo = 90;
    this.beatsPerBar = 4;
    this.running = false;
    this.beat = 0;
    this.accent = true;
    this._nextNoteTime = 0;
    this._timer = null;
    this.onBeat = null;
    this.lookahead = 0.1;
    this.interval = 25;
  }

  async start() {
    if (this.running) return;
    await this.engine.resume();
    this.running = true;
    this.beat = 0;
    this._nextNoteTime = this.engine.ctx.currentTime + 0.06;
    this._timer = setInterval(() => this._schedule(), this.interval);
  }

  stop() {
    this.running = false;
    clearInterval(this._timer);
    this._timer = null;
  }

  toggle() {
    return this.running ? (this.stop(), false) : (this.start(), true);
  }

  setTempo(bpm) {
    this.tempo = Math.min(300, Math.max(20, Math.round(bpm)));
  }

  _schedule() {
    const ctx = this.engine.ctx;
    while (this._nextNoteTime < ctx.currentTime + this.lookahead) {
      this._click(this._nextNoteTime, this.beat === 0 && this.accent);
      if (this.onBeat) {
        const beat = this.beat;
        const delay = Math.max(0, (this._nextNoteTime - ctx.currentTime) * 1000);
        setTimeout(() => this.onBeat(beat), delay);
      }
      this._nextNoteTime += 60 / this.tempo;
      this.beat = (this.beat + 1) % this.beatsPerBar;
    }
  }

  _click(time, accented) {
    const ctx = this.engine.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accented ? 1600 : 1050;
    gain.gain.setValueAtTime(accented ? 0.28 : 0.16, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(gain);
    gain.connect(this.engine.master ?? ctx.destination);
    osc.start(time);
    osc.stop(time + 0.06);
  }
}

/**
 * A click track for a fixed-length exercise.
 *
 * The shared Metronome runs forever and schedules a little ahead of itself,
 * which is right for practising but wrong here: a rhythm drill needs to know
 * exactly when beat one lands so it can judge a tap against it. An exercise is
 * short, so every click is scheduled up front against the audio clock and the
 * start time is handed back for the scorer to measure from.
 */
export class ClickTrack {
  constructor(engine) {
    this.engine = engine;
    this.running = false;
    /** Audio time of the first click of the exercise proper. */
    this.startTime = 0;
    /** Audio time the last click has sounded and the exercise is over. */
    this.endTime = 0;
    this.countInStart = 0;
    this.secondsPerClick = 0.5;
    this._sources = [];
  }

  /**
   * @param {object} plan
   * @param {number} plan.secondsPerClick
   * @param {number} plan.countInClicks  a whole number of bars, please
   * @param {number} plan.totalClicks    the length of the exercise itself
   * @param {number} [plan.tailClicks]   extra clicks so the last note has a beat to land on
   * @param {number} [plan.clicksPerBar]
   * @param {number[]} [plan.accents]    click positions within the bar to accent
   */
  async start({ secondsPerClick, countInClicks, totalClicks, tailClicks = 1, clicksPerBar = 4, accents = [0] }) {
    await this.engine.resume();
    this.stop();
    const ctx = this.engine.ctx;
    // A beat of headroom so the first click is scheduled, not squeezed out.
    const begin = ctx.currentTime + 0.2;

    this.secondsPerClick = secondsPerClick;
    this.countInStart = begin;
    this.startTime = begin + countInClicks * secondsPerClick;
    this.endTime = this.startTime + (totalClicks + tailClicks) * secondsPerClick;

    const clicks = countInClicks + totalClicks + tailClicks;
    for (let i = 0; i < clicks; i += 1) {
      const position = i - countInClicks;
      const inBar = ((position % clicksPerBar) + clicksPerBar) % clicksPerBar;
      this._click(begin + i * secondsPerClick, {
        accented: accents.includes(inBar),
        countIn: position < 0,
      });
    }
    this.running = true;
    return this;
  }

  /** A short click for the player's own tap, so they hear themselves in time. */
  tap(when = null) {
    const ctx = this.engine.ctx;
    if (ctx) this._woodblock(when ?? ctx.currentTime);
  }

  /** Play the written rhythm itself, so the player can hear what to aim at. */
  playRhythm(onsets, { secondsPerClick, at = null } = {}) {
    const ctx = this.engine.ctx;
    if (!ctx) return;
    const begin = at ?? ctx.currentTime + 0.1;
    for (const onset of onsets) this._woodblock(begin + onset * secondsPerClick);
  }

  stop() {
    for (const source of this._sources) {
      try { source.stop(); } catch { /* already finished */ }
    }
    this._sources = [];
    this.running = false;
  }

  _click(time, { accented, countIn }) {
    const ctx = this.engine.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // The count-in is deliberately duller than the exercise, so the change of
    // colour tells the player that beat one has arrived.
    osc.frequency.value = countIn ? 720 : accented ? 1600 : 1050;
    gain.gain.setValueAtTime(countIn ? 0.2 : accented ? 0.28 : 0.16, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(gain);
    gain.connect(this.engine.master ?? ctx.destination);
    osc.start(time);
    osc.stop(time + 0.06);
    this._sources.push(osc);
  }

  _woodblock(time) {
    const ctx = this.engine.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, time);
    osc.frequency.exponentialRampToValueAtTime(520, time + 0.04);
    gain.gain.setValueAtTime(0.24, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    osc.connect(gain);
    gain.connect(this.engine.master ?? ctx.destination);
    osc.start(time);
    osc.stop(time + 0.1);
    this._sources.push(osc);
  }
}

export const engine = new PianoEngine();
export const metronome = new Metronome(engine);
export const clickTrack = new ClickTrack(engine);
