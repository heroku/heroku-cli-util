# heroku-cli-util

[![Build Status](https://travis-ci.org/heroku/heroku-cli-util.svg?branch=master)](https://travis-ci.org/heroku/heroku-cli-util)
[![npm version](https://badge.fury.io/js/heroku-cli-util.svg)](http://badge.fury.io/js/heroku-cli-util)
[![License](https://img.shields.io/npm/l/heroku-cli-util.svg)](./LICENSE)

Set of helpful CLI utilities

## Installation

```sh
npm install heroku-cli-util --save
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


## Tests

```sh
npm install
npm test
```

## License

ISC
