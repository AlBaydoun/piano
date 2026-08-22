/**
 * Rhythm notation on a single line.
 *
 * Pitch notation lives in staff.js; this is its rhythmic cousin. A one-line
 * staff is what rhythm exercises are actually written on, and dropping the
 * four other lines means the eye has nothing to read but the timing — which
 * is the whole point of the drill.
 *
 * Two things it does that the five-line staff does not: notes are spaced in
 * proportion to how long they last, so the picture matches the shape of the
 * sound; and when the music is too long for one line it wraps onto another,
 * because sixteen bars squeezed into one system is not readable at any size.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/** How many beams or flags each value takes. Anything longer takes none. */
const BEAM_COUNT = { eighth: 1, sixteenth: 2 };
const STEMMED = new Set(['half', 'quarter', 'eighth', 'sixteenth']);
const HOLLOW = new Set(['whole', 'half']);

/** Positions carry a third of a click sometimes, which binary cannot hold. */
const EPSILON = 1e-6;

/**
 * Stem length, in spacing units. Printed music uses three and a half staff
 * spaces, but with only one line on the page there is nothing to measure that
 * against and it reads as too long, so this is a little shorter.
 */
const STEM_LENGTH = 3;

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== null && value !== undefined) node.setAttribute(key, String(value));
  }
  return node;
}

export class RhythmStaff {
  /**
   * @param {HTMLElement} container
   * @param {object} [options]
   * @param {number} [options.spacing]   the size unit everything is drawn from
   * @param {number} [options.maxWidth]  wrap onto a new line beyond this
   * @param {(exercise: object) => string} [options.describe]  the accessible label
   */
  constructor(container, options = {}) {
    this.container = container;
    this.spacing = options.spacing ?? 13;
    this.maxWidth = options.maxWidth ?? 1080;
    this.describe = options.describe ?? (() => 'Rhythm');
    this.exercise = options.exercise ?? null;
    /** @type {Map<number, string>} note index to verdict */
    this.states = new Map();
    this.render();
  }

  setExercise(exercise) {
    this.exercise = exercise;
    this.states.clear();
    this.render();
  }

  /** Mark one note with a verdict: 'on', 'early', 'late' or 'missed'. */
  setState(index, verdict) {
    this.states.set(index, verdict);
    const node = this.svg?.querySelector(`[data-index="${index}"]`);
    if (node) node.setAttribute('class', `rhythm__note is-${verdict}`);
  }

  clearStates() {
    this.states.clear();
    for (const node of this.svg?.querySelectorAll('.rhythm__note') ?? []) {
      node.setAttribute('class', 'rhythm__note');
    }
  }

  /**
   * Move the playhead, in clicks from the start of the exercise. null hides it.
   */
  setPlayhead(click) {
    if (!this.playhead) return;
    if (click === null || !this.exercise) {
      this.playhead.setAttribute('opacity', '0');
      return;
    }
    const { x, y } = this._place(click);
    this.playhead.setAttribute('opacity', '1');
    this.playhead.setAttribute('x1', x);
    this.playhead.setAttribute('x2', x);
    this.playhead.setAttribute('y1', y - this.spacing * 3.6);
    this.playhead.setAttribute('y2', y + this.spacing * 2.4);
  }

  /** Where on the page a position in the music lands. */
  _place(click, bar = null) {
    const { clicksPerBar } = this.exercise;
    const index = bar ?? Math.min(this.totalBars - 1, Math.floor(click / clicksPerBar + EPSILON));
    const system = Math.floor(index / this.barsPerSystem);
    const withinSystem = index % this.barsPerSystem;
    return {
      x: this.startX + withinSystem * this.barWidth + (click - index * clicksPerBar) * this.unitWidth,
      y: this.topY + system * this.systemHeight,
    };
  }

