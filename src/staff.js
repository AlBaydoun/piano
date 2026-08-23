/**
 * SVG music notation.
 *
 * Vertical position is driven entirely by `spellNote().staffStep`, the
 * diatonic index from the theory module. Each staff has a reference line
 * whose step is known, so a note's y is just a subtraction. Clefs are drawn
 * as stroked vector paths, which keeps the app font-independent and offline.
 */

import { spellNote } from './theory.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Diatonic step of each staff's top line. */
const TOP_LINE_STEP = { treble: 38 /* F5 */, bass: 26 /* A3 */ };

/** Where key-signature accidentals sit, in staff steps, in writing order. */
const SHARP_STEPS = { treble: [38, 35, 39, 36, 33, 37, 34], bass: [24, 21, 25, 22, 19, 23, 20] };
const FLAT_STEPS = { treble: [34, 37, 33, 36, 32, 35, 31], bass: [20, 23, 19, 22, 18, 21, 17] };

const ACCIDENTAL_GLYPH = { sharp: '♯', flat: '♭', natural: '♮' };

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) node.setAttribute(key, String(value));
  }
  return node;
}

/** Clefs are drawn a little smaller than the staff spacing implies. */
const CLEF_SCALE = 0.88;

/**
 * Treble (G) clef centred on the G line.
 * @param {number} cx left-ish anchor, @param {number} g y of the G4 line, @param {number} s staff spacing
 */
function trebleClefPath(cx, g, s) {
  const k = s * CLEF_SCALE;
  const p = (dx, dy) => `${(cx + dx * k).toFixed(2)} ${(g + dy * k).toFixed(2)}`;
  return [
    `M ${p(0.375, -5)}`,
    `C ${p(-0.625, -5.375)} ${p(-1.25, -4.125)} ${p(-0.875, -3)}`,
    `C ${p(-0.5, -1.75)} ${p(1, -1.375)} ${p(1, -0.125)}`,
    `C ${p(1, 1.25)} ${p(-0.375, 1.75)} ${p(-1, 1)}`,
    `C ${p(-1.5, 0.375)} ${p(-1.125, -0.5)} ${p(-0.375, -0.375)}`,
    `C ${p(0.25, -0.25)} ${p(0.375, 0.375)} ${p(-0.125, 0.375)}`,
    `M ${p(0.375, -5)}`,
    `L ${p(0.125, 1.75)}`,
    `C ${p(0, 2.5)} ${p(-0.875, 2.625)} ${p(-1, 1.875)}`,
  ].join(' ');
}

/** Bass (F) clef: the head sits on the F line, flanked by two dots. */
function bassClefPath(cx, f, s) {
  const k = s * CLEF_SCALE;
  const p = (dx, dy) => `${(cx + dx * k).toFixed(2)} ${(f + dy * k).toFixed(2)}`;
  return [
    `M ${p(0, 0)}`,
    `C ${p(0, -1.05)} ${p(1.5, -1)} ${p(1.5, 0.1)}`,
    `C ${p(1.5, 1.5)} ${p(0.35, 2.4)} ${p(-0.9, 2.9)}`,
  ].join(' ');
}

export class Staff {
  /**
   * @param {HTMLElement} container
   * @param {object} [options]
   */
  constructor(container, options = {}) {
    this.container = container;
    this.clef = options.clef ?? 'treble'; // 'treble' | 'bass' | 'grand'
    this.keySignature = options.keySignature ?? 0;
    this.spacing = options.spacing ?? 12;
    this.showKeySignature = options.showKeySignature !== false;
    this.timeSignature = options.timeSignature ?? null;
    this.minWidth = options.minWidth ?? 260;
    /** @type {Array<{midis:number[], duration?:string, state?:string, label?:string}>} */
    this.events = options.events ?? [];
    this.render();
  }

  setKeySignature(signature) {
    this.keySignature = signature;
    this.render();
  }

