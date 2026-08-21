/**
 * Landing screen: what this is, where to start, and how you are doing.
 */

import { h, card, stat, formatDuration, percent } from '../ui.js';
import { LESSONS, UNITS, lessonsInUnit } from '../data/lessons.js';
import { SONGS } from '../data/songs.js';

const FEATURES = [
  {
    path: '/lessons',
    title: 'Lessons',
    blurb: 'A course that starts at "which key is C" and ends at pedalling. Every concept has something to play.',
    meta: () => `${LESSONS.length} lessons in ${UNITS.length} units`,
  },
  {
    path: '/songs',
    title: 'Songs',
    blurb: 'Falling notes that wait for you to find the right key, or play along at your own tempo.',
    meta: () => `${SONGS.length} pieces, public domain`,
  },
  {
    path: '/practice',
    title: 'Practice drills',
    blurb: 'Sight reading, ear training, chord recognition and key signatures — short, repeatable, scored.',
    meta: () => 'Four drills',
  },
  {
    path: '/reference',
    title: 'Reference',
    blurb: 'Look up any scale or chord, see it on the keyboard and the staff, and hear it.',
    meta: () => 'Scales, chords, keys',
  },
  {
    path: '/freeplay',
    title: 'Free play',
    blurb: 'Just the piano, with live chord detection and a scale highlighter if you want one.',
    meta: () => 'No goals, no scoring',
  },
];

export function render(app) {
  const { progress } = app;
  const nextLesson = LESSONS.find((lesson) => !progress.isLessonComplete(lesson.id)) ?? LESSONS[0];
  const done = progress.completedLessonCount;
  const started = done > 0 || progress.data.practiceSeconds > 0;

  const page = h('div.page.page--home', null,
    h('section.hero', null,
      h('p.hero__eyebrow', null, 'Free, open source, no account, works offline'),
      h('h1.hero__title', null, 'Learn the piano in your browser'),
      h('p.hero__lede', null,
        'A complete beginner course, a song library that waits for your fingers, and drills for reading, ',
        'rhythm and ear training. Use your mouse, your computer keyboard, or plug in a MIDI piano.'),
      h('div.hero__actions', null,
        h('a.btn.btn--primary.btn--large', { href: `#/lesson/${nextLesson.id}` },
          started ? 'Continue where you left off' : 'Start the first lesson'),
        h('a.btn.btn--ghost.btn--large', { href: '#/freeplay' }, 'Just let me play')),
      h('p.hero__hint', null,
        'Tip: the letter keys on your computer keyboard are mapped to the piano — press ',
        h('kbd', null, 'A'), ' through ', h('kbd', null, 'L'), ', or hold ', h('kbd', null, 'Space'),
        ' for the sustain pedal.')),

    started ? card('Your progress',
      h('div.stats', null,
        stat(`${done}/${LESSONS.length}`, 'Lessons complete'),
        stat(progress.streak, progress.streak === 1 ? 'Day streak' : 'Day streak'),
        stat(formatDuration(progress.data.practiceSeconds), 'Time at the keys'),
        stat(percent(progress.overallAccuracy), 'Drill accuracy')),
      h('a.card__link', { href: '#/progress' }, 'See the details →')) : null,

    h('section.grid.grid--features', null,
      FEATURES.map((feature) => h('a.feature', { href: `#${feature.path}` },
        h('h2.feature__title', null, feature.title),
        h('p.feature__blurb', null, feature.blurb),
        h('span.feature__meta', null, feature.meta())))),

    card('The course at a glance',
      h('ol.units', null, UNITS.map((unit, index) => {
        const lessons = lessonsInUnit(unit.id);
        const complete = lessons.filter((lesson) => progress.isLessonComplete(lesson.id)).length;
        return h('li.unit', { class: complete === lessons.length && lessons.length ? 'is-complete' : '' },
          h('span.unit__index', null, String(index + 1)),
          h('div.unit__body', null,
            h('h3.unit__title', null, unit.title),
            h('p.unit__blurb', null, unit.blurb)),
          h('span.unit__count', null, `${complete}/${lessons.length}`));
      }))),

    h('section.note', null,
      h('h2.note__title', null, 'How this works'),
      h('p.prose', null,
        'Everything runs in your browser. The piano sound is synthesised with the Web Audio API rather than ',
        'downloaded, there is no server, and your progress is stored locally on this device — so nothing you ',
        'play leaves your machine, and the whole thing keeps working with the network switched off.'),
      h('p.prose', null,
        'All the music in the song library is in the public domain.')),
  );

  app.setView(page, { title: 'Learn piano, free' });
}
