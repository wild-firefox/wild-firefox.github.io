const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../assets/js/site-stats.js'), 'utf8');

function environment(hostname = 'wild-firefox.github.io', protocol = 'https:') {
  const timers = new Map(), observers = [], scripts = [], labels = [];
  let nextTimer = 1, panel;
  const values = [{ textContent: '—' }, { textContent: '—' }];
  const note = {}, provider = {}, group = {};
  const footer = {
    querySelector: (selector) => selector === '.site-stats' ? panel : null,
    insertBefore: (element) => { panel = element; },
  };
  const root = { lang: 'zh-CN' };
  const document = {
    readyState: 'complete', documentElement: root,
    querySelector: () => footer,
    getElementById: (id) => scripts.find((s) => s.id === id),
    createElement: (tag) => tag === 'script' ? {
      handlers: {}, addEventListener(name, handler) { this.handlers[name] = handler; },
    } : {
      dataset: {},
      querySelector(selector) { return { '.site-stats-note': note, '.site-stats-provider': provider, '.site-stats-values': group }[selector]; },
      querySelectorAll(selector) {
        if (selector === 'strong') return values;
        if (!labels.length) labels.push({ dataset: { statsLabel: 'visitors' } }, { dataset: { statsLabel: 'views' } });
        return labels;
      },
    },
    head: { append: (script) => scripts.push(script) },
  };
  class MutationObserver {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  const window = {
    setTimeout: (callback) => { const id = nextTimer++; timers.set(id, callback); return id; },
    clearTimeout: (id) => timers.delete(id),
    requestIdleCallback: (callback) => { window.idle = callback; },
    addEventListener: () => {},
  };
  const context = vm.createContext({ document, window, location: { hostname, protocol }, MutationObserver });
  const run = () => vm.runInContext(code, context);
  run();
  return { run, root, window, scripts, observers, values, note, labels, timers, get panel() { return panel; } };
}

test('localhost and non-production hostnames never send counter requests', () => {
  for (const host of ['localhost', '127.0.0.1', 'preview.example.com', '']) {
    const env = environment(host);
    assert.equal(env.panel.dataset.state, 'preview');
    assert.equal(env.scripts.length, 0);
    assert.equal(env.window.idle, undefined);
  }
  assert.equal(environment('wild-firefox.github.io', 'http:').panel.dataset.state, 'preview');
});

test('production waits for idle and initializes only once', () => {
  const env = environment();
  assert.equal(env.scripts.length, 0);
  env.window.idle();
  env.run();
  assert.equal(env.scripts.length, 1);
  assert.equal(env.scripts[0].async, true);
  assert.equal(env.panel.dataset.state, 'loading');
});

test('real counts resolve loading; language changes preserve values and do not recount', () => {
  const env = environment();
  env.window.idle();
  env.values[0].textContent = '42';
  env.values[1].textContent = '100';
  env.observers[1].callback();
  assert.equal(env.panel.dataset.state, 'ready');
  assert.equal(env.timers.size, 0);
  env.root.lang = 'en';
  env.observers[0].callback();
  assert.equal(env.labels[0].textContent, 'Site visitors (UV)');
  assert.equal(env.values[0].textContent, '42');
  assert.equal(env.scripts.length, 1);
});

test('timeout and load errors never fabricate zeroes; late valid responses recover', () => {
  const env = environment();
  env.window.idle();
  for (const callback of env.timers.values()) callback();
  assert.equal(env.panel.dataset.state, 'unavailable');
  assert.equal(env.values[0].textContent, '—');
  env.values[0].textContent = '0';
  env.values[1].textContent = '1';
  env.observers[1].callback();
  assert.equal(env.panel.dataset.state, 'ready');
  const errorEnv = environment();
  errorEnv.window.idle();
  errorEnv.scripts[0].handlers.error();
  assert.equal(errorEnv.panel.dataset.state, 'unavailable');
  assert.equal(errorEnv.values[0].textContent, '—');
});