  setClef(clef) {
    this.clef = clef;
    this.render();
  }

  /** Replace the notated music. Accepts numbers, arrays of numbers, or event objects. */
  setEvents(events) {
    this.events = events.map((event) => {
      if (typeof event === 'number') return { midis: [event] };
      if (Array.isArray(event)) return { midis: event };
      return { ...event, midis: [].concat(event.midis ?? event.midi ?? []) };
    });
    this.render();
  }

  setState(index, state) {
    if (this.events[index]) {
      this.events[index].state = state;
      this.render();
    }
  }

  clear() {
    this.events = [];
    this.render();
  }

  /** Which staves are drawn, top to bottom. */
  get staves() {
    return this.clef === 'grand' ? ['treble', 'bass'] : [this.clef];
  }

  /** Absolute y of the top line of a staff. */
  _staffTop(which) {
    const s = this.spacing;
    if (this.clef !== 'grand') return s * 2.5;
    // Treble E4 line and bass A3 line are two spaces apart, which puts
    // middle C exactly halfway between the two staves.
    return which === 'treble' ? s * 4 : s * 4 + s * 4 + s * 2;
  }

  /** y for a diatonic staff step on a given staff. */
  _y(step, which) {
    return this._staffTop(which) + (TOP_LINE_STEP[which] - step) * (this.spacing / 2);
  }

  /** Choose which staff a pitch belongs on. */
  _staffFor(step) {
    if (this.clef !== 'grand') return this.clef;
    return step >= 28 ? 'treble' : 'bass'; // middle C and up goes on top
  }

