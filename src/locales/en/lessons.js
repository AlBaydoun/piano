/**
 * English course text.
 *
 * Keyed by lesson id; `steps` runs parallel to the `steps` array in
 * `src/data/lessons.js`, so index 0 here describes step 0 there. Note names
 * are written as `{note:C}` so they render in the reader's naming system.
 */

export default {
  // == Unit 1: before you play ==============================================

  'f-instrument': {
    title: 'What a piano actually does',
    summary: 'Hammers, strings and the one thing your fingers control.',
    steps: [
      {
        title: 'A machine for hitting strings',
        body: [
          'Press a piano key and you are not pressing on a string. You are releasing a small lever that throws a felt hammer at one — and then immediately lets the hammer fall away so the string can ring.',
          'That mechanism decides everything about how the instrument behaves. Once the hammer has left, you have no further control over the note. You cannot swell it, bend it, or add vibrato the way a singer or a violinist can. All you get is **how fast the hammer was travelling** and **when you let go**.',
          'It sounds like a limitation. In practice it is the whole art: two pianists playing the same notes sound completely different, and the only difference between them is speed and timing.',
        ],
      },
      {
        title: 'Low and high',
        body: [
          'Long, thick strings vibrate slowly and sound low. Short, thin ones vibrate quickly and sound high. That is why a grand piano is shaped the way it is — the case follows the string lengths.',
          'Listen to three notes from the bottom, middle and top of the keyboard. Notice how much longer the low one keeps ringing.',
        ],
      },
      {
        title: 'Fast key, loud note',
        body: [
          'Here is the same key struck slowly and then quickly. Nothing else changed — not the pressure afterwards, not how long it is held.',
          'This is the only volume control your fingers have, so it is worth getting curious about it early.',
        ],
      },
      {
        question: 'Once you have pressed a key, what can you still change about that note?',
        options: [
          'Its pitch, by pressing harder',
          'When it stops, by releasing the key',
          'Its volume, by pressing harder',
          'Nothing at all',
        ],
        explain: 'Extra pressure after the hammer has struck does nothing. Releasing the key drops the damper back onto the string and stops the note, so its length is still yours to shape.',
      },
    ],
  },

  'f-posture': {
    title: 'Sitting down and shaping your hand',
    summary: 'Height, distance, and the hand shape everything else is built on.',
    steps: [
      {
        title: 'Height and distance',
        body: [
          'Sit so your forearms are roughly **level with the keys** — a horizontal line from elbow to knuckle. If your wrists have to reach up, the bench is too low; if they hang down, it is too high.',
          'Sit on the front half of the bench, far enough back that your elbows are slightly in front of your body and you can lean forward without collapsing. Feet flat on the floor. If your feet do not reach, put a book under them: you push against the floor more than you expect.',
          'Centre yourself on {note:D4} — roughly the middle of the keyboard — not on the middle of the piano case.',
        ],
      },
      {
        title: 'The hand shape',
        body: [
          'Let your arm hang loose at your side. Notice the shape your hand naturally falls into: fingers gently curved, thumb relaxed, nothing straight and nothing clenched.',
          'Now lift it to the keys **without changing that shape**. That is the position. You play on the fingertips, with the last joint of each finger firm enough not to buckle.',
          'Two things to watch for. If the knuckle at the base of a finger collapses inwards, the finger has no support. If the wrist drops below the level of the keys, you lose the arm behind the sound. Neither is a moral failing — just reset and carry on.',
        ],
      },
      {
        title: 'One note, properly',
        body: [
          'Play middle {note:C} once with your right-hand third finger. Aim for a sound that is easy and full rather than loud, and let the key come all the way back up before you lift your hand.',
        ],
        prompt: 'Play middle {note:C4}',
      },
      {
        question: 'Your wrists have to angle upwards to reach the keys. What is wrong?',
        options: ['You are sitting too close', 'Your fingers are too curved', 'The bench is too low', 'You are sitting too far away'],
        explain: 'Forearms should run roughly level into the keyboard. Angling upwards means the bench needs raising.',
      },
    ],
  },

  'f-black-keys': {
    title: 'The pattern of black keys',
    summary: 'Black keys come in groups of two and three. That pattern is your map.',
    steps: [
      {
        title: 'A repeating pattern',
        body: [
          'A piano looks like a lot of keys, but it is really one small pattern repeated over and over.',
          'Look at the black keys. They alternate between a group of **two** and a group of **three**. That pair-then-triple pattern repeats all the way up the keyboard, and every white key gets its name from where it sits relative to those groups.',
          'Once you can see the groups, you never have to count keys from the end again.',
        ],
      },
      {
        title: 'Find {note:C}',
        body: ['**{note:C} is the white key immediately to the left of any group of two black keys.** Find one anywhere on the keyboard and play it.'],
        prompt: 'Play any {note:C}',
      },
      {
        title: 'Find {note:F}',
        body: ['**{note:F} is the white key immediately to the left of any group of three black keys.** Play any {note:F}.'],
        prompt: 'Play any {note:F}',
      },
      {
        question: 'Which white key sits between the two black keys of a two-key group?',
        options: ['{note:C}', '{note:D}', '{note:E}', '{note:G}'],
        explain: '{note:C} is left of the pair, {note:D} is in the middle, {note:E} is on the right. Those three always straddle a group of two.',
      },
    ],
  },

  'f-white-keys': {
    title: 'Naming the white keys',
    summary: 'Seven names, then straight back to the beginning — and how to say which one you mean.',
    steps: [
      {
        title: 'Seven names, forever',
        body: [
          'White keys use seven names, and after the seventh they start again. In English they are the letters **A B C D E F G**; in German the seventh is written **H**; in much of the world they are the syllables **Do Re Mi Fa Sol La Si**. They all mean the same keys.',
          'Because the black-key pattern repeats every seven white keys, the names line up with it perfectly. {note:C} is always left of a pair of black keys; {note:F} is always left of a triple.',
          'The distance from one {note:C} to the next {note:C} is called an **octave**.',
        ],
      },
      { title: 'Find {note:G}', body: ['{note:G} sits between the second and third black key of a group of three.'], prompt: 'Play any {note:G}' },
      { title: 'Find {note:A}', body: ['{note:A} is the next white key up from {note:G}.'], prompt: 'Play any {note:A}' },
      { title: 'Find {note:B}', body: ['{note:B} is the white key immediately to the **right** of a group of three black keys — and the one immediately below {note:C}.'], prompt: 'Play any {note:B}' },
      {
        title: 'Which one, though?',
        body: [
          'There are seven or eight {note:C}s on a full piano, so "play a {note:C}" is ambiguous. Musicians number the octaves: the {note:C} nearest the middle of the keyboard is **{note:C4}**, usually called **middle {note:C}**.',
          'The number changes at {note:C}, not at {note:A}. So {note:B3} and {note:C4} are neighbours, and the note just above {note:B3} is {note:C4}.',
        ],
      },
      {
        title: 'An octave apart',
        body: ['Play middle {note:C4}, then {note:C5} — the next {note:C} above it. Same name, twice the frequency.'],
        prompt: 'Play {note:C4} then {note:C5}',
      },
      {
        question: 'Which note is one white key **below** {note:C4}?',
        options: ['{note:B4}', '{note:B3}', '{note:D4}', '{note:C3}'],
        explain: 'Octave numbers change at {note:C}, so the white key below {note:C4} is {note:B3}.',
      },
    ],
  },

  // == Unit 2: first contact ================================================

  'fc-fingers': {
    title: 'Finger numbers',
    summary: 'Thumbs are 1. Both hands. Always.',
    steps: [
      {
        title: 'Numbering',
        body: [
          'Piano music labels fingers **1 to 5**, starting at the thumb: thumb 1, index 2, middle 3, ring 4, little finger 5. This is true for both hands, so the two 1s are the two thumbs, pointing at each other.',
          'Guitarists and string players number differently, which trips people up. On the piano the thumb is always 1.',
          'Fingering written into a score is not decoration. It is usually the difference between a passage that works and one that ties your hand in a knot three bars later.',
        ],
      },
      {
        title: 'Up with the right hand',
        body: ['Put your **right** thumb on {note:C4} and let the other fingers fall on the next four white keys. Play all five going up, one finger each.'],
        prompt: 'Play {note:C} {note:D} {note:E} {note:F} {note:G} with fingers 1 2 3 4 5',
      },
      {
        title: 'And back down',
        body: ['Now come back down, 5 4 3 2 1. Keep the notes even — same volume, same spacing. Evenness is harder than speed and matters more.'],
        prompt: 'Play {note:G} {note:F} {note:E} {note:D} {note:C}',
      },
      {
        question: 'In piano music, which finger is number 1?',
        options: ['The thumb', 'The index finger', 'The little finger', 'It depends on the hand'],
        explain: 'The thumb is 1 in both hands, so the numbers mirror each other across the keyboard.',
      },
    ],
  },

  'fc-five-finger': {
    title: 'The five-finger position',
    summary: 'Five keys under five fingers, and nothing has to move.',
    steps: [
      {
        title: 'A place to stand',
        body: [
          'With the right thumb on {note:C4}, five white keys sit under five fingers. Everything you play in this unit lives inside that shape, so you can stop looking at your hand and start listening.',
          'The left hand does the same thing an octave or two lower, with the **little finger** on the low {note:C} — the hands are mirror images, so the left runs 5 4 3 2 1 going up.',
          'Keep the fingers you are not using resting lightly on their keys. Lifting them into the air is wasted motion and it tires the hand.',
        ],
      },
      {
        title: 'Skipping around',
        body: ['Play these six notes. They stay inside the position but jump about, so you have to think in fingers rather than in a straight run.'],
        prompt: 'Play the notes in order',
      },
      {
        title: 'The same thing, left hand',
        body: ['Now the mirror image, an octave lower, with the left hand. Little finger on {note:C3}.'],
        prompt: 'Play the notes with the left hand',
      },
      {
        title: 'In time',
        body: ['Start the metronome and play any note in the position on each click. Slow is harder than fast — resist the urge to hurry.'],
        prompt: 'Play one note per click',
      },
    ],
  },

  'fc-mary': {
    title: 'Your first melody',
    summary: 'Three notes, no hand movement, a tune everybody knows.',
    steps: [
      {
        title: 'Three notes to start',
        body: [
          '*Mary Had a Little Lamb* uses only {note:C}, {note:D} and {note:E} — fingers 1, 2 and 3 — plus one {note:G} near the end.',
          'Set up in five-finger position and leave your hand there. Every note is already under a finger, so the only job is choosing the right one.',
          'Say the finger numbers out loud as you play. It feels silly and it works.',
        ],
      },
      { title: 'First phrase', body: ['{note:E} {note:D} {note:C} {note:D} — fingers 3 2 1 2.'], prompt: 'Play {note:E} {note:D} {note:C} {note:D}' },
      { title: 'Second phrase', body: ['Three {note:E}s, then three {note:D}s. Same finger three times in a row — keep them even.'], prompt: 'Play {note:E} {note:E} {note:E} {note:D} {note:D} {note:D}' },
      { title: 'The reach to {note:G}', body: ['{note:E}, then {note:G} with finger 5, then {note:G} again.'], prompt: 'Play {note:E} {note:G} {note:G}' },
      { title: 'Play it through', body: ['Open the full song and play it right hand alone at a comfortable tempo. Wait mode will hold each note until you find it.'] },
    ],
  },

  'fc-twinkle': {
    title: 'Twinkle, Twinkle, Little Star',
    summary: 'A five-note reach and your first repeated pattern.',
    steps: [
      {
        title: 'Spot the pattern',
        body: [
          'The tune is built from three phrases, and the third is simply the second one again. Music is full of repetition — noticing it means you learn a piece in a third of the time.',
          'Before you play anything, look through the piece for repeats. It is the single highest-value habit in this whole course.',
        ],
      },
      { title: 'The opening jump', body: ['{note:C} {note:C} {note:G} {note:G} — thumb, thumb, little finger, little finger.'], prompt: 'Play {note:C} {note:C} {note:G} {note:G}' },
      { title: 'Coming down', body: ['{note:A} {note:A} {note:G}. The {note:A} is one key beyond the position, so stretch finger 5 or shift the hand slightly — either is fine.'], prompt: 'Play {note:A} {note:A} {note:G}' },
      { title: 'The descent', body: ['{note:F} {note:F} {note:E} {note:E} {note:D} {note:D} {note:C} — a straight walk down.'], prompt: 'Play the descent' },
      { title: 'Play it through', body: ['Try the full song. If the left-hand part looks intimidating, switch Hands to *right only* and let the app play the rest.'] },
    ],
  },

  // == Unit 3: rhythm =======================================================

  'r-pulse': {
    title: 'Pulse',
    summary: 'The steady thing underneath everything else.',
    steps: [
      {
        title: 'The beat is not the rhythm',
        body: [
          'Underneath any piece of music there is a steady pulse — the thing you tap your foot to. It does not speed up when the notes get busy or slow down when they thin out. It just keeps going.',
          'The **rhythm** is the pattern of notes you play against that pulse. Confusing the two is the most common reason a piece falls apart: people rush the easy bars and drag the hard ones, and the pulse disappears.',
          'A metronome is not a cruel taskmaster. It is a second pair of ears that never lies to you.',
        ],
      },
      { title: 'Slow pulse', body: ['Sixty beats a minute — one per second. Play any note exactly on each click, eight times.'], prompt: 'Play one note per click' },
      { title: 'Faster pulse', body: ['Now the same at 96. The notes come sooner but the job is identical: land with the click, not just after it.'], prompt: 'Play one note per click' },
      {
        question: 'A passage gets technically harder. What should happen to the pulse?',
        options: ['It slows down naturally', 'It speeds up with the excitement', 'It stays exactly the same', 'It pauses until you are ready'],
        explain: 'The pulse is constant. If a passage is too hard to play in time, the answer is to practise the whole piece slower, not to slow down just at the hard part.',
      },
    ],
  },

  'r-note-values': {
    title: 'Note values',
    summary: 'Whole, half, quarter, eighth — each one half the length of the last.',
    steps: [
      {
        title: 'Halving all the way down',
        body: [
          'Rhythm in written music is built on repeated halving. A **whole note** lasts four beats. A **half note** is two. A **quarter note** is one beat. An **eighth note** is half a beat.',
          'You can see it in how they are drawn. A whole note is a hollow head with no stem. Add a stem and it is a half note. Fill the head in and it is a quarter note. Add a flag to the stem and it is an eighth note.',
          'Count out loud while you learn. Not in your head — out loud. It is the difference between knowing the rhythm and being able to play it.',
        ],
      },
      {
        question: 'How many eighth notes fit inside one half note?',
        options: ['Two', 'Three', 'Four', 'Eight'],
        explain: 'A half note is two beats, and each beat holds two eighth notes — so four.',
      },
      { title: 'Counting in fours', body: ['Set the metronome going and count "one two three four" out loud with it. Play a note on beat 1 of each group of four, and stay silent on 2, 3 and 4.'], prompt: 'Play on the first beat of each bar' },
      {
        question: 'A note lasts two beats in 4/4 time. What is it?',
        options: ['A whole note', 'A half note', 'A quarter note', 'An eighth note'],
        explain: 'A whole note fills all four beats; halving it gives the two-beat half note.',
      },
    ],
  },

  'r-rests': {
    title: 'Rests',
    summary: 'Silence is written down too, and it is measured just as carefully.',
    steps: [
      {
        title: 'Counted silence',
        body: [
          'Every note value has a matching **rest** — a symbol that means "nothing sounds here, for exactly this long". A quarter rest is one beat of silence, an eighth rest half a beat.',
          'Beginners tend to treat rests as optional pauses. They are not: a rest is as measured as a note, and a bar with a missing rest simply does not add up.',
          'On the piano, a rest usually means **lifting the key**, not just stopping. The damper has to come down for the silence to be real.',
        ],
      },
      {
        title: 'Silence has a shape',
        body: [
          'Rests are where phrasing lives. The gap before a phrase starts again is what makes it sound like a new sentence rather than a continuation.',
          'When you practise, count through the rests out loud exactly as you count through the notes. If you find yourself arriving early after a rest, you are almost certainly not counting it.',
        ],
      },
      {
        question: 'You are in 4/4 and a bar contains a half note and a quarter note. What is missing?',
        options: ['Nothing, the bar is complete', 'A half rest', 'An eighth rest', 'A quarter rest'],
        explain: 'Two beats plus one beat is three, and the bar needs four — so one beat of silence, a quarter rest.',
      },
    ],
  },

  'r-time-signatures': {
    title: 'Time signatures',
    summary: 'How many beats in a bar, and how long a beat is.',
    steps: [
      {
        title: 'Two numbers, two questions',
        body: [
          'The pair of numbers at the start of a piece is the **time signature**. The top number says how many beats are in each bar. The bottom number says which note value counts as one beat: 4 means a quarter note, 8 means an eighth.',
          'So 4/4 is four quarter-note beats per bar — the default for most pop, rock and folk music, and so common it is sometimes just written **C** for "common time".',
          'The vertical lines through the staff are **barlines**, and they exist purely to group beats so your eye can find its place.',
        ],
      },
      {
        title: 'Three beats instead of four',
        body: [
          '3/4 gives three beats to a bar, and that one change turns a march into a waltz. *Silent Night*, *Greensleeves* and the minuet in your song library are all in 3/4.',
          'The first beat of each bar carries a natural emphasis. That emphasis, repeating every three beats instead of every four, is the whole difference.',
        ],
      },
      { title: 'Feel the three', body: ['The metronome will accent the first beat of each group of three. Play a note on every click and let yourself feel where "one" is.'], prompt: 'Play one note per click' },
      {
        question: 'A piece is in 3/4. How many quarter notes fit in one bar?',
        options: ['Two', 'Three', 'Four', 'Six'],
        explain: 'Top number 3 means three beats per bar; bottom number 4 means each beat is a quarter note.',
      },
      {
        question: 'What does the bottom number of a time signature tell you?',
        options: ['How many bars are in the piece', 'How fast to play', 'Which note value gets one beat', 'How loud to play'],
        explain: 'It names the beat unit: 4 for a quarter note, 8 for an eighth, 2 for a half.',
      },
    ],
  },

  'r-dots-ties': {
    title: 'Dots and ties',
    summary: 'Two ways of writing a length that has no symbol of its own.',
    steps: [
      {
        title: 'A dot adds half again',
        body: [
          'A dot after a note makes it **half as long again**. A dotted half note is 2 + 1 = three beats. A dotted quarter is 1 + ½ = one and a half beats.',
          'The dotted-quarter-then-eighth pattern is everywhere: it is the long-short lilt at the start of *Silent Night*, *London Bridge* and half the folk songs ever written.',
          'Count it as "one-and-two-and" and put the short note on the second "and". Guessing at it never works.',
        ],
      },
      { title: 'Long, short', body: ['Play these four notes with the first held one and a half beats and the second only half a beat. Say "ONE and two AND" as you do it.'], prompt: 'Play the four notes' },
      {
        title: 'Ties',
        body: [
          'A **tie** is a curved line joining two notes of the same pitch. It means play the first and hold through the second — one sound, two note-values long.',
          'Ties exist because bars have to add up. If you want a note to last across a barline, you cannot just write a longer note; you write two and tie them.',
          'Do not confuse a tie with a **slur**, which looks identical but joins *different* pitches and means play them smoothly. Same curve, opposite instruction — check the note names.',
        ],
      },
      {
        question: 'In 4/4, how long is a dotted half note?',
        options: ['Two beats', 'Three beats', 'Four beats', 'Six beats'],
        explain: 'A half note is two beats and the dot adds half of that again, so three.',
      },
      { title: 'Hear it in a piece', body: ['*London Bridge* opens with the dotted rhythm in its very first bar. Play it slowly enough to count the long-short properly.'] },
    ],
  },

  // == Unit 4: reading the treble staff =====================================

  't-staff': {
    title: 'The staff and the treble clef',
    summary: 'Five lines, four spaces, and where the notes sit on them.',
    steps: [
      {
        title: 'Higher on the page, higher on the keyboard',
        body: [
          'Written music sits on a **staff**: five lines with four spaces between them. A note drawn higher on the staff sounds higher on the keyboard. That is the whole idea.',
          'The curly symbol at the start is a **clef**, and it fixes which line means which note. The treble clef curls around the second line from the bottom, and that line is **{note:G4}** — the {note:G} above middle {note:C}. That is why it is also called the G clef.',
          'From that one anchor you can work out everything else by stepping up and down: line, space, line, space.',
        ],
      },
      {
        title: 'The lines',
        body: [
          'Reading upwards, the notes sitting **on the lines** of the treble staff are {note:E4}, {note:G4}, {note:B4}, {note:D5} and {note:F5}.',
          'Plenty of people learn a mnemonic for these. Use one if it helps — but the goal is to stop translating. Eventually you want to see a note and feel a key, with no name in between.',
        ],
      },
      {
        title: 'The spaces',
        body: [
          'The four **spaces**, again from the bottom, are {note:F4}, {note:A4}, {note:C5} and {note:E5}. In English they conveniently spell the word FACE.',
          'Lines and spaces alternate, so the full ladder from the bottom line upwards runs {note:E4} {note:F4} {note:G4} {note:A4} {note:B4} {note:C5} {note:D5} {note:E5} {note:F5} — nine steps, no gaps.',
        ],
      },
      { title: 'Read and play', body: ['Play the note shown. Take your time on the first few; speed arrives on its own.'], prompt: 'Play the note on the staff' },
    ],
  },

  't-landmarks': {
    title: 'Landmark notes',
    summary: 'Three notes you know instantly, and everything else measured from them.',
    steps: [
      {
        title: 'Anchors, not counting',
        body: [
          'Counting up from the bottom line every time is slow and it never gets faster. Fluent readers do something different: they memorise a handful of **landmark** notes and measure everything else against the nearest one.',
          'For the treble staff the three worth knowing cold are **middle {note:C4}** on its ledger line below the staff, **{note:G4}** where the clef curls, and **{note:E5}** in the top space.',
          'Once those are automatic, a note one step above {note:G4} is {note:A4} without any counting — you recognise it the way you recognise a familiar face rather than by checking features one at a time.',
        ],
      },
      { title: 'Drill the landmarks', body: ['These are the three landmarks, mixed up. Aim for instant recognition rather than accuracy — you can afford mistakes here.'], prompt: 'Play the note on the staff' },
      {
        question: 'Why learn landmark notes instead of counting up from the bottom line?',
        options: [
          'Counting is inaccurate',
          'Recognising a note is far faster than working it out',
          'Landmarks are the only notes worth knowing',
          'It avoids having to learn the clef',
        ],
        explain: 'Counting works but tops out at a speed far below reading tempo. Recognition scales; counting does not.',
      },
    ],
  },

  't-ledger': {
    title: 'Ledger lines',
    summary: 'What happens when a note falls off the end of the staff.',
    steps: [
      {
        title: 'Extending the staff',
        body: [
          'Middle {note:C} is too low for the treble staff, so it gets its own tiny extra line — a **ledger line** — drawn just for that note.',
          'Ledger lines simply continue the pattern of lines and spaces beyond the staff. One ledger line below the treble staff is {note:C4}; the space just above it is {note:D4}; the bottom line of the staff is {note:E4}.',
          'They work the same way above. Keep alternating line, space, line, space and you can read as far up as you need.',
        ],
      },
      { title: 'Below the staff', body: ['Each of these sits at or near middle {note:C}.'], prompt: 'Play the note on the staff' },
      {
        title: 'Above the staff',
        body: [
          'Above the treble staff the ladder continues {note:G5} in the space above the top line, then {note:A5} on the first ledger line, {note:B5} in the space, {note:C6} on the second ledger line.',
          'Beyond about three ledger lines, editors normally write **8va** instead and print the notes an octave lower — much easier on the eye.',
        ],
      },
      { title: 'High notes', body: ['These sit above the staff on ledger lines.'], prompt: 'Play the note on the staff' },
    ],
  },

  't-intervals-reading': {
    title: 'Reading by shape',
    summary: 'Read the distance between notes, not each note from scratch.',
    steps: [
      {
        title: 'Steps, skips and leaps',
        body: [
          'Look at these five notes. Rather than naming each one, notice the **shape**: line to space is a step, line to the next line is a skip, and anything wider is a leap.',
          'This is how experienced readers actually work. They identify the first note properly and then follow the contour, because the hand already knows what a step and a skip feel like.',
          'It is also why stepwise melodies feel so much easier to sight-read than jumpy ones, regardless of which notes they use.',
        ],
      },
      { title: 'Feel the shape', body: ['Play the five notes. Notice how a skip on the page is a skipped white key under the hand.'], prompt: 'Play the notes' },
      {
        title: 'How to sight-read a new piece',
        body: [
          'Before playing a single note: check the key signature, check the time signature, find the lowest and highest note so you know where your hands go, and scan for repeated patterns.',
          'Then play it **far slower than feels dignified**, and do not stop for mistakes. Stopping to fix things teaches you to stop; playing through teaches you to keep your place.',
        ],
      },
      { title: 'Read these', body: ['A new set, wider apart. Look for the interval from the previous note rather than starting from scratch each time.'], prompt: 'Play the note on the staff' },
      {
        question: 'What is the most useful thing to do before sight-reading a new piece?',
        options: [
          'Play it as fast as you can to get a feel for it',
          'Memorise the first bar',
          'Check the key and time signature and scan for patterns',
          'Work out every note name and write it in',
        ],
        explain: 'Thirty seconds of looking saves minutes of floundering. Writing in note names feels productive but stops you ever learning to read.',
      },
    ],
  },

  // == Unit 5: the bass staff and the grand staff ===========================

  'b-clef': {
    title: 'The bass clef',
    summary: 'The left hand gets its own staff, anchored on {note:F}.',
    steps: [
      {
        title: 'The F clef',
        body: [
          'The left hand usually plays below middle {note:C}, which on a treble staff would need a forest of ledger lines. So it gets its own staff with a **bass clef**.',
          'The bass clef’s two dots sit either side of the second line from the top, and that line is **{note:F3}** — the {note:F} below middle {note:C}. Hence its other name, the F clef.',
          'Everything you learned about lines, spaces and ledger lines applies unchanged. Only the anchor has moved.',
        ],
      },
      {
        title: 'Lines and spaces',
        body: [
          'The lines of the bass staff from the bottom are {note:G2}, {note:B2}, {note:D3}, {note:F3} and {note:A3}. The spaces are {note:A2}, {note:C3}, {note:E3} and {note:G3}.',
          'A useful landmark: the bottom line is {note:G2} and the top line is {note:A3}, so the bass staff spans almost exactly two octaves below middle {note:C}.',
        ],
      },
      { title: 'Read the bass staff', body: ['Play each note with your left hand.'], prompt: 'Play the note on the staff' },
    ],
  },

  'b-landmarks': {
    title: 'Bass landmarks',
    summary: 'The same trick as the treble staff, one staff lower.',
    steps: [
      {
        title: 'Four to know cold',
        body: [
          'Middle {note:C4} sits one ledger line **above** the bass staff — the mirror image of where it sits below the treble staff.',
          '{note:F3} is where the clef’s dots are. {note:C3} is the second space up. {note:F2} is the bottom space. Between them you can place anything on the staff in one step.',
          'Left-hand reading feels harder mainly because people practise it less. Give it the same time you gave the treble staff and it catches up quickly.',
        ],
      },
      { title: 'Drill the landmarks', body: ['Left hand, mixed order.'], prompt: 'Play the note on the staff' },
      {
        question: 'Where does middle {note:C} sit relative to the bass staff?',
        options: ['On the top line', 'In the top space', 'Two ledger lines above', 'One ledger line above'],
        explain: 'One ledger line above the bass staff, which is the same key as one ledger line below the treble staff.',
      },
    ],
  },

  'b-grand-staff': {
    title: 'The grand staff',
    summary: 'Two staves, one keyboard, middle {note:C} in the gap between them.',
    steps: [
      {
        title: 'Joined at the middle',
        body: [
          'Piano music uses both staves at once, braced together into a **grand staff**. Treble on top for the right hand, bass below for the left.',
          'The clever part is the gap: middle {note:C} sits on a ledger line exactly halfway between the two staves. It can be written hanging below the treble staff or perched above the bass staff — same key either way.',
          'The two staves are really one continuous ladder of lines and spaces with middle {note:C} as the rung in the middle.',
        ],
      },
      { title: 'Read both staves', body: ['Notes above the gap are right hand, below it are left hand.'], prompt: 'Play the note on the staff' },
      {
        question: 'A note is written on a ledger line just above the bass staff. Which note is it?',
        options: ['{note:B3}', 'Middle {note:C4}', '{note:A3}', '{note:D4}'],
        explain: 'One ledger line above the bass staff is middle {note:C} — the same key as one ledger line below the treble staff.',
      },
    ],
  },

  'b-both-hands-reading': {
    title: 'Reading two staves at once',
    summary: 'Your eyes learn to take in a vertical slice, not a line.',
    steps: [
      {
        title: 'Read vertically, then horizontally',
        body: [
          'The instinct is to read the top line like a sentence and then go back for the bottom. That falls apart the moment the hands do different things.',
          'Instead, read a **vertical slice**: what sounds together, then what comes next. Your eye takes in both staves at once and moves left to right as a unit.',
          'Practising this deliberately helps. Play the hands separately until each is comfortable, then put them together at half speed and look only at the point where the two lines meet.',
        ],
      },
      { title: 'One slice', body: ['Left hand {note:C3}, right hand {note:E4}, sounding together.'], prompt: 'Play both notes together' },
      { title: 'And the next', body: ['The left hand stays; the right hand steps up. Only one thing changes, which is how most piano writing actually works.'], prompt: 'Play both notes together' },
      { title: 'Try a whole piece', body: ['*Frère Jacques* keeps the left hand almost still while the right hand moves. Read it as slices.'] },
    ],
  },

  // == Unit 6: sharps and flats =============================================

  'a-half-steps': {
    title: 'Half steps and whole steps',
    summary: 'The smallest distance on a piano, and the one built from two of them.',
    steps: [
      {
        title: 'The smallest gap',
        body: [
          'A **half step** is the distance from any key to the very next key, black or white, with nothing in between.',
          'Most of them involve a black key: {note:C} to the black key above it is a half step. But two pairs of white keys are half steps with no black key between them at all — {note:E} to {note:F}, and {note:B} to {note:C}. Look at the keyboard and you can see the black key is simply missing there.',
          'A **whole step** is two half steps. {note:C} to {note:D} is a whole step, because there is one key in between.',
        ],
      },
      { title: 'Three keys in a row', body: ['Play {note:C}, then the black key above it, then {note:D}. Two half steps, adding up to one whole step.'], prompt: 'Play three keys in a row' },
      { title: 'The white-key half steps', body: ['Now play {note:E} to {note:F}, then {note:B} to {note:C}. Neighbouring white keys, and still only a half step apart.'], prompt: 'Play the four notes' },
      {
        question: 'How many half steps are there between {note:E} and {note:F}?',
        options: ['None — they are the same', 'One', 'Two', 'Three'],
        explain: 'They are neighbouring white keys with no black key between them, so exactly one half step. The same is true of {note:B} and {note:C}.',
      },
    ],
  },

  'a-sharps-flats': {
    title: 'Sharps, flats and naturals',
    summary: 'Three symbols that move a note by one key.',
    steps: [
      {
        title: 'Up one, down one, cancel',
        body: [
          'A **sharp** (♯) raises a note by a half step — one key to the right, black or white. A **flat** (♭) lowers it by a half step. A **natural** (♮) cancels either and restores the plain white key.',
          'An accidental applies for the rest of the bar it appears in, and then expires at the barline. That catches everybody out at least once.',
          'The symbol is written **before** the note on the staff, but spoken **after** the letter: you write ♯ then the note, and you say "{note:C}-sharp".',
        ],
      },
      { title: 'Black keys under the hand', body: ['Play these five black keys in turn. Play them with the flat part of your fingertip, a little further into the keyboard than for white keys.'], prompt: 'Play the black keys' },
      { title: 'Read accidentals', body: ['Each of these has a sharp in front of it.'], prompt: 'Play the note on the staff' },
      {
        question: 'A bar contains a sharpened {note:F}, and later in the same bar another {note:F} with no symbol at all. What do you play?',
        options: ['The white key, since the symbol is gone', 'It depends on the key signature', 'The sharp again — accidentals last to the end of the bar', 'The note an octave higher'],
        explain: 'An accidental holds for the remainder of its bar. Composers often add a courtesy natural in the next bar just to be clear.',
      },
    ],
  },

  'a-enharmonics': {
    title: 'Two names, one key',
    summary: 'Why the same black key is sometimes a sharp and sometimes a flat.',
    steps: [
      {
        title: 'Enharmonic spelling',
        body: [
          'The black key between {note:C} and {note:D} can be called {note:C}-sharp (raise {note:C}) or {note:D}-flat (lower {note:D}). Same key, same sound, two names. Notes related this way are called **enharmonic**.',
          'Which name is correct depends on where the music is going. In a key built from sharps you write sharps; in a key built from flats you write flats. Mixing them makes a page much harder to read.',
          'Spelling matters on the page even where it makes no difference to the ear, because reading is pattern recognition — and a scale spelled with one letter per line and space is a pattern, while one that skips and repeats letters is a puzzle.',
        ],
      },
      { title: 'The same key twice', body: ['Here is that black key played twice. There is nothing to hear — the difference is entirely one of notation.'] },
      {
        question: 'Which key sounds the same as {note:D}-flat?',
        options: ['{note:C}-sharp', '{note:D}-sharp', '{note:C}', '{note:E}-flat'],
        explain: '{note:D}-flat is one key below {note:D}; {note:C}-sharp is one key above {note:C}. They are the same black key.',
      },
    ],
  },

  // == Unit 7: scales and keys ==============================================

  's-major-formula': {
    title: 'The major scale',
    summary: 'One formula of whole and half steps, playable from any note.',
    steps: [
      {
        title: 'Whole whole half, whole whole whole half',
        body: [
          'A major scale is seven notes built by a fixed recipe of steps: **whole, whole, half, whole, whole, whole, half**, ending back on the note you started from an octave higher.',
          'Start on {note:C} and follow that recipe and you land on nothing but white keys — which is why {note:C} major is where everyone begins.',
          'Start anywhere else and the same recipe forces you onto black keys. That is not a complication; it is the entire reason sharps and flats exist. The formula is the thing that stays the same, and the black keys are what it costs to keep it that way.',
        ],
      },
      { title: 'Play the recipe', body: ['Eight notes up from {note:C4}. Listen for the two half steps — between the third and fourth notes, and between the seventh and eighth.'], prompt: 'Play the {note:C} major scale' },
      {
        question: 'Applying the major formula starting on {note:G}, which note has to be raised?',
        options: ['{note:C}, to {note:C}-sharp', '{note:F}, to {note:F}-sharp', '{note:B}, to {note:B}-flat', 'None — it is all white keys'],
        explain: 'The last step must be a half step into {note:G}, so {note:F} becomes {note:F}-sharp. That is why {note:G} major has one sharp.',
      },
    ],
  },

  's-c-major-fingering': {
    title: 'Scale fingering and the thumb-under',
    summary: 'Five fingers, eight notes, one essential move.',
    steps: [
      {
        title: 'The problem, and the answer',
        body: [
          'A scale has eight notes and you have five fingers, so at some point the hand has to move without breaking the line. The solution is the **thumb-under**: the thumb travels beneath the palm and lands on the next note while the other fingers are still playing.',
          'Right hand going up: 1 2 3 on {note:C} {note:D} {note:E}, then the thumb tucks under to take {note:F}, and 2 3 4 5 finish the octave.',
          'The arm should stay quiet. If your elbow swings out to help the thumb, the hand is fighting itself — let the thumb do the travelling on its own.',
        ],
      },
      { title: 'Right hand, up', body: ['Watch for the thumb on the fourth note. Aim for no bump in volume where the hand changes position — that bump is what gives beginners away.'], prompt: 'Play the scale up' },
      { title: 'Right hand, down', body: ['Coming down, finger 3 crosses **over** the thumb. Same move in reverse.'], prompt: 'Play the scale down' },
      { title: 'Left hand, up', body: ['The left hand mirrors it: 5 4 3 2 1 and then finger 3 crosses over for the last three notes.'], prompt: 'Play the scale with the left hand' },
      { title: 'With the click', body: ['Now play it in time. Slow. The whole value of scale practice is in the evenness, and evenness only exists at a tempo you can control.'], prompt: 'Play one note per click' },
    ],
  },

  's-g-and-f': {
    title: '{note:G} major and {note:F} major',
    summary: 'Your first black key inside a scale, in both directions.',
    steps: [
      {
        title: 'One sharp',
        body: [
          '{note:G} major needs {note:F}-sharp to keep the formula intact. Because the sharp is on the seventh note, the fingering is exactly the same as {note:C} major: 1 2 3, thumb under, 2 3 4 5.',
          'The key signature at the start of the staff carries that sharp so it does not have to be written on every {note:F}.',
        ],
      },
      { title: 'Play {note:G} major', body: ['The seventh note is the black key. Everything else is white.'], prompt: 'Play the {note:G} major scale' },
      {
        title: 'One flat',
        body: [
          '{note:F} major goes the other way and needs {note:B}-flat. This time the black key falls on the fourth note, which changes the fingering: the right hand plays 1 2 3 4, then tucks the thumb under for the fifth note.',
          'This is the general rule for fingering a scale — arrange it so the thumb never has to land on a black key.',
        ],
      },
      { title: 'Play {note:F} major', body: ['1 2 3 4, thumb under, 2 3 4. The fourth note is {note:B}-flat.'], prompt: 'Play the {note:F} major scale' },
      {
        question: 'Why does {note:F} major use a different right-hand fingering from {note:C} major?',
        options: [
          'Because it has more notes',
          'So the thumb never lands on a black key',
          'Because flats are played differently from sharps',
          'It does not — the fingering is the same',
        ],
        explain: 'The thumb is short and sits low, so putting it on a raised key forces the wrist up and breaks the line. Fingerings are arranged around avoiding that.',
      },
    ],
  },

  's-key-signatures': {
    title: 'Key signatures',
    summary: 'Writing the sharps once at the start instead of on every note.',
    steps: [
      {
        title: 'A shortcut that became a label',
        body: [
          'If a piece in {note:G} major needs every {note:F} to be sharp, writing a sharp on each one is tedious. Instead a single sharp is placed on the {note:F} line at the start of every staff — the **key signature** — and from then on every {note:F} is sharp unless a natural cancels it.',
          'Sharps always accumulate in the same order: {note:F} {note:C} {note:G} {note:D} {note:A} {note:E} {note:B}. One sharp is {note:G} major, two is {note:D} major, three is {note:A} major, and so on.',
          'A trick for reading them: the **last sharp** is always the seventh degree of the scale, so the key is a half step above it. Three sharps end on {note:G}-sharp; a half step up is {note:A} major.',
        ],
      },
      {
        title: 'Flats go the other way',
        body: [
          'Flats arrive in exactly the reverse order: {note:B} {note:E} {note:A} {note:D} {note:G} {note:C} {note:F}. One flat is {note:F} major, two is {note:B}-flat major, three is {note:E}-flat major.',
          'The trick for flats is even easier: from two flats onwards, the **second to last flat** names the key. Three flats are {note:B}-flat, {note:E}-flat, {note:A}-flat — and the second to last is {note:E}-flat, which is the key.',
        ],
      },
      {
        question: 'A piece has two sharps in its key signature. Which are they?',
        options: [
          '{note:F}-sharp and {note:C}-sharp',
          '{note:B}-flat and {note:E}-flat',
          '{note:C}-sharp and {note:G}-sharp',
          '{note:F}-sharp and {note:B}-flat',
        ],
        explain: 'Sharps always appear in the order {note:F} {note:C} {note:G} {note:D} {note:A} {note:E} {note:B}, so two sharps means {note:F}-sharp and {note:C}-sharp — the key of {note:D} major.',
      },
      {
        question: 'How do you find the major key from a sharp key signature?',
        options: [
          'Count the sharps and go up that many notes from {note:C}',
          'Take the last sharp and go up a half step',
          'Take the first sharp and go down a whole step',
          'Look at the first note of the piece',
        ],
        explain: 'The last sharp is the seventh degree, so a half step above it is the tonic.',
      },
    ],
  },

  's-circle-of-fifths': {
    title: 'The circle of fifths',
    summary: 'Why the keys are in that order, and why it matters.',
    steps: [
      {
        title: 'Each key a fifth from the last',
        body: [
          'Start on {note:C}, count up five scale steps and you reach {note:G} — the key with one sharp. Do it again and you reach {note:D}, with two. Again for {note:A} with three. Keep going and after twelve steps you arrive back at {note:C}.',
          'Arranged in a circle, that gives you the **circle of fifths**: clockwise adds a sharp, anticlockwise adds a flat, and every key sits next to the two it is most closely related to.',
          'Neighbouring keys share all but one note. That is why music moves between them so easily, why the {note:V} chord is a fifth above the {note:I} chord, and why the whole thing keeps turning up.',
        ],
      },
      { title: 'Walk the circle', body: ['{note:C}, {note:G}, {note:D}, {note:A}, {note:E} — five keys, each a fifth above the last, each one sharp further round.'], prompt: 'Play the five roots' },
      {
        question: 'Two keys sit next to each other on the circle of fifths. How many notes do their scales share?',
        options: ['All seven', 'Three', 'Six of seven', 'None'],
        explain: 'Neighbours differ by exactly one accidental, so six of the seven notes are shared. That closeness is what makes moving between them sound smooth.',
      },
    ],
  },

  's-minor': {
    title: 'Minor scales',
    summary: 'The same seven keys, a different home, a different mood.',
    steps: [
      {
        title: 'Relative minor',
        body: [
          'Play all the white keys from {note:A} to {note:A} instead of {note:C} to {note:C} and you get **{note:A} natural minor**. Same keys, different starting point, completely different character.',
          'Every major key has a **relative minor** built on its sixth degree, sharing its key signature. {note:C} major and {note:A} minor share no sharps or flats; {note:G} major and {note:E} minor share one sharp.',
          'The formula is **whole, half, whole, whole, half, whole, whole**. Compared with major, the third, sixth and seventh degrees are each a half step lower — and the flattened third is what your ear hears as "sad".',
        ],
      },
      { title: 'Play {note:A} natural minor', body: ['All white keys, {note:A} up to {note:A}.'], prompt: 'Play {note:A} natural minor' },
      { title: 'Major and minor side by side', body: ['Two chords: major, then minor. Only the middle note moves, by a single half step, and the whole mood changes.'] },
      {
        title: 'Harmonic minor',
        body: [
          'Natural minor has a weak ending. Its seventh degree is a whole step below the tonic, so it does not pull home the way a major scale does.',
          'Composers fix this by raising the seventh a half step, giving the **harmonic minor** scale. In {note:A} minor that means {note:G}-sharp. The gap it creates between the sixth and seventh degrees is a step and a half, and that oddly wide interval is the sound of everything from Bach cadences to Middle Eastern folk music.',
          'There is a third form, **melodic minor**, which raises the sixth as well going up and reverts to natural minor coming down — a compromise to smooth out that wide gap in melodies.',
        ],
      },
      { title: 'Play {note:A} harmonic minor', body: ['Same as before, but the seventh note is now {note:G}-sharp. Listen to how much harder it pulls to the top note.'], prompt: 'Play {note:A} harmonic minor' },
      {
        question: 'Which key is the relative minor of {note:C} major?',
        options: ['{note:C} minor', '{note:G} minor', '{note:A} minor', '{note:E} minor'],
        explain: 'The relative minor is built on the sixth degree. Six notes up from {note:C} is {note:A}, and {note:A} minor uses exactly the same key signature.',
      },
    ],
  },

  // == Unit 8: chords and harmony ===========================================

  'c-intervals': {
    title: 'Intervals by name',
    summary: 'The distance between two notes, and why it has a quality as well as a number.',
    steps: [
      {
        title: 'Number and quality',
        body: [
          'An **interval** is the distance between two notes. It has a number — count the letter names inclusively, so {note:C} to {note:E} is a third — and a quality, which says exactly how wide that third is.',
          'A **major third** is four half steps ({note:C} to {note:E}). A **minor third** is three ({note:C} to {note:E}-flat). Same number, different quality, completely different sound.',
          'Fourths, fifths and octaves get called **perfect** instead of major or minor, for historical reasons that do not matter much in practice. A perfect fifth is seven half steps and is the most stable interval there is after the octave.',
        ],
      },
      { title: 'Major and minor third', body: ['Two intervals from the same bottom note. One note moves by a single half step.'] },
      { title: 'A perfect fifth', body: ['{note:C} and {note:G} together — seven half steps apart. Open, stable, slightly hollow.'], prompt: 'Play the two notes together' },
      { title: 'A perfect fourth', body: ['{note:C} and {note:F} — five half steps. The fifth turned upside down.'], prompt: 'Play the two notes together' },
      {
        question: 'How many half steps are there in a minor third?',
        options: ['Two', 'Three', 'Four', 'Five'],
        explain: 'Three. The major third is four; lowering the top note by a half step makes it minor.',
      },
    ],
  },

  'c-triads': {
    title: 'Triads: major and minor',
    summary: 'Three notes, skipping one key each time.',
    steps: [
      {
        title: 'Stacked thirds',
        body: [
          'A **triad** is three notes taken from a scale by skipping alternate notes: play one, skip one, play the next, skip one, play the next. From {note:C} that gives {note:C} {note:E} {note:G}.',
          'The distance from the bottom note to the middle one decides the flavour. A major third makes it **major** — bright, settled. A minor third makes it **minor** — darker, softer. The outer interval is a perfect fifth either way.',
          'Everything else in harmony is a variation on this one shape, so it is worth being able to build one from any note without thinking.',
        ],
      },
      { title: '{note:C} major', body: ['{note:C}, {note:E} and {note:G} together. Fingers 1, 3 and 5, with the hand relaxed — you are dropping the arm onto the keys, not squeezing them.'], prompt: 'Play a {note:C} major chord' },
      { title: '{note:C} minor', body: ['Move the middle note down one half step: {note:C}, {note:E}-flat, {note:G}.'], prompt: 'Play a {note:C} minor chord' },
      {
        question: 'What makes a triad minor rather than major?',
        options: ['The top note is lower', 'The middle note is a half step lower', 'It has four notes', 'It starts on a black key'],
        explain: 'Only the third moves. Lowering it from four half steps to three turns major into minor; the fifth is unchanged.',
      },
    ],
  },

  'c-dim-aug': {
    title: 'Diminished and augmented',
    summary: 'What happens when the fifth moves too.',
    steps: [
      {
        title: 'Squeezing and stretching',
        body: [
          'There are only four ways to stack two thirds. Major and minor are two of them. The others come from moving the fifth.',
          'A **diminished** triad is two minor thirds stacked — {note:C} {note:E}-flat {note:G}-flat. The fifth is squeezed by a half step and the chord sounds tense and unresolved.',
          'An **augmented** triad is two major thirds — {note:C} {note:E} {note:G}-sharp. The fifth is stretched, and the result sounds suspended and slightly unreal, which is why film composers reach for it constantly.',
        ],
      },
      { title: 'Diminished', body: ['{note:C}, {note:E}-flat, {note:G}-flat. Two minor thirds.'], prompt: 'Play a diminished chord' },
      { title: 'Augmented', body: ['{note:C}, {note:E}, {note:G}-sharp. Two major thirds.'], prompt: 'Play an augmented chord' },
      { title: 'All four in a row', body: ['Major, minor, diminished, augmented — on the same root. Listen for the character of each.'] },
      {
        question: 'Which triad is built from two major thirds stacked on top of each other?',
        options: ['Major', 'Minor', 'Diminished', 'Augmented'],
        explain: 'Major is a major third then a minor third; augmented is major then major, which stretches the fifth.',
      },
    ],
  },

  'c-inversions': {
    title: 'Inversions',
    summary: 'Same chord, different note on the bottom, much less hand movement.',
    steps: [
      {
        title: 'Rotating the notes',
        body: [
          'Take the bottom note of {note:C} {note:E} {note:G} and move it up an octave: {note:E} {note:G} {note:C}. Still a {note:C} major chord — just in **first inversion**. Do it again for {note:G} {note:C} {note:E}, **second inversion**.',
          'Inversions exist to keep your hand still. Going from {note:C} major to {note:F} major in root position means jumping the whole hand. Using {note:F} in second inversion lets you move two fingers and leave the thumb where it is.',
          'They also smooth out the bass line, which is why almost no real music sits in root position for long.',
        ],
      },
      { title: 'Root position', body: ['{note:C} {note:E} {note:G}.'], prompt: 'Play {note:C} major in root position' },
      { title: 'First inversion', body: ['{note:E} {note:G} {note:C} — the root has moved to the top.'], prompt: 'Play {note:C} major in first inversion' },
      { title: 'Second inversion', body: ['{note:G} {note:C} {note:E}.'], prompt: 'Play {note:C} major in second inversion' },
      { title: 'Smooth voice leading', body: ['Now {note:F} major in second inversion — {note:C} {note:F} {note:A}. Coming from {note:C} major in root position, the thumb never moves and the other two fingers step up one key each.'], prompt: 'Play {note:F} major in second inversion' },
      {
        question: 'What is the main practical reason for using inversions?',
        options: [
          'They sound louder',
          'They are easier to read',
          'They keep the hand from jumping between chords',
          'They change the chord’s name',
        ],
        explain: 'The chord is the same either way. Inversions exist so your hand can move as little as possible and the bass line stays smooth.',
      },
    ],
  },

  'c-primary': {
    title: 'The three chords that play everything',
    summary: '{note:I}, {note:IV} and {note:V} — enough for a startling number of songs.',
    steps: [
      {
        title: 'Numbering the chords',
        body: [
          'Build a triad on each degree of a major scale and you get seven chords. Musicians label them with Roman numerals — uppercase for major, lowercase for minor. In {note:C} major that is I ii iii IV V vi vii°.',
          'Three of them do most of the work. **I** is home. **V** creates tension that wants to resolve back to I. **IV** sits in between, moving away from home without the pull of V.',
          'The move from V to I is a **cadence**, and it is the strongest ending in Western music. Almost everything you know finishes with one.',
        ],
      },
      { title: 'I — the home chord', body: ['{note:C} {note:E} {note:G}.'], prompt: 'Play the {note:I} chord' },
      { title: 'IV', body: ['{note:F} {note:A} {note:C}. Play it in second inversion so your hand barely moves from the last chord.'], prompt: 'Play the {note:IV} chord' },
      { title: 'V', body: ['{note:G} {note:B} {note:D}. Listen to how badly it wants to go back to I.'], prompt: 'Play the {note:V} chord' },
      { title: 'The whole progression', body: ['I, IV, V, I. Four chords, and the ending sounds inevitable.'] },
      {
        question: 'In the key of {note:G} major, what is the {note:V} chord?',
        options: ['{note:C} major', '{note:D} major', '{note:E} minor', '{note:G} major'],
        explain: 'Counting up the {note:G} major scale, the fifth degree is {note:D}, so V is {note:D} major.',
      },
    ],
  },

  'c-sevenths': {
    title: 'Seventh chords',
    summary: 'One more third on top, and the harmony grows up.',
    steps: [
      {
        title: 'Stacking one more',
        body: [
          'Keep the pattern going and add another third above the triad and you get a **seventh chord** — four notes instead of three.',
          'The most important one is the **dominant seventh**, built on the fifth degree: a major triad with a minor seventh on top. In {note:C} major that is {note:G} {note:B} {note:D} {note:F}. It contains a tritone, which is unstable, which is exactly why it pulls home so strongly.',
          'A **major seventh** ({note:C} {note:E} {note:G} {note:B}) sounds soft and floating. A **minor seventh** ({note:D} {note:F} {note:A} {note:C}) sounds mellow and unhurried. Between them these three cover most of jazz and a good deal of pop.',
        ],
      },
      { title: 'The dominant seventh', body: ['{note:G} {note:B} {note:D} {note:F}. Fingers 1 2 3 5.'], prompt: 'Play the dominant seventh' },
      { title: 'Major seventh', body: ['{note:C} {note:E} {note:G} {note:B} — the seventh is only a half step below the octave, which is what gives it that shimmer.'], prompt: 'Play the major seventh' },
      { title: 'Minor seventh', body: ['{note:D} {note:F} {note:A} {note:C}.'], prompt: 'Play the minor seventh' },
      {
        question: 'Which seventh chord creates the strongest pull back to the tonic?',
        options: ['The dominant seventh', 'The major seventh', 'The minor seventh', 'They are equally strong'],
        explain: 'The dominant seventh contains a tritone between its third and seventh, and that interval resolves inwards onto the tonic chord almost by itself.',
      },
    ],
  },

  // == Unit 9: hands together ===============================================

  'h-blocked': {
    title: 'Left-hand chords under a melody',
    summary: 'The simplest accompaniment there is.',
    steps: [
      {
        title: 'One chord per bar',
        body: [
          'The easiest way to accompany yourself is to hold a chord in the left hand for a whole bar while the right hand plays the tune.',
          'Left-hand fingering for a root-position triad mirrors the right: **5, 3, 1** from the bottom up, because the little finger takes the lowest note.',
          'Play the chords an octave or two below middle {note:C} so they support the melody rather than crowd it. Below about {note:C2} triads turn to mud — that is why bass parts use single notes and open fifths down there.',
        ],
      },
      { title: 'Left hand I', body: ['{note:C3} {note:E3} {note:G3} with fingers 5, 3, 1.'], prompt: 'Play {note:C} major in the left hand' },
      { title: 'Left hand V', body: ['{note:G2} {note:B2} {note:D3}.'], prompt: 'Play {note:G} major in the left hand' },
      { title: 'Left hand IV', body: ['{note:F2} {note:A2} {note:C3}.'], prompt: 'Play {note:F} major in the left hand' },
      { title: 'Both hands', body: ['Play *Mary Had a Little Lamb* with both hands. Start slowly enough that you never have to stop — stopping is the thing you are trying not to learn.'] },
    ],
  },

  'h-broken': {
    title: 'Broken chords and Alberti bass',
    summary: 'Turning a held chord into movement.',
    steps: [
      {
        title: 'Spreading the chord out',
        body: [
          'Holding a block chord for four beats gets dull quickly. Break the chord into single notes instead and the accompaniment starts to move.',
          'The classic pattern is the **Alberti bass**: lowest, highest, middle, highest. On a {note:C} major chord that is {note:C}, {note:G}, {note:E}, {note:G}, repeated under the melody. Mozart used it constantly.',
          'Keep it quiet. An accompaniment should be felt rather than heard — if you can pick out the left hand as a tune of its own, it is too loud.',
        ],
      },
      { title: 'Alberti bass on I', body: ['{note:C} {note:G} {note:E} {note:G}, left hand, fingers 5 1 3 1.'], prompt: 'Play the Alberti pattern' },
      { title: 'Alberti bass on V', body: ['{note:G} {note:D} {note:B} {note:D}. The same shape moved down a fourth.'], prompt: 'Play the Alberti pattern' },
      { title: 'Hear it in context', body: ['Bach’s Prelude in {note:C} is one long broken chord. Play it slowly and listen to the harmony change underneath the pattern.'] },
    ],
  },

  'h-independence': {
    title: 'Hand independence',
    summary: 'Getting the two hands to stop copying each other.',
    steps: [
      {
        title: 'Why it is hard',
        body: [
          'Your hands want to do the same thing at the same time. That is a feature of the nervous system, not a lack of talent, and it goes away with the right kind of practice.',
          'The trick is to make one hand automatic before adding the other. Practise the left-hand part until you can hold a conversation while playing it — then bring the right hand in.',
          'When you first put hands together, go absurdly slowly and watch the **points of coincidence**: the moments where the two hands land on the same beat. Getting those right is most of the battle.',
        ],
      },
      { title: 'Alternating', body: ['Left, right, left, right — the hands take turns rather than moving together. This is the gentlest introduction there is.'], prompt: 'Play the notes in order' },
      { title: 'Together', body: ['Now both at once. One sound, two hands.'], prompt: 'Play both notes together' },
      { title: 'In time', body: ['Play alternating hands on each click of the metronome. Left on odd clicks, right on even.'], prompt: 'Play one note per click' },
    ],
  },

  'h-whole-piece': {
    title: 'Learning a piece properly',
    summary: 'A method that works better than playing it from the top over and over.',
    steps: [
      {
        title: 'Small pieces, slowly, hands apart',
        body: [
          'Playing a piece from the beginning until you break down, then starting again, means you practise the opening a hundred times and the ending twice. Everybody does it. It is a bad method.',
          'Instead: pick **one or two bars**. Play them hands apart until each is easy. Put them together slowly. Then join them to the bars either side. Only when the joins work do you play the whole thing.',
          'Your practice time should be spent mostly on the parts you cannot play. That feels much less enjoyable, which is precisely why it works.',
        ],
      },
      {
        title: 'Slow means slow',
        body: [
          'Slow practice is not the same piece played sluggishly. It is a different task: at half speed you have time to notice your hand shape, your fingering and your sound, and to fix them before they set.',
          'Use a tempo ladder. Play a passage cleanly three times in a row, then raise the metronome by four beats a minute. One mistake and you go back down a rung. It is slower than it sounds and faster than anything else.',
        ],
      },
      { title: 'Try it on Ode to Joy', body: ['Take the first four bars only, hands apart, then together. Do not go on until they are comfortable.'] },
      { title: 'And on Silent Night', body: ['This one is in 3/4 with a dotted rhythm, so count out loud. Right hand alone first.'] },
    ],
  },

  // == Unit 10: technique ===================================================

  'tech-evenness': {
    title: 'Evenness and tone',
    summary: 'The unglamorous skill that makes everything else sound good.',
    steps: [
      {
        title: 'Five fingers, five different strengths',
        body: [
          'Your fingers are not equal. The thumb is a thick lever with its own muscle; the fourth finger shares a tendon with the third and can barely lift on its own. Left alone, a five-finger run comes out lumpy.',
          'Evening that out is what five-finger exercises are for. Play slowly enough to **hear each note individually** and listen for the one that sticks out — it is usually the thumb (too loud) or the fourth finger (too quiet and late).',
          'Play from the knuckle with a loose wrist. Pressing harder does not fix an uneven finger; it just makes the unevenness louder.',
        ],
      },
      { title: 'Up and back', body: ['Nine notes, slowly. Aim for nine identical sounds. You will not get them at first, and noticing that is the point.'], prompt: 'Play the notes evenly' },
      { title: 'With the click', body: ['Now against a metronome at 60, one note per click. Listen, do not just play.'], prompt: 'Play one note per click' },
      { title: 'The full study', body: ['A short five-finger study for both hands. Play it at a tempo where every note is under control, then slow down a bit more.'] },
    ],
  },

  'tech-scales-two-octaves': {
    title: 'Scales over two octaves',
    summary: 'Two thumb-unders instead of one, and a hand that keeps travelling.',
    steps: [
      {
        title: 'The pattern repeats',
        body: [
          'A two-octave scale is the one-octave fingering done twice, joined at the top: 1 2 3 1 2 3 4, then 1 2 3 1 2 3 4, then 5 to finish.',
          'The difference is that the hand now has to keep moving along the keyboard rather than returning to one spot. Let the arm carry the hand sideways — the fingers should not be reaching for anything.',
          'Practise hands separately for much longer than you think you need to. Two-octave scales hands together are a genuinely different skill and they will not improve until each hand is secure alone.',
        ],
      },
      { title: 'Two octaves up', body: ['Fifteen notes, right hand, slowly. Watch both thumb-unders.'], prompt: 'Play two octaves' },
      {
        title: 'What to listen for',
        body: [
          'Three faults account for almost every uneven scale: a bump in volume where the thumb lands, a gap in the sound where the hand shifts, and the tempo creeping up as it goes.',
          'A good diagnostic is to play the scale with your eyes closed. Without the visual cue you hear the joins immediately.',
        ],
      },
      { title: 'In time', body: ['Set the metronome to a tempo where nothing bumps. Whatever that tempo is, it is the right one.'], prompt: 'Play one note per click' },
    ],
  },

  'tech-arpeggios': {
    title: 'Arpeggios',
    summary: 'The same thumb-under move, over a much bigger stretch.',
    steps: [
      {
        title: 'Chords, spread out',
        body: [
          'An **arpeggio** is a chord played one note at a time. {note:C} {note:E} {note:G} {note:C} {note:E} {note:G} {note:C} — the notes of a {note:C} major triad, spanning two octaves.',
          'The fingering is 1 2 3 1 2 3 5 going up. The thumb-under is the same move as in a scale, but now it has to travel a fourth instead of a second, so the arm has to help it more.',
          'The most common fault is a lurch: the elbow swings out to throw the thumb across. Instead, let the whole arm glide steadily along the keyboard and the thumb will arrive on time without drama.',
        ],
      },
      { title: 'Up', body: ['Two octaves of {note:C} major arpeggio. Slowly.'], prompt: 'Play the arpeggio up' },
      { title: 'Down', body: ['Coming down, finger 3 crosses over the thumb — same as a scale.'], prompt: 'Play the arpeggio down' },
      { title: 'The full study', body: ['Arpeggios on I, IV and V with a supporting bass. This is the shape underneath a huge amount of piano writing.'] },
    ],
  },

  'tech-chords-octaves': {
    title: 'Octaves, chords and the wrist',
    summary: 'Bigger shapes, and where the movement should come from.',
    steps: [
      {
        title: 'The arm plays, the fingers hold',
        body: [
          'For a single note the finger does the work. For an octave or a full chord it cannot — the shape is fixed and the sound has to come from somewhere else.',
          'That somewhere is the **wrist and forearm**. Set the hand shape first, keep it fixed, and drop the weight of the arm through it. The wrist stays flexible and absorbs the landing; it does not push.',
          'If you find yourself gripping between chords, you are working far harder than the music requires. Release the hand completely in the gap, even if the gap is very short.',
        ],
      },
      { title: 'An octave', body: ['{note:C4} and {note:C5} together, fingers 1 and 5. Drop the arm rather than stretching and squeezing.'], prompt: 'Play the octave' },
      { title: 'Move it', body: ['The same shape one step up. Move the whole arm; do not re-stretch the hand.'], prompt: 'Play the octave' },
      {
        title: 'Small hands',
        body: [
          'Not everyone can reach an octave comfortably, and forcing it is how people injure themselves. If it hurts, do not do it.',
          'Almost all octave writing can be rolled — play the bottom note a fraction early and let the pedal join them. Plenty of professional pianists with small hands do exactly this, all the time.',
        ],
      },
      {
        question: 'Where should the power for a loud chord come from?',
        options: ['Pressing harder with the fingers', 'Gripping with the hand', 'The weight of the arm through a fixed hand shape', 'Lifting the hand high and striking'],
        explain: 'Fingers set the shape; the arm supplies the weight. Striking from a height is loud but uncontrolled, and gripping just creates tension.',
      },
    ],
  },

  'tech-practising': {
    title: 'How to practise',
    summary: 'The difference between an hour spent and an hour that counts.',
    steps: [
      {
        title: 'Attention, not time',
        body: [
          'Twenty minutes of focused work beats two hours of playing through things you can already play. The measure of a practice session is what you could not do at the start and can do at the end.',
          'Start every session by deciding what you are working on. "Bars 9 to 12, left hand, evenly, at 60" is a practice aim. "Practise the piece" is not.',
          'Stop when your attention goes. Practising while distracted teaches your hands to be distracted.',
        ],
      },
      {
        title: 'Slow, chunk, repeat, sleep',
        body: [
          'Four things account for almost all progress. **Slow enough to be correct**, because repetition makes permanent whatever you repeat — including mistakes. **Small chunks**, because you cannot fix four bars at once. **Repetition with attention**, roughly five correct times in a row before moving on.',
          'And **sleep**. Motor learning consolidates overnight; a passage you leave in a mess often plays itself the next morning. Daily short practice beats one long weekly session by a wide margin.',
        ],
      },
      {
        title: 'When you get stuck',
        body: [
          'If a passage will not improve, stop repeating it and change something. Play it with a different rhythm — dotted, then reverse-dotted. Play it hands apart. Play it starting from the last note and working backwards. Play it away from the piano, on a table, just for the fingering.',
          'And check the fingering. A passage that refuses to work is very often a fingering problem wearing a disguise.',
        ],
      },
      {
        question: 'You have twenty minutes. What is the best use of it?',
        options: [
          'Play your favourite pieces through once each',
          'Work slowly on the two hardest bars of one piece',
          'Play scales for the whole twenty minutes',
          'Sight-read something new the whole time',
        ],
        explain: 'Playing what you already know is enjoyable but changes nothing. Targeted work on what you cannot do is where the improvement is.',
      },
    ],
  },

  // == Unit 11: playing musically ===========================================

  'e-dynamics': {
    title: 'Dynamics',
    summary: 'The difference between playing notes and playing music.',
    steps: [
      {
        title: 'Loud, soft, and everything between',
        body: [
          'Dynamic markings are Italian abbreviations: **pp** very soft, **p** soft, **mp** moderately soft, **mf** moderately loud, **f** loud, **ff** very loud. A hairpin `<` means get gradually louder (*crescendo*), `>` gradually softer (*diminuendo*).',
          'They are relative, not absolute. A *forte* in a lullaby is quieter than a *piano* in a Rachmaninov concerto. What matters is the difference between one marking and the next.',
          'The most common beginner habit is playing everything at one volume. Take any phrase you know and play it twice — once flat, once shaped louder as it rises and softer as it falls. The second version is the one that sounds like music.',
        ],
      },
      { title: 'Three volumes', body: ['The same chord played soft, medium and loud. Nothing changed but the speed of the key.'] },
      {
        title: 'Shaping a line',
        body: [
          'A useful default: melodies grow towards their highest note and relax afterwards. It is not a law, but it is right often enough to be a good starting guess when nothing is marked.',
          'Aim for gradual change. A crescendo that arrives all at once on the last note is not a crescendo, and it is the most common way people get it wrong.',
        ],
      },
      {
        question: 'On a piano, what determines how loud a note is?',
        options: [
          'How hard you press after the key is down',
          'How fast the key goes down',
          'How long you hold the note',
          'How high you lift your hand first',
        ],
        explain: 'Key speed, and nothing else. Once the hammer has left, extra pressure changes nothing at all.',
      },
    ],
  },

  'e-articulation': {
    title: 'Articulation',
    summary: 'How notes are joined or separated — the punctuation of music.',
    steps: [
      {
        title: 'Legato and staccato',
        body: [
          '**Legato** means smooth and connected: each note is held until the next one sounds, with no gap at all. On the piano this is finger work — you release one key at exactly the moment the next goes down, and the sound overlaps for a fraction of an instant.',
          '**Staccato**, marked with a dot above the note, means short and detached. The note is released early, leaving silence before the next one. It is about the gap, not about being loud or harsh.',
          'Between the two sits **tenuto** — a line above the note, meaning hold it its full length and give it a little weight.',
        ],
      },
      { title: 'The same notes, two ways', body: ['Five notes played legato, then the same five staccato. Same pitches, same volume, completely different character.'] },
      { title: 'Try legato', body: ['Play these five notes joined. Listen for gaps — if you hear silence between notes, you are lifting too early.'], prompt: 'Play the notes smoothly' },
      {
        question: 'What does a staccato dot actually change?',
        options: [
          'How long the note lasts',
          'How loud the note is',
          'The pitch of the note',
          'Which finger you use',
        ],
        explain: 'Staccato shortens the note, leaving silence before the next. It says nothing about volume — a staccato note can be as soft or as loud as you like.',
      },
    ],
  },

  'e-pedal': {
    title: 'The sustain pedal',
    summary: 'Connecting notes your fingers cannot hold.',
    steps: [
      {
        title: 'What it actually does',
        body: [
          'The right pedal lifts the dampers off every string at once, so notes keep sounding after you release the keys and the whole instrument resonates sympathetically.',
          'It is not a volume pedal and it is not a way to cover up gaps in your playing. Held down through a chord change, it turns harmony into mush.',
          'In this app, hold the **space bar** to sustain, or use a real pedal if you have a MIDI keyboard connected.',
        ],
      },
      {
        title: 'Legato pedalling',
        body: [
          'The standard technique changes the pedal **just after** you play the new chord, not with it. Play, then lift and re-press the pedal in one quick motion. The new note is already sounding so nothing breaks, but the old harmony is cleared away.',
          'The rule of thumb is: change the pedal whenever the harmony changes. If you can hear two different chords ringing at once, you changed too late.',
          'When in doubt, use less. A clean unpedalled performance sounds far better than a blurred pedalled one.',
        ],
      },
      { title: 'Try it', body: ['Hold the space bar, play this chord, release the keys — and listen to it keep ringing. Then release the space bar and hear it stop.'], prompt: 'Play the chord with the pedal down' },
      {
        question: 'When should you change the pedal?',
        options: [
          'Exactly with each new chord',
          'Just after the new chord sounds',
          'Just before the new chord',
          'Once per bar, regardless of the harmony',
        ],
        explain: 'Changing with the chord leaves a gap; changing just after keeps the line unbroken while still clearing the old harmony.',
      },
    ],
  },

  'e-phrasing': {
    title: 'Phrasing',
    summary: 'Music breathes in sentences. Play the sentences, not the words.',
    steps: [
      {
        title: 'Where the commas go',
        body: [
          'Melodies come in **phrases** — musical sentences, usually two or four bars long, that have a beginning, a shape and an end. Curved lines above the staff mark them.',
          'Playing every note with equal importance is like reading aloud in a monotone with no pauses. Instead: give the phrase a direction, lean slightly on its high point, and let it settle at the end.',
          'A tiny amount of space at the end of a phrase does more for the music than any amount of dynamics. Singers breathe there; pianists should too.',
        ],
      },
      { title: 'Listen to a phrase', body: ['Eight notes that rise and fall. Listen for where it wants to grow and where it wants to relax.'] },
      { title: 'Now shape it yourself', body: ['Play the same eight notes. Grow towards the high point, ease off after it, and take a little time at the end.'], prompt: 'Play the phrase' },
      { title: 'Try it on a piece', body: ['*Greensleeves* is built from clear four-bar phrases with an obvious high point in each. Play it slowly and shape every one.'] },
    ],
  },

  'e-balance': {
    title: 'Balance between the hands',
    summary: 'The melody has to win, and it will not do so by accident.',
    steps: [
      {
        title: 'Melody louder, accompaniment quieter',
        body: [
          'In almost all piano music one line is the melody and the rest is support. The melody should be noticeably louder — often much more than feels right from the bench.',
          'This is harder than it sounds because both hands want to press with the same force. Independent control of volume between the hands is a skill in its own right, and it takes deliberate practice.',
          'A useful test: record yourself and listen back. Almost everybody is surprised by how loud their left hand is.',
        ],
      },
      { title: 'Hear the difference', body: ['The same chord and melody note, first with everything equal, then with the accompaniment much softer.'] },
      {
        title: 'How to practise it',
        body: [
          'Exaggerate. Play the accompaniment as quietly as the instrument will let you while keeping the melody at a normal volume. It will feel absurd. Then dial it back until it sounds natural, and you will land somewhere close to right.',
          'It also helps to play the melody alone and then add the other hand while holding on to the sound the melody had by itself.',
        ],
      },
      { title: 'Try it on a piece', body: ['The Minuet in {note:G} has a clear melody over a light left hand. Aim for the left hand to be present but never in the way.'] },
    ],
  },

  // == Unit 12: beyond the page =============================================

  'x-chord-symbols': {
    title: 'Chord symbols and lead sheets',
    summary: 'How most non-classical music is actually written down.',
    steps: [
      {
        title: 'A melody and some letters',
        body: [
          'Outside classical music, most scores are **lead sheets**: a single melody line with chord symbols above it. What you play underneath is up to you.',
          'The symbol names the root and the quality. A bare letter means a major triad. Add **m** for minor, **7** for a dominant seventh, **maj7** for a major seventh, **m7** for a minor seventh, **dim** or **aug** for the altered fifths.',
          'A slash means a specific bass note: {note:C}/{note:E} is a {note:C} major chord with {note:E} at the bottom — in other words, first inversion.',
        ],
      },
      { title: 'F', body: ['A bare letter: a plain major triad on {note:F}.'], prompt: 'Play the chord' },
      { title: 'Dm', body: ['The m means minor: {note:D} {note:F} {note:A}.'], prompt: 'Play the chord' },
      { title: 'G7', body: ['A dominant seventh: {note:G} {note:B} {note:D} {note:F}.'], prompt: 'Play the chord' },
      {
        question: 'What does the chord symbol {note:C}/{note:G} mean?',
        options: [
          'Play {note:C} and {note:G} only',
          'Alternate between {note:C} and {note:G} chords',
          'A {note:C} major chord with {note:G} in the bass',
          'A {note:C} chord in the right hand and {note:G} in the left',
        ],
        explain: 'The letter after the slash is the bass note. {note:C}/{note:G} is {note:C} major in second inversion.',
      },
    ],
  },

  'x-accompaniment': {
    title: 'Accompaniment patterns',
    summary: 'Four ways to turn the same chord into four different styles.',
    steps: [
      {
        title: 'Same harmony, different clothes',
        body: [
          'Once you can read chord symbols, the question becomes what to actually play. The chord tells you the notes; the **pattern** tells you the style.',
          'A block chord on every beat sounds like a hymn. Broken into an Alberti pattern it sounds classical. Root-fifth-root in the bass with chords on the offbeats sounds like country or folk. A low root followed by a chord higher up is the stride pattern behind most old jazz and ragtime.',
          'Learning three or four patterns and being able to apply any of them to any chord is worth more than learning three or four pieces.',
        ],
      },
      { title: 'Alberti', body: ['Low, high, middle, high — the classical pattern.'], prompt: 'Play the pattern' },
      { title: 'Root and octave', body: ['Root, octave above, fifth, octave — a simple driving pattern that works in almost any style.'], prompt: 'Play the pattern' },
      { title: 'Wide stride', body: ['A low bass note, then the chord an octave and a half higher. Keep the leap relaxed and look at where you are jumping to.'], prompt: 'Play the pattern' },
      { title: 'Try it on a piece', body: ['*Auld Lang Syne* has simple harmony and lots of room. Play the melody and try a different left-hand pattern on each verse.'] },
    ],
  },

  'x-blues': {
    title: 'The twelve-bar blues',
    summary: 'Three chords, twelve bars, and about a century of music.',
    steps: [
      {
        title: 'The form',
        body: [
          'The blues is a twelve-bar pattern using only I, IV and V. In {note:C}: four bars of I, two of IV, two of I, one of V, one of IV, and two more of I to finish.',
          'Every chord is usually played as a **dominant seventh**, including the tonic — which is theoretically wrong and is exactly what makes it sound like the blues.',
          'Once you know the form you can play with anyone who also knows it, in any key, without a score. That is most of what makes it worth learning.',
        ],
      },
      { title: 'I7', body: ['{note:C} {note:E} {note:G} {note:B}-flat.'], prompt: 'Play the {note:I} seventh' },
      { title: 'IV7', body: ['{note:F} {note:A} {note:C} {note:E}-flat.'], prompt: 'Play the {note:IV} seventh' },
      { title: 'V7', body: ['{note:G} {note:B} {note:D} {note:F}.'], prompt: 'Play the {note:V} seventh' },
      { title: 'The whole twelve bars', body: ['A full blues chorus with a walking bass. Play it in listen mode first to hear the shape, then join in.'] },
    ],
  },

  'x-improvising': {
    title: 'Your first improvisation',
    summary: 'Five notes that cannot sound wrong, over a form you already know.',
    steps: [
      {
        title: 'The blues scale',
        body: [
          'The **minor pentatonic** scale on {note:C} is {note:C} {note:E}-flat {note:F} {note:G} {note:B}-flat. Add {note:G}-flat as a passing note and you have the **blues scale**.',
          'Over a blues in {note:C}, every one of those notes works against all three chords. There is nothing to avoid, which means you can stop worrying about wrong notes and start listening to what you are actually playing.',
          'Improvising is not about playing a lot of notes. It is about playing a short idea, then answering it — the same call-and-response shape as a conversation.',
        ],
      },
      { title: 'The scale', body: ['Six notes up. Learn the shape under your hand until you do not have to look.'], prompt: 'Play the blues scale' },
      {
        title: 'How to start',
        body: [
          'Give yourself rules that make it easier, not harder. Use **three notes only**. Play a short phrase, leave a gap as long as the phrase, then play something that answers it.',
          'Rhythm matters more than pitch. A dull rhythm on interesting notes sounds worse than an interesting rhythm on three notes.',
          'Leave space. Beginners fill every beat; the space is what makes the phrases sound like phrases.',
        ],
      },
      { title: 'Play over the blues', body: ['Start the twelve-bar blues in listen mode and improvise over it with the right hand using only those notes. Nothing you play will be wrong.'] },
    ],
  },

  'x-by-ear': {
    title: 'Playing by ear',
    summary: 'Working out music without a score.',
    steps: [
      {
        title: 'Find the key first',
        body: [
          'Playing by ear is not magic — it is a search narrowed by knowledge. Start by finding the **home note**: hum the tune, then hunt for the note that feels like it ends on. That is your tonic.',
          'Then decide major or minor by trying the third above it. One of the two will sound right immediately.',
          'Now you have a scale, and the melody almost certainly uses only those seven notes. The search has gone from eighty-eight keys to seven.',
        ],
      },
      { title: 'Match a short phrase', body: ['Four notes: up, up, back to the start. Play it, hum it, then find it again somewhere else on the keyboard.'], prompt: 'Play the phrase' },
      { title: 'The same shape, moved', body: ['The identical shape starting on {note:F}. Once you hear intervals rather than note names, moving a phrase is trivial — this is what transposing is.'], prompt: 'Play the phrase' },
      {
        title: 'Then find the chords',
        body: [
          'For the harmony, try I first — it is right more often than anything else. If it clashes, try V, then IV. Those three cover most simple songs, and the moment two of them sound wrong the third is usually right.',
          'Train the skill directly in the ear-training drill. Intervals and chord qualities are exactly what you are trying to recognise.',
        ],
      },
      {
        question: 'What is the most useful first step when working out a tune by ear?',
        options: [
          'Find the fastest passage',
          'Work out the last chord',
          'Find the home note and decide major or minor',
          'Write out the rhythm',
        ],
        explain: 'Establishing the key narrows eighty-eight keys down to seven notes, and everything after that is much faster.',
      },
    ],
  },

  'x-routine': {
    title: 'Where to go next',
    summary: 'A routine you can keep, and what to learn after this.',
    steps: [
      {
        title: 'A routine that survives contact with real life',
        body: [
          'Twenty to thirty minutes a day beats three hours on a Sunday. The frequency matters more than the length, because motor skills consolidate between sessions rather than during them.',
          'A workable shape: five minutes of technique (a scale and an arpeggio in one key), ten minutes on the hardest part of the piece you are learning, five minutes of sight-reading something easy and new, and the rest playing for pleasure.',
          'That last part is not optional. The people who keep playing for decades are the ones who enjoy the playing, not the ones with the best discipline.',
        ],
      },
      {
        title: 'Keep the drills going',
        body: [
          'The four practice drills in this app are worth a few minutes each, most days. Sight reading and ear training in particular compound — a year of five minutes a day will take you further than any amount of cramming.',
          'Sight-read music that is **easier than your playing level**. The point is fluency, not difficulty. If you are stopping to work things out, it is too hard.',
        ],
      },
      {
        title: 'What to learn next',
        body: [
          'Learn all twelve major scales, then the minors. It sounds like drudgery and it is the single thing that unlocks the most repertoire, because pieces stop being sequences of notes and start being patterns you already know.',
          'Beyond that: Bach’s little preludes and the *Anna Magdalena* notebook, Schumann’s *Album for the Young*, Burgmüller’s Op. 100, and Chopin’s easier preludes. For non-classical, learn a handful of accompaniment patterns and play from lead sheets.',
          'And find other people to play with. Nothing improves your timing like having to keep up with someone else.',
        ],
      },
      {
        title: 'One last thing',
        body: [
          'Progress at the piano is not linear. You will spend weeks feeling stuck and then, without warning, something that was impossible becomes easy. That is how the learning works — the consolidation happens quietly while you are not looking.',
          'When you are frustrated, go back and play something you learned three months ago. It is the clearest evidence you have that this is working.',
        ],
      },
    ],
  },
};
