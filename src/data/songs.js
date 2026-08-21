/**
 * Song library.
 *
 * Everything here is in the public domain. Music is written in a compact
 * text notation so the data stays readable and diffable:
 *
 *   `C4`        one beat on middle C
 *   `C4:2`      two beats
 *   `C4:1/3`    a triplet (fractions are allowed)
 *   `C4:1.5`    a dotted note
 *   `C4+E4+G4`  a chord — all notes start together
 *   `r:2`       a two-beat rest
 *   `|`         barline; ignored by the parser, kept for readability
 *
 * A "beat" is whatever the time signature's lower number says it is, so in
 * 3/8 a beat is an eighth note.
 */

import { nameToMidi } from '../theory.js';

/**
 * Turn the compact notation into timed note events.
 * @param {string} notation
 * @param {{hand?: 'right'|'left', startBeat?: number}} [opts]
 * @returns {Array<{midi:number, beat:number, duration:number, hand:string}>}
 */
export function parseVoice(notation, opts = {}) {
  const { hand = 'right', startBeat = 0 } = opts;
  const notes = [];
  let beat = startBeat;

  for (const token of notation.trim().split(/\s+/)) {
    if (!token || token === '|') continue;
    const [pitchPart, durationPart = '1'] = token.split(':');
    const duration = parseDuration(durationPart);
    if (pitchPart === 'r' || pitchPart === '-') {
      beat += duration;
      continue;
    }
    for (const pitch of pitchPart.split('+')) {
      notes.push({ midi: nameToMidi(pitch), beat, duration, hand });
    }
    beat += duration;
  }
  return notes;
}

function parseDuration(text) {
  if (text.includes('/')) {
    const [numerator, denominator] = text.split('/').map(Number);
    return numerator / denominator;
  }
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`Bad duration: ${text}`);
  return value;
}

/** Build a song's note list from its voices, sorted by time. */
export function compile(song) {
  const notes = song.voices
    .flatMap((voice) => parseVoice(voice.notation, { hand: voice.hand, startBeat: voice.startBeat ?? 0 }))
    .sort((a, b) => a.beat - b.beat || a.midi - b.midi);
  // Rounded because triplet durations accumulate a little float drift.
  const lastBeat = Math.round(notes.reduce((max, n) => Math.max(max, n.beat + n.duration), 0) * 1000) / 1000;
  return { ...song, notes, lastBeat };
}

