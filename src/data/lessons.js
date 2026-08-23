/**
 * The course, as structure.
 *
 * This file holds only what is language-independent: the order of the units,
 * which lesson belongs where, and what each step asks you to do — the notes to
 * play, the fingering, the notation to render, which quiz option is correct.
 * Every word the learner reads lives in `src/locales/<lang>/lessons.js`,
 * keyed by lesson id and step index, so a translation can never drift out of
 * step with the exercise it describes.
 *
 * Step types
 *   text       something to read, optionally with a keyboard or staff figure
 *   play       notes to play, in order (`sequence`) or together (`chord`)
 *   find       any octave of one named pitch class
 *   staff      notes shown in notation, to be read and played
 *   listen     examples the app plays so you can hear a difference
 *   quiz       multiple choice; `answer` indexes the options in the locale file
 *   metronome  play in time with the click
 *   song       go and play a piece from the library
 */

export const UNITS = [
  { id: 'foundations', lessons: 4 },
  { id: 'first-contact', lessons: 4 },
  { id: 'rhythm', lessons: 5 },
  { id: 'treble', lessons: 4 },
  { id: 'bass', lessons: 4 },
  { id: 'accidentals', lessons: 3 },
  { id: 'scales', lessons: 6 },
  { id: 'chords', lessons: 6 },
  { id: 'together', lessons: 4 },
  { id: 'technique', lessons: 5 },
  { id: 'expression', lessons: 5 },
  { id: 'beyond', lessons: 6 },
];

/** Shorthand for the five-finger position on C. */
const C_POSITION = [60, 62, 64, 65, 67];

