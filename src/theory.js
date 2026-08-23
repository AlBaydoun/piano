/**
 * Music theory primitives.
 *
 * Pitch is represented throughout the app as a MIDI note number
 * (A0 = 21, middle C = C4 = 60, C8 = 108). Everything else — names,
 * frequencies, scales, chords, staff positions — is derived from that.
 */

export const A4_MIDI = 69;
export const MIDDLE_C = 60;
export const LOWEST_KEY = 21; // A0
export const HIGHEST_KEY = 108; // C8

export const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** Semitone offset of each natural letter from C. */
const LETTER_SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACCIDENTAL_OFFSETS = { '#': 1, '♯': 1, b: -1, '♭': -1, x: 2, '##': 2, bb: -2, '♭♭': -2, '': 0, '♮': 0 };

const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** True when the pitch sits on a black key. */
export function isBlackKey(midi) {
  return BLACK_PITCH_CLASSES.has(((midi % 12) + 12) % 12);
}

/** Pitch class 0..11 (C..B), safe for negative input. */
export function pitchClass(midi) {
  return ((Math.round(midi) % 12) + 12) % 12;
}

/** Octave number in scientific pitch notation (middle C = C4). */
export function octaveOf(midi) {
  return Math.floor(Math.round(midi) / 12) - 1;
}

/**
 * Human readable name, e.g. `midiToName(61) === 'C#4'`.
 * @param {number} midi
 * @param {{flats?: boolean, octave?: boolean}} [opts]
 */
export function midiToName(midi, opts = {}) {
  const { flats = false, octave = true } = opts;
  const table = flats ? FLAT_NAMES : SHARP_NAMES;
  const name = table[pitchClass(midi)];
  return octave ? `${name}${octaveOf(midi)}` : name;
}

/**
 * Parse a note name into a MIDI number. Accepts `C4`, `Bb3`, `F#5`, `Eb`,
 * and unicode accidentals. Names without an octave default to octave 4.
 * @returns {number}
 */
