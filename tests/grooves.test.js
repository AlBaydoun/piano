import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PROGRESSIONS, STYLES, getProgression, getStyle,
  parseRoman, romanRoot, voiceLead, renderGroove,
} from '../src/data/grooves.js';
import { midiToName, nameToMidi } from '../src/theory.js';

const C4 = 60;
const A3 = 57;

test('a roman numeral says which degree, and its case says major or minor', () => {
  assert.deepEqual(parseRoman('I'), { degree: 1, minor: false, type: 'major', offset: 0, label: 'I' });
  assert.deepEqual(parseRoman('vi'), { degree: 6, minor: true, type: 'minor', offset: 0, label: 'vi' });
  assert.equal(parseRoman('V7').type, 'dominant7');
  assert.equal(parseRoman('ii7').type, 'minor7');
  assert.equal(parseRoman('Imaj7').type, 'major7');
  assert.equal(parseRoman('vii0').type, 'diminished');
  assert.equal(parseRoman('vii07').type, 'halfDiminished7');
  assert.equal(parseRoman('Isus4').type, 'sus4');
  assert.equal(parseRoman('bVII').offset, -1);
  assert.equal(parseRoman('#iv').offset, 1);
});

test('nonsense is rejected rather than quietly turned into a chord', () => {
  for (const bad of ['', 'H', 'viii', 'I11', 'x']) {
    assert.throws(() => parseRoman(bad), /Bad roman numeral/, `accepted ${JSON.stringify(bad)}`);
  }
});

test('degrees are counted against the major scale, so borrowed chords come out right', () => {
  // In C: the plain degrees.
  assert.equal(midiToName(romanRoot('I', C4)), 'C4');
  assert.equal(midiToName(romanRoot('IV', C4)), 'F4');
  assert.equal(midiToName(romanRoot('V', C4)), 'G4');
  assert.equal(midiToName(romanRoot('vi', C4)), 'A4');

  // And in A, the flattened ones land on the natural-minor notes — which is
  // the whole reason the accidental is written into the numeral.
  assert.equal(midiToName(romanRoot('bIII', A3)), 'C4');
  assert.equal(midiToName(romanRoot('bVI', A3)), 'F4');
  assert.equal(midiToName(romanRoot('bVII', A3)), 'G4');
});

test('every progression in the library parses and stays inside the keyboard', () => {
  for (const progression of PROGRESSIONS) {
    assert.ok(progression.chords.length > 0, `${progression.id} has no chords`);
    for (const roman of progression.chords) {
      const root = romanRoot(roman, C4);
      assert.ok(root > 21 && root < 108, `${progression.id}: ${roman} landed off the keyboard`);
    }
  }
});

// -- voice leading ----------------------------------------------------------

test('voicings keep their notes in order, low to high', () => {
  const voiced = voiceLead([[60, 64, 67], [67, 71, 74], [57, 60, 64]]);
  for (const voicing of voiced) {
    for (let i = 1; i < voicing.length; i += 1) {
      assert.ok(voicing[i] > voicing[i - 1], `notes out of order: ${voicing}`);
    }
  }
});

test('a voicing holds the same notes as the chord it came from', () => {
  const chords = [[60, 64, 67], [67, 71, 74], [65, 69, 72]];
  voiceLead(chords).forEach((voicing, i) => {
    assert.deepEqual(
      [...new Set(voicing.map((m) => m % 12))].sort((a, b) => a - b),
      [...new Set(chords[i].map((m) => m % 12))].sort((a, b) => a - b),
      'the revoiced chord is not the same chord any more',
    );
  });
});

test('the hand shuffles between neighbouring shapes rather than leaping home', () => {
  // C - G - Am - F, the four chords. In root position every time, the hand
  // would jump a long way; led properly, it barely moves.
  const rootPosition = [[60, 64, 67], [67, 71, 74], [69, 72, 76], [65, 69, 72]];
  const voiced = voiceLead(rootPosition);

  const travel = (chords) => chords.slice(1).reduce((total, chord, i) => (
    total + chord.reduce((sum, midi, v) => sum + Math.abs(midi - chords[i][v]), 0)
  ), 0);

  assert.ok(
    travel(voiced) < travel(rootPosition) / 2,
    `voice leading barely helped: ${travel(voiced)} against ${travel(rootPosition)}`,
  );
  // And every chord should still be within reach of one hand position.
  for (const voicing of voiced) {
    assert.ok(voicing[voicing.length - 1] - voicing[0] <= 12, `voicing spans more than an octave: ${voicing}`);
  }
});

// -- rendering --------------------------------------------------------------

const groove = (progressionId, styleId, extra = {}) => renderGroove({
  progression: getProgression(progressionId),
  tonic: C4,
  style: getStyle(styleId),
  ...extra,
});

