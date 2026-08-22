/**
 * Translations are data too. These tests make sure every locale carries every
 * key the interface asks for, that the course text lines up with the course
 * structure step by step, and that the note-naming systems behave.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { LOCALES, DEFAULT_LOCALE, i18n } from '../src/i18n.js';
import { LESSONS, UNITS } from '../src/data/lessons.js';
import { SONGS } from '../src/data/songs.js';

const CODES = Object.keys(LOCALES);
const bundles = Object.fromEntries(
  await Promise.all(CODES.map(async (code) => [code, (await import(`../src/locales/${code}/index.js`)).default])),
);

/** Plural categories legitimately differ between languages. */
const PLURAL_CATEGORIES = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

function flatten(value, prefix = '', out = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, path, out);
    else out.set(path, child);
  }
  return out;
}

const flat = Object.fromEntries(CODES.map((code) => [code, flatten(bundles[code])]));

function isPluralVariant(key) {
  const parts = key.split('.');
  if (!PLURAL_CATEGORIES.has(parts.at(-1))) return false;
  const stem = `${parts.slice(0, -1).join('.')}.`;
  return [...flat[DEFAULT_LOCALE].keys()].some((k) => k.startsWith(stem) && PLURAL_CATEGORIES.has(k.split('.').at(-1)));
}

test('every locale is declared with a direction and a note-naming default', () => {
  for (const code of CODES) {
    const locale = LOCALES[code];
    assert.ok(locale.native, `${code} has no native name`);
    assert.ok(['ltr', 'rtl'].includes(locale.dir), `${code} has direction "${locale.dir}"`);
    assert.ok(['letters', 'german', 'solfege'].includes(locale.noteSystem), `${code} has note system "${locale.noteSystem}"`);
  }
  assert.equal(LOCALES.ar.dir, 'rtl', 'Arabic should be right to left');
});

test('no locale is missing a key that English has', () => {
  const reference = flat[DEFAULT_LOCALE];
  for (const code of CODES.filter((c) => c !== DEFAULT_LOCALE)) {
    const missing = [...reference.keys()].filter((key) => !flat[code].has(key));
    assert.deepEqual(missing, [], `${code} is missing ${missing.length} keys, e.g. ${missing.slice(0, 5).join(', ')}`);
  }
});

test('no locale carries a key English does not', () => {
  const reference = flat[DEFAULT_LOCALE];
  for (const code of CODES.filter((c) => c !== DEFAULT_LOCALE)) {
    const extra = [...flat[code].keys()].filter((key) => !reference.has(key) && !isPluralVariant(key));
    assert.deepEqual(extra, [], `${code} has stale keys: ${extra.slice(0, 5).join(', ')}`);
  }
});

test('no translated string is left empty', () => {
  for (const code of CODES) {
    for (const [key, value] of flat[code]) {
      if (typeof value !== 'string') continue;
      // Chord symbols are deliberately international, and a major chord's is empty.
      if (key.startsWith('music.chordSymbols.')) continue;
      assert.notEqual(value.trim(), '', `${code}.${key} is empty`);
    }
  }
});

test('placeholders survive translation', () => {
  const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  const reference = flat[DEFAULT_LOCALE];

  for (const code of CODES.filter((c) => c !== DEFAULT_LOCALE)) {
    for (const [key, value] of reference) {
      if (typeof value !== 'string') continue;
      const translated = flat[code].get(key);
      if (typeof translated !== 'string') continue;
      const expected = placeholders(value);
      if (!expected.length) continue;
      const actual = placeholders(translated);

      // A plural form may legitimately spell the number out — Arabic's
      // singular is "one second", not "1 second" — so those may drop a
      // placeholder. Nothing may ever invent one the code will not supply.
      const invented = actual.filter((name) => !expected.includes(name));
      assert.deepEqual(invented, [], `${code}.${key} uses a placeholder English does not supply`);
      if (!PLURAL_CATEGORIES.has(key.split('.').at(-1))) {
        assert.deepEqual(actual, expected, `${code}.${key} lost a placeholder`);
      }
    }
  }
});

test('every unit has a title and a blurb in every language', () => {
  for (const code of CODES) {
    for (const unit of UNITS) {
      assert.ok(bundles[code].units[unit.id]?.title, `${code} is missing a title for unit ${unit.id}`);
      assert.ok(bundles[code].units[unit.id]?.blurb, `${code} is missing a blurb for unit ${unit.id}`);
    }
  }
});

test('course text lines up with course structure, step for step', () => {
  for (const code of CODES) {
    const course = bundles[code].course;
    assert.equal(Object.keys(course).length, LESSONS.length, `${code} has the wrong number of lessons`);

    for (const lesson of LESSONS) {
      const entry = course[lesson.id];
      assert.ok(entry, `${code} is missing lesson ${lesson.id}`);
      assert.ok(entry.title, `${code}.${lesson.id} has no title`);
      assert.ok(entry.summary, `${code}.${lesson.id} has no summary`);
      assert.equal(entry.steps.length, lesson.steps.length,
        `${code}.${lesson.id} has ${entry.steps.length} step texts for ${lesson.steps.length} steps`);

      lesson.steps.forEach((step, index) => {
        const text = entry.steps[index];
        const where = `${code}.${lesson.id}.${index}`;
        assert.ok(text, `${where} has no text`);

        if (step.type === 'quiz') {
          assert.ok(text.question, `${where} has no question`);
          assert.equal(text.options?.length, step.options, `${where} has the wrong number of options`);
          assert.ok(text.explain, `${where} has no explanation`);
        } else {
          assert.ok(text.title, `${where} has no title`);
        }

        if (['play', 'find', 'staff', 'metronome'].includes(step.type)) {
          assert.ok(text.prompt, `${where} (${step.type}) has no prompt`);
        }
      });
    }
  }
});