export function nameToMidi(name) {
  // The sharp and flat signs are written as escapes rather than literals:
  // a regex literal is one of the few places a bundler will not escape
  // them for you, and this file has to survive being inlined into a page
  // whose encoding it does not control.
  const match = /^([A-Ga-g])([#b\u266F\u266Dx]{0,2})(-?\d+)?$/.exec(String(name).trim());
  if (!match) throw new Error(`Unrecognised note name: ${name}`);
  const [, letter, accidental, octave] = match;
  const base = LETTER_SEMITONES[letter.toUpperCase()];
  const offset = ACCIDENTAL_OFFSETS[accidental] ?? 0;
  const oct = octave === undefined ? 4 : Number(octave);
  return (oct + 1) * 12 + base + offset;
}

/** Equal-tempered frequency in Hz. `tuning` is the A4 reference (default 440). */
export function midiToFrequency(midi, tuning = 440) {
  return tuning * Math.pow(2, (midi - A4_MIDI) / 12);
}

/** Nearest MIDI note for a frequency — used by the (optional) pitch detector. */
export function frequencyToMidi(freq, tuning = 440) {
  return 69 + 12 * Math.log2(freq / tuning);
}

// ---------------------------------------------------------------------------
// Intervals
// ---------------------------------------------------------------------------

export const INTERVALS = [
  { semitones: 0, short: 'P1', name: 'Unison' },
  { semitones: 1, short: 'm2', name: 'Minor 2nd' },
  { semitones: 2, short: 'M2', name: 'Major 2nd' },
  { semitones: 3, short: 'm3', name: 'Minor 3rd' },
  { semitones: 4, short: 'M3', name: 'Major 3rd' },
  { semitones: 5, short: 'P4', name: 'Perfect 4th' },
  { semitones: 6, short: 'TT', name: 'Tritone' },
  { semitones: 7, short: 'P5', name: 'Perfect 5th' },
  { semitones: 8, short: 'm6', name: 'Minor 6th' },
  { semitones: 9, short: 'M6', name: 'Major 6th' },
  { semitones: 10, short: 'm7', name: 'Minor 7th' },
  { semitones: 11, short: 'M7', name: 'Major 7th' },
  { semitones: 12, short: 'P8', name: 'Octave' },
];

/** Interval descriptor between two pitches (order independent, capped at an octave). */
export function intervalBetween(a, b) {
  const distance = Math.abs(Math.round(b) - Math.round(a));
  return INTERVALS[distance] ?? INTERVALS[distance % 12];
}

// ---------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------

/** Interval patterns measured in semitones from the root. */
export const SCALES = {
  major: { name: 'Major (Ionian)', steps: [0, 2, 4, 5, 7, 9, 11], degrees: ['1', '2', '3', '4', '5', '6', '7'] },
  naturalMinor: { name: 'Natural minor (Aeolian)', steps: [0, 2, 3, 5, 7, 8, 10], degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  harmonicMinor: { name: 'Harmonic minor', steps: [0, 2, 3, 5, 7, 8, 11], degrees: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
  melodicMinor: { name: 'Melodic minor', steps: [0, 2, 3, 5, 7, 9, 11], degrees: ['1', '2', 'b3', '4', '5', '6', '7'] },
  majorPentatonic: { name: 'Major pentatonic', steps: [0, 2, 4, 7, 9], degrees: ['1', '2', '3', '5', '6'] },
  minorPentatonic: { name: 'Minor pentatonic', steps: [0, 3, 5, 7, 10], degrees: ['1', 'b3', '4', '5', 'b7'] },
  blues: { name: 'Blues', steps: [0, 3, 5, 6, 7, 10], degrees: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  dorian: { name: 'Dorian', steps: [0, 2, 3, 5, 7, 9, 10], degrees: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
  phrygian: { name: 'Phrygian', steps: [0, 1, 3, 5, 7, 8, 10], degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
  lydian: { name: 'Lydian', steps: [0, 2, 4, 6, 7, 9, 11], degrees: ['1', '2', '3', '#4', '5', '6', '7'] },
  mixolydian: { name: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10], degrees: ['1', '2', '3', '4', '5', '6', 'b7'] },
  locrian: { name: 'Locrian', steps: [0, 1, 3, 5, 6, 8, 10], degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
  chromatic: {
    name: 'Chromatic',
    steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    degrees: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
  },
  wholeTone: { name: 'Whole tone', steps: [0, 2, 4, 6, 8, 10], degrees: ['1', '2', '3', '#4', '#5', '#6'] },
};

/**
 * Ascending scale starting on `root`.
 * @param {number} root MIDI note of the tonic
 * @param {keyof typeof SCALES} type
 * @param {{octaves?: number, includeOctave?: boolean}} [opts]
 * @returns {number[]}
 */
export function buildScale(root, type = 'major', opts = {}) {
  const { octaves = 1, includeOctave = true } = opts;
  const scale = SCALES[type];
  if (!scale) throw new Error(`Unknown scale: ${type}`);
  const notes = [];
  for (let octave = 0; octave < octaves; octave += 1) {
    for (const step of scale.steps) notes.push(root + step + octave * 12);
  }
  if (includeOctave) notes.push(root + octaves * 12);
  return notes;
}

/** Scale notes, then the same notes back down again (without repeating the top). */
export function scaleUpAndDown(root, type = 'major', octaves = 1) {
  const up = buildScale(root, type, { octaves });
  return up.concat(up.slice(0, -1).reverse());
}

/** True when `midi` belongs to the scale, ignoring octave. */
export function isInScale(midi, root, type = 'major') {
  const steps = SCALES[type].steps;
  const offset = pitchClass(midi - root);
  return steps.includes(offset);
}

// ---------------------------------------------------------------------------
// Chords
// ---------------------------------------------------------------------------

export const CHORDS = {
  major: { name: 'Major', symbol: '', steps: [0, 4, 7] },
  minor: { name: 'Minor', symbol: 'm', steps: [0, 3, 7] },
  diminished: { name: 'Diminished', symbol: 'dim', steps: [0, 3, 6] },
  augmented: { name: 'Augmented', symbol: 'aug', steps: [0, 4, 8] },
  sus2: { name: 'Suspended 2nd', symbol: 'sus2', steps: [0, 2, 7] },
  sus4: { name: 'Suspended 4th', symbol: 'sus4', steps: [0, 5, 7] },
  major6: { name: 'Major 6th', symbol: '6', steps: [0, 4, 7, 9] },
  minor6: { name: 'Minor 6th', symbol: 'm6', steps: [0, 3, 7, 9] },
  dominant7: { name: 'Dominant 7th', symbol: '7', steps: [0, 4, 7, 10] },
  major7: { name: 'Major 7th', symbol: 'maj7', steps: [0, 4, 7, 11] },
  minor7: { name: 'Minor 7th', symbol: 'm7', steps: [0, 3, 7, 10] },
  minorMajor7: { name: 'Minor major 7th', symbol: 'mMaj7', steps: [0, 3, 7, 11] },
  halfDiminished7: { name: 'Half-diminished 7th', symbol: 'm7b5', steps: [0, 3, 6, 10] },
  diminished7: { name: 'Diminished 7th', symbol: 'dim7', steps: [0, 3, 6, 9] },
  dominant9: { name: 'Dominant 9th', symbol: '9', steps: [0, 4, 7, 10, 14] },
  major9: { name: 'Major 9th', symbol: 'maj9', steps: [0, 4, 7, 11, 14] },
  minor9: { name: 'Minor 9th', symbol: 'm9', steps: [0, 3, 7, 10, 14] },
  add9: { name: 'Add 9', symbol: 'add9', steps: [0, 4, 7, 14] },
};

/**
 * Chord tones for a root.
 * @param {number} root MIDI note
 * @param {keyof typeof CHORDS} type
 * @param {{inversion?: number}} [opts] inversion 0 = root position
 */
export function buildChord(root, type = 'major', opts = {}) {
  const { inversion = 0 } = opts;
  const chord = CHORDS[type];
  if (!chord) throw new Error(`Unknown chord: ${type}`);
  let notes = chord.steps.map((step) => root + step);
  for (let i = 0; i < inversion; i += 1) {
    const [lowest, ...rest] = notes;
    notes = [...rest, lowest + 12];
  }
  return notes;
}

/** Display name for a chord, e.g. `chordName(60, 'minor7') === 'Cm7'`. */
export function chordName(root, type, opts = {}) {
  const { flats = false } = opts;
  return `${midiToName(root, { flats, octave: false })}${CHORDS[type].symbol}`;
}

/**
 * Identify a set of pitches as a chord, trying every rotation so inversions
 * are recognised. Returns null when nothing matches.
 * @param {number[]} midiNotes
 */
export function identifyChord(midiNotes) {
  const classes = [...new Set(midiNotes.map(pitchClass))].sort((a, b) => a - b);
  if (classes.length < 3) return null;
  for (let rotation = 0; rotation < classes.length; rotation += 1) {
    const root = classes[rotation];
    const shape = classes.map((c) => pitchClass(c - root)).sort((a, b) => a - b);
    for (const [type, chord] of Object.entries(CHORDS)) {
      const target = [...new Set(chord.steps.map(pitchClass))].sort((a, b) => a - b);
      if (target.length === shape.length && target.every((value, i) => value === shape[i])) {
        const bass = Math.min(...midiNotes);
        const inversion = shape.indexOf(pitchClass(bass - root));
        return { root, type, name: chordName(root, type), inversion: Math.max(0, inversion) };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Keys and diatonic harmony
// ---------------------------------------------------------------------------

/**
 * Key signatures keyed by tonic name. `accidentals` is positive for sharps
 * and negative for flats; `order` lists the affected letters in the
 * conventional writing order.
 */
export const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

export const KEY_SIGNATURES = {
  C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7,
  F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6, Cb: -7,
};

export const MINOR_KEY_SIGNATURES = {
  A: 0, E: 1, B: 2, 'F#': 3, 'C#': 4, 'G#': 5, 'D#': 6, 'A#': 7,
  D: -1, G: -2, C: -3, F: -4, Bb: -5, Eb: -6, Ab: -7,
};

/**
 * Number of sharps (positive) or flats (negative) in a key.
 * @param {string} tonic e.g. 'Bb'
 * @param {'major'|'minor'} mode
 */
export function keySignatureFor(tonic, mode = 'major') {
  const table = mode === 'minor' ? MINOR_KEY_SIGNATURES : KEY_SIGNATURES;
  const value = table[tonic];
  if (value === undefined) throw new Error(`Unsupported key: ${tonic} ${mode}`);
  return value;
}

/** Letters altered by a key signature, in writing order. */
export function accidentalLetters(signature) {
  return signature >= 0 ? SHARP_ORDER.slice(0, signature) : FLAT_ORDER.slice(0, -signature);
}

/** Roman numerals of the seven diatonic triads of a major or minor key. */
export const DIATONIC_TRIADS = {
  major: [
    { numeral: 'I', type: 'major' }, { numeral: 'ii', type: 'minor' }, { numeral: 'iii', type: 'minor' },
    { numeral: 'IV', type: 'major' }, { numeral: 'V', type: 'major' }, { numeral: 'vi', type: 'minor' },
    { numeral: 'vii°', type: 'diminished' },
  ],
  minor: [
    { numeral: 'i', type: 'minor' }, { numeral: 'ii°', type: 'diminished' }, { numeral: 'III', type: 'major' },
    { numeral: 'iv', type: 'minor' }, { numeral: 'v', type: 'minor' }, { numeral: 'VI', type: 'major' },
    { numeral: 'VII', type: 'major' },
  ],
};

/**
 * The seven diatonic triads of a key, as playable chords.
 * @param {number} tonic MIDI note of the tonic
 * @param {'major'|'minor'} mode
 */
export function diatonicTriads(tonic, mode = 'major') {
  const scaleType = mode === 'minor' ? 'naturalMinor' : 'major';
  const scale = buildScale(tonic, scaleType, { includeOctave: false });
  return DIATONIC_TRIADS[mode].map((entry, degree) => ({
    ...entry,
    degree: degree + 1,
    root: scale[degree],
    notes: buildChord(scale[degree], entry.type),
    name: chordName(scale[degree], entry.type, { flats: keySignatureUsesFlats(tonic, mode) }),
  }));
}

function keySignatureUsesFlats(tonic, mode) {
  const name = midiToName(tonic, { octave: false });
  const table = mode === 'minor' ? MINOR_KEY_SIGNATURES : KEY_SIGNATURES;
  return (table[name] ?? 0) < 0 || FLAT_NAMES[pitchClass(tonic)].includes('b');
}

// ---------------------------------------------------------------------------
// Staff placement
// ---------------------------------------------------------------------------

/**
 * Work out how a pitch should be written on a staff in a given key.
 *
 * Returns the letter, the accidental that must be drawn relative to the key
 * signature (null when none is needed), and `staffStep` — a diatonic index
 * where each whole number is one staff position (line or space) and C4 = 28.
 *
 * @param {number} midi
 * @param {number} signature sharps (+) / flats (-) in the key signature
 */
export function spellNote(midi, signature = 0) {
  const note = Math.round(midi);
  const pc = pitchClass(note);
  const preferFlats = signature < 0;
  const altered = new Set(accidentalLetters(signature));

  // Preferred spelling for each pitch class as [letter, alteration in semitones].
  const sharpSpellings = [['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0], ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0]];
  const flatSpellings = [['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0], ['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0]];
  const [letter, alteration] = (preferFlats ? flatSpellings : sharpSpellings)[pc];

  // The written octave follows the letter, not the sounding pitch: Cb4 is
  // written on the C4 line even though it sounds like B3, and B#3 is written
  // on the B3 line even though it sounds like C4.
  const naturalPc = LETTER_SEMITONES[letter];
  const octave = (note - alteration - naturalPc) / 12 - 1;

  const keyAlteration = altered.has(letter) ? (signature > 0 ? 1 : -1) : 0;
  let accidental = null;
  if (alteration !== keyAlteration) accidental = alteration === 0 ? 'natural' : alteration > 0 ? 'sharp' : 'flat';

  const staffStep = octave * 7 + LETTERS.indexOf(letter);
  return { letter, octave, alteration, accidental, staffStep, midi: note };
}

/** Diatonic staff index of C4, the reference every staff renderer measures from. */
export const C4_STAFF_STEP = 4 * 7 + 0;

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

/** Clamp a MIDI note into the 88-key range. */
export function clampToKeyboard(midi) {
  return Math.min(HIGHEST_KEY, Math.max(LOWEST_KEY, Math.round(midi)));
}

/** All MIDI notes in an inclusive range. */
export function noteRange(low, high) {
  const notes = [];
  for (let n = low; n <= high; n += 1) notes.push(n);
  return notes;
}

/** Random integer in [min, max]. */
export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Pick a random element. */
export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/** Fisher–Yates shuffle, returning a new array. */
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
