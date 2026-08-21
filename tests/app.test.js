/**
 * Tests for the parts of the app that can run without a browser: the router's
 * pattern matching and the progress store's arithmetic.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { Router } from '../src/router.js';
import { Progress } from '../src/storage.js';

/** Minimal window stand-in so the router can be exercised in Node. */
function stubWindow(hash = '#/home') {
  const listeners = new Map();
  globalThis.window = {
    location: {
      hash,
      replace(next) { this.hash = next; },
    },
    addEventListener(type, fn) { listeners.set(type, fn); },
    removeEventListener(type) { listeners.delete(type); },
    scrollTo() {},
  };
  return { listeners, setHash: (next) => { globalThis.window.location.hash = next; } };
}

test.afterEach(() => {
  delete globalThis.window;
});

test('static routes resolve to their handler', () => {
  stubWindow('#/lessons');
  let hit = null;
  new Router()
    .add('/home', () => { hit = 'home'; })
    .add('/lessons', () => { hit = 'lessons'; })
    .resolve();
  assert.equal(hit, 'lessons');
});

test('an empty hash falls through to home', () => {
  stubWindow('');
  let hit = null;
  new Router().add('/home', () => { hit = 'home'; }).resolve();
  assert.equal(hit, 'home');
});

test('parameters are captured and decoded', () => {
  stubWindow('#/song/prelude%20in%20c');
  let params = null;
  new Router().add('/song/:id', (context) => { params = context.params; }).resolve();
  assert.deepEqual(params, { id: 'prelude in c' });
});

test('a parameter does not swallow a slash', () => {
  stubWindow('#/practice/notes');
  const hits = [];
  new Router()
    .add('/practice/:drill', () => hits.push('drill'))
    .resolve();
  assert.deepEqual(hits, ['drill']);

  stubWindow('#/practice/notes/extra');
  const missed = [];
  new Router()
    .add('/practice/:drill', () => missed.push('drill'))
    .notFound(() => missed.push('404'))
    .resolve();
  assert.deepEqual(missed, ['404']);
});

test('unknown paths reach the fallback', () => {
  stubWindow('#/nowhere');
  let fallback = false;
  new Router().add('/home', () => {}).notFound(() => { fallback = true; }).resolve();
  assert.ok(fallback);
});

test('leaving a route runs the cleanup it returned', () => {
  const stub = stubWindow('#/a');
  const events = [];
  const router = new Router()
    .add('/a', () => { events.push('enter a'); return () => events.push('leave a'); })
    .add('/b', () => { events.push('enter b'); });
  router.resolve();
  stub.setHash('#/b');
  router.resolve();
  assert.deepEqual(events, ['enter a', 'leave a', 'enter b']);
});

test('a throwing cleanup does not stop the next route rendering', () => {
  const stub = stubWindow('#/a');
  const events = [];
  const router = new Router()
    .add('/a', () => () => { throw new Error('boom'); })
    .add('/b', () => { events.push('enter b'); });
  router.resolve();
  stub.setHash('#/b');
  router.resolve();
  assert.deepEqual(events, ['enter b']);
});

// -- progress ---------------------------------------------------------------

test('lesson completion is recorded and counted', () => {
  const progress = new Progress();
  progress.reset();
  assert.equal(progress.isLessonComplete('kb-groups'), false);
  progress.completeLesson('kb-groups');
  assert.equal(progress.isLessonComplete('kb-groups'), true);
  assert.equal(progress.completedLessonCount, 1);
  progress.resetLesson('kb-groups');
  assert.equal(progress.completedLessonCount, 0);
});

test('drill accuracy and best streak accumulate', () => {
  const progress = new Progress();
  progress.reset();
  progress.recordDrill('note-reading', { correct: true, streak: 1 });
  progress.recordDrill('note-reading', { correct: true, streak: 2 });
  progress.recordDrill('note-reading', { correct: false, streak: 0 });

  const record = progress.drill('note-reading');
  assert.equal(record.attempts, 3);
  assert.equal(record.correct, 2);
  assert.equal(record.bestStreak, 2);
  assert.ok(Math.abs(progress.overallAccuracy - 2 / 3) < 1e-9);
  assert.deepEqual(progress.drill('never-played'), { attempts: 0, correct: 0, bestStreak: 0, lastPlayed: 0 });
});

test('song records keep the best accuracy, not the latest', () => {
  const progress = new Progress();
  progress.reset();
  progress.recordSong('twinkle', 0.8);
  progress.recordSong('twinkle', 0.5);
  const record = progress.song('twinkle');
  assert.equal(record.bestAccuracy, 0.8);
  assert.equal(record.timesPlayed, 2);
});

test('practice time accumulates per day', () => {
  const progress = new Progress();
  progress.reset();
  progress.addPracticeTime(60);
  progress.addPracticeTime(30);
  assert.equal(progress.data.practiceSeconds, 90);
  assert.equal(progress.data.sessions.length, 1);
  assert.equal(progress.data.sessions[0].seconds, 90);

  progress.addPracticeTime(-5);
  progress.addPracticeTime(Number.NaN);
  assert.equal(progress.data.practiceSeconds, 90, 'nonsense durations are ignored');
});

test('the streak counts consecutive days ending today', () => {
  const progress = new Progress();
  progress.reset();
  const day = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
  };
  progress.data.sessions = [
    { date: day(3), seconds: 300 },
    { date: day(1), seconds: 300 },
    { date: day(0), seconds: 300 },
  ];
  assert.equal(progress.streak, 2, 'the gap at day 2 breaks the run');

  progress.data.sessions = [{ date: day(0), seconds: 10 }];
  assert.equal(progress.streak, 0, 'a ten-second visit is not a practice day');

  progress.data.sessions = [];
  assert.equal(progress.streak, 0);
});

test('recent activity is padded with empty days, oldest first', () => {
  const progress = new Progress();
  progress.reset();
  progress.addPracticeTime(120);
  const week = progress.recentActivity(7);
  assert.equal(week.length, 7);
  assert.equal(week.at(-1).seconds, 120, 'today is last');
  assert.equal(week[0].seconds, 0);
  assert.ok(week[0].date < week.at(-1).date);
});

test('export and import round-trip', () => {
  const progress = new Progress();
  progress.reset();
  progress.completeLesson('kb-names');
  progress.recordSong('mary', 0.9);
  const json = progress.export();

  progress.reset();
  assert.equal(progress.completedLessonCount, 0);

  progress.import(json);
  assert.equal(progress.isLessonComplete('kb-names'), true);
  assert.equal(progress.song('mary').bestAccuracy, 0.9);
});

test('corrupt imports are rejected rather than half-applied', () => {
  const progress = new Progress();
  progress.reset();
  progress.completeLesson('kb-names');
  assert.throws(() => progress.import('not json at all'));
  assert.equal(progress.isLessonComplete('kb-names'), true);
});
