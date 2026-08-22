/** Everything the app knows about you — and the controls to change or delete it. */

import { h, card, stat, toast, select } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { LESSONS, UNITS, lessonsInUnit } from '../data/lessons.js';
import { SONGS } from '../data/songs.js';
import { labelOptions, noteSystemOptions, rangeOptions } from '../app.js';

const DRILL_KEYS = ['note-reading', 'ear-intervals', 'chord-recognition', 'key-signatures'];

export function render(app) {
  const { progress, settings } = app;

  function build() {
    const activity = progress.recentActivity(84);
    const playedSongs = SONGS.filter((song) => progress.song(song.id).timesPlayed > 0);
    const drills = Object.entries(progress.data.drills).filter(([, record]) => record.attempts > 0);

    return h('div.page', null,
      h('header.page__header', null,
        h('h1.page__title', null, t('progress.title')),
        h('p.page__lede', null, t('progress.lede'))),

      h('div.stats.stats--wide', null,
        stat(`${i18n.number(progress.completedLessonCount)}/${i18n.number(LESSONS.length)}`, t('stats.lessonsComplete')),
        stat(i18n.number(progress.streak), t('stats.dayStreak')),
        stat(app.duration(progress.data.practiceSeconds), t('stats.totalPractice')),
        stat(progress.overallAccuracy ? app.percent(progress.overallAccuracy) : '—', t('stats.drillAccuracy')),
        stat(i18n.number(playedSongs.length), t('stats.songsAttempted'))),

      card(t('progress.heatmap'), heatmap(app, activity)),

      card(t('progress.course'),
        h('ul.progress-units', null, UNITS.map((unit) => {
          const lessons = lessonsInUnit(unit.id);
          const complete = lessons.filter((lesson) => progress.isLessonComplete(lesson.id)).length;
          return h('li.progress-unit', null,
            h('div.progress-unit__head', null,
              h('span.progress-unit__title', null, t(`units.${unit.id}.title`)),
              h('span.progress-unit__count', null, t('lessonsView.ofCount', { done: complete, total: lessons.length }))),
            h('div.progress-unit__bar', null,
              h('div.progress-unit__fill', { style: { width: `${lessons.length ? (complete / lessons.length) * 100 : 0}%` } })));
        }))),

      card(t('progress.drills'), drills.length
        ? h('div.table-scroll', null, h('table.table', null,
          h('thead', null, h('tr', null,
            h('th', null, t('progress.drill')), h('th', null, t('progress.attempts')),
            h('th', null, t('progress.accuracy')), h('th', null, t('progress.bestStreak')))),
          h('tbody', null, drills.map(([id, record]) => h('tr', null,
            h('td', null, DRILL_KEYS.includes(id) ? t(`practice.drills.${id}.title`) : id),
            h('td', null, i18n.number(record.attempts)),
            h('td', null, app.percent(record.correct / record.attempts)),
            h('td', null, i18n.number(record.bestStreak)))))))
        : h('p.prose', null, `${t('progress.noDrills')} `, h('a', { href: '#/practice' }, t('progress.pickOne')))),

      card(t('progress.songs'), playedSongs.length
        ? h('div.table-scroll', null, h('table.table', null,
          h('thead', null, h('tr', null,
            h('th', null, t('progress.song')), h('th', null, t('progress.plays')), h('th', null, t('progress.bestAccuracy')))),
          h('tbody', null, playedSongs.map((song) => {
            const record = progress.song(song.id);
            return h('tr', null,
              h('td', null, h('a', { href: `#/song/${song.id}` }, t(`songs.${song.id}.title`))),
              h('td', null, i18n.number(record.timesPlayed)),
              h('td', null, app.percent(record.bestAccuracy)));
          }))))
        : h('p.prose', null, `${t('progress.noSongs')} `, h('a', { href: '#/songs' }, t('progress.browseLibrary')))),

      card(t('progress.settings'),
        h('div.settings', null,
          select({
            label: t('dock.labels'),
            value: settings.get('showNoteNames'),
            options: labelOptions(),
            onChange: (value) => {
              settings.set('showNoteNames', value);
              app.keyboard.setLabels(value);
            },
          }),
          select({
            label: t('noteSystems.label'),
            value: settings.get('noteSystem'),
            options: noteSystemOptions(),
            onChange: (value) => app.setNoteSystem(value),
          }),
          select({
            label: t('progress.keyboardSize'),
            value: settings.get('keyboardRange'),
            options: rangeOptions(),
            onChange: (value) => {
              settings.set('keyboardRange', value);
              const range = app.resolvedRange();
              app.keyboard.setRange(range.low, range.high);
            },
          }))),

      card(t('progress.yourData'),
        h('p.prose', null, t('progress.dataBlurb')),
        h('div.settings__actions', null,
          h('button.btn.btn--ghost', { type: 'button', onclick: exportData }, t('actions.export')),
          h('label.btn.btn--ghost', null, t('actions.import'),
            h('input', {
              type: 'file',
              accept: 'application/json',
              class: 'sr-only',
              onchange: (event) => importData(event.target.files?.[0]),
            })),
          h('button.btn.btn--danger', { type: 'button', onclick: resetData }, t('actions.reset')))),
    );
  }

  function exportData() {
    const blob = new Blob([progress.export()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = h('a', { href: url, download: 'open-piano-progress.json' });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(t('progress.exported'), { tone: 'good' });
  }

  async function importData(file) {
    if (!file) return;
    try {
      progress.import(await file.text());
      toast(t('progress.imported'), { tone: 'good' });
      app.setView(build(), { title: t('progress.title') });
    } catch (error) {
      toast(t('progress.importFailed', { message: error.message }), { tone: 'warn', duration: 5000 });
    }
  }

  function resetData() {
    if (!window.confirm(t('progress.resetConfirm'))) return;
    progress.reset();
    toast(t('progress.resetDone'));
    app.setView(build(), { title: t('progress.title') });
  }

  app.setView(build(), { title: t('progress.title') });
}

/** Twelve weeks of practice, one square per day. */
function heatmap(app, activity) {
  const max = Math.max(600, ...activity.map((day) => day.seconds));
  const grid = h('div.heatmap', { role: 'img', 'aria-label': t('progress.heatmapLabel'), dir: 'ltr' });
  for (const day of activity) {
    const intensity = day.seconds === 0 ? 0 : Math.min(4, Math.ceil((day.seconds / max) * 4));
    grid.append(h('span.heatmap__cell', {
      dataset: { level: String(intensity) },
      title: `${i18n.date(day.date)}: ${day.seconds ? app.duration(day.seconds) : t('progress.noPractice')}`,
    }));
  }
  return h('div', null, grid, h('div.heatmap__legend', null,
    h('span', null, t('progress.less')),
    [0, 1, 2, 3, 4].map((level) => h('span.heatmap__cell', { dataset: { level: String(level) } })),
    h('span', null, t('progress.more'))));
}
