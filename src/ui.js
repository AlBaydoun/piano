/**
 * Tiny DOM helpers. Not a framework — just enough to stop every view from
 * being a wall of `document.createElement`.
 */

/**
 * Build an element.
 * @param {string} tag  tag name, optionally with `.class` and `#id` suffixes
 * @param {object|null} [props]
 * @param {...any} children  strings, nodes, arrays, or null
 */
export function h(tag, props = null, ...children) {
  const [name, ...rest] = tag.split(/(?=[.#])/);
  const node = document.createElement(name || 'div');

  for (const token of rest) {
    if (token.startsWith('.')) node.classList.add(token.slice(1));
    else if (token.startsWith('#')) node.id = token.slice(1);
  }

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class' || key === 'className') node.classList.add(...String(value).split(/\s+/).filter(Boolean));
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
      else if (key === 'html') node.innerHTML = value;
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key in node && key !== 'list' && typeof value !== 'object') node[key] = value;
      else node.setAttribute(key, value === true ? '' : String(value));
    }
  }

  append(node, children);
  return node;
}

export function append(node, children) {
  for (const child of children.flat(4)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
function escapeHtml(text) {
  return text.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

/**
 * A deliberately small subset of Markdown for lesson prose: **bold**,
 * *italic*, `code`, and — because music writing needs them — ♯ and ♭
 * spelled out as `#` and `b` inside note names are left alone.
 */
export function richText(text) {
  const html = escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  const span = document.createElement('span');
  span.innerHTML = html;
  return span;
}

/** `<p>` elements for an array of prose strings. */
export function paragraphs(lines) {
  return [].concat(lines).map((line) => h('p.prose', null, richText(line)));
}

export function button(label, props = {}) {
  return h('button.btn', { type: 'button', ...props }, label);
}

export function icon(name) {
  return h('span.icon', { 'aria-hidden': 'true', dataset: { icon: name } });
}

/** 92 -> "1m 32s"; 3900 -> "1h 5m" */
export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds));
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  if (minutes < 60) return total % 60 ? `${minutes}m ${total % 60}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return minutes % 60 ? `${hours}h ${minutes % 60}m` : `${hours}h`;
}

export function percent(value) {
  return `${Math.round(value * 100)}%`;
}

/** A labelled slider that reports its value as it moves. */
export function slider({ label, min, max, step = 1, value, format = String, onInput }) {
  const output = h('span.control__value', null, format(value));
  const input = h('input.control__slider', {
    type: 'range', min, max, step, value,
    'aria-label': label,
    oninput: (event) => {
      const next = Number(event.target.value);
      output.textContent = format(next);
      onInput(next);
    },
  });
  return h('label.control', null, h('span.control__label', null, label), input, output);
}

export function select({ label, options, value, onChange }) {
  const node = h('select.control__select', {
    'aria-label': label,
    onchange: (event) => onChange(event.target.value),
  }, options.map((option) => h('option', { value: option.value, selected: option.value === value }, option.label)));
  return h('label.control', null, h('span.control__label', null, label), node);
}

export function segmented({ label, options, value, onChange }) {
  const group = h('div.segmented', { role: 'group', 'aria-label': label });
  for (const option of options) {
    group.append(h('button.segmented__option', {
      type: 'button',
      'aria-pressed': String(option.value === value),
      onclick: () => {
        for (const child of group.children) child.setAttribute('aria-pressed', 'false');
        group.querySelector(`[data-value="${CSS.escape(String(option.value))}"]`)?.setAttribute('aria-pressed', 'true');
        onChange(option.value);
      },
      dataset: { value: String(option.value) },
    }, option.label));
  }
  return h('div.control.control--segmented', null, label ? h('span.control__label', null, label) : null, group);
}

export function card(title, ...children) {
  return h('section.card', null, title ? h('h2.card__title', null, title) : null, ...children);
}

export function stat(value, label, modifier = '') {
  return h(`div.stat${modifier ? `.stat--${modifier}` : ''}`, null,
    h('div.stat__value', null, String(value)),
    h('div.stat__label', null, label));
}

/** Announce something to screen readers without changing the layout. */
export function announce(message) {
  let region = document.getElementById('live-region');
  if (!region) {
    region = h('div#live-region', { class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });
    document.body.append(region);
  }
  region.textContent = message;
}

/** Brief toast, used for confirmations that do not deserve a dialog. */
export function toast(message, { tone = 'info', duration = 2600 } = {}) {
  let host = document.getElementById('toasts');
  if (!host) {
    host = h('div#toasts', { class: 'toasts' });
    document.body.append(host);
  }
  const node = h(`div.toast.toast--${tone}`, null, message);
  host.append(node);
  requestAnimationFrame(() => node.classList.add('is-visible'));
  setTimeout(() => {
    node.classList.remove('is-visible');
    setTimeout(() => node.remove(), 300);
  }, duration);
}
