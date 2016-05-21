'use strict'

// code mostly from https://github.com/sindresorhus/ora

let console = require('./console')
let color = require('./color')
let errors = require('./errors')

class Spinner {
  constructor (options) {
    this.options = Object.assign({
      text: ''
    }, options)

    this.ansi = require('ansi-escapes')
    let spinners = require('./spinners.json')

    this.color = this.options.color || 'heroku'
    this.spinner = process.platform === 'win32' ? spinners.line : (this.options.spinner ? spinners[this.options.spinner] : spinners.dots2)
    this.text = this.options.text
    this.interval = this.options.interval || this.spinner.interval || 100
    this.id = null
    this.frameIndex = 0
    this.stream = this.options.stream || process.stderr
    this.enabled = !console.mocking() && (this.stream && this.stream.isTTY) && !process.env.CI
    this.warnings = []
  }

  start () {
    if (this.id) return
    if (!this.enabled) {
      console.writeError(this.text)
      return
    }

    this.stream.write(this.ansi.cursorLeft)
    this.stream.write(this.ansi.eraseLine)
    this.stream.write(this.ansi.cursorHide)
    this._render()
    this.id = setInterval(this._spin.bind(this), this.interval)
    process.on('SIGWINCH', this._sigwinch = this._render.bind(this))
  }

  stop (status) {
    if (status && !this.enabled) console.error(` ${status}`)
    if (!this.enabled) return
    if (status) this._status = status

    process.removeListener('SIGWINCH', this._sigwinch)
    clearInterval(this.id)
    this.id = null
    this.enabled = false
    this.frameIndex = 0
    this._render()
    this.stream.write(this.ansi.cursorShow)
  }

  warn (msg) {
    if (!this.enabled) {
      console.writeError(color.yellow(' !') + '\n' + errors.renderWarning(msg) + '\n' + this.text)
    } else {
      this.warnings.push(msg)
      this._render()
    }
  }

  get status () {
    return this._status
  }

  set status (status) {
    this._status = status
    if (this.enabled) this._render()
    else console.writeError(` ${this.status}\n${this.text}`)
  }

  clear () {
    if (!this._output) return
    this.stream.write(this.ansi.cursorUp(this._lines))
    this.stream.write(this.ansi.eraseDown)
  }

  _render () {
    if (this._output) this.clear()
    this._output = `${this.text}${this.enabled ? ' ' + this._frame() : ''} ${this.status ? this.status : ''}\n` +
      this.warnings.map(w => errors.renderWarning(w) + '\n').join('')
    this.stream.write(this._output)
  }

  get _lines () {
    return color.stripColor(this._output)
      .split('\n')
      .map(l => Math.ceil(l.length / this._width))
      .reduce((c, i) => c + i, 0)
  }

  get _width () {
    return errors.errtermwidth()
  }

  _spin () {
    this.stream.write(this.ansi.cursorUp(this._lines))
    let x = color.stripColor(this.text).length + 1
    let y = Math.floor(x / this._width)
    x = x - y * this._width
    this.stream.write(this.ansi.cursorMove(x, y))
    this.stream.write(this._frame())
    this.stream.write(this.ansi.cursorDown(this._lines - y))
    this.stream.write(this.ansi.cursorLeft)
    this.stream.write(this.ansi.eraseLine)
  }

  _frame () {
    var frames = this.spinner.frames
    var frame = frames[this.frameIndex]
    if (this.color) frame = color[this.color](frame)
    this.frameIndex = ++this.frameIndex % frames.length
    return frame
  }
}

module.exports = Spinner
