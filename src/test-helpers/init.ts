const path = require('node:path')
const {color} = require('@heroku-cli/color')
const nock = require('nock')

export function initCliTest(): void {
  // eslint-disable-next-line no-multi-assign
  process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).columns = '120'
  color.enabled = false
  nock.disableNetConnect()
  if (process.env.ENABLE_NET_CONNECT === 'true') {
    nock.enableNetConnect()
  }
}
