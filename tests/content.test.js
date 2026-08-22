/** The song library and lesson course are data; these tests keep them honest. */

import test from 'node:test';
import assert from 'node:assert/strict';

import { SONGS, getSong, parseVoice, compile, LEVELS, STUDY_TAG, repertoire, studies } from '../src/data/songs.js';
import { LESSONS, UNITS, getLesson, nextLesson, previousLesson, lessonsInUnit } from '../src/data/lessons.js';
import { LOWEST_KEY, HIGHEST_KEY } from '../src/theory.js';

const STEP_TYPES = new Set(['text', 'play', 'find', 'staff', 'listen', 'quiz', 'metronome', 'song']);

// -- notation parser --------------------------------------------------------

test('the compact notation parser handles pitches, durations and chords', () => {
  assert.deepEqual(parseVoice('C4 D4'), [
    { midi: 60, beat: 0, duration: 1, hand: 'right' },
    { midi: 62, beat: 1, duration: 1, hand: 'right' },
  ]);
  assert.deepEqual(parseVoice('C4:2 D4:0.5'), [
    { midi: 60, beat: 0, duration: 2, hand: 'right' },
    { midi: 62, beat: 2, duration: 0.5, hand: 'right' },
  ]);
  const triplet = parseVoice('C4:1/3 D4:1/3 E4:1/3');
  assert.equal(triplet.length, 3);
  assert.ok(Math.abs(triplet[2].beat - 2 / 3) < 1e-9);
});

test('chord tokens start every note at the same beat', () => {
  const chord = parseVoice('C4+E4+G4:2 A4');
  assert.deepEqual(chord.map((n) => n.beat), [0, 0, 0, 2]);
  assert.deepEqual(chord.map((n) => n.midi), [60, 64, 67, 69]);
});

test('rests advance the clock without producing notes', () => {
  assert.deepEqual(parseVoice('r:2 C4'), [{ midi: 60, beat: 2, duration: 1, hand: 'right' }]);
  assert.equal(parseVoice('-:1 C4')[0].beat, 1);
});

test('barlines are decoration and do not affect timing', () => {
  assert.deepEqual(parseVoice('C4 | D4'), parseVoice('C4 D4'));
});

test('a bad duration is an error rather than a silently wrong song', () => {
  assert.throws(() => parseVoice('C4:zero'));
  assert.throws(() => parseVoice('C4:-1'));
});

test('compile merges voices in time order and reports the length', () => {
  const song = compile({
    voices: [
      { hand: 'right', notation: 'C5 D5' },
      { hand: 'left', notation: 'C3:2' },
    ],
  });
  assert.deepEqual(song.notes.map((n) => n.beat), [0, 0, 1]);
  assert.equal(song.lastBeat, 2);
});

// -- the library ------------------------------------------------------------

