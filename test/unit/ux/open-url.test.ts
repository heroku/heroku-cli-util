import {stderr, stdout} from '@heroku-cli/test-utils'
import {Errors} from '@oclif/core'
import ansis from 'ansis'
import {expect} from 'chai'
import childProcess from 'node:child_process'
import sinon from 'sinon'

import {anykey} from '../../../src/ux/any-key.js'
import {openUrl} from '../../../src/ux/open-url.js'

describe('openUrl', function () {
  const {env} = process
  const url = 'https://example.com'
  let urlOpenerSpy: sinon.SinonSpy
  let anyKeySpy: sinon.SinonSpy

  beforeEach(function () {
    process.env = {}
  })

  afterEach(function () {
    sinon.restore()
    process.env = env
  })

  context('when the user accepts the prompt to open the browser', function () {
    beforeEach(function () {
      urlOpenerSpy = sinon.spy((..._args: Parameters<typeof open>) => ({
        on(_: string, _cb: ErrorCallback) {},
      } as unknown as childProcess.ChildProcess))
      anyKeySpy = sinon.spy((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
    })

    describe('attempting to open the browser', function () {
      context('without browser or action arguments', function () {
        it('shows the URL that will be opened for in the default browser', async function () {
          await openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

          expect(ansis.strip(stdout())).to.contain(`Opening ${url} in your default browser…`)
        })

        it('attempts to open the default browser to the url argument', async function () {
          await openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

          expect(urlOpenerSpy.calledWith(url, {wait: false})).to.equal(true)
        })
      })

      context('with browser argument', function () {
        it('shows the URL that will be opened in the specified browser', async function () {
          await openUrl(url, 'firefox', undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

          expect(ansis.strip(stdout())).to.contain(`Opening ${url} in firefox browser…`)
        })

        it('attempts to open the specified browser to the url argument', async function () {
          await openUrl(url, 'firefox', undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

          expect(urlOpenerSpy.calledWith(url, {app: {name: 'firefox'}, wait: false})).to.equal(true)
        })
      })

      context('with action argument', function () {
        it('shows the action to be performed', async function () {
          await openUrl(url, undefined, 'view something', {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

          expect(anyKeySpy.calledWithMatch(/to view something/)).to.be.true
        })
      })
    })

    context('when there\'s an error opening the browser', function () {
      beforeEach(function () {
        urlOpenerSpy = sinon.spy((..._args: Parameters<typeof open>) => ({
          on(event: string, cb: CallableFunction) {
            if (event === 'error') cb(new Error('error'))
          },
          unref() {},
        } as unknown as childProcess.ChildProcess))
        anyKeySpy = sinon.spy((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
      })

      it('shows a warning', async function () {
        await openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

        expect(urlOpenerSpy.calledOnce).to.be.true
        expect(ansis.strip(stderr())).to.contain('Error: error')
        expect(ansis.strip(stderr())).to.contain('Warning: We can\'t open your default browser.')
        expect(ansis.strip(stderr())).to.contain(url)
      })
    })

    context('when the browser closes with a non-zero exit status', function () {
      beforeEach(function () {
        urlOpenerSpy = sinon.spy((..._args: Parameters<typeof open>) => ({
          on(event: string, cb: CallableFunction) {
            if (event === 'close') cb(1)
          },
          unref() {},
        } as unknown as childProcess.ChildProcess))
        anyKeySpy = sinon.spy((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
      })

      it('shows a warning', async function () {
        await openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

        expect(urlOpenerSpy.calledOnce).to.be.true
        expect(ansis.strip(stderr())).not.to.contain('Error: error')
        expect(ansis.strip(stderr())).to.contain('Warning: We can\'t open your default browser.')
        expect(ansis.strip(stderr())).to.contain(url)
      })
    })

    context('when there\'s a browser error while closing with a non-zero exit status', function () {
      let errorCallback: CallableFunction | undefined

      beforeEach(function () {
        errorCallback = undefined
        urlOpenerSpy = sinon.spy((..._args: Parameters<typeof open>) => ({
          on(event: string, cb: CallableFunction) {
            if (event === 'error') errorCallback = cb
            if (event === 'close') {
              cb(1)
              errorCallback?.(new Error('error'))
            }
          },
          unref() {},
        } as unknown as childProcess.ChildProcess))
        anyKeySpy = sinon.spy((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
      })

      it('shows a warning only once', async function () {
        await openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})

        expect(urlOpenerSpy.calledOnce).to.be.true
        expect(ansis.strip(stderr())).not.to.match(
          /(We can't open your default browser.*We can't open your default browser)/s,
        )
      })
    })
  })

  context('when the user rejects the prompt to open the browser', function () {
    beforeEach(function () {
      urlOpenerSpy = sinon.spy((..._args: Parameters<typeof open>) => ({
        on(_: string, _cb: ErrorCallback) {},
      } as unknown as childProcess.ChildProcess))
      anyKeySpy = sinon.spy((..._args: Parameters<typeof anykey>) => Promise.reject(new Error('quit')))
    })

    it('doesn\'t attempt to open the browser', async function () {
      try {
        await openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy})
      } catch (error: unknown) {
        const {message, oclif} = error as Errors.CLIError
        expect(message).to.equal('quit')
        expect(oclif?.exit).to.equal(1)
      }

      expect(urlOpenerSpy.notCalled).to.equal(true)
    })
  })
})
