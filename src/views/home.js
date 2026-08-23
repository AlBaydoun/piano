/** Landing screen: what this is, where to start, and how you are doing. */

import { h, card, stat, templateNodes } from '../ui.js';
import { t } from '../i18n.js';
import { LESSONS, UNITS, lessonsInUnit } from '../data/lessons.js';
import { SONGS } from '../data/songs.js';

const FEATURES = ['lessons', 'songs', 'practice', 'reference', 'freeplay'];
const FEATURE_PATHS = {
  lessons: '/lessons', songs: '/songs', practice: '/practice',
  reference: '/reference', freeplay: '/freeplay',
};

export function render(app) {
  const { progress } = app;
  const nextLesson = LESSONS.find((lesson) => !progress.isLessonComplete(lesson.id)) ?? LESSONS[0];
  const done = progress.completedLessonCount;
  const started = done > 0 || progress.data.practiceSeconds > 0;

  const featureMeta = {
    lessons: t('home.features.lessons.meta', { lessons: LESSONS.length, units: UNITS.length }),
    songs: t('home.features.songs.meta', { count: SONGS.length }),
    practice: t('home.features.practice.meta'),
    reference: t('home.features.reference.meta'),
    freeplay: t('home.features.freeplay.meta'),
  };

  const page = h('div.page.page--home', null,
    h('section.hero', null,
      h('p.hero__eyebrow', null, t('home.eyebrow')),
      h('h1.hero__title', null, t('home.title')),
      h('p.hero__lede', null, t('home.lede')),
      h('div.hero__actions', null,
        h('a.btn.btn--primary.btn--large', { href: `#/lesson/${nextLesson.id}` },
          started ? t('home.continueCourse') : t('home.startCourse')),
        h('a.btn.btn--ghost.btn--large', { href: '#/freeplay' }, t('home.justPlay'))),
      h('p.hero__hint', null, templateNodes('home.hint', {
        keys: h('span.keys', { dir: 'ltr' }, h('kbd', null, 'A'), '–', h('kbd', null, 'L')),
        space: h('kbd', null, 'Space'),
      }))),

    started ? card(t('home.progressTitle'),
      h('div.stats', null,
        stat(`${app.i18n.number(done)}/${app.i18n.number(LESSONS.length)}`, t('stats.lessonsComplete')),
        stat(app.i18n.number(progress.streak), t('stats.dayStreak')),
        stat(app.duration(progress.data.practiceSeconds), t('stats.practiceTime')),
        stat(app.percent(progress.overallAccuracy), t('stats.drillAccuracy'))),
      h('a.card__link', { href: '#/progress' }, t('home.detailsLink'))) : null,

    h('section.grid.grid--features', null,
      FEATURES.map((key) => h('a.feature', { href: `#${FEATURE_PATHS[key]}` },
        h('h2.feature__title', null, t(`home.features.${key}.title`)),
        h('p.feature__blurb', null, t(`home.features.${key}.blurb`)),
        h('span.feature__meta', null, featureMeta[key])))),

    card(t('home.courseGlance'),
      h('ol.units', null, UNITS.map((unit, index) => {
        const lessons = lessonsInUnit(unit.id);
        const complete = lessons.filter((lesson) => progress.isLessonComplete(lesson.id)).length;
        return h('li.unit', { class: complete === lessons.length && lessons.length ? 'is-complete' : '' },
          h('span.unit__index', null, app.i18n.number(index + 1)),
          h('div.unit__body', null,
            h('h3.unit__title', null, t(`units.${unit.id}.title`)),
            h('p.unit__blurb', null, t(`units.${unit.id}.blurb`))),
          h('span.unit__count', null, `${app.i18n.number(complete)}/${app.i18n.number(lessons.length)}`));
      }))),

    h('section.note', null,
      h('h2.note__title', null, t('home.howItWorks')),
      h('p.prose', null, t('home.howItWorksBody')),
      h('p.prose', null, t('home.publicDomain'))),
  );

  app.setView(page, { title: t('app.tagline') });
}
