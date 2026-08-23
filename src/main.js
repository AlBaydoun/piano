/** Entry point: load the language bundle, mount the app, report failures loudly. */

import { app } from './app.js';

function fail(message, detail) {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'boot boot--error';
  const heading = document.createElement('h1');
  heading.textContent = 'Open Piano';
  const text = document.createElement('p');
  text.className = 'boot__text';
  text.textContent = message;
  box.append(heading, text);
  if (detail) {
    const pre = document.createElement('pre');
    pre.className = 'error';
    pre.textContent = detail;
    box.append(pre);
  }
  root.append(box);
}

try {
  await app.boot(document.getElementById('app'));
  window.piano = app; // handy in the console, and harmless
} catch (error) {
  console.error(error);
  fail('Something went wrong while starting up. Reloading usually fixes it.', String(error?.stack ?? error));
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection', event.reason);
});
