'use strict'

const chalk = require('chalk')

let colors = {
  attachment: 'cyan',
  addon: 'yellow',
  configVar: 'green'
}

for (let color of Object.keys(colors)) {
  let c = colors[color]
  colors[color] = s => chalk[c](s)
}

colors.release = s => chalk.blue.bold(s)
colors.cmd = s => chalk.cyan.bold(s)
colors.pipeline = s => chalk.green.bold(s)

colors.heroku = s => {
  if (!chalk.enabled) return s
  let supports = require('supports-color')
  if (!supports) return s
  supports.has256 = supports.has256 || (process.env.TERM || '').indexOf('256') !== -1
  return supports.has256 ? '\u001b[38;5;104m' + s + chalk.styles.modifiers.reset.open : chalk.magenta(s)
}

colors.app = s => chalk.enabled && process.platform !== 'win32' ? colors.heroku(`⬢ ${s}`) : colors.heroku(s)

module.exports = Object.assign(chalk, colors)
