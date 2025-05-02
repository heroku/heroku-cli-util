import { expect } from 'chai';
import { table } from '../../../src/ux/table'
import stripAnsi = require('strip-ansi')
import { stdout } from '../../../src/test-helpers/stub-output'

describe('table', () => {
  it('should print the correct table output', () => {
    const data = [
      { foo: 'bar', baz: 42 },
      { foo: 'qux', baz: 7 }
    ];
    const columns = { foo: { header: 'Foo' }, baz: { header: 'Baz' } }
    table(data, columns)
    const expected =
      ' Foo Baz \n' +
      ' ─── ─── \n' +
      ' bar 42  \n' +
      ' qux 7   \n'
    // Remove ANSI color codes and normalize whitespace for comparison
    const actual = stripAnsi(stdout())
    expect(actual).to.include(stripAnsi(expected))
  })
})
