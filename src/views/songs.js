/** The song library, grouped by difficulty. */

import { h, percent } from '../ui.js';
import { SONGS, LEVEL_NAMES } from '../data/songs.js';

export function render(app) {
  const levels = [...new Set(SONGS.map((song) => song.level))].sort((a, b) => a - b);

  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, 'Songs'),
      h('p.page__lede', null,
        'Notes fall towards the keyboard. In wait mode the music pauses until you find the right key, so you ',
        'can learn a piece at whatever speed you actually play it. Everything here is public domain.')),

    levels.map((level) => h('section.unit-block', null,
      h('div.unit-block__head', null, h('h2.unit-block__title', null, LEVEL_NAMES[level] ?? `Level ${level}`)),
      h('div.grid.grid--songs', null, SONGS.filter((song) => song.level === level).map((song) => {
        const record = app.progress.song(song.id);
        return h('a.song-card', { href: `#/song/${song.id}` },
          h('div.song-card__head', null,
            h('h3.song-card__title', null, song.title),
            h('span.song-card__level', null, '●'.repeat(song.level) + '○'.repeat(4 - song.level))),
          h('p.song-card__composer', null, song.composer),
          h('p.song-card__about', null, song.about),
          h('div.song-card__meta', null,
            h('span', null, `${song.tempo} bpm`),
            h('span.song-card__dot', { 'aria-hidden': 'true' }, '·'),
            h('span', null, `${song.timeSignature[0]}/${song.timeSignature[1]}`),
            h('span.song-card__dot', { 'aria-hidden': 'true' }, '·'),
            h('span', null, song.voices.length > 1 ? 'Both hands' : 'One hand'),
            record.timesPlayed
              ? [h('span.song-card__dot', { 'aria-hidden': 'true' }, '·'),
                h('span.song-card__best', null, `best ${percent(record.bestAccuracy)}`)]
              : null));
      })))),
  );

  app.setView(page, { title: 'Songs' });
}
