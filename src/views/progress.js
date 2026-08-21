/** Everything the app knows about you — and the controls to change or delete it. */

import { h, card, stat, formatDuration, percent, toast, select } from '../ui.js';
import { LESSONS, UNITS, lessonsInUnit } from '../data/lessons.js';
import { SONGS } from '../data/songs.js';
import { RANGE_OPTIONS } from '../app.js';

const DRILL_NAMES = {
  'note-reading': 'Sight reading',
  'ear-intervals': 'Ear training',
  'chord-recognition': 'Chord building',
  'key-signatures': 'Key signatures',
};

export function render(app) {
  const { progress, settings } = app;

  function build() {
    const activity = progress.recentActivity(84);
    const playedSongs = SONGS.filter((song) => progress.song(song.id).timesPlayed > 0);
    const drills = Object.entries(progress.data.drills).filter(([, record]) => record.attempts > 0);

    return h('div.page', null,
      h('header.page__header', null,
        h('h1.page__title', null, 'Progress'),
        h('p.page__lede', null,
          'Stored in this browser only. Nothing is uploaded anywhere, which also means clearing your browser ',
          'data clears this — use the export button below if you want a copy.')),

      h('div.stats.stats--wide', null,
        stat(`${progress.completedLessonCount}/${LESSONS.length}`, 'Lessons complete'),
        stat(progress.streak, 'Day streak'),
        stat(formatDuration(progress.data.practiceSeconds), 'Total practice'),
        stat(progress.overallAccuracy ? percent(progress.overallAccuracy) : '—', 'Drill accuracy'),
        stat(playedSongs.length, 'Songs attempted')),

      card('Practice, last twelve weeks', heatmap(activity)),

      card('Course',
        h('ul.progress-units', null, UNITS.map((unit) => {
          const lessons = lessonsInUnit(unit.id);
          const complete = lessons.filter((lesson) => progress.isLessonComplete(lesson.id)).length;
          return h('li.progress-unit', null,
            h('div.progress-unit__head', null,
              h('span.progress-unit__title', null, unit.title),
              h('span.progress-unit__count', null, `${complete} / ${lessons.length}`)),
            h('div.progress-unit__bar', null,
              h('div.progress-unit__fill', { style: { width: `${lessons.length ? (complete / lessons.length) * 100 : 0}%` } })));
        }))),

      card('Drills', drills.length
        ? h('table.table', null,
          h('thead', null, h('tr', null,
            h('th', null, 'Drill'), h('th', null, 'Attempts'), h('th', null, 'Accuracy'), h('th', null, 'Best streak'))),
          h('tbody', null, drills.map(([id, record]) => h('tr', null,
            h('td', null, DRILL_NAMES[id] ?? id),
            h('td', null, String(record.attempts)),
            h('td', null, percent(record.correct / record.attempts)),
            h('td', null, String(record.bestStreak))))))
        : h('p.prose', null, 'No drills played yet. ', h('a', { href: '#/practice' }, 'Pick one'), '.')),

      card('Songs', playedSongs.length
        ? h('table.table', null,
          h('thead', null, h('tr', null, h('th', null, 'Song'), h('th', null, 'Plays'), h('th', null, 'Best accuracy'))),
          h('tbody', null, playedSongs.map((song) => {
            const record = progress.song(song.id);
            return h('tr', null,
              h('td', null, h('a', { href: `#/song/${song.id}` }, song.title)),
              h('td', null, String(record.timesPlayed)),
              h('td', null, percent(record.bestAccuracy)));
          })))
        : h('p.prose', null, 'No songs played yet. ', h('a', { href: '#/songs' }, 'Browse the library'), '.')),

      card('Settings',
        h('div.settings', null,
          select({
            label: 'Key labels',
            value: settings.get('showNoteNames'),
            options: [
              { value: 'never', label: 'No labels' },
              { value: 'c-only', label: 'Label C only' },
              { value: 'always', label: 'Label white keys' },
              { value: 'all', label: 'Label every key' },
            ],
            onChange: (value) => {
              settings.set('showNoteNames', value);
              app.keyboard.setLabels(value);
            },
          }),
          select({
            label: 'Label style',
            value: settings.get('labelStyle'),
            options: [{ value: 'letters', label: 'Letters (C D E)' }, { value: 'solfege', label: 'Solfège (Do Re Mi)' }],
            onChange: (value) => {
              settings.set('labelStyle', value);
              app.keyboard.setLabelStyle(value);
            },
          }),
          select({
            label: 'Keyboard size',
            value: settings.get('keyboardRange'),
            options: RANGE_OPTIONS,
            onChange: (value) => {
              settings.set('keyboardRange', value);
              const range = app.resolvedRange();
              app.keyboard.setRange(range.low, range.high);
            },
          }))),

      card('Your data',
        h('p.prose', null,
          'Progress lives in this browser\'s local storage. Export it to move to another device or keep a backup.'),
        h('div.settings__actions', null,
          h('button.btn.btn--ghost', { type: 'button', onclick: exportData }, 'Export progress'),
          h('label.btn.btn--ghost', null, 'Import progress',
            h('input', {
              type: 'file',
              accept: 'application/json',
              class: 'sr-only',
              onchange: (event) => importData(event.target.files?.[0]),
            })),
          h('button.btn.btn--danger', { type: 'button', onclick: resetData }, 'Reset everything'))),
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
    toast('Progress exported', { tone: 'good' });
  }

  async function importData(file) {
    if (!file) return;
    try {
      progress.import(await file.text());
      toast('Progress imported', { tone: 'good' });
      app.setView(build(), { title: 'Progress' });
    } catch (error) {
      toast(`Could not read that file: ${error.message}`, { tone: 'warn', duration: 5000 });
    }
  }

  function resetData() {
    if (!window.confirm('Delete all lessons, drills and practice history on this device? This cannot be undone.')) return;
    progress.reset();
    toast('Progress reset');
    app.setView(build(), { title: 'Progress' });
  }

  app.setView(build(), { title: 'Progress' });
}

/** Twelve weeks of practice, one square per day. */
function heatmap(activity) {
  const max = Math.max(600, ...activity.map((day) => day.seconds));
  const grid = h('div.heatmap', { role: 'img', 'aria-label': 'Daily practice for the last twelve weeks' });
  for (const day of activity) {
    const intensity = day.seconds === 0 ? 0 : Math.min(4, Math.ceil((day.seconds / max) * 4));
    grid.append(h('span.heatmap__cell', {
      dataset: { level: String(intensity) },
      title: `${day.date}: ${day.seconds ? formatDuration(day.seconds) : 'no practice'}`,
    }));
  }
  return h('div', null, grid, h('div.heatmap__legend', null,
    h('span', null, 'Less'),
    [0, 1, 2, 3, 4].map((level) => h('span.heatmap__cell', { dataset: { level: String(level) } })),
    h('span', null, 'More')));
}
