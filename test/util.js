'use strict'

let expect = require('chai').expect

function stripIndents (str) {
  return str.trim().replace(/\s+$/mg, '')
}

module.exports = {
  expectOutput: function (actual, expected) {
    return expect(actual.trim().replace(/\s+$/mg, ''))
      .to.equal(stripIndents(expected))
  }
}
