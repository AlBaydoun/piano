/**
 * Loads every route in a real browser and fails on any console error or
 * unhandled exception. Run against a static server on port 8099:
 *
 *   python3 -m http.server 8099 &
 *   node scripts/smoke.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL ?? 'http://localhost:8099/index.html';

const ROUTES = [
  '/home', '/lessons', '/songs', '/practice', '/reference', '/freeplay', '/progress',
  '/lesson/kb-groups', '/lesson/read-staff', '/lesson/read-grand', '/lesson/rhythm-values',
  '/lesson/scale-major', '/lesson/chord-triads', '/lesson/expr-pedal',
  '/song/twinkle', '/song/ode-to-joy', '/song/fur-elise', '/song/prelude-in-c', '/song/moonlight',
  '/practice/notes', '/practice/ear', '/practice/chords', '/practice/keys',
  '/nope-not-a-route',
];

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 780 },
  { name: 'desktop', width: 1440, height: 900 },
];

const problems = [];

const browser = await chromium.launch({ args: ['--no-sandbox'] });

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  page.on('pageerror', (error) => problems.push(`[${viewport.name}] uncaught: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`[${viewport.name}] console: ${message.text()}`);
  });

  await page.goto(`${BASE}#/home`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.piano__key', { timeout: 10_000 });

  for (const route of ROUTES) {
    await page.evaluate((path) => { window.location.hash = `#${path}`; }, route);
    await page.waitForTimeout(260);

    const state = await page.evaluate(() => {
      const view = document.querySelector('#view');
      return {
        rendered: view.innerHTML.length,
        docWidth: document.documentElement.scrollWidth,
        windowWidth: window.innerWidth,
        viewScroll: view.scrollWidth,
        viewClient: view.clientWidth,
        keys: document.querySelectorAll('.piano__key').length,
      };
    });

    if (state.rendered < 80) problems.push(`[${viewport.name}] ${route} rendered almost nothing`);
    if (state.keys === 0) problems.push(`[${viewport.name}] ${route} lost the keyboard`);
    if (state.docWidth > state.windowWidth + 1) {
      problems.push(`[${viewport.name}] ${route} overflows horizontally (${state.docWidth} > ${state.windowWidth})`);
    }
    if (state.viewScroll > state.viewClient + 1) {
      problems.push(`[${viewport.name}] ${route} content is wider than the viewport`);
    }
  }

  await context.close();
}

await browser.close();

const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`Smoke test failed with ${unique.length} problem(s):`);
  for (const problem of unique) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Smoke test passed: ${ROUTES.length} routes × ${VIEWPORTS.length} viewports, no errors.`);
