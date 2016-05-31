'use strict'

const GLOBAL_CRED = 'b66ca6f60fe049d6bedfe3e2ccb28d8c'
const ROLLBAR_URL = 'https://api.rollbar.com/api/1/item/'

function request (method, url, payload) {
  const got = require('./got')

  return got(url, {
    method: method,
    body: JSON.stringify(payload)
  })
}

module.exports = function (cred, opts) {
  if (!cred) cred = GLOBAL_CRED

  function error (err) {
    const regex = /^\s*at (?:([^(]+(?: \[\w\s+\])?) )?\(?(.+?)(?::(\d+):(\d+)(?:, <js>:(\d+):(\d+))?)?\)?$/
    let frames = (err.stack || '').split('\n').map(function (line) {
      let r = line.match(regex)
      if (!r) return
      return {
        method: r[1],
        filename: r[2],
        lineno: r[3],
        colno: r[4]
      }
    })
    frames.shift() // discard first line
    return request('POST', ROLLBAR_URL, {
      access_token: cred,
      data: {
        code_version: opts.version,
        context: opts.context,
        platform: 'client',
        environment: 'production',
        framework: 'node',
        body: {
          trace: {
            exception: {
              class: err.name,
              message: err.message || err
            },
            frames}
        }
      }
    }).catch(err => require('./errors').log(err))
  }

  return {
    error
  }
}
