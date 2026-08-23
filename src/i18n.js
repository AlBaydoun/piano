/**
 * Localisation.
 *
 * One locale bundle is loaded at a time, on demand. A bundle carries the
 * interface strings, the course text and the song metadata; English is always
 * kept loaded as the fallback so a missing key degrades to English rather
 * than to a raw key name.
 *
 * Two things here are specific to a music app:
 *
 *   Note names differ by country. English speakers say B, Germans say H, and
 *   much of the world uses Do–Re–Mi. Course text therefore never hard-codes a
 *   note name — it writes `{note:C}` and this module renders it in whatever
 *   system the reader has chosen.
 *
 *   Arabic reads right to left, but a piano keyboard and a musical staff do
 *   not. The page direction flips; the instrument does not.
 */

import { pitchClass, octaveOf, nameToMidi } from './theory.js';

export const LOCALES = {
  en: { code: 'en', native: 'English', english: 'English', dir: 'ltr', noteSystem: 'letters' },
  ru: { code: 'ru', native: 'Русский', english: 'Russian', dir: 'ltr', noteSystem: 'solfege' },
  de: { code: 'de', native: 'Deutsch', english: 'German', dir: 'ltr', noteSystem: 'german' },
  ar: { code: 'ar', native: 'العربية', english: 'Arabic', dir: 'rtl', noteSystem: 'solfege' },
};

export const DEFAULT_LOCALE = 'en';

/**
 * Bundles are loaded on demand — one language at a time — but the set of
 * them is written out statically rather than built from a template string,
 * so both a bundler and a reader can see exactly which locales exist.
 */
const BUNDLES = {
  en: () => import('./locales/en/index.js'),
  ru: () => import('./locales/ru/index.js'),
  de: () => import('./locales/de/index.js'),
  ar: () => import('./locales/ar/index.js'),
};

/**
 * How the twelve pitch classes are spelled in each naming system. Sharp and
 * flat variants are kept separately so a B flat looks like a B flat.
 */
const NOTE_SYSTEMS = {
  letters: {
    sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
    flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  },
  // German keeps H for B natural and uses a plain B for B flat.
  german: {
    sharp: ['C', 'Cis', 'D', 'Dis', 'E', 'F', 'Fis', 'G', 'Gis', 'A', 'Ais', 'H'],
    flat: ['C', 'Des', 'D', 'Es', 'E', 'F', 'Ges', 'G', 'As', 'A', 'B', 'H'],
    short: {
      sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'H'],
      flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B', 'H'],
    },
  },
  solfege: {
    sharp: ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'],
    flat: ['Do', 'Re♭', 'Re', 'Mi♭', 'Mi', 'Fa', 'Sol♭', 'Sol', 'La♭', 'La', 'Si♭', 'Si'],
  },
};

/** Solfège syllables written in the reader's own script. */
const SOLFEGE_SCRIPTS = {
  ru: ['До', 'Ре', 'Ми', 'Фа', 'Соль', 'Ля', 'Си'],
  ar: ['دو', 'ري', 'مي', 'فا', 'صول', 'لا', 'سي'],
};

const SOLFEGE_ORDER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

const PLURAL_KEYS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

class I18n {
  constructor() {
    this.locale = DEFAULT_LOCALE;
    /** @type {object|null} the active bundle */
    this.bundle = null;
    /** @type {object|null} always English, used when a key is missing */
    this.fallback = null;
    this.noteSystem = null; // null means "follow the locale"
    this.listeners = new Set();
    this._plurals = new Map();
  }

