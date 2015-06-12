'use strict';

let expect = require('chai').expect;

describe('date', function () {
  it('formats a date', function () {
    var d = new Date('2011-10-10');
    expect(cli.formatDate(d)).to.equal('2011-10-10T00:00:00.000Z');
  });
});
