'use strict';

// code mostly from https://github.com/sindresorhus/ora

let console = require('./console');
let color   = require('./color');

class Spinner {
  constructor(options) {
    this.options = Object.assign({
      text:  '',
    }, options);

    this.cursor  = require('cli-cursor');
    let spinners = require('./spinners.json');

    this.color      = this.options.color || 'heroku';
    this.spinner    = process.platform === 'win32' ? spinners.line : (this.options.spinner ? spinners[this.options.spinner] : spinners.dots2);
    this.text       = this.options.text;
    this.interval   = this.options.interval || this.spinner.interval || 100;
    this.id         = null;
    this.frameIndex = 0;
    this.enabled    = !console.mocking() && (process.stderr && process.stderr.isTTY) && !process.env.CI;
  }

  frame() {
    var frames = this.spinner.frames;
    var frame = frames[this.frameIndex];
    if (this.color) frame = color[this.color](frame);
    this.frameIndex = ++this.frameIndex % frames.length;
    return frame;
  }

  clear() {
    if (!this.enabled) {
      return;
    }

    process.stderr.clearLine();
    process.stderr.cursorTo(0);
  }

  render() {
    process.stderr.write('\b' + this.frame());
  }

  start() {
    if (this.id) return;
    console.writeError(this.text);
    if (!this.enabled) return;
    console.writeError('  ');

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
    } else {
      this.clear();
      process.stderr.write(this.text + '  ');
    }
  }
}

module.exports = Spinner;
