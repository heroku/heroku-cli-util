import type open from 'open'

import {CLIError} from '@oclif/core/errors'
import {ux} from '@oclif/core/ux'

import {anykey} from './any-key.js'
import * as color from './colors.js'

type Dependencies = {
  anykey: typeof anykey
  urlOpener: typeof open
}

export type OpenUrlOptions = {
  /** What the browser is for, shown in the prompt and the fallback warning (e.g. `'view the documentation'`). */
  action?: string
  /** Browser app to open (e.g. a `--browser` flag value). Defaults to the system browser. */
  browser?: string
  /**
   * Wait for a keypress before opening the browser (default `true`). Pass `false` for commands
   * whose whole job is to open the URL, such as `heroku open`; they then also work without a TTY.
   */
  prompt?: boolean
}

/**
 * Open `url` in a browser. The status line, prompt, and warnings go to stderr.
 * `dependencies` is a test seam for the key prompt and the browser launcher.
 *
 * Resolves to `false` if the browser launcher couldn't be started (after warning with the URL),
 * so commands whose only job is to open it can exit non-zero. Resolves to `true` once the launcher
 * has started; a launcher that later exits non-zero only produces the warning, since the command
 * has usually finished by then.
 */
export async function openUrl(
  url: string,
  {action, browser, prompt = true}: OpenUrlOptions = {},
  dependencies?: Dependencies,
): Promise<boolean> {
  if (!dependencies) {
    const openModule = await import('open')
    dependencies = {
      anykey,
      urlOpener: openModule.default,
    }
  }

  let browserErrorShown = false
  const showBrowserError = (browser?: string) => {
    if (browserErrorShown) return

    ux.warn(`We can't open ${browser ?? 'your default'} browser.`
      + ` Use a different browser or visit ${color.info(url)}${action ? ` to ${action}` : ''}.`)
    browserErrorShown = true
  }

  ux.stderr(`Opening ${color.info(url)} in ${browser ?? 'your default'} browser…`)

  if (prompt) {
    try {
      await dependencies.anykey(`Press any key to open up the browser${action ? ` to ${action}` : ''}, or ${color.warning('q')} to exit`)
    } catch (error) {
      const {message, oclif} = error as CLIError
      ux.error(message, {exit: oclif?.exit || 1})
    }
  }

  let cp: Awaited<ReturnType<typeof open>>
  try {
    // With `wait: false`, `open` rejects if the launcher can't be spawned (e.g. no `xdg-open`).
    cp = await dependencies.urlOpener(url, {wait: false, ...(browser ? {app: {name: browser}} : {})})
  } catch (error) {
    ux.warn(error as Error)
    showBrowserError(browser)
    return false
  }

  // `open` unrefs the launcher, so these fire only if the CLI is still running when it exits.
  cp.on('error', (err: Error) => {
    ux.warn(err)
    showBrowserError(browser)
  })
  cp.on('close', (code: number) => {
    if (code !== 0) showBrowserError(browser)
  })
  return true
}
