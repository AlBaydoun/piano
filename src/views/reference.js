/** Look up any scale, chord or key: see it, hear it, find it on the keys. */

import { h, segmented, select, card } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { Staff } from '../staff.js';
import {
  SCALES, CHORDS, SHARP_NAMES, buildScale, buildChord, diatonicTriads,
  keySignatureFor, KEY_SIGNATURES, scaleUpAndDown, accidentalLetters, nameToMidi,
} from '../theory.js';

/** Conventional fingerings for the major scale, one octave, by tonic. */
const MAJOR_FINGERING = {
  C: { right: [1, 2, 3, 1, 2, 3, 4, 5], left: [5, 4, 3, 2, 1, 3, 2, 1] },
  G: { right: [1, 2, 3, 1, 2, 3, 4, 5], left: [5, 4, 3, 2, 1, 3, 2, 1] },
  D: { right: [1, 2, 3, 1, 2, 3, 4, 5], left: [5, 4, 3, 2, 1, 3, 2, 1] },
  A: { right: [1, 2, 3, 1, 2, 3, 4, 5], left: [5, 4, 3, 2, 1, 3, 2, 1] },
  E: { right: [1, 2, 3, 1, 2, 3, 4, 5], left: [5, 4, 3, 2, 1, 3, 2, 1] },
  B: { right: [1, 2, 3, 1, 2, 3, 4, 5], left: [4, 3, 2, 1, 4, 3, 2, 1] },
  F: { right: [1, 2, 3, 4, 1, 2, 3, 4], left: [5, 4, 3, 2, 1, 3, 2, 1] },
  'A#': { right: [4, 1, 2, 3, 1, 2, 3, 4], left: [3, 2, 1, 4, 3, 2, 1, 3] },
  'D#': { right: [3, 1, 2, 3, 4, 1, 2, 3], left: [3, 2, 1, 4, 3, 2, 1, 3] },
  'G#': { right: [3, 4, 1, 2, 3, 1, 2, 3], left: [3, 2, 1, 4, 3, 2, 1, 3] },
  'C#': { right: [2, 3, 1, 2, 3, 4, 1, 2], left: [3, 2, 1, 4, 3, 2, 1, 3] },
  'F#': { right: [2, 3, 4, 1, 2, 3, 1, 2], left: [4, 3, 2, 1, 3, 2, 1, 4] },
};

