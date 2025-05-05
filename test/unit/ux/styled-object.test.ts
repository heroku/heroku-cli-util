import {expect} from 'chai'

import {stdout} from '../../../src/test-helpers/stub-output'
import {styledObject} from '../../../src/ux/styled-object'

import stripAnsi = require('strip-ansi');

describe('styledObject', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar'}
    // Use the actual function to get the output string
    const output = styledObject(obj)
    // Print to stdout so the test helper can capture it
    process.stdout.write(output + '\n')
    const actual = stripAnsi(stdout())
    expect(actual).to.include('foo: bar')
    expect(actual).to.include('baz: 42')
  })
})

