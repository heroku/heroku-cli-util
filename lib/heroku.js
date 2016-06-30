'use strict'
/* globals context */

if (!global.context) global.context = {}

let Heroku = require('heroku-client')
let cli = require('..')

let httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy

function setupHttpProxy () {
  const url = require('url')
  cli.hush(`proxy set to ${httpsProxy}`)
  let proxy = url.parse(httpsProxy)
  process.env.HEROKU_HTTP_PROXY_HOST = proxy.hostname
  process.env.HEROKU_HTTP_PROXY_PORT = proxy.port
  process.env.HEROKU_HTTP_PROXY_AUTH = proxy.auth
}

if (httpsProxy) setupHttpProxy()

function apiMiddleware (response, cb) {
  let warning = response.headers['x-heroku-warning'] || response.headers['warning-message']
  if (warning) cli.action.warn(warning)
  cb()
}

let host = context.apiUrl || 'https://api.heroku.com'
let opts = {
  userAgent: context.version,
  debug: context.debug,
  debugHeaders: context.debugHeaders,
  token: context.auth ? context.auth.password : null,
  host: host,
  headers: {},
  rejectUnauthorized: !(process.env.HEROKU_SSL_VERIFY === 'disable' || host.endsWith('herokudev.com')),
  middleware: apiMiddleware
}
if (process.env.HEROKU_HEADERS) {
  Object.assign(opts.headers, JSON.parse(process.env.HEROKU_HEADERS))
}
if (context.secondFactor) {
  Object.assign(opts.headers, {'Heroku-Two-Factor-Code': context.secondFactor})
}
if (context.reason) {
  Object.assign(opts.headers, {'X-Heroku-Sudo-Reason': context.reason})
}

module.exports = new Heroku(opts)
