'use strict'
/* globals describe it beforeEach afterEach */

const cli = require('..')
const expect = require('unexpected')
const chalk = require('chalk')

describe('linewrap', () => {
  beforeEach(() => {
    chalk.enabled = true
  })
  afterEach(() => {
    chalk.disabled = true
  })

  it('indents and wraps text', function () {
    const output = cli.linewrap(2, 10)('this text is longer than 10 characters\n\n\nwoonewlines')
    expect(output, 'to equal', `  this
  text is
  longer
  than 10
  characters\n  \n  \n  woonewlines`)
  })

  it('indents and wraps hard text', function () {
    const output = cli.linewrap.hard(10)('this text is longer than 10 characters\n\n\nwoonewlinessssss')
    expect(output, 'to equal', `this text
is longer
than 10
characters
\n
woonewline
ssssss`)
  })

  it('wraps html', function () {
    const output = cli.linewrap(10, { preset: 'html' })('<a href="ff">this is a link</a>this is text<b>this is a bold thing</b>')
    expect(output, 'to equal', '<a href="ff">this is a<br>link</a>this<br>is text<b><br>this is a<br>bold thing</b>')
  })

  it('skips ansi characters', function () {
    const output = cli.linewrap({ start: 2, stop: 15, skipScheme: 'ansi-color' })(`${chalk.red('colored')} text here`)
    expect(output, 'to equal', `  ${chalk.red('colored')} text
  here`)
  })
})