  render() {
    const container = this.container;
    container.innerHTML = '';
    container.classList.add('rhythm');
    this.svg = null;
    this.playhead = null;
    const exercise = this.exercise;
    if (!exercise) return;

    const s = this.spacing;
    const { clicksPerBar, totalClicks, notes, meter } = exercise;

    // Space notes in proportion to their length, but widely enough that the
    // shortest note in the exercise still has room for its notehead.
    const shortest = Math.min(...notes.map((note) => note.clicks));
    const natural = clamp((s * 1.7) / shortest, s * 3.2, s * 9);
    this.totalBars = Math.round(totalClicks / clicksPerBar);

    const timeWidth = s * 2.6;
    // The gap after the time signature keeps the first notehead clear of it.
    this.startX = s * 1.4 + timeWidth + s;
    const rightPad = s * 1.6;
    const room = this.maxWidth - this.startX - rightPad;

    // As many bars per line as fit at the natural spacing; at least one,
    // however wide that bar turns out to be.
    this.barsPerSystem = clamp(Math.floor(room / (clicksPerBar * natural)), 1, this.totalBars);
    const systems = Math.ceil(this.totalBars / this.barsPerSystem);

    // Then stretch to fill the line, the way printed music is justified —
    // otherwise two bars of half notes sit in a corner of a wide page.
    const fill = room / (this.barsPerSystem * clicksPerBar);
    this.unitWidth = clamp(fill, natural, s * 9);
    this.barWidth = clicksPerBar * this.unitWidth;

    this.systemHeight = s * 9;
    // Room above the line for stems, and for a tuplet bracket if there is one.
    this.topY = notes.some((note) => note.tuplet) ? s * 5 : s * 4.1;
    const width = this.startX + Math.min(this.barsPerSystem, this.totalBars) * this.barWidth + rightPad;
    const height = this.topY + (systems - 1) * this.systemHeight + s * 3.6;

    const svg = el('svg', {
      class: 'rhythm__svg',
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': this.describe(exercise),
    });
    this.svg = svg;

    const [beats, unit] = meter.split('/');
    for (let system = 0; system < systems; system += 1) {
      const y = this.topY + system * this.systemHeight;
      const barsHere = Math.min(this.barsPerSystem, this.totalBars - system * this.barsPerSystem);
      const right = this.startX + barsHere * this.barWidth;

      svg.append(el('line', { class: 'rhythm__line', x1: s * 0.8, x2: right + s * 0.4, y1: y, y2: y }));

      // The time signature is stated once, as it is in printed music.
      if (system === 0) {
        for (const [text, ty] of [[beats, y - s * 1.1], [unit, y + s * 1.1]]) {
          const glyph = el('text', {
            class: 'rhythm__time', x: s * 1.4 + timeWidth / 2, y: ty,
            'font-size': s * 2.2, 'dominant-baseline': 'central', 'text-anchor': 'middle',
          });
          glyph.textContent = text;
          svg.append(glyph);
        }
      }

      // Barlines within the system, then the one that closes it.
      for (let bar = 1; bar < barsHere; bar += 1) {
        const x = this.startX + bar * this.barWidth - s * 0.9;
        svg.append(el('line', { class: 'rhythm__bar', x1: x, x2: x, y1: y - s * 1.5, y2: y + s * 1.5 }));
      }
      const last = system === systems - 1;
      svg.append(el('line', {
        class: 'rhythm__bar', x1: right - s * 0.45, x2: right - s * 0.45, y1: y - s * 1.5, y2: y + s * 1.5,
      }));
      if (last) {
        svg.append(el('line', {
          class: 'rhythm__bar rhythm__bar--final', x1: right + s * 0.4, x2: right + s * 0.4,
          y1: y - s * 1.5, y2: y + s * 1.5,
        }));
      }
    }

    for (const note of notes) this._drawNote(svg, note);
    this._drawBeams(svg, notes);
    this._drawTuplets(svg, notes);

    this.playhead = el('line', { class: 'rhythm__playhead', x1: 0, x2: 0, y1: 0, y2: 0, opacity: 0 });
    svg.append(this.playhead);

    container.append(svg);
    for (const [index, verdict] of this.states) this.setState(index, verdict);
  }

