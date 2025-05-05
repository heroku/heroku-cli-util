import { expect } from 'chai';
import stripAnsi = require('strip-ansi');
import { styledHeader } from '../../../src/ux/styled-header';
import { stdout } from '../../../src/test-helpers/stub-output';

describe('styledHeader', () => {
  it('should print the correct styled header output', () => {
    const header = 'My Test Header';
    styledHeader(header);
    const actual = stripAnsi(stdout());
    expect(actual).to.match(/^=== My Test Header/);
    expect(actual).to.match(/\n\n$/);
  });
}); 
