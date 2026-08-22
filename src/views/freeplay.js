/** Just the piano — with live chord detection, a scale guide, and recording. */

import { h, select, templateNodes } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { Staff } from '../staff.js';
import { SCALES, SHARP_NAMES, identifyChord, intervalBetween, isInScale } from '../theory.js';

export function render(app) {
  let guideRoot = 60;
  let guideScale = 'none';
  let recording = null;
  let playback = null;
  let lastRecording = [];

  const chordName = h('div.freeplay__chord', { dir: 'ltr' }, '—');
  const chordNotes = h('div.freeplay__notes', null, t('freeplay.emptyHint'));
  const staffHost = h('div.freeplay__staff');
  const staff = new Staff(staffHost, { clef: 'grand', spacing: 14, minWidth: 300 });

  const recordButton = h('button.btn.btn--primary', { type: 'button', onclick: toggleRecord }, t('actions.record'));
  const playButton = h('button.btn.btn--ghost', { type: 'button', disabled: true, onclick: playRecording }, t('actions.playBack'));
  const recordStatus = h('span.freeplay__rec-status');

  const rootOptions = SHARP_NAMES.map((_, index) => ({
    value: String(60 + index),
    label: app.noteName(60 + index, { short: true }),
  }));

  const page = h('div.page.page--freeplay', null,
    h('header.page__header', null,
      h('h1.page__title', null, t('freeplay.title')),
      h('p.page__lede', null, templateNodes('freeplay.lede', {
        space: h('kbd', null, 'Space'),
        arrows: h('span.keys', { dir: 'ltr' }, h('kbd', null, '←'), h('kbd', null, '→')),
      }))),

    h('div.freeplay__grid', null,
      h('section.card', null,
        h('h2.card__title', null, t('freeplay.whatYouPlay')),
        chordName,
        chordNotes,
        staffHost),

      h('section.card', null,
        h('h2.card__title', null, t('freeplay.scaleGuide')),
        h('p.prose', null, t('freeplay.scaleGuideBlurb')),
        h('div.freeplay__controls', null,
          select({ label: t('reference.root'), value: String(guideRoot), options: rootOptions, onChange: (value) => { guideRoot = Number(value); applyGuide(); } }),
          select({
            label: t('reference.scale'),
            value: guideScale,
            options: [{ value: 'none', label: t('freeplay.guideOff') }, ...Object.keys(SCALES).map((value) => ({ value, label: i18n.scaleName(value) }))],
            onChange: (value) => { guideScale = value; applyGuide(); },
          }))),

      h('section.card', null,
        h('h2.card__title', null, t('freeplay.recordTitle')),
        h('p.prose', null, t('freeplay.recordBlurb')),
        h('div.freeplay__controls', null, recordButton, playButton, recordStatus))),
  );

  function applyGuide() {
    app.keyboard.clearMarks('ghost');
    app.keyboard.clearMarks('root');
    if (guideScale === 'none') return;
    for (let midi = app.keyboard.low; midi <= app.keyboard.high; midi += 1) {
      if (isInScale(midi, guideRoot, guideScale)) {
        app.keyboard.mark(midi, midi % 12 === guideRoot % 12 ? 'root' : 'ghost');
      }
    }
  }

  function updateChord() {
    const notes = [...app.sounding].sort((a, b) => a - b);
    if (!notes.length) {
      chordName.textContent = '—';
      chordNotes.textContent = t('freeplay.emptyHint');
      staff.setEvents([]);
      return;
    }
    staff.setEvents([{ midis: notes, duration: 'whole' }]);
    chordNotes.textContent = notes.map((midi) => app.noteName(midi, { octave: true })).join('   ');
    const identified = identifyChord(notes);
    if (identified) {
      const bass = app.noteName(notes[0], { short: true });
      const slash = identified.inversion > 0 ? `/${bass}` : '';
      chordName.textContent = `${i18n.chordSymbol(identified.root + 60, identified.type)}${slash}`;
    } else if (notes.length === 1) {
      chordName.textContent = app.noteName(notes[0], { octave: true });
    } else if (notes.length === 2) {
      chordName.textContent = i18n.intervalName(intervalBetween(notes[0], notes[1]).semitones);
    } else {
      chordName.textContent = t('freeplay.notAChord');
    }
  }

  function toggleRecord() {
    if (recording) {
      const events = recording.events;
      recording = null;
      recordButton.textContent = t('actions.record');
      recordButton.classList.remove('is-recording');
      playButton.disabled = events.length === 0;
      lastRecording = events;
      recordStatus.textContent = events.length
        ? t('freeplay.captured', { count: events.length, n: events.length })
        : t('freeplay.nothingCaptured');
    } else {
      recording = { startedAt: performance.now(), events: [] };
      recordButton.textContent = t('actions.stop');
      recordButton.classList.add('is-recording');
      recordStatus.textContent = t('freeplay.recording');
    }
  }

  function playRecording() {
    if (!lastRecording.length || playback) return;
    playButton.disabled = true;
    const timers = [];
    for (const event of lastRecording) {
      timers.push(setTimeout(() => {
        if (event.type === 'on') app.engine.noteOn(event.midi, { velocity: event.velocity, source: 'playback' });
        else app.engine.noteOff(event.midi, { source: 'playback' });
        app.keyboard.setActive(event.midi, event.type === 'on');
      }, event.time));
    }
    const total = lastRecording[lastRecording.length - 1].time + 600;
    timers.push(setTimeout(() => {
      playback = null;
      playButton.disabled = false;
      recordStatus.textContent = t('freeplay.captured', { count: lastRecording.length, n: lastRecording.length });
    }, total));
    playback = timers;
    recordStatus.textContent = t('freeplay.playingBack', { duration: app.duration(total / 1000) });
  }

  const unsubscribe = app.onNote((event) => {
    if (event.source === 'playback') return;
    if (recording) {
      recording.events.push({
        type: event.type,
        midi: event.midi,
        velocity: event.velocity ?? 0.8,
        time: performance.now() - recording.startedAt,
      });
    }
    updateChord();
  });

  app.setView(page, { title: t('freeplay.title') });
  applyGuide();
  updateChord();

  return () => {
    unsubscribe();
    if (playback) playback.forEach(clearTimeout);
    app.keyboard.clearMarks();
  };
}
