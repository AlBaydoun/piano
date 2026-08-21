/** Hub listing the practice drills, with each one's running score. */

import { h, percent } from '../ui.js';

const DRILLS = [
  {
    id: 'note-reading',
    path: '/practice/notes',
    title: 'Sight reading',
    blurb: 'A note appears on the staff; play it. Choose treble, bass or the grand staff, and set the range as wide as you dare.',
  },
  {
    id: 'ear-intervals',
    path: '/practice/ear',
    title: 'Ear training',
    blurb: 'Hear two notes, a chord, or a short melody and identify what you heard. The single best use of ten minutes a day.',
  },
  {
    id: 'chord-recognition',
    path: '/practice/chords',
    title: 'Chord building',
    blurb: 'You are given a chord symbol; play it. Triads, sevenths and inversions, at whatever difficulty you pick.',
  },
  {
    id: 'key-signatures',
    path: '/practice/keys',
    title: 'Key signatures',
    blurb: 'Name the key from its signature, or count the sharps and flats from the key. Pure recall, quickly learned.',
  },
];

export function render(app) {
  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, 'Practice drills'),
      h('p.page__lede', null,
        'Short, repeatable exercises. Each one keeps a running accuracy and best streak, stored on this device.')),
    h('div.grid.grid--drills', null, DRILLS.map((drill) => {
      const record = app.progress.drill(drill.id);
      return h('a.drill-card', { href: `#${drill.path}` },
        h('h2.drill-card__title', null, drill.title),
        h('p.drill-card__blurb', null, drill.blurb),
        record.attempts
          ? h('div.drill-card__stats', null,
            h('span', null, `${percent(record.correct / record.attempts)} correct`),
            h('span.drill-card__dot', { 'aria-hidden': 'true' }, '·'),
            h('span', null, `${record.attempts} attempts`),
            h('span.drill-card__dot', { 'aria-hidden': 'true' }, '·'),
            h('span', null, `best streak ${record.bestStreak}`))
          : h('div.drill-card__stats', null, h('span.is-muted', null, 'Not tried yet')));
    })),
  );
  app.setView(page, { title: 'Practice' });
}
