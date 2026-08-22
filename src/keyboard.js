/**
 * The on-screen piano.
 *
 * White keys are laid out in a flex row; black keys are absolutely positioned
 * on top at the traditional (slightly asymmetric) offsets. Pointer events are
 * tracked per pointer id so glissandi and multi-touch chords both work.
 */

import { isBlackKey, pitchClass } from './theory.js';
import { i18n } from './i18n.js';

/**
 * How far a black key is nudged from the midpoint between its neighbours,
 * as a fraction of a white key's width. Real pianos are not symmetric here.
 */
const BLACK_KEY_OFFSET = { 1: -0.09, 3: 0.09, 6: -0.12, 8: 0, 10: 0.12 };

export const RANGES = {
  small: { low: 48, high: 72, label: '2 octaves (C3–C5)' },
  medium: { low: 36, high: 84, label: '4 octaves (C2–C6)' },
  large: { low: 36, high: 96, label: '5 octaves (C2–C7)' },
  full: { low: 21, high: 108, label: '88 keys (A0–C8)' },
};

/**
 * How many octaves to show when the user has not picked. Keys narrower than
 * about 14px are unusable with a finger, so a phone gets two octaves.
 */
export function autoRange(width = window.innerWidth) {
  if (width < 620) return 'small';
  if (width < 1000) return 'medium';
  return 'large';
}

export class PianoKeyboard {
  /**
   * @param {HTMLElement} container
   * @param {object} [options]
   */
  constructor(container, options = {}) {
    this.container = container;
    this.low = options.low ?? 48;
    this.high = options.high ?? 84;
    this.onNoteOn = options.onNoteOn ?? (() => {});
    this.onNoteOff = options.onNoteOff ?? (() => {});
    this.labels = options.labels ?? 'c-only';
    this.interactive = options.interactive !== false;
    /** @type {Map<number, HTMLElement>} */
    this.keys = new Map();
    /** @type {Map<number, number>} pointerId -> midi */
    this.pointers = new Map();
    this._boundUp = (event) => this._release(event.pointerId);
    this._boundMove = (event) => this._move(event);
    this.render();
    if (this.interactive) {
      window.addEventListener('pointerup', this._boundUp);
      window.addEventListener('pointercancel', this._boundUp);
      window.addEventListener('pointermove', this._boundMove);
    }
  }

  dispose() {
    window.removeEventListener('pointerup', this._boundUp);
    window.removeEventListener('pointercancel', this._boundUp);
    window.removeEventListener('pointermove', this._boundMove);
    this.container.innerHTML = '';
  }

  setRange(low, high) {
    this.low = low;
    this.high = high;
    this.render();
  }

  setLabels(mode) {
    this.labels = mode;
    this._updateLabels();
  }

  /** Key names follow whichever naming system the reader has chosen. */
  _labelFor(midi) {
    if (this.labels === 'never') return '';
    if (this.labels === 'c-only') {
      return pitchClass(midi) === 0 ? i18n.noteName(midi, { octave: true, short: true }) : '';
    }
    return i18n.noteName(midi, { short: true });
  }

