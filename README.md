# Open Piano

[![Play Open Piano in your browser](docs/play-button.svg)](https://albaydoun.github.io/piano/)

**<https://albaydoun.github.io/piano/>**

A free piano learning platform that runs entirely in the browser, in **English,
Russian, German and Arabic**. No account, no server, no cost, and no build step
— clone it, open `index.html` through any static server, and it works.

The live site is published from `main` by `.github/workflows/pages.yml`, which
needs no build step because the repository is the artifact.

## What's in it

**A course that starts at zero and does not stop at the basics.** Fifty-six
lessons across twelve units:

| | |
| --- | --- |
| 1. Before you play | What the instrument is, posture, hand shape, finding your way around the keys |
| 2. First contact | Finger numbers, the five-finger position, your first two melodies |
| 3. Rhythm and counting | Pulse, note values, rests, time signatures, dots and ties |
| 4. Reading the treble staff | The staff, landmark notes, ledger lines, reading by interval |
| 5. Bass and grand staff | The F clef, its landmarks, and reading two staves at once |
| 6. Sharps and flats | Half steps, accidentals, enharmonic spelling |
| 7. Scales and keys | The major formula, fingering and the thumb-under, key signatures, the circle of fifths, minor |
| 8. Chords and harmony | Intervals, triads, diminished and augmented, inversions, I–IV–V, sevenths |
| 9. Hands together | Blocked chords, Alberti bass, hand independence, how to learn a piece |
| 10. Technique | Evenness, two-octave scales, arpeggios, octaves, how to practise |
| 11. Playing musically | Dynamics, articulation, the pedal, phrasing, balance |
| 12. Beyond the page | Chord symbols, accompaniment patterns, the twelve-bar blues, improvising, playing by ear |

Every concept has something you actually play. Steps are prose, notes to play,
notation to read, examples to listen to, timed metronome exercises, or quizzes —
and a lesson only advances once you have played or answered it.

**Twenty-seven pieces and studies with falling notes.** Public-domain repertoire
from *Twinkle, Twinkle* to the opening of Bach's Prelude in C, plus technical
studies for five-finger work, scales, arpeggios, Hanon, a I–V–vi–IV progression
and a twelve-bar blues. Three modes:

- **Wait for me** — the music pauses at each note until you find it, so you can
  learn a piece at whatever speed you actually play it
- **Play along** — runs at tempo and scores what you hit
- **Listen** — the app plays it so you can hear where you are going

You can slow any piece to 30% of its tempo, start from any bar, loop a section,
and hand the left-hand part to the app while you work on the right.

**Five practice drills**, each with running accuracy and a best streak:

- **Sight reading** — a note appears, you play it. Treble, bass or grand staff,
  in any key, with or without accidentals
- **Ear training** — intervals, chord qualities, scale degrees, and melodies you
  have to play back
- **Chord building** — you get a chord symbol, you play the chord. Triads
  through ninths, with inversions
- **Key signatures** — name the key from the signature, or the other way round
- **Rhythm** — a rhythm is written on a one-line staff, a bar of clicks counts
  you in, and you tap it. Quarter notes through sixteenths, dotted notes,
  syncopation, triplets and 6/8. Every note is marked on time, early, late or
  missed, and you are told whether you are consistently ahead of the click or
  behind it. Anything counts as a tap: a piano key, a computer key, the pad on
  screen, or a MIDI keyboard

**A reference section** for looking things up: any scale with its conventional
fingering, any chord in any inversion, every key with its diatonic chords, and a
clickable circle of fifths. Everything lights up on the keyboard and can be
heard.

**Free play** with live chord detection, a scale highlighter for improvising,
and a recorder.

## Languages

Pick a language from the header; the choice is remembered. Everything is
translated — interface, all fifty-six lessons, every song description.

| | | |
| --- | --- | --- |
| English | `en` | left to right |
| Русский | `ru` | left to right |
| Deutsch | `de` | left to right |
| العربية | `ar` | **right to left** |

Two things a music app has to get right beyond simple string swapping:

**Note names differ by country.** English speakers say B, Germans say H (and
write B for what English calls B♭), and much of the world uses Do–Re–Mi — in
Cyrillic for Russian, in Arabic script for Arabic. Course text therefore never
hard-codes a note name. It writes `{note:C}` and the renderer spells it in
whatever system the reader is using. Each language has a sensible default and
you can override it in Settings, so a German speaker can read in Do–Re–Mi or an
English speaker in German naming if they prefer.

**Arabic reads right to left, but a keyboard does not.** The page mirrors: the
navigation, the cards, the controls, the reading order. The instrument does not
— low notes stay on the left, notation still reads left to right, and the
falling notes still land on the right keys.

## Playing it

Three input methods, all live at once:

| Input | How |
| --- | --- |
| Mouse or touch | Click or tap the keys; drag across them for a glissando |
| Computer keyboard | `Z`–`M` and `Q`–`P` are two octaves of piano. `←` `→` shift by an octave, `Space` is the sustain pedal |
| MIDI keyboard | Press **Connect MIDI keyboard** in the dock. Velocity and the sustain pedal both come through |

Web MIDI needs Chrome, Edge or Opera. Everything else works in any modern
browser.

## Running it locally

There is no build step and there are no runtime dependencies. Any static server
will do:

```sh
npm start          # python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly from the filesystem will *not* work — the app is
built from ES modules, which browsers refuse to load over `file://`.

```sh
npm test           # theory, song data, course data, translations, router, storage
```

The browser smoke test loads every route in every language at two viewport
sizes and fails on any console error, untranslated key, or horizontal overflow:

```sh
npm install --no-save playwright && npx playwright install chromium
python3 -m http.server 8099 &
node scripts/smoke.mjs
```

## One file, if you need one

The app is normally served as unbundled modules, which is how it is developed
and how GitHub Pages serves it. For the cases where a single file is the
deliverable — emailing a copy, a USB stick, a host that takes one page — there
is a bundler that inlines the script, the stylesheet and every language into
one HTML file with no network requests at all:

```sh
npm install --no-save esbuild
npm run bundle                  # writes dist/open-piano.html
```

The result carries no `<html>`/`<head>`/`<body>` of its own, so it can either be
opened as-is or dropped inside a host page's skeleton.

## How it is put together

```
index.html            the shell
styles/main.css       one stylesheet, dark and light, LTR and RTL
src/
  main.js             entry point
  app.js              application shell: nav, transport, the docked keyboard, language, routing
  i18n.js             locale loading, plurals, note-name systems, direction
  router.js           hash routing
  theory.js           notes, scales, chords, intervals, keys, staff placement
  audio.js            the synthesised piano and the metronome
  input.js            Web MIDI and computer-keyboard input
  keyboard.js         the on-screen piano
  staff.js            SVG music notation
  rhythm-staff.js     SVG rhythm notation: one line, proportional, beamed
  storage.js          progress and settings in localStorage
  ui.js               small DOM helpers
  views/              one module per screen
  data/               the course and the song library — structure only, no prose
  locales/<lang>/     ui.js, lessons.js, songs.js — every word the reader sees
tests/                node --test suites
scripts/smoke.mjs     browser smoke test
```

A few decisions worth knowing about:

**Course structure and course text live apart.** `data/lessons.js` holds what a
lesson *does* — the notes to play, the fingering, which quiz option is correct.
`locales/<lang>/lessons.js` holds what it *says*, keyed by lesson id and step
index. A translation therefore cannot drift out of step with the exercise it
describes, and a test asserts that every language has text for every step.

**The piano is synthesised, not sampled.** Each note is a stack of six detuned
harmonics whose upper partials decay faster than the fundamental — which is what
makes a struck string sound struck — plus a short filtered noise burst for the
hammer, through a small convolution reverb. That keeps the whole app to a few
hundred kilobytes with no audio files to download, and means it works offline.

**Pitch is a MIDI number, everywhere.** Names, frequencies, scales, chords and
staff positions are all derived from it, so there is exactly one representation
to reason about. Staff placement goes through `spellNote()`, which returns a
*diatonic* step index — that is what puts A♯4 and B♭4 on different lines despite
being the same key.

**The clefs are vector paths, not a font.** No webfont to download and nothing
to fail to load. So are the rests and the noteheads in the rhythm drill: a
missing glyph in a rhythm exercise is not a cosmetic problem.

**Rhythm is counted in clicks, not in quarter notes.** A click is what the
player hears and taps against, so that is the unit the rhythm drill measures
everything in — which is why an eighth note is worth one click in 6/8 and half
a click in 4/4. Taps are timestamped from the audio clock, the same clock the
clicks were scheduled on, rather than from `Date.now()`.

**The keyboard is one instance, shared by every screen.** It lives in the dock at
the bottom of the window and views borrow it to highlight notes, show fingering,
or catch what you play. That is also what lets the falling-note canvas line up
with the keys: it measures the keyboard's bounding box and matches it with a
transform, which is measured in physical pixels and so survives a right-to-left
page.

**Progress never leaves your device.** It is written to `localStorage` and
nothing is uploaded. There is an export button on the Progress page if you want
a backup or want to move to another machine.

## The music

Everything in the song library is in the public domain. Music is written in a
compact text notation so it stays readable and reviewable in a diff:

```js
'C4 C4 G4 G4 | A4 A4 G4:2'     // one beat each unless a duration is given
'C3+E3+G3:4'                    // a chord, held for four beats
'r:2'                           // a two-beat rest
'G#3:1/3'                       // a triplet
```

`parseVoice()` turns that into timed note events; `compile()` merges the voices
of a song and sorts them. Adding a song means adding one object to
`src/data/songs.js` and a title, composer and description to each locale — the
tests will check that its bars add up, that every note is on the keyboard, and
that no language is missing its text.

## Accessibility

Keyboard-navigable throughout, with a skip link, focus rings, live regions for
drill feedback, and `aria-label`s on the piano keys and notation — all
translated. The colour palette holds up in both themes, and
`prefers-reduced-motion` is respected.

## Licence

MIT — see [LICENSE](LICENSE).
