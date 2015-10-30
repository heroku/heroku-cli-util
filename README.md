# heroku-cli-util

[![Circle CI](https://circleci.com/gh/heroku/heroku-cli-util/tree/master.svg?style=svg)](https://circleci.com/gh/heroku/heroku-cli-util/tree/master)
[![npm version](https://badge.fury.io/js/heroku-cli-util.svg)](http://badge.fury.io/js/heroku-cli-util)
[![License](https://img.shields.io/npm/l/heroku-cli-util.svg)](./LICENSE)
[![Inline docs](http://inch-ci.org/github/heroku/heroku-cli-util.svg?branch=master)](http://inch-ci.org/github/heroku/heroku-cli-util)

Set of helpful CLI utilities

## Installation

```sh
npm install heroku-cli-util --save
```

## Action

```js
let cli     = require('heroku-cli-util');
let promise = heroku.apps(appname).info();
let app     = yield cli.action('getting apps', promise);
console.log(`app name: ${app.name}`);

// getting apps... done
// app name: appname
```

Note: to use `yield` you need to wrap this in a [co](https://github.com/tj/co) block.

## Prompt

Callback style

```js
let cli = require('heroku-cli-util');
cli.prompt('email', {}, function (_, email) {
  console.log(`your email is: ${email}`);
});
```

Promise style

```js
let cli = require('heroku-cli-util');
cli.prompt('email', {}).then(function (email) {
  console.log(`your email is: ${email}`);
});
```

Generator style (must be wrapped in a [co](https://github.com/tj/co) block)

```js
let cli   = require('heroku-cli-util');
let email = yield cli.prompt('email', {});
console.log(`your email is: ${email}`);
```

**cli.prompt options**

```js
cli.prompt('email', {
  mask: true, // mask input field after submitting
  hide: true // mask characters while entering
});
```

## Confirm App

Supports the same async styles as `prompt()`. Errors if not confirmed.

Basic

```js
let cli = require('heroku-cli-util');
yield cli.confirmApp('appname', context.flags.confirm);

// !     WARNING: Destructive Action
// !     This command will affect the app appname
// !     To proceed, type appname or re-run this command with --confirm appname

> appname
```

Custom message

```js
let cli = require('heroku-cli-util');
yield cli.confirmApp('appname', context.flags.confirm, 'foo');

// !     foo
// !     To proceed, type appname or re-run this command with --confirm appname

> appname
```

## Errors

```js
let cli = require('heroku-cli-util');
cli.error("App not found");
// !    App not found
```

## Warnings

```js
let cli = require('heroku-cli-util');
cli.warn("App not found");
// !    App not found
```

## Dates

```js
let cli = require('heroku-cli-util');
let d   = new Date();
console.log(cli.formatDate(d));
// 2001-01-01T08:00:00.000Z
```

## Hush

Use hush for verbose logging when `HEROKU_DEBUG=1`.

```js
let cli = require('heroku-cli-util');
cli.hush('foo');
// only prints if HEROKU_DEBUG is set
```

## Debug

Pretty print an object.

```js
let cli = require('heroku-cli-util');
cli.debug({foo: [1,2,3]});
// { foo: [ 1, 2, 3 ] }
```

## Stylized output

Pretty print a header and hash
```js
let cli = require('heroku-cli-util');
cli.styledHeader("MyApp");
cli.styledHash({name: "myapp", collaborators: ["user1@example.com", "user2@example.com"]});
```

Produces

```
=== MyApp
Collaborators: user1@example.com
               user1@example.com
Name:          myapp
```

## Table

```js
cli.table([
  {app: 'first-app',  language: 'ruby', dyno_count: 3},
  {app: 'second-app', language: 'node', dyno_count: 2},
], {
  columns: [
    {key: 'app'},
    {key: 'dyno_count', label: 'Dyno Count'},
    {key: 'language', format: language => cli.color.red(language)},
  ]
});
```

Produces:

```
app         Dyno Count  language
──────────  ──────────  ────────
first-app   3           ruby
second-app  2           node
```

## Mocking

Mock stdout and stderr by using `cli.log()` and `cli.error()`.

```js
let cli = require('heroku-cli-util');
cli.log('message 1'); // prints 'message 1'
cli.mockConsole();
cli.log('message 2'); // prints nothing
cli.stdout.should.eq('message 2\n');
```

## Command

Used for initializing a plugin command.
give you an auth'ed instance of `heroku-client` and cleanly handle API exceptions.

It expects you to return a promise chain. This is usually done with [co](https://github.com/tj/co).

```js
let cli = require('heroku-cli-util');
let co  = require('co');
module.exports.commands = [
  {
    topic: 'apps',
    command: 'info',
    needsAuth: true,
    needsApp: true,
    run: cli.command(function (context, heroku) {
      return co(function* () {
        let app = yield heroku.apps(context.app).info();
        console.dir(app);
      });
    })
  }
];
```

With options:

```js
let cli = require('heroku-cli-util');
let co  = require('co');
module.exports.commands = [
  {
    topic: 'apps',
    command: 'info',
    needsAuth: true,
    needsApp: true,
    run: cli.command(
      {preauth: true},
      function (context, heroku) {
        return co(function* () {
          let app = yield heroku.apps(context.app).info();
          console.dir(app);
        });
      }
    )
  }
];
```

If the command has a `two_factor` API error, it will ask the user for a 2fa code and retry.
If you set `preauth: true` it will preauth against the current app instead of just setting the header on an app. (This is necessary if you need to do more than 1 API call that will require 2fa)

## Tests

```sh
npm install
npm test
```

## License

ISC
