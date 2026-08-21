/** Just the piano — with live chord detection, a scale guide, and recording. */

import { h, select, formatDuration } from '../ui.js';
import { Staff } from '../staff.js';
import {
  SCALES, SHARP_NAMES, identifyChord, intervalBetween, midiToName, isInScale,
} from '../theory.js';

const ROOTS = SHARP_NAMES.map((name, index) => ({ value: String(60 + index), label: name }));

export function render(app) {
  let guideRoot = 60;
  let guideScale = 'none';
  let recording = null;
  let playback = null;

  const chordName = h('div.freeplay__chord', null, '—');
  const chordNotes = h('div.freeplay__notes', null, 'Play three or more notes together and the chord is named here.');
  const staffHost = h('div.freeplay__staff');
  const staff = new Staff(staffHost, { clef: 'grand', spacing: 13, minWidth: 300 });

  const recordButton = h('button.btn.btn--primary', { type: 'button', onclick: toggleRecord }, 'Record');
  const playButton = h('button.btn.btn--ghost', { type: 'button', disabled: true, onclick: playRecording }, 'Play back');
  const recordStatus = h('span.freeplay__rec-status');

  const page = h('div.page.page--freeplay', null,
    h('header.page__header', null,
      h('h1.page__title', null, 'Free play'),
      h('p.page__lede', null,
        'Nothing is being scored here. Use the mouse, your computer keyboard (', h('kbd', null, 'Z'), '–',
        h('kbd', null, 'M'), ' and ', h('kbd', null, 'Q'), '–', h('kbd', null, 'P'), '), or a MIDI piano. ',
        'Hold ', h('kbd', null, 'Space'), ' for sustain, and use ', h('kbd', null, '←'), h('kbd', null, '→'),
        ' to shift the computer keyboard by an octave.')),

    h('div.freeplay__grid', null,
      h('section.card', null,
        h('h2.card__title', null, 'What you are playing'),
        chordName,
        chordNotes,
        staffHost),

      h('section.card', null,
        h('h2.card__title', null, 'Scale guide'),
        h('p.prose', null, 'Highlight the notes of a scale on the keyboard so you can improvise without hitting anything sour.'),
        h('div.freeplay__controls', null,
          select({ label: 'Root', value: String(guideRoot), options: ROOTS, onChange: (value) => { guideRoot = Number(value); applyGuide(); } }),
          select({
            label: 'Scale',
            value: guideScale,
            options: [{ value: 'none', label: 'Off' }, ...Object.entries(SCALES).map(([value, config]) => ({ value, label: config.name }))],
            onChange: (value) => { guideScale = value; applyGuide(); },
          }))),

      h('section.card', null,
        h('h2.card__title', null, 'Record'),
        h('p.prose', null, 'Capture what you play and hear it back. Recordings live in this tab only — reloading clears them.'),
        h('div.freeplay__controls', null, recordButton, playButton, recordStatus))),
  );

  function applyGuide() {
    app.keyboard.clearMarks('ghost');
    app.keyboard.clearMarks('root');
    if (guideScale === 'none') return;
    const low = app.keyboard.low;
    const high = app.keyboard.high;
    for (let midi = low; midi <= high; midi += 1) {
      if (isInScale(midi, guideRoot, guideScale)) {
        app.keyboard.mark(midi, midi % 12 === guideRoot % 12 ? 'root' : 'ghost');
      }
    }
  }

  function updateChord() {
    const notes = [...app.sounding].sort((a, b) => a - b);
    if (!notes.length) {
      chordName.textContent = '—';
      chordNotes.textContent = 'Play three or more notes together and the chord is named here.';
      staff.setEvents([]);
      return;
    }
    staff.setEvents([{ midis: notes, duration: 'whole' }]);
    chordNotes.textContent = notes.map((midi) => midiToName(midi)).join('   ');
    const identified = identifyChord(notes);
    if (identified) {
      const bass = midiToName(notes[0], { octave: false });
      const slash = identified.inversion > 0 ? `/${bass}` : '';
      chordName.textContent = `${identified.name}${slash}`;
    } else if (notes.length === 1) {
      chordName.textContent = midiToName(notes[0]);
    } else if (notes.length === 2) {
      const interval = intervalBetween(notes[0], notes[1]);
      chordName.textContent = interval.name;
    } else {
      chordName.textContent = 'Not a standard chord';
    }
  }

  function toggleRecord() {
    if (recording) {
      const events = recording.events;
      recording = null;
      recordButton.textContent = 'Record';
      recordButton.classList.remove('is-recording');
      playButton.disabled = events.length === 0;
      lastRecording = events;
      recordStatus.textContent = events.length ? `${events.length} notes captured` : 'Nothing captured';
    } else {
      recording = { startedAt: performance.now(), events: [] };
      recordButton.textContent = 'Stop';
      recordButton.classList.add('is-recording');
      recordStatus.textContent = 'Recording…';
    }
  }

  let lastRecording = [];

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
      recordStatus.textContent = `${lastRecording.length} notes captured`;
    }, total));
    playback = timers;
    recordStatus.textContent = `Playing back — ${formatDuration(total / 1000)}`;
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

  app.setView(page, { title: 'Free play' });
  applyGuide();
  updateChord();

  return () => {
    unsubscribe();
    if (playback) playback.forEach(clearTimeout);
    app.keyboard.clearMarks();
  };
}
