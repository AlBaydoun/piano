/**
 * The parts a pop song is actually made of.
 *
 * Almost every hit you can name is a short chord progression played with a
 * particular accompaniment pattern. This module holds both, separately, so you
 * can put any progression under any groove and hear why two songs that share a
 * progression sound nothing alike.
 *
 * A note on what is *not* here. The melodies and recordings of songs still in
 * copyright are not in this repository and cannot be. Chord progressions and
 * accompaniment patterns are a different matter: they are common musical
 * currency, nobody owns "four chords" or a montuno, and they are what you need
 * in your hands to sit down and play the song you have in your head.
 *
 * Everything is language-neutral. Names and explanations live in the locale
 * bundles under `workshop`.
 */

import { buildScale } from '../theory.js';

/** Which chord a roman numeral names, given a key. */
const NUMERALS = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 };

/**
 * Read a roman numeral: an optional flat or sharp, the numeral itself (its
 * case says major or minor), then an optional quality.
 *
 *   V        the major chord on the fifth degree
 *   vi       the minor chord on the sixth
 *   bVII     a major chord a tone below the tonic, borrowed from the minor
 *   ii7      a minor seventh on the second degree
 *   V7       a dominant seventh
 *   vii0     half-diminished; vii0 with a 7 is the full m7b5
 */