export const LESSONS = [
  // == Unit 1: foundations ==================================================
  {
    id: 'f-instrument',
    unit: 'foundations',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [{ notes: [24], hold: 3 }, { notes: [60], hold: 2 }, { notes: [96], hold: 1.5 }] },
      { type: 'listen', examples: [{ notes: [60], velocity: 0.25, hold: 1.5 }, { notes: [60], velocity: 1, hold: 1.5 }] },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'f-posture',
    unit: 'foundations',
    steps: [
      { type: 'text' },
      { type: 'text' },
      { type: 'play', notes: [60], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'f-black-keys',
    unit: 'foundations',
    steps: [
      { type: 'text', highlight: { notes: [61, 63, 66, 68, 70, 73, 75, 78, 80, 82], kind: 'hint' } },
      { type: 'find', target: { pitchClass: 0 } },
      { type: 'find', target: { pitchClass: 5 } },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'f-white-keys',
    unit: 'foundations',
    steps: [
      { type: 'text', highlight: { notes: [60, 62, 64, 65, 67, 69, 71, 72], kind: 'hint' }, labels: 'always' },
      { type: 'find', target: { pitchClass: 7 } },
      { type: 'find', target: { pitchClass: 9 } },
      { type: 'find', target: { pitchClass: 11 } },
      { type: 'text', highlight: { notes: [60], kind: 'root' } },
      { type: 'play', notes: [60, 72], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },

  // == Unit 2: first contact ================================================
  {
    id: 'fc-fingers',
    unit: 'first-contact',
    steps: [
      { type: 'text' },
      { type: 'play', notes: C_POSITION, fingers: [1, 2, 3, 4, 5], mode: 'sequence' },
      { type: 'play', notes: [67, 65, 64, 62, 60], fingers: [5, 4, 3, 2, 1], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 0 },
    ],
  },
  {
    id: 'fc-five-finger',
    unit: 'first-contact',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 64, 62, 65, 64, 67], fingers: [1, 3, 2, 4, 3, 5], mode: 'sequence' },
      { type: 'play', notes: [48, 52, 50, 53, 52, 55], fingers: [5, 3, 4, 2, 3, 1], mode: 'sequence' },
      { type: 'metronome', beats: 8, tempo: 72 },
    ],
  },
  {
    id: 'fc-mary',
    unit: 'first-contact',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [64, 62, 60, 62], fingers: [3, 2, 1, 2], mode: 'sequence' },
      { type: 'play', notes: [64, 64, 64, 62, 62, 62], mode: 'sequence' },
      { type: 'play', notes: [64, 67, 67], fingers: [3, 5, 5], mode: 'sequence' },
      { type: 'song', songId: 'mary' },
    ],
  },
  {
    id: 'fc-twinkle',
    unit: 'first-contact',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 60, 67, 67], fingers: [1, 1, 5, 5], mode: 'sequence' },
      { type: 'play', notes: [69, 69, 67], mode: 'sequence' },
      { type: 'play', notes: [65, 65, 64, 64, 62, 62, 60], mode: 'sequence' },
      { type: 'song', songId: 'twinkle' },
    ],
  },

  // == Unit 3: rhythm =======================================================
  {
    id: 'r-pulse',
    unit: 'rhythm',
    steps: [
      { type: 'text' },
      { type: 'metronome', beats: 8, tempo: 60 },
      { type: 'metronome', beats: 12, tempo: 96 },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'r-note-values',
    unit: 'rhythm',
    steps: [
      {
        type: 'text',
        staff: {
          clef: 'treble',
          events: [
            { midis: [60], duration: 'whole', labelKey: 'music.beats.4' },
            { midis: [62], duration: 'half', labelKey: 'music.beats.2' },
            { midis: [64], duration: 'quarter', labelKey: 'music.beats.1' },
            { midis: [65], duration: 'eighth', labelKey: 'music.beats.half' },
          ],
        },
      },
      { type: 'quiz', options: 4, answer: 2 },
      { type: 'metronome', beats: 8, tempo: 72 },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'r-rests',
    unit: 'rhythm',
    steps: [
      {
        type: 'text',
        staff: {
          clef: 'treble',
          events: [{ midis: [64], duration: 'quarter' }, { midis: [] }, { midis: [64], duration: 'quarter' }, { midis: [] }],
        },
      },
      { type: 'text' },
      { type: 'quiz', options: 4, answer: 3 },
    ],
  },
  {
    id: 'r-time-signatures',
    unit: 'rhythm',
    steps: [
      { type: 'text', staff: { clef: 'treble', timeSignature: [4, 4], events: [] } },
      { type: 'text', staff: { clef: 'treble', timeSignature: [3, 4], events: [] } },
      { type: 'metronome', beats: 9, tempo: 84, beatsPerBar: 3 },
      { type: 'quiz', options: 4, answer: 1 },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'r-dots-ties',
    unit: 'rhythm',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [67, 69, 67, 65], mode: 'sequence' },
      { type: 'text' },
      { type: 'quiz', options: 4, answer: 1 },
      { type: 'song', songId: 'london-bridge' },
    ],
  },

  // == Unit 4: the treble staff =============================================
  {
    id: 't-staff',
    unit: 'treble',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [67], label: 67 }] } },
      {
        type: 'text',
        staff: {
          clef: 'treble',
          events: [
            { midis: [64], label: 64 }, { midis: [67], label: 67 }, { midis: [71], label: 71 },
            { midis: [74], label: 74 }, { midis: [77], label: 77 },
          ],
        },
      },
      {
        type: 'text',
        staff: {
          clef: 'treble',
          events: [{ midis: [65], label: 65 }, { midis: [69], label: 69 }, { midis: [72], label: 72 }, { midis: [76], label: 76 }],
        },
      },
      { type: 'staff', notes: [64, 67, 71, 65, 69], clef: 'treble' },
    ],
  },
  {
    id: 't-landmarks',
    unit: 'treble',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [60], label: 60 }, { midis: [67], label: 67 }, { midis: [76], label: 76 }] } },
      { type: 'staff', notes: [60, 67, 76, 60, 67], clef: 'treble' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 't-ledger',
    unit: 'treble',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [60], label: 60 }, { midis: [62], label: 62 }, { midis: [64], label: 64 }] } },
      { type: 'staff', notes: [60, 62, 64, 60, 65], clef: 'treble' },
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [79], label: 79 }, { midis: [81], label: 81 }, { midis: [84], label: 84 }] } },
      { type: 'staff', notes: [79, 81, 84, 77], clef: 'treble' },
    ],
  },
  {
    id: 't-intervals-reading',
    unit: 'treble',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [60] }, { midis: [62] }, { midis: [64] }, { midis: [67] }, { midis: [72] }] } },
      { type: 'play', notes: [60, 62, 64, 67, 72], mode: 'sequence' },
      { type: 'text' },
      { type: 'staff', notes: [62, 65, 69, 71, 74], clef: 'treble' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },

  // == Unit 5: the bass staff and the grand staff ===========================
  {
    id: 'b-clef',
    unit: 'bass',
    steps: [
      { type: 'text', staff: { clef: 'bass', events: [{ midis: [53], label: 53 }] } },
      {
        type: 'text',
        staff: {
          clef: 'bass',
          events: [
            { midis: [43], label: 43 }, { midis: [47], label: 47 }, { midis: [50], label: 50 },
            { midis: [53], label: 53 }, { midis: [57], label: 57 },
          ],
        },
      },
      { type: 'staff', notes: [53, 48, 55, 50, 57], clef: 'bass' },
    ],
  },
  {
    id: 'b-landmarks',
    unit: 'bass',
    steps: [
      { type: 'text', staff: { clef: 'bass', events: [{ midis: [60], label: 60 }, { midis: [53], label: 53 }, { midis: [48], label: 48 }, { midis: [41], label: 41 }] } },
      { type: 'staff', notes: [48, 53, 60, 41, 55], clef: 'bass' },
      { type: 'quiz', options: 4, answer: 3 },
    ],
  },
  {
    id: 'b-grand-staff',
    unit: 'bass',
    steps: [
      { type: 'text', staff: { clef: 'grand', events: [{ midis: [60], label: 60 }, { midis: [64] }, { midis: [55] }, { midis: [48], label: 48 }] } },
      { type: 'staff', notes: [60, 52, 67, 45, 72, 48], clef: 'grand' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'b-both-hands-reading',
    unit: 'bass',
    steps: [
      { type: 'text', staff: { clef: 'grand', events: [{ midis: [48, 64] }, { midis: [48, 65] }, { midis: [48, 64] }, { midis: [48, 62] }] } },
      { type: 'play', notes: [48, 64], mode: 'chord' },
      { type: 'play', notes: [48, 65], mode: 'chord' },
      { type: 'song', songId: 'frere-jacques' },
    ],
  },

  // == Unit 6: half steps, sharps and flats =================================
  {
    id: 'a-half-steps',
    unit: 'accidentals',
    steps: [
      { type: 'text', highlight: { notes: [61], kind: 'root' } },
      { type: 'play', notes: [60, 61, 62], mode: 'sequence' },
      { type: 'play', notes: [64, 65, 71, 72], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'a-sharps-flats',
    unit: 'accidentals',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [61], label: 61 }, { midis: [70], label: 70 }, { midis: [60], label: 60 }] } },
      { type: 'play', notes: [60, 61, 63, 66, 68], mode: 'sequence' },
      { type: 'staff', notes: [61, 63, 66, 68, 70], clef: 'treble' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'a-enharmonics',
    unit: 'accidentals',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [{ notes: [61], hold: 1.2 }, { notes: [61], hold: 1.2 }] },
      { type: 'quiz', options: 4, answer: 0 },
    ],
  },

  // == Unit 7: scales and keys ==============================================
  {
    id: 's-major-formula',
    unit: 'scales',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 62, 64, 65, 67, 69, 71, 72], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 's-c-major-fingering',
    unit: 'scales',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 62, 64, 65, 67, 69, 71, 72], fingers: [1, 2, 3, 1, 2, 3, 4, 5], mode: 'sequence' },
      { type: 'play', notes: [72, 71, 69, 67, 65, 64, 62, 60], fingers: [5, 4, 3, 2, 1, 3, 2, 1], mode: 'sequence' },
      { type: 'play', notes: [48, 50, 52, 53, 55, 57, 59, 60], fingers: [5, 4, 3, 2, 1, 3, 2, 1], mode: 'sequence' },
      { type: 'metronome', beats: 8, tempo: 66 },
    ],
  },
  {
    id: 's-g-and-f',
    unit: 'scales',
    steps: [
      { type: 'text', staff: { clef: 'treble', keySignature: 1, events: [{ midis: [67], label: 67 }] } },
      { type: 'play', notes: [67, 69, 71, 72, 74, 76, 78, 79], fingers: [1, 2, 3, 1, 2, 3, 4, 5], mode: 'sequence' },
      { type: 'text', staff: { clef: 'treble', keySignature: -1, events: [{ midis: [65], label: 65 }] } },
      { type: 'play', notes: [65, 67, 69, 70, 72, 74, 76, 77], fingers: [1, 2, 3, 4, 1, 2, 3, 4], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 's-key-signatures',
    unit: 'scales',
    steps: [
      { type: 'text', staff: { clef: 'treble', keySignature: 1, events: [] } },
      { type: 'text', staff: { clef: 'treble', keySignature: -2, events: [] } },
      { type: 'quiz', options: 4, answer: 0 },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 's-circle-of-fifths',
    unit: 'scales',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 67, 62, 69, 64], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 's-minor',
    unit: 'scales',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [57, 59, 60, 62, 64, 65, 67, 69], fingers: [1, 2, 3, 1, 2, 3, 4, 5], mode: 'sequence' },
      { type: 'listen', examples: [{ notes: [60, 64, 67], chord: true, hold: 1.6 }, { notes: [60, 63, 67], chord: true, hold: 1.6 }] },
      { type: 'text' },
      { type: 'play', notes: [57, 59, 60, 62, 64, 65, 68, 69], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },

  // == Unit 8: chords =======================================================
  {
    id: 'c-intervals',
    unit: 'chords',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [{ notes: [60, 64], chord: true, hold: 1.5 }, { notes: [60, 63], chord: true, hold: 1.5 }] },
      { type: 'play', notes: [60, 67], mode: 'chord' },
      { type: 'play', notes: [60, 65], mode: 'chord' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'c-triads',
    unit: 'chords',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [60, 64, 67], duration: 'whole' }] } },
      { type: 'play', notes: [60, 64, 67], fingers: [1, 3, 5], mode: 'chord' },
      { type: 'play', notes: [60, 63, 67], fingers: [1, 3, 5], mode: 'chord' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'c-dim-aug',
    unit: 'chords',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 63, 66], mode: 'chord' },
      { type: 'play', notes: [60, 64, 68], mode: 'chord' },
      { type: 'listen', examples: [
        { notes: [60, 64, 67], chord: true, hold: 1.3 }, { notes: [60, 63, 67], chord: true, hold: 1.3 },
        { notes: [60, 63, 66], chord: true, hold: 1.3 }, { notes: [60, 64, 68], chord: true, hold: 1.3 },
      ] },
      { type: 'quiz', options: 4, answer: 3 },
    ],
  },
  {
    id: 'c-inversions',
    unit: 'chords',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 64, 67], mode: 'chord' },
      { type: 'play', notes: [64, 67, 72], mode: 'chord' },
      { type: 'play', notes: [67, 72, 76], mode: 'chord' },
      { type: 'play', notes: [65, 69, 72], mode: 'chord' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'c-primary',
    unit: 'chords',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 64, 67], mode: 'chord' },
      { type: 'play', notes: [65, 69, 72], mode: 'chord' },
      { type: 'play', notes: [67, 71, 74], mode: 'chord' },
      { type: 'listen', examples: [
        { notes: [60, 64, 67], chord: true, hold: 1 }, { notes: [65, 69, 72], chord: true, hold: 1 },
        { notes: [67, 71, 74], chord: true, hold: 1 }, { notes: [60, 64, 67], chord: true, hold: 1.6 },
      ] },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'c-sevenths',
    unit: 'chords',
    steps: [
      { type: 'text', staff: { clef: 'treble', events: [{ midis: [67, 71, 74, 77], duration: 'whole' }] } },
      { type: 'play', notes: [67, 71, 74, 77], fingers: [1, 2, 3, 5], mode: 'chord' },
      { type: 'play', notes: [60, 64, 67, 71], mode: 'chord' },
      { type: 'play', notes: [62, 65, 69, 72], mode: 'chord' },
      { type: 'quiz', options: 4, answer: 0 },
    ],
  },

  // == Unit 9: hands together ===============================================
  {
    id: 'h-blocked',
    unit: 'together',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [48, 52, 55], fingers: [5, 3, 1], mode: 'chord' },
      { type: 'play', notes: [43, 47, 50], fingers: [5, 3, 1], mode: 'chord' },
      { type: 'play', notes: [41, 45, 48], fingers: [5, 3, 1], mode: 'chord' },
      { type: 'song', songId: 'mary' },
    ],
  },
  {
    id: 'h-broken',
    unit: 'together',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [48, 55, 52, 55], fingers: [5, 1, 3, 1], mode: 'sequence' },
      { type: 'play', notes: [43, 50, 47, 50], fingers: [5, 1, 3, 1], mode: 'sequence' },
      { type: 'song', songId: 'prelude-in-c' },
    ],
  },
  {
    id: 'h-independence',
    unit: 'together',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [48, 60, 50, 62, 52, 64], mode: 'sequence' },
      { type: 'play', notes: [48, 64], mode: 'chord' },
      { type: 'metronome', beats: 12, tempo: 60 },
    ],
  },
  {
    id: 'h-whole-piece',
    unit: 'together',
    steps: [
      { type: 'text' },
      { type: 'text' },
      { type: 'song', songId: 'ode-to-joy' },
      { type: 'song', songId: 'silent-night' },
    ],
  },

  // == Unit 10: technique ===================================================
  {
    id: 'tech-evenness',
    unit: 'technique',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 62, 64, 65, 67, 65, 64, 62, 60], mode: 'sequence' },
      { type: 'metronome', beats: 10, tempo: 60 },
      { type: 'song', songId: 'five-finger-study' },
    ],
  },
  {
    id: 'tech-scales-two-octaves',
    unit: 'technique',
    steps: [
      { type: 'text' },
      {
        type: 'play',
        notes: [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84],
        fingers: [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 4, 5],
        mode: 'sequence',
      },
      { type: 'text' },
      { type: 'metronome', beats: 8, tempo: 72 },
    ],
  },
  {
    id: 'tech-arpeggios',
    unit: 'technique',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 64, 67, 72, 76, 79, 84], fingers: [1, 2, 3, 1, 2, 3, 5], mode: 'sequence' },
      { type: 'play', notes: [84, 79, 76, 72, 67, 64, 60], fingers: [5, 3, 2, 1, 3, 2, 1], mode: 'sequence' },
      { type: 'song', songId: 'arpeggio-study' },
    ],
  },
  {
    id: 'tech-chords-octaves',
    unit: 'technique',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 72], fingers: [1, 5], mode: 'chord' },
      { type: 'play', notes: [62, 74], fingers: [1, 5], mode: 'chord' },
      { type: 'text' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'tech-practising',
    unit: 'technique',
    steps: [
      { type: 'text' },
      { type: 'text' },
      { type: 'text' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },

  // == Unit 11: expression ==================================================
  {
    id: 'e-dynamics',
    unit: 'expression',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [
        { notes: [60, 64, 67], chord: true, velocity: 0.2, hold: 1.4 },
        { notes: [60, 64, 67], chord: true, velocity: 0.55, hold: 1.4 },
        { notes: [60, 64, 67], chord: true, velocity: 1, hold: 1.4 },
      ] },
      { type: 'text' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'e-articulation',
    unit: 'expression',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [
        { notes: [60, 62, 64, 65, 67], hold: 0.55, gap: 0 },
        { notes: [60, 62, 64, 65, 67], hold: 0.12, gap: 0.35 },
      ] },
      { type: 'play', notes: [60, 62, 64, 65, 67], mode: 'sequence' },
      { type: 'quiz', options: 4, answer: 0 },
    ],
  },
  {
    id: 'e-pedal',
    unit: 'expression',
    steps: [
      { type: 'text' },
      { type: 'text' },
      { type: 'play', notes: [60, 64, 67], mode: 'chord' },
      { type: 'quiz', options: 4, answer: 1 },
    ],
  },
  {
    id: 'e-phrasing',
    unit: 'expression',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [{ notes: [64, 64, 65, 67, 67, 65, 64, 62], hold: 0.4 }] },
      { type: 'play', notes: [64, 64, 65, 67, 67, 65, 64, 62], mode: 'sequence' },
      { type: 'song', songId: 'greensleeves' },
    ],
  },
  {
    id: 'e-balance',
    unit: 'expression',
    steps: [
      { type: 'text' },
      { type: 'listen', examples: [
        { notes: [48, 55, 64], chord: true, hold: 1.6 },
        { notes: [48, 55], chord: true, velocity: 0.25, hold: 1.6 },
      ] },
      { type: 'text' },
      { type: 'song', songId: 'minuet-in-g' },
    ],
  },

  // == Unit 12: beyond the page =============================================
  {
    id: 'x-chord-symbols',
    unit: 'beyond',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [65, 69, 72], mode: 'chord' },
      { type: 'play', notes: [62, 65, 69], mode: 'chord' },
      { type: 'play', notes: [67, 71, 74, 77], mode: 'chord' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'x-accompaniment',
    unit: 'beyond',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [48, 55, 52, 55], mode: 'sequence' },
      { type: 'play', notes: [48, 60, 55, 60], mode: 'sequence' },
      { type: 'play', notes: [36, 48, 43, 48], mode: 'sequence' },
      { type: 'song', songId: 'auld-lang-syne' },
    ],
  },
  {
    id: 'x-blues',
    unit: 'beyond',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 64, 67, 70], mode: 'chord' },
      { type: 'play', notes: [65, 69, 72, 75], mode: 'chord' },
      { type: 'play', notes: [67, 71, 74, 77], mode: 'chord' },
      { type: 'song', songId: 'twelve-bar-blues' },
    ],
  },
  {
    id: 'x-improvising',
    unit: 'beyond',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 63, 65, 67, 70, 72], mode: 'sequence' },
      { type: 'text' },
      { type: 'song', songId: 'twelve-bar-blues' },
    ],
  },
  {
    id: 'x-by-ear',
    unit: 'beyond',
    steps: [
      { type: 'text' },
      { type: 'play', notes: [60, 62, 64, 60], mode: 'sequence' },
      { type: 'play', notes: [65, 67, 69, 65], mode: 'sequence' },
      { type: 'text' },
      { type: 'quiz', options: 4, answer: 2 },
    ],
  },
  {
    id: 'x-routine',
    unit: 'beyond',
    steps: [
      { type: 'text' },
      { type: 'text' },
      { type: 'text' },
      { type: 'text' },
    ],
  },
];

export const LESSONS_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

export function lessonsInUnit(unitId) {
  return LESSONS.filter((lesson) => lesson.unit === unitId);
}

export function getLesson(id) {
  return LESSONS_BY_ID.get(id) ?? null;
}

/** The lesson after this one, in course order. */
export function nextLesson(id) {
  const index = LESSONS.findIndex((lesson) => lesson.id === id);
  return index >= 0 && index < LESSONS.length - 1 ? LESSONS[index + 1] : null;
}

/** The lesson before this one, in course order. */
export function previousLesson(id) {
  const index = LESSONS.findIndex((lesson) => lesson.id === id);
  return index > 0 ? LESSONS[index - 1] : null;
}
