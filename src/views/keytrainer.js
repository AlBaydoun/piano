/** Key signature drill: read a signature, name the key — and the reverse. */

import { h, segmented } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { Staff } from '../staff.js';
import { Scoreboard, drillPage, answerGrid, markAnswer } from './drillkit.js';
import { KEY_SIGNATURES, MINOR_KEY_SIGNATURES, accidentalLetters, pick, shuffle, nameToMidi } from '../theory.js';

function describeSignature(count) {
  if (count === 0) return t('keyTrainer.noAccidentals');
  const n = Math.abs(count);
  return count > 0 ? t('keyTrainer.sharps', { count: n, n }) : t('keyTrainer.flats', { count: n, n });
}

export function render(app) {
  const scoreboard = new Scoreboard(app, 'key-signatures');
  const { page, stage, controls, status } = drillPage({
    title: t('keyTrainer.title'),
    lede: t('keyTrainer.lede'),
    scoreboard,
  });

  let mode = 'name-the-key';
  let scope = 'major';
  let current = null;

  const staffHost = h('div.drill__staff');
  const staff = new Staff(staffHost, { clef: 'treble', spacing: 20, minWidth: 300, showKeySignature: true });
  const question = h('p.drill__question');
  const answers = h('div.drill__answers');
  stage.append(staffHost, question, answers);

  controls.append(
    segmented({
      label: t('keyTrainer.ask'),
      value: mode,
      options: [
        { value: 'name-the-key', label: t('keyTrainer.askName') },
        { value: 'count-accidentals', label: t('keyTrainer.askCount') },
        { value: 'name-the-letters', label: t('keyTrainer.askLetters') },
      ],
      onChange: (value) => {
        mode = value;
        nextQuestion();
      },
    }),
    segmented({
      label: t('keyTrainer.keys'),
      value: scope,
      options: [
        { value: 'major', label: t('keyTrainer.major') },
        { value: 'minor', label: t('keyTrainer.minor') },
        { value: 'both', label: t('keyTrainer.both') },
      ],
      onChange: (value) => {
        scope = value;
        nextQuestion();
      },
    }),
  );

  function keyPool() {
    const majors = Object.entries(KEY_SIGNATURES).map(([name, sig]) => ({ name, sig, mode: 'major' }));
    const minors = Object.entries(MINOR_KEY_SIGNATURES).map(([name, sig]) => ({ name, sig, mode: 'minor' }));
    if (scope === 'major') return majors;
    if (scope === 'minor') return minors;
    return [...majors, ...minors];
  }

  const label = (key) => i18n.keyName(key.name, key.mode);

  /** Accidental letters rendered in the reader's naming system. */
  function accidentalText(signature) {
    const letters = accidentalLetters(signature);
    if (!letters.length) return t('keyTrainer.none');
    const symbol = signature >= 0 ? '♯' : '♭';
    return letters.map((letter) => app.noteName(nameToMidi(letter), { short: true }) + symbol).join(' ');
  }

  function nextQuestion() {
    const pool = keyPool();
    current = pick(pool);
    status.textContent = '';
    status.className = 'drill__status';
    staff.setKeySignature(current.sig);
    staffHost.style.display = mode === 'count-accidentals' ? 'none' : '';

    if (mode === 'name-the-key') {
      staff.setEvents([]);
      question.textContent = t('keyTrainer.nameQuestion');
      const distractors = shuffle(pool.filter((key) => key.sig !== current.sig)).slice(0, 3);
      const options = shuffle([current, ...distractors]).map((key) => ({ value: label(key), label: label(key) }));
      showAnswers(options, label(current));
    } else if (mode === 'count-accidentals') {
      question.textContent = t('keyTrainer.countQuestion', { key: label(current) });
      const values = [...new Set([current.sig, current.sig + 1, current.sig - 1, current.sig > 0 ? -current.sig : current.sig + 2])].slice(0, 4);
      if (!values.includes(current.sig)) values[0] = current.sig;
      const options = shuffle(values).map((value) => ({ value: String(value), label: describeSignature(value) }));
      showAnswers(options, String(current.sig));
    } else {
      staff.setEvents([]);
      question.textContent = t('keyTrainer.lettersQuestion');
      const correctText = accidentalText(current.sig);
      const wrong = new Set();
      for (const key of shuffle(pool.filter((k) => k.sig !== current.sig))) {
        const text = accidentalText(key.sig);
        if (text !== correctText) wrong.add(text);
        if (wrong.size >= 3) break;
      }
      const options = shuffle([correctText, ...wrong]).map((value) => ({ value, label: value }));
      showAnswers(options, correctText);
    }
  }

  function showAnswers(options, correctValue) {
    const grid = answerGrid(options, (option, node) => {
      const correct = option.value === correctValue;
      scoreboard.record(correct);
      markAnswer(grid, correctValue, node);
      const description = describeSignature(current.sig);
      status.textContent = correct
        ? t('keyTrainer.correctAnswer', { key: label(current), description })
        : t('keyTrainer.answer', { key: label(current), description });
      status.classList.toggle('is-correct', correct);
      setTimeout(nextQuestion, correct ? 900 : 1900);
    }, { columns: options.length > 3 ? 2 : 3 });
    answers.replaceChildren(grid);
  }

  app.setView(page, { title: t('keyTrainer.title') });
  nextQuestion();
  return () => {};
}
