import {stdout} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {expect} from 'chai'
import {stdin as mockStdin} from 'mock-stdin'

import {prompt} from '../../../src/ux/prompt.js'

describe('prompt', function () {
  let stdin: ReturnType<typeof mockStdin>

  beforeEach(function () {
    stdin = mockStdin()
  })

  afterEach(function () {
    stdin.restore()
  })

  it('should print the prompt and return the entered value', async function () {
    setTimeout(() => {
      stdin.send('test-value\n')
    }, 10)
    const result = await prompt('Enter something')
    const output = ansis.strip(stdout())
    expect(output).to.include('Enter something')
    expect(result).to.equal('test-value')
  })
})
