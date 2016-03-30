'use strict';

let expect = require('chai').expect;

describe('linewrap', function () {
  it('indents and wraps text', function () {
    let output = cli.linewrap(2, 10)('this text is longer than 10 characters');
    expect(output).to.eq(`  this
  text is
  longer
  than 10
  characters`);
  });
});
