# heroku-cli-util

[![Build Status](https://travis-ci.org/heroku/heroku-cli-util.svg?branch=master)](https://travis-ci.org/heroku/heroku-cli-util)
[![npm version](https://badge.fury.io/js/heroku-cli-util.svg)](http://badge.fury.io/js/heroku-cli-util)
[![License](https://img.shields.io/npm/l/heroku-cli-util.svg)](./LICENSE)

Set of helpful CLI utilities

## Installation

```sh
npm install heroku-cli-util --save
```

## Prompt

```js
var h = require('heroku-cli-util');
h.prompt('email', function (email) {
  console.log(`your email is: ${email}`);
});
```

## Errors (display in red)

```js
var h = require('heroku-cli-util');
h.error("App not found");
// !    App not found
```

## Warnings (display in yellow)

```js
var h = require('heroku-cli-util');
h.warn("App not found");
// !    App not found
```

## Tables/Columns

```js
var h = require('heroku-cli-util');
h.columnify({
  'Dynos':  1,
  'Region': 'us',
  'Stack':  'cedar-14'
});
// Dynos  1
// Region us
// Stack  cedar-14
```

## Dates

```js
var h = require('heroku-cli-util');
var d = new Date();
console.log(h.formatDate(d));
// 2001-01-01T08:00:00.000Z
```

## Command

Used for initializing a plugin command.
It will set the `cwd` to the user's current location,
give you an auth'ed instance of `heroku-client`,
and cleanly handle API exceptions.

It uses `co` so you can `yield` promises.

```js
let h = require('heroku-cli-util');
module.exports.commands = [
  {
    topic: 'apps',
    command: 'info',
    needsAuth: true,
    needsApp: true,
    run: h.command(function* (context, heroku) {
      let app = yield heroku.apps(context.app).info();
      console.dir(app);
    })
  }
];
```

## Preauth

```js
var h = require('heroku-cli-util');
h.preauth("APPNAME", "APITOKEN", function (err) {
  console.log('preauthed');
});
```


## Tests

```sh
npm install
npm test
```

## License

ISC
