/**
 * Rhythm exercises.
 *
 * This module is deliberately free of audio, DOM and language: it builds a
 * rhythm, says where the taps should fall, and marks up what actually
 * happened. The drill view supplies the clock and the notation.
 *
 * Rhythms are written in a compact notation, one token per note:
 *
 *   `w` `h` `q` `e` `s`   whole, half, quarter, eighth, sixteenth
 *   `q.`                  dotted — half again as long
 *   `-q`                  a rest of that value
 *   `3e`                  one third of a beat: an eighth-note triplet member
 *
 * Durations are counted in *clicks* rather than in quarter notes, because a
 * click is what the player actually hears and taps against. In 4/4 a click is
 * a quarter note; in 6/8 it is an eighth, so `q` there is worth two clicks.
 */

/** Note values as multiples of a quarter note. */
const QUARTERS = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 };

/** How many quarter notes one click is worth, per time signature family. */
const CLICK_QUARTERS = { simple: 1, compound: 0.5 };

/** Long name for each value, for the notation renderer and for screen readers. */
const VALUE_NAMES = { w: 'whole', h: 'half', q: 'quarter', e: 'eighth', s: 'sixteenth' };

export const METERS = {
  '4/4': { beats: 4, unit: 4, family: 'simple', clicks: 4, accents: [0] },
  '3/4': { beats: 3, unit: 4, family: 'simple', clicks: 3, accents: [0] },
  '2/4': { beats: 2, unit: 4, family: 'simple', clicks: 2, accents: [0] },
  // Counted in eighths, which is how 6/8 is learned before it is felt in two.
  '6/8': { beats: 6, unit: 8, family: 'compound', clicks: 6, accents: [0, 3] },
};

/**
 * Parse one token into a note.
 * @param {string} token
 * @param {'simple'|'compound'} family
 */
function parseNote(token, family) {
  const match = /^(-?)(3?)([whqes])(\.?)$/.exec(token);
  if (!match) throw new Error(`Bad rhythm token: ${token}`);
  const [, rest, tuplet, letter, dot] = match;
  let quarters = QUARTERS[letter];
  if (dot) quarters *= 1.5;
  if (tuplet) quarters *= 2 / 3;
  return {
    value: VALUE_NAMES[letter],
    dotted: Boolean(dot),
    tuplet: tuplet ? 3 : null,
    rest: rest === '-',
    clicks: quarters / CLICK_QUARTERS[family],
  };
}

/** Parse a space-separated cell into notes and its total length in clicks. */
export function parseCell(notation, family = 'simple') {
  const notes = notation.trim().split(/\s+/).filter(Boolean).map((token) => parseNote(token, family));
  return { notes, clicks: notes.reduce((total, note) => total + note.clicks, 0) };
}

/**
 * The building blocks, hardest last. A level offers its own cells and every
 * easier level's, so a syncopation exercise still contains plain quarter
 * notes and reads like music rather than like a list of one trick.
 */
const CELL_POOLS = {
  quarters: ['q', '-q', 'h', 'h.'],
  eighths: ['e e', 'q e e', 'e e q'],
  dotted: ['q. e', 'e q.'],
  sixteenths: ['s s s s', 'e s s', 's s e'],
  syncopation: ['e q e', '-e e', 'e e -q'],
  triplets: ['3e 3e 3e'],
};

/** Compound time gets its own cells: everything groups in threes. */
const COMPOUND_POOL = ['q.', 'q e', 'e e e', 'e e -e', '-e e e'];

/**
 * How much likelier a level's own cells are than the ones it inherits. Without
 * this a syncopation exercise is mostly sixteenth notes, because six earlier
 * levels have contributed cells and the new ones are outnumbered.
 */
const OWN_CELL_WEIGHT = 3;

export const LEVELS = ['quarters', 'eighths', 'dotted', 'sixteenths', 'syncopation', 'triplets', 'compound'];

/** Every cell a level may use, easiest first. */
export function cellsForLevel(level) {
  if (level === 'compound') return [...COMPOUND_POOL];
  const pool = [];
  for (const name of LEVELS) {
    if (!CELL_POOLS[name]) continue;
    const weight = name === level ? OWN_CELL_WEIGHT : 1;
    for (let i = 0; i < weight; i += 1) pool.push(...CELL_POOLS[name]);
    if (name === level) break;
  }
  return pool;
}

/** The meters a level makes sense in. */
export function metersForLevel(level) {
  return level === 'compound' ? ['6/8'] : ['4/4', '3/4', '2/4'];
}

/**
 * Build an exercise.
 *
 * @param {object} options
 * @param {string} [options.level]  a key of LEVELS
 * @param {string} [options.meter]  a key of METERS
 * @param {number} [options.bars]
 * @param {() => number} [options.random]  injectable for tests
 * @returns {{meter:string, clicksPerBar:number, accents:number[], bars:Array<Array<object>>,
 *            notes:object[], onsets:number[], totalClicks:number}}
 */
