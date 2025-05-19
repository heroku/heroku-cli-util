import {expectOutput, stderr} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {confirm} from '../../../src/ux/confirm'

import stripAnsi = require('strip-ansi')

describe('confirm', function () {
  let stdinStub: sinon.SinonStub

  beforeEach(function () {
    stdinStub = sinon.stub(process.stdin, 'once')
  })

  afterEach(function () {
    stdinStub.restore()
  })

  it('should print the prompt and return true for yes', async function () {
    stdinStub.callsFake((event, cb) => {
      if (event === 'data') cb('y\n')
      return process.stdin
    })
    const result = await confirm('Are you sure')
    const output = stripAnsi(stderr())
    expectOutput(output, 'Are you sure:')
    expect(result).to.equal(true)
  })

  it('should print the prompt and return false for no', async function () {
    stdinStub.callsFake((event, cb) => {
      if (event === 'data') cb('n\n')
      return process.stdin
    })
    const result = await confirm('Are you sure')
    const output = stripAnsi(stderr())
    expectOutput(output, 'Are you sure:')
    expect(result).to.equal(false)
  })
})
