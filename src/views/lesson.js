/**
 * Lesson player.
 *
 * Steps are shown one at a time. A step that only needs reading has a
 * Continue button; a step that needs playing watches the note bus and
 * advances itself when you get it right.
 */

import { h, paragraphs, toast, announce } from '../ui.js';
import { getLesson, nextLesson, UNITS } from '../data/lessons.js';
import { Staff } from '../staff.js';
import { midiToName, pitchClass, shuffle } from '../theory.js';
import { getSong } from '../data/songs.js';

export function render(app, { params }) {
  const lesson = getLesson(params.id);
  if (!lesson) {
    app.setView(h('div.page', null,
      h('h1.page__title', null, 'Lesson not found'),
      h('a.btn.btn--primary', { href: '#/lessons' }, 'Back to lessons')));
    return null;
  }

  const unit = UNITS.find((u) => u.id === lesson.unit);
  let stepIndex = 0;
  let disposeStep = null;
  let unsubscribe = null;

  const progressBar = h('div.lesson__progress-fill');
  const stepHost = h('div.lesson__step');
  const counter = h('span.lesson__counter');

  const page = h('div.page.page--lesson', null,
    h('header.lesson__header', null,
      h('a.lesson__back', { href: '#/lessons' }, '← Lessons'),
      h('div.lesson__meta', null,
        unit ? h('span.lesson__unit', null, unit.title) : null,
        h('h1.lesson__title', null, lesson.title)),
      counter),
    h('div.lesson__progress', null, progressBar),
    stepHost,
  );

  app.setView(page, { title: lesson.title });

  function teardownStep() {
    if (typeof disposeStep === 'function') disposeStep();
    disposeStep = null;
    if (typeof unsubscribe === 'function') unsubscribe();
    unsubscribe = null;
    app.resetKeyboard();
  }

  function advance() {
    teardownStep();
    stepIndex += 1;
    if (stepIndex >= lesson.steps.length) finish();
    else showStep();
  }

  function finish() {
    const wasComplete = app.progress.isLessonComplete(lesson.id);
    app.progress.completeLesson(lesson.id);
    const next = nextLesson(lesson.id);
    counter.textContent = 'Complete';
    progressBar.style.width = '100%';
    stepHost.replaceChildren(h('div.step.step--done', null,
      h('div.step__flag', null, '✓'),
      h('h2.step__title', null, wasComplete ? 'Finished again' : 'Lesson complete'),
      h('p.prose', null, lesson.summary),
      h('div.step__actions', null,
        next ? h('a.btn.btn--primary', { href: `#/lesson/${next.id}` }, `Next: ${next.title}`) : null,
        h('a.btn.btn--ghost', { href: '#/lessons' }, 'Back to lessons'),
        h('button.btn.btn--ghost', {
          type: 'button',
          onclick: () => {
            stepIndex = 0;
            showStep();
          },
        }, 'Play this lesson again'))));
    if (!wasComplete) toast('Lesson complete', { tone: 'good' });
    announce('Lesson complete');
  }

  function showStep() {
    teardownStep();
    const step = lesson.steps[stepIndex];
    counter.textContent = `Step ${stepIndex + 1} of ${lesson.steps.length}`;
    progressBar.style.width = `${(stepIndex / lesson.steps.length) * 100}%`;

    const body = h('div.step', null,
      step.title ? h('h2.step__title', null, step.title) : null,
      step.body ? paragraphs(step.body) : null);

    const renderer = RENDERERS[step.type] ?? RENDERERS.text;
    disposeStep = renderer({ app, step, body, advance, onSubscribe: (fn) => { unsubscribe = fn; } }) ?? null;
    stepHost.replaceChildren(body);
  }

  showStep();

  return () => {
    teardownStep();
  };
}

// ---------------------------------------------------------------------------
// Step renderers. Each appends its own controls to `body` and calls
// `advance()` when the step is passed.
// ---------------------------------------------------------------------------

