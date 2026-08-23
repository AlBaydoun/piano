/**
 * Ways of getting notes into the app that aren't the on-screen keyboard:
 * a real MIDI instrument, and the computer keyboard.
 */

import { nameToMidi } from './theory.js';

/** Web MIDI device input. Degrades quietly when the browser has no support. */
export class MidiInput {
  constructor() {
    this.access = null;
    this.enabled = false;
    /** @type {Set<Function>} */
    this.listeners = new Set();
    /** @type {Array<{id: string, name: string}>} */
    this.devices = [];
    this.onDevicesChanged = null;
    this.error = null;
  }

  static get supported() {
    return typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function';
  }

  /**
   * Ask the browser for MIDI access. Resolves to true when at least the
   * permission was granted (devices may still be plugged in later).
   */
  async connect() {
    if (!MidiInput.supported) {
      this.error = 'This browser does not support Web MIDI. Chrome, Edge and Opera do.';
      return false;
    }
    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.enabled = true;
      this.error = null;
      this.access.onstatechange = () => this._bind();
      this._bind();
      return true;
    } catch (err) {
      this.error = `Could not access MIDI devices: ${err.message}`;
      return false;
    }
  }

  _bind() {
    if (!this.access) return;
    this.devices = [];
    for (const input of this.access.inputs.values()) {
      this.devices.push({ id: input.id, name: input.name || 'MIDI device' });
      input.onmidimessage = (event) => this._handle(event);
    }
    if (this.onDevicesChanged) this.onDevicesChanged(this.devices);
  }

  _handle(event) {
    const [status, data1, data2] = event.data;
    const command = status & 0xf0;
    if (command === 0x90 && data2 > 0) {
      this._emit({ type: 'noteon', midi: data1, velocity: data2 / 127 });
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
      this._emit({ type: 'noteoff', midi: data1 });
    } else if (command === 0xb0 && data1 === 64) {
      this._emit({ type: 'sustain', down: data2 >= 64 });
    } else if (command === 0xb0 && (data1 === 120 || data1 === 123)) {
      this._emit({ type: 'allnotesoff' });
    }
  }

  _emit(message) {
    for (const listener of this.listeners) listener(message);
  }

  /** @param {(message: {type: string, midi?: number, velocity?: number, down?: boolean}) => void} listener */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/**
 * Computer-keyboard layout. Two rows of a QWERTY keyboard behave like two
 * octaves of piano, with the home row as the white keys — the layout most
 * tracker and DAW users already know.
 */
export const KEY_MAP = {
  // Lower octave: Z row = white keys, S row = black keys
  KeyZ: 'C3', KeyS: 'C#3', KeyX: 'D3', KeyD: 'D#3', KeyC: 'E3', KeyV: 'F3',
  KeyG: 'F#3', KeyB: 'G3', KeyH: 'G#3', KeyN: 'A3', KeyJ: 'A#3', KeyM: 'B3',
  Comma: 'C4', KeyL: 'C#4', Period: 'D4', Semicolon: 'D#4', Slash: 'E4',
  // Upper octave: Q row = white keys, number row = black keys
  KeyQ: 'C4', Digit2: 'C#4', KeyW: 'D4', Digit3: 'D#4', KeyE: 'E4', KeyR: 'F4',
  Digit5: 'F#4', KeyT: 'G4', Digit6: 'G#4', KeyY: 'A4', Digit7: 'A#4', KeyU: 'B4',
  KeyI: 'C5', Digit9: 'C#5', KeyO: 'D5', Digit0: 'D#5', KeyP: 'E5',
  BracketLeft: 'F5', Equal: 'F#5', BracketRight: 'G5',
};

/** `code` -> MIDI note, resolved once at module load. */
export const KEY_TO_MIDI = Object.fromEntries(
  Object.entries(KEY_MAP).map(([code, note]) => [code, nameToMidi(note)]),
);

/**
 * Wire the computer keyboard up to note callbacks.
 *
 * Transposition is applied on press and remembered per physical key, so
 * shifting octaves while a key is held still releases the right note.
 */
export class ComputerKeyboard {
  constructor({ onNoteOn, onNoteOff, onSustain, onTranspose } = {}) {
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
    this.onSustain = onSustain;
    this.onTranspose = onTranspose;
    this.transpose = 0;
    this.enabled = true;
    /** @type {Map<string, number>} physical key -> sounding note */
    this.held = new Map();
    this._down = (event) => this._handleDown(event);
    this._up = (event) => this._handleUp(event);
    this._blur = () => this.releaseAll();
  }

  attach(target = window) {
    this.target = target;
    target.addEventListener('keydown', this._down);
    target.addEventListener('keyup', this._up);
    window.addEventListener('blur', this._blur);
    return this;
  }

  detach() {
    if (!this.target) return;
    this.target.removeEventListener('keydown', this._down);
    this.target.removeEventListener('keyup', this._up);
    window.removeEventListener('blur', this._blur);
    this.releaseAll();
  }

  releaseAll() {
    for (const midi of this.held.values()) this.onNoteOff?.(midi);
    this.held.clear();
    this.onSustain?.(false);
  }

  _isTyping(event) {
    const el = event.target;
    return el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
  }

  _handleDown(event) {
    if (!this.enabled || event.metaKey || event.ctrlKey || event.altKey || this._isTyping(event)) return;

    if (event.code === 'Space') {
      event.preventDefault();
      if (!event.repeat) this.onSustain?.(true);
      return;
    }
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      if (event.repeat) return;
      const direction = event.code === 'ArrowRight' ? 1 : -1;
      this.transpose = Math.max(-24, Math.min(24, this.transpose + direction * 12));
      this.onTranspose?.(this.transpose);
      event.preventDefault();
      return;
    }

    const base = KEY_TO_MIDI[event.code];
    if (base === undefined) return;
    event.preventDefault();
    if (event.repeat || this.held.has(event.code)) return;
    const midi = base + this.transpose;
    this.held.set(event.code, midi);
    this.onNoteOn?.(midi);
  }

  _handleUp(event) {
    if (event.code === 'Space') {
      this.onSustain?.(false);
      return;
    }
    const midi = this.held.get(event.code);
    if (midi === undefined) return;
    this.held.delete(event.code);
    this.onNoteOff?.(midi);
  }
}

export const midiInput = new MidiInput();
