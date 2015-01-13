var util = require('util');
var console = require('./console');
var process = require('./process');

function usage (commands) {
  console.error('USAGE: heroku COMMAND [--app APP] [command-specific-options]\n');
  if (!commands || commands.length === 0) {
    console.error('No commands found');
  } else {
    console.error('Commands:\n');
    commands.forEach(function (command) {
      console.error(util.format('  heroku %s:%s # %s', command.topic, command.command, command.shortHelp));
    });
  }
}

function findCmd (commands, cmd) {
  if (!cmd) { return null; }
  var c = cmd.split(':');
  return commands.filter(function (command) {
    return command.topic === c[0] && command.command === c[1];
  })[0];
}

function parseArgs (cmd, args) {
  var argTemplates = cmd.args ? cmd.args.slice(0) : [];
  var parsed = {};
  for (var i=0; i<args.length; i++) {
    if (args[i][0] === '-') {
      if (args[i] === '-a' || args[i] === '--app') {
        if (!cmd.needsApp) {
          console.error('Invalid argument. No app is needed');
          return process.exit(1);
        }
        parsed.app = args[i+1];
      } else {
        console.error('TODO: parse flags');
        return process.exit(1);
      }
      i++;
    } else {
      var current = argTemplates.shift();
      if (!current) {
        console.error('Too many arguments');
        return process.exit(1);
      }
      parsed[current.name] = args[i];
    }
  }
  argTemplates.forEach(function (arg) {
    if (!arg.optional) {
      console.error('Missing argument:', arg.name);
      return process.exit(1);
    }
  });
  return parsed;
}


module.exports = function run (commands, args) {
  var argName = args && args.length > 0 ? args[0] : '';
  var netrc = require('netrc')()['api.heroku.com'];
  var cmd = findCmd(commands, argName);
  if (!cmd) { usage(commands); return process.exit(1); }

  var options = {
    args: parseArgs(cmd, args.slice(1))
  };

  if (cmd.needsAuth) {
    if (!netrc) {
      console.log(' !    Not logged in');
      return process.exit(1);
    }
    options.auth = { username: netrc.login, password: netrc.password };
  }

  if (cmd.needsApp) {
    if (process.env.HEROKU_APP) {
      options.app = process.env.HEROKU_APP;
    }
    if (options.args.app) {
      options.app = options.args.app;
    }
    if (!options.app) {
      console.error(' !    No app specified.');
      console.error(' !    Run this command from an app folder or specify which app to use with --app APP');
      return process.exit(1);
    }
  }

  cmd.run(options);
};
