/** Sight-reading drill: a note appears, you play it. */

import { h, select, toast } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { Staff } from '../staff.js';
import { Scoreboard, drillPage } from './drillkit.js';
import { randomInt, isBlackKey, KEY_SIGNATURES, keySignatureFor } from '../theory.js';

const LEVELS = {
  starter: { low: 60, high: 67, accidentals: false, clef: 'treble' },
  treble: { low: 60, high: 81, accidentals: false, clef: 'treble' },
  bass: { low: 41, high: 60, accidentals: false, clef: 'bass' },
  grand: { low: 43, high: 79, accidentals: false, clef: 'grand' },
  ledger: { low: 36, high: 88, accidentals: false, clef: 'grand' },
  chromatic: { low: 48, high: 84, accidentals: true, clef: 'grand' },
};

export function render(app) {
  const scoreboard = new Scoreboard(app, 'note-reading');
  const { page, stage, controls, status } = drillPage({
    title: t('noteReader.title'),
    lede: t('noteReader.lede'),
    scoreboard,
  });

  let level = 'starter';
  let keyName = 'C';
  let current = null;
  let locked = false;

  const staffHost = h('div.drill__staff');
  const staff = new Staff(staffHost, { clef: 'treble', spacing: 20, minWidth: 300 });
  stage.append(staffHost, h('p.drill__hint', null, t('noteReader.hint')));

  controls.append(
    select({
      label: t('noteReader.level'),
      value: level,
      options: Object.keys(LEVELS).map((value) => ({ value, label: t(`noteReader.levels.${value}`) })),
      onChange: (value) => {
        level = value;
        applyRange();
        nextQuestion();
      },
    }),
    select({
      label: t('noteReader.key'),
      value: keyName,
      options: Object.keys(KEY_SIGNATURES).map((value) => ({ value, label: i18n.keyName(value, 'major') })),
      onChange: (value) => {
        keyName = value;
        staff.setKeySignature(keySignatureFor(keyName));
        nextQuestion();
      },
    }),
    h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => hear() }, t('noteReader.hearNote')),
    h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => skip() }, t('actions.skip')),
  );

  function applyRange() {
    const config = LEVELS[level];
    staff.setClef(config.clef);
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
    status.textContent = t('noteReader.thatWas', { note: app.noteName(current, { octave: true }) });
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
      status.textContent = t('lesson.correctNote', { note: app.noteName(current, { octave: true }) });
      status.classList.add('is-correct');
      if (scoreboard.streak > 0 && scoreboard.streak % 10 === 0) {
        toast(t('noteReader.streakToast', { n: scoreboard.streak }), { tone: 'good' });
      }
      setTimeout(nextQuestion, 600);
    } else {
      staff.setState(0, 'wrong');
      status.textContent = t('noteReader.wrong', { note: app.noteName(event.midi, { octave: true }) });
      app.keyboard.mark(event.midi, 'wrong');
      setTimeout(() => {
        app.keyboard.unmark(event.midi, 'wrong');
        staff.setState(0, '');
      }, 600);
    }
  });

  app.setView(page, { title: t('noteReader.title') });
  applyRange();
  staff.setKeySignature(keySignatureFor(keyName));
  nextQuestion();

  return () => {
    unsubscribe();
    app.keyboard.clearMarks();
  };
}
