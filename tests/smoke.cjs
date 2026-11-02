'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const script = fs.readFileSync('script.js', 'utf8');
const config = fs.readFileSync('config.js', 'utf8');
new vm.Script(script, { filename: 'script.js' });
new vm.Script(config, { filename: 'config.js' });

function startGame(savedState) {
  const registry = new Map();
  const localData = new Map();
  if (savedState) localData.set('neuroquest-lunya-v1', JSON.stringify(savedState));

  function getElement(selector) {
    if (!registry.has(selector)) registry.set(selector, {
      innerHTML: '', textContent: '', value: '', disabled: false,
      dataset: {}, style: { setProperty() {} },
      classList: { add() {}, remove() {} },
      addEventListener(type, callback) { this['on' + type] = callback; },
      appendChild() {}, replaceChildren() {}, focus() {},
      get offsetWidth() { return 10; }
    });
    return registry.get(selector);
  }
  const document = {
    title: '',
    querySelector: getElement,
    createElement: () => ({
      className: '', style: { setProperty() {} },
      appendChild() {}
    }),
    addEventListener() {}
  };
  const window = { NEUROQUEST_CONFIG: {}, open() {}, scrollTo() {} };
  const context = {
    window, document, URL, console,
    localStorage: {
      getItem(k) { return localData.get(k) || null; },
      setItem(k, v) { localData.set(k, v); }
    },
    matchMedia: () => ({ matches: true }),
    setTimeout: () => 0,
    clearTimeout() {},
    scrollTo() {}
  };
  vm.runInNewContext(config, context, { filename: 'config.js', timeout: 5000 });
  vm.runInNewContext(script, context, { filename: 'script.js', timeout: 5000 });
  function click(action, value = 0) {
    const el = getElement('#app');
    assert.equal(typeof el.onclick, 'function', 'Game click handler missing');
    el.onclick({ target: { closest() { return { dataset: { action, value: String(value) }, disabled: false }; } } });
  }
  return { html: () => getElement('#app').innerHTML, click };
}

let game = startGame();
assert.match(game.html(), /Начать приключение/, 'Welcome screen did not load');
game.click('start');
assert.match(game.html(), /Карта приключений/, 'Mission map did not load');
game.click('open-mission', 0);
assert.match(game.html(), /Фото или нейросеть/, 'First mission did not load');

game = startGame({
  screen: 'final', mission: 5, round: 0, stars: 80,
  completed: [0, 1, 2, 3, 4, 5], earned: [], training: [],
  sound: false, selectedPrompt: { who:'котика',where:'в космосе',action:'летит на ракете',style:'мультяшный' },
  promptMade: true
});
assert.match(game.html(), /Ура! Ты — Мастер ИИ!/, 'Congratulations screen did not load');
assert.doesNotMatch(game.html(), /диплом/i, 'Diploma should not be present');
game.click('restart');
assert.match(game.html(), /Начать приключение/, 'Restart did not work');
console.log('PASS: welcome, map, first mission, final congratulations and restart');
