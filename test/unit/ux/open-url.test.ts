import {captureOutput} from '@heroku-cli/test-utils'
import {Errors} from '@oclif/core'
import ansis from 'ansis'
import childProcess from 'node:child_process'
import open from 'open'
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest'

import {anykey} from '../../../src/ux/any-key.js'
import {openUrl} from '../../../src/ux/open-url.js'

describe('openUrl', function () {
  const {env} = process
  const url = 'https://example.com'
  let urlOpenerSpy: ReturnType<typeof vi.fn>
  let anyKeySpy: ReturnType<typeof vi.fn>

  beforeEach(function () {
    process.env = {}
  })

  afterEach(function () {
    vi.restoreAllMocks()
    process.env = env
  })

  describe('when the user accepts the prompt to open the browser', function () {
    beforeEach(function () {
      urlOpenerSpy = vi.fn((..._args: Parameters<typeof open>) => ({
        on(_: string, _cb: CallableFunction) {},
      } as unknown as childProcess.ChildProcess))
      anyKeySpy = vi.fn((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
    })

    describe('attempting to open the browser', function () {
      describe('without browser or action arguments', function () {
        it('shows the URL that will be opened for in the default browser', async function () {
          const {stdout} = await captureOutput(() =>
            openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

          expect(ansis.strip(stdout)).toContain(`Opening ${url} in your default browser…`)
        })

        it('attempts to open the default browser to the url argument', async function () {
          await captureOutput(() =>
            openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

          expect(urlOpenerSpy).toHaveBeenCalledWith(url, {wait: false})
        })
      })

      describe('with browser argument', function () {
        it('shows the URL that will be opened in the specified browser', async function () {
          const {stdout} = await captureOutput(() =>
            openUrl(url, 'firefox', undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

          expect(ansis.strip(stdout)).toContain(`Opening ${url} in firefox browser…`)
        })

        it('attempts to open the specified browser to the url argument', async function () {
          await captureOutput(() =>
            openUrl(url, 'firefox', undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

          expect(urlOpenerSpy).toHaveBeenCalledWith(url, {app: {name: 'firefox'}, wait: false})
        })
      })

      describe('with action argument', function () {
        it('shows the action to be performed', async function () {
          await captureOutput(() =>
            openUrl(url, undefined, 'view something', {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

          expect(anyKeySpy).toHaveBeenCalledWith(expect.stringMatching(/to view something/))
        })
      })
    })

    describe('when there\'s an error opening the browser', function () {
      beforeEach(function () {
        urlOpenerSpy = vi.fn((..._args: Parameters<typeof open>) => ({
          on(event: string, cb: CallableFunction) {
            if (event === 'error') cb(new Error('error'))
          },
          unref() {},
        } as unknown as childProcess.ChildProcess))
        anyKeySpy = vi.fn((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
      })

      it('shows a warning', async function () {
        const {stderr} = await captureOutput(() =>
          openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

        expect(urlOpenerSpy).toHaveBeenCalledTimes(1)
        expect(ansis.strip(stderr)).toContain('Error: error')
        expect(ansis.strip(stderr)).toContain('Warning: We can\'t open your default browser.')
        expect(ansis.strip(stderr)).toContain(url)
      })
    })

    describe('when the browser closes with a non-zero exit status', function () {
      beforeEach(function () {
        urlOpenerSpy = vi.fn((..._args: Parameters<typeof open>) => ({
          on(event: string, cb: CallableFunction) {
            if (event === 'close') cb(1)
          },
          unref() {},
        } as unknown as childProcess.ChildProcess))
        anyKeySpy = vi.fn((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
      })

      it('shows a warning', async function () {
        const {stderr} = await captureOutput(() =>
          openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

        expect(urlOpenerSpy).toHaveBeenCalledTimes(1)
        expect(ansis.strip(stderr)).not.toContain('Error: error')
        expect(ansis.strip(stderr)).toContain('Warning: We can\'t open your default browser.')
        expect(ansis.strip(stderr)).toContain(url)
      })
    })

    describe('when there\'s a browser error while closing with a non-zero exit status', function () {
      let errorCallback: CallableFunction | undefined

      beforeEach(function () {
        errorCallback = undefined
        urlOpenerSpy = vi.fn((..._args: Parameters<typeof open>) => ({
          on(event: string, cb: CallableFunction) {
            if (event === 'error') errorCallback = cb
            if (event === 'close') {
              cb(1)
              errorCallback?.(new Error('error'))
            }
          },
          unref() {},
        } as unknown as childProcess.ChildProcess))
        anyKeySpy = vi.fn((..._args: Parameters<typeof anykey>) => Promise.resolve('\n'))
      })

      it('shows a warning only once', async function () {
        const {stderr} = await captureOutput(() =>
          openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))

        expect(urlOpenerSpy).toHaveBeenCalledTimes(1)
        expect(ansis.strip(stderr)).not.toMatch(/(We can't open your default browser.*We can't open your default browser)/s)
      })
    })
  })

  describe('when the user rejects the prompt to open the browser', function () {
    beforeEach(function () {
      urlOpenerSpy = vi.fn((..._args: Parameters<typeof open>) => ({
        on(_: string, _cb: CallableFunction) {},
      } as unknown as childProcess.ChildProcess))
      anyKeySpy = vi.fn((..._args: Parameters<typeof anykey>) => Promise.reject(new Error('quit')))
    })

    it('doesn\'t attempt to open the browser', async function () {
      try {
        await captureOutput(() =>
          openUrl(url, undefined, undefined, {anykey: anyKeySpy, urlOpener: urlOpenerSpy}))
      } catch (error: unknown) {
        const {message, oclif} = error as Errors.CLIError
        expect(message).toBe('quit')
        expect(oclif?.exit).toBe(1)
      }

      expect(urlOpenerSpy).not.toHaveBeenCalled()
    })
  })
})
