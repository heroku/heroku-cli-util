'use strict'
/* globals describe it beforeEach */

const cli = require('..')
const nock = require('nock')
const expect = require('chai').expect
const got = require('got')

function concat (stream, callback) {
  const strings = []
  stream.on('data', function (data) {
    strings.push(data)
  })
  stream.on('end', function () {
    callback(strings.join(''))
  })
}

describe('got', function () {
  beforeEach(function () {
    nock.disableNetConnect()
    nock.cleanAll()
  })

  it('wraps a call to got() with opts', function () {
    const mock = nock('https://example.com', { reqheaders: { foo: 'bar' } })
      .get('/hello')
      .reply(200, {})

    return cli.got('https://example.com/hello', { headers: { foo: 'bar' } }).then(function () {
      mock.done()
    })
  })

  it('wraps a call to got.stream() with opts', function () {
    const mock = nock('https://example.com', { reqheaders: { foo: 'bar' } })
      .get('/hello')
      .reply(200, 'hello')

    const gotStream = cli.got.stream('https://example.com/hello', { headers: { foo: 'bar' } })
    concat(gotStream, function (data) {
      expect(data).to.equal('hello')
      mock.done()
    })
  })

  it('includes the got errors', function () {
    nock('https://example.com', { reqheaders: { foo: 'bar' } })
      .get('/hello')
      .reply(404, 'not found')

    let thrown = false
    return cli.got('https://example.com/hello', { headers: { foo: 'bar' } }).catch(function (err) {
      expect(err instanceof cli.got.HTTPError).to.equal(true)
      thrown = true
    }).then(function () {
      expect(thrown).to.equal(true) // should not pass
    })
  })

  const helpersWithBody = ['post', 'put', 'patch', 'delete']
  const helpersWithoutBody = ['get', 'head']
  const helpers = helpersWithBody.concat(helpersWithoutBody)

  const requiresBody = (h) => helpersWithBody.includes(h)

  helpers.forEach(function (helper) {
    it(`wraps a call to got.${helper}() with opts`, function () {
      const mock = nock('https://example.com', { reqheaders: { foo: 'bar' } })[helper]('/hello').reply(200, {})

      return cli.got[helper]('https://example.com/hello', { headers: { foo: 'bar' } }).then(function () {
        mock.done()
      })
    })

    it(`wraps a call to got.stream.${helper}() with opts`, function () {
      const mock = nock('https://example.com', { reqheaders: { foo: 'bar' } })[helper]('/hello')
        .reply(200, 'hello')

      const gotStream = cli.got.stream[helper]('https://example.com/hello', { headers: { foo: 'bar' }, ...(requiresBody(helper) ? { body: 'hello' } : {}) })
      concat(gotStream, function (data) {
        expect(data).to.equal('hello')
        mock.done()
      })
    })
  })

  it('defines all properties of the got module', function () {
    const ignoredProperties = ['__esModule', 'default', 'defaults', 'extend', 'mergeOptions', 'paginate']

    expect(Object.getOwnPropertyNames(got)
      .filter(p => !ignoredProperties.includes(p))
      .concat(['prototype']).sort()).to.eql(Object.getOwnPropertyNames(cli.got).sort())
    expect(Object.getOwnPropertyNames(got.stream)
      .filter(p => !ignoredProperties.includes(p))
      .concat(['prototype']).sort()).to.eql(Object.getOwnPropertyNames(cli.got.stream).sort())
  })
})
