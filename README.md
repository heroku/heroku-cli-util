# heroku-cli-util

[![Build Status](https://travis-ci.org/heroku/heroku-cli-util.svg?branch=master)](https://travis-ci.org/heroku/heroku-cli-util)
[![npm version](https://badge.fury.io/js/heroku-cli-util.svg)](http://badge.fury.io/js/heroku-cli-util)

Set of helpful CLI utilities

## Installation

```sh
npm install heroku-cli-util --save
```

## Dates

```js
var h = require('heroku-cli-util');
var d = new Date();
console.log(h.formatDate(d)); // 2001-01-01T08:00:00.000Z
```


## Tests

```sh
npm install
npm test
```

## License

ISC
