/**
 * Rhythm drill: a rhythm is written out, the click starts, you tap it.
 *
 * The other four drills all ask about pitch — which note, which chord, which
 * key. This one asks about time, which is the thing beginners get wrong first
 * and notice last. Anything counts as a tap: a piano key, a computer key, the
 * pad on screen, or a MIDI keyboard.
 */

import { h, select, segmented, toast } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { RhythmStaff } from '../rhythm-staff.js';
import { Scoreboard, drillPage } from './drillkit.js';
import { LEVELS, buildExercise, metersForLevel, scoreTaps } from '../data/rhythms.js';

const BAR_CHOICES = [1, 2, 4];
const COUNT_IN_BARS = 1;

export function render(app) {
  const scoreboard = new Scoreboard(app, 'rhythm');
  const { page, stage, controls, status } = drillPage({
    title: t('rhythm.title'),
    lede: t('rhythm.lede'),
    scoreboard,
  });

  let level = 'quarters';
  let meter = '4/4';
  let bars = 2;
  let exercise = null;
  let run = null;      // set while the drill is running and taps are being counted
  let playback = null; // set while the rhythm is only being demonstrated

  const staffHost = h('div.drill__staff.drill__staff--rhythm');
  const staff = new RhythmStaff(staffHost, { spacing: 18, describe: describeExercise });

  // How many bars fit on a line depends on how wide the page is, so the
  // notation is re-laid-out when that changes rather than being scaled down.
  const resize = new ResizeObserver(([entry]) => {
    const width = Math.round(entry.contentRect.width);
    if (!width || Math.abs(width - staff.maxWidth) < 24) return;
    staff.maxWidth = width;
    staff.render();
  });
  resize.observe(staffHost);

  const countIn = h('div.rhythm__countin', { 'aria-hidden': 'true' });
  const pad = h('button.rhythm__pad', {
    type: 'button',
    onpointerdown: (event) => { event.preventDefault(); tap(); },
  }, h('span.rhythm__pad-label', null, t('rhythm.tapHere')));

  const startButton = h('button.btn.btn--primary', { type: 'button', onclick: () => (run ? stop() : start()) }, t('rhythm.start'));

  const meterSelect = select({
    label: t('rhythm.meter'),
    value: meter,
    options: metersForLevel(level).map((value) => ({ value, label: value })),
    onChange: (value) => { meter = value; newExercise(); },
  });

  controls.append(
    select({
      label: t('rhythm.level'),
      value: level,
      options: LEVELS.map((value) => ({ value, label: t(`rhythm.levels.${value}`) })),
      onChange: (value) => {
        level = value;
        const allowed = metersForLevel(level);
        if (!allowed.includes(meter)) meter = allowed[0];
        rebuildMeterOptions(allowed);
        newExercise();
      },
    }),
    meterSelect,
    segmented({
      label: t('rhythm.length'),
      value: String(bars),
      options: BAR_CHOICES.map((value) => ({ value: String(value), label: t('rhythm.barCount', { count: value, n: value }) })),
      onChange: (value) => { bars = Number(value); newExercise(); },
    }),
    startButton,
    h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => hear() }, t('rhythm.hearIt')),
    h('button.btn.btn--ghost.btn--small', { type: 'button', onclick: () => newExercise() }, t('rhythm.newRhythm')),
  );

  stage.append(countIn, staffHost, pad, h('p.drill__hint', null, t('rhythm.hint')));
  // The staff is measured once the stage is in the document, not before.

  // -- the exercise --------------------------------------------------------

  function rebuildMeterOptions(allowed) {
    const field = meterSelect.querySelector('select');
    field.replaceChildren(...allowed.map((value) => h('option', { value, selected: value === meter }, value)));
  }

  function describeExercise(current) {
    return t('rhythm.described', { meter: current.meter, count: current.onsets.length, n: current.onsets.length });
  }

  function newExercise() {
    stop();
    exercise = buildExercise({ level, meter, bars });
    meter = exercise.meter;
    staff.setExercise(exercise);
    status.textContent = '';
    status.className = 'drill__status';
  }

  function secondsPerClick() {
    // In 6/8 the click is an eighth note, so the tempo control counts eighths.
    return 60 / app.metronome.tempo;
  }

  /** Play the rhythm against the click, so the player can hear the target. */
  async function hear() {
    if (!exercise) return;
    stop();
    const spc = secondsPerClick();
    await app.clickTrack.start({
      secondsPerClick: spc,
      countInClicks: exercise.clicksPerBar * COUNT_IN_BARS,
      totalClicks: exercise.totalClicks,
      clicksPerBar: exercise.clicksPerBar,
      accents: exercise.accents,
    });
    app.clickTrack.playRhythm(exercise.onsets, { secondsPerClick: spc, at: app.clickTrack.startTime });
    followPlayhead(app.clickTrack.startTime, app.clickTrack.endTime, spc, { scoring: false });
  }

  async function start() {
    if (!exercise) return;
    stop();
    staff.clearStates();
    status.textContent = '';
    status.className = 'drill__status';

    const spc = secondsPerClick();
    await app.clickTrack.start({
      secondsPerClick: spc,
      countInClicks: exercise.clicksPerBar * COUNT_IN_BARS,
      totalClicks: exercise.totalClicks,
      clicksPerBar: exercise.clicksPerBar,
      accents: exercise.accents,
    });

    run = { taps: [], startTime: app.clickTrack.startTime, secondsPerClick: spc, frame: 0 };
    startButton.textContent = t('rhythm.stop');
    pad.classList.add('is-live');
    followPlayhead(app.clickTrack.startTime, app.clickTrack.endTime, spc, { scoring: true });
  }

  function stop() {
    if (run) cancelAnimationFrame(run.frame);
    if (playback) cancelAnimationFrame(playback.frame);
    run = null;
    playback = null;
    app.clickTrack.stop();
    staff.setPlayhead(null);
    countIn.textContent = '';
    pad.classList.remove('is-live');
    startButton.textContent = t('rhythm.start');
  }

  /** Drive the playhead and the count-in off the audio clock, not a timer. */
  function followPlayhead(from, until, spc, { scoring }) {
    const ctx = app.engine.ctx;
    const state = scoring ? run : (playback = { frame: 0 });

    const step = () => {
      const now = ctx.currentTime;
      if (now < from) {
        const remaining = Math.ceil((from - now) / spc);
        const clicksIn = exercise.clicksPerBar * COUNT_IN_BARS;
        countIn.textContent = i18n.number(Math.min(clicksIn, Math.max(1, remaining)));
        staff.setPlayhead(null);
      } else if (now <= until) {
        countIn.textContent = '';
        staff.setPlayhead(Math.min(exercise.totalClicks, (now - from) / spc));
      } else {
        staff.setPlayhead(null);
        countIn.textContent = '';
        if (scoring) finish();
        else stop();
        return;
      }
      state.frame = requestAnimationFrame(step);
    };
    state.frame = requestAnimationFrame(step);
  }

  function tap(at = null) {
    if (!run) return;
    const now = at ?? app.engine.ctx.currentTime;
    // Taps before the count-in ends are the player counting themselves in.
    if (now < run.startTime - run.secondsPerClick * 0.5) return;
    run.taps.push(now - run.startTime);
    app.clickTrack.tap();
    pad.classList.add('is-hit');
    setTimeout(() => pad.classList.remove('is-hit'), 90);
  }

  function finish() {
    const { taps, secondsPerClick: spc } = run;
    stop();
    const result = scoreTaps(exercise.onsets, taps, { secondsPerClick: spc });

    let onsetIndex = 0;
    for (const note of exercise.notes) {
      if (note.rest) continue;
      staff.setState(note.index, result.verdicts[onsetIndex].verdict);
      onsetIndex += 1;
    }

    scoreboard.record(result.passed);
    status.textContent = summarise(result);
    status.className = `drill__status ${result.passed ? 'is-correct' : 'is-wrong'}`;
    if (result.passed && scoreboard.streak > 0 && scoreboard.streak % 5 === 0) {
      toast(t('rhythm.streakToast', { count: scoreboard.streak, n: scoreboard.streak }), { tone: 'good' });
    }
  }

  function summarise(result) {
    const parts = [t('rhythm.inTime', { hits: result.hits, total: exercise.onsets.length })];
    if (result.missed) parts.push(t('rhythm.missed', { count: result.missed, n: result.missed }));
    if (result.extra) parts.push(t('rhythm.extra', { count: result.extra, n: result.extra }));
    // A consistent lean one way is worth naming; otherwise just say how tight
    // it was. Under about a fiftieth of a second nobody can hear the lean.
    if (result.meanSignedMs !== null && Math.abs(result.meanSignedMs) >= 20) {
      parts.push(result.meanSignedMs > 0
        ? t('rhythm.runningLate', { ms: result.meanSignedMs })
        : t('rhythm.runningEarly', { ms: -result.meanSignedMs }));
    } else if (result.meanAbsMs !== null) {
      parts.push(t('rhythm.steady', { ms: result.meanAbsMs }));
    }
    return parts.join(' · ');
  }

  // Any sounding note counts as a tap, wherever it came from.
  const unsubscribe = app.onNote((event) => {
    // event.time is stamped from the audio clock at the moment the note was
    // triggered, which is a truer reading than asking for it again here.
    if (event.type === 'on' && event.source !== 'playback') tap(event.time);
  });

  app.setView(page, { title: t('rhythm.title') });
  newExercise();

  return () => {
    unsubscribe();
    resize.disconnect();
    stop();
  };
}
