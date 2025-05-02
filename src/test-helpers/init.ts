const path = require('path')
// @ts-ignore: No type declarations for '@heroku-cli/color'
const { color } = require('@heroku-cli/color')
const nock = require('nock')

export function initCliTest(): void {
  process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
  (global as any).columns = '120'
  color.enabled = false
  nock.disableNetConnect()
  if (process.env.ENABLE_NET_CONNECT === 'true') {
    nock.enableNetConnect()
  }
} 
