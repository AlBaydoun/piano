# Open Piano

A free piano learning platform that runs entirely in the browser. No account, no
server, no cost, and no build step — clone it, open `index.html` through any
static server, and it works.

<!-- Try it: enable GitHub Pages for this repository and the workflow in
     .github/workflows/pages.yml publishes it automatically. -->

## What's in it

**A course, from scratch.** Twenty-four lessons across eight units: finding your
way around the keys, your first melodies, reading the treble and bass staves,
rhythm and counting, scales and key signatures, chords and inversions, playing
hands together, and dynamics and pedalling. Every concept has something you
actually play, and the lesson only moves on once you have played it.

**A song library with falling notes.** Eighteen public-domain pieces from
*Twinkle, Twinkle* to the opening of Bach's Prelude in C. Notes fall towards the
keyboard and land on the key you need. Three modes:

- **Wait for me** — the music pauses at each note until you find it, so you can
  learn a piece at whatever speed you actually play it
- **Play along** — runs at tempo and scores what you hit
- **Listen** — the app plays it so you can hear where you are going

You can slow any piece to 30% of its tempo, start from any bar, loop a section,
and hand the left-hand part to the app while you work on the right.

**Four practice drills**, each with running accuracy and a best streak:

- **Sight reading** — a note appears, you play it. Treble, bass or grand staff,
  in any key, with or without accidentals
- **Ear training** — intervals, chord qualities, scale degrees, and melodies you
  have to play back
- **Chord building** — you get a chord symbol, you play the chord. Triads
  through ninths, with inversions
- **Key signatures** — name the key from the signature, or the other way round

**A reference section** for looking things up: any scale with its conventional
fingering, any chord in any inversion, every key with its diatonic chords, and a
clickable circle of fifths. Everything lights up on the keyboard and can be
heard.

**Free play** with live chord detection, a scale highlighter for improvising,
and a recorder.

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
npm test           # the unit tests: theory, song data, course data, router, storage
```

The browser smoke test loads every route at two viewport sizes and fails on any
console error or horizontal overflow:

```sh
npm install --no-save playwright && npx playwright install chromium
python3 -m http.server 8099 &
node scripts/smoke.mjs
```

## How it is put together

```
index.html            the shell
styles/main.css       one stylesheet, dark and light
src/
  main.js             entry point
  app.js              application shell: nav, transport, the docked keyboard, routing
  router.js           hash routing
  theory.js           notes, scales, chords, intervals, keys, staff placement
  audio.js            the synthesised piano and the metronome
  input.js            Web MIDI and computer-keyboard input
  keyboard.js         the on-screen piano
  staff.js            SVG music notation
  storage.js          progress and settings in localStorage
  ui.js               small DOM helpers
  views/              one module per screen
  data/               the course and the song library
tests/                node --test suites
scripts/smoke.mjs     browser smoke test
```

A few decisions worth knowing about:

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
to fail to load.

**The keyboard is one instance, shared by every screen.** It lives in the dock at
the bottom of the window and views borrow it to highlight notes, show fingering,
or catch what you play. That is also what lets the falling-note canvas line up
with the keys: it measures the keyboard's bounding box and matches it.

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
`src/data/songs.js` — the tests will check that its bars add up and that every
note is on the keyboard.

## Accessibility

Keyboard-navigable throughout, with a skip link, focus rings, live regions for
drill feedback, and `aria-label`s on the piano keys and notation. The colour
palette holds up in both themes, and `prefers-reduced-motion` is respected.

## Licence

MIT — see [LICENSE](LICENSE).
