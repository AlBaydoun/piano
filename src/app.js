/**
 * Application shell.
 *
 * Owns the things that outlive any single screen: the audio engine, the
 * docked keyboard at the bottom of the window, input routing, and the router.
 * Views are plain modules that render into `#view` and may return a cleanup
 * function.
 */

import { engine, metronome } from './audio.js';
import { ComputerKeyboard, midiInput } from './input.js';
import { PianoKeyboard, RANGES, autoRange } from './keyboard.js';
import { Router } from './router.js';
import { PracticeTimer, progress, settings } from './storage.js';
import { h, clear, toast, announce } from './ui.js';
import { midiToName } from './theory.js';

/** Keyboard-size choices offered in the dock and in settings. */
export const RANGE_OPTIONS = [
  { value: 'auto', label: 'Fit to screen' },
  ...Object.entries(RANGES).map(([value, range]) => ({ value, label: range.label })),
];

const NAV = [
  { path: '/home', label: 'Home' },
  { path: '/lessons', label: 'Lessons' },
  { path: '/songs', label: 'Songs' },
  { path: '/practice', label: 'Practice' },
  { path: '/reference', label: 'Reference' },
  { path: '/progress', label: 'Progress' },
];

class App {
  constructor() {
    this.engine = engine;
    this.metronome = metronome;
    this.progress = progress;
    this.settings = settings;
    this.midi = midiInput;
    this.router = new Router();
    this.practiceTimer = new PracticeTimer(progress);
    /** @type {Set<Function>} note listeners for the active view */
    this.noteListeners = new Set();
    /** @type {Set<number>} notes currently sounding, whatever the source */
    this.sounding = new Set();
    this.transpose = 0;
  }

