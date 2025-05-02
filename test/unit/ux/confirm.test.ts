import { expect } from 'chai'
import * as sinon from 'sinon'
import stripAnsi = require('strip-ansi')
import { confirm } from '../../../src/ux/confirm'
import { stderr } from '../../../src/test-helpers/stub-output'

describe('confirm', () => {
  let stdinStub: sinon.SinonStub

  beforeEach(() => {
    stdinStub = sinon.stub(process.stdin, 'once')
  });

  afterEach(() => {
    stdinStub.restore()
  });

  it('should print the prompt and return true for yes', async () => {
    stdinStub.callsFake((event, cb) => {
      if (event === 'data') cb('y\n')
      return process.stdin;
    });
    const result = await confirm('Are you sure?')
    const output = stripAnsi(stderr())
    expect(output).to.include('Are you sure?')
    expect(result).to.equal(true)
  });

  it('should print the prompt and return false for no', async () => {
    stdinStub.callsFake((event, cb) => {
      if (event === 'data') cb('n\n')
      return process.stdin;
    });
    const result = await confirm('Are you sure?')
    const output = stripAnsi(stderr())
    expect(output).to.include('Are you sure?')
    expect(result).to.equal(false)
  })
})
