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
      this.stream.write(this.text)
      return
    }

    this.stream.write(this.ansi.cursorSavePosition)
    this.stream.write(this.ansi.cursorHide)
    this._render()
    this.id = setInterval(this._spin.bind(this), this.interval)
  }

  stop (status) {
    if (status && !this.enabled) this.stream.write(` ${status}\n`)
    if (!this.enabled) return
    if (status) this._status = status

    clearInterval(this.id)
    this.id = null
    this.enabled = false
    this.frameIndex = 0
    this._render()
    this.stream.write(this.ansi.cursorShow)
  }

  warn (msg) {
    this.warnings.push(msg)
    this._render()
  }

  get status () {
    return this._status
  }

  set status (status) {
    this._status = status
    if (this.enabled) this._render()
    else this.stream.write(` ${this.status}\n${this.text}`)
  }

  clear () {
    this.stream.write(this.ansi.cursorRestorePosition)
    this.stream.write(this.ansi.eraseDown)
  }

  _render () {
    this.clear()
    this.stream.write(this._output)
    this.stream.write(this.ansi.cursorUp(this._lines))
    this.stream.write(this.ansi.cursorSavePosition)
    this.stream.write(this.ansi.cursorDown(this._lines))
  }

  get _output () {
    return `${this.text}${this.enabled ? ' ' + this._frame() : ''} ${this.status ? this.status : ''}\n` +
      this.warnings.map(w => errors.renderWarning(w) + '\n')
  }

  get _lines () {
    return 1 + this.warnings.length
  }

  _spin () {
    this.stream.write(this.ansi.cursorRestorePosition)
    this.stream.write(this.ansi.cursorForward(color.stripColor(this.text).length + 1))
    this.stream.write(this._frame())
    this.stream.write(this.ansi.cursorDown(this._lines))
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
