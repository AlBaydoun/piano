/** Chord building drill: you get a symbol, you play the chord. */

import { h, segmented, toast } from '../ui.js';
import { Scoreboard, drillPage } from './drillkit.js';
import { CHORDS, buildChord, chordName, midiToName, pitchClass, pick, randomInt } from '../theory.js';

const LEVELS = {
  triads: { label: 'Major and minor', types: ['major', 'minor'], inversions: false },
  allTriads: { label: 'All triads', types: ['major', 'minor', 'diminished', 'augmented', 'sus4'], inversions: false },
  sevenths: { label: 'Sevenths', types: ['dominant7', 'major7', 'minor7', 'halfDiminished7', 'diminished7'], inversions: false },
  inversions: { label: 'Triads with inversions', types: ['major', 'minor'], inversions: true },
  everything: {
    label: 'Everything',
    types: ['major', 'minor', 'diminished', 'augmented', 'sus2', 'sus4', 'dominant7', 'major7', 'minor7', 'major6'],
    inversions: true,
  },
};

const INVERSION_NAMES = ['root position', 'first inversion', 'second inversion', 'third inversion'];

export function render(app) {
  const scoreboard = new Scoreboard(app, 'chord-recognition');
  const { page, stage, controls, status } = drillPage({
    title: 'Chord building',
    lede: 'Play the chord you are shown, in any octave. Notes can be played together or one at a time.',
    scoreboard,
  });

  let level = 'triads';
  let current = null;
  let locked = false;

  const symbol = h('div.chord-prompt__symbol');
  const detail = h('div.chord-prompt__detail');
  const held = h('div.chord-prompt__held');
  stage.append(h('div.chord-prompt', null, symbol, detail, held));

  controls.append(
    segmented({
      label: 'Level',
      value: level,
      options: Object.entries(LEVELS).map(([value, config]) => ({ value, label: config.label })),
      onChange: (value) => {
        level = value;
        nextQuestion();
      },
    }),
    h('button.btn.btn--ghost.btn--small', {
      type: 'button',
      onclick: () => current && app.engine.playChord(current.notes, 1.6),
    }, 'Hear it'),
    h('button.btn.btn--ghost.btn--small', {
      type: 'button',
      onclick: () => reveal(),
    }, 'Show me'),
  );

  function nextQuestion() {
    locked = false;
    const config = LEVELS[level];
    const type = pick(config.types);
    const root = randomInt(55, 66);
    const inversion = config.inversions ? randomInt(0, CHORDS[type].steps.length - 1) : 0;
    const notes = buildChord(root, type, { inversion });
    current = { root, type, inversion, notes };

    symbol.textContent = chordName(root, type);
    detail.textContent = inversion
      ? `${CHORDS[type].name} · ${INVERSION_NAMES[inversion]} — ${midiToName(notes[0], { octave: false })} in the bass`
      : CHORDS[type].name;
    held.textContent = '';
    status.textContent = '';
    status.className = 'drill__status';
    app.keyboard.clearMarks();
    app.keyboard.ensureVisible(notes);
  }

  function reveal() {
    if (!current) return;
    locked = true;
    scoreboard.record(false);
    app.keyboard.mark(current.notes, 'hint');
    app.engine.playChord(current.notes, 1.6);
    status.textContent = `${chordName(current.root, current.type)} is ${current.notes.map((m) => midiToName(m, { octave: false })).join(' – ')}.`;
    setTimeout(nextQuestion, 2200);
  }

  /**
   * A chord counts as correct when every required pitch class is present,
   * nothing extra is held, and — when an inversion was asked for — the
   * lowest note is the right one. Octave placement is otherwise free.
   */
  function check() {
    const heldNotes = [...app.sounding].sort((a, b) => a - b);
    if (!heldNotes.length) return null;
    const required = new Set(current.notes.map(pitchClass));
    const playedClasses = new Set(heldNotes.map(pitchClass));
    if (playedClasses.size < required.size) return null;
    for (const pc of playedClasses) if (!required.has(pc)) return false;
    for (const pc of required) if (!playedClasses.has(pc)) return null;
    if (LEVELS[level].inversions && pitchClass(heldNotes[0]) !== pitchClass(current.notes[0])) return false;
    return true;
  }

  const unsubscribe = app.onNote((event) => {
    if (locked || !current) return;
    if (event.type === 'on') {
      const heldNotes = [...app.sounding].sort((a, b) => a - b);
      held.textContent = heldNotes.map((m) => midiToName(m)).join('  ');
      const verdict = check();
      if (verdict === true) {
        locked = true;
        scoreboard.record(true);
        app.keyboard.mark(heldNotes, 'correct');
        status.textContent = 'Correct.';
        status.classList.add('is-correct');
        if (scoreboard.streak % 10 === 0) toast(`${scoreboard.streak} in a row`, { tone: 'good' });
        setTimeout(nextQuestion, 800);
      } else if (verdict === false) {
        status.textContent = LEVELS[level].inversions
          ? 'Right notes are not all there, or the bass note is wrong.'
          : 'That is not quite it — release and try again.';
      }
    } else if (event.type === 'off' && app.sounding.size === 0) {
      held.textContent = '';
    }
  });

  app.setView(page, { title: 'Chord building' });
  nextQuestion();

  return () => {
    unsubscribe();
    app.keyboard.clearMarks();
  };
}
