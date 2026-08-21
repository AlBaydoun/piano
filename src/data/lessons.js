/**
 * The course.
 *
 * A lesson is a list of steps. Steps are either something to read, something
 * to play, or a question to answer — the lesson view knows how to render each
 * `type` and how to decide when a step has been passed.
 *
 * Step types
 *   text   prose, optionally with a keyboard or staff illustration
 *   play   the learner must play the given notes (in order, or all at once)
 *   find   the learner must find one named note anywhere on the keyboard
 *   staff  a note is shown in notation and must be played
 *   quiz   multiple choice
 */

export const UNITS = [
  { id: 'keyboard', title: 'Meet the keyboard', blurb: 'Find your way around the keys before reading a single note.' },
  { id: 'first-tunes', title: 'Your first melodies', blurb: 'Five fingers, five keys, real songs.' },
  { id: 'reading', title: 'Reading music', blurb: 'The staff, the clefs, and how the two connect to your hands.' },
  { id: 'rhythm', title: 'Rhythm and counting', blurb: 'Note values, time signatures, and keeping steady time.' },
  { id: 'scales', title: 'Scales and keys', blurb: 'Sharps, flats, fingering, and why key signatures exist.' },
  { id: 'chords', title: 'Chords and harmony', blurb: 'Triads, inversions, and the three chords that play a thousand songs.' },
  { id: 'together', title: 'Hands together', blurb: 'Accompaniment patterns and coordinating both hands.' },
  { id: 'expression', title: 'Playing musically', blurb: 'Dynamics, articulation and the sustain pedal.' },
];

