'use strict'

const chalk = require('chalk')
const stripAnsi = require('strip-ansi')
const styles = require('ansi-styles')

const colors = module.exports = Object.assign({
  attachment: chalk.cyan,
  addon: chalk.yellow,
  configVar: chalk.configVar,
  dim: (process.platform === 'win32' || process.platform === 'windows') ? chalk.gray : chalk.dim,
  heroku: s => {
    if (!chalk.enabled) return s
    let supports = require('supports-color')
    if (!supports) return s
    supports.has256 = supports.has256 || (process.env.TERM || '').indexOf('256') !== -1
    return supports.has256 ? '\u001b[38;5;104m' + s + styles.reset.open : chalk.magenta(s)
  },
  release: chalk.blue.bold,
  cmd: chalk.cyan.bold,
  pipeline: chalk.green.bold,
  app: s => chalk.enabled && process.platform !== 'win32' ? colors.heroku(`⬢ ${s}`) : colors.heroku(s),
  stripColor: stripAnsi
}, chalk)

console.log(Object.getOwnPropertyNames(chalk))
// console.log(colors)
// console.log(colors.attachment)
// console.log(chalk.red)
// console.log(chalk.red('foo'))