test('every progression works under every groove', () => {
  for (const progression of PROGRESSIONS) {
    for (const style of STYLES) {
      const rendered = renderGroove({ progression, tonic: C4, style });
      assert.equal(rendered.chords.length, progression.chords.length, `${progression.id} + ${style.id}`);
      assert.ok(rendered.notes.length > 0, `${progression.id} + ${style.id} produced no notes`);
      assert.equal(
        rendered.totalBeats, progression.chords.length * style.beats * (progression.bars ?? 1),
        `${progression.id} + ${style.id} came out the wrong length`,
      );
      for (const note of rendered.notes) {
        assert.ok(note.midi >= 21 && note.midi <= 108, `${progression.id} + ${style.id}: ${note.midi} is off the keyboard`);
        assert.ok(note.beat >= 0 && note.beat < rendered.totalBeats, 'a note fell outside the loop');
        assert.ok(note.duration > 0);
        assert.ok(note.hand === 'left' || note.hand === 'right');
      }
    }
  }
});

test('notes come back in time order', () => {
  const rendered = groove('canon', 'latin');
  for (let i = 1; i < rendered.notes.length; i += 1) {
    assert.ok(rendered.notes[i].beat >= rendered.notes[i - 1].beat, 'notes came back out of order');
  }
});

test('asking for one hand gives you only that hand', () => {
  for (const hand of ['left', 'right']) {
    const rendered = groove('four-chords', 'ballad', { hands: hand });
    assert.ok(rendered.notes.length > 0);
    assert.ok(rendered.notes.every((note) => note.hand === hand), `${hand} only was not honoured`);
  }
  const both = groove('four-chords', 'ballad');
  assert.ok(both.notes.some((note) => note.hand === 'left'));
  assert.ok(both.notes.some((note) => note.hand === 'right'));
});

test('the left hand stays below the right', () => {
  for (const style of STYLES) {
    const rendered = renderGroove({ progression: getProgression('four-chords'), tonic: C4, style });
    const highestLeft = Math.max(...rendered.notes.filter((n) => n.hand === 'left').map((n) => n.midi));
    const lowestRight = Math.min(...rendered.notes.filter((n) => n.hand === 'right').map((n) => n.midi));
    assert.ok(highestLeft < lowestRight, `${style.id}: the hands overlap (${highestLeft} vs ${lowestRight})`);
  }
});

test('going round again repeats the loop rather than lengthening it', () => {
  const once = groove('four-chords', 'blocks');
  const twice = groove('four-chords', 'blocks', { repeats: 2 });
  assert.equal(twice.totalBeats, once.totalBeats * 2);
  assert.equal(twice.chords.length, once.chords.length * 2);
  assert.equal(twice.notes.length, once.notes.length * 2);
  // The second time round is the first, one loop later.
  assert.deepEqual(
    twice.chords.slice(4).map((c) => c.voicing),
    once.chords.map((c) => c.voicing),
  );
});

test('a shuffle plays its offbeats late and everything else on time', () => {
  const straight = groove('four-chords', 'ballad');
  assert.ok(straight.notes.every((note) => Number.isInteger(note.beat * 2)), 'a straight groove was swung');

  const swung = groove('four-chords', 'shuffle');
  const offbeats = swung.notes.filter((note) => note.beat % 1 > 0);
  assert.ok(offbeats.length > 0, 'the shuffle had no offbeats to swing');
  for (const note of offbeats) {
    assert.ok(Math.abs((note.beat % 1) - 2 / 3) < 1e-9, `offbeat landed at ${note.beat % 1}, not two thirds`);
  }
});

test('the bass walks rather than leaping about', () => {
  const rendered = groove('canon', 'ballad');
  const bass = rendered.chords.map((chord) => chord.bass);
  for (let i = 1; i < bass.length; i += 1) {
    assert.ok(Math.abs(bass[i] - bass[i - 1]) <= 6, `the bass leapt from ${bass[i - 1]} to ${bass[i]}`);
  }
});

test('a progression is transposed as a whole, not chord by chord', () => {
  const inC = groove('four-chords', 'blocks');
  const inE = renderGroove({
    progression: getProgression('four-chords'),
    tonic: nameToMidi('E4'),
    style: getStyle('blocks'),
  });
  inC.chords.forEach((chord, i) => {
    assert.equal((inE.chords[i].root - chord.root + 120) % 12, 4, 'a chord was not moved with the rest');
    assert.equal(inE.chords[i].type, chord.type);
  });
});

test('an unknown progression or groove falls back instead of throwing', () => {
  assert.equal(getProgression('nope').id, PROGRESSIONS[0].id);
  assert.equal(getStyle('nope').id, STYLES[0].id);
});