  /** Where a note's stem sits, so beams and brackets can find it. */
  _stemX(note) {
    return this._place(note.click, note.bar).x + this.spacing * 0.62;
  }

  _stemTop(note) {
    return this._place(note.click, note.bar).y - this.spacing * STEM_LENGTH;
  }

  _drawNote(svg, note) {
    const s = this.spacing;
    const { x, y } = this._place(note.click, note.bar);
    const group = el('g', { class: 'rhythm__note', 'data-index': note.index });

    if (note.rest) {
      group.append(restShape(note.value, x + s * 0.3, y, s));
      if (note.dotted) group.append(el('circle', { class: 'rhythm__dot', cx: x + s * 1.4, cy: y - s * 0.5, r: s * 0.16 }));
      svg.append(group);
      return;
    }

    group.append(el('ellipse', {
      class: `rhythm__head ${HOLLOW.has(note.value) ? 'is-hollow' : ''}`,
      cx: x, cy: y, rx: s * 0.62, ry: s * 0.46, transform: `rotate(-18 ${x} ${y})`,
    }));
    if (STEMMED.has(note.value)) {
      group.append(el('line', {
        class: 'rhythm__stem', x1: x + s * 0.62, x2: x + s * 0.62, y1: y - s * 0.2, y2: y - s * STEM_LENGTH,
      }));
    }
    if (note.dotted) {
      group.append(el('circle', { class: 'rhythm__dot', cx: x + s * 1.15, cy: y - s * 0.5, r: s * 0.16 }));
    }
    svg.append(group);
  }

  /**
   * Beam runs of eighths and sixteenths, and flag the ones that stand alone.
   *
   * Notes are beamed only within a beat — which is what beams are *for*: they
   * show the reader where the beats are. Since a beat never crosses a barline,
   * a beam never crosses a line break either.
   */
  _drawBeams(svg, notes) {
    const s = this.spacing;
    const group = this.exercise.meter.endsWith('/8') ? 3 : 1;
    const beat = (note) => Math.floor((note.click + EPSILON) / group);
    const runs = [];
    let run = [];
    const flush = () => { if (run.length) runs.push(run); run = []; };

    for (const note of notes) {
      const beamable = !note.rest && BEAM_COUNT[note.value];
      const sameBeat = run.length && beat(run[0]) === beat(note);
      if (beamable && (!run.length || sameBeat)) run.push(note);
      else { flush(); if (beamable) run.push(note); }
    }
    flush();

    for (const inRun of runs) {
      if (inRun.length === 1) {
        this._drawFlags(svg, inRun[0]);
        continue;
      }
      const top = this._stemTop(inRun[0]);
      svg.append(el('line', {
        class: 'rhythm__beam', x1: this._stemX(inRun[0]), x2: this._stemX(inRun.at(-1)), y1: top, y2: top,
      }));

      // A second beam spans only the sixteenths inside the run.
      let start = null;
      inRun.forEach((note, i) => {
        const isSixteenth = BEAM_COUNT[note.value] === 2;
        if (isSixteenth && start === null) start = i;
        if (start === null) return;
        if (isSixteenth && i < inRun.length - 1) return;
        const from = inRun[start];
        const to = inRun[isSixteenth ? i : i - 1];
        const y = top + s * 0.62;
        // A lone sixteenth in a run gets a stub pointing into the beam.
        const [x1, x2] = from === to
          ? [this._stemX(from), this._stemX(from) + s * 0.7]
          : [this._stemX(from), this._stemX(to)];
        svg.append(el('line', { class: 'rhythm__beam', x1, x2, y1: y, y2: y }));
        start = null;
      });
    }
  }

