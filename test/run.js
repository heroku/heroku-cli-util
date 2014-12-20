require('chai').should();
var run = require('../run');
var console = require('../console');
var process = require('../process');

describe('run', function () {
  beforeEach(function () {
    console.mock();
    process.mock();
  });

  it('works with no commands', function () {
    run();
    console.stderr.should.contain('No commands found');
  });

  it('runs a command', function () {
    var cmdRan;
    var cmd = {
      topic: 'foo',
      command: 'bar',
      run: function () { cmdRan = true; }
    };
    run([cmd], ['foo:bar']);
    cmdRan.should.equal(true);
  });

  it('gets an app via env var', function () {
    process.env.HEROKU_APP = 'myappname';
    var appName;
    var cmd = {
      topic: 'foo',
      command: 'bar',
      needsApp: true,
      run: function (context) {
        appName = context.app;
      }
    };
    run([cmd], ['foo:bar']);
    appName.should.equal('myappname');
  });
});
