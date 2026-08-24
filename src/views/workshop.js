/**
 * Song workshop: the chords and grooves that popular music is made of.
 *
 * Pick a progression, a key and an accompaniment pattern, and the app plays it
 * while showing you exactly which keys each hand is on and why. Change the
 * groove without changing the chords and you hear the same four chords turn
 * from a ballad into a Latin track — which is the lesson.
 */

import { h, select, segmented, richText } from '../ui.js';
import { i18n, t } from '../i18n.js';
import { PROGRESSIONS, STYLES, getProgression, getStyle, renderGroove } from '../data/grooves.js';
import { KEY_SIGNATURES, keySignatureFor, nameToMidi } from '../theory.js';

const KEYS = Object.keys(KEY_SIGNATURES);

export function render(app) {
  let progressionId = 'four-chords';
  let styleId = 'ballad';
  let keyName = 'C';
  let hands = 'both';
  let groove = null;
  let run = null;

  const chart = h('div.chart');
  const recipe = h('div.recipe');
  const status = h('p.workshop__status', { role: 'status', 'aria-live': 'polite' });
  const playButton = h('button.btn.btn--primary', { type: 'button', onclick: () => (run ? stop() : play()) }, t('workshop.play'));

  const page = h('div.page', null,
    h('header.page__header', null,
      h('h1.page__title', null, t('workshop.title')),
      h('p.page__lede', null, t('workshop.lede'))),

    h('div.workshop__controls', null,
      select({
        label: t('workshop.progression'),
        value: progressionId,
        options: PROGRESSIONS.map((entry) => ({ value: entry.id, label: t(`workshop.progressions.${entry.id}.name`) })),
        onChange: (value) => { progressionId = value; rebuild(); },
      }),
      select({
        label: t('workshop.key'),
        value: keyName,
        options: KEYS.map((value) => ({ value, label: i18n.keyName(value, 'major') })),
        onChange: (value) => { keyName = value; rebuild(); },
      }),
      select({
        label: t('workshop.style'),
        value: styleId,
        options: STYLES.map((entry) => ({ value: entry.id, label: t(`workshop.styles.${entry.id}.name`) })),
        onChange: (value) => { styleId = value; rebuild(); },
      }),
      segmented({
        label: t('workshop.hands'),
        value: hands,
        options: [
          { value: 'both', label: t('workshop.handsBoth') },
          { value: 'left', label: t('workshop.handsLeft') },
          { value: 'right', label: t('workshop.handsRight') },
        ],
        onChange: (value) => { hands = value; rebuild(); },
      }),
      playButton,
    ),

    chart,
    status,
    recipe,

    h('section.card.workshop__method', null,
      h('h2.card__title', null, t('workshop.methodTitle')),
      h('div.prose', null, ...t('workshop.method').map((line) => h('p', null, richText(line)))),
    ),
  );

  // -- building ------------------------------------------------------------

  function rebuild() {
    stop();
    const progression = getProgression(progressionId);
    const style = getStyle(styleId);
    groove = renderGroove({ progression, tonic: nameToMidi(`${keyName}4`), style, hands });
    drawChart(progression);
    drawRecipe(progression, style);
    app.keyboard.ensureVisible(groove.notes.map((note) => note.midi));
  }

  /**
   * Which way to spell the black keys. Flat-side keys are written with flats,
   * and a numeral carrying its own flat — the borrowed chords that give minor
   * progressions their colour — is always written that way whatever the key.
   */
  function spelling(chord, progression) {
    return { flats: chord.offset < 0 || keySignatureFor(keyName, progression.mode) < 0 };
  }

  function drawChart(progression) {
    chart.replaceChildren(...groove.chords.map((chord) => {
      const how = spelling(chord, progression);
      return h('div.chart__cell', { dataset: { index: String(chord.index) } },
        h('span.chart__roman', null, chord.label),
        h('span.chart__symbol', null, i18n.chordSymbol(chord.root, chord.type, how)),
        h('span.chart__notes', null, chord.voicing.map((midi) => app.noteName(midi, how)).join(' ')),
        h('span.chart__bass', null, t('workshop.bassNote', {
          note: app.noteName(chord.bass, { ...how, octave: true }),
        })));
    }));
  }

  function drawRecipe(progression, style) {
    recipe.replaceChildren(
      h('section.card', null,
        h('h2.card__title', null, t(`workshop.progressions.${progression.id}.name`)),
        h('p.card__body', null, richText(t(`workshop.progressions.${progression.id}.about`)))),
      h('section.card', null,
        h('h2.card__title', null, t(`workshop.styles.${style.id}.name`)),
        h('p.card__body', null, richText(t(`workshop.styles.${style.id}.about`))),
        h('dl.recipe__hands', null,
          h('dt', null, t('workshop.leftHand')),
          h('dd', null, t(`workshop.styles.${style.id}.left`)),
          h('dt', null, t('workshop.rightHand')),
          h('dd', null, t(`workshop.styles.${style.id}.right`)))),
    );
  }

  // -- playing -------------------------------------------------------------

  // Notes are scheduled a little ahead of time rather than all at once: the
  // engine keeps one voice per pitch, so handing it a whole loop up front
  // would have later repeats of a note cancel earlier ones before they sound.
  const LOOKAHEAD = 0.25;
  const SCHEDULE_EVERY = 25;

  function secondsPerBeat() {
    return 60 / app.metronome.tempo;
  }

  async function play() {
    stop();
    await app.engine.resume();
    const spb = secondsPerBeat();
    run = {
      spb,
      start: app.engine.ctx.currentTime + 0.2,
      loop: groove.totalBeats * spb,
      pass: 0,
      next: 0, // index of the next note in the current pass
      marked: new Set(),
      frame: 0,
      timer: 0,
    };
    playButton.textContent = t('workshop.stop');
    status.textContent = t('workshop.playing');
    run.timer = setInterval(schedule, SCHEDULE_EVERY);
    schedule();
    tick();
  }

  /** Hand the engine every note that starts within the look-ahead window. */
  function schedule() {
    if (!run) return;
    const ctx = app.engine.ctx;
    const horizon = ctx.currentTime + LOOKAHEAD;

    while (run.next < groove.notes.length) {
      const note = groove.notes[run.next];
      const when = run.start + run.pass * run.loop + note.beat * run.spb;
      if (when > horizon) return;
      app.engine.noteOn(note.midi, {
        when,
        velocity: note.hand === 'left' ? 0.5 : 0.72,
        source: 'playback',
      });
      const release = when + Math.max(0.12, note.duration * run.spb * 0.9);
      setTimeout(() => app.engine.noteOff(note.midi, { source: 'playback' }),
        Math.max(0, (release - ctx.currentTime) * 1000));
      run.next += 1;
    }

    // Round again.
    run.pass += 1;
    run.next = 0;
  }

  /** One frame: light up the chord we are in and the keys that are sounding. */
  function tick() {
    if (!run) return;
    const elapsed = app.engine.ctx.currentTime - run.start;
    if (elapsed >= 0) {
      const beat = ((elapsed % run.loop) + run.loop) % run.loop / run.spb;
      const current = groove.chords.find((chord) => beat >= chord.beat && beat < chord.beat + chord.beats);
      for (const cell of chart.children) {
        cell.classList.toggle('is-current', Number(cell.dataset.index) === current?.index);
      }

      const sounding = new Set();
      for (const note of groove.notes) {
        if (beat >= note.beat && beat < note.beat + note.duration) sounding.add(note.midi);
      }
      for (const midi of run.marked) if (!sounding.has(midi)) app.keyboard.unmark(midi, 'target');
      for (const midi of sounding) if (!run.marked.has(midi)) app.keyboard.mark(midi, 'target');
      run.marked = sounding;
    }
    run.frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (!run) return;
    cancelAnimationFrame(run.frame);
    clearInterval(run.timer);
    run = null;
    app.engine.allNotesOff();
    app.keyboard.clearMarks('target');
    for (const cell of chart.children) cell.classList.remove('is-current');
    playButton.textContent = t('workshop.play');
    status.textContent = '';
  }

  app.setView(page, { title: t('workshop.title') });
  rebuild();

  return () => {
    stop();
    app.keyboard.clearMarks('target');
  };
}
