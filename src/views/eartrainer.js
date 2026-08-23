/** Ear training: intervals, chord qualities, scale degrees and melodies. */

import { h, segmented, toast } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { Scoreboard, drillPage, answerGrid, markAnswer } from './drillkit.js';
import { buildChord, buildScale, pick, randomInt, pitchClass } from '../theory.js';

const INTERVAL_SETS = {
  simple: [2, 4, 5, 7, 12],
  thirds: [3, 4, 7, 8, 9],
  all: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

const CHORD_SETS = {
  triads: ['major', 'minor'],
  quality: ['major', 'minor', 'diminished', 'augmented'],
  sevenths: ['major', 'minor', 'dominant7', 'major7', 'minor7', 'diminished7'],
};

export function render(app) {
  const scoreboard = new Scoreboard(app, 'ear-intervals');
  const { page, stage, controls, status } = drillPage({
    title: t('earTrainer.title'),
    lede: t('earTrainer.lede'),
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
  const answers = h('div.drill__answers');
  const replay = h('button.btn.btn--primary', { type: 'button', onclick: () => play() }, t('actions.playAgain'));
  stage.append(h('div.ear__player', null, replay), prompt, answers);

  const modeControl = segmented({
    label: t('earTrainer.mode'),
    value: mode,
    options: [
      { value: 'intervals', label: t('earTrainer.modeIntervals') },
      { value: 'chords', label: t('earTrainer.modeChords') },
      { value: 'degrees', label: t('earTrainer.modeDegrees') },
      { value: 'melody', label: t('earTrainer.modeMelody') },
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
        label: t('earTrainer.set'),
        value: intervalSet,
        options: Object.keys(INTERVAL_SETS).map((value) => ({ value, label: t(`earTrainer.sets.${value}`) })),
        onChange: (value) => { intervalSet = value; nextQuestion(); },
      }));
      extra.push(segmented({
        label: t('earTrainer.played'),
        value: direction,
        options: [
          { value: 'ascending', label: t('earTrainer.ascending') },
          { value: 'descending', label: t('earTrainer.descending') },
          { value: 'harmonic', label: t('earTrainer.harmonic') },
        ],
        onChange: (value) => { direction = value; nextQuestion(); },
      }));
    } else if (mode === 'chords') {
      extra.push(segmented({
        label: t('earTrainer.set'),
        value: chordSet,
        options: Object.keys(CHORD_SETS).map((value) => ({ value, label: t(`earTrainer.sets.${value}`) })),
        onChange: (value) => { chordSet = value; nextQuestion(); },
      }));
    } else if (mode === 'melody') {
      extra.push(segmented({
        label: t('earTrainer.length'),
        value: String(melodyLength),
        options: [3, 4, 5, 6].map((n) => ({ value: String(n), label: t('earTrainer.notesCount', { n }) })),
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
    const semitones = pick(INTERVAL_SETS[intervalSet]);
    const root = randomInt(52, 69);
    const notes = direction === 'descending' ? [root + semitones, root] : [root, root + semitones];
    current = { kind: direction === 'harmonic' ? 'harmonic' : 'melodic', notes, answer: semitones };
    prompt.textContent = direction === 'harmonic'
      ? t('earTrainer.intervalQuestionHarmonic')
      : t('earTrainer.intervalQuestion', { direction: t(`earTrainer.${direction}`).toLocaleLowerCase(i18n.locale) });

    const options = INTERVAL_SETS[intervalSet].map((value) => ({ value: String(value), label: i18n.intervalName(value) }));
    showAnswers(options, String(semitones), () => t('earTrainer.intervalAnswer', { interval: i18n.intervalName(semitones) }));
  }

  // -- chord quality -------------------------------------------------------

  function setupChord() {
    const types = CHORD_SETS[chordSet];
    const type = pick(types);
    const root = randomInt(48, 64);
    current = { kind: 'harmonic', notes: buildChord(root, type), answer: type };
    prompt.textContent = t('earTrainer.chordQuestion');
    const options = types.map((value) => ({ value, label: i18n.chordTypeName(value) }));
    showAnswers(options, type, () => t('earTrainer.chordAnswer', {
      chord: i18n.chordTypeName(type),
      note: app.noteName(root),
    }));
  }

  // -- scale degrees -------------------------------------------------------

  function setupDegree() {
    const tonic = 60;
    const scale = buildScale(tonic, 'major', { includeOctave: false });
    const degree = randomInt(0, 6);
    current = { kind: 'melodic', notes: [tonic, tonic + 12, scale[degree]], answer: String(degree), noteDuration: 0.45 };
    prompt.textContent = t('earTrainer.degreeQuestion');
    const options = Array.from({ length: 7 }, (_, value) => ({ value: String(value), label: t(`music.degrees.${value}`) }));
    showAnswers(options, String(degree), () => t('earTrainer.degreeAnswer', {
      degree: i18n.number(degree + 1),
      note: app.noteName(scale[degree]),
      key: i18n.keyName('C', 'major'),
    }));
  }

  function showAnswers(options, correctValue, explain) {
    const grid = answerGrid(options, (option, node) => {
      const correct = option.value === correctValue;
      scoreboard.record(correct);
      markAnswer(grid, correctValue, node);
      status.textContent = correct
        ? `${t('earTrainer.correctPrefix')} ${explain()}`
        : `${t('earTrainer.wrongPrefix')} ${explain()}`;
      status.classList.toggle('is-correct', correct);
      if (correct && scoreboard.streak % 10 === 0) toast(t('noteReader.streakToast', { n: scoreboard.streak }), { tone: 'good' });
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
    prompt.textContent = t('earTrainer.melodyQuestion', { n: melodyLength, key: i18n.keyName('C', 'major') });

    let index = 0;
    const trail = h('div.notetrail', null, notes.map((_, i) => h('span.notetrail__note', { dataset: { index: String(i) }, dir: 'ltr' }, '?')));
    answers.replaceChildren(trail, h('div.ear__actions', null,
      h('button.btn.btn--ghost.btn--small', {
        type: 'button',
        onclick: () => {
          scoreboard.record(false);
          revealMelody(trail, notes);
          status.textContent = t('earTrainer.melodyReveal', { notes: notes.map((m) => app.noteName(m)).join(' ') });
          setTimeout(nextQuestion, 2200);
        },
      }, t('actions.giveUp'))));

    unsubscribe = app.onNote((event) => {
      if (event.type !== 'on') return;
      if (pitchClass(event.midi) === pitchClass(notes[index]) && Math.abs(event.midi - notes[index]) % 12 === 0) {
        trail.children[index].textContent = app.noteName(notes[index]);
        trail.children[index].classList.add('is-done');
        index += 1;
        if (index >= notes.length) {
          scoreboard.record(true);
          status.textContent = t('earTrainer.melodyCorrect');
          status.classList.add('is-correct');
          cleanupListener();
          setTimeout(nextQuestion, 900);
        }
      } else {
        status.textContent = t('earTrainer.melodyWrong');
        app.keyboard.mark(event.midi, 'wrong');
        setTimeout(() => app.keyboard.unmark(event.midi, 'wrong'), 400);
      }
    });
  }

  function revealMelody(trail, notes) {
    notes.forEach((midi, i) => {
      trail.children[i].textContent = app.noteName(midi);
      trail.children[i].classList.add('is-revealed');
    });
    app.engine.playSequence(notes, { noteDuration: 0.45 });
  }

  app.setView(page, { title: t('earTrainer.title') });
  renderOptions();
  nextQuestion();

  return () => {
    cleanupListener();
    app.keyboard.clearMarks();
  };
}
