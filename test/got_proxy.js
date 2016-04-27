'use strict'
/* globals describe it beforeEach afterEach sinon */

let nock = require('nock')
let expect = require('chai').expect

var fs = require('fs')
var proxyquire = require('proxyquire').noCallThru()

let gotProxy = function (url, opts) {
  let promise = new Promise(function (resolve) {
    resolve()
  })
  promise._calledWith = {url, opts}
  return promise
}

gotProxy.stream = function (url, opts) {
  let stream = {}
  stream._calledWith = {url, opts}
  return stream
}

let cli_got = proxyquire('../lib/got', {
  'got': gotProxy,
  'tunnel-agent': {
    httpOverHttp: function (opts) {
      return Object.assign({}, opts, {_method: 'httpOverHttp'})
    },
    httpOverHttps: function (opts) {
      return Object.assign({}, opts, {_method: 'httpOverHttps'})
    },
    httpsOverHttp: function (opts) {
      return Object.assign({}, opts, {_method: 'httpsOverHttp'})
    },
    httpsOverHttps: function (opts) {
      return Object.assign({}, opts, {_method: 'httpsOverHttps'})
    }
  }
})

let shouldHaveProperProxying = function (got_method) {
  describe('proxy', function () {
    beforeEach(function () {
      nock.disableNetConnect()
      process.env.HTTP_PROXY = ''
      process.env.HTTPS_PROXY = ''
    })

    afterEach(function () {
      process.env.HTTP_PROXY = ''
      process.env.HTTPS_PROXY = ''
    })

    it('HTTP_PROXY http://foo:bar@proxy.com for https://example.com', function () {
      process.env.HTTP_PROXY = 'http://foo:bar@proxy.com:3128'
      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128', proxyAuth: 'foo:bar'}, defaultPort: 443, _method: 'httpsOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTP_PROXY http://proxy.com for https://example.com', function () {
      process.env.HTTP_PROXY = 'http://proxy.com:3128'
      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128'}, defaultPort: 443, _method: 'httpsOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTP_PROXY https://proxy.com for https://example.com', function () {
      process.env.HTTP_PROXY = 'https://proxy.com:3128'
      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128'}, defaultPort: 443, _method: 'httpsOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTP_PROXY http://proxy.com for http://example.com', function () {
      process.env.HTTP_PROXY = 'http://proxy.com:3128'
      let promise = got_method('http://example.com', {headers: {foo: 'bar'}})
      expect('http://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128'}, _method: 'httpOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTP_PROXY https://proxy.com for http://example.com', function () {
      process.env.HTTP_PROXY = 'https://proxy.com:3128'
      let promise = got_method('http://example.com', {headers: {foo: 'bar'}})
      expect('http://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128'}, _method: 'httpOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTPS_PROXY http://proxy.com for https://example.com', function () {
      process.env.HTTPS_PROXY = 'http://proxy.com:3128'
      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128'}, defaultPort: 443, _method: 'httpsOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTPS_PROXY https://proxy.com for https://example.com', function () {
      process.env.HTTPS_PROXY = 'https://proxy.com:3128'
      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect('bar').to.eql(promise._calledWith.opts.headers.foo)
      expect({proxy: {host: 'proxy.com', port: '3128'}, defaultPort: 443, _method: 'httpsOverHttp'}).to.eql(promise._calledWith.opts.agent)
    })

    it('HTTPS_PROXY http://proxy.com for http://example.com', function () {
      process.env.HTTPS_PROXY = 'http://proxy.com:3128'
      let promise = got_method('http://example.com', {headers: {foo: 'bar'}})
      expect('http://example.com').to.equal(promise._calledWith.url)
      expect({headers: {foo: 'bar'}}).to.eql(promise._calledWith.opts)
    })

    it('HTTPS_PROXY https://proxy.com for http://example.com', function () {
      process.env.HTTPS_PROXY = 'https://proxy.com:3128'
      let promise = got_method('http://example.com', {headers: {foo: 'bar'}})
      expect('http://example.com').to.equal(promise._calledWith.url)
      expect({headers: {foo: 'bar'}}).to.eql(promise._calledWith.opts)
    })
  })
}

let shouldHaveProperTrustedCerts = function (got_method) {
  describe('ssl_cert_dir', function () {
    beforeEach(function () {
      nock.disableNetConnect()
      sinon.stub(fs, 'readFileSync')
      sinon.stub(fs, 'readdirSync')
      process.env.SSL_CERT_FILE = ''
      process.env.SSL_CERT_DIR = ''
    })

    afterEach(function () {
      process.env.SSL_CERT_FILE = ''
      process.env.SSL_CERT_DIR = ''
      fs.readFileSync.restore()
      fs.readdirSync.restore()
    })

    it('when SSL_CERT_FILE is set it is used as a ca', function () {
      process.env.SSL_CERT_FILE = '/foo/bar.crt'

      fs.readFileSync
        .withArgs('/foo/bar.crt')
        .returns('--- cert ---')

      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect({headers: {foo: 'bar'}, ca: ['--- cert ---']}).to.eql(promise._calledWith.opts)
    })

    it('when SSL_CERT_DIR is set it is used as a ca', function () {
      process.env.SSL_CERT_DIR = '/foo'

      fs.readdirSync
        .withArgs('/foo')
        .returns(['bar.crt'])

      fs.readFileSync
        .withArgs('/foo/bar.crt')
        .returns('--- cert ---')

      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect({headers: {foo: 'bar'}, ca: ['--- cert ---']}).to.eql(promise._calledWith.opts)
    })

    it('when SSL_CERT_FILE and SSL_CERT_DIR are set they are used as cas', function () {
      process.env.SSL_CERT_FILE = '/foo/bar.crt'
      process.env.SSL_CERT_DIR = '/bar'

      fs.readdirSync
        .withArgs('/bar')
        .returns(['foo.crt'])

      fs.readFileSync
        .withArgs('/foo/bar.crt')
        .returns('--- cert file ---')

      fs.readFileSync
        .withArgs('/bar/foo.crt')
        .returns('--- cert dir ---')

      let promise = got_method('https://example.com', {headers: {foo: 'bar'}})
      expect('https://example.com').to.equal(promise._calledWith.url)
      expect({headers: {foo: 'bar'}, ca: ['--- cert file ---', '--- cert dir ---']}).to.eql(promise._calledWith.opts)
    })
  })
}

describe('got()', function () {
  beforeEach(function () {
    nock.disableNetConnect()
  })

  shouldHaveProperProxying(cli_got)
  shouldHaveProperTrustedCerts(cli_got)

  it('when no proxy is used, the standard agent is passed', function () {
    let promise = cli_got('https://example.com', {headers: {foo: 'bar'}})
    expect('https://example.com').to.equal(promise._calledWith.url)
    expect({headers: {foo: 'bar'}}).to.eql(promise._calledWith.opts)
  })
})

describe('got.stream()', function () {
  beforeEach(function () {
    nock.disableNetConnect()
  })

  shouldHaveProperProxying(cli_got.stream)
  shouldHaveProperTrustedCerts(cli_got.stream)

  it('when no proxy is used, the standard agent is passed', function () {
    let promise = cli_got.stream('https://example.com', {headers: {foo: 'bar'}})
    expect('https://example.com').to.equal(promise._calledWith.url)
    expect({headers: {foo: 'bar'}}).to.eql(promise._calledWith.opts)
  })
})
