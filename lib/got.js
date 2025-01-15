'use strict'

const hush = require('./console').hush

function findProxy (urlParsed) {
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy

  if (urlParsed.protocol === 'https:') {
    return httpsProxy || httpProxy
  } else {
    return httpProxy
  }
}

function findTunnel (urlParsed) {
  const tunnel = require('tunnel-agent')

  if (urlParsed.protocol === 'https:') {
    return tunnel.httpsOverHttp
  } else {
    return tunnel.httpOverHttp
  }
}

function agent (urlParsed, proxyParsed, certs) {
  const tunnelMethod = findTunnel(urlParsed)
  const opts = {
    proxy: {
      host: proxyParsed.hostname,
      port: proxyParsed.port || '8080'
    }
  }

  if (proxyParsed.auth) {
    opts.proxy.proxyAuth = proxyParsed.auth
  }

  if (certs.length > 0) {
    opts.ca = certs
  }

  const tunnelAgent = tunnelMethod(opts)
  if (urlParsed.protocol === 'https:') {
    tunnelAgent.defaultPort = 443
  }
  return tunnelAgent
}

function sslCertFile () {
  return process.env.SSL_CERT_FILE ? [process.env.SSL_CERT_FILE] : []
}

function sslCertDir () {
  const certDir = process.env.SSL_CERT_DIR
  if (certDir) {
    const fs = require('fs')
    const path = require('path')
    return fs.readdirSync(certDir).map(f => path.join(certDir, f))
  } else {
    return []
  }
}

function getCerts () {
  const filenames = sslCertFile().concat(sslCertDir())

  if (filenames.length > 0) {
    hush('Adding the following trusted certificate authorities')
  }

  return filenames.map(function (filename) {
    const fs = require('fs')
    hush('  ' + filename)
    return fs.readFileSync(filename)
  })
}

function addToOpts (url, opts) {
  const urlLib = require('url')

  const urlParsed = new urlLib.URL(url)
  const proxy = findProxy(urlParsed)

  const certs = getCerts()

  if (proxy) {
    // eslint-disable-next-line n/no-deprecated-api
    const proxyParsed = urlLib.parse(proxy)
    opts = Object.assign({}, opts, { agent: agent(urlParsed, proxyParsed, certs) })
  }

  if (certs.length > 0) {
    opts = Object.assign({}, opts, { ca: certs })
  }

  return opts
}

// eslint-disable-next-line prefer-const
let loadErrors

function got (url, opts) {
  const gotDelegate = require('got')
  loadErrors()
  return gotDelegate(url, addToOpts(url, opts))
}

got.stream = function (url, opts) {
  const gotDelegate = require('got')
  loadErrors()
  return gotDelegate.stream(url, addToOpts(url, opts))
}

const helpers = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
]

helpers.forEach(el => {
  got[el] = (url, opts) => got(url, Object.assign({}, opts, { method: el }))
})

helpers.forEach(el => {
  got.stream[el] = function (url, opts) {
    return got.stream(url, Object.assign({}, opts, { method: el }))
  }
})

loadErrors = () => {
  const gotDelegate = require('got')

  const errors = [
    'CacheError',
    'CancelError',
    'UnsupportedProtocolError',
    'HTTPError',
    'MaxRedirectsError',
    'ParseError',
    'ReadError',
    'RequestError',
    'TimeoutError',
    'UploadError'
  ]

  errors.forEach(el => {
    got[el] = gotDelegate[el]
  })
}

module.exports = got
