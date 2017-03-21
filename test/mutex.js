'use strict'
/* globals describe it beforeEach */

let cli = require('..')
let Mutex = require('../lib/mutex')
let expect = require('unexpected')

describe('mutex', function () {
  beforeEach(function () {
    cli.mockConsole()
  })

  it('should run promises in order', function () {
    let mutex = new Mutex()
    return Promise.all([
      mutex.synchronize(function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            cli.log('foo')
            resolve('foo')
          }, 3)
        })
      }),
      mutex.synchronize(function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            cli.log('bar')
            resolve('bar')
          }, 1)
        })
      })
    ]).then((results) => {
      expect(['foo', 'bar'], 'to equal', results)
      expect(cli.stdout, 'to equal', 'foo\nbar\n')
    })
  })

  it('should propegate errors', function () {
    let mutex = new Mutex()
    return Promise.all([
      mutex.synchronize(function () {
        return new Promise(function (resolve, reject) {
          cli.log('foo')
          resolve('foo')
        })
      }),
      mutex.synchronize(function () {
        return new Promise(function (resolve, reject) {
          cli.log('bar')
          reject(new Error('bar'))
        })
      }),
      mutex.synchronize(function () {
        return new Promise(function (resolve, reject) {
          cli.log('biz')
          resolve('biz')
        })
      })
    ]).then((results) => {
      expect(true, 'to equal', false)
    }).catch((err) => {
      expect(err.message, 'to equal', 'bar')
      expect(cli.stdout, 'to equal', 'foo\nbar\nbiz\n')
    })
  })

  it('should run promises after draining the queue', function (done) {
    let mutex = new Mutex()
    mutex.synchronize(function () {
      return new Promise(function (resolve, reject) {
        cli.log('foo')
        resolve('foo')
      })
    }).then((results) => {
      setImmediate(function () {
        expect('foo', 'to equal', results)
        expect(cli.stdout, 'to equal', 'foo\n')

        return mutex.synchronize(function () {
          return new Promise(function (resolve, reject) {
            cli.log('bar')
            resolve('bar')
          })
        }).then((results) => {
          expect('bar', 'to equal', results)
          expect(cli.stdout, 'to equal', 'foo\nbar\n')
          done()
        })
      })
    })
  })
})
