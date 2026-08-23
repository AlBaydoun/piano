/**
 * Lesson player.
 *
 * Steps are shown one at a time. A step that only needs reading has a
 * Continue button; a step that needs playing watches the note bus and
 * advances itself when you get it right.
 *
 * Structure comes from `data/lessons.js`; every word comes from the locale
 * bundle, addressed as `course.<lessonId>.steps.<index>.<field>`.
 */

import { h, paragraphs, toast, announce } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { getLesson, nextLesson, UNITS } from '../data/lessons.js';
import { Staff } from '../staff.js';
import { pitchClass, shuffle } from '../theory.js';
import { getSong } from '../data/songs.js';

export function render(app, { params }) {
  const lesson = getLesson(params.id);
  if (!lesson) {
    app.setView(h('div.page', null,
      h('h1.page__title', null, t('lesson.notFound')),
      h('a.btn.btn--primary', { href: '#/lessons' }, t('lesson.backToLessons'))));
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
      h('a.lesson__back', { href: '#/lessons' }, t('lesson.backToLessons')),
      h('div.lesson__meta', null,
        unit ? h('span.lesson__unit', null, t(`units.${unit.id}.title`)) : null,
        h('h1.lesson__title', null, t(`course.${lesson.id}.title`))),
      counter),
    h('div.lesson__progress', null, progressBar),
    stepHost,
  );

  app.setView(page, { title: t(`course.${lesson.id}.title`) });

  /** Localised text for one step of this lesson. */
  const text = (index, field) => t(`course.${lesson.id}.steps.${index}.${field}`);
  const hasText = (index, field) => i18n.has(`course.${lesson.id}.steps.${index}.${field}`);

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
    counter.textContent = t('lesson.complete');
    progressBar.style.width = '100%';
    stepHost.replaceChildren(h('div.step.step--done', null,
      h('div.step__flag', { 'aria-hidden': 'true' }, '✓'),
      h('h2.step__title', null, wasComplete ? t('lesson.finishedAgain') : t('lesson.lessonComplete')),
      h('p.prose', null, t(`course.${lesson.id}.summary`)),
      h('div.step__actions', null,
        next ? h('a.btn.btn--primary', { href: `#/lesson/${next.id}` },
          t('lesson.nextLesson', { title: t(`course.${next.id}.title`) })) : null,
        h('a.btn.btn--ghost', { href: '#/lessons' }, t('lesson.backToLessons')),
        h('button.btn.btn--ghost', {
          type: 'button',
          onclick: () => {
            stepIndex = 0;
            showStep();
          },
        }, t('lesson.playAgain')))));
    if (!wasComplete) toast(t('lesson.lessonComplete'), { tone: 'good' });
    announce(t('lesson.lessonComplete'));
  }

  function showStep() {
    teardownStep();
    const step = lesson.steps[stepIndex];
    counter.textContent = t('lesson.stepCounter', { current: stepIndex + 1, total: lesson.steps.length });
    progressBar.style.width = `${(stepIndex / lesson.steps.length) * 100}%`;

    const body = h('div.step', null,
      hasText(stepIndex, 'title') ? h('h2.step__title', null, text(stepIndex, 'title')) : null,
      hasText(stepIndex, 'body') ? paragraphs(text(stepIndex, 'body')) : null);

    const renderer = RENDERERS[step.type] ?? RENDERERS.text;
    disposeStep = renderer({
      app, step, body, advance,
      index: stepIndex,
      text, hasText,
      onSubscribe: (fn) => { unsubscribe = fn; },
    }) ?? null;
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
    if (step.staff) body.append(staffFigure(app, step.staff));
    body.append(h('div.step__actions', null,
      h('button.btn.btn--primary', { type: 'button', onclick: advance }, t('actions.continue'))));
    return () => {
      if (step.labels) app.keyboard.setLabels(app.settings.get('showNoteNames'));
    };
  },

  find(context) {
    const { app, step, body, advance, index, text } = context;
    const status = h('div.step__status', null, text(index, 'prompt'));
    body.append(h('div.step__task', null, status));
    return subscribe(context, (event) => {
      if (event.type !== 'on') return;
      if (pitchClass(event.midi) === step.target.pitchClass) {
        status.textContent = t('lesson.correctNote', { note: app.noteName(event.midi, { octave: true }) });
        status.classList.add('is-correct');
        app.keyboard.mark(event.midi, 'correct');
        setTimeout(advance, 550);
      } else {
        status.textContent = t('lesson.thatWas', { note: app.noteName(event.midi, { octave: true }) });
        status.classList.remove('is-correct');
        flash(app, event.midi);
      }
    });
  },

  play(context) {
    const { app, step, body, advance, index, text } = context;
    const notes = step.notes;
    app.keyboard.ensureVisible(notes);
    const chordMode = step.mode === 'chord';
    let position = 0;

    const status = h('div.step__status', null, text(index, 'prompt'));
    const trail = h('div.notetrail', null, notes.map((midi, i) => h('span.notetrail__note', {
      dataset: { index: String(i) },
      dir: 'ltr',
    }, app.noteName(midi), step.fingers ? h('sup.notetrail__finger', null, String(step.fingers[i])) : null)));
    body.append(h('div.step__task', null, status, trail,
      h('button.btn.btn--ghost.btn--small', {
        type: 'button',
        onclick: () => (chordMode ? app.engine.playChord(notes, 1.4) : app.engine.playSequence(notes)),
      }, t('actions.hear'))));

    function paint() {
      app.keyboard.clearMarks();
      app.keyboard.clearFingers();
      if (chordMode) {
        app.keyboard.mark(notes, 'target');
        notes.forEach((midi, i) => step.fingers && app.keyboard.setFinger(midi, step.fingers[i]));
      } else {
        notes.slice(position).forEach((midi) => app.keyboard.mark(midi, 'target'));
        notes.slice(0, position).forEach((midi) => app.keyboard.mark(midi, 'correct'));
        if (notes[position] !== undefined) {
          app.keyboard.mark(notes[position], 'hint');
          if (step.fingers) app.keyboard.setFinger(notes[position], step.fingers[position]);
        }
      }
      for (const node of trail.children) {
        const i = Number(node.dataset.index);
        node.classList.toggle('is-done', !chordMode && i < position);
        node.classList.toggle('is-current', !chordMode && i === position);
      }
    }
    paint();

    return subscribe(context, (event) => {
      if (chordMode) {
        if (event.type !== 'on') return;
        const held = [...app.sounding].sort((a, b) => a - b);
        const target = [...notes].sort((a, b) => a - b);
        if (held.length === target.length && held.every((midi, i) => midi === target[i])) {
          status.textContent = t('lesson.chordCorrect');
          status.classList.add('is-correct');
          app.keyboard.mark(notes, 'correct');
          setTimeout(advance, 700);
        } else if (held.length >= target.length) {
          status.textContent = t('lesson.chordWrong');
        }
        return;
      }

      if (event.type !== 'on') return;
      if (event.midi === notes[position]) {
        position += 1;
        paint();
        if (position >= notes.length) {
          status.textContent = t('lesson.correct');
          status.classList.add('is-correct');
          setTimeout(advance, 550);
        } else {
          status.textContent = t('lesson.nextNote', { note: app.noteName(notes[position], { octave: true }) });
        }
      } else {
        status.textContent = t('lesson.expected', {
          expected: app.noteName(notes[position], { octave: true }),
          heard: app.noteName(event.midi, { octave: true }),
        });
        status.classList.remove('is-correct');
        flash(app, event.midi);
      }
    });
  },

  staff(context) {
    const { app, step, body, advance, index, text } = context;
    const queue = shuffle(step.notes);
    let position = 0;
    const host = h('div.step__staff');
    const staff = new Staff(host, { clef: step.clef ?? 'treble', spacing: 15, minWidth: 240 });
    const status = h('div.step__status', null, text(index, 'prompt'));
    const score = h('span.step__score', { dir: 'ltr' }, `0 / ${queue.length}`);

    body.append(h('div.step__task', null, host, status, score));
    app.keyboard.ensureVisible(step.notes);

    function show() {
      staff.setEvents([{ midis: [queue[position]], duration: 'whole' }]);
      score.textContent = `${position} / ${queue.length}`;
    }
    show();

    return subscribe(context, (event) => {
      if (event.type !== 'on') return;
      if (event.midi === queue[position]) {
        staff.setState(0, 'correct');
        app.keyboard.mark(event.midi, 'correct');
        position += 1;
        setTimeout(() => {
          app.keyboard.clearMarks();
          if (position >= queue.length) {
            status.textContent = t('lesson.allCorrect');
            advance();
          } else {
            show();
            status.textContent = text(index, 'prompt');
          }
        }, 450);
      } else {
        staff.setState(0, 'wrong');
        status.textContent = t('lesson.staffWrong', { note: app.noteName(event.midi, { octave: true }) });
        flash(app, event.midi);
        setTimeout(() => staff.setState(0, ''), 700);
      }
    });
  },

  listen({ app, step, body, advance, index, text, hasText }) {
    const play = () => {
      let delay = 0;
      for (const example of step.examples) {
        const hold = example.hold ?? 1;
        const velocity = example.velocity ?? 0.75;
        const notes = example.notes;
        setTimeout(() => {
          if (example.chord) app.engine.playChord(notes, hold, { velocity });
          else app.engine.playSequence(notes, { noteDuration: hold, gap: example.gap ?? 0.12, velocity });
        }, delay * 1000);
        const span = example.chord ? hold : notes.length * (hold + (example.gap ?? 0.12));
        delay += span + 0.45;
      }
    };

    body.append(h('div.step__task', null,
      h('div.step__status', null, hasText(index, 'prompt') ? text(index, 'prompt') : t('lesson.listenPrompt')),
      h('button.btn.btn--primary', { type: 'button', onclick: play }, t('lesson.playExamples'))));
    body.append(h('div.step__actions', null,
      h('button.btn.btn--ghost', { type: 'button', onclick: advance }, t('actions.continue'))));

    setTimeout(play, 350);
    return null;
  },

  quiz({ body, step, advance, index, text }) {
    const feedback = h('div.step__status');
    const options = h('div.quiz__options');
    body.append(h('div.step__task', null,
      h('p.quiz__question', null, text(index, 'question')),
      options,
      feedback));

    let answered = false;
    text(index, 'options').forEach((label, i) => {
      options.append(h('button.quiz__option', {
        type: 'button',
        onclick: (event) => {
          if (answered) return;
          const correct = i === step.answer;
          event.currentTarget.classList.add(correct ? 'is-correct' : 'is-wrong');
          if (!correct) {
            feedback.textContent = t('lesson.quizWrong');
            return;
          }
          answered = true;
          for (const node of options.children) node.disabled = true;
          options.children[step.answer].classList.add('is-correct');
          feedback.textContent = text(index, 'explain');
          feedback.classList.add('is-correct');
          body.append(h('div.step__actions', null,
            h('button.btn.btn--primary', { type: 'button', onclick: advance }, t('actions.continue'))));
        },
      }, label));
    });
    return null;
  },

  metronome(context) {
    const { app, step, body, advance, index, text } = context;
    const wanted = step.beats ?? 8;
    const prompt = text(index, 'prompt');
    let hits = 0;
    let lastBeatAt = 0;
    let usedBeat = true;

    const status = h('div.step__status', null, t('lesson.metronomeProgress', { prompt, done: 0, total: wanted }));
    const pulse = h('div.pulse');
    body.append(h('div.step__task', null, pulse, status,
      h('button.btn.btn--primary.btn--small', {
        type: 'button',
        onclick: async (event) => {
          if (app.metronome.running) return;
          app.metronome.beatsPerBar = step.beatsPerBar ?? 4;
          app.setTempo(step.tempo ?? 80);
          await app.toggleMetronome();
          event.currentTarget.textContent = t('lesson.metronomeRunning');
          event.currentTarget.disabled = true;
        },
      }, t('lesson.metronomeStart'))));

    const previousOnBeat = app.metronome.onBeat;
    const previousBeatsPerBar = app.metronome.beatsPerBar;
    app.metronome.onBeat = (beat) => {
      lastBeatAt = performance.now();
      usedBeat = false;
      pulse.classList.toggle('is-accent', beat === 0);
      pulse.classList.add('is-on');
      setTimeout(() => pulse.classList.remove('is-on'), 110);
    };

    const unsub = subscribe(context, (event) => {
      if (event.type !== 'on' || !app.metronome.running) return;
      const offset = Math.abs(performance.now() - lastBeatAt);
      const beatMs = 60000 / app.metronome.tempo;
      // Count a note as on the beat if it lands within a quarter of a beat,
      // measured either just after this click or just before the next one.
      const onBeat = offset < beatMs * 0.25 || offset > beatMs * 0.75;
      if (onBeat && !usedBeat) {
        usedBeat = true;
        hits += 1;
        status.textContent = t('lesson.metronomeProgress', { prompt, done: hits, total: wanted });
        if (hits >= wanted) {
          status.classList.add('is-correct');
          status.textContent = t('lesson.metronomeSteady');
          app.metronome.stop();
          app.metronomeButton?.setAttribute('aria-pressed', 'false');
          app.metronomeButton?.classList.remove('is-on');
          setTimeout(advance, 700);
        }
      } else if (!onBeat) {
        status.textContent = t('lesson.metronomeOff');
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
      app.metronome.onBeat = previousOnBeat;
      app.metronome.beatsPerBar = previousBeatsPerBar;
    };
  },

  song({ step, body, advance }) {
    const song = getSong(step.songId);
    body.append(h('div.step__actions', null,
      song ? h('a.btn.btn--primary', { href: `#/song/${song.id}` },
        t('actions.open', { name: t(`songs.${song.id}.title`) })) : null,
      h('button.btn.btn--ghost', { type: 'button', onclick: advance }, t('actions.done'))));
    return null;
  },
};

/** Register a note listener through the context, returning a disposer. */
function subscribe(context, handler) {
  context.onSubscribe(context.app.onNote(handler));
  return null;
}

function staffFigure(app, config) {
  const host = h('figure.step__figure');
  const staffHost = h('div');
  host.append(staffHost);
  new Staff(staffHost, {
    clef: config.clef ?? 'treble',
    keySignature: config.keySignature ?? 0,
    timeSignature: config.timeSignature ?? null,
    spacing: 15,
    events: (config.events ?? []).map((event) => ({
      ...event,
      label: event.label !== undefined
        ? app.noteName(event.label, { octave: true })
        : event.labelKey
          ? t(event.labelKey)
          : undefined,
    })),
  });
  return host;
}

function flash(app, midi) {
  app.keyboard.mark(midi, 'wrong');
  setTimeout(() => app.keyboard.unmark(midi, 'wrong'), 400);
}
