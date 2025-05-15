import {expect} from 'chai'
import {stdout} from 'stdout-stderr'

import {confirm} from '../../../src/ux/confirm'

import stripAnsi = require('strip-ansi')

const mockStdin = require('mock-stdin').stdin

const wait = (ms: number): Promise<void> => new Promise(resolve => {
  setTimeout(resolve, ms)
})

describe('confirm', function () {
  let stdin: ReturnType<typeof mockStdin>

  beforeEach(function () {
    stdin = mockStdin()
  })

  afterEach(function () {
    stdin.restore()
  })

  it('should print the prompt and return true for yes', async function () {
    const confirmPromise = confirm('Are you sure')
    await wait(2000)
    stdin.send('y\n')
    const result = await confirmPromise
    const output = stripAnsi(stdout.output)
    expect(output).to.contain('Are you sure')
    expect(result).to.equal(true)
  })

  it('should print the prompt and return false for no', async function () {
    const confirmPromise = confirm('Are you sure')
    await wait(2000)
    stdin.send('n\n')
    const result = await confirmPromise
    const output = stripAnsi(stdout.output)
    expect(output).to.contain('Are you sure')
    expect(result).to.equal(false)
  })

  it('should use default answer when timed out', async function () {
    const confirmPromise = confirm('Are you sure', {ms: 1000})
    await wait(2000) // Wait longer than the timeout
    const result = await confirmPromise
    const output = stripAnsi(stdout.output)
    expect(output).to.contain('Are you sure')
    expect(result).to.equal(false) // Default answer is false
  })

  it('should use custom default answer when timed out', async function () {
    const confirmPromise = confirm('Are you sure', {defaultAnswer: true, ms: 1000})
    await wait(2000) // Wait longer than the timeout
    const result = await confirmPromise
    const output = stripAnsi(stdout.output)
    expect(output).to.contain('Are you sure')
    expect(result).to.equal(true) // Custom default answer is true
  })
})
