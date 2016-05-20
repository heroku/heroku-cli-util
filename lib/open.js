'use strict'

let color = require('./color')

function open (url) {
  let opn = require('opn')
  return new Promise((resolve, reject) => {
    opn(url, {wait: false}, err => {
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
