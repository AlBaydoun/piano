/**
 * Progress lives in localStorage — no account, no server, nothing leaves the
 * device. Every read is defensive because storage can be disabled, full, or
 * hold data written by an older version of the app.
 */

const KEY = 'piano.progress.v1';
const SETTINGS_KEY = 'piano.settings.v1';

const DEFAULT_PROGRESS = {
  lessons: {}, // lessonId -> { completed: boolean, completedAt: number }
  drills: {}, // drillId -> { attempts, correct, bestStreak, lastPlayed }
  songs: {}, // songId -> { bestAccuracy, timesPlayed, lastPlayed }
  practiceSeconds: 0,
  sessions: [], // { date: 'YYYY-MM-DD', seconds }
  createdAt: null,
};

const DEFAULT_SETTINGS = {
  volume: 0.75,
  showNoteNames: 'c-only', // 'never' | 'c-only' | 'always' | 'all'
  tempo: 90,
  keyboardRange: 'auto', // 'auto' | 'small' | 'medium' | 'large' | 'full'
  locale: null, // null means "detect from the browser"
  noteSystem: 'auto', // 'auto' | 'letters' | 'german' | 'solfege'
  theme: 'auto',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(fallback), ...parsed };
  } catch {
    return structuredClone(fallback);
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export class Progress {
  constructor() {
    this.data = read(KEY, DEFAULT_PROGRESS);
    if (!this.data.createdAt) {
      this.data.createdAt = Date.now();
      this.save();
    }
    this.listeners = new Set();
  }

  save() {
    write(KEY, this.data);
    for (const listener of this.listeners ?? []) listener(this.data);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // -- lessons -------------------------------------------------------------

  isLessonComplete(id) {
    return Boolean(this.data.lessons[id]?.completed);
  }

  completeLesson(id) {
    this.data.lessons[id] = { completed: true, completedAt: Date.now() };
    this.save();
  }

  resetLesson(id) {
    delete this.data.lessons[id];
    this.save();
  }

  get completedLessonCount() {
    return Object.values(this.data.lessons).filter((l) => l.completed).length;
  }

  // -- drills --------------------------------------------------------------

  /** Record one answer in a practice drill. */
  recordDrill(id, { correct, streak = 0 }) {
    const entry = this.data.drills[id] ?? { attempts: 0, correct: 0, bestStreak: 0, lastPlayed: 0 };
    entry.attempts += 1;
    if (correct) entry.correct += 1;
    entry.bestStreak = Math.max(entry.bestStreak, streak);
    entry.lastPlayed = Date.now();
    this.data.drills[id] = entry;
    this.save();
    return entry;
  }

  drill(id) {
    return this.data.drills[id] ?? { attempts: 0, correct: 0, bestStreak: 0, lastPlayed: 0 };
  }

  /** Accuracy across every drill, 0..1. */
  get overallAccuracy() {
    const entries = Object.values(this.data.drills);
    const attempts = entries.reduce((sum, e) => sum + e.attempts, 0);
    if (!attempts) return 0;
    return entries.reduce((sum, e) => sum + e.correct, 0) / attempts;
  }

  // -- songs ---------------------------------------------------------------

  recordSong(id, accuracy) {
    const entry = this.data.songs[id] ?? { bestAccuracy: 0, timesPlayed: 0, lastPlayed: 0 };
    entry.bestAccuracy = Math.max(entry.bestAccuracy, accuracy);
    entry.timesPlayed += 1;
    entry.lastPlayed = Date.now();
    this.data.songs[id] = entry;
    this.save();
    return entry;
  }

  song(id) {
    return this.data.songs[id] ?? { bestAccuracy: 0, timesPlayed: 0, lastPlayed: 0 };
  }

  // -- practice time -------------------------------------------------------

  addPracticeTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    this.data.practiceSeconds += seconds;
    const date = today();
    const session = this.data.sessions.find((s) => s.date === date);
    if (session) session.seconds += seconds;
    else this.data.sessions.push({ date, seconds });
    // Keep a rolling year so the store never grows without bound.
    if (this.data.sessions.length > 400) this.data.sessions = this.data.sessions.slice(-400);
    this.save();
  }

  /** Consecutive days of practice ending today or yesterday. */
  get streak() {
    const dates = new Set(this.data.sessions.filter((s) => s.seconds >= 30).map((s) => s.date));
    if (!dates.size) return 0;
    const cursor = new Date();
    if (!dates.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dates.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  /** Practice seconds per day for the last `days` days, oldest first. */
  recentActivity(days = 28) {
    const byDate = new Map(this.data.sessions.map((s) => [s.date, s.seconds]));
    const out = [];
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      out.push({ date, seconds: byDate.get(date) ?? 0 });
    }
    return out;
  }

  reset() {
    this.data = structuredClone(DEFAULT_PROGRESS);
    this.data.createdAt = Date.now();
    this.save();
  }

  export() {
    return JSON.stringify({ progress: this.data, settings: settings.data }, null, 2);
  }

  import(json) {
    const parsed = JSON.parse(json);
    if (parsed.progress) {
      this.data = { ...structuredClone(DEFAULT_PROGRESS), ...parsed.progress };
      this.save();
    }
    if (parsed.settings) {
      settings.data = { ...structuredClone(DEFAULT_SETTINGS), ...parsed.settings };
      settings.save();
    }
  }
}

export class Settings {
  constructor() {
    this.data = read(SETTINGS_KEY, DEFAULT_SETTINGS);
    this.listeners = new Set();
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  save() {
    write(SETTINGS_KEY, this.data);
    for (const listener of this.listeners ?? []) listener(this.data);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/** Track how long the user has actually been at the keyboard this visit. */
export class PracticeTimer {
  constructor(progress, { idleAfter = 60_000, flushEvery = 30_000 } = {}) {
    this.progress = progress;
    this.idleAfter = idleAfter;
    this.lastActivity = 0;
    this.accumulated = 0;
    this.lastTick = Date.now();
    this.active = false;
    this._interval = setInterval(() => this._tick(), 5_000);
    this._flush = setInterval(() => this.flush(), flushEvery);
  }

  /** Call on any note played or answer given. */
  ping() {
    this.lastActivity = Date.now();
    this.active = true;
  }

  _tick() {
    const now = Date.now();
    const elapsed = (now - this.lastTick) / 1000;
    this.lastTick = now;
    if (this.active && now - this.lastActivity < this.idleAfter) {
      this.accumulated += elapsed;
    } else {
      this.active = false;
    }
  }

  flush() {
    if (this.accumulated >= 1) {
      this.progress.addPracticeTime(Math.round(this.accumulated));
      this.accumulated = 0;
    }
  }

  dispose() {
    this.flush();
    clearInterval(this._interval);
    clearInterval(this._flush);
  }
}

export const progress = new Progress();
export const settings = new Settings();
