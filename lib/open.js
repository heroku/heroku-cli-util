'use strict'

const { color } = require('..')

function open (url, browser) {
  const opn = require('opn')
  return new Promise((resolve, reject) => {
    const opts = { wait: false }
    if (browser) { opts.app = browser }
    opn(url, opts, err => {
      if (err) {
        reject(new Error(
          `Error opening web browser.
${err}

Manually visit ${color.cyan(url)} in your browser.`))
      } else resolve(err)
    })
  })
}

module.exports = open
