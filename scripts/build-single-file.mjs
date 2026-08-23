/**
 * Bundle the whole app into one self-contained HTML file.
 *
 * The app normally runs as unbundled ES modules straight off a static
 * server, which is how it is developed and how GitHub Pages serves it.
 * This script exists for the cases where a single file is the deliverable —
 * emailing someone a copy, dropping it on a USB stick, or publishing it
 * somewhere that only takes one page.
 *
 *   npm install --no-save esbuild
 *   node scripts/build-single-file.mjs [outfile]
 *
 * Everything ends up inline: no network requests at all after load.
 */

import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = process.argv[2] ?? resolve(root, 'dist/open-piano.html');

const result = await build({
  entryPoints: [resolve(root, 'src/main.js')],
  bundle: true,
  // The entry point awaits the language bundle at the top level, and a
  // module script is what the app is served as anyway.
  format: 'esm',
  target: ['es2022'],
  minify: true,
  // Escape every non-ASCII character rather than emitting it literally. The
  // page carries four languages' worth of Arabic and Cyrillic, and a host
  // that wraps this file supplies its own <head> — so the file cannot count
  // on a charset declaration reaching the parser in time. Pure ASCII decodes
  // the same way whatever encoding the browser guesses.
  charset: 'ascii',
  legalComments: 'none',
  write: false,
});

const script = result.outputFiles[0].text;
const css = asciiCss(await readFile(resolve(root, 'styles/main.css'), 'utf8'));

/**
 * Make the stylesheet pure ASCII without asking whoever writes it to be.
 * Comments are for maintainers and mean nothing to a browser, so they go; what
 * is left is escaped the way CSS spells characters it cannot type. Six hex
 * digits every time, so no trailing space is needed to end the escape.
 */
function asciiCss(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\x00-\x7f]/gu, (char) => `\\${char.codePointAt(0).toString(16).padStart(6, '0')}`);
}

// The published page carries no <html>/<head>/<body> of its own: the host
// supplies them. Everything below is what goes inside the body.
const page = `<meta charset="utf-8">
<title>Open Piano</title>
<meta name="description" content="A free piano learning platform in English, Russian, German and Arabic. Fifty-six lessons, a song library with falling notes, and drills for sight reading and ear training.">

<style>
${css}
</style>

<div id="app">
  <div class="boot">
    <div class="boot__logo" aria-hidden="true">&#9834;</div>
    <p class="boot__text">Loading Open Piano&#8230;</p>
  </div>
</div>

<noscript>
  <div class="boot">
    <p class="boot__text">
      Open Piano synthesises its own sound and draws its own keyboard, so it needs JavaScript.
      Please enable it and reload.
    </p>
  </div>
</noscript>

<script type="module">
${script}
</script>
`;

// The stylesheet is handled above and esbuild escapes the script, but a regex
// literal is one place a bundler leaves characters alone, so check the result.
const nonAscii = page.match(/[^\x00-\x7f]/gu);
if (nonAscii) {
  throw new Error(`${nonAscii.length} non-ASCII character(s) survived bundling: ${[...new Set(nonAscii)].join(' ')}`);
}

await writeFile(outFile, page, 'utf8');

const kb = (Buffer.byteLength(page, 'utf8') / 1024).toFixed(0);
console.log(`Wrote ${outFile} (${kb} KB, everything inline, pure ASCII)`);
