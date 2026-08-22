/**
 * Application shell.
 *
 * Owns the things that outlive any single screen: the audio engine, the
 * docked keyboard at the bottom of the window, input routing, the language,
 * and the router. Views are plain modules that render into `#view` and may
 * return a cleanup function.
 */

import { engine, metronome, clickTrack } from './audio.js';
import { i18n, t, LOCALES } from './i18n.js';
import { ComputerKeyboard, midiInput } from './input.js';
import { PianoKeyboard, RANGES, autoRange } from './keyboard.js';
import { Router } from './router.js';
import { PracticeTimer, progress, settings } from './storage.js';
import { h, clear, toast, announce } from './ui.js';

/** Keyboard-size choices offered in the dock and in settings. */
export const RANGE_KEYS = ['auto', ...Object.keys(RANGES)];

export function rangeOptions() {
  return RANGE_KEYS.map((value) => ({ value, label: t(`rangeOptions.${value}`) }));
}

export function labelOptions() {
  return ['never', 'c-only', 'always', 'all'].map((value) => ({ value, label: t(`labelOptions.${value}`) }));
}

export function noteSystemOptions() {
  return ['auto', 'letters', 'german', 'solfege'].map((value) => ({ value, label: t(`noteSystems.${value}`) }));
}

const NAV = ['home', 'lessons', 'songs', 'practice', 'reference', 'progress'];
const NAV_PATHS = {
  home: '/home', lessons: '/lessons', songs: '/songs',
  practice: '/practice', reference: '/reference', progress: '/progress',
};

class App {
  constructor() {
    this.engine = engine;
    this.metronome = metronome;
    this.clickTrack = clickTrack;
    this.progress = progress;
    this.settings = settings;
    this.i18n = i18n;
    this.midi = midiInput;
    this.router = new Router();
    this.practiceTimer = new PracticeTimer(progress);
    /** @type {Set<Function>} note listeners for the active view */
    this.noteListeners = new Set();
    /** @type {Set<number>} notes currently sounding, whatever the source */
    this.sounding = new Set();
    this.transpose = 0;
  }

  // -- convenience ---------------------------------------------------------

  t(key, params) {
    return i18n.t(key, params);
  }

  /** A pitch rendered in the reader's naming system. */
  noteName(midi, opts) {
    return i18n.noteName(midi, opts);
  }

  percent(fraction) {
    return i18n.percent(fraction);
  }

  duration(seconds) {
    return i18n.duration(seconds);
  }

  // -- lifecycle -----------------------------------------------------------

  /** Load the language bundle, then build the interface. */
  async boot(root) {
    i18n.noteSystem = settings.get('noteSystem') === 'auto' ? null : settings.get('noteSystem');
    await i18n.load(i18n.constructor.detect(settings.get('locale')));
    this.mount(root);
  }

