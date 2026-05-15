import {initCliTest} from '@heroku-cli/test-utils'
import nock from 'nock'
import {beforeAll, beforeEach} from 'vitest'

beforeAll(() => {
  nock.disableNetConnect()
})

beforeEach(() => {
  initCliTest()
})
