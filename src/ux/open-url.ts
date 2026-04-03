import type open from 'open'

import {CLIError} from '@oclif/core/errors'
import {ux} from '@oclif/core/ux'

import {anykey} from './any-key.js'
import * as color from './colors.js'

type Dependencies = {
  anykey: typeof anykey
  urlOpener: typeof open
}

export async function openUrl(
  url: string,
  browser?: string,
  action?: string,
  dependencies?: Dependencies,
): Promise<void> {
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

  ux.stdout(`Opening ${color.info(url)} in ${browser ?? 'your default'} browser…`)

  try {
    await dependencies.anykey(`Press any key to open up the browser${action ? ` to ${action}` : ''}, or ${color.warning('q')} to exit`)
  } catch (error) {
    const {message, oclif} = error as CLIError
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
