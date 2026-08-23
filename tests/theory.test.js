import test from 'node:test';
import assert from 'node:assert/strict';

import {
  midiToName, nameToMidi, midiToFrequency, frequencyToMidi, isBlackKey, pitchClass, octaveOf,
  buildScale, scaleUpAndDown, isInScale, SCALES,
  buildChord, chordName, identifyChord, CHORDS,
  intervalBetween, spellNote, keySignatureFor, accidentalLetters, diatonicTriads,
  clampToKeyboard, noteRange, LOWEST_KEY, HIGHEST_KEY,
} from '../src/theory.js';

test('note names round-trip through MIDI numbers', () => {
  assert.equal(nameToMidi('C4'), 60);
  assert.equal(nameToMidi('A4'), 69);
  assert.equal(nameToMidi('A0'), 21);
  assert.equal(nameToMidi('C8'), 108);
  assert.equal(nameToMidi('Bb3'), 58);
  assert.equal(nameToMidi('A#3'), 58);
  assert.equal(nameToMidi('F#5'), 78);
  assert.equal(nameToMidi('E'), 64, 'a missing octave defaults to 4');

  for (let midi = LOWEST_KEY; midi <= HIGHEST_KEY; midi += 1) {
    assert.equal(nameToMidi(midiToName(midi)), midi, `round trip failed at ${midi}`);
  }
});

test('unrecognised note names are rejected', () => {
  assert.throws(() => nameToMidi('H4'));
  assert.throws(() => nameToMidi('sharp'));
});

test('frequencies follow equal temperament', () => {
  assert.equal(midiToFrequency(69), 440);
  assert.equal(midiToFrequency(81), 880);
  assert.ok(Math.abs(midiToFrequency(60) - 261.6256) < 0.001);
  assert.ok(Math.abs(frequencyToMidi(440) - 69) < 1e-9);
});

test('black keys are the five sharps of each octave', () => {
  const black = noteRange(60, 71).filter(isBlackKey).map((m) => midiToName(m, { octave: false }));
  assert.deepEqual(black, ['C#', 'D#', 'F#', 'G#', 'A#']);
  assert.equal(pitchClass(-1), 11, 'pitch class is safe below zero');
  assert.equal(octaveOf(60), 4);
  assert.equal(octaveOf(59), 3, 'the octave number changes at C');
});

test('major scale is all white keys from C', () => {
  assert.deepEqual(buildScale(60, 'major'), [60, 62, 64, 65, 67, 69, 71, 72]);
  assert.deepEqual(buildScale(60, 'major', { includeOctave: false }), [60, 62, 64, 65, 67, 69, 71]);
});

test('every scale pattern is strictly ascending and inside an octave', () => {
  for (const [name, scale] of Object.entries(SCALES)) {
    assert.equal(scale.steps[0], 0, `${name} should start on the root`);
    assert.equal(scale.steps.length, scale.degrees.length, `${name} degree labels must match`);
    for (let i = 1; i < scale.steps.length; i += 1) {
      assert.ok(scale.steps[i] > scale.steps[i - 1], `${name} is not ascending`);
    }
    assert.ok(scale.steps.at(-1) < 12, `${name} exceeds an octave`);
  }
});

