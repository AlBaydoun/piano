/** Course overview: units, lessons, and what you have finished. */

import { h } from '../ui.js';
import { t } from '../i18n.js';
import { UNITS, LESSONS, lessonsInUnit } from '../data/lessons.js';

export function render(app) {
  const { progress } = app;
  const firstUnfinished = LESSONS.find((lesson) => !progress.isLessonComplete(lesson.id));

  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, t('lessonsView.title')),
      h('p.page__lede', null, t('lessonsView.lede'))),

    UNITS.map((unit) => {
      const lessons = lessonsInUnit(unit.id);
      const complete = lessons.filter((lesson) => progress.isLessonComplete(lesson.id)).length;
      return h('section.unit-block', null,
        h('div.unit-block__head', null,
          h('h2.unit-block__title', null, t(`units.${unit.id}.title`)),
          h('span.unit-block__count', {
            class: complete === lessons.length ? 'is-complete' : '',
          }, t('lessonsView.ofCount', { done: complete, total: lessons.length }))),
        h('p.unit-block__blurb', null, t(`units.${unit.id}.blurb`)),
        h('ul.lesson-list', null, lessons.map((lesson) => {
          const doneLesson = progress.isLessonComplete(lesson.id);
          const isNext = firstUnfinished && lesson.id === firstUnfinished.id;
          return h('li', null, h('a.lesson-row', {
            href: `#/lesson/${lesson.id}`,
            class: [doneLesson ? 'is-complete' : '', isNext ? 'is-next' : ''].filter(Boolean).join(' '),
          },
            h('span.lesson-row__check', { 'aria-hidden': 'true' }, doneLesson ? '✓' : ''),
            h('div.lesson-row__body', null,
              h('span.lesson-row__title', null, t(`course.${lesson.id}.title`)),
              h('span.lesson-row__summary', null, t(`course.${lesson.id}.summary`))),
            isNext ? h('span.lesson-row__badge', null, t('lessonsView.upNext')) : null,
            h('span.lesson-row__steps', null, t('lessonsView.steps', { count: lesson.steps.length, n: lesson.steps.length }))));
        })));
    }),
  );

  app.setView(page, { title: t('lessonsView.title') });
}