  render() {
    const s = this.spacing;
    const container = this.container;
    container.innerHTML = '';
    container.classList.add('staff');

    const clefWidth = s * 3.6;
    const keyWidth = this.showKeySignature ? Math.abs(this.keySignature) * s * 0.75 + (this.keySignature ? s * 0.5 : 0) : 0;
    const timeWidth = this.timeSignature ? s * 2 : 0;
    // Accidentals hang to the left of their notehead, so the first note has
    // to start far enough in that they clear the clef and key signature.
    const maxAccidentals = this.events.reduce((max, event) => Math.max(
      max,
      event.midis.filter((midi) => spellNote(midi, this.keySignature).accidental).length,
    ), 0);
    const accidentalWidth = maxAccidentals ? (1.55 + (maxAccidentals - 1) * 0.8) * s : 0;
    const startX = s * 1.2 + clefWidth + keyWidth + timeWidth + accidentalWidth;
    const noteGap = s * 3.4;
    const width = Math.max(this.minWidth, startX + Math.max(1, this.events.length) * noteGap + s * 3);
    // Extra room at the bottom for note labels, which hang below the system.
    const height = this.clef === 'grand' ? s * 16.4 : s * 9.4;

    // Explicit width/height give the SVG a natural size in CSS pixels; the
    // stylesheet lets it shrink below that but never blows it up to fill a
    // wide card, which would make a five-line staff a foot tall.
    const svg = el('svg', {
      class: 'staff__svg',
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': this._describe(),
    });

    // Staff lines
    for (const which of this.staves) {
      const top = this._staffTop(which);
      for (let line = 0; line < 5; line += 1) {
        svg.append(el('line', {
          class: 'staff__line',
          x1: s * 0.6, x2: width - s * 0.6,
          y1: top + line * s, y2: top + line * s,
        }));
      }
    }

    // Brace and barlines for the grand staff
    const firstTop = this._staffTop(this.staves[0]);
    const lastBottom = this._staffTop(this.staves[this.staves.length - 1]) + s * 4;
    svg.append(el('line', { class: 'staff__line staff__line--bar', x1: s * 0.6, x2: s * 0.6, y1: firstTop, y2: lastBottom }));
    svg.append(el('line', { class: 'staff__line staff__line--bar', x1: width - s * 0.6, x2: width - s * 0.6, y1: firstTop, y2: lastBottom }));

    // Clefs
    for (const which of this.staves) {
      const top = this._staffTop(which);
      if (which === 'treble') {
        svg.append(el('path', { class: 'staff__clef', d: trebleClefPath(s * 2.4, top + s * 3, s), fill: 'none' }));
      } else {
        const fLine = top + s;
        svg.append(el('path', { class: 'staff__clef', d: bassClefPath(s * 1.7, fLine, s), fill: 'none' }));
        svg.append(el('circle', { class: 'staff__clef-dot', cx: s * 1.7, cy: fLine, r: s * 0.2 }));
        svg.append(el('circle', { class: 'staff__clef-dot', cx: s * 3.6, cy: fLine - s * 0.5, r: s * 0.13 }));
        svg.append(el('circle', { class: 'staff__clef-dot', cx: s * 3.6, cy: fLine + s * 0.5, r: s * 0.13 }));
      }
    }

    // Key signature
    if (this.showKeySignature && this.keySignature !== 0) {
      const sharps = this.keySignature > 0;
      const count = Math.abs(this.keySignature);
      for (const which of this.staves) {
        const steps = (sharps ? SHARP_STEPS : FLAT_STEPS)[which];
        for (let i = 0; i < count; i += 1) {
          const glyph = el('text', {
            class: 'staff__accidental staff__accidental--key',
            x: s * 1.2 + clefWidth + i * s * 0.75,
            y: this._y(steps[i], which),
            'font-size': s * 2.4,
            'dominant-baseline': 'central',
            'text-anchor': 'middle',
          });
          glyph.textContent = sharps ? ACCIDENTAL_GLYPH.sharp : ACCIDENTAL_GLYPH.flat;
          svg.append(glyph);
        }
      }
    }

    // Time signature
    if (this.timeSignature) {
      const [beats, unit] = this.timeSignature;
      for (const which of this.staves) {
        const top = this._staffTop(which);
        const x = s * 1.2 + clefWidth + keyWidth + s;
        const upper = el('text', { class: 'staff__time', x, y: top + s, 'font-size': s * 2.3, 'dominant-baseline': 'central', 'text-anchor': 'middle' });
        upper.textContent = String(beats);
        const lower = el('text', { class: 'staff__time', x, y: top + s * 3, 'font-size': s * 2.3, 'dominant-baseline': 'central', 'text-anchor': 'middle' });
        lower.textContent = String(unit);
        svg.append(upper, lower);
      }
    }

    // Notes
    this.events.forEach((event, index) => {
      const x = startX + index * noteGap;
      this._drawEvent(svg, event, x, index);
    });

    container.append(svg);
  }

