import {Errors, ux} from '@oclif/core'
import open from 'open'

import {anykey} from './any-key.js'
import * as color from './colors.js'

const defaultDependencies = {
  anykey,
  urlOpener: open,
}

export async function openUrl(
  url: string,
  browser?: string,
  action?: string,
  dependencies: typeof defaultDependencies = defaultDependencies,
): Promise<void> {
  let browserErrorShown = false
  const showBrowserError = (browser?: string) => {
    if (browserErrorShown) return

    ux.warn(
      `We can't open ${browser ?? 'your default'} browser.`
      + ` Use a different browser or visit ${color.cyan(url)}${action ? ` to ${action}` : ''}.`,
    )
    browserErrorShown = true
  }

  ux.stdout(`Opening ${color.cyan(url)} in ${browser ?? 'your default'} browser…`)

  try {
    await dependencies.anykey(
      `Press any key to open up the browser${action ? ` to ${action}` : ''}, or ${color.yellow('q')} to exit`,
    )
  } catch (error) {
    const {message, oclif} = error as Errors.CLIError
    ux.error(message, {exit: oclif?.exit || 1})
  }

  const cp = await dependencies.urlOpener(url, {wait: false, ...(browser ? {app: {name: browser}} : {})})
  cp.on('error', (err: Error) => {
    ux.warn(err)
    showBrowserError(browser)
  })
  cp.on('close', (code: number) => {
    if (code !== 0) showBrowserError(browser)
  })
}
