/**
 * Falling-note song player.
 *
 * Notes scroll down a canvas towards a hit line that sits directly above the
 * docked keyboard, so a falling block lands on the key you have to press. The
 * canvas is positioned to exactly match the keyboard's bounding box each time
 * the window resizes, which is what keeps the two aligned at any width.
 *
 * Three modes:
 *   listen     the app plays the piece; you watch
 *   wait       the music stops at each note until you play it
 *   play-along the music runs at tempo and your hits are scored
 */

import { h, segmented, percent, toast } from '../ui.js';
import { getSong } from '../data/songs.js';

const LOOKAHEAD_BEATS = 6;
const HIT_TOLERANCE_BEATS = 0.4;

export function render(app, { params }) {
  const song = getSong(params.id);
  if (!song) {
    app.setView(h('div.page', null,
      h('h1.page__title', null, 'Song not found'),
      h('a.btn.btn--primary', { href: '#/songs' }, 'Back to the library')));
    return null;
  }

  // -- state ---------------------------------------------------------------
  let mode = 'wait';
  let handFilter = 'both';
  let tempoScale = 1;
  let running = false;
  let position = 0; // in beats
  let lastFrame = 0;
  let frameHandle = null;
  let waitingFor = null;
  let startBeat = 0;
  let looping = false;

  const notes = song.notes.map((note, index) => ({ ...note, index, hit: false, missed: false, triggered: false }));
  const barLength = song.timeSignature[0];
  const totalBars = Math.ceil(song.lastBeat / barLength);

  let stats = { hit: 0, missed: 0, wrong: 0 };

  // -- DOM -----------------------------------------------------------------
  const canvas = h('canvas.player__canvas');
  const ctx = canvas.getContext('2d');
  const fall = h('div.player__fall', null, canvas, h('div.player__hitline'));
  const positionBar = h('div.player__position-fill');
  const readout = h('div.player__readout');
  const startButton = h('button.btn.btn--primary', { type: 'button', onclick: toggle }, 'Start');
  const tempoValue = h('span.control__value', null, `${song.tempo} bpm`);

  const page = h('div.page.page--player', null,
    h('header.player__header', null,
      h('a.lesson__back', { href: '#/songs' }, '← Songs'),
      h('div.player__titles', null,
        h('h1.player__title', null, song.title),
        h('p.player__composer', null, `${song.composer} · ${song.key} · ${song.timeSignature[0]}/${song.timeSignature[1]}`)),
      readout),

    h('div.player__controls', null,
      startButton,
      h('button.btn.btn--ghost', { type: 'button', onclick: restart }, 'Restart'),
      segmented({
        label: 'Mode',
        value: mode,
        options: [
          { value: 'wait', label: 'Wait for me' },
          { value: 'along', label: 'Play along' },
          { value: 'listen', label: 'Listen' },
        ],
        onChange: (value) => {
          mode = value;
          restart();
        },
      }),
      song.voices.length > 1 ? segmented({
        label: 'Hands',
        value: handFilter,
        options: [
          { value: 'both', label: 'Both' },
          { value: 'right', label: 'Right only' },
          { value: 'left', label: 'Left only' },
        ],
        onChange: (value) => {
          handFilter = value;
          restart();
        },
      }) : null,
      h('label.control', null,
        h('span.control__label', null, 'Tempo'),
        h('input.control__slider', {
          type: 'range', min: 30, max: 130, step: 5, value: 100,
          'aria-label': 'Tempo percentage',
          oninput: (event) => {
            tempoScale = Number(event.target.value) / 100;
            tempoValue.textContent = `${Math.round(song.tempo * tempoScale)} bpm`;
          },
        }),
        tempoValue),
      h('label.control', null,
        h('span.control__label', null, 'Start at bar'),
        h('select.control__select', {
          'aria-label': 'Start bar',
          onchange: (event) => {
            startBeat = Number(event.target.value);
            restart();
          },
        }, Array.from({ length: totalBars }, (_, i) => h('option', { value: String(i * barLength) }, String(i + 1))))),
      h('label.control.control--check', null,
        h('input', {
          type: 'checkbox',
          onchange: (event) => { looping = event.target.checked; },
        }),
        h('span', null, 'Loop')),
    ),

    fall,
    h('div.player__position', null, positionBar),
    h('p.player__about', null, song.about),
    h('p.player__legend', null,
      h('span.legend__swatch.legend__swatch--right'), ' right hand   ',
      h('span.legend__swatch.legend__swatch--left'), ' left hand   ',
      h('span.legend__swatch.legend__swatch--auto'), ' played for you'),
  );

  app.setView(page, { title: song.title });

  // -- geometry ------------------------------------------------------------

  let geometry = null;

  function measure() {
    const keyboardRect = app.keyboard.container.getBoundingClientRect();
    if (!keyboardRect.width) return;

    // The page is narrower than the keyboard, so the falling-note area is
    // pulled out of the page's content box to sit exactly above the keys.
    // Doing it in script rather than CSS keeps it correct at every width,
    // including when the page hits its max-width and centres itself.
    const page = fall.parentElement;
    const pageRect = page.getBoundingClientRect();
    const contentLeft = pageRect.left + parseFloat(getComputedStyle(page).paddingLeft || '0');
    fall.style.marginLeft = `${keyboardRect.left - contentLeft}px`;
    fall.style.width = `${keyboardRect.width}px`;

    const fallRect = fall.getBoundingClientRect();
    if (!fallRect.width) return;
    // Absolute children are positioned from the padding box, so the border
    // has to come out of the offset or every lane sits a pixel to the right.
    canvas.style.left = `${keyboardRect.left - fallRect.left - fall.clientLeft}px`;
    canvas.style.width = `${keyboardRect.width}px`;

    const ratio = window.devicePixelRatio || 1;
    const height = fall.clientHeight;
    canvas.height = Math.round(height * ratio);
    canvas.width = Math.round(keyboardRect.width * ratio);
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    geometry = app.keyboard.geometry();
    geometry.height = height;
  }

  function remeasure() {
    measure();
    draw();
  }

  // Make sure every note in the piece has a key to fall onto before measuring.
  app.keyboard.ensureVisible(notes.map((note) => note.midi));

  const resizeObserver = new ResizeObserver(remeasure);
  resizeObserver.observe(fall);
  resizeObserver.observe(app.keyboard.container);
  window.addEventListener('resize', remeasure);
  measure();

  // -- helpers -------------------------------------------------------------

  const isUserNote = (note) => {
    if (mode === 'listen') return false;
    if (handFilter === 'both') return true;
    return note.hand === handFilter;
  };

  /** Notes the learner is responsible for, grouped by onset beat. */
  function buildGroups() {
    const groups = [];
    for (const note of notes) {
      if (!isUserNote(note)) continue;
      if (note.beat < startBeat - 1e-6) continue;
      const last = groups[groups.length - 1];
      if (last && Math.abs(last.beat - note.beat) < 1e-6) last.notes.push(note);
      else groups.push({ beat: note.beat, notes: [note], satisfied: new Set() });
    }
    return groups;
  }

  let groups = [];
  let groupIndex = 0;

  function restart() {
    stop();
    position = startBeat - LOOKAHEAD_BEATS * 0.5;
    for (const note of notes) {
      note.hit = false;
      note.missed = false;
      note.triggered = false;
    }
    stats = { hit: 0, missed: 0, wrong: 0 };
    groups = buildGroups();
    groupIndex = 0;
    waitingFor = null;
    app.keyboard.clearMarks();
    updateReadout();
    draw();
  }

  function toggle() {
    if (running) stop();
    else start();
  }

  async function start() {
    await app.engine.resume();
    running = true;
    startButton.textContent = 'Pause';
    lastFrame = performance.now();
    frameHandle = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    startButton.textContent = 'Start';
    if (frameHandle) cancelAnimationFrame(frameHandle);
    frameHandle = null;
    app.engine.allNotesOff();
  }

  function updateReadout() {
    const attempted = stats.hit + stats.missed;
    const bar = Math.max(1, Math.floor(position / barLength) + 1);
    // replaceChildren is native and would stringify a null into the page.
    const parts = [h('span.player__bar', null, `Bar ${Math.min(bar, totalBars)} / ${totalBars}`)];
    if (mode !== 'listen') {
      parts.push(h('span.player__accuracy', null, attempted ? `${percent(stats.hit / attempted)} accurate` : 'Ready'));
    }
    readout.replaceChildren(...parts);
    positionBar.style.width = `${Math.min(100, Math.max(0, (position / song.lastBeat) * 100))}%`;
  }

  // -- playback ------------------------------------------------------------

  function triggerNote(note) {
    if (note.triggered) return;
    note.triggered = true;
    const seconds = (note.duration * 60) / (song.tempo * tempoScale);
    app.engine.playNote(note.midi, Math.min(seconds, 4), { velocity: note.hand === 'left' ? 0.55 : 0.75, source: 'playback' });
    app.keyboard.setActive(note.midi, true);
    setTimeout(() => app.keyboard.setActive(note.midi, false), Math.min(seconds, 4) * 1000);
  }

  function tick(now) {
    if (!running) return;
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    const beatsPerSecond = (song.tempo * tempoScale) / 60;
    let target = position + elapsed * beatsPerSecond;

    if (mode === 'wait') {
      const group = groups[groupIndex];
      if (group) {
        if (target >= group.beat) {
          target = group.beat;
          waitingFor = group;
          for (const note of group.notes) app.keyboard.mark(note.midi, 'target');
        }
      } else {
        waitingFor = null;
      }
    } else {
      waitingFor = null;
    }

    // Fire everything the playhead has passed since the last frame.
    for (const note of notes) {
      if (note.triggered || note.beat > target || note.beat < position - 0.05) continue;
      if (isUserNote(note) && mode !== 'listen') {
        if (mode === 'wait') continue; // the learner plays these
        // In play-along the note still sounds if it was hit; misses stay silent.
        note.triggered = true;
        continue;
      }
      triggerNote(note);
    }

    // Anything that scrolled past without being played counts as missed.
    if (mode === 'along') {
      for (const note of notes) {
        if (!isUserNote(note) || note.hit || note.missed) continue;
        if (target > note.beat + HIT_TOLERANCE_BEATS) {
          note.missed = true;
          stats.missed += 1;
        }
      }
    }

    position = target;

    if (position >= song.lastBeat + 1) {
      if (looping) {
        restart();
        start();
        return;
      }
      finish();
      return;
    }

    updateReadout();
    draw();
    frameHandle = requestAnimationFrame(tick);
  }

  function finish() {
    stop();
    const attempted = stats.hit + stats.missed;
    const accuracy = attempted ? stats.hit / attempted : 1;
    if (mode !== 'listen' && attempted > 0) {
      app.progress.recordSong(song.id, accuracy);
      toast(`${song.title} — ${percent(accuracy)} accurate`, { tone: accuracy > 0.9 ? 'good' : 'info' });
    }
    updateReadout();
    draw();
  }

  // -- drawing -------------------------------------------------------------

  const COLOURS = {
    right: { fill: '#4f8ef7', edge: '#8fb8ff' },
    left: { fill: '#e0973f', edge: '#f5c383' },
    auto: { fill: '#4a5568', edge: '#6b7688' },
    hit: { fill: '#3fbf7f', edge: '#8ee5b8' },
    missed: { fill: '#8a3b45', edge: '#b4646d' },
  };

  function draw() {
    if (!geometry) measure();
    if (!geometry) return;
    const height = geometry.height;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const pxPerBeat = height / LOOKAHEAD_BEATS;
    const hitLine = height - 4;

    ctx.clearRect(0, 0, width, height);

    // Bar lines give the eye something to measure against.
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    const firstBar = Math.floor(position / barLength) * barLength;
    for (let beat = firstBar; beat < position + LOOKAHEAD_BEATS; beat += barLength) {
      const y = hitLine - (beat - position) * pxPerBeat;
      if (y < 0 || y > height) continue;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Black-key lanes, so the falling notes read against the keyboard below.
    for (const [, key] of geometry.keys) {
      if (!key.black) continue;
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(key.x, 0, key.width, height);
    }

    for (const note of notes) {
      const fromNow = note.beat - position;
      if (fromNow > LOOKAHEAD_BEATS || note.beat + note.duration < position - 0.5) continue;
      const key = geometry.keys.get(note.midi);
      if (!key) continue;

      const noteHeight = Math.max(6, note.duration * pxPerBeat - 2);
      const y = hitLine - fromNow * pxPerBeat - noteHeight;
      const palette = note.hit ? COLOURS.hit
        : note.missed ? COLOURS.missed
          : !isUserNote(note) ? COLOURS.auto
            : COLOURS[note.hand] ?? COLOURS.right;

      const x = key.x + 1;
      const w = Math.max(3, key.width - 2);
      roundedRect(ctx, x, y, w, noteHeight, Math.min(4, w / 2));
      ctx.fillStyle = palette.fill;
      ctx.fill();
      ctx.strokeStyle = palette.edge;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Highlight the notes the player is waiting on.
    if (waitingFor) {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      for (const note of waitingFor.notes) {
        const key = geometry.keys.get(note.midi);
        if (key) ctx.fillRect(key.x, 0, key.width, height);
      }
    }
  }

  function roundedRect(context, x, y, w, hgt, r) {
    const radius = Math.min(r, w / 2, hgt / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + hgt, radius);
    context.arcTo(x + w, y + hgt, x, y + hgt, radius);
    context.arcTo(x, y + hgt, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
  }

  // -- input ---------------------------------------------------------------

  const unsubscribe = app.onNote((event) => {
    if (event.type !== 'on' || event.source === 'playback' || mode === 'listen') return;

    if (mode === 'wait') {
      const group = groups[groupIndex];
      if (!group || Math.abs(position - group.beat) > 1e-6) return;
      const match = group.notes.find((note) => note.midi === event.midi && !group.satisfied.has(note.index));
      if (!match) {
        stats.wrong += 1;
        app.keyboard.mark(event.midi, 'wrong');
        setTimeout(() => app.keyboard.unmark(event.midi, 'wrong'), 300);
        return;
      }
      group.satisfied.add(match.index);
      match.hit = true;
      stats.hit += 1;
      app.keyboard.unmark(match.midi, 'target');
      if (group.satisfied.size >= group.notes.length) {
        groupIndex += 1;
        waitingFor = null;
        app.keyboard.clearMarks('target');
      }
      updateReadout();
      draw();
      return;
    }

    // Play-along: match against the nearest unplayed note in the window.
    let best = null;
    let bestDistance = Infinity;
    for (const note of notes) {
      if (!isUserNote(note) || note.hit || note.missed || note.midi !== event.midi) continue;
      const distance = Math.abs(note.beat - position);
      if (distance < bestDistance && distance <= HIT_TOLERANCE_BEATS) {
        best = note;
        bestDistance = distance;
      }
    }
    if (best) {
      best.hit = true;
      stats.hit += 1;
    } else {
      stats.wrong += 1;
    }
    updateReadout();
  });

  restart();

  return () => {
    stop();
    unsubscribe();
    resizeObserver.disconnect();
    window.removeEventListener('resize', remeasure);
    app.keyboard.clearMarks();
  };
}