  _drawEvent(svg, event, x, index) {
    const s = this.spacing;
    const group = el('g', { class: `staff__event ${event.state ? `is-${event.state}` : ''}`, 'data-index': index });
    const duration = event.duration ?? 'quarter';
    const hollow = duration === 'whole' || duration === 'half';

    const spelled = event.midis.map((midi) => spellNote(midi, this.keySignature));
    if (!spelled.length) {
      // A rest.
      const which = this.staves[0];
      group.append(el('rect', {
        class: 'staff__rest', x: x - s * 0.4, y: this._y(TOP_LINE_STEP[which] - 3, which) - s * 0.25,
        width: s * 0.8, height: s * 0.5,
      }));
      svg.append(group);
      return;
    }

    const placed = spelled
      .map((note) => {
        const which = this._staffFor(note.staffStep);
        return { ...note, which, y: this._y(note.staffStep, which), offset: 0 };
      })
      .sort((a, b) => b.staffStep - a.staffStep);

    // Two notes one staff step apart would overlap, so the lower of each
    // such pair shifts right by a notehead — the usual engraving solution.
    for (let i = 1; i < placed.length; i += 1) {
      const above = placed[i - 1];
      const current = placed[i];
      if (above.which === current.which && above.staffStep - current.staffStep === 1 && above.offset === 0) {
        current.offset = s * 1.3;
      }
    }

    // Ledger lines, one per line position beyond the staff.
    for (const note of placed) {
      const topStep = TOP_LINE_STEP[note.which];
      const bottomStep = topStep - 8;
      const drawLedger = (step) => group.append(el('line', {
        class: 'staff__ledger',
        x1: x - s * 0.95,
        x2: x + s * 0.95 + note.offset,
        y1: this._y(step, note.which), y2: this._y(step, note.which),
      }));
      for (let step = topStep + 2; step <= note.staffStep; step += 2) drawLedger(step);
      for (let step = bottomStep - 2; step >= note.staffStep; step -= 2) drawLedger(step);
    }

    // Accidentals, stacked leftwards when several land in the same chord.
    placed
      .filter((note) => note.accidental)
      .forEach((note, i) => {
        const text = el('text', {
          class: 'staff__accidental',
          x: x - s * 1.15 - i * s * 0.8,
          y: note.y,
          'font-size': s * 2.2,
          'dominant-baseline': 'central',
          'text-anchor': 'middle',
        });
        text.textContent = ACCIDENTAL_GLYPH[note.accidental];
        group.append(text);
      });

    // Noteheads
    for (const note of placed) {
      const cx = x + note.offset;
      group.append(el('ellipse', {
        class: `staff__notehead ${hollow ? 'staff__notehead--hollow' : ''}`,
        cx, cy: note.y, rx: s * 0.68, ry: s * 0.48,
        transform: `rotate(-20 ${cx} ${note.y})`,
      }));
    }

    // Stems and flags (skipped for whole notes)
    if (duration !== 'whole') {
      const byStaff = new Map();
      for (const note of placed) {
        if (!byStaff.has(note.which)) byStaff.set(note.which, []);
        byStaff.get(note.which).push(note);
      }
      for (const [which, notes] of byStaff) {
        const middleStep = TOP_LINE_STEP[which] - 4;
        const average = notes.reduce((sum, n) => sum + n.staffStep, 0) / notes.length;
        const up = average < middleStep;
        const ys = notes.map((n) => n.y);
        const anchor = up ? Math.max(...ys) : Math.min(...ys);
        const tip = up ? Math.min(...ys) - s * 3.2 : Math.max(...ys) + s * 3.2;
        const stemX = x + (up ? s * 0.63 : -s * 0.63);
        group.append(el('line', { class: 'staff__stem', x1: stemX, x2: stemX, y1: anchor, y2: tip }));
        if (duration === 'eighth' || duration === 'sixteenth') {
          const direction = up ? 1 : -1;
          group.append(el('path', {
            class: 'staff__flag',
            fill: 'none',
            d: `M ${stemX} ${tip} q ${s * 0.9} ${s * 0.7 * direction} ${s * 0.55} ${s * 1.7 * direction}`,
          }));
        }
      }
    }

    if (event.label) {
      const bottomStaff = this.staves[this.staves.length - 1];
      const systemBottom = this._staffTop(bottomStaff) + s * 4;
      const lowest = Math.max(systemBottom, ...placed.map((n) => n.y));
      const text = el('text', { class: 'staff__label', x, y: lowest + s * 1.7, 'text-anchor': 'middle', 'font-size': s * 1.1 });
      text.textContent = event.label;
      group.append(text);
    }

    svg.append(group);
  }

  _describe() {
    if (!this.events.length) return 'Empty staff';
    const names = this.events
      .map((event) => event.midis.map((m) => spellNote(m, this.keySignature))
        .map((n) => `${n.letter}${n.alteration > 0 ? ' sharp' : n.alteration < 0 ? ' flat' : ''}${n.octave}`)
        .join(' and '))
      .join(', ');
    return `Notation showing ${names}`;
  }
}

/** Convenience: render a one-off staff into a container and return it. */
export function renderStaff(container, options) {
  return new Staff(container, options);
}
