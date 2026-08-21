/** Sight-reading drill: a note appears, you play it. */

import { h, select, toast } from '../ui.js';
import { Staff } from '../staff.js';
import { Scoreboard, drillPage } from './drillkit.js';
import { midiToName, randomInt, isBlackKey, KEY_SIGNATURES, keySignatureFor } from '../theory.js';

const LEVELS = {
  starter: { label: 'C position', low: 60, high: 67, accidentals: false, clefs: ['treble'] },
  treble: { label: 'Treble staff', low: 60, high: 81, accidentals: false, clefs: ['treble'] },
  bass: { label: 'Bass staff', low: 41, high: 60, accidentals: false, clefs: ['bass'] },
  grand: { label: 'Grand staff', low: 43, high: 79, accidentals: false, clefs: ['grand'] },
  ledger: { label: 'With ledger lines', low: 36, high: 88, accidentals: false, clefs: ['grand'] },
  chromatic: { label: 'Sharps and flats', low: 48, high: 84, accidentals: true, clefs: ['grand'] },
};

export function render(app) {
  const scoreboard = new Scoreboard(app, 'note-reading');
  const { page, stage, controls, status } = drillPage({
    title: 'Sight reading',
    lede: 'Play the note you see. Start narrow and widen the range once you stop having to count lines.',
    scoreboard,
  });

  let level = 'starter';
  let keyName = 'C';
  let current = null;
  let locked = false;

  const staffHost = h('div.drill__staff');
  const staff = new Staff(staffHost, { clef: 'treble', spacing: 18, minWidth: 300 });
  stage.append(staffHost, h('p.drill__hint', null, 'Play it on the keyboard below, or with your computer keys.'));

  controls.append(
    select({
      label: 'Level',
      value: level,
      options: Object.entries(LEVELS).map(([value, config]) => ({ value, label: config.label })),
      onChange: (value) => {
        level = value;
        applyRange();
        nextQuestion();
      },
    }),
    select({
      label: 'Key',
      value: keyName,
      options: Object.keys(KEY_SIGNATURES).map((value) => ({ value, label: `${value} major` })),
      onChange: (value) => {
        keyName = value;
        staff.setKeySignature(keySignatureFor(keyName));
        nextQuestion();
      },
    }),
    h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => hear() }, 'Hear the note'),
    h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => skip() }, 'Skip'),
  );

  function applyRange() {
    const config = LEVELS[level];
    staff.setClef(config.clefs[0]);
    app.keyboard.ensureVisible([config.low, config.high]);
  }

  function pickNote() {
    const config = LEVELS[level];
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const midi = randomInt(config.low, config.high);
      if (!config.accidentals && isBlackKey(midi)) continue;
      if (midi === current) continue;
      return midi;
    }
    return randomInt(config.low, config.high);
  }

  function nextQuestion() {
    locked = false;
    current = pickNote();
    staff.setEvents([{ midis: [current], duration: 'whole' }]);
    status.textContent = '';
    status.className = 'drill__status';
    app.keyboard.clearMarks();
  }

  function hear() {
    if (current !== null) app.engine.playNote(current, 1.1);
  }

  function skip() {
    if (current === null) return;
    status.textContent = `That was ${midiToName(current)}.`;
    app.keyboard.mark(current, 'hint');
    setTimeout(() => nextQuestion(), 900);
  }

  const unsubscribe = app.onNote((event) => {
    if (event.type !== 'on' || locked || current === null) return;
    const correct = event.midi === current;
    scoreboard.record(correct);
    if (correct) {
      locked = true;
      staff.setState(0, 'correct');
      app.keyboard.mark(current, 'correct');
      status.textContent = `${midiToName(current)} — correct`;
      status.classList.add('is-correct');
      if (scoreboard.streak > 0 && scoreboard.streak % 10 === 0) toast(`${scoreboard.streak} in a row`, { tone: 'good' });
      setTimeout(nextQuestion, 600);
    } else {
      staff.setState(0, 'wrong');
      status.textContent = `That was ${midiToName(event.midi)} — look again at which line or space it sits on.`;
      app.keyboard.mark(event.midi, 'wrong');
      setTimeout(() => {
        app.keyboard.unmark(event.midi, 'wrong');
        staff.setState(0, '');
      }, 600);
    }
  });

  app.setView(page, { title: 'Sight reading' });
  applyRange();
  staff.setKeySignature(keySignatureFor(keyName));
  nextQuestion();

  return () => {
    unsubscribe();
    app.keyboard.clearMarks();
  };
}
