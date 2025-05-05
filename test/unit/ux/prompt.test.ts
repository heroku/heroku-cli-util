import {expect} from 'chai'
import * as sinon from 'sinon'

import {stderr} from '../../../src/test-helpers/stub-output'
import {prompt} from '../../../src/ux/prompt'

import stripAnsi = require('strip-ansi');

describe('prompt', function () {
  let stdinStub: sinon.SinonStub

  beforeEach(function () {
    stdinStub = sinon.stub(process.stdin, 'once')
  })

  afterEach(function () {
    stdinStub.restore()
  })

  it('should print the prompt and return the entered value', async function () {
    stdinStub.callsFake((event, cb) => {
      if (event === 'data') cb('test-value\n')
      return process.stdin
    })
    const result = await prompt('Enter something:')
    const output = stripAnsi(stderr())
    expect(output).to.include('Enter something:')
    expect(result).to.equal('test-value')
  })
})