test('every song has a title, composer and description in every language', () => {
  for (const code of CODES) {
    const songs = bundles[code].songs;
    for (const song of SONGS) {
      assert.ok(songs[song.id]?.title, `${code} is missing a title for ${song.id}`);
      assert.ok(songs[song.id]?.composer, `${code} is missing a composer for ${song.id}`);
      assert.ok(songs[song.id]?.about, `${code} is missing a description for ${song.id}`);
    }
    assert.equal(Object.keys(songs).length, SONGS.length, `${code} has stale song entries`);
  }
});

// -- runtime behaviour ------------------------------------------------------

test('lookup falls back to English rather than showing a raw key', async () => {
  await i18n.load('de');
  assert.equal(i18n.t('nav.lessons'), 'Lektionen');
  assert.equal(i18n.t('this.key.does.not.exist'), 'this.key.does.not.exist');
  await i18n.load(DEFAULT_LOCALE);
});

test('plural forms select correctly per language', async () => {
  await i18n.load('en');
  assert.equal(i18n.t('lessonsView.steps', { count: 1, n: 1 }), '1 step');
  assert.equal(i18n.t('lessonsView.steps', { count: 4, n: 4 }), '4 steps');

  await i18n.load('ru');
  // Russian needs one/few/many; 2 and 5 must not produce the same word.
  const two = i18n.t('lessonsView.steps', { count: 2, n: 2 });
  const five = i18n.t('lessonsView.steps', { count: 5, n: 5 });
  assert.notEqual(two, five, 'Russian plural categories collapsed');

  await i18n.load(DEFAULT_LOCALE);
});

test('note names render in the reader\'s system', async () => {
  await i18n.load('en');
  i18n.setNoteSystem('letters');
  assert.equal(i18n.noteName(71), 'B');
  assert.equal(i18n.noteName(60, { octave: true }), 'C4');

  i18n.setNoteSystem('german');
  assert.equal(i18n.noteName(71), 'H', 'German writes B natural as H');
  assert.equal(i18n.noteName(70, { flats: true }), 'B', 'German writes B flat as B');

  i18n.setNoteSystem('solfege');
  assert.equal(i18n.noteName(60), 'Do');
  assert.equal(i18n.noteName(67), 'Sol');

  await i18n.load('ru');
  i18n.setNoteSystem('solfege');
  assert.equal(i18n.noteName(60), 'До', 'Russian solfège uses Cyrillic');

  await i18n.load('ar');
  assert.equal(i18n.noteName(60), 'دو', 'Arabic solfège uses Arabic script');

  i18n.setNoteSystem('auto');
  await i18n.load(DEFAULT_LOCALE);
});

test('{note:X} tokens in course text render in the active system', async () => {
  await i18n.load('en');
  i18n.setNoteSystem('letters');
  assert.equal(i18n.format('Play {note:C}'), 'Play C');
  assert.equal(i18n.format('Play {note:C4}'), 'Play C4');

  i18n.setNoteSystem('solfege');
  assert.equal(i18n.format('Play {note:C}'), 'Play Do');

  i18n.setNoteSystem('auto');
});

test('course text never hard-codes a pitch with an octave number', () => {
  // "C4" written literally would read wrong for someone using Do-Re-Mi or
  // the German H; pitches must go through the {note:} token so they render
  // in whatever system the reader chose. A letter with an octave digit is an
  // unambiguous signal, where a bare capital letter is not — English prose
  // is full of the article "A".
  const pitchWithOctave = /(?<![\w#-])[A-G](?:#|b)?[0-8](?![\w-])/;

  // Chord symbols on a lead sheet are written the same in every language —
  // "G7" is "G7" for a German or an Arabic reader — and that lesson is
  // specifically about reading them, so its literals are correct.
  const symbolLessons = new Set(['x-chord-symbols']);
  const problems = [];

  for (const code of CODES) {
    for (const lesson of LESSONS) {
      if (symbolLessons.has(lesson.id)) continue;
      for (const [index, step] of bundles[code].course[lesson.id].steps.entries()) {
        const strings = [step.title, step.summary, step.prompt, step.question, step.explain, ...(step.body ?? []), ...(step.options ?? [])];
        for (const line of strings) {
          if (typeof line !== 'string') continue;
          const stripped = line.replace(/\{note:[^}]+\}/g, '').replace(/`[^`]*`/g, '');
          if (pitchWithOctave.test(stripped)) problems.push(`${code}.${lesson.id}.${index}: ${stripped.slice(0, 90)}`);
        }
      }
    }
  }
  assert.deepEqual(problems.slice(0, 5), [], `${problems.length} lines hard-code a pitch`);
});
