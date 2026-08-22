import test from 'node:test';
import assert from 'node:assert/strict';

import {
  METERS, LEVELS, parseCell, cellsForLevel, metersForLevel, buildExercise, scoreTaps,
} from '../src/data/rhythms.js';

/** A deterministic stand-in for Math.random, so a failure can be reproduced. */
function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

test('note values are measured in clicks, not in quarter notes', () => {
  // In 4/4 the click is a quarter note.
  assert.equal(parseCell('q', 'simple').clicks, 1);
  assert.equal(parseCell('h', 'simple').clicks, 2);
  assert.equal(parseCell('w', 'simple').clicks, 4);
  assert.equal(parseCell('e e', 'simple').clicks, 1);
  assert.equal(parseCell('s s s s', 'simple').clicks, 1);
  assert.equal(parseCell('q.', 'simple').clicks, 1.5);

  // In 6/8 it is an eighth, so everything written is worth twice as many.
  assert.equal(parseCell('e', 'compound').clicks, 1);
  assert.equal(parseCell('q', 'compound').clicks, 2);
  assert.equal(parseCell('q.', 'compound').clicks, 3);
});

test('a rest is a note that is not played', () => {
  const { notes } = parseCell('q -q', 'simple');
  assert.equal(notes.length, 2);
  assert.equal(notes[0].rest, false);
  assert.equal(notes[1].rest, true);
  assert.equal(notes[1].clicks, 1, 'a rest still takes up its time');
});

test('three triplet eighths fill exactly one beat', () => {
  const cell = parseCell('3e 3e 3e', 'simple');
  assert.equal(cell.clicks, 1);
  for (const note of cell.notes) assert.equal(note.tuplet, 3);
});

test('an unreadable token is rejected rather than silently ignored', () => {
  assert.throws(() => parseCell('x', 'simple'), /Bad rhythm token/);
  assert.throws(() => parseCell('q..', 'simple'), /Bad rhythm token/);
});

test('every level fills its bars exactly, in every meter it allows', () => {
  for (const level of LEVELS) {
    for (const meter of metersForLevel(level)) {
      for (let seed = 1; seed <= 40; seed += 1) {
        const bars = 1 + (seed % 4);
        const exercise = buildExercise({ level, meter, bars, random: seeded(seed) });
        const expected = METERS[meter].clicks * bars;
        assert.equal(
          exercise.totalClicks, expected,
          `${level} in ${meter} (seed ${seed}) came to ${exercise.totalClicks}, not ${expected}`,
        );

        // Every bar must fill itself, not just the total. A triplet eighth is
        // a third of a click and no binary fraction says that exactly, so the
        // comparison is to within a rounding error rather than to the bit.
        for (const [index, barNotes] of exercise.bars.entries()) {
          const filled = barNotes.reduce((sum, note) => sum + note.clicks, 0);
          assert.ok(
            Math.abs(filled - METERS[meter].clicks) < 1e-9,
            `${level} in ${meter} bar ${index + 1} came to ${filled}, not ${METERS[meter].clicks}`,
          );
        }

        // And the barlines themselves must land where they should.
        exercise.notes.forEach((note) => {
          assert.ok(note.click >= note.bar * METERS[meter].clicks - 1e-9, 'a note fell before its own barline');
          assert.ok(note.click < (note.bar + 1) * METERS[meter].clicks, 'a note fell past its own barline');
        });
      }
    }
  }
});

test('an exercise always has something to play, and ends on a note', () => {
  for (const level of LEVELS) {
    for (let seed = 1; seed <= 30; seed += 1) {
      const exercise = buildExercise({ level, bars: 2, random: seeded(seed * 7) });
      assert.ok(exercise.onsets.length > 0, `${level} produced nothing to tap`);
      assert.equal(exercise.notes.at(-1).rest, false, `${level} ended on a rest`);
      assert.equal(exercise.onsets.length, exercise.notes.filter((n) => !n.rest).length);
    }
  }
});

test('onsets are in order and inside the exercise', () => {
  const exercise = buildExercise({ level: 'sixteenths', bars: 2, random: seeded(11) });
  for (let i = 1; i < exercise.onsets.length; i += 1) {
    assert.ok(exercise.onsets[i] > exercise.onsets[i - 1], 'onsets went backwards');
  }
  assert.ok(exercise.onsets.at(-1) < exercise.totalClicks);
});

test('a level always contains the thing it is named after', () => {
  // With six easier levels contributing cells, the new ones are outnumbered;
  // the generator has to guarantee them rather than hope for them.
  for (let seed = 1; seed <= 50; seed += 1) {
    const triplets = buildExercise({ level: 'triplets', bars: 2, random: seeded(seed) });
    assert.ok(triplets.notes.some((note) => note.tuplet === 3), `no triplet at seed ${seed}`);

    const dotted = buildExercise({ level: 'dotted', bars: 2, random: seeded(seed) });
    assert.ok(dotted.notes.some((note) => note.dotted), `no dotted note at seed ${seed}`);
  }
});

test('compound time is counted in eighths and gets its own cells', () => {
  assert.deepEqual(metersForLevel('compound'), ['6/8']);
  assert.equal(METERS['6/8'].clicks, 6);
  assert.deepEqual(METERS['6/8'].accents, [0, 3], 'a 6/8 bar is accented in two groups of three');
  const exercise = buildExercise({ level: 'compound', bars: 2, random: seeded(3) });
  assert.equal(exercise.meter, '6/8');
  assert.equal(exercise.totalClicks, 12);
  // Nothing shorter than an eighth belongs in the compound pool.
  for (const note of exercise.notes) assert.ok(note.clicks >= 1);
});