  /** Pick a starting locale from storage, then the browser, then English. */
  static detect(stored) {
    if (stored && LOCALES[stored]) return stored;
    const candidates = typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language];
    for (const candidate of candidates) {
      const base = String(candidate).toLowerCase().split('-')[0];
      if (LOCALES[base]) return base;
    }
    return DEFAULT_LOCALE;
  }

  get info() {
    return LOCALES[this.locale];
  }

  get dir() {
    return this.info.dir;
  }

  get isRtl() {
    return this.dir === 'rtl';
  }

  /** Load a locale bundle, keeping English around as the fallback. */
  async load(locale) {
    const code = LOCALES[locale] ? locale : DEFAULT_LOCALE;
    if (!this.fallback) {
      this.fallback = (await BUNDLES[DEFAULT_LOCALE]()).default;
    }
    this.bundle = code === DEFAULT_LOCALE ? this.fallback : (await BUNDLES[code]()).default;
    this.locale = code;
    this._plurals.clear();
    this._applyDocument();
    return this.bundle;
  }

  /** Change language at runtime and tell everyone who is listening. */
  async setLocale(locale) {
    if (locale === this.locale) return;
    await this.load(locale);
    for (const listener of [...this.listeners]) listener(this.locale);
  }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _applyDocument() {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = this.locale;
    document.documentElement.dir = this.dir;
    document.documentElement.dataset.locale = this.locale;
  }

  // -- lookup --------------------------------------------------------------

  _resolve(source, key) {
    let value = source;
    for (const part of key.split('.')) {
      if (value === null || typeof value !== 'object') return undefined;
      value = value[part];
    }
    return value;
  }

  /**
   * Look a key up in the active bundle, falling back to English.
   * @param {string} key dotted path, e.g. `nav.lessons`
   * @param {object} [params] values for `{placeholders}`; `count` also selects a plural form
   */
  t(key, params = {}) {
    let value = this._resolve(this.bundle, key);
    if (value === undefined) value = this._resolve(this.fallback, key);
    if (value === undefined) return key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const keys = Object.keys(value);
      if (keys.some((k) => PLURAL_KEYS.has(k))) value = this._plural(value, params.count);
    }

    if (Array.isArray(value)) return value.map((line) => this.format(line, params));
    return this.format(value, params);
  }

  /** Raw lookup with no substitution — for arrays and objects of data. */
  raw(key) {
    const value = this._resolve(this.bundle, key);
    return value === undefined ? this._resolve(this.fallback, key) : value;
  }

  has(key) {
    return this._resolve(this.bundle, key) !== undefined || this._resolve(this.fallback, key) !== undefined;
  }

  _plural(forms, count) {
    if (count === undefined) return forms.other ?? Object.values(forms)[0];
    if (!this._plurals.has(this.locale)) {
      this._plurals.set(this.locale, new Intl.PluralRules(this.locale));
    }
    const category = this._plurals.get(this.locale).select(count);
    return forms[category] ?? forms.other ?? Object.values(forms)[0];
  }

  /** Substitute `{placeholders}`, `{note:C4}` tokens and format numbers. */
  format(text, params = {}) {
    if (typeof text !== 'string') return text;
    let out = text.replace(/\{note:([A-Ga-g][#b]?-?\d*)\}/g, (_, name) => this.noteName(name, { octave: /\d/.test(name) }));
    out = out.replace(/\{(\w+)\}/g, (match, name) => {
      if (!(name in params)) return match;
      const value = params[name];
      return typeof value === 'number' ? this.number(value) : String(value);
    });
    return out;
  }

  // -- numbers, percentages, dates -----------------------------------------

  number(value) {
    return new Intl.NumberFormat(this.locale).format(value);
  }

  percent(fraction) {
    return new Intl.NumberFormat(this.locale, { style: 'percent', maximumFractionDigits: 0 }).format(fraction);
  }

  /** `92` -> `1 min 32 s` in the reader's language. */
  duration(seconds) {
    const total = Math.max(0, Math.round(seconds));
    if (total < 60) return this.t('time.seconds', { count: total, n: total });
    const minutes = Math.floor(total / 60);
    if (minutes < 60) return this.t('time.minutes', { count: minutes, n: minutes });
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!rest) return this.t('time.hours', { count: hours, n: hours });
    return `${this.t('time.hours', { count: hours, n: hours })} ${this.t('time.minutes', { count: rest, n: rest })}`;
  }

  date(value) {
    return new Intl.DateTimeFormat(this.locale, { day: 'numeric', month: 'short' }).format(new Date(value));
  }

  // -- note names ----------------------------------------------------------

  /** The naming system in force: an explicit choice, or the locale's default. */
  get activeNoteSystem() {
    return this.noteSystem ?? this.info.noteSystem;
  }

  setNoteSystem(system) {
    this.noteSystem = system === 'auto' ? null : system;
    for (const listener of [...this.listeners]) listener(this.locale);
  }

  /**
   * Render a pitch in the reader's naming system.
   * @param {number|string} note MIDI number, or an English name like 'C#4'
   * @param {{flats?: boolean, octave?: boolean, short?: boolean}} [opts]
   */
  noteName(note, opts = {}) {
    const midi = typeof note === 'number' ? note : nameToMidi(note);
    const { flats = false, octave = false, short = false } = opts;
    const system = this.activeNoteSystem;
    const table = NOTE_SYSTEMS[system] ?? NOTE_SYSTEMS.letters;
    const set = short && table.short ? table.short : table;
    let name = (flats ? set.flat : set.sharp)[pitchClass(midi)];

    if (system === 'solfege') {
      const script = SOLFEGE_SCRIPTS[this.locale];
      if (script) {
        const syllable = script[SOLFEGE_ORDER[pitchClass(midi)]];
        const accidental = name.includes('♯') ? '♯' : name.includes('♭') ? '♭' : '';
        name = syllable + accidental;
      }
    }

    return octave ? `${name}${octaveOf(midi)}` : name;
  }

  /** Localised interval name, e.g. `intervalName(7)` -> 'Perfect 5th'. */
  intervalName(semitones) {
    return this.t(`music.intervals.${semitones}`);
  }

  chordTypeName(type) {
    return this.t(`music.chords.${type}`);
  }

  scaleName(type) {
    return this.t(`music.scales.${type}`);
  }

  /** Chord symbol with the root in the reader's naming system. */
  chordSymbol(root, type, { flats = false } = {}) {
    return `${this.noteName(root, { flats, short: true })}${this.t(`music.chordSymbols.${type}`)}`;
  }

  /** Key name, e.g. 'B♭ major' / 'B-Dur' / 'си-бемоль мажор'. */
  keyName(tonicName, mode = 'major') {
    const midi = nameToMidi(tonicName);
    const flats = tonicName.includes('b');
    return this.t(`music.keyName.${mode}`, { note: this.noteName(midi, { flats, short: true }) });
  }
}

export const i18n = new I18n();

/** Shorthand used throughout the views. */
export const t = (key, params) => i18n.t(key, params);
