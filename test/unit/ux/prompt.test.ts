import { expect } from 'chai';
import * as sinon from 'sinon';
import stripAnsi = require('strip-ansi');
import { prompt } from '../../../src/ux/prompt';
import { stderr } from '../../../src/test-helpers/stub-output';

describe('prompt', () => {
  let stdinStub: sinon.SinonStub;

  beforeEach(() => {
    stdinStub = sinon.stub(process.stdin, 'once');
  });

  afterEach(() => {
    stdinStub.restore();
  });

  it('should print the prompt and return the entered value', async () => {
    stdinStub.callsFake((event, cb) => {
      if (event === 'data') cb('test-value\n');
      return process.stdin;
    });
    const result = await prompt('Enter something:');
    const output = stripAnsi(stderr());
    expect(output).to.include('Enter something:');
    expect(result).to.equal('test-value');
  });
}); 