test('a level asked for an impossible meter falls back to one that works', () => {
  const exercise = buildExercise({ level: 'compound', meter: '3/4', bars: 1, random: seeded(5) });
  assert.equal(exercise.meter, '6/8');
});

test('cells accumulate as the levels get harder', () => {
  assert.ok(cellsForLevel('sixteenths').length > cellsForLevel('quarters').length);
  assert.ok(cellsForLevel('quarters').every((cell) => cellsForLevel('eighths').includes(cell)));
});

// -- scoring ----------------------------------------------------------------

const SPC = 0.5; // 120 clicks per minute

test('taps exactly on the written onsets are all on time', () => {
  const onsets = [0, 1, 2, 3];
  const taps = onsets.map((onset) => onset * SPC);
  const result = scoreTaps(onsets, taps, { secondsPerClick: SPC });
  assert.equal(result.hits, 4);
  assert.equal(result.missed, 0);
  assert.equal(result.extra, 0);
  assert.equal(result.accuracy, 1);
  assert.equal(result.meanAbsMs, 0);
  assert.ok(result.passed);
  assert.deepEqual(result.verdicts.map((v) => v.verdict), ['on', 'on', 'on', 'on']);
});

test('a tap before its onset is early and one after it is late', () => {
  const onsets = [0, 1];
  const result = scoreTaps(onsets, [-0.1, 0.5 + 0.1], { secondsPerClick: SPC });
  assert.deepEqual(result.verdicts.map((v) => v.verdict), ['early', 'late']);
  assert.ok(result.verdicts[0].offset < 0);
  assert.ok(result.verdicts[1].offset > 0);
  assert.equal(result.hits, 0);
  assert.ok(!result.passed, 'nothing landed in time, so the run did not pass');
});

test('a note nobody played is missed, and a tap for nothing is extra', () => {
  const onsets = [0, 1, 2];
  // The middle note is never played, and there is one stray tap far from anything.
  const result = scoreTaps(onsets, [0, 1.0, 1.6], { secondsPerClick: SPC });
  assert.equal(result.verdicts[1].verdict, 'missed');
  assert.equal(result.verdicts[1].offset, null);
  assert.equal(result.missed, 1);
  assert.equal(result.extra, 1);
  assert.ok(!result.passed);
});

test('one tap cannot answer for two notes', () => {
  const result = scoreTaps([0, 0.25], [0], { secondsPerClick: SPC });
  const matched = result.verdicts.filter((v) => v.offset !== null);
  assert.equal(matched.length, 1, 'the same tap was counted twice');
  assert.equal(result.missed, 1);
});

test('a consistent lean shows up in the signed average, not the absolute one', () => {
  const onsets = [0, 1, 2, 3];
  const late = onsets.map((onset) => onset * SPC + 0.07);
  const result = scoreTaps(onsets, late, { secondsPerClick: SPC });
  assert.equal(result.meanSignedMs, 70);
  assert.equal(result.meanAbsMs, 70);

  // Scattered either side averages out to nothing, but is not tight.
  const scattered = [0 - 0.07, SPC + 0.07, 2 * SPC - 0.07, 3 * SPC + 0.07];
  const wobble = scoreTaps(onsets, scattered, { secondsPerClick: SPC });
  assert.equal(wobble.meanSignedMs, 0);
  assert.equal(wobble.meanAbsMs, 70);
});

test('the tolerance follows the tempo but stays humanly possible', () => {
  // A tenth of a beat is a tenth of a beat, so the same relative error passes
  // at either tempo...
  const relative = (spc) => scoreTaps([0], [spc * 0.1], { secondsPerClick: spc });
  assert.equal(relative(1.0).verdicts[0].verdict, 'on');
  assert.equal(relative(0.5).verdicts[0].verdict, 'on', 'ratio scoring broke at speed');

  // ...but at a sprint the window stops shrinking, or nobody could ever hit it.
  const fast = scoreTaps([0], [0.04], { secondsPerClick: 0.15 });
  assert.equal(fast.verdicts[0].verdict, 'on', '40 ms should still count at 400 bpm');

  // And at a crawl it stops growing, or anything at all would count.
  const slow = scoreTaps([0], [0.3], { secondsPerClick: 3 });
  assert.notEqual(slow.verdicts[0].verdict, 'on');
});

test('a run passes only when everything was played and most of it was in time', () => {
  const onsets = [0, 1, 2, 3];
  const almost = onsets.map((onset, i) => onset * SPC + (i === 0 ? 0.1 : 0));
  assert.ok(scoreTaps(onsets, almost, { secondsPerClick: SPC }).passed, 'one late note out of four should still pass');

  const twoLate = onsets.map((onset, i) => onset * SPC + (i < 2 ? 0.1 : 0));
  assert.ok(!scoreTaps(onsets, twoLate, { secondsPerClick: SPC }).passed);

  const perfectPlusStray = [...onsets.map((o) => o * SPC), 1.7];
  assert.ok(!scoreTaps(onsets, perfectPlusStray, { secondsPerClick: SPC }).passed, 'a stray tap spoils the run');
});

test('an empty performance is scored, not crashed', () => {
  const result = scoreTaps([0, 1], [], { secondsPerClick: SPC });
  assert.equal(result.missed, 2);
  assert.equal(result.meanAbsMs, null);
  assert.equal(result.meanSignedMs, null);
  assert.equal(result.accuracy, 0);
  assert.ok(!result.passed);
});