export function parseRoman(text) {
  const match = /^(b|#)?([iIvV]+)(0|\+)?(sus[24]|maj7|7|6|9)?$/.exec(text.trim());
  if (!match) throw new Error(`Bad roman numeral: ${text}`);
  const [, accidental, numeral, alteration, extension] = match;

  const degree = NUMERALS[numeral.toLowerCase()];
  if (!degree) throw new Error(`Bad roman numeral: ${text}`);
  const minor = numeral === numeral.toLowerCase();

  let type;
  if (alteration === '0') type = extension === '7' ? 'halfDiminished7' : 'diminished';
  else if (alteration === '+') type = 'augmented';
  else if (extension === 'sus2') type = 'sus2';
  else if (extension === 'sus4') type = 'sus4';
  else if (extension === 'maj7') type = 'major7';
  else if (extension === '9') type = minor ? 'minor9' : 'dominant9';
  else if (extension === '7') type = minor ? 'minor7' : 'dominant7';
  else if (extension === '6') type = minor ? 'minor6' : 'major6';
  else type = minor ? 'minor' : 'major';

  return {
    degree,
    minor,
    type,
    offset: accidental === 'b' ? -1 : accidental === '#' ? 1 : 0,
    label: text.trim(),
  };
}

/**
 * Turn a roman numeral into an actual root note.
 *
 * Degrees are always counted against the *major* scale of the key, whatever
 * the piece's mode, which is the ordinary convention: a flat in front of the
 * numeral is what marks a borrowed chord. It is also what makes minor-key
 * progressions come out right without a special case — in A, `bIII bVI bVII`
 * against the A major scale gives exactly C, F and G.
 *
 * @param {string|object} roman
 * @param {number} tonic  MIDI number of the key's tonic
 */
export function romanRoot(roman, tonic) {
  const { degree, offset } = typeof roman === 'string' ? parseRoman(roman) : roman;
  const scale = buildScale(tonic, 'major', { includeOctave: false });
  return scale[degree - 1] + offset;
}

/**
 * The progressions that most of popular music is built on.
 *
 * `bars` says how many bars each chord lasts, so a twelve-bar blues and a
 * four-chord loop can live in the same list.
 */
export const PROGRESSIONS = [
  { id: 'four-chords', mode: 'major', chords: ['I', 'V', 'vi', 'IV'], bars: 1 },
  { id: 'sensitive', mode: 'major', chords: ['vi', 'IV', 'I', 'V'], bars: 1 },
  { id: 'doo-wop', mode: 'major', chords: ['I', 'vi', 'IV', 'V'], bars: 1 },
  { id: 'andalusian', mode: 'minor', chords: ['i', 'bVII', 'bVI', 'V'], bars: 1 },
  { id: 'minor-axis', mode: 'minor', chords: ['i', 'bVI', 'bIII', 'bVII'], bars: 1 },
  { id: 'two-five-one', mode: 'major', chords: ['ii7', 'V7', 'Imaj7', 'Imaj7'], bars: 1 },
  { id: 'canon', mode: 'major', chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'], bars: 1 },
  { id: 'twelve-bar', mode: 'major', chords: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'], bars: 1 },
];

export function getProgression(id) {
  return PROGRESSIONS.find((entry) => entry.id === id) ?? PROGRESSIONS[0];
}

/**
 * The accompaniment patterns.
 *
 * A pattern is a list of hits. Each hit says when in the bar it lands, which
 * hand plays it, how long it rings, and *what* to play:
 *
 *   'R'   the root, in the bass
 *   'R8'  the root and the octave above it together
 *   '5'   the fifth of the chord, in the bass
 *   'C'   the whole chord
 *   'T'   just the top note of the chord
 *   0,1,2 one chord tone, counted up from the bottom of the voicing
 *
 * `swing` marks patterns whose offbeat eighths are played late, as in blues
 * and jazz rather than straight pop.
 */
export const STYLES = [
  {
    id: 'blocks',
    beats: 4,
    level: 1,
    hits: [
      { beat: 0, hand: 'left', voice: 'R', dur: 4 },
      { beat: 0, hand: 'right', voice: 'C', dur: 4 },
    ],
  },
  {
    id: 'ballad',
    beats: 4,
    level: 1,
    hits: [
      { beat: 0, hand: 'left', voice: 'R', dur: 2 },
      { beat: 2, hand: 'left', voice: '5', dur: 2 },
      { beat: 0, hand: 'right', voice: 'C', dur: 1 },
      { beat: 1, hand: 'right', voice: 'C', dur: 1 },
      { beat: 2, hand: 'right', voice: 'C', dur: 1 },
      { beat: 3, hand: 'right', voice: 'C', dur: 1 },
    ],
  },
  {
    id: 'arpeggio',
    beats: 4,
    level: 2,
    hits: [
      { beat: 0, hand: 'left', voice: 'R', dur: 4 },
      { beat: 0, hand: 'right', voice: 0, dur: 0.5 },
      { beat: 0.5, hand: 'right', voice: 1, dur: 0.5 },
      { beat: 1, hand: 'right', voice: 2, dur: 0.5 },
      { beat: 1.5, hand: 'right', voice: 3, dur: 0.5 },
      { beat: 2, hand: 'right', voice: 2, dur: 0.5 },
      { beat: 2.5, hand: 'right', voice: 1, dur: 0.5 },
      { beat: 3, hand: 'right', voice: 2, dur: 0.5 },
      { beat: 3.5, hand: 'right', voice: 1, dur: 0.5 },
    ],
  },
  {
    id: 'driving',
    beats: 4,
    level: 2,
    hits: [
      { beat: 0, hand: 'left', voice: 'R8', dur: 0.9 },
      { beat: 1, hand: 'left', voice: 'R8', dur: 0.9 },
      { beat: 2, hand: 'left', voice: 'R8', dur: 0.9 },
      { beat: 3, hand: 'left', voice: 'R8', dur: 0.9 },
      { beat: 0.5, hand: 'right', voice: 'C', dur: 0.5 },
      { beat: 1.5, hand: 'right', voice: 'C', dur: 0.5 },
      { beat: 2.5, hand: 'right', voice: 'C', dur: 0.5 },
      { beat: 3.5, hand: 'right', voice: 'C', dur: 0.5 },
    ],
  },
  {
    id: 'latin',
    beats: 4,
    level: 3,
    hits: [
      // The bass leans on the "and of two", which is what pulls the beat
      // forward and makes it dance rather than march.
      { beat: 0, hand: 'left', voice: 'R', dur: 1.5 },
      { beat: 1.5, hand: 'left', voice: '5', dur: 0.5 },
      { beat: 2, hand: 'left', voice: 'R', dur: 1.5 },
      { beat: 3.5, hand: 'left', voice: '5', dur: 0.5 },
      // A montuno: the chord broken into a repeating syncopated figure.
      { beat: 0, hand: 'right', voice: 0, dur: 0.5 },
      { beat: 0.5, hand: 'right', voice: 2, dur: 0.5 },
      { beat: 1, hand: 'right', voice: 1, dur: 0.5 },
      { beat: 1.5, hand: 'right', voice: 2, dur: 0.5 },
      { beat: 2, hand: 'right', voice: 0, dur: 0.5 },
      { beat: 2.5, hand: 'right', voice: 2, dur: 0.5 },
      { beat: 3, hand: 'right', voice: 1, dur: 0.5 },
      { beat: 3.5, hand: 'right', voice: 2, dur: 0.5 },
    ],
  },
  {
    id: 'afro68',
    beats: 6,
    unit: 8,
    level: 3,
    hits: [
      { beat: 0, hand: 'left', voice: 'R', dur: 3 },
      { beat: 3, hand: 'left', voice: '5', dur: 3 },
      { beat: 0, hand: 'right', voice: 'C', dur: 1 },
      { beat: 2, hand: 'right', voice: 'C', dur: 1 },
      { beat: 3, hand: 'right', voice: 'C', dur: 1 },
      { beat: 5, hand: 'right', voice: 'C', dur: 1 },
    ],
  },
  {
    id: 'anthem',
    beats: 4,
    level: 2,
    hits: [
      { beat: 0, hand: 'left', voice: 'R8', dur: 2 },
      { beat: 2, hand: 'left', voice: 'R8', dur: 2 },
      { beat: 0, hand: 'right', voice: 'C', dur: 0.75 },
      { beat: 0.75, hand: 'right', voice: 'T', dur: 0.25 },
      { beat: 1, hand: 'right', voice: 'C', dur: 0.75 },
      { beat: 1.75, hand: 'right', voice: 'T', dur: 0.25 },
      { beat: 2, hand: 'right', voice: 'C', dur: 0.75 },
      { beat: 2.75, hand: 'right', voice: 'T', dur: 0.25 },
      { beat: 3, hand: 'right', voice: 'C', dur: 1 },
    ],
  },
  {
    id: 'shuffle',
    beats: 4,
    level: 3,
    swing: true,
    hits: [
      { beat: 0, hand: 'left', voice: 'R', dur: 0.5 },
      { beat: 0.5, hand: 'left', voice: '5', dur: 0.5 },
      { beat: 1, hand: 'left', voice: 'R', dur: 0.5 },
      { beat: 1.5, hand: 'left', voice: '5', dur: 0.5 },
      { beat: 2, hand: 'left', voice: 'R', dur: 0.5 },
      { beat: 2.5, hand: 'left', voice: '5', dur: 0.5 },
      { beat: 3, hand: 'left', voice: 'R', dur: 0.5 },
      { beat: 3.5, hand: 'left', voice: '5', dur: 0.5 },
      { beat: 0, hand: 'right', voice: 'C', dur: 0.5 },
      { beat: 1, hand: 'right', voice: 'C', dur: 0.5 },
      { beat: 2, hand: 'right', voice: 'C', dur: 0.5 },
      { beat: 3, hand: 'right', voice: 'C', dur: 0.5 },
    ],
  },
  {
    id: 'waltz',
    beats: 3,
    level: 1,
    hits: [
      { beat: 0, hand: 'left', voice: 'R', dur: 1 },
      { beat: 1, hand: 'right', voice: 'C', dur: 1 },
      { beat: 2, hand: 'right', voice: 'C', dur: 1 },
    ],
  },
];

export function getStyle(id) {
  return STYLES.find((entry) => entry.id === id) ?? STYLES[0];
}

// -- turning a progression and a groove into notes ---------------------------

/** Where the right hand sits by default, and the register the bass lives in. */
const RIGHT_CENTRE = 67; // G4
const BASS_CENTRE = 45; // A2
const BASS_LOW = 36; // C2
const BASS_HIGH = 52; // E3

/** Move a pitch class into the octave nearest a target, within a range. */
function nearest(pitchClass, target, { low = 0, high = 108 } = {}) {
  const base = ((pitchClass % 12) + 12) % 12;
  let best = null;
  let bestDistance = Infinity;
  for (let midi = base; midi <= 108; midi += 12) {
    if (midi < low || midi > high) continue;
    const distance = Math.abs(midi - target);
    if (distance < bestDistance) { bestDistance = distance; best = midi; }
  }
  // Nothing inside the range: fall back to the nearest octave anywhere.
  if (best !== null) return best;
  return base + 12 * Math.max(0, Math.round((target - base) / 12));
}

/**
 * Choose an inversion of each chord that moves as little as possible from the
 * one before it.
 *
 * This is voice leading, and it is the single thing that most separates a
 * beginner's chord playing from a professional's: the hand should shuffle
 * between neighbouring shapes rather than leap to root position every time.
 *
 * @param {number[][]} chords  each chord's notes, root position, any octave
 * @param {{centre?: number, floor?: number}} [options]
 *   `floor` keeps the whole hand above a note — the left hand's ceiling, so
 *   the two hands do not end up fighting over the same keys.
 * @returns {number[][]} the same chords, revoiced
 */
export function voiceLead(chords, { centre = RIGHT_CENTRE, floor = 0 } = {}) {
  let previous = null;
  return chords.map((notes) => {
    const pitchClasses = notes.map((note) => note % 12);
    let best = null;
    let bestCost = Infinity;

    // Try every inversion in every plausible octave and keep the closest.
    for (let inversion = 0; inversion < pitchClasses.length; inversion += 1) {
      for (let octave = 3; octave <= 6; octave += 1) {
        const voicing = [];
        let last = Math.max(floor - 1, -Infinity);
        for (let i = 0; i < pitchClasses.length; i += 1) {
          const pc = pitchClasses[(inversion + i) % pitchClasses.length];
          let midi = 12 * octave + pc;
          while (midi <= last) midi += 12;
          voicing.push(midi);
          last = midi;
        }
        if (voicing[voicing.length - 1] > 96) continue;
        const cost = previous
          ? voicing.reduce((total, midi, i) => total + Math.abs(midi - (previous[i] ?? midi)), 0)
          // The first chord has nothing to lead from, so it just sits near home.
          : Math.abs(voicing[0] - centre) + Math.abs(voicing[voicing.length - 1] - centre);
        if (cost < bestCost) { bestCost = cost; best = voicing; }
      }
    }
    previous = best;
    return best;
  });
}

/**
 * Expand a progression and a groove into timed notes.
 *
 * The result has the same shape as the song library's parsed voices, so the
 * keyboard, the player and the engine can all take it as they are.
 *
 * @param {object} options
 * @param {object} options.progression
 * @param {number} options.tonic     MIDI number of the key's tonic
 * @param {object} options.style
 * @param {number} [options.repeats] how many times round the progression
 * @param {'both'|'left'|'right'} [options.hands]
 */
export function renderGroove({ progression, tonic, style, repeats = 1, hands = 'both' }) {
  const beatsPerBar = style.beats;
  const parsed = progression.chords.map((roman) => {
    const info = parseRoman(roman);
    const root = romanRoot(info, tonic);
    return { ...info, root, notes: chordNotes(root, info.type) };
  });
  // The bass first: it walks to the nearest octave each time rather than
  // leaping home, and stays in the register a left hand actually plays in.
  let bassTarget = BASS_CENTRE;
  const bass = parsed.map((chord) => {
    const note = nearest(chord.root, bassTarget, { low: BASS_LOW, high: BASS_HIGH });
    bassTarget = note;
    return note;
  });

  // Then the right hand, placed above wherever the left hand reaches. Styles
  // that double the root at the octave push it a good deal higher than ones
  // that only add the fifth.
  const doublesOctave = style.hits.some((hit) => hit.hand === 'left' && hit.voice === 'R8');
  const leftCeiling = Math.max(...bass) + (doublesOctave ? 12 : 7);
  const voiced = voiceLead(parsed.map((chord) => chord.notes), {
    floor: leftCeiling + 1,
    centre: Math.max(RIGHT_CENTRE, leftCeiling + 5),
  });

  const chords = [];
  const notes = [];
  let beat = 0;

  for (let pass = 0; pass < repeats; pass += 1) {
    parsed.forEach((chord, index) => {
      const bars = progression.bars ?? 1;
      chords.push({
        ...chord,
        voicing: voiced[index],
        bass: bass[index],
        beat,
        beats: beatsPerBar * bars,
        index: chords.length,
      });

      for (let bar = 0; bar < bars; bar += 1) {
        const barStart = beat + bar * beatsPerBar;
        for (const hit of style.hits) {
          if (hands !== 'both' && hit.hand !== hands) continue;
          for (const midi of voicesToNotes(hit.voice, voiced[index], bass[index])) {
            notes.push({
              midi,
              beat: barStart + swung(hit.beat, style),
              duration: hit.dur,
              hand: hit.hand,
            });
          }
        }
      }
      beat += beatsPerBar * bars;
    });
  }

  notes.sort((a, b) => a.beat - b.beat || a.midi - b.midi);
  return { chords, notes, beatsPerBar, totalBeats: beat, meter: `${beatsPerBar}/${style.unit ?? 4}` };
}

/** Which actual notes a hit's voice symbol means. */
function voicesToNotes(voice, voicing, bassNote) {
  if (voice === 'R') return [bassNote];
  if (voice === 'R8') return [bassNote, bassNote + 12];
  if (voice === '5') return [nearest(bassNote + 7, bassNote + 4, { low: bassNote, high: bassNote + 11 })];
  if (voice === 'C') return [...voicing];
  if (voice === 'T') return [voicing[voicing.length - 1]];
  if (typeof voice === 'number') {
    // Indices past the top of the voicing carry on into the next octave, so a
    // four-note arpeggio figure works over a three-note triad.
    const octave = Math.floor(voice / voicing.length) * 12;
    return [voicing[voice % voicing.length] + octave];
  }
  throw new Error(`Unknown voice: ${voice}`);
}

/** Offbeat eighths land late in a shuffle, on time in everything else. */
function swung(beat, style) {
  if (!style.swing) return beat;
  const offbeat = Math.abs((beat % 1) - 0.5) < 1e-9;
  return offbeat ? beat + 1 / 6 : beat;
}

/** The chord's notes in root position, low enough to be revoiced upwards. */
function chordNotes(root, type) {
  return CHORD_STEPS[type].map((step) => root + step);
}

/**
 * The intervals of each chord type. Kept here rather than imported so this
 * module stays the one place that decides how a progression becomes notes.
 */
const CHORD_STEPS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  major6: [0, 4, 7, 9],
  minor6: [0, 3, 7, 9],
  dominant7: [0, 4, 7, 10],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  halfDiminished7: [0, 3, 6, 10],
  dominant9: [0, 4, 7, 10, 14],
  minor9: [0, 3, 7, 10, 14],
};