  // -- lifecycle -----------------------------------------------------------

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
      labelStyle: settings.get('labelStyle'),
      onNoteOn: (midi) => this.noteOn(midi, { source: 'mouse' }),
      onNoteOff: (midi) => this.noteOff(midi, { source: 'mouse' }),
    });

    this._wireInput();
    this._registerRoutes();
    this.router.start();

    engine.setVolume(settings.get('volume'));
    metronome.setTempo(settings.get('tempo'));

    // With the range on 'auto', rotating a phone or resizing should change how
    // many octaves are shown — but only when it actually changes.
    let autoKey = autoRange();
    window.addEventListener('resize', () => {
      if (settings.get('keyboardRange') !== 'auto') return;
      const next = autoRange();
      if (next === autoKey) return;
      autoKey = next;
      this.keyboard.setRange(RANGES[next].low, RANGES[next].high);
    });

    window.addEventListener('beforeunload', () => this.practiceTimer.flush());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.practiceTimer.flush();
        this.allNotesOff();
      }
    });
  }

  _buildHeader() {
    this.navNode = h('nav.topbar__nav', { 'aria-label': 'Main' },
      NAV.map((item) => h('a.topbar__link', {
        href: `#${item.path}`,
        dataset: { path: item.path },
      }, item.label)));

    window.addEventListener('hashchange', () => this._syncNav());
    setTimeout(() => this._syncNav(), 0);

    return h('header.topbar', null,
      h('a.topbar__brand', { href: '#/home' },
        h('span.topbar__logo', { 'aria-hidden': 'true' }, '♪'),
        h('span', null, 'Open Piano')),
      this.navNode,
      h('div.topbar__spacer'),
      this._buildTransport());
  }

  _syncNav() {
    const path = this.router.path;
    for (const link of this.navNode.querySelectorAll('.topbar__link')) {
      const target = link.dataset.path;
      const active = path === target || (target !== '/home' && path.startsWith(target.replace(/s$/, '')));
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }

  _buildTransport() {
    this.metronomeButton = h('button.iconbtn', {
      type: 'button',
      title: 'Metronome (M)',
      'aria-pressed': 'false',
      onclick: () => this.toggleMetronome(),
    }, h('span.iconbtn__glyph', null, '𝅘𝅥'), h('span.iconbtn__text', null, 'Metronome'));

    this.tempoNode = h('span.transport__tempo', null, `${metronome.tempo}`);

    return h('div.topbar__transport', null,
      this.metronomeButton,
      h('div.transport__tempo-group', null,
        h('button.iconbtn.iconbtn--tiny', { type: 'button', 'aria-label': 'Slower', onclick: () => this.setTempo(metronome.tempo - 4) }, '−'),
        this.tempoNode,
        h('span.transport__unit', null, 'bpm'),
        h('button.iconbtn.iconbtn--tiny', { type: 'button', 'aria-label': 'Faster', onclick: () => this.setTempo(metronome.tempo + 4) }, '+')),
      h('div.transport__volume', null,
        h('span.iconbtn__glyph', { 'aria-hidden': 'true' }, '🔊'),
        h('input.transport__slider', {
          type: 'range', min: 0, max: 100, value: Math.round(settings.get('volume') * 100),
          'aria-label': 'Volume',
          oninput: (event) => {
            const volume = Number(event.target.value) / 100;
            engine.setVolume(volume);
            settings.set('volume', volume);
          },
        })));
  }

  _buildDockControls() {
    const rangeSelect = h('select.dock__select', {
      'aria-label': 'Keyboard range',
      onchange: (event) => {
        settings.set('keyboardRange', event.target.value);
        const range = this.resolvedRange();
        this.keyboard.setRange(range.low, range.high);
      },
    }, RANGE_OPTIONS.map((option) => h('option', {
      value: option.value, selected: settings.get('keyboardRange') === option.value,
    }, option.label)));

    const labelSelect = h('select.dock__select', {
      'aria-label': 'Key labels',
      onchange: (event) => {
        settings.set('showNoteNames', event.target.value);
        this.keyboard.setLabels(event.target.value);
      },
    }, [
      { value: 'never', label: 'No labels' },
      { value: 'c-only', label: 'Label C only' },
      { value: 'always', label: 'Label white keys' },
      { value: 'all', label: 'Label every key' },
    ].map((option) => h('option', { value: option.value, selected: settings.get('showNoteNames') === option.value }, option.label)));

    this.midiButton = h('button.dock__btn', {
      type: 'button',
      onclick: () => this.connectMidi(),
    }, 'Connect MIDI keyboard');

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
          ? 'Computer keyboard at concert pitch'
          : `Computer keyboard shifted ${octaves > 0 ? '+' : ''}${octaves} octave${Math.abs(octaves) === 1 ? '' : 's'}`);
      },
    }).attach(window);

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

  /** Any note starting, from any source. */
  noteOn(midi, { velocity = 0.8, source = 'ui' } = {}) {
    engine.resume();
    engine.noteOn(midi, { velocity, source });
    this.sounding.add(midi);
    this.keyboard?.setActive(midi, true);
    this.practiceTimer.ping();
    this._emit({ type: 'on', midi, velocity, source });
  }

  noteOff(midi, { source = 'ui' } = {}) {
    engine.noteOff(midi, { source });
    this.sounding.delete(midi);
    this.keyboard?.setActive(midi, false);
    this._emit({ type: 'off', midi, source });
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
    this.tempoNode.textContent = String(metronome.tempo);
  }

  async connectMidi() {
    const ok = await this.midi.connect();
    if (!ok) {
      toast(this.midi.error ?? 'Could not connect to MIDI.', { tone: 'warn', duration: 5000 });
      return;
    }
    this.midi.onDevicesChanged = (devices) => this._showMidiDevices(devices);
    this._showMidiDevices(this.midi.devices);
  }

  _showMidiDevices(devices) {
    if (!devices.length) {
      this.midiButton.textContent = 'MIDI on — no device found';
      this._setStatus('MIDI is enabled. Plug in a keyboard and it will connect automatically.');
      return;
    }
    this.midiButton.textContent = `MIDI: ${devices[0].name}`;
    this.midiButton.classList.add('is-on');
    this._setStatus(`Connected to ${devices.map((d) => d.name).join(', ')}`);
    toast(`MIDI connected: ${devices[0].name}`, { tone: 'good' });
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
    document.title = title ? `${title} · Open Piano` : 'Open Piano — learn piano, free';
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

  /** Show which key an on-screen prompt refers to. */
  describeNote(midi) {
    return midiToName(midi);
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
            h('h1.page__title', null, 'Something went wrong'),
            h('p.prose', null, 'That screen failed to load. Try reloading the page.'),
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
      .add('/reference', load(() => import('./views/reference.js')))
      .add('/freeplay', load(() => import('./views/freeplay.js')))
      .add('/progress', load(() => import('./views/progress.js')))
      .notFound(() => {
        this.setView(h('div.page', null,
          h('h1.page__title', null, 'Page not found'),
          h('p.prose', null, 'That link does not go anywhere.'),
          h('a.btn.btn--primary', { href: '#/home' }, 'Back to the start')));
      });
  }
}

export const app = new App();
