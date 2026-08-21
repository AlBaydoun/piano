/** Key signature drill: read a signature, name the key — and the reverse. */

import { h, segmented } from '../ui.js';
import { Staff } from '../staff.js';
import { Scoreboard, drillPage, answerGrid, markAnswer } from './drillkit.js';
import { KEY_SIGNATURES, MINOR_KEY_SIGNATURES, accidentalLetters, pick, shuffle } from '../theory.js';

const MAJOR_KEYS = Object.entries(KEY_SIGNATURES);
const MINOR_KEYS = Object.entries(MINOR_KEY_SIGNATURES);

function describeSignature(count) {
  if (count === 0) return 'no sharps or flats';
  const kind = count > 0 ? 'sharp' : 'flat';
  const n = Math.abs(count);
  return `${n} ${kind}${n === 1 ? '' : 's'}`;
}

export function render(app) {
  const scoreboard = new Scoreboard(app, 'key-signatures');
  const { page, stage, controls, status } = drillPage({
    title: 'Key signatures',
    lede: 'Sharps always arrive in the order F C G D A E B; flats in exactly the reverse. Everything else follows from that.',
    scoreboard,
  });

  let mode = 'name-the-key';
  let scope = 'major';
  let current = null;

  const staffHost = h('div.drill__staff');
  const staff = new Staff(staffHost, { clef: 'treble', spacing: 18, minWidth: 300, showKeySignature: true });
  const question = h('p.drill__question');
  const answers = h('div');
  stage.append(staffHost, question, answers);

  controls.append(
    segmented({
      label: 'Ask me',
      value: mode,
      options: [
        { value: 'name-the-key', label: 'Name the key' },
        { value: 'count-accidentals', label: 'Count the accidentals' },
        { value: 'name-the-letters', label: 'Which sharps or flats' },
      ],
      onChange: (value) => {
        mode = value;
        nextQuestion();
      },
    }),
    segmented({
      label: 'Keys',
      value: scope,
      options: [{ value: 'major', label: 'Major' }, { value: 'minor', label: 'Minor' }, { value: 'both', label: 'Both' }],
      onChange: (value) => {
        scope = value;
        nextQuestion();
      },
    }),
  );

  function keyPool() {
    if (scope === 'major') return MAJOR_KEYS.map(([name, sig]) => ({ name, sig, mode: 'major' }));
    if (scope === 'minor') return MINOR_KEYS.map(([name, sig]) => ({ name, sig, mode: 'minor' }));
    return [
      ...MAJOR_KEYS.map(([name, sig]) => ({ name, sig, mode: 'major' })),
      ...MINOR_KEYS.map(([name, sig]) => ({ name, sig, mode: 'minor' })),
    ];
  }

  function label(key) {
    return `${key.name} ${key.mode}`;
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
      question.textContent = 'Which key has this signature?';
      const distractors = shuffle(pool.filter((key) => key.sig !== current.sig)).slice(0, 3);
      const options = shuffle([current, ...distractors]).map((key) => ({ value: label(key), label: label(key) }));
      showAnswers(options, label(current));
    } else if (mode === 'count-accidentals') {
      question.textContent = `How many sharps or flats are in ${label(current)}?`;
      const values = shuffle([...new Set([current.sig, current.sig + 1, current.sig - 1, current.sig > 0 ? -current.sig : current.sig + 2])]).slice(0, 4);
      if (!values.includes(current.sig)) values[0] = current.sig;
      const options = shuffle(values).map((value) => ({ value: String(value), label: describeSignature(value) }));
      showAnswers(options, String(current.sig));
    } else {
      staff.setEvents([]);
      question.textContent = 'Which accidentals does this signature contain?';
      const letters = accidentalLetters(current.sig);
      const symbol = current.sig >= 0 ? '♯' : '♭';
      const correctText = letters.length ? letters.map((letter) => letter + symbol).join(' ') : 'none';
      const wrong = new Set();
      const pools = keyPool().filter((key) => key.sig !== current.sig);
      for (const key of shuffle(pools)) {
        const text = accidentalLetters(key.sig).map((letter) => letter + (key.sig >= 0 ? '♯' : '♭')).join(' ') || 'none';
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
      status.textContent = correct
        ? `Correct — ${label(current)} has ${describeSignature(current.sig)}.`
        : `${label(current)} has ${describeSignature(current.sig)}.`;
      status.classList.toggle('is-correct', correct);
      setTimeout(nextQuestion, correct ? 900 : 1900);
    }, { columns: options.length > 3 ? 2 : 3 });
    answers.replaceChildren(grid);
  }

  app.setView(page, { title: 'Key signatures' });
  nextQuestion();
  return () => {};
}
