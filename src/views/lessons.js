/** Course overview: units, lessons, and what you have finished. */

import { h } from '../ui.js';
import { UNITS, LESSONS, lessonsInUnit } from '../data/lessons.js';

export function render(app) {
  const { progress } = app;
  const firstUnfinished = LESSONS.find((lesson) => !progress.isLessonComplete(lesson.id));

  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, 'Lessons'),
      h('p.page__lede', null,
        'Work through in order — each unit assumes the one before it. Every lesson ends when you have ',
        'played or answered everything in it, and you can redo any lesson at any time.')),

    UNITS.map((unit) => {
      const lessons = lessonsInUnit(unit.id);
      const complete = lessons.filter((lesson) => progress.isLessonComplete(lesson.id)).length;
      return h('section.unit-block', null,
        h('div.unit-block__head', null,
          h('h2.unit-block__title', null, unit.title),
          h('span.unit-block__count', {
            class: complete === lessons.length ? 'is-complete' : '',
          }, `${complete} of ${lessons.length}`)),
        h('p.unit-block__blurb', null, unit.blurb),
        h('ul.lesson-list', null, lessons.map((lesson) => {
          const done = progress.isLessonComplete(lesson.id);
          const isNext = firstUnfinished && lesson.id === firstUnfinished.id;
          return h('li', null, h('a.lesson-row', {
            href: `#/lesson/${lesson.id}`,
            class: [done ? 'is-complete' : '', isNext ? 'is-next' : ''].filter(Boolean).join(' '),
          },
            h('span.lesson-row__check', { 'aria-hidden': 'true' }, done ? '✓' : ''),
            h('div.lesson-row__body', null,
              h('span.lesson-row__title', null, lesson.title),
              h('span.lesson-row__summary', null, lesson.summary)),
            isNext ? h('span.lesson-row__badge', null, 'Up next') : null,
            h('span.lesson-row__steps', null, `${lesson.steps.length} steps`)));
        })));
    }),
  );

  app.setView(page, { title: 'Lessons' });
}