export function buildExercise({ level = 'quarters', meter, bars = 2, random = Math.random } = {}) {
  // A meter the level cannot be written in is a request that cannot be
  // honoured — compound cells do not fit a 3/4 bar — so fall back rather than
  // produce bars that do not add up.
  const allowed = metersForLevel(level);
  const meterName = allowed.includes(meter) ? meter : allowed[0];
  const spec = METERS[meterName];
  const fits = (cell) => cell.clicks <= spec.clicks;
  const compile = (notation) => ({ notation, ...parseCell(notation, spec.family) });
  const pool = cellsForLevel(level).map(compile).filter(fits);

  // Guarantee the thing the level is named after actually turns up: with six
  // easier levels contributing cells, a triplet exercise can otherwise run
  // two bars without a single triplet in it.
  const own = (CELL_POOLS[level] ?? []).map(compile).filter(fits);
  const requiredBar = own.length ? Math.floor(random() * bars) : -1;

  const built = [];
  for (let bar = 0; bar < bars; bar += 1) {
    built.push(fillBar(pool, spec, random, {
      last: bar === bars - 1,
      require: bar === requiredBar ? own[Math.floor(random() * own.length)] : null,
    }));
  }

  // Flatten into a single stream, tagging each note with where it falls.
  // Positions restart from the barline each bar rather than accumulating
  // across the whole exercise: a triplet eighth is a third of a click, which
  // no binary fraction represents exactly, and three of them in bar one must
  // not push bar two off its barline.
  const notes = [];
  const onsets = [];
  built.forEach((barNotes, barIndex) => {
    let click = barIndex * spec.clicks;
    for (const note of barNotes) {
      const placed = { ...note, bar: barIndex, click, index: notes.length };
      if (!note.rest) onsets.push(click);
      notes.push(placed);
      click += note.clicks;
    }
  });

  return {
    meter: meterName,
    clicksPerBar: spec.clicks,
    accents: spec.accents,
    bars: built,
    notes,
    onsets,
    totalClicks: built.length * spec.clicks,
  };
}

/** Fill exactly one bar by drawing cells that still fit. */
function fillBar(pool, spec, random, { last, require = null }) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const notes = [];
    let remaining = spec.clicks;
    let ok = true;
    if (require) {
      notes.push(...require.notes.map((note) => ({ ...note })));
      remaining -= require.clicks;
    }
    while (remaining > 0) {
      const fits = pool.filter((cell) => cell.clicks <= remaining + 1e-9);
      if (!fits.length) { ok = false; break; }
      const cell = fits[Math.floor(random() * fits.length)];
      notes.push(...cell.notes.map((note) => ({ ...note })));
      remaining -= cell.clicks;
    }
    // A bar with one note in it is not an exercise, and a last bar that ends
    // on a rest leaves the player with nothing to finish on.
    const played = notes.filter((note) => !note.rest).length;
    if (!ok || played < (spec.clicks >= 3 ? 2 : 1)) continue;
    if (last && notes[notes.length - 1].rest) continue;
    return notes;
  }
  // Fall back to something that always works.
  return Array.from({ length: spec.clicks }, () => ({
    value: spec.family === 'compound' ? 'eighth' : 'quarter',
    dotted: false, tuplet: null, rest: false, clicks: 1,
  }));
}

/**
 * Compare what was tapped against what was written.
 *
 * Both are measured in seconds from the first click of the exercise proper,
 * so the caller subtracts the count-in before handing taps over.
 *
 * @param {number[]} onsets  expected positions, in clicks
 * @param {number[]} taps    what the player did, in seconds
 * @param {object} options
 * @param {number} options.secondsPerClick
 * @returns {{verdicts:Array<{onset:number, verdict:string, offset:number|null}>,
 *            hits:number, missed:number, extra:number, accuracy:number,
 *            meanAbsMs:number|null, meanSignedMs:number|null, passed:boolean}}
 */
export function scoreTaps(onsets, taps, { secondsPerClick, tightRatio = 0.12, windowRatio = 0.4 } = {}) {
  // Tolerances scale with tempo — a tenth of a beat is a tenth of a beat
  // whether the beat is fast or slow — but never get so tight at speed that
  // no human could hit them, nor so loose when slow that anything counts.
  const tight = clamp(secondsPerClick * tightRatio, 0.045, 0.16);
  const window = clamp(secondsPerClick * windowRatio, 0.12, 0.4);

  const used = new Set();
  const verdicts = onsets.map((onset) => {
    const expected = onset * secondsPerClick;
    let best = -1;
    let bestDistance = Infinity;
    taps.forEach((tap, index) => {
      if (used.has(index)) return;
      const distance = Math.abs(tap - expected);
      if (distance < bestDistance) { bestDistance = distance; best = index; }
    });
    if (best === -1 || bestDistance > window) return { onset, verdict: 'missed', offset: null };
    used.add(best);
    const offset = taps[best] - expected;
    const verdict = Math.abs(offset) <= tight ? 'on' : offset < 0 ? 'early' : 'late';
    return { onset, verdict, offset };
  });

  const landed = verdicts.filter((v) => v.offset !== null);
  const hits = verdicts.filter((v) => v.verdict === 'on').length;
  const missed = verdicts.filter((v) => v.verdict === 'missed').length;
  const extra = taps.length - used.size;
  const mean = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : null);
  const meanAbs = mean(landed.map((v) => Math.abs(v.offset)));
  const meanSigned = mean(landed.map((v) => v.offset));

  return {
    verdicts,
    hits,
    missed,
    extra,
    accuracy: onsets.length ? hits / onsets.length : 0,
    meanAbsMs: meanAbs === null ? null : Math.round(meanAbs * 1000),
    meanSignedMs: meanSigned === null ? null : Math.round(meanSigned * 1000),
    // Everything played, nothing spurious, and most of it actually in time.
    passed: onsets.length > 0 && missed === 0 && extra === 0 && hits / onsets.length >= 0.75,
  };
}

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