  _drawFlags(svg, note) {
    const s = this.spacing;
    const x = this._stemX(note);
    const top = this._stemTop(note);
    for (let i = 0; i < BEAM_COUNT[note.value]; i += 1) {
      const y = top + i * s * 0.62;
      svg.append(el('path', {
        class: 'rhythm__flag',
        d: `M ${x} ${y} q ${s * 0.72} ${s * 0.5} ${s * 0.42} ${s * 1.35}`,
        fill: 'none',
      }));
    }
  }

  /** A bracketed 3 over each run of triplets. */
  _drawTuplets(svg, notes) {
    const s = this.spacing;
    let run = [];
    const flush = () => {
      if (run.length > 1) {
        const y = this._stemTop(run[0]) - s * 1.1;
        const x1 = this._place(run[0].click, run[0].bar).x - s * 0.3;
        const x2 = this._place(run.at(-1).click, run.at(-1).bar).x + s * 1.2;
        const mid = (x1 + x2) / 2;
        svg.append(el('path', {
          class: 'rhythm__tuplet',
          d: `M ${x1} ${y + s * 0.4} L ${x1} ${y} L ${mid - s * 0.5} ${y}`
           + ` M ${mid + s * 0.5} ${y} L ${x2} ${y} L ${x2} ${y + s * 0.4}`,
          fill: 'none',
        }));
        const label = el('text', {
          class: 'rhythm__tuplet-number', x: mid, y, 'font-size': s * 1.25,
          'dominant-baseline': 'central', 'text-anchor': 'middle',
        });
        label.textContent = String(run[0].tuplet);
        svg.append(label);
      }
      run = [];
    };
    for (const note of notes) {
      // A tuplet is bracketed within one bar; it cannot straddle a barline.
      if (note.tuplet && (!run.length || run[0].bar === note.bar)) run.push(note);
      else { flush(); if (note.tuplet) run.push(note); }
    }
    flush();
  }
}

/**
 * Rests, drawn rather than typed: no music font is guaranteed to be present,
 * and a missing glyph in a rhythm exercise is not a cosmetic problem.
 */
function restShape(value, x, y, s) {
  if (value === 'whole' || value === 'half') {
    // The whole rest hangs below a line, the half rest sits on top of one.
    const top = value === 'whole' ? y : y - s * 0.5;
    return el('rect', { class: 'rhythm__rest', x: x - s * 0.55, y: top, width: s * 1.1, height: s * 0.5 });
  }

  if (value === 'quarter') {
    // The zigzag, top to bottom, finishing with the little hook that curls
    // back to the right.
    return el('path', {
      class: 'rhythm__rest-stroke',
      d: `M ${x - s * 0.32} ${y - s * 1.45} l ${s * 0.62} ${s * 0.8}`
       + ` l ${-s * 0.58} ${s * 0.78} l ${s * 0.66} ${s * 0.72}`
       + ` q ${-s * 0.8} ${-s * 0.34} ${-s * 0.3} ${s * 0.6}`,
      fill: 'none',
    });
  }

  // Eighth and sixteenth rests: a stroke leaning back from upper right to
  // lower left, with one blob hanging off its left for each beam.
  const hooks = BEAM_COUNT[value] ?? 1;
  const top = y - s * (0.9 + hooks * 0.35);
  const group = el('g', { class: 'rhythm__rest-group' });
  group.append(el('line', {
    class: 'rhythm__rest-stroke',
    x1: x + s * 0.45, y1: top, x2: x - s * 0.25, y2: y + s * 1.0,
  }));
  for (let i = 0; i < hooks; i += 1) {
    // Each blob sits a little further down the stroke than the one above it.
    const along = i * 0.62;
    const bx = x - s * (0.08 + along * 0.22);
    const by = top + s * (0.35 + along);
    group.append(el('circle', { class: 'rhythm__rest', cx: bx, cy: by, r: s * 0.21 }));
    group.append(el('path', {
      class: 'rhythm__rest-stroke',
      d: `M ${bx} ${by} Q ${bx + s * 0.34} ${by - s * 0.42} ${x + s * 0.45 - s * along * 0.22} ${top + s * along}`,
      fill: 'none',
    }));
  }
  return group;
}

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
