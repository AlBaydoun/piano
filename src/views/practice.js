/** Hub listing the practice drills, with each one's running score. */

import { h } from '../ui.js';
import { t } from '../i18n.js';

const DRILLS = [
  { id: 'note-reading', path: '/practice/notes' },
  { id: 'ear-intervals', path: '/practice/ear' },
  { id: 'chord-recognition', path: '/practice/chords' },
  { id: 'key-signatures', path: '/practice/keys' },
];

export function render(app) {
  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, t('practice.title')),
      h('p.page__lede', null, t('practice.lede'))),
    h('div.grid.grid--drills', null, DRILLS.map((drill) => {
      const record = app.progress.drill(drill.id);
      return h('a.drill-card', { href: `#${drill.path}` },
        h('h2.drill-card__title', null, t(`practice.drills.${drill.id}.title`)),
        h('p.drill-card__blurb', null, t(`practice.drills.${drill.id}.blurb`)),
        record.attempts
          ? h('div.drill-card__stats', null,
            h('span', null, t('practice.correctCount', { value: app.percent(record.correct / record.attempts) })),
            h('span.drill-card__dot', { 'aria-hidden': 'true' }, '·'),
            h('span', null, t('practice.attempts', { count: record.attempts, n: record.attempts })),
            h('span.drill-card__dot', { 'aria-hidden': 'true' }, '·'),
            h('span', null, t('practice.bestStreakShort', { n: record.bestStreak })))
          : h('div.drill-card__stats', null, h('span.is-muted', null, t('practice.notTried'))));
    })),
  );
  app.setView(page, { title: t('practice.title') });
}
