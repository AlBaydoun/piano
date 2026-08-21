/** Ear training: intervals, chord qualities, scale degrees and melodies. */

import { h, segmented, toast } from '../ui.js';
import { Scoreboard, drillPage, answerGrid, markAnswer } from './drillkit.js';
import {
  INTERVALS, CHORDS, buildChord, buildScale, midiToName, pick, randomInt, pitchClass,
} from '../theory.js';

const INTERVAL_SETS = {
  simple: { label: 'Common intervals', semitones: [2, 4, 5, 7, 12] },
  thirds: { label: 'Thirds and fifths', semitones: [3, 4, 7, 8, 9] },
  all: { label: 'Every interval', semitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
};

const CHORD_SETS = {
  triads: { label: 'Major and minor', types: ['major', 'minor'] },
  quality: { label: 'All four triads', types: ['major', 'minor', 'diminished', 'augmented'] },
  sevenths: { label: 'Sevenths too', types: ['major', 'minor', 'dominant7', 'major7', 'minor7', 'diminished7'] },
};

const DEGREE_NAMES = ['1 (tonic)', '2', '3', '4', '5', '6', '7 (leading tone)'];

export function render(app) {
  const scoreboard = new Scoreboard(app, 'ear-intervals');
  const { page, stage, controls, status } = drillPage({
    title: 'Ear training',
    lede: 'Listen first, answer second. Replay as often as you like — recognising the sound matters more than being fast.',
    scoreboard,
  });

  let mode = 'intervals';
  let intervalSet = 'simple';
  let chordSet = 'triads';
  let direction = 'ascending';
  let melodyLength = 3;
  let current = null;
  let unsubscribe = null;

  const prompt = h('p.drill__question');
  const answers = h('div');
  const replay = h('button.btn.btn--primary', { type: 'button', onclick: () => play() }, 'Play it again');
  stage.append(h('div.ear__player', null, replay), prompt, answers);

  const modeControl = segmented({
    label: 'Mode',
    value: mode,
    options: [
      { value: 'intervals', label: 'Intervals' },
      { value: 'chords', label: 'Chords' },
      { value: 'degrees', label: 'Scale degrees' },
      { value: 'melody', label: 'Melody playback' },
    ],
    onChange: (value) => {
      mode = value;
      renderOptions();
      nextQuestion();
    },
  });
  const optionsHost = h('div.drill__controls-extra');
  controls.append(modeControl, optionsHost);

  function renderOptions() {
    const extra = [];
    if (mode === 'intervals') {
      extra.push(segmented({
        label: 'Set',
        value: intervalSet,
        options: Object.entries(INTERVAL_SETS).map(([value, config]) => ({ value, label: config.label })),
        onChange: (value) => { intervalSet = value; nextQuestion(); },
      }));
      extra.push(segmented({
        label: 'Played',
        value: direction,
        options: [
          { value: 'ascending', label: 'Ascending' },
          { value: 'descending', label: 'Descending' },
          { value: 'harmonic', label: 'Together' },
        ],
        onChange: (value) => { direction = value; nextQuestion(); },
      }));
    } else if (mode === 'chords') {
      extra.push(segmented({
        label: 'Set',
        value: chordSet,
        options: Object.entries(CHORD_SETS).map(([value, config]) => ({ value, label: config.label })),
        onChange: (value) => { chordSet = value; nextQuestion(); },
      }));
    } else if (mode === 'melody') {
      extra.push(segmented({
        label: 'Length',
        value: String(melodyLength),
        options: [3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n} notes` })),
        onChange: (value) => { melodyLength = Number(value); nextQuestion(); },
      }));
    }
    optionsHost.replaceChildren(...extra);
  }

  function play() {
    if (!current) return;
    app.engine.resume();
    if (current.kind === 'harmonic') app.engine.playChord(current.notes, 1.6);
    else app.engine.playSequence(current.notes, { noteDuration: current.noteDuration ?? 0.55, gap: 0.06 });
  }

  function cleanupListener() {
    if (typeof unsubscribe === 'function') unsubscribe();
    unsubscribe = null;
  }

  function nextQuestion() {
    cleanupListener();
    app.keyboard.clearMarks();
    status.textContent = '';
    status.className = 'drill__status';
    answers.replaceChildren();

    if (mode === 'intervals') setupInterval();
    else if (mode === 'chords') setupChord();
    else if (mode === 'degrees') setupDegree();
    else setupMelody();

    setTimeout(play, 250);
  }

  // -- intervals -----------------------------------------------------------

  function setupInterval() {
    const semitones = pick(INTERVAL_SETS[intervalSet].semitones);
    const root = randomInt(52, 69);
    const notes = direction === 'descending' ? [root + semitones, root] : [root, root + semitones];
    current = { kind: direction === 'harmonic' ? 'harmonic' : 'melodic', notes, answer: semitones };
    prompt.textContent = direction === 'harmonic'
      ? 'Which interval is sounding?'
      : `Which interval, played ${direction}?`;

    const choices = INTERVAL_SETS[intervalSet].semitones;
    const options = choices.map((value) => ({ value: String(value), label: INTERVALS[value].name }));
    showAnswers(options, String(semitones), () => `That was ${INTERVALS[semitones].name}.`);
  }

  // -- chord quality -------------------------------------------------------

  function setupChord() {
    const types = CHORD_SETS[chordSet].types;
    const type = pick(types);
    const root = randomInt(48, 64);
    current = { kind: 'harmonic', notes: buildChord(root, type), answer: type };
    prompt.textContent = 'What kind of chord is this?';
    const options = types.map((value) => ({ value, label: CHORDS[value].name }));
    showAnswers(options, type, () => `That was a ${CHORDS[type].name.toLowerCase()} chord on ${midiToName(root, { octave: false })}.`);
  }

  // -- scale degrees -------------------------------------------------------

  function setupDegree() {
    const tonic = 60;
    const scale = buildScale(tonic, 'major', { includeOctave: false });
    const degree = randomInt(0, 6);
    current = { kind: 'melodic', notes: [tonic, tonic + 12, scale[degree]], answer: String(degree), noteDuration: 0.45 };
    prompt.textContent = 'You hear the tonic twice, then one note of the scale. Which degree is it?';
    const options = DEGREE_NAMES.map((label, value) => ({ value: String(value), label }));
    showAnswers(options, String(degree), () => `That was degree ${degree + 1} — ${midiToName(scale[degree], { octave: false })} in C major.`);
  }

  function showAnswers(options, correctValue, explain) {
    const grid = answerGrid(options, (option, node) => {
      const correct = option.value === correctValue;
      scoreboard.record(correct);
      markAnswer(grid, correctValue, node);
      status.textContent = correct ? `Correct. ${explain()}` : `Not quite. ${explain()}`;
      status.classList.toggle('is-correct', correct);
      if (correct && scoreboard.streak % 10 === 0) toast(`${scoreboard.streak} in a row`, { tone: 'good' });
      setTimeout(nextQuestion, correct ? 900 : 2000);
    }, { columns: options.length > 6 ? 4 : 3 });
    answers.replaceChildren(grid);
  }

  // -- melody playback -----------------------------------------------------

  function setupMelody() {
    const tonic = 60;
    const scale = buildScale(tonic, 'major', { includeOctave: true });
    const notes = [scale[0]];
    for (let i = 1; i < melodyLength; i += 1) {
      // Stepwise-ish motion, which is far more musical than pure random.
      const previous = scale.indexOf(notes[i - 1]);
      const jump = pick([-2, -1, -1, 1, 1, 2, 3]);
      const index = Math.min(scale.length - 1, Math.max(0, previous + jump));
      notes.push(scale[index]);
    }
    current = { kind: 'melodic', notes, answer: notes, noteDuration: 0.45 };
    prompt.textContent = `Play those ${melodyLength} notes back on the keyboard. They are all in C major.`;

    let index = 0;
    const trail = h('div.notetrail', null, notes.map((_, i) => h('span.notetrail__note', { dataset: { index: String(i) } }, '?')));
    answers.replaceChildren(trail, h('div.ear__actions', null,
      h('button.btn.btn--ghost.btn--small', {
        type: 'button',
        onclick: () => {
          scoreboard.record(false);
          revealMelody(trail, notes);
          status.textContent = `The melody was ${notes.map((m) => midiToName(m, { octave: false })).join(' ')}.`;
          setTimeout(nextQuestion, 2200);
        },
      }, 'Give up and show me')));

    unsubscribe = app.onNote((event) => {
      if (event.type !== 'on') return;
      if (pitchClass(event.midi) === pitchClass(notes[index]) && Math.abs(event.midi - notes[index]) % 12 === 0) {
        trail.children[index].textContent = midiToName(notes[index], { octave: false });
        trail.children[index].classList.add('is-done');
        index += 1;
        if (index >= notes.length) {
          scoreboard.record(true);
          status.textContent = 'That is the melody — correct.';
          status.classList.add('is-correct');
          cleanupListener();
          setTimeout(nextQuestion, 900);
        }
      } else {
        status.textContent = 'Not that one — listen again and try the next note.';
        app.keyboard.mark(event.midi, 'wrong');
        setTimeout(() => app.keyboard.unmark(event.midi, 'wrong'), 400);
      }
    });
  }

  function revealMelody(trail, notes) {
    notes.forEach((midi, i) => {
      trail.children[i].textContent = midiToName(midi, { octave: false });
      trail.children[i].classList.add('is-revealed');
    });
    app.engine.playSequence(notes, { noteDuration: 0.45 });
  }

  app.setView(page, { title: 'Ear training' });
  renderOptions();
  nextQuestion();

  return () => {
    cleanupListener();
    app.keyboard.clearMarks();
  };
}