test('G major raises F, which is why it has one sharp', () => {
  const g = buildScale(67, 'major', { includeOctave: false }).map((m) => midiToName(m, { octave: false }));
  assert.deepEqual(g, ['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
  assert.equal(keySignatureFor('G'), 1);
  assert.deepEqual(accidentalLetters(1), ['F']);
});

test('scales run up and back down without repeating the top note', () => {
  const run = scaleUpAndDown(60, 'major', 1);
  assert.equal(run.length, 15);
  assert.equal(run[7], 72);
  assert.equal(run[8], 71);
  assert.equal(run.at(-1), 60);
});

test('scale membership ignores octave', () => {
  assert.ok(isInScale(76, 60, 'major'), 'E5 is in C major');
  assert.ok(!isInScale(73, 60, 'major'), 'C#5 is not');
});

test('triads and sevenths are built by stacking thirds', () => {
  assert.deepEqual(buildChord(60, 'major'), [60, 64, 67]);
  assert.deepEqual(buildChord(60, 'minor'), [60, 63, 67]);
  assert.deepEqual(buildChord(60, 'dominant7'), [60, 64, 67, 70]);
  assert.equal(chordName(60, 'minor7'), 'Cm7');
});

test('inversions rotate the lowest note up an octave', () => {
  assert.deepEqual(buildChord(60, 'major', { inversion: 1 }), [64, 67, 72]);
  assert.deepEqual(buildChord(60, 'major', { inversion: 2 }), [67, 72, 76]);
});

test('chords are identified in any inversion', () => {
  assert.deepEqual(identifyChord([60, 64, 67]), { root: 0, type: 'major', name: 'C', inversion: 0 });
  const firstInversion = identifyChord([64, 67, 72]);
  assert.equal(firstInversion.name, 'C');
  assert.equal(firstInversion.inversion, 1);
  const seventh = identifyChord([67, 71, 74, 77]);
  assert.equal(seventh.name, 'G7');
  assert.equal(identifyChord([60, 64]), null, 'two notes are not a chord');
});

test('every chord in the table identifies as itself', () => {
  for (const type of Object.keys(CHORDS)) {
    const notes = buildChord(60, type);
    const found = identifyChord(notes);
    assert.ok(found, `${type} was not identified at all`);
    const expected = new Set(buildChord(60, type).map((m) => ((m % 12) + 12) % 12));
    const got = new Set(buildChord(found.root, found.type).map((m) => ((m % 12) + 12) % 12));
    assert.deepEqual([...got].sort(), [...expected].sort(), `${type} identified as ${found.type}`);
  }
});

test('intervals are named by distance', () => {
  assert.equal(intervalBetween(60, 67).short, 'P5');
  assert.equal(intervalBetween(67, 60).short, 'P5', 'direction does not matter');
  assert.equal(intervalBetween(60, 72).name, 'Octave');
  assert.equal(intervalBetween(60, 61).name, 'Minor 2nd');
});

test('note spelling follows the key signature', () => {
  const sharp = spellNote(70, 2);
  assert.equal(sharp.letter, 'A');
  assert.equal(sharp.alteration, 1);
  assert.equal(sharp.octave, 4);

  const flat = spellNote(70, -2);
  assert.equal(flat.letter, 'B');
  assert.equal(flat.alteration, -1);
  assert.equal(flat.octave, 4, 'Bb4 is written in octave 4, not 3');
  assert.equal(flat.accidental, null, 'B flat needs no accidental in a two-flat key');
});

test('an accidental is drawn only when it differs from the key signature', () => {
  assert.equal(spellNote(61, 0).accidental, 'sharp');
  assert.equal(spellNote(66, 1).accidental, null, 'F# is already in the key of G');
  assert.equal(spellNote(65, 1).accidental, 'natural', 'F natural must cancel the key signature');
  assert.equal(spellNote(60, 0).accidental, null);
});

test('staff steps are diatonic, so enharmonics sit on different lines', () => {
  assert.equal(spellNote(60, 0).staffStep, 28, 'middle C is the reference');
  assert.equal(spellNote(62, 0).staffStep, 29);
  assert.equal(spellNote(59, 0).staffStep, 27);
  assert.equal(spellNote(70, 2).staffStep, 33, 'A#4 sits on the A line');
  assert.equal(spellNote(70, -2).staffStep, 34, 'Bb4 sits on the B line');
});

test('diatonic triads of C major are C Dm Em F G Am Bdim', () => {
  const names = diatonicTriads(60, 'major').map((triad) => triad.name);
  assert.deepEqual(names, ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
  const numerals = diatonicTriads(60, 'major').map((triad) => triad.numeral);
  assert.deepEqual(numerals, ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
});

test('diatonic triads of A minor start on a minor tonic', () => {
  const triads = diatonicTriads(57, 'minor');
  assert.equal(triads[0].name, 'Am');
  assert.equal(triads[4].numeral, 'v');
  assert.deepEqual(triads[0].notes, [57, 60, 64]);
});

test('notes clamp into the 88-key range', () => {
  assert.equal(clampToKeyboard(0), LOWEST_KEY);
  assert.equal(clampToKeyboard(200), HIGHEST_KEY);
  assert.equal(clampToKeyboard(60), 60);
});
