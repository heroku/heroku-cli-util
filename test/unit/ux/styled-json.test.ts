import { expect } from 'chai';
import stripAnsi = require('strip-ansi');
import styledJson from '@oclif/core/lib/cli-ux/styled/json.js';
import { stdout } from '../../../src/test-helpers/stub-output';

describe('styledObject', () => {
  it('should print the correct styled object output', () => {
    const obj = { foo: 'bar', baz: 42 };
    // Use the actual function to get the output string
    const output = styledJson(obj);
    // Print to stdout so the test helper can capture it
    process.stdout.write(output + '\n');
    const actual = stripAnsi(stdout());
    expect(actual).to.include('"foo": "bar"');
    expect(actual).to.include('"baz": 42');
  });
}); 