const LIBRARY = [
  {
    id: 'twinkle',
    title: 'Twinkle, Twinkle, Little Star',
    composer: 'Traditional',
    level: 1,
    key: 'C',
    keySignature: 0,
    tempo: 96,
    timeSignature: [4, 4],
    about: 'The first song almost everyone learns. Right hand stays in one five-finger position.',
    voices: [
      {
        hand: 'right',
        notation: `
          C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2 |
          G4 G4 F4 F4 | E4 E4 D4:2 | G4 G4 F4 F4 | E4 E4 D4:2 |
          C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3+G3:4 | F2+A2+C3:2 C3+E3+G3:2 | F2+A2+C3:2 C3+E3+G3:2 | G2+B2+D3:2 C3+E3+G3:2 |
          C3+E3+G3:2 F2+A2+C3:2 | C3+E3+G3:2 G2+B2+D3:2 | C3+E3+G3:2 F2+A2+C3:2 | C3+E3+G3:2 G2+B2+D3:2 |
          C3+E3+G3:4 | F2+A2+C3:2 C3+E3+G3:2 | F2+A2+C3:2 C3+E3+G3:2 | G2+B2+D3:2 C3+E3+G3:2`,
      },
    ],
  },
  {
    id: 'mary',
    title: 'Mary Had a Little Lamb',
    composer: 'Traditional',
    level: 1,
    key: 'C',
    keySignature: 0,
    tempo: 100,
    timeSignature: [4, 4],
    about: 'Only five notes, all next to each other — perfect for a first melody.',
    voices: [
      {
        hand: 'right',
        notation: `
          E4 D4 C4 D4 | E4 E4 E4:2 | D4 D4 D4:2 | E4 G4 G4:2 |
          E4 D4 C4 D4 | E4 E4 E4 E4 | D4 D4 E4 D4 | C4:4`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3+G3:4 | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4 |
          C3+E3+G3:4 | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4`,
      },
    ],
  },
  {
    id: 'frere-jacques',
    title: 'Frère Jacques',
    composer: 'Traditional',
    level: 1,
    key: 'C',
    keySignature: 0,
    tempo: 108,
    timeSignature: [4, 4],
    about: 'Four short phrases, each played twice. Great for spotting patterns.',
    voices: [
      {
        hand: 'right',
        notation: `
          C4 D4 E4 C4 | C4 D4 E4 C4 | E4 F4 G4:2 | E4 F4 G4:2 |
          G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4 C4 | G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4 C4 |
          C4 G3 C4:2 | C4 G3 C4:2`,
      },
      {
        hand: 'left',
        notation: `
          C3+G3:4 | C3+G3:4 | C3+G3:4 | C3+G3:4 |
          C3+G3:4 | C3+G3:4 | C3+G3:2 G2+D3:2 | C3+G3:2 C3+G3:2`,
      },
    ],
  },
  {
    id: 'row-your-boat',
    title: 'Row, Row, Row Your Boat',
    composer: 'Traditional',
    level: 1,
    key: 'C',
    keySignature: 0,
    tempo: 104,
    timeSignature: [6, 8],
    about: 'A round in 6/8 — a beat here is an eighth note. Try playing it against a friend a bar apart.',
    voices: [
      {
        hand: 'right',
        notation: `
          C4:3 C4:3 | C4:2 D4 E4:3 | E4:2 D4 E4:2 F4 | G4:6 |
          C5 C5 C5 G4 G4 G4 | E4 E4 E4 C4 C4 C4 | G4:2 F4 E4:2 D4 | C4:6`,
      },
      {
        hand: 'left',
        notation: `
          C3+G3:6 | C3+G3:6 | C3+G3:6 | C3+G3:6 |
          C3+G3:6 | C3+G3:6 | G2+D3:6 | C3+G3:6`,
      },
    ],
  },
  {
    id: 'london-bridge',
    title: 'London Bridge Is Falling Down',
    composer: 'Traditional',
    level: 1,
    key: 'C',
    keySignature: 0,
    tempo: 108,
    timeSignature: [4, 4],
    about: 'Introduces a dotted rhythm in the very first bar.',
    voices: [
      {
        hand: 'right',
        notation: `
          G4:1.5 A4:0.5 G4 F4 | E4 F4 G4:2 | D4 E4 F4:2 | E4 F4 G4:2 |
          G4:1.5 A4:0.5 G4 F4 | E4 F4 G4:2 | D4:2 G4:2 | E4 C4:3`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3+G3:4 | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4 |
          C3+E3+G3:4 | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4`,
      },
    ],
  },
  {
    id: 'old-macdonald',
    title: 'Old MacDonald Had a Farm',
    composer: 'Traditional',
    level: 1,
    key: 'C',
    keySignature: 0,
    tempo: 112,
    timeSignature: [4, 4],
    about: 'The melody dips below middle C — a first taste of thumb-under position shifts.',
    voices: [
      {
        hand: 'right',
        notation: `
          C4 C4 C4 G3 | A3 A3 G3:2 | E4 E4 D4 D4 | C4:4 |
          C4 C4 C4 G3 | A3 A3 G3:2 | E4 E4 D4 D4 | C4:4`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3+G3:4 | C3+E3+G3:2 G2+B2+D3:2 | C3+E3+G3:2 G2+B2+D3:2 | C3+E3+G3:4 |
          C3+E3+G3:4 | C3+E3+G3:2 G2+B2+D3:2 | C3+E3+G3:2 G2+B2+D3:2 | C3+E3+G3:4`,
      },
    ],
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    level: 2,
    key: 'C',
    keySignature: 0,
    tempo: 112,
    timeSignature: [4, 4],
    about: 'From the finale of the Ninth Symphony. Mostly stepwise, so it sits under the hand.',
    voices: [
      {
        hand: 'right',
        notation: `
          E4 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | E4:1.5 D4:0.5 D4:2 |
          E4 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | D4:1.5 C4:0.5 C4:2 |
          D4 D4 E4 C4 | D4 E4:0.5 F4:0.5 E4 C4 | D4 E4:0.5 F4:0.5 E4 D4 | C4 D4 G3:2 |
          E4 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | D4:1.5 C4:0.5 C4:2`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3:4 | C3+E3:2 G2+B2:2 | C3+E3:2 G2+B2:2 | C3+E3:2 G2+B2:2 |
          C3+E3:4 | C3+E3:2 G2+B2:2 | C3+E3:2 G2+B2:2 | G2+B2:2 C3+E3:2 |
          G2+B2:4 | C3+E3:2 F2+A2:2 | G2+B2:2 C3+E3:2 | G2+B2:2 G2+B2:2 |
          C3+E3:4 | C3+E3:2 G2+B2:2 | C3+E3:2 G2+B2:2 | G2+B2:2 C3+E3:2`,
      },
    ],
  },
  {
    id: 'happy-birthday',
    title: 'Happy Birthday to You',
    composer: 'Patty & Mildred Hill',
    level: 2,
    key: 'C',
    keySignature: 0,
    tempo: 108,
    timeSignature: [3, 4],
    about: 'Starts on an upbeat: two quick notes before the first full bar.',
    voices: [
      {
        hand: 'right',
        notation: `
          G4:0.5 G4:0.5 | A4 G4 C5 | B4:2 G4:0.5 G4:0.5 | A4 G4 D5 | C5:2 G4:0.5 G4:0.5 |
          G5 E5 C5 | B4 A4 F5:0.5 F5:0.5 | E5 C5 D5 | C5:3`,
      },
    ],
  },
  {
    id: 'jingle-bells',
    title: 'Jingle Bells',
    composer: 'James Lord Pierpont',
    level: 2,
    key: 'C',
    keySignature: 0,
    tempo: 132,
    timeSignature: [4, 4],
    about: 'Repeated notes make this a good study in evenness.',
    voices: [
      {
        hand: 'right',
        notation: `
          E4 E4 E4:2 | E4 E4 E4:2 | E4 G4 C4 D4 | E4:4 |
          F4 F4 F4 F4 | F4 E4 E4 E4:0.5 E4:0.5 | E4 D4 D4 E4 | D4:2 G4:2 |
          E4 E4 E4:2 | E4 E4 E4:2 | E4 G4 C4 D4 | E4:4 |
          F4 F4 F4 F4 | F4 E4 E4 E4:0.5 E4:0.5 | G4 G4 F4 D4 | C4:4`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3+G3:4 | C3+E3+G3:4 | C3+E3+G3:4 | C3+E3+G3:4 |
          F2+A2+C3:4 | C3+E3+G3:4 | G2+B2+D3:4 | G2+B2+D3:2 G2+B2+D3:2 |
          C3+E3+G3:4 | C3+E3+G3:4 | C3+E3+G3:4 | C3+E3+G3:4 |
          F2+A2+C3:4 | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4`,
      },
    ],
  },
  {
    id: 'silent-night',
    title: 'Silent Night',
    composer: 'Franz Xaver Gruber',
    level: 2,
    key: 'C',
    keySignature: 0,
    tempo: 76,
    timeSignature: [3, 4],
    about: 'A lilting 3/4 with a gentle dotted swing on almost every phrase.',
    voices: [
      {
        hand: 'right',
        notation: `
          G4:1.5 A4:0.5 G4 | E4:3 | G4:1.5 A4:0.5 G4 | E4:3 |
          D5:2 D5 | B4:3 | C5:2 C5 | G4:3 |
          A4:2 A4 | C5:1.5 B4:0.5 A4 | G4:1.5 A4:0.5 G4 | E4:3 |
          A4:2 A4 | C5:1.5 B4:0.5 A4 | G4:1.5 A4:0.5 G4 | E4:3 |
          D5:2 D5 | F5:1.5 D5:0.5 B4 | C5:3 | E5:3 |
          C5 G4 E4 | G4:1.5 F4:0.5 D4 | C4:3`,
      },
      {
        hand: 'left',
        notation: `
          C3+E3+G3:3 | C3+E3+G3:3 | C3+E3+G3:3 | C3+E3+G3:3 |
          G2+B2+D3:3 | G2+B2+D3:3 | C3+E3+G3:3 | C3+E3+G3:3 |
          F2+A2+C3:3 | C3+E3+G3:3 | G2+B2+D3:3 | C3+E3+G3:3 |
          F2+A2+C3:3 | C3+E3+G3:3 | G2+B2+D3:3 | C3+E3+G3:3 |
          G2+B2+D3:3 | G2+B2+D3:3 | C3+E3+G3:3 | C3+E3+G3:3 |
          C3+E3+G3:3 | G2+B2+D3:3 | C3+E3+G3:3`,
      },
    ],
  },
  {
    id: 'when-the-saints',
    title: 'When the Saints Go Marching In',
    composer: 'Traditional',
    level: 2,
    key: 'C',
    keySignature: 0,
    tempo: 120,
    timeSignature: [4, 4],
    about: 'Every phrase starts with the same three-note pickup.',
    voices: [
      {
        hand: 'right',
        notation: `
          r C4 E4 F4 | G4:4 | r C4 E4 F4 | G4:4 |
          r C4 E4 F4 | G4:2 E4:2 | C4:2 E4:2 | D4:4 |
          E4:2 E4 D4 | C4:2 C4 E4 | G4:2 G4 F4 | E4:4 |
          C4:2 E4:2 | G4:2 G4:2 | F4:2 E4:2 | C4:4`,
      },
      {
        hand: 'left',
        notation: `
          r:4 | C3+E3+G3:4 | r:4 | C3+E3+G3:4 |
          r:4 | C3+E3+G3:4 | C3+E3+G3:2 C3+E3+G3:2 | G2+B2+D3:4 |
          G2+B2+D3:4 | C3+E3+G3:4 | C3+E3+G3:2 F2+A2+C3:2 | C3+E3+G3:4 |
          C3+E3+G3:4 | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4`,
      },
    ],
  },
  {
    id: 'auld-lang-syne',
    title: 'Auld Lang Syne',
    composer: 'Traditional Scottish',
    level: 3,
    key: 'C',
    keySignature: 0,
    tempo: 88,
    timeSignature: [4, 4],
    about: 'Built almost entirely on a dotted-quarter/eighth "Scotch snap" rhythm.',
    voices: [
      {
        hand: 'right',
        notation: `
          G3 | C4:1.5 B3:0.5 C4 E4 | D4:1.5 C4:0.5 D4 E4 | C4:1.5 C4:0.5 E4 G4 | A4:3 A4 |
          G4:1.5 E4:0.5 E4 C4 | D4:1.5 C4:0.5 D4 E4 | C4:1.5 A3:0.5 A3 G3 | C4:4`,
      },
      {
        hand: 'left',
        notation: `
          r | C3+E3+G3:4 | G2+B2+D3:4 | C3+E3+G3:4 | F2+A2+C3:4 |
          C3+E3+G3:4 | G2+B2+D3:4 | F2+A2+C3:2 G2+B2+D3:2 | C3+E3+G3:4`,
      },
    ],
  },
  {
    id: 'greensleeves',
    title: 'Greensleeves',
    composer: 'Traditional English',
    level: 3,
    key: 'Am',
    keySignature: 0,
    tempo: 100,
    timeSignature: [3, 4],
    about: 'A minor-key tune with a raised 7th (G sharp) at every cadence.',
    voices: [
      {
        hand: 'right',
        notation: `
          A4 | C5:2 D5 | E5:1.5 F5:0.5 E5 | D5:2 B4 | G4:1.5 A4:0.5 B4 |
          C5:2 A4 | A4:1.5 G#4:0.5 A4 | B4:1.5 G#4:0.5 E4 | A4:2 A4 |
          C5:2 D5 | E5:1.5 F5:0.5 E5 | D5:2 B4 | G4:1.5 A4:0.5 B4 |
          C5:1.5 B4:0.5 A4 | G#4:1.5 F#4:0.5 G#4 | A4:3`,
      },
      {
        hand: 'left',
        notation: `
          r | A2+E3:3 | A2+E3:3 | G2+D3:3 | G2+D3:3 |
          A2+E3:3 | A2+E3:3 | E2+B2:3 | A2+E3:3 |
          A2+E3:3 | A2+E3:3 | G2+D3:3 | G2+D3:3 |
          A2+E3:3 | E2+B2:3 | A2+E3:3`,
      },
    ],
  },
  {
    id: 'fur-elise',
    title: 'Für Elise (opening)',
    composer: 'Ludwig van Beethoven',
    level: 3,
    key: 'Am',
    keySignature: 0,
    tempo: 76,
    timeSignature: [3, 8],
    about: 'The famous opening, arranged for one hand. A beat here is an eighth note.',
    voices: [
      {
        hand: 'right',
        notation: `
          E5:0.5 D#5:0.5 | E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 |
          A4 r:0.5 C4:0.5 E4:0.5 A4:0.5 | B4 r:0.5 E4:0.5 G#4:0.5 B4:0.5 |
          C5 r:0.5 E4:0.5 E5:0.5 D#5:0.5 |
          E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 |
          A4 r:0.5 C4:0.5 E4:0.5 A4:0.5 | B4 r:0.5 E4:0.5 C5:0.5 B4:0.5 | A4:2`,
      },
    ],
  },
  {
    id: 'minuet-in-g',
    title: 'Minuet in G (opening)',
    composer: 'Christian Petzold',
    level: 3,
    key: 'G',
    keySignature: 1,
    tempo: 120,
    timeSignature: [3, 4],
    about: 'From the Notebook for Anna Magdalena Bach — long attributed to Bach himself.',
    voices: [
      {
        hand: 'right',
        notation: `
          D5 | G4:0.5 A4:0.5 B4:0.5 C5:0.5 | D5 G4 G4 |
          E5 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 | G5 G4 G4 |
          C5 D5:0.5 C5:0.5 B4:0.5 A4:0.5 | B4 C5:0.5 B4:0.5 A4:0.5 G4:0.5 |
          A4 B4:0.5 A4:0.5 G4:0.5 F#4:0.5 | G4:3`,
      },
      {
        hand: 'left',
        notation: `
          r | G2+B2+D3:3 | G2+B2+D3:3 |
          C3+E3+G3:3 | B2+D3+G3:3 |
          A2+C3+E3:3 | G2+B2+D3:3 |
          D2+A2+D3:3 | G2+B2+D3:3`,
      },
    ],
  },
  {
    id: 'canon-in-d',
    title: 'Canon in D (simplified)',
    composer: 'Johann Pachelbel',
    level: 4,
    key: 'D',
    keySignature: 2,
    tempo: 68,
    timeSignature: [4, 4],
    about: 'The famous eight-chord ground bass with the first violin entry above it.',
    voices: [
      {
        hand: 'right',
        notation: `
          r:8 |
          F#5:2 E5:2 | D5:2 C#5:2 | B4:2 A4:2 | B4:2 C#5:2 |
          D5:2 C#5:2 | B4:2 A4:2 | G4:2 F#4:2 | G4:2 E4:2`,
      },
      {
        hand: 'left',
        notation: `
          D3:2 A2:2 | B2:2 F#2:2 | G2:2 D2:2 | G2:2 A2:2 |
          D3:2 A2:2 | B2:2 F#2:2 | G2:2 D2:2 | G2:2 A2:2 |
          D3:2 A2:2 | B2:2 F#2:2 | G2:2 D2:2 | G2:2 A2:2`,
      },
    ],
  },
  {
    id: 'prelude-in-c',
    title: 'Prelude in C, BWV 846 (bars 1–4)',
    composer: 'Johann Sebastian Bach',
    level: 4,
    key: 'C',
    keySignature: 0,
    tempo: 66,
    timeSignature: [4, 4],
    about: 'An unbroken stream of sixteenth notes. Aim for absolute evenness, not speed.',
    voices: [
      {
        hand: 'right',
        notation: `
          r:0.5 G3:0.25 C4:0.25 E4:0.25 G3:0.25 C4:0.25 E4:0.25
          r:0.5 G3:0.25 C4:0.25 E4:0.25 G3:0.25 C4:0.25 E4:0.25 |
          r:0.5 A3:0.25 D4:0.25 F4:0.25 A3:0.25 D4:0.25 F4:0.25
          r:0.5 A3:0.25 D4:0.25 F4:0.25 A3:0.25 D4:0.25 F4:0.25 |
          r:0.5 G3:0.25 D4:0.25 F4:0.25 G3:0.25 D4:0.25 F4:0.25
          r:0.5 G3:0.25 D4:0.25 F4:0.25 G3:0.25 D4:0.25 F4:0.25 |
          r:0.5 G3:0.25 C4:0.25 E4:0.25 G3:0.25 C4:0.25 E4:0.25
          r:0.5 G3:0.25 C4:0.25 E4:0.25 G3:0.25 C4:0.25 E4:0.25`,
      },
      {
        hand: 'left',
        notation: `
          C3:0.25 E3:0.25 r:1.5 C3:0.25 E3:0.25 r:1.5 |
          C3:0.25 D3:0.25 r:1.5 C3:0.25 D3:0.25 r:1.5 |
          B2:0.25 D3:0.25 r:1.5 B2:0.25 D3:0.25 r:1.5 |
          C3:0.25 E3:0.25 r:1.5 C3:0.25 E3:0.25 r:1.5`,
      },
    ],
  },
  {
    id: 'moonlight',
    title: 'Moonlight Sonata (opening)',
    composer: 'Ludwig van Beethoven',
    level: 4,
    key: 'C#m',
    keySignature: 4,
    tempo: 54,
    timeSignature: [4, 4],
    about: 'Rolling triplets over a slow octave bass. Keep the triplets soft and level.',
    voices: [
      {
        hand: 'right',
        notation: `
          G#3:1/3 C#4:1/3 E4:1/3 G#3:1/3 C#4:1/3 E4:1/3
          G#3:1/3 C#4:1/3 E4:1/3 G#3:1/3 C#4:1/3 E4:1/3 |
          A3:1/3 C#4:1/3 E4:1/3 A3:1/3 C#4:1/3 E4:1/3
          A3:1/3 D4:1/3 F#4:1/3 A3:1/3 D4:1/3 F#4:1/3 |
          G#3:1/3 B#3:1/3 F#4:1/3 G#3:1/3 C#4:1/3 E4:1/3
          G#3:1/3 C#4:1/3 D#4:1/3 F#3:1/3 A#3:1/3 D#4:1/3 |
          G#3:1/3 C#4:1/3 E4:1/3 G#3:1/3 C#4:1/3 E4:1/3
          G#3:1/3 C#4:1/3 D#4:1/3 G#3:1/3 C#4:1/3 D#4:1/3`,
      },
      {
        hand: 'left',
        notation: `
          C#2+C#3:4 | A1+A2:2 D2+D3:2 | G#1+G#2:2 G#1+G#2:2 | C#2+C#3:4`,
      },
    ],
  },
];

/** Every song, with its notation already compiled into timed notes. */
export const SONGS = LIBRARY.map(compile);

export const SONGS_BY_ID = new Map(SONGS.map((song) => [song.id, song]));

export const LEVEL_NAMES = { 1: 'First steps', 2: 'Beginner', 3: 'Intermediate', 4: 'Advanced' };

export function getSong(id) {
  return SONGS_BY_ID.get(id) ?? null;
}