const KEY_TONICS = { C: 60, G: 67, D: 62, A: 69, E: 64, B: 71, 'F#': 66, 'C#': 61, F: 65, Bb: 70, Eb: 63, Ab: 68, Db: 61, Gb: 66, Cb: 59 };
const CIRCLE = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export function render(app) {
  let tab = 'scales';
  let root = 60;
  let scaleType = 'major';
  let chordType = 'major';
  let inversion = 0;
  let keyName = 'C';

  const rootOptions = () => SHARP_NAMES.map((_, index) => ({
    value: String(60 + index),
    label: app.noteName(60 + index, { short: true }),
  }));

  const body = h('div.reference__body');
  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, t('reference.title')),
      h('p.page__lede', null, t('reference.lede'))),
    segmented({
      label: '',
      value: tab,
      options: [
        { value: 'scales', label: t('reference.tabScales') },
        { value: 'chords', label: t('reference.tabChords') },
        { value: 'keys', label: t('reference.tabKeys') },
      ],
      onChange: (value) => {
        tab = value;
        draw();
      },
    }),
    body);

  function highlight(notes, { rootNote = null, fingers = null } = {}) {
    app.keyboard.clearMarks();
    app.keyboard.clearFingers();
    app.keyboard.ensureVisible(notes);
    app.keyboard.mark(notes, 'target');
    if (rootNote !== null) app.keyboard.mark(rootNote, 'root');
    if (fingers) notes.forEach((midi, i) => fingers[i] && app.keyboard.setFinger(midi, fingers[i]));
  }

  function staffFor(events, keySignature = 0, clef = 'treble') {
    const host = h('div.reference__staff');
    new Staff(host, { clef, keySignature, spacing: 16, events, minWidth: 320 });
    return host;
  }

  function drawScales() {
    const notes = buildScale(root, scaleType, { octaves: 1 });
    const scale = SCALES[scaleType];
    const englishRoot = SHARP_NAMES[root % 12];
    const fingering = scaleType === 'major' ? MAJOR_FINGERING[englishRoot] : null;
    highlight(notes, { rootNote: root, fingers: fingering?.right });

    body.replaceChildren(
      h('div.reference__controls', null,
        select({ label: t('reference.root'), value: String(root), options: rootOptions(), onChange: (value) => { root = Number(value); draw(); } }),
        select({
          label: t('reference.scale'),
          value: scaleType,
          options: Object.keys(SCALES).map((value) => ({ value, label: i18n.scaleName(value) })),
          onChange: (value) => { scaleType = value; draw(); },
        }),
        h('button.btn.btn--primary.btn--small', {
          type: 'button',
          onclick: () => app.engine.playSequence(scaleUpAndDown(root, scaleType, 1), { noteDuration: 0.34, gap: 0.02 }),
        }, t('actions.playUpDown'))),

      card(`${app.noteName(root, { short: true })} · ${i18n.scaleName(scaleType)}`,
        staffFor(notes.map((midi) => ({ midis: [midi], duration: 'quarter' })), 0),
        h('div.table-scroll', null, h('table.table', null,
          h('thead', null, h('tr', null, h('th', null, t('reference.degree')), notes.slice(0, -1).map((_, i) => h('th', { dir: 'ltr' }, scale.degrees[i])))),
          h('tbody', null,
            h('tr', null, h('th', null, t('reference.note')), notes.slice(0, -1).map((midi) => h('td', null, app.noteName(midi, { short: true })))),
            h('tr', null, h('th', null, t('reference.step')), notes.slice(0, -1).map((midi, i) => {
              const gap = notes[i + 1] - midi;
              return h('td', null, gap === 1 ? t('reference.halfStep') : gap === 2 ? t('reference.wholeStep') : t('reference.semitones', { n: gap }));
            }))))),
        fingering
          ? h('p.prose', null, t('reference.fingering', { right: fingering.right.join(' '), left: fingering.left.join(' ') }))
          : h('p.prose', null, t('reference.noFingering'))),
    );
  }

  function drawChords() {
    const notes = buildChord(root, chordType, { inversion });
    highlight(notes, { rootNote: notes.find((midi) => midi % 12 === root % 12) ?? root });
    const chord = CHORDS[chordType];

    body.replaceChildren(
      h('div.reference__controls', null,
        select({ label: t('reference.root'), value: String(root), options: rootOptions(), onChange: (value) => { root = Number(value); draw(); } }),
        select({
          label: t('reference.chord'),
          value: chordType,
          options: Object.keys(CHORDS).map((value) => ({ value, label: i18n.chordTypeName(value) })),
          onChange: (value) => { chordType = value; inversion = 0; draw(); },
        }),
        select({
          label: t('reference.inversion'),
          value: String(inversion),
          options: chord.steps.map((_, i) => ({ value: String(i), label: t(`music.inversions.${i}`) })),
          onChange: (value) => { inversion = Number(value); draw(); },
        }),
        h('button.btn.btn--primary.btn--small', { type: 'button', onclick: () => app.engine.playChord(notes, 1.8) }, t('actions.playChord')),
        h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => app.engine.playSequence(notes, { noteDuration: 0.4 }) }, t('actions.arpeggiate'))),

      card(i18n.chordSymbol(root, chordType),
        staffFor([{ midis: notes, duration: 'whole' }], 0, notes.some((m) => m < 57) ? 'grand' : 'treble'),
        h('p.prose', null, t('reference.chordNotes', {
          name: i18n.chordTypeName(chordType),
          notes: notes.map((midi) => app.noteName(midi, { octave: true })).join(' – '),
        })),
        h('p.prose', null, t('reference.chordBuilt', {
          intervals: chord.steps.slice(1).map((s) => t('reference.semitones', { n: s })).join(', '),
        }))),
    );
  }

  function drawKeys() {
    const signature = keySignatureFor(keyName);
    const tonicMidi = KEY_TONICS[keyName] ?? 60;
    const triads = diatonicTriads(tonicMidi, 'major');
    const letters = accidentalLetters(signature);
    const symbol = signature >= 0 ? '♯' : '♭';
    highlight(buildScale(tonicMidi, 'major'), { rootNote: tonicMidi });

    body.replaceChildren(
      h('div.reference__controls', null,
        select({
          label: t('reference.key'),
          value: keyName,
          options: Object.keys(KEY_SIGNATURES).map((value) => ({ value, label: i18n.keyName(value, 'major') })),
          onChange: (value) => { keyName = value; draw(); },
        })),

      card(i18n.keyName(keyName, 'major'),
        staffFor([], signature),
        h('p.prose', null, signature === 0
          ? t('reference.signatureNone')
          : t('reference.signatureList', {
            count: signature > 0
              ? t('keyTrainer.sharps', { count: letters.length, n: letters.length })
              : t('keyTrainer.flats', { count: letters.length, n: letters.length }),
            letters: letters.map((l) => app.noteName(nameToMidi(l), { short: true }) + symbol).join(', '),
          })),
        h('p.prose', null, t('reference.relativeMinor', {
          key: i18n.keyName(SHARP_NAMES[(tonicMidi + 9) % 12], 'minor'),
        }))),

      card(t('reference.chordsInKey'),
        h('div.chordgrid', null, triads.map((triad) => h('button.chordgrid__item', {
          type: 'button',
          onclick: () => {
            app.engine.playChord(triad.notes, 1.5);
            highlight(triad.notes, { rootNote: triad.root });
          },
        },
          h('span.chordgrid__numeral', { dir: 'ltr' }, triad.numeral),
          h('span.chordgrid__name', { dir: 'ltr' }, i18n.chordSymbol(triad.root, triad.type))))),
        h('p.prose', null, t('reference.chordsInKeyNote'))),

      card(t('reference.circleOfFifths'), circleOfFifths(app, keyName, (name) => { keyName = name; draw(); })),
    );
  }

  function draw() {
    if (tab === 'scales') drawScales();
    else if (tab === 'chords') drawChords();
    else drawKeys();
  }

  app.setView(page, { title: t('reference.title') });
  draw();

  return () => {
    app.keyboard.clearMarks();
    app.keyboard.clearFingers();
  };
}

