require('chai').should();
var date = require('../date');

describe('date', function () {
  it('formats a date', function () {
    var d = new Date('2011-10-10');
    date.formatDate(d).should.equal('2011-10-10T00:00:00.000Z');
  });
});
