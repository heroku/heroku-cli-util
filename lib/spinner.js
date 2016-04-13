'use strict';

// code mostly from https://github.com/sindresorhus/ora

let console = require('./console');

function findBestHerokuColor() {
  let color = require('./color');
  if (!color.enabled) return;
  let supports = require('supports-color');
  if (!supports) return null;
  supports.has256 = supports.has256 || (process.env.TERM || '').indexOf('256') !== -1;
  return supports.has256 ? '\u001b[38;5;104m' : color.styles.colors.magenta.open;
}

class Spinner {
  constructor(options) {
    this.options = Object.assign({
      text:  '',
    }, options);

    this.cursor  = require('cli-cursor');
    let spinners = require('./spinners.json');

    var sp = this.options.spinner;
    this.spinner = typeof sp === 'object' ? sp : (process.platform === 'win32' ? spinners.line : (spinners[sp] || spinners.dots2));

    this.text       = this.options.text;
    this.interval   = this.options.interval || this.spinner.interval || 100;
    this.color      = findBestHerokuColor();
    this.id         = null;
    this.frameIndex = 0;
    this.enabled    = !console.mocking() && (process.stderr && process.stderr.isTTY) && !process.env.CI;
  }

  frame() {
    var frames = this.spinner.frames;
    var frame = frames[this.frameIndex];
    if (this.color) frame = this.color + frame + '\u001b[0m';
    this.frameIndex = ++this.frameIndex % frames.length;
    return `${this.text} ${frame}`;
  }

  clear() {
    if (!this.enabled) {
      return;
    }

    process.stderr.clearLine();
    process.stderr.cursorTo(0);
  }

  render() {
    this.clear();
    process.stderr.write(this.frame());
  }

  start() {
    if (this.id) return;
    if (!this.enabled) {
      console.writeError(this.text);
      return;
    }

    this.cursor.hide();
    this.render();
    this.id = setInterval(this.render.bind(this), this.interval);
  }

  stop() {
    if (!this.enabled) {
      return;
    }

    clearInterval(this.id);
    this.id = null;
    this.frameIndex = 0;
    this.clear();
    process.stderr.write(this.text);
    this.cursor.show();
  }

  update(text) {
    this.text = text;
    if (!this.enabled) {
      console.writeError('\n' + this.text);
    }
  }
}

module.exports = Spinner;