  mount(root) {
    this.root = root;
    clear(root);

    this.viewNode = h('main#view', { class: 'view', tabindex: '-1' });
    this.dockNode = h('div.dock__piano');
    this.statusNode = h('div.dock__status');

    root.append(
      this._buildHeader(),
      this.viewNode,
      h('footer.dock', null,
        h('div.dock__bar', null, this._buildDockControls(), this.statusNode),
        this.dockNode),
    );

    const range = this.resolvedRange();
    this.keyboard = new PianoKeyboard(this.dockNode, {
      low: range.low,
      high: range.high,
      labels: settings.get('showNoteNames'),
      onNoteOn: (midi) => this.noteOn(midi, { source: 'mouse' }),
      onNoteOff: (midi) => this.noteOff(midi, { source: 'mouse' }),
    });

    this._wireInput();
    if (!this._routesReady) {
      this._registerRoutes();
      this._routesReady = true;
      this.router.start();
    } else {
      this.router.resolve();
    }

    engine.setVolume(settings.get('volume'));
    metronome.setTempo(settings.get('tempo'));

    let autoKey = autoRange();
    this._onResize = () => {
      if (settings.get('keyboardRange') !== 'auto') return;
      const next = autoRange();
      if (next === autoKey) return;
      autoKey = next;
      this.keyboard.setRange(RANGES[next].low, RANGES[next].high);
    };
    window.addEventListener('resize', this._onResize);

    if (!this._lifecycleBound) {
      this._lifecycleBound = true;
      window.addEventListener('beforeunload', () => this.practiceTimer.flush());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.practiceTimer.flush();
          this.allNotesOff();
        }
      });
    }
  }

  /**
   * Switch language. The whole shell is rebuilt because practically every
   * string in it changes, and the current view is re-rendered from scratch.
   */
  async setLocale(locale) {
    if (locale === i18n.locale) return;
    settings.set('locale', locale);
    this.allNotesOff();
    window.removeEventListener('resize', this._onResize);
    if (this.computerKeyboard) this.computerKeyboard.detach();
    await i18n.load(locale);
    this.mount(this.root);
    announce(t('language.label'));
  }

  /** Switch how note names are spelled without touching the language. */
  setNoteSystem(system) {
    settings.set('noteSystem', system);
    i18n.setNoteSystem(system);
    this.keyboard.render();
    this.router.resolve();
  }

  _buildHeader() {
    this.navNode = h('nav.topbar__nav', { 'aria-label': t('nav.main') },
      NAV.map((key) => h('a.topbar__link', {
        href: `#${NAV_PATHS[key]}`,
        dataset: { path: NAV_PATHS[key] },
      }, t(`nav.${key}`))));

    if (!this._navSyncBound) {
      this._navSyncBound = true;
      window.addEventListener('hashchange', () => this._syncNav());
    }
    setTimeout(() => this._syncNav(), 0);

    return h('header.topbar', null,
      h('a.topbar__brand', { href: '#/home' },
        h('span.topbar__logo', { 'aria-hidden': 'true' }, '♪'),
        h('span.topbar__name', null, t('app.name'))),
      this.navNode,
      h('div.topbar__spacer'),
      this._buildTransport(),
      this._buildLanguagePicker());
  }

  _syncNav() {
    if (!this.navNode) return;
    const path = this.router.path;
    for (const link of this.navNode.querySelectorAll('.topbar__link')) {
      const target = link.dataset.path;
      const active = path === target || (target !== '/home' && path.startsWith(target.replace(/s$/, '')));
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }

  _buildLanguagePicker() {
    const select = h('select.topbar__language', {
      'aria-label': t('language.change'),
      onchange: (event) => this.setLocale(event.target.value),
    }, Object.values(LOCALES).map((locale) => h('option', {
      value: locale.code,
      selected: locale.code === i18n.locale,
      lang: locale.code,
    }, locale.native)));
    return h('div.topbar__language-wrap', null, select);
  }

  _buildTransport() {
    this.metronomeButton = h('button.iconbtn', {
      type: 'button',
      title: t('transport.metronome'),
      'aria-pressed': String(metronome.running),
      onclick: () => this.toggleMetronome(),
    }, h('span.iconbtn__glyph', { 'aria-hidden': 'true' }, '𝅘𝅥'), h('span.iconbtn__text', null, t('transport.metronome')));
    this.metronomeButton.classList.toggle('is-on', metronome.running);

    this.tempoNode = h('span.transport__tempo', null, i18n.number(metronome.tempo));

    return h('div.topbar__transport', null,
      this.metronomeButton,
      h('div.transport__tempo-group', null,
        h('button.iconbtn.iconbtn--tiny', { type: 'button', 'aria-label': t('transport.slower'), onclick: () => this.setTempo(metronome.tempo - 4) }, '−'),
        this.tempoNode,
        h('span.transport__unit', null, t('transport.bpm')),
        h('button.iconbtn.iconbtn--tiny', { type: 'button', 'aria-label': t('transport.faster'), onclick: () => this.setTempo(metronome.tempo + 4) }, '+')),
      h('div.transport__volume', null,
        h('span.iconbtn__glyph', { 'aria-hidden': 'true' }, '🔊'),
        h('input.transport__slider', {
          type: 'range', min: 0, max: 100, value: Math.round(settings.get('volume') * 100),
          'aria-label': t('transport.volume'),
          oninput: (event) => {
            const volume = Number(event.target.value) / 100;
            engine.setVolume(volume);
            settings.set('volume', volume);
          },
        })));
  }

  _buildDockControls() {
    const rangeSelect = h('select.dock__select', {
      'aria-label': t('dock.range'),
      onchange: (event) => {
        settings.set('keyboardRange', event.target.value);
        const range = this.resolvedRange();
        this.keyboard.setRange(range.low, range.high);
      },
    }, rangeOptions().map((option) => h('option', {
      value: option.value, selected: settings.get('keyboardRange') === option.value,
    }, option.label)));

    const labelSelect = h('select.dock__select', {
      'aria-label': t('dock.labels'),
      onchange: (event) => {
        settings.set('showNoteNames', event.target.value);
        this.keyboard.setLabels(event.target.value);
      },
    }, labelOptions().map((option) => h('option', {
      value: option.value, selected: settings.get('showNoteNames') === option.value,
    }, option.label)));

    this.midiButton = h('button.dock__btn', {
      type: 'button',
      onclick: () => this.connectMidi(),
    }, t('dock.connectMidi'));

    return h('div.dock__controls', null, rangeSelect, labelSelect, this.midiButton);
  }

  /** The range to show, resolving 'auto' against the current window width. */
  resolvedRange() {
    const chosen = settings.get('keyboardRange');
    return RANGES[chosen] ?? RANGES[autoRange()];
  }

  // -- input routing -------------------------------------------------------

  _wireInput() {
    this.computerKeyboard = new ComputerKeyboard({
      onNoteOn: (midi) => this.noteOn(midi, { source: 'computer' }),
      onNoteOff: (midi) => this.noteOff(midi, { source: 'computer' }),
      onSustain: (down) => engine.setSustain(down),
      onTranspose: (semitones) => {
        this.transpose = semitones;
        const octaves = semitones / 12;
        this._setStatus(octaves === 0
          ? t('dock.transposeReset')
          : t('dock.transposed', { amount: octaves > 0 ? `+${i18n.number(octaves)}` : i18n.number(octaves) }));
      },
    }).attach(window);

    if (!this._midiBound) {
      this._midiBound = true;
      this.midi.subscribe((message) => {
        switch (message.type) {
          case 'noteon': this.noteOn(message.midi, { velocity: message.velocity, source: 'midi' }); break;
          case 'noteoff': this.noteOff(message.midi, { source: 'midi' }); break;
          case 'sustain': engine.setSustain(message.down); break;
          case 'allnotesoff': this.allNotesOff(); break;
          default: break;
        }
      });

      window.addEventListener('keydown', (event) => {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
        if (event.key === 'm' || event.key === 'M') {
          event.preventDefault();
          this.toggleMetronome();
        }
      });
    }
  }

  /** Any note starting, from any source. */
  noteOn(midi, { velocity = 0.8, source = 'ui' } = {}) {
    engine.resume();
    engine.noteOn(midi, { velocity, source });
    this.sounding.add(midi);
    this.keyboard?.setActive(midi, true);
    this.practiceTimer.ping();
    // Stamped from the audio clock rather than Date.now(): the rhythm drill
    // compares taps against clicks that were scheduled on that same clock.
    this._emit({ type: 'on', midi, velocity, source, time: engine.ctx?.currentTime ?? 0 });
  }

  noteOff(midi, { source = 'ui' } = {}) {
    engine.noteOff(midi, { source });
    this.sounding.delete(midi);
    this.keyboard?.setActive(midi, false);
    this._emit({ type: 'off', midi, source, time: engine.ctx?.currentTime ?? 0 });
  }

  allNotesOff() {
    for (const midi of [...this.sounding]) this.keyboard?.setActive(midi, false);
    this.sounding.clear();
    engine.allNotesOff();
  }

  _emit(event) {
    for (const listener of [...this.noteListeners]) {
      try {
        listener(event);
      } catch (error) {
        console.error('Note listener failed', error);
      }
    }
  }

  /** Views subscribe to played notes; the returned function unsubscribes. */
  onNote(listener) {
    this.noteListeners.add(listener);
    return () => this.noteListeners.delete(listener);
  }

  // -- transport -----------------------------------------------------------

  async toggleMetronome() {
    if (metronome.running) {
      metronome.stop();
      this.metronomeButton.setAttribute('aria-pressed', 'false');
      this.metronomeButton.classList.remove('is-on');
    } else {
      await metronome.start();
      this.metronomeButton.setAttribute('aria-pressed', 'true');
      this.metronomeButton.classList.add('is-on');
    }
  }

  setTempo(bpm) {
    metronome.setTempo(bpm);
    settings.set('tempo', metronome.tempo);
    this.tempoNode.textContent = i18n.number(metronome.tempo);
  }

  async connectMidi() {
    const ok = await this.midi.connect();
    if (!ok) {
      toast(this.midi.error ?? t('dock.midiFailed'), { tone: 'warn', duration: 5000 });
      return;
    }
    this.midi.onDevicesChanged = (devices) => this._showMidiDevices(devices);
    this._showMidiDevices(this.midi.devices);
  }

  _showMidiDevices(devices) {
    if (!devices.length) {
      this.midiButton.textContent = t('dock.midiNoDevice');
      this._setStatus(t('dock.midiEnabled'));
      return;
    }
    this.midiButton.textContent = `MIDI: ${devices[0].name}`;
    this.midiButton.classList.add('is-on');
    this._setStatus(t('dock.midiConnected', { devices: devices.map((d) => d.name).join(', ') }));
    toast(t('dock.midiToast', { device: devices[0].name }), { tone: 'good' });
  }

  _setStatus(message) {
    if (!this.statusNode) return;
    this.statusNode.textContent = message;
    announce(message);
    clearTimeout(this._statusTimer);
    this._statusTimer = setTimeout(() => {
      if (this.statusNode.textContent === message) this.statusNode.textContent = '';
    }, 6000);
  }

  // -- view helpers --------------------------------------------------------

  /** Replace the main view. Views call this then populate the returned node. */
  setView(node, { title } = {}) {
    clear(this.viewNode);
    this.viewNode.append(node);
    document.title = title ? `${title} · ${t('app.name')}` : `${t('app.name')} — ${t('app.tagline')}`;
    return this.viewNode;
  }

  navigate(path) {
    this.router.navigate(path);
  }

  /**
   * Reset everything a view might have left behind on the shared keyboard.
   * Views widen the range with `ensureVisible` to fit their material, so the
   * range is put back on the way out — otherwise one wide-ranging song leaves
   * a phone showing unplayably narrow keys for the rest of the session.
   */
  resetKeyboard() {
    this.keyboard.clearMarks();
    this.keyboard.clearFingers();
    this.allNotesOff();
    const range = this.resolvedRange();
    if (this.keyboard.low !== range.low || this.keyboard.high !== range.high) {
      this.keyboard.setRange(range.low, range.high);
    }
  }

  _registerRoutes() {
    const load = (loader) => (context) => {
      let cleanup = null;
      let cancelled = false;
      this.resetKeyboard();
      loader()
        .then((module) => {
          if (cancelled) return;
          cleanup = module.render(this, context) ?? null;
        })
        .catch((error) => {
          console.error('Failed to load view', error);
          this.setView(h('div.page', null,
            h('h1.page__title', null, t('errors.title')),
            h('p.prose', null, t('errors.viewFailed')),
            h('pre.error', null, String(error && error.message ? error.message : error))));
        });
      return () => {
        cancelled = true;
        if (typeof cleanup === 'function') cleanup();
      };
    };

    this.router
      .add('/home', load(() => import('./views/home.js')))
      .add('/lessons', load(() => import('./views/lessons.js')))
      .add('/lesson/:id', load(() => import('./views/lesson.js')))
      .add('/songs', load(() => import('./views/songs.js')))
      .add('/song/:id', load(() => import('./views/player.js')))
      .add('/practice', load(() => import('./views/practice.js')))
      .add('/practice/notes', load(() => import('./views/notereader.js')))
      .add('/practice/ear', load(() => import('./views/eartrainer.js')))
      .add('/practice/chords', load(() => import('./views/chordtrainer.js')))
      .add('/practice/keys', load(() => import('./views/keytrainer.js')))
      .add('/practice/rhythm', load(() => import('./views/rhythmtrainer.js')))
      .add('/reference', load(() => import('./views/reference.js')))
      .add('/freeplay', load(() => import('./views/freeplay.js')))
      .add('/progress', load(() => import('./views/progress.js')))
      .notFound(() => {
        this.setView(h('div.page', null,
          h('h1.page__title', null, t('errors.notFound')),
          h('p.prose', null, t('errors.notFoundBody')),
          h('a.btn.btn--primary', { href: '#/home' }, t('errors.backHome'))));
      });
  }
}

export const app = new App();
