/** Chord building drill: you get a symbol, you play the chord. */

import { h, segmented, toast } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { Scoreboard, drillPage } from './drillkit.js';
import { CHORDS, buildChord, pitchClass, pick, randomInt } from '../theory.js';

const LEVELS = {
  triads: { types: ['major', 'minor'], inversions: false },
  allTriads: { types: ['major', 'minor', 'diminished', 'augmented', 'sus4'], inversions: false },
  sevenths: { types: ['dominant7', 'major7', 'minor7', 'halfDiminished7', 'diminished7'], inversions: false },
  inversions: { types: ['major', 'minor'], inversions: true },
  everything: {
    types: ['major', 'minor', 'diminished', 'augmented', 'sus2', 'sus4', 'dominant7', 'major7', 'minor7', 'major6'],
    inversions: true,
  },
};

export function render(app) {
  const scoreboard = new Scoreboard(app, 'chord-recognition');
  const { page, stage, controls, status } = drillPage({
    title: t('chordTrainer.title'),
    lede: t('chordTrainer.lede'),
    scoreboard,
  });

  let level = 'triads';
  let current = null;
  let locked = false;

  const symbol = h('div.chord-prompt__symbol', { dir: 'ltr' });
  const detail = h('div.chord-prompt__detail');
  const held = h('div.chord-prompt__held', { dir: 'ltr' });
  stage.append(h('div.chord-prompt', null, symbol, detail, held));

  controls.append(
    segmented({
      label: t('chordTrainer.level'),
      value: level,
      options: Object.keys(LEVELS).map((value) => ({ value, label: t(`chordTrainer.levels.${value}`) })),
      onChange: (value) => {
        level = value;
        nextQuestion();
      },
    }),
    h('button.btn.btn--ghost.btn--small', {
      type: 'button',
      onclick: () => current && app.engine.playChord(current.notes, 1.6),
    }, t('actions.hear')),
    h('button.btn.btn--ghost.btn--small', {
      type: 'button',
      onclick: () => reveal(),
    }, t('actions.showMe')),
  );

  function nextQuestion() {
    locked = false;
    const config = LEVELS[level];
    const type = pick(config.types);
    const root = randomInt(55, 66);
    const inversion = config.inversions ? randomInt(0, CHORDS[type].steps.length - 1) : 0;
    const notes = buildChord(root, type, { inversion });
    current = { root, type, inversion, notes };

    symbol.textContent = i18n.chordSymbol(root, type);
    detail.textContent = inversion
      ? `${i18n.chordTypeName(type)} · ${t(`music.inversions.${inversion}`)} — ${t('music.bassNote', { note: app.noteName(notes[0]) })}`
      : i18n.chordTypeName(type);
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
    status.textContent = t('chordTrainer.reveal', {
      symbol: i18n.chordSymbol(current.root, current.type),
      notes: current.notes.map((m) => app.noteName(m)).join(' – '),
    });
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
      held.textContent = heldNotes.map((m) => app.noteName(m, { octave: true })).join('  ');
      const verdict = check();
      if (verdict === true) {
        locked = true;
        scoreboard.record(true);
        app.keyboard.mark(heldNotes, 'correct');
        status.textContent = t('chordTrainer.correct');
        status.classList.add('is-correct');
        if (scoreboard.streak % 10 === 0) toast(t('noteReader.streakToast', { n: scoreboard.streak }), { tone: 'good' });
        setTimeout(nextQuestion, 800);
      } else if (verdict === false) {
        status.textContent = LEVELS[level].inversions ? t('chordTrainer.wrongBass') : t('chordTrainer.wrong');
      }
    } else if (event.type === 'off' && app.sounding.size === 0) {
      held.textContent = '';
    }
  });

  app.setView(page, { title: t('chordTrainer.title') });
  nextQuestion();

  return () => {
    unsubscribe();
    app.keyboard.clearMarks();
  };
}
