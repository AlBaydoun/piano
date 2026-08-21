/**
 * Hash routing. Hashes rather than the History API so the whole app can be
 * served as static files from any subdirectory — GitHub Pages included —
 * with no server rewrite rules.
 */

export class Router {
  constructor() {
    /** @type {Array<{pattern: RegExp, keys: string[], handler: Function, path: string}>} */
    this.routes = [];
    this.fallback = null;
    this.current = null;
    this._cleanup = null;
    this._onHashChange = () => this.resolve();
  }

  /**
   * @param {string} path e.g. '/lesson/:id'
   * @param {(context: {params: object, path: string}) => (void|Function)} handler
   *        may return a cleanup function, called when navigating away
   */
  add(path, handler) {
    const keys = [];
    const pattern = new RegExp(`^${path.replace(/:([\w]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    })}$`);
    this.routes.push({ pattern, keys, handler, path });
    return this;
  }

  notFound(handler) {
    this.fallback = handler;
    return this;
  }

  start() {
    window.addEventListener('hashchange', this._onHashChange);
    this.resolve();
    return this;
  }

  stop() {
    window.removeEventListener('hashchange', this._onHashChange);
  }

  get path() {
    const hash = window.location.hash.replace(/^#/, '');
    return hash.startsWith('/') ? hash : `/${hash}`;
  }

  navigate(path, { replace = false } = {}) {
    const target = `#${path.startsWith('/') ? path : `/${path}`}`;
    if (window.location.hash === target) {
      this.resolve();
      return;
    }
    if (replace) window.location.replace(target);
    else window.location.hash = target;
  }

  resolve() {
    const path = this.path === '/' ? '/home' : this.path;

    if (typeof this._cleanup === 'function') {
      try {
        this._cleanup();
      } catch (error) {
        console.error('Error cleaning up view', error);
      }
    }
    this._cleanup = null;

    for (const route of this.routes) {
      const match = route.pattern.exec(path);
      if (!match) continue;
      const params = Object.fromEntries(route.keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]));
      this.current = { path, route: route.path, params };
      this._cleanup = route.handler({ params, path }) ?? null;
      window.scrollTo(0, 0);
      return;
    }

    this.current = { path, route: null, params: {} };
    this._cleanup = this.fallback?.({ params: {}, path }) ?? null;
  }
}
