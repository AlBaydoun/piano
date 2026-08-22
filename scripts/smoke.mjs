/**
 * Loads every route in every language, in a real browser, and fails on any
 * console error, untranslated key, or horizontal overflow. Run against a
 * static server on port 8099:
 *
 *   python3 -m http.server 8099 &
 *   node scripts/smoke.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://localhost:8099/index.html';

const ROUTES = [
  '/home', '/lessons', '/songs', '/practice', '/reference', '/freeplay', '/progress',
  '/lesson/f-instrument', '/lesson/f-white-keys', '/lesson/r-note-values', '/lesson/t-staff',
  '/lesson/b-grand-staff', '/lesson/s-minor', '/lesson/c-inversions', '/lesson/tech-arpeggios',
  '/lesson/e-pedal', '/lesson/x-blues', '/lesson/x-routine',
  '/song/twinkle', '/song/ode-to-joy', '/song/fur-elise', '/song/prelude-in-c', '/song/moonlight',
  '/song/hanon-1', '/song/twelve-bar-blues',
  '/practice/notes', '/practice/ear', '/practice/chords', '/practice/keys',
  '/nope-not-a-route',
];

const LOCALES = ['en', 'ru', 'de', 'ar'];

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 780 },
  { name: 'desktop', width: 1600, height: 950 },
];

/** A key that never got translated leaks through as a dotted path. */
const RAW_KEY = /\b[a-z][a-zA-Z]+\.[a-z][a-zA-Z.]+\b/g;

const problems = [];
const browser = await chromium.launch({ args: ['--no-sandbox'] });

for (const viewport of VIEWPORTS) {
  for (const locale of LOCALES) {
    // Only the desktop pass walks every language; the phone pass checks the
    // two directions, which is what the layout actually cares about.
    if (viewport.name === 'phone' && !['en', 'ar'].includes(locale)) continue;

    const label = `${viewport.name}/${locale}`;
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    page.on('pageerror', (error) => problems.push(`[${label}] uncaught: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`[${label}] console: ${message.text()}`);
    });

    await page.goto(`${BASE}#/home`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.piano__key', { timeout: 10_000 });
    await page.selectOption('.topbar__language', locale);
    await page.waitForTimeout(600);

    const shell = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
    }));
    if (shell.lang !== locale) problems.push(`[${label}] document language is "${shell.lang}"`);
    const expectedDir = locale === 'ar' ? 'rtl' : 'ltr';
    if (shell.dir !== expectedDir) problems.push(`[${label}] direction is "${shell.dir}", expected ${expectedDir}`);

    for (const route of ROUTES) {
      await page.evaluate((path) => { window.location.hash = `#${path}`; }, route);
      await page.waitForTimeout(240);

      const state = await page.evaluate((pattern) => {
        const view = document.querySelector('#view');
        return {
          rendered: view.innerHTML.length,
          rawKeys: (view.textContent.match(new RegExp(pattern, 'g')) ?? [])
            .filter((s) => !s.includes('.js') && !/\d/.test(s)),
          docWidth: document.documentElement.scrollWidth,
          windowWidth: window.innerWidth,
          viewScroll: view.scrollWidth,
          viewClient: view.clientWidth,
          keys: document.querySelectorAll('.piano__key').length,
        };
      }, RAW_KEY.source);

      if (state.rendered < 80) problems.push(`[${label}] ${route} rendered almost nothing`);
      if (state.keys === 0) problems.push(`[${label}] ${route} lost the keyboard`);
      if (state.docWidth > state.windowWidth + 1) {
        problems.push(`[${label}] ${route} overflows horizontally (${state.docWidth} > ${state.windowWidth})`);
      }
      if (state.viewScroll > state.viewClient + 1) {
        problems.push(`[${label}] ${route} content is wider than the viewport`);
      }
      for (const key of state.rawKeys.slice(0, 2)) {
        problems.push(`[${label}] ${route} shows an untranslated key: "${key}"`);
      }
    }

    await context.close();
  }
}

await browser.close();

const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`Smoke test failed with ${unique.length} problem(s):`);
  for (const problem of unique.slice(0, 40)) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Smoke test passed: ${ROUTES.length} routes across ${LOCALES.length} languages and ${VIEWPORTS.length} viewports.`);