const RENDERERS = {
  text({ app, step, body, advance }) {
    if (step.highlight) {
      app.keyboard.ensureVisible(step.highlight.notes);
      app.keyboard.mark(step.highlight.notes, step.highlight.kind ?? 'hint');
    }
    if (step.labels) app.keyboard.setLabels(step.labels);
    if (step.staff) body.append(staffFigure(step.staff));
    body.append(h('div.step__actions', null,
      h('button.btn.btn--primary', { type: 'button', onclick: advance }, 'Continue')));
    return () => {
      if (step.labels) app.keyboard.setLabels(app.settings.get('showNoteNames'));
    };
  },

  find({ app, step, body, advance, onSubscribe }) {
    const status = h('div.step__status', null, step.prompt ?? 'Play the note');
    body.append(h('div.step__task', null, status));
    onSubscribe(app.onNote((event) => {
      if (event.type !== 'on') return;
      if (pitchClass(event.midi) === step.target.pitchClass) {
        status.textContent = `${midiToName(event.midi)} — correct`;
        status.classList.add('is-correct');
        app.keyboard.mark(event.midi, 'correct');
        setTimeout(advance, 550);
      } else {
        status.textContent = `That was ${midiToName(event.midi)}. Try again.`;
        status.classList.remove('is-correct');
        flash(app, event.midi);
      }
    }));
    return null;
  },

  play({ app, step, body, advance, onSubscribe }) {
    const notes = step.notes;
    app.keyboard.ensureVisible(notes);
    const chordMode = step.mode === 'chord';
    let index = 0;

    const status = h('div.step__status', null, step.prompt ?? 'Play the notes shown');
    const trail = h('div.notetrail', null, notes.map((midi, i) => h('span.notetrail__note', {
      dataset: { index: String(i) },
    }, midiToName(midi), step.fingers ? h('sup.notetrail__finger', null, String(step.fingers[i])) : null)));
    body.append(h('div.step__task', null, status, trail,
      h('button.btn.btn--ghost.btn--small', {
        type: 'button',
        onclick: () => (chordMode ? app.engine.playChord(notes, 1.4) : app.engine.playSequence(notes)),
      }, 'Hear it')));

    function paint() {
      app.keyboard.clearMarks();
      app.keyboard.clearFingers();
      if (chordMode) {
        app.keyboard.mark(notes, 'target');
        notes.forEach((midi, i) => step.fingers && app.keyboard.setFinger(midi, step.fingers[i]));
      } else {
        notes.slice(index).forEach((midi) => app.keyboard.mark(midi, 'target'));
        notes.slice(0, index).forEach((midi) => app.keyboard.mark(midi, 'correct'));
        if (notes[index] !== undefined) {
          app.keyboard.mark(notes[index], 'hint');
          if (step.fingers) app.keyboard.setFinger(notes[index], step.fingers[index]);
        }
      }
      for (const node of trail.children) {
        const i = Number(node.dataset.index);
        node.classList.toggle('is-done', !chordMode && i < index);
        node.classList.toggle('is-current', !chordMode && i === index);
      }
    }
    paint();

    onSubscribe(app.onNote((event) => {
      if (chordMode) {
        if (event.type !== 'on') return;
        const held = [...app.sounding].sort((a, b) => a - b);
        const target = [...notes].sort((a, b) => a - b);
        if (held.length === target.length && held.every((midi, i) => midi === target[i])) {
          status.textContent = 'That is the chord — nicely done.';
          status.classList.add('is-correct');
          app.keyboard.mark(notes, 'correct');
          setTimeout(advance, 700);
        } else if (held.length >= target.length) {
          status.textContent = 'Not quite — release and try again.';
        }
        return;
      }

      if (event.type !== 'on') return;
      if (event.midi === notes[index]) {
        index += 1;
        paint();
        if (index >= notes.length) {
          status.textContent = 'Correct.';
          status.classList.add('is-correct');
          setTimeout(advance, 550);
        } else {
          status.textContent = `Next: ${midiToName(notes[index])}`;
        }
      } else {
        status.textContent = `Expected ${midiToName(notes[index])}, heard ${midiToName(event.midi)}.`;
        status.classList.remove('is-correct');
        flash(app, event.midi);
      }
    }));
    return null;
  },

  staff({ app, step, body, advance, onSubscribe }) {
    const queue = shuffle(step.notes);
    let index = 0;
    const host = h('div.step__staff');
    const staff = new Staff(host, { clef: step.clef ?? 'treble', spacing: 14, minWidth: 240 });
    const status = h('div.step__status', null, step.prompt ?? 'Play the note on the staff');
    const score = h('span.step__score', null, `0 / ${queue.length}`);

    body.append(h('div.step__task', null, host, status, score));
    app.keyboard.ensureVisible(step.notes);

    function show() {
      staff.setEvents([{ midis: [queue[index]], duration: 'whole' }]);
      score.textContent = `${index} / ${queue.length}`;
    }
    show();

    onSubscribe(app.onNote((event) => {
      if (event.type !== 'on') return;
      if (event.midi === queue[index]) {
        staff.setState(0, 'correct');
        app.keyboard.mark(event.midi, 'correct');
        index += 1;
        setTimeout(() => {
          app.keyboard.clearMarks();
          if (index >= queue.length) {
            status.textContent = 'All correct.';
            advance();
          } else {
            show();
            status.textContent = step.prompt ?? 'Play the note on the staff';
          }
        }, 450);
      } else {
        staff.setState(0, 'wrong');
        status.textContent = `That was ${midiToName(event.midi)}. Look at where the note sits on the staff.`;
        flash(app, event.midi);
        setTimeout(() => staff.setState(0, ''), 700);
      }
    }));
    return null;
  },

  quiz({ step, body, advance }) {
    const feedback = h('div.step__status');
    const options = h('div.quiz__options');
    body.append(h('div.step__task', null,
      h('p.quiz__question', null, step.question),
      options,
      feedback));

    let answered = false;
    step.options.forEach((label, i) => {
      options.append(h('button.quiz__option', {
        type: 'button',
        onclick: (event) => {
          if (answered) return;
          const correct = i === step.answer;
          event.currentTarget.classList.add(correct ? 'is-correct' : 'is-wrong');
          if (!correct) {
            feedback.textContent = 'Not quite — try again.';
            return;
          }
          answered = true;
          for (const node of options.children) node.disabled = true;
          options.children[step.answer].classList.add('is-correct');
          feedback.textContent = step.explain ?? 'Correct.';
          feedback.classList.add('is-correct');
          body.append(h('div.step__actions', null,
            h('button.btn.btn--primary', { type: 'button', onclick: advance }, 'Continue')));
        },
      }, label));
    });
    return null;
  },

  metronome({ app, step, body, advance, onSubscribe }) {
    const wanted = step.beats ?? 8;
    let hits = 0;
    let lastBeatAt = 0;
    let usedBeat = true;

    const status = h('div.step__status', null, `${step.prompt ?? 'Play on each click'} — 0 / ${wanted}`);
    const pulse = h('div.pulse');
    body.append(h('div.step__task', null, pulse, status,
      h('button.btn.btn--primary.btn--small', {
        type: 'button',
        onclick: async (event) => {
          if (app.metronome.running) return;
          app.setTempo(step.tempo ?? 80);
          await app.toggleMetronome();
          event.currentTarget.textContent = 'Metronome running';
          event.currentTarget.disabled = true;
        },
      }, 'Start the metronome')));

    const previousOnBeat = app.metronome.onBeat;
    app.metronome.onBeat = (beat) => {
      lastBeatAt = performance.now();
      usedBeat = false;
      pulse.classList.toggle('is-accent', beat === 0);
      pulse.classList.add('is-on');
      setTimeout(() => pulse.classList.remove('is-on'), 110);
    };

    onSubscribe(app.onNote((event) => {
      if (event.type !== 'on' || !app.metronome.running) return;
      const offset = Math.abs(performance.now() - lastBeatAt);
      const beatMs = 60000 / app.metronome.tempo;
      // Count a note as on the beat if it lands within a quarter of a beat,
      // measured either just after this click or just before the next one.
      const onBeat = offset < beatMs * 0.25 || offset > beatMs * 0.75;
      if (onBeat && !usedBeat) {
        usedBeat = true;
        hits += 1;
        status.textContent = `${step.prompt ?? 'Play on each click'} — ${hits} / ${wanted}`;
        if (hits >= wanted) {
          status.classList.add('is-correct');
          status.textContent = 'Steady. Nicely in time.';
          app.metronome.stop();
          app.metronomeButton?.setAttribute('aria-pressed', 'false');
          app.metronomeButton?.classList.remove('is-on');
          setTimeout(advance, 700);
        }
      } else if (!onBeat) {
        status.textContent = 'That one was off the beat — listen for the click and land with it.';
      }
    }));

    return () => {
      app.metronome.onBeat = previousOnBeat;
    };
  },

  song({ app, step, body, advance }) {
    const song = getSong(step.songId);
    body.append(h('div.step__actions', null,
      song ? h('a.btn.btn--primary', { href: `#/song/${song.id}` }, `Open ${song.title}`) : null,
      h('button.btn.btn--ghost', { type: 'button', onclick: advance }, 'Done — continue')));
    return null;
  },
};

function staffFigure(config) {
  const host = h('figure.step__figure');
  const staffHost = h('div');
  host.append(staffHost);
  new Staff(staffHost, {
    clef: config.clef ?? 'treble',
    keySignature: config.keySignature ?? 0,
    spacing: 14,
    events: config.events ?? [],
  });
  return host;
}

function flash(app, midi) {
  app.keyboard.mark(midi, 'wrong');
  setTimeout(() => app.keyboard.unmark(midi, 'wrong'), 400);
}