export const LESSONS = [
  // -- Unit 1: the keyboard -------------------------------------------------
  {
    id: 'kb-groups',
    unit: 'keyboard',
    title: 'The pattern of black keys',
    summary: 'Black keys come in groups of two and three. That pattern is your map.',
    steps: [
      {
        type: 'text',
        title: 'A repeating pattern',
        body: [
          'A piano looks like a lot of keys, but it is really one small pattern repeated over and over.',
          'Look at the black keys. They alternate between a group of **two** and a group of **three**. That pair-then-triple pattern repeats all the way up the keyboard, and every white key gets its name from where it sits relative to those groups.',
          'Once you can see the groups, you never have to count keys again.',
        ],
        highlight: { notes: [61, 63, 66, 68, 70, 73, 75, 78, 80, 82], kind: 'hint' },
      },
      {
        type: 'find',
        title: 'Find C',
        body: ['**C is the white key immediately to the left of any group of two black keys.** Find one anywhere on the keyboard and play it.'],
        target: { pitchClass: 0 },
        prompt: 'Play any C',
      },
      {
        type: 'find',
        title: 'Find F',
        body: ['**F is the white key immediately to the left of any group of three black keys.** Play any F.'],
        target: { pitchClass: 5 },
        prompt: 'Play any F',
      },
      {
        type: 'quiz',
        question: 'Which white key sits between the two black keys of a two-key group?',
        options: ['C', 'D', 'E', 'G'],
        answer: 1,
        explain: 'C is left of the pair, D is in the middle, E is on the right. C–D–E always straddles a group of two.',
      },
    ],
  },
  {
    id: 'kb-names',
    unit: 'keyboard',
    title: 'Naming the white keys',
    summary: 'Seven letters, A to G, then straight back to A.',
    steps: [
      {
        type: 'text',
        title: 'A through G, forever',
        body: [
          'White keys are named with the first seven letters of the alphabet: **A B C D E F G**. After G it starts again at A.',
          'Because the black-key pattern repeats every seven white keys, the letters line up with it perfectly. C is always left of a pair of black keys; F is always left of a triple.',
          'The distance from one C to the next C is called an **octave** — eight letter names counting both ends.',
        ],
        highlight: { notes: [60, 62, 64, 65, 67, 69, 71, 72], kind: 'hint' },
        labels: 'all',
      },
      { type: 'find', title: 'Find G', body: ['G sits between the second and third black key of a group of three.'], target: { pitchClass: 7 }, prompt: 'Play any G' },
      { type: 'find', title: 'Find A', body: ['A is the next white key up from G.'], target: { pitchClass: 9 }, prompt: 'Play any A' },
      { type: 'find', title: 'Find B', body: ['B is the white key immediately to the **right** of a group of three black keys — and the one immediately below C.'], target: { pitchClass: 11 }, prompt: 'Play any B' },
      {
        type: 'quiz',
        question: 'You play a C, then move up seven white keys. What note are you on?',
        options: ['B', 'C', 'D', 'G'],
        answer: 1,
        explain: 'Seven white keys up from C lands on the next C — one octave higher.',
      },
    ],
  },
  {
    id: 'kb-middle-c',
    unit: 'keyboard',
    title: 'Middle C and octave numbers',
    summary: 'Every note has a number telling you which octave it lives in.',
    steps: [
      {
        type: 'text',
        title: 'Which C?',
        body: [
          'There are seven or eight Cs on a full piano, so "play a C" is ambiguous. Musicians number the octaves: the C nearest the middle of the keyboard is **C4**, usually called **middle C**.',
          'The octave number changes at C, not at A. So B3 and C4 are neighbours, and the note just above B3 is C4.',
          'On this app every key is labelled with its octave number when you turn labels on.',
        ],
        highlight: { notes: [60], kind: 'root' },
      },
      { type: 'play', title: 'Play middle C', body: ['Find C4 — the C closest to the middle — and play it.'], notes: [60], mode: 'sequence', prompt: 'Play C4' },
      { type: 'play', title: 'An octave up', body: ['Now play C4 and then C5, the next C above it.'], notes: [60, 72], mode: 'sequence', prompt: 'Play C4 then C5' },
      {
        type: 'quiz',
        question: 'Which note is one step **below** C4?',
        options: ['B4', 'B3', 'D4', 'C3'],
        answer: 1,
        explain: 'Octave numbers change at C, so the white key below C4 is B3.',
      },
    ],
  },
  {
    id: 'kb-fingers',
    unit: 'keyboard',
    title: 'Finger numbers and hand shape',
    summary: 'Thumbs are 1. Both hands. Always.',
    steps: [
      {
        type: 'text',
        title: 'Numbering',
        body: [
          'Piano music labels fingers **1 to 5**, starting at the thumb: thumb 1, index 2, middle 3, ring 4, little finger 5. This is true for both hands, so the two 1s are the two thumbs, pointing at each other.',
          'Hand shape matters more than it sounds. Let your hand hang loose at your side, then lift it to the keys without changing its shape — that natural curve, with the wrist level and the fingertips (not the pads) on the keys, is the position you want.',
          'Play from the fingertip with a relaxed wrist. If your knuckles collapse or your wrist drops below the keys, stop and reset.',
        ],
      },
      {
        type: 'play',
        title: 'Five-finger position',
        body: ['Put your **right hand** thumb on C4 and let the other fingers fall on D, E, F and G. Play all five notes going up, one finger each.'],
        notes: [60, 62, 64, 65, 67],
        fingers: [1, 2, 3, 4, 5],
        mode: 'sequence',
        prompt: 'Play C D E F G with fingers 1 2 3 4 5',
      },
      {
        type: 'play',
        title: 'And back down',
        body: ['Now come back down: G F E D C, fingers 5 4 3 2 1. Keep the notes even — same volume, same spacing.'],
        notes: [67, 65, 64, 62, 60],
        fingers: [5, 4, 3, 2, 1],
        mode: 'sequence',
        prompt: 'Play G F E D C',
      },
    ],
  },

  // -- Unit 2: first melodies ----------------------------------------------
  {
    id: 'tune-mary',
    unit: 'first-tunes',
    title: 'Mary Had a Little Lamb',
    summary: 'Your first real melody, without moving your hand.',
    steps: [
      {
        type: 'text',
        title: 'Three notes to start',
        body: [
          'This melody uses only **C, D and E** — fingers 1, 2 and 3 of the right hand — plus one G near the end.',
          'Set up in five-finger position (thumb on C4) and leave your hand there. Every note is already under a finger, so the only job is choosing the right one.',
        ],
      },
      { type: 'play', title: 'First phrase', body: ['E D C D — fingers 3 2 1 2.'], notes: [64, 62, 60, 62], fingers: [3, 2, 1, 2], mode: 'sequence', prompt: 'Play E D C D' },
      { type: 'play', title: 'Second phrase', body: ['E E E, then D D D.'], notes: [64, 64, 64, 62, 62, 62], mode: 'sequence', prompt: 'Play E E E D D D' },
      { type: 'play', title: 'The reach to G', body: ['E, then G with finger 5, then G again.'], notes: [64, 67, 67], fingers: [3, 5, 5], mode: 'sequence', prompt: 'Play E G G' },
      { type: 'song', title: 'Play it through', body: ['Open the full song and play it hands-alone at a comfortable tempo.'], songId: 'mary' },
    ],
  },
  {
    id: 'tune-twinkle',
    unit: 'first-tunes',
    title: 'Twinkle, Twinkle, Little Star',
    summary: 'A five-note reach and your first repeated pattern.',
    steps: [
      {
        type: 'text',
        title: 'Spot the pattern',
        body: [
          'The tune is built from three phrases, and the third is just the second one repeated. Music is full of repetition — noticing it means you learn a piece in a third of the time.',
          'Stay in five-finger position on C. The only new thing is the jump from C up to G at the start.',
        ],
      },
      { type: 'play', title: 'The opening jump', body: ['C C G G — thumb, thumb, little finger, little finger.'], notes: [60, 60, 67, 67], fingers: [1, 1, 5, 5], mode: 'sequence', prompt: 'Play C C G G' },
      { type: 'play', title: 'Coming down', body: ['A A G — the A needs finger 5 to stretch one key further, or shift your hand slightly.'], notes: [69, 69, 67], mode: 'sequence', prompt: 'Play A A G' },
      { type: 'play', title: 'The descent', body: ['F F E E D D C — a straight walk down.'], notes: [65, 65, 64, 64, 62, 62, 60], mode: 'sequence', prompt: 'Play F F E E D D C' },
      { type: 'song', title: 'Play it through', body: ['Try the full song. Turn on wait mode if you want it to hold until you find each note.'], songId: 'twinkle' },
    ],
  },
  {
    id: 'tune-ode',
    unit: 'first-tunes',
    title: 'Ode to Joy',
    summary: 'Stepwise motion and your first dotted rhythm.',
    steps: [
      {
        type: 'text',
        title: 'Mostly steps',
        body: [
          'Beethoven wrote this melody almost entirely in **steps** — each note moves to its immediate neighbour. Stepwise melodies are the easiest to play and the easiest to sing, which is exactly why this one is so famous.',
          'Start with finger 3 on E4 so the whole phrase sits under your hand.',
        ],
      },
      { type: 'play', title: 'The opening', body: ['E E F G — fingers 3 3 4 5.'], notes: [64, 64, 65, 67], fingers: [3, 3, 4, 5], mode: 'sequence', prompt: 'Play E E F G' },
      { type: 'play', title: 'And back', body: ['G F E D — fingers 5 4 3 2.'], notes: [67, 65, 64, 62], fingers: [5, 4, 3, 2], mode: 'sequence', prompt: 'Play G F E D' },
      { type: 'play', title: 'The turn', body: ['C C D E — the melody dips to the bottom of the hand and climbs again.'], notes: [60, 60, 62, 64], fingers: [1, 1, 2, 3], mode: 'sequence', prompt: 'Play C C D E' },
      { type: 'song', title: 'Play it through', body: ['The full melody, with a left-hand part if you want it.'], songId: 'ode-to-joy' },
    ],
  },

  // -- Unit 3: reading ------------------------------------------------------
  {
    id: 'read-staff',
    unit: 'reading',
    title: 'The staff and the treble clef',
    summary: 'Five lines, four spaces, and where the notes sit on them.',
    steps: [
      {
        type: 'text',
        title: 'Higher on the page, higher on the keyboard',
        body: [
          'Written music sits on a **staff**: five lines with four spaces between them. A note drawn higher on the staff sounds higher on the keyboard. That is the whole idea.',
          'The curly symbol at the start is a **clef**. It fixes which line means which note. The treble clef curls around the second line from the bottom, and that line is **G4** — the G above middle C. That is why it is also called the G clef.',
          'From that one anchor you can work out everything else by stepping up and down: line, space, line, space.',
        ],
        staff: { clef: 'treble', events: [{ midis: [67], label: 'G4' }] },
      },
      {
        type: 'text',
        title: 'Lines and spaces',
        body: [
          'On the treble staff the notes sitting **on the lines**, bottom to top, are **E G B D F**. The notes in the **spaces**, bottom to top, spell **F A C E**.',
          'Plenty of people learn a mnemonic for the lines ("Every Good Boy Deserves Fruit"). Use one if it helps, but the real goal is to stop translating: eventually you want to see a note and feel a key, with no letter name in between.',
        ],
        staff: {
          clef: 'treble',
          events: [
            { midis: [64], label: 'E' }, { midis: [67], label: 'G' }, { midis: [71], label: 'B' },
            { midis: [74], label: 'D' }, { midis: [77], label: 'F' },
          ],
        },
      },
      { type: 'staff', title: 'Read and play', body: ['Play the note shown.'], notes: [64, 67, 71, 65, 69], clef: 'treble', prompt: 'Play the note on the staff' },
    ],
  },
  {
    id: 'read-middle-c',
    unit: 'reading',
    title: 'Middle C and ledger lines',
    summary: 'What happens when a note falls off the bottom of the staff.',
    steps: [
      {
        type: 'text',
        title: 'Extending the staff',
        body: [
          'Middle C is too low for the treble staff, so it gets its own tiny extra line — a **ledger line** — drawn just for that note.',
          'Ledger lines simply continue the pattern of lines and spaces beyond the staff. One ledger line below the treble staff is C4; the space just above it is D4; the bottom line of the staff is E4.',
        ],
        staff: { clef: 'treble', events: [{ midis: [60], label: 'C4' }, { midis: [62], label: 'D4' }, { midis: [64], label: 'E4' }] },
      },
      { type: 'staff', title: 'Read the low notes', body: ['Each of these sits at or near middle C.'], notes: [60, 62, 64, 60, 65], clef: 'treble', prompt: 'Play the note on the staff' },
    ],
  },
  {
    id: 'read-bass',
    unit: 'reading',
    title: 'The bass clef',
    summary: 'The left hand gets its own staff, anchored on F.',
    steps: [
      {
        type: 'text',
        title: 'The F clef',
        body: [
          'The left hand usually plays below middle C, which would need a forest of ledger lines on a treble staff. So it gets its own staff with a **bass clef**.',
          'The bass clef\'s two dots sit either side of the second line from the top, and that line is **F3** — the F below middle C. Hence its other name, the F clef.',
          'Lines bottom to top are **G B D F A**; spaces are **A C E G**.',
        ],
        staff: { clef: 'bass', events: [{ midis: [53], label: 'F3' }] },
      },
      { type: 'staff', title: 'Read the bass staff', body: ['Play each note with your left hand.'], notes: [53, 48, 55, 50, 57], clef: 'bass', prompt: 'Play the note on the staff' },
    ],
  },
  {
    id: 'read-grand',
    unit: 'reading',
    title: 'The grand staff',
    summary: 'Two staves, one keyboard, middle C in the gap between them.',
    steps: [
      {
        type: 'text',
        title: 'Joined at the middle',
        body: [
          'Piano music uses both staves at once, braced together into a **grand staff**. Treble on top for the right hand, bass below for the left.',
          'The clever part is the gap: middle C sits on a ledger line exactly halfway between the two staves. It can be written hanging below the treble staff or perched above the bass staff — same key either way.',
          'The two staves are really one continuous ladder of lines and spaces with middle C as the rung in the middle.',
        ],
        staff: { clef: 'grand', events: [{ midis: [60], label: 'C4' }, { midis: [64] }, { midis: [55] }, { midis: [48], label: 'C3' }] },
      },
      { type: 'staff', title: 'Read both staves', body: ['Notes above the gap are right hand, below it are left hand.'], notes: [60, 52, 67, 45, 72, 48], clef: 'grand', prompt: 'Play the note on the staff' },
      {
        type: 'quiz',
        question: 'A note is written on a ledger line just above the bass staff. Which note is it?',
        options: ['B3', 'Middle C (C4)', 'A3', 'D4'],
        answer: 1,
        explain: 'One ledger line above the bass staff is middle C — the same note as one ledger line below the treble staff.',
      },
    ],
  },

  // -- Unit 4: rhythm -------------------------------------------------------
  {
    id: 'rhythm-values',
    unit: 'rhythm',
    title: 'Note values',
    summary: 'Whole, half, quarter, eighth — each one half the length of the last.',
    steps: [
      {
        type: 'text',
        title: 'Halving all the way down',
        body: [
          'Rhythm in written music is built on repeated halving. A **whole note** lasts four beats. A **half note** is half of that: two beats. A **quarter note** is one beat. An **eighth note** is half a beat.',
          'You can see it in how they are drawn. A whole note is a hollow head with no stem. Add a stem and it becomes a half note. Fill the head in and it becomes a quarter note. Add a flag to the stem and it becomes an eighth note.',
          'Counting out loud is not optional when you are learning. Say "one two three four" steadily and fit the notes into it.',
        ],
        staff: {
          clef: 'treble',
          events: [
            { midis: [60], duration: 'whole', label: '4' }, { midis: [62], duration: 'half', label: '2' },
            { midis: [64], duration: 'quarter', label: '1' }, { midis: [65], duration: 'eighth', label: '½' },
          ],
        },
      },
      {
        type: 'quiz',
        question: 'How many eighth notes fit in one half note?',
        options: ['Two', 'Three', 'Four', 'Eight'],
        answer: 2,
        explain: 'A half note is two beats, and each beat holds two eighth notes — so four.',
      },
      {
        type: 'text',
        title: 'Dots add half again',
        body: [
          'A dot after a note makes it **half as long again**. A dotted half note is 2 + 1 = three beats. A dotted quarter is 1 + ½ = one and a half beats.',
          'The dotted-quarter-plus-eighth pattern is everywhere — it is the "long-short" lilt at the start of *Silent Night* and *London Bridge*.',
        ],
      },
    ],
  },
  {
    id: 'rhythm-time-signature',
    unit: 'rhythm',
    title: 'Time signatures and the metronome',
    summary: 'How many beats in a bar, and how long a beat is.',
    steps: [
      {
        type: 'text',
        title: 'Two numbers, two questions',
        body: [
          'The pair of numbers at the start of a piece is the **time signature**. The top number says how many beats are in each bar. The bottom number says which note value counts as one beat: 4 means a quarter note, 8 means an eighth note.',
          'So 4/4 is four quarter-note beats per bar — the default for most pop, rock and folk music. 3/4 is three, which gives you a waltz. 6/8 is six eighth-note beats, usually felt as two groups of three.',
          'The first beat of each bar gets a natural emphasis. That is what makes 3/4 feel like a waltz and 4/4 feel like a march.',
        ],
      },
      {
        type: 'metronome',
        title: 'Play with the click',
        body: ['Start the metronome and play any note on each click. Do it for eight beats without rushing or dragging. Slower is harder than it sounds.'],
        beats: 8,
        tempo: 80,
        prompt: 'Play one note per click, eight times',
      },
      {
        type: 'quiz',
        question: 'A piece is in 3/4. How many quarter notes fit in one bar?',
        options: ['Two', 'Three', 'Four', 'Six'],
        answer: 1,
        explain: 'Top number 3 = three beats per bar; bottom number 4 = each beat is a quarter note.',
      },
    ],
  },

  // -- Unit 5: scales -------------------------------------------------------
  {
    id: 'scale-sharps-flats',
    unit: 'scales',
    title: 'Sharps, flats and half steps',
    summary: 'The smallest distance on a piano, and the symbols that move you by one.',
    steps: [
      {
        type: 'text',
        title: 'Half steps and whole steps',
        body: [
          'A **half step** is the distance from any key to the very next key, black or white, with nothing in between. C to C sharp is a half step; so is E to F, because there is no black key between them.',
          'A **whole step** is two half steps — C to D, for instance.',
          'A **sharp** (♯) raises a note by a half step. A **flat** (♭) lowers it by one. A **natural** (♮) cancels either.',
          'This means one key can have two names: the black key between C and D is both C sharp and D flat. Which name you use depends on the key you are in, not on the sound.',
        ],
        highlight: { notes: [61], kind: 'root' },
      },
      { type: 'play', title: 'Half steps', body: ['Play C, then C sharp, then D — three keys in a row, two half steps.'], notes: [60, 61, 62], mode: 'sequence', prompt: 'Play C, C♯, D' },
      {
        type: 'quiz',
        question: 'How many half steps are there between E and F?',
        options: ['None — they are the same', 'One', 'Two', 'Three'],
        answer: 1,
        explain: 'E and F are neighbouring white keys with no black key between them, so they are exactly one half step apart. The same is true of B and C.',
      },
    ],
  },
  {
    id: 'scale-major',
    unit: 'scales',
    title: 'The major scale',
    summary: 'One formula of whole and half steps, playable from any note.',
    steps: [
      {
        type: 'text',
        title: 'W W H W W W H',
        body: [
          'A major scale is seven notes built by a fixed recipe of steps: **whole, whole, half, whole, whole, whole, half**, ending back on the note you started from an octave higher.',
          'Start on C and follow that recipe and you land on nothing but white keys — which is why C major is where everyone begins.',
          'Start anywhere else and the same recipe forces you onto black keys. That is not a complication; it is the entire reason sharps and flats exist.',
        ],
      },
      {
        type: 'play',
        title: 'C major, right hand',
        body: [
          'Fingering matters here. Play C D E with fingers 1 2 3, then tuck your **thumb under** your third finger to land on F with finger 1, and continue G A B C with 2 3 4 5.',
          'The thumb-under is the single most important move in piano technique. Keep the hand quiet — the thumb travels, the arm does not lurch.',
        ],
        notes: [60, 62, 64, 65, 67, 69, 71, 72],
        fingers: [1, 2, 3, 1, 2, 3, 4, 5],
        mode: 'sequence',
        prompt: 'Play the C major scale up',
      },
      {
        type: 'play',
        title: 'And back down',
        body: ['Coming down: 5 4 3 2 1, then cross finger 3 **over** the thumb for E, and finish 2 1.'],
        notes: [72, 71, 69, 67, 65, 64, 62, 60],
        fingers: [5, 4, 3, 2, 1, 3, 2, 1],
        mode: 'sequence',
        prompt: 'Play the C major scale down',
      },
      {
        type: 'quiz',
        question: 'Applying W W H W W W H starting on G, which note has to be raised?',
        options: ['C, to C sharp', 'F, to F sharp', 'B, to B flat', 'None — G major is all white keys'],
        answer: 1,
        explain: 'G A B C D E F♯ G. The last step must be a half step into G, so F becomes F sharp — which is why G major has one sharp.',
      },
    ],
  },
  {
    id: 'scale-key-signatures',
    unit: 'scales',
    title: 'Key signatures',
    summary: 'Writing the sharps once at the start instead of on every note.',
    steps: [
      {
        type: 'text',
        title: 'A shortcut that became a label',
        body: [
          'If a piece in G major needs every F to be sharp, writing a sharp on each one is tedious. Instead a single sharp is placed on the F line at the start of every staff — the **key signature** — and from then on every F is sharp unless a natural cancels it.',
          'Key signatures accumulate in a fixed order. Sharps arrive as **F C G D A E B**; flats arrive in exactly the reverse, **B E A D G C F**.',
          'The pattern is not arbitrary: each new sharp key is a fifth above the last (C, G, D, A, E…). Arrange them in a circle and you get the **circle of fifths**.',
        ],
        staff: { clef: 'treble', keySignature: 1, events: [{ midis: [67], label: 'G major' }] },
      },
      {
        type: 'quiz',
        question: 'A piece has two sharps in its key signature. Which are they?',
        options: ['F sharp and C sharp', 'B flat and E flat', 'C sharp and G sharp', 'F sharp and B flat'],
        answer: 0,
        explain: 'Sharps always appear in the order F C G D A E B, so two sharps means F sharp and C sharp — the key of D major.',
      },
      {
        type: 'quiz',
        question: 'How do you find the major key from a sharp key signature?',
        options: [
          'Count the sharps and go up that many notes from C',
          'Take the last sharp and go up a half step',
          'Take the first sharp and go down a whole step',
          'Look at the first note of the piece',
        ],
        answer: 1,
        explain: 'The last sharp is always the seventh degree of the scale, so a half step above it is the tonic. Three sharps end on G sharp; a half step up is A major.',
      },
    ],
  },
  {
    id: 'scale-minor',
    unit: 'scales',
    title: 'Minor scales',
    summary: 'The same seven notes, a different home, a different mood.',
    steps: [
      {
        type: 'text',
        title: 'Relative minor',
        body: [
          'Play all the white keys from A to A instead of C to C and you get **A natural minor**. Same keys, different starting point, completely different character.',
          'Every major key has a **relative minor** built on its sixth degree, sharing its key signature. C major and A minor share no sharps or flats; G major and E minor share one sharp.',
          'The minor scale formula is **W H W W H W W**. Compared to major, the third, sixth and seventh degrees are each a half step lower — the flattened third is what your ear hears as "sad".',
        ],
      },
      { type: 'play', title: 'A natural minor', body: ['All white keys from A up to A.'], notes: [57, 59, 60, 62, 64, 65, 67, 69], fingers: [1, 2, 3, 1, 2, 3, 4, 5], mode: 'sequence', prompt: 'Play A natural minor' },
      {
        type: 'text',
        title: 'Harmonic minor',
        body: [
          'Natural minor has a weak ending: the seventh degree is a whole step below the tonic, so it does not pull home the way a major scale does.',
          'Composers fix this by raising the seventh a half step, giving the **harmonic minor** scale. In A minor that means G sharp. The gap it creates between the sixth and seventh degrees is a step and a half, and that exotic interval is the sound of everything from Bach cadences to Middle Eastern folk music.',
        ],
      },
      { type: 'play', title: 'A harmonic minor', body: ['Same as before, but G becomes G sharp.'], notes: [57, 59, 60, 62, 64, 65, 68, 69], mode: 'sequence', prompt: 'Play A harmonic minor' },
    ],
  },

  // -- Unit 6: chords -------------------------------------------------------
  {
    id: 'chord-triads',
    unit: 'chords',
    title: 'Triads: major and minor',
    summary: 'Three notes, skipping one key each time.',
    steps: [
      {
        type: 'text',
        title: 'Stacked thirds',
        body: [
          'A **triad** is three notes taken from a scale by skipping alternate notes: play the first, skip one, play the next, skip one, play the next. From C that gives C E G.',
          'The distance from the bottom note to the middle one decides the flavour. Four half steps makes it **major** — bright, settled. Three half steps makes it **minor** — darker, softer. The top note is a perfect fifth above the root either way.',
          'Everything else in harmony is a variation on this one shape.',
        ],
      },
      { type: 'play', title: 'C major', body: ['C, E and G together. Fingers 1, 3 and 5.'], notes: [60, 64, 67], fingers: [1, 3, 5], mode: 'chord', prompt: 'Play a C major chord' },
      { type: 'play', title: 'C minor', body: ['Move the middle note down one half step: C, E flat, G.'], notes: [60, 63, 67], fingers: [1, 3, 5], mode: 'chord', prompt: 'Play a C minor chord' },
      {
        type: 'quiz',
        question: 'What makes a triad minor rather than major?',
        options: ['The top note is lower', 'The middle note is a half step lower', 'It has four notes', 'It starts on a black key'],
        answer: 1,
        explain: 'Only the third moves. Lowering it from four half steps to three turns major into minor; the fifth is unchanged.',
      },
    ],
  },
  {
    id: 'chord-primary',
    unit: 'chords',
    title: 'The three chords that play everything',
    summary: 'I, IV and V — enough for a startling number of songs.',
    steps: [
      {
        type: 'text',
        title: 'Numbering the chords',
        body: [
          'Build a triad on each degree of a major scale and you get seven chords. Musicians label them with Roman numerals: uppercase for major, lowercase for minor. In C major that is **C Dm Em F G Am B°** — or I ii iii IV V vi vii°.',
          'Three of them do most of the work. **I** is home. **V** creates tension that wants to resolve back to I. **IV** sits in between, moving away from home without the pull of V.',
          'I, IV and V in any key will get you through a huge amount of folk, blues, country and pop.',
        ],
      },
      { type: 'play', title: 'I — C major', body: ['C E G.'], notes: [60, 64, 67], mode: 'chord', prompt: 'Play C major' },
      { type: 'play', title: 'IV — F major', body: ['F A C.'], notes: [65, 69, 72], mode: 'chord', prompt: 'Play F major' },
      { type: 'play', title: 'V — G major', body: ['G B D.'], notes: [67, 71, 74], mode: 'chord', prompt: 'Play G major' },
      {
        type: 'quiz',
        question: 'In the key of G major, what is the V chord?',
        options: ['C major', 'D major', 'E minor', 'G major'],
        answer: 1,
        explain: 'Counting up the G major scale — G A B C D — the fifth degree is D, so V is D major.',
      },
    ],
  },
  {
    id: 'chord-inversions',
    unit: 'chords',
    title: 'Inversions',
    summary: 'Same chord, different note on the bottom, much less hand movement.',
    steps: [
      {
        type: 'text',
        title: 'Rotating the notes',
        body: [
          'Take the bottom note of C E G and move it up an octave: E G C. Still a C major chord — just in **first inversion**. Do it again for G C E, **second inversion**.',
          'Inversions exist to keep your hand still. Going from C major to F major in root position means jumping your whole hand. Using F in second inversion (C F A) lets you move two fingers and leave the thumb where it is.',
          'They also smooth out the bass line, which is why almost no real music uses root position all the way through.',
        ],
      },
      { type: 'play', title: 'Root position', body: ['C E G.'], notes: [60, 64, 67], mode: 'chord', prompt: 'Play C major, root position' },
      { type: 'play', title: 'First inversion', body: ['E G C — the C has moved to the top.'], notes: [64, 67, 72], mode: 'chord', prompt: 'Play C major, first inversion' },
      { type: 'play', title: 'Second inversion', body: ['G C E.'], notes: [67, 72, 76], mode: 'chord', prompt: 'Play C major, second inversion' },
      { type: 'play', title: 'Smooth voice leading', body: ['Now try C major in root position, then F major in second inversion. Notice how little your hand has to move.'], notes: [65, 69, 72], mode: 'chord', prompt: 'Play F major, second inversion (C F A)' },
    ],
  },

  // -- Unit 7: hands together ----------------------------------------------
  {
    id: 'together-blocked',
    unit: 'together',
    title: 'Left hand chords under a melody',
    summary: 'The simplest accompaniment there is.',
    steps: [
      {
        type: 'text',
        title: 'One chord per bar',
        body: [
          'The easiest way to accompany yourself is to hold a chord in the left hand for a whole bar while the right hand plays the tune.',
          'Left hand fingering for a root-position triad is the mirror of the right: **5, 3, 1** from the bottom up, because the little finger takes the lowest note.',
          'Play the chords an octave or two below middle C so they support the melody rather than crowd it.',
        ],
      },
      { type: 'play', title: 'Left hand C major', body: ['C3 E3 G3 with fingers 5, 3, 1.'], notes: [48, 52, 55], fingers: [5, 3, 1], mode: 'chord', prompt: 'Play C major in the left hand' },
      { type: 'play', title: 'Left hand G major', body: ['G2 B2 D3.'], notes: [43, 47, 50], fingers: [5, 3, 1], mode: 'chord', prompt: 'Play G major in the left hand' },
      { type: 'song', title: 'Both hands', body: ['Play *Mary Had a Little Lamb* with both hands. Start slowly enough that you never have to stop.'], songId: 'mary' },
    ],
  },
  {
    id: 'together-broken',
    unit: 'together',
    title: 'Broken chords and Alberti bass',
    summary: 'Turning a held chord into movement.',
    steps: [
      {
        type: 'text',
        title: 'Spreading the chord out',
        body: [
          'Holding a block chord for four beats gets dull. Break the chord into single notes instead and the accompaniment starts to move.',
          'The classic pattern is the **Alberti bass**: lowest, highest, middle, highest. On a C major chord that is C, G, E, G — repeated under the melody. Mozart used it constantly.',
          'Keep it quiet. The accompaniment should be felt, not heard over the tune.',
        ],
      },
      { type: 'play', title: 'Alberti bass on C', body: ['C G E G, left hand, fingers 5 1 3 1.'], notes: [48, 55, 52, 55], fingers: [5, 1, 3, 1], mode: 'sequence', prompt: 'Play C G E G' },
      { type: 'play', title: 'Alberti bass on G', body: ['G D B D.'], notes: [43, 50, 47, 50], fingers: [5, 1, 3, 1], mode: 'sequence', prompt: 'Play G D B D' },
      { type: 'song', title: 'Hear it in context', body: ['Bach\'s Prelude in C is one long broken chord. Play it slowly and listen to the harmony change under the pattern.'], songId: 'prelude-in-c' },
    ],
  },

  // -- Unit 8: expression ---------------------------------------------------
  {
    id: 'expr-dynamics',
    unit: 'expression',
    title: 'Dynamics',
    summary: 'The difference between playing notes and playing music.',
    steps: [
      {
        type: 'text',
        title: 'Loud, soft, and everything between',
        body: [
          'Dynamic markings are Italian abbreviations: **pp** very soft, **p** soft, **mp** moderately soft, **mf** moderately loud, **f** loud, **ff** very loud. A hairpin `<` means get gradually louder (*crescendo*), `>` means get gradually softer (*diminuendo*).',
          'On a piano, volume comes entirely from key speed. A fast key press is loud, a slow one is soft — nothing else you do to the key changes the sound.',
          'The most common beginner habit is playing everything at one volume. Try any phrase you know twice: once flat, once shaping it louder as it rises and softer as it falls. The second version is the one that sounds like music.',
        ],
      },
      {
        type: 'text',
        title: 'Balance between the hands',
        body: [
          'The melody should be louder than the accompaniment — usually noticeably so. This is harder than it sounds because both hands want to press with the same force.',
          'Practise it directly: play a left-hand chord as softly as you can while playing a right-hand melody at normal volume. Exaggerate until the difference is obvious, then dial it back.',
        ],
      },
    ],
  },
  {
    id: 'expr-pedal',
    unit: 'expression',
    title: 'The sustain pedal',
    summary: 'Connecting notes you cannot hold with your fingers.',
    steps: [
      {
        type: 'text',
        title: 'What it actually does',
        body: [
          'The right pedal lifts the dampers off every string, so notes keep sounding after you release the keys and the whole instrument resonates sympathetically.',
          'It is not a volume pedal and it is not a way to cover up gaps in your playing. Held down through a chord change, it turns harmony into mush.',
          'The standard technique is **legato pedalling**: change the pedal *just after* you play the new chord, not with it. Play, then lift and re-press the pedal in one quick motion. The new note is already sounding, so nothing breaks, but the old harmony is cleared.',
          'In this app, hold the **space bar** to sustain, or use a real pedal if you have a MIDI keyboard connected.',
        ],
      },
      {
        type: 'text',
        title: 'A rule of thumb',
        body: [
          'Change the pedal whenever the harmony changes. If you can hear two different chords ringing at once, you changed too late.',
          'When in doubt, use less. A clean unpedalled performance sounds far better than a blurred pedalled one.',
        ],
      },
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
