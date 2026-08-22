/** The song library, split into repertoire and studies. */

import { h } from '../ui.js';
import { t } from '../i18n.js';
import { SONGS, STUDY_TAG } from '../data/songs.js';

export function render(app) {
  const repertoire = SONGS.filter((song) => !song.tags?.includes(STUDY_TAG));
  const studies = SONGS.filter((song) => song.tags?.includes(STUDY_TAG));
  const levels = [...new Set(repertoire.map((song) => song.level))].sort((a, b) => a - b);

  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, t('songsView.title')),
      h('p.page__lede', null, t('songsView.lede'))),

    levels.map((level) => h('section.unit-block', null,
      h('div.unit-block__head', null, h('h2.unit-block__title', null, t(`songsView.levels.${level}`))),
      h('div.grid.grid--songs', null, repertoire.filter((song) => song.level === level).map((song) => songCard(app, song))))),

    studies.length ? h('section.unit-block', null,
      h('div.unit-block__head', null, h('h2.unit-block__title', null, t('songsView.studies'))),
      h('div.grid.grid--songs', null, studies.map((song) => songCard(app, song)))) : null,
  );

  app.setView(page, { title: t('songsView.title') });
}

function songCard(app, song) {
  const record = app.progress.song(song.id);
  return h('a.song-card', { href: `#/song/${song.id}` },
    h('div.song-card__head', null,
      h('h3.song-card__title', null, t(`songs.${song.id}.title`)),
      h('span.song-card__level', { 'aria-hidden': 'true' }, '●'.repeat(song.level) + '○'.repeat(4 - song.level))),
    h('p.song-card__composer', null, t(`songs.${song.id}.composer`)),
    h('p.song-card__about', null, t(`songs.${song.id}.about`)),
    h('div.song-card__meta', null,
      h('span', null, `${app.i18n.number(song.tempo)} ${t('transport.bpm')}`),
      h('span.song-card__dot', { 'aria-hidden': 'true' }, '·'),
      h('span.song-card__sig', { dir: 'ltr' }, `${song.timeSignature[0]}/${song.timeSignature[1]}`),
      h('span.song-card__dot', { 'aria-hidden': 'true' }, '·'),
      h('span', null, song.voices.length > 1 ? t('songsView.bothHands') : t('songsView.oneHand')),
      record.timesPlayed
        ? [h('span.song-card__dot', { 'aria-hidden': 'true' }, '·'),
          h('span.song-card__best', null, t('songsView.best', { value: app.percent(record.bestAccuracy) }))]
        : null));
}