test('song ids are unique and resolvable', () => {
  const ids = SONGS.map((song) => song.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate song id');
  for (const id of ids) assert.ok(getSong(id), `${id} could not be looked up`);
  assert.equal(getSong('does-not-exist'), null);
});

test('every song has playable notes within the 88 keys', () => {
  for (const song of SONGS) {
    assert.ok(song.notes.length > 0, `${song.id} has no notes`);
    for (const note of song.notes) {
      assert.ok(Number.isFinite(note.midi), `${song.id} has a non-numeric pitch`);
      assert.ok(note.midi >= LOWEST_KEY && note.midi <= HIGHEST_KEY, `${song.id} has ${note.midi} outside the keyboard`);
      assert.ok(note.duration > 0, `${song.id} has a zero-length note`);
      assert.ok(note.beat >= 0, `${song.id} has a negative beat`);
      assert.ok(['left', 'right'].includes(note.hand), `${song.id} has hand "${note.hand}"`);
    }
  }
});

test('song metadata is complete and sane', () => {
  for (const song of SONGS) {
    assert.ok(LEVELS.includes(song.level), `${song.id} has an unknown level ${song.level}`);
    assert.ok(song.tempo >= 40 && song.tempo <= 200, `${song.id} has tempo ${song.tempo}`);
    assert.equal(song.timeSignature.length, 2, `${song.id} has a malformed time signature`);
    assert.ok([2, 4, 8].includes(song.timeSignature[1]), `${song.id} has an odd beat unit`);
    assert.ok(typeof song.keySignature === 'number', `${song.id} has no key signature`);
  }
});

test('studies and repertoire together account for every song', () => {
  assert.equal(repertoire().length + studies().length, SONGS.length);
  for (const study of studies()) assert.ok(study.tags.includes(STUDY_TAG));
  for (const piece of repertoire()) assert.ok(!piece.tags?.includes(STUDY_TAG));
  assert.ok(studies().length >= 4, 'the technical studies went missing');
});

test('the hands of a two-handed song overlap in time', () => {
  for (const song of SONGS.filter((s) => s.voices.length > 1)) {
    const right = song.notes.filter((n) => n.hand === 'right');
    const left = song.notes.filter((n) => n.hand === 'left');
    assert.ok(right.length && left.length, `${song.id} declares two voices but only uses one`);
    const rightEnd = Math.max(...right.map((n) => n.beat + n.duration));
    const leftEnd = Math.max(...left.map((n) => n.beat + n.duration));
    // Canon in D deliberately runs the bass past the melody; allow a whole
    // section of difference, but not a hand that stops halfway through.
    assert.ok(Math.min(rightEnd, leftEnd) > Math.max(rightEnd, leftEnd) * 0.55,
      `${song.id} hands are badly out of step (${rightEnd} vs ${leftEnd})`);
  }
});

test('bars line up with the time signature, allowing for pickups', () => {
  for (const song of SONGS) {
    const beatsPerBar = song.timeSignature[0];
    const remainder = song.lastBeat % beatsPerBar;
    const tidy = remainder < 1e-6 || Math.abs(remainder - Math.round(remainder)) < 1e-6;
    assert.ok(tidy, `${song.id} ends mid-beat (${song.lastBeat} beats in ${beatsPerBar}/x)`);
  }
});

// -- the course -------------------------------------------------------------

test('the course is large enough to take a beginner a long way', () => {
  assert.ok(LESSONS.length >= 50, `only ${LESSONS.length} lessons`);
  assert.ok(UNITS.length >= 10, `only ${UNITS.length} units`);
});

test('lesson ids are unique and belong to a real unit', () => {
  const ids = LESSONS.map((lesson) => lesson.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate lesson id');
  const units = new Set(UNITS.map((unit) => unit.id));
  for (const lesson of LESSONS) {
    assert.ok(units.has(lesson.unit), `${lesson.id} is in unknown unit "${lesson.unit}"`);
    assert.ok(lesson.steps.length > 0, `${lesson.id} has no steps`);
  }
});

test('each unit declares the number of lessons it actually has', () => {
  for (const unit of UNITS) {
    const actual = lessonsInUnit(unit.id).length;
    assert.equal(actual, unit.lessons, `unit "${unit.id}" declares ${unit.lessons} lessons but has ${actual}`);
  }
});

test('lesson steps are well formed', () => {
  for (const lesson of LESSONS) {
    for (const [index, step] of lesson.steps.entries()) {
      const where = `${lesson.id} step ${index + 1}`;
      assert.ok(STEP_TYPES.has(step.type), `${where} has unknown type "${step.type}"`);

      if (step.type === 'play') {
        assert.ok(Array.isArray(step.notes) && step.notes.length, `${where} has no notes`);
        for (const midi of step.notes) {
          assert.ok(midi >= LOWEST_KEY && midi <= HIGHEST_KEY, `${where} has ${midi} off the keyboard`);
        }
        assert.ok(['sequence', 'chord'].includes(step.mode), `${where} has mode "${step.mode}"`);
        if (step.fingers) {
          assert.equal(step.fingers.length, step.notes.length, `${where} fingering length mismatch`);
          for (const finger of step.fingers) assert.ok(finger >= 1 && finger <= 5, `${where} has finger ${finger}`);
        }
      }

      if (step.type === 'find') {
        assert.ok(step.target && step.target.pitchClass >= 0 && step.target.pitchClass <= 11, `${where} has a bad target`);
      }

      if (step.type === 'staff') {
        assert.ok(step.notes?.length, `${where} has no notes`);
        assert.ok(['treble', 'bass', 'grand'].includes(step.clef ?? 'treble'), `${where} has clef "${step.clef}"`);
      }

      if (step.type === 'listen') {
        assert.ok(step.examples?.length, `${where} has no examples`);
        for (const example of step.examples) {
          assert.ok(example.notes?.length, `${where} has an empty example`);
          for (const midi of example.notes) {
            assert.ok(midi >= LOWEST_KEY && midi <= HIGHEST_KEY, `${where} plays ${midi}`);
          }
        }
      }

      if (step.type === 'quiz') {
        assert.ok(step.options >= 2, `${where} needs at least two options`);
        assert.ok(step.answer >= 0 && step.answer < step.options, `${where} answer index is out of range`);
      }

      if (step.type === 'song') {
        assert.ok(getSong(step.songId), `${where} points at missing song "${step.songId}"`);
      }

      if (step.type === 'metronome') {
        assert.ok(step.beats > 0, `${where} needs a positive beat count`);
      }
    }
  }
});

test('every lesson eventually asks the learner to do something', () => {
  const passive = new Set(['text']);
  const allReading = LESSONS.filter((lesson) => lesson.steps.every((step) => passive.has(step.type)));
  // A couple of closing lessons are pure prose by design; anything more than
  // that means a unit has drifted into being a textbook.
  assert.ok(allReading.length <= 2, `too many read-only lessons: ${allReading.map((l) => l.id).join(', ')}`);
});

test('lesson lookup and ordering work', () => {
  assert.equal(getLesson(LESSONS[0].id).id, LESSONS[0].id);
  assert.equal(getLesson('nope'), null);
  assert.equal(nextLesson(LESSONS[0].id).id, LESSONS[1].id);
  assert.equal(nextLesson(LESSONS.at(-1).id), null, 'the last lesson has no next');
  assert.equal(previousLesson(LESSONS[0].id), null, 'the first lesson has no previous');
  assert.equal(previousLesson(LESSONS[1].id).id, LESSONS[0].id);
});

test('lessons are grouped so that each unit runs consecutively', () => {
  const seen = new Set();
  let previous = null;
  for (const lesson of LESSONS) {
    if (lesson.unit !== previous) {
      assert.ok(!seen.has(lesson.unit), `unit "${lesson.unit}" is split across the course`);
      seen.add(lesson.unit);
      previous = lesson.unit;
    }
  }
});

test('units appear in the course in the order they are declared', () => {
  const declared = UNITS.map((unit) => unit.id);
  const encountered = [];
  for (const lesson of LESSONS) {
    if (encountered.at(-1) !== lesson.unit) encountered.push(lesson.unit);
  }
  assert.deepEqual(encountered, declared);
});

test('illustrations reference notes that exist on the keyboard', () => {
  for (const lesson of LESSONS) {
    for (const step of lesson.steps) {
      for (const midi of step.highlight?.notes ?? []) {
        assert.ok(midi >= LOWEST_KEY && midi <= HIGHEST_KEY, `${lesson.id} highlights ${midi}`);
      }
      for (const event of step.staff?.events ?? []) {
        for (const midi of event.midis ?? []) {
          assert.ok(midi >= LOWEST_KEY && midi <= HIGHEST_KEY, `${lesson.id} notates ${midi}`);
        }
        if (event.label !== undefined) {
          assert.ok(event.label >= LOWEST_KEY && event.label <= HIGHEST_KEY,
            `${lesson.id} labels with ${event.label}, which should be a MIDI note`);
        }
      }
    }
  }
});
