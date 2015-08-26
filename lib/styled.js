'use strict';

let cli        = require('..');
let inflection = require('inflection');

/**
 * styledHeader logs in a consistent header style
 *
 * @example
 * styledHeader('MyApp') # Outputs === MyApp
 *
 * @param {header} header text
 * @returns {null}
 */
function styledHeader(header) {
  cli.log(`=== ${header}`);
}

/**
 * styledObject logs an object in a consistent columnar style
 *
 * @example
 * styledObject({name: "myapp", collaborators: ["user1@example.com", "user2@example.com"]})
 * Collaborators: user1@example.com
 *                user2@example.com
 * Name:          myapp
 *
 * @param {obj} object data to print
 * @param {keys} optional array of keys to sort/filter output
 * @returns {null}
 */
function styledObject(obj, keys) {
  let keyLengths = Object.keys(obj).map(function(key) { return key.toString().length; });
  let maxKeyLength = Math.max.apply(Math, keyLengths) + 2;
  function logKeyValue(key, value) {
    cli.log(inflection.titleize(key)+':'+' '.repeat(maxKeyLength - key.length-1)+value);
  }
  for (var key of (keys || Object.keys(obj).sort())) {
    let value = obj[key];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        logKeyValue(key, value[0]);
        for (var e of value.slice(1)) {
          cli.log(" ".repeat(maxKeyLength) + e);
        }
      }
    } else if (value !== null && value !== undefined) {
      logKeyValue(key, value);
    }
  }
}

module.exports.styledHeader = styledHeader;
module.exports.styledObject = styledObject;
