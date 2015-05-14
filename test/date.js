'use strict';
describe('date', function () {
  it('formats a date', function () {
    var d = new Date('2011-10-10');
    cli.formatDate(d).should.equal('2011-10-10T00:00:00.000Z');
  });
});