  render() {
    const { container } = this;
    container.innerHTML = '';
    container.classList.add('piano');
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', i18n.t('dock.keyboardLabel', {
      low: i18n.noteName(this.low, { octave: true }),
      high: i18n.noteName(this.high, { octave: true }),
    }));
    this.keys.clear();

    const whiteNotes = [];
    const blackNotes = [];
    for (let midi = this.low; midi <= this.high; midi += 1) {
      (isBlackKey(midi) ? blackNotes : whiteNotes).push(midi);
    }
    if (!whiteNotes.length) return;

    // Both layers live in a frame so the black keys' percentage offsets are
    // measured against exactly the box the white keys fill — otherwise any
    // padding on the container shifts one layer relative to the other.
    const frame = document.createElement('div');
    frame.className = 'piano__frame';
    const whiteLayer = document.createElement('div');
    whiteLayer.className = 'piano__whites';
    const blackLayer = document.createElement('div');
    blackLayer.className = 'piano__blacks';

    const whiteWidth = 100 / whiteNotes.length;
    const indexOfWhite = new Map(whiteNotes.map((midi, index) => [midi, index]));

    for (const midi of whiteNotes) {
      whiteLayer.append(this._createKey(midi, 'white'));
    }

    for (const midi of blackNotes) {
      const key = this._createKey(midi, 'black');
      // Sit over the boundary between the white key below and the one above.
      const leftWhite = indexOfWhite.get(midi - 1);
      if (leftWhite === undefined) continue;
      const offset = BLACK_KEY_OFFSET[pitchClass(midi)] ?? 0;
      const width = whiteWidth * 0.62;
      key.style.left = `${(leftWhite + 1) * whiteWidth - width / 2 + offset * whiteWidth}%`;
      key.style.width = `${width}%`;
      blackLayer.append(key);
    }

    frame.append(whiteLayer, blackLayer);
    container.append(frame);
    this._frame = frame;
    this._updateLabels();
  }

  _createKey(midi, colour) {
    const key = document.createElement('div');
    key.className = `piano__key piano__key--${colour}`;
    key.dataset.midi = String(midi);
    key.setAttribute('role', 'button');
    key.setAttribute('aria-label', i18n.noteName(midi, { octave: true }));

    const label = document.createElement('span');
    label.className = 'piano__label';
    key.append(label);

    if (this.interactive) {
      key.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        this._press(event.pointerId, midi);
      });
    }
    this.keys.set(midi, key);
    return key;
  }

  _updateLabels() {
    for (const [midi, key] of this.keys) {
      const label = key.querySelector('.piano__label');
      if (!label) continue;
      const text = this._labelFor(midi);
      label.textContent = isBlackKey(midi) && this.labels !== 'all' && this.labels !== 'all-octaves' ? '' : text;
      key.classList.toggle('piano__key--labelled', Boolean(label.textContent));
    }
  }

  _press(pointerId, midi) {
    const previous = this.pointers.get(pointerId);
    if (previous === midi) return;
    if (previous !== undefined) this.onNoteOff(previous);
    this.pointers.set(pointerId, midi);
    this.onNoteOn(midi);
  }

  _release(pointerId) {
    const midi = this.pointers.get(pointerId);
    if (midi === undefined) return;
    this.pointers.delete(pointerId);
    this.onNoteOff(midi);
  }

  /** Glissando: dragging across the keyboard re-triggers each key passed. */
  _move(event) {
    if (!this.pointers.has(event.pointerId)) return;
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const key = element?.closest?.('.piano__key');
    if (!key || !this.container.contains(key)) return;
    this._press(event.pointerId, Number(key.dataset.midi));
  }

  // -- visual state --------------------------------------------------------

  /** Show a key as sounding. */
  setActive(midi, active) {
    this.keys.get(midi)?.classList.toggle('is-active', active);
  }

  /**
   * Mark keys for teaching purposes.
   * @param {number|number[]} notes
   * @param {'target'|'correct'|'wrong'|'hint'|'root'|'ghost'} kind
   */
  mark(notes, kind = 'target') {
    for (const midi of [].concat(notes)) {
      this.keys.get(midi)?.classList.add(`is-${kind}`);
    }
  }

  unmark(notes, kind = 'target') {
    for (const midi of [].concat(notes)) {
      this.keys.get(midi)?.classList.remove(`is-${kind}`);
    }
  }

  /** Remove one kind of marking, or every marking when called with no argument. */
  clearMarks(kind) {
    const kinds = kind ? [kind] : ['target', 'correct', 'wrong', 'hint', 'root', 'ghost'];
    for (const key of this.keys.values()) {
      for (const k of kinds) key.classList.remove(`is-${k}`);
      if (!kind) key.style.removeProperty('--finger');
    }
  }

  /** Print a fingering number (1–5) on a key. */
  setFinger(midi, finger) {
    const key = this.keys.get(midi);
    if (!key) return;
    key.dataset.finger = finger ? String(finger) : '';
    key.classList.toggle('has-finger', Boolean(finger));
  }

  clearFingers() {
    for (const key of this.keys.values()) {
      key.dataset.finger = '';
      key.classList.remove('has-finger');
    }
  }

  /** Widen the range just enough to contain every note passed in. */
  ensureVisible(notes) {
    if (!notes.length) return;
    const low = Math.min(...notes);
    const high = Math.max(...notes);
    if (low >= this.low && high <= this.high) return;
    // Snap outward to the nearest C below and B above so the layout stays tidy.
    const newLow = Math.min(this.low, Math.floor(low / 12) * 12);
    const newHigh = Math.max(this.high, Math.ceil((high + 1) / 12) * 12 - 1);
    this.setRange(newLow, newHigh);
  }

  /** Pixel geometry of each key, relative to the keyboard container. */
  geometry() {
    const bounds = this.container.getBoundingClientRect();
    const out = new Map();
    for (const [midi, key] of this.keys) {
      const rect = key.getBoundingClientRect();
      out.set(midi, { x: rect.left - bounds.left, width: rect.width, black: isBlackKey(midi) });
    }
    return { width: bounds.width, keys: out };
  }
}
