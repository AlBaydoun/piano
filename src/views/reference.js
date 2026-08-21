/** Look up any scale, chord or key: see it, hear it, find it on the keys. */

import { h, segmented, select, card } from '../ui.js';
import { Staff } from '../staff.js';
import {
  SCALES, CHORDS, SHARP_NAMES, buildScale, buildChord, chordName, diatonicTriads,
  midiToName, keySignatureFor, KEY_SIGNATURES, scaleUpAndDown, accidentalLetters,
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

const ROOTS = SHARP_NAMES.map((name, index) => ({ value: String(60 + index), label: name }));

export function render(app) {
  let tab = 'scales';
  let root = 60;
  let scaleType = 'major';
  let chordType = 'major';
  let inversion = 0;
  let keyName = 'C';

  const body = h('div.reference__body');
  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, 'Reference'),
      h('p.page__lede', null, 'Pick anything below and it lights up on the keyboard. Press play to hear it.')),
    segmented({
      label: '',
      value: tab,
      options: [
        { value: 'scales', label: 'Scales' },
        { value: 'chords', label: 'Chords' },
        { value: 'keys', label: 'Keys' },
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
    new Staff(host, { clef, keySignature, spacing: 15, events, minWidth: 320 });
    return host;
  }

  function drawScales() {
    const notes = buildScale(root, scaleType, { octaves: 1 });
    const scale = SCALES[scaleType];
    const rootName = midiToName(root, { octave: false });
    const fingering = scaleType === 'major' ? MAJOR_FINGERING[rootName] : null;
    highlight(notes, { rootNote: root, fingers: fingering?.right });

    body.replaceChildren(
      h('div.reference__controls', null,
        select({ label: 'Root', value: String(root), options: ROOTS, onChange: (value) => { root = Number(value); draw(); } }),
        select({
          label: 'Scale',
          value: scaleType,
          options: Object.entries(SCALES).map(([value, config]) => ({ value, label: config.name })),
          onChange: (value) => { scaleType = value; draw(); },
        }),
        h('button.btn.btn--primary.btn--small', {
          type: 'button',
          onclick: () => app.engine.playSequence(scaleUpAndDown(root, scaleType, 1), { noteDuration: 0.34, gap: 0.02 }),
        }, 'Play up and down')),

      card(`${rootName} ${scale.name}`,
        staffFor(notes.map((midi) => ({ midis: [midi], duration: 'quarter' })), 0),
        h('table.table', null,
          h('thead', null, h('tr', null, h('th', null, 'Degree'), notes.slice(0, -1).map((_, i) => h('th', null, scale.degrees[i])))),
          h('tbody', null,
            h('tr', null, h('th', null, 'Note'), notes.slice(0, -1).map((midi) => h('td', null, midiToName(midi, { octave: false })))),
            h('tr', null, h('th', null, 'Step'), notes.slice(0, -1).map((midi, i) => {
              const gap = notes[i + 1] - midi;
              return h('td', null, gap === 1 ? 'half' : gap === 2 ? 'whole' : `${gap} semitones`);
            })))),
        fingering
          ? h('p.prose', null,
            `Standard fingering — right hand ${fingering.right.join(' ')}, left hand ${fingering.left.join(' ')}. `,
            'Numbers appear on the keys below.')
          : h('p.prose', null, 'Fingering for this scale depends on context; start from the major-scale pattern and adjust so the thumb never lands on a black key.')),
    );
  }

  function drawChords() {
    const notes = buildChord(root, chordType, { inversion });
    highlight(notes, { rootNote: notes.find((midi) => midi % 12 === root % 12) ?? root });
    const chord = CHORDS[chordType];
    const intervalsFromRoot = chord.steps.map((step) => step);

    body.replaceChildren(
      h('div.reference__controls', null,
        select({ label: 'Root', value: String(root), options: ROOTS, onChange: (value) => { root = Number(value); draw(); } }),
        select({
          label: 'Chord',
          value: chordType,
          options: Object.entries(CHORDS).map(([value, config]) => ({ value, label: config.name })),
          onChange: (value) => { chordType = value; inversion = 0; draw(); },
        }),
        select({
          label: 'Inversion',
          value: String(inversion),
          options: chord.steps.map((_, i) => ({ value: String(i), label: i === 0 ? 'Root position' : `${['', '1st', '2nd', '3rd', '4th'][i]} inversion` })),
          onChange: (value) => { inversion = Number(value); draw(); },
        }),
        h('button.btn.btn--primary.btn--small', { type: 'button', onclick: () => app.engine.playChord(notes, 1.8) }, 'Play chord'),
        h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => app.engine.playSequence(notes, { noteDuration: 0.4 }) }, 'Arpeggiate')),

      card(chordName(root, chordType),
        staffFor([{ midis: notes, duration: 'whole' }], 0, notes.some((m) => m < 57) ? 'grand' : 'treble'),
        h('p.prose', null,
          `${chord.name}. Notes: ${notes.map((midi) => midiToName(midi)).join(' – ')}.`),
        h('p.prose', null,
          `Built from the root by stacking intervals of ${intervalsFromRoot.slice(1).map((s) => `${s} semitones`).join(', ')}.`)),
    );
  }

  function drawKeys() {
    const signature = keySignatureFor(keyName);
    const tonic = 60 + (SHARP_NAMES.indexOf(keyName.replace('b', '#')) >= 0 ? 0 : 0);
    const tonicMidi = keyTonicMidi(keyName);
    const triads = diatonicTriads(tonicMidi, 'major');
    const letters = accidentalLetters(signature);
    highlight(buildScale(tonicMidi, 'major'), { rootNote: tonicMidi });

    body.replaceChildren(
      h('div.reference__controls', null,
        select({
          label: 'Key',
          value: keyName,
          options: Object.keys(KEY_SIGNATURES).map((value) => ({ value, label: `${value} major` })),
          onChange: (value) => { keyName = value; draw(); },
        })),

      card(`${keyName} major`,
        staffFor([], signature),
        h('p.prose', null, signature === 0
          ? 'No sharps or flats.'
          : `${letters.length} ${signature > 0 ? 'sharp' : 'flat'}${letters.length === 1 ? '' : 's'}: ${letters.map((l) => l + (signature > 0 ? '♯' : '♭')).join(', ')}.`),
        h('p.prose', null, `Relative minor: ${midiToName(tonicMidi + 9, { octave: false, flats: signature < 0 })} minor — same key signature, different tonic.`)),

      card('Chords in this key',
        h('div.chordgrid', null, triads.map((triad) => h('button.chordgrid__item', {
          type: 'button',
          onclick: () => {
            app.engine.playChord(triad.notes, 1.5);
            highlight(triad.notes, { rootNote: triad.root });
          },
        },
          h('span.chordgrid__numeral', null, triad.numeral),
          h('span.chordgrid__name', null, triad.name)))),
        h('p.prose', null,
          'Uppercase numerals are major chords, lowercase are minor, and the ° is diminished. ',
          'I, IV and V are the three that do most of the work.')),

      card('Circle of fifths', circleOfFifths(keyName, (name) => { keyName = name; draw(); })),
    );
  }

  function draw() {
    if (tab === 'scales') drawScales();
    else if (tab === 'chords') drawChords();
    else drawKeys();
  }

  app.setView(page, { title: 'Reference' });
  draw();

  return () => {
    app.keyboard.clearMarks();
    app.keyboard.clearFingers();
  };
}

const KEY_TONICS = { C: 60, G: 67, D: 62, A: 69, E: 64, B: 71, 'F#': 66, 'C#': 61, F: 65, Bb: 70, Eb: 63, Ab: 68, Db: 61, Gb: 66, Cb: 59 };
function keyTonicMidi(name) {
  return KEY_TONICS[name] ?? 60;
}

const CIRCLE = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

function circleOfFifths(active, onPick) {
  const size = 300;
  const centre = size / 2;
  const wrap = h('div.circle');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'circle__svg');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Circle of fifths');

  CIRCLE.forEach((name, index) => {
    const angle = (index / CIRCLE.length) * Math.PI * 2 - Math.PI / 2;
    const x = centre + Math.cos(angle) * 108;
    const y = centre + Math.sin(angle) * 108;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `circle__key ${name === active ? 'is-active' : ''}`);
    group.setAttribute('tabindex', '0');
    group.setAttribute('role', 'button');
    group.setAttribute('aria-label', `${name} major`);
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
    label.textContent = name;
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

  wrap.append(svg, h('p.prose.circle__note', null,
    'Each step clockwise adds a sharp; each step anticlockwise adds a flat. Neighbouring keys share all but one note, ',
    'which is why music moves between them so easily.'));
  return wrap;
}