function circleOfFifths(app, active, onPick) {
  const size = 300;
  const centre = size / 2;
  const wrap = h('div.circle');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'circle__svg');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', t('reference.circleOfFifths'));

  CIRCLE.forEach((name, index) => {
    const angle = (index / CIRCLE.length) * Math.PI * 2 - Math.PI / 2;
    const x = centre + Math.cos(angle) * 108;
    const y = centre + Math.sin(angle) * 108;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `circle__key ${name === active ? 'is-active' : ''}`);
    group.setAttribute('tabindex', '0');
    group.setAttribute('role', 'button');
    group.setAttribute('aria-label', i18n.keyName(name, 'major'));
    group.addEventListener('click', () => onPick(name));
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onPick(name);
      }
    });

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 26);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.textContent = app.noteName(nameToMidi(name), { short: true, flats: name.includes('b') });
    const count = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    count.setAttribute('x', x);
    count.setAttribute('y', y + 15);
    count.setAttribute('text-anchor', 'middle');
    count.setAttribute('class', 'circle__count');
    const signature = KEY_SIGNATURES[name];
    count.textContent = signature === 0 ? '' : `${Math.abs(signature)}${signature > 0 ? '♯' : '♭'}`;

    group.append(circle, label, count);
    svg.append(group);
  });

  wrap.append(svg, h('p.prose.circle__note', null, t('reference.circleNote')));
  return wrap;
}
