'use strict';

let cli        = require('..');
let inflection = require('inflection');

function logKeyValue(key, value, maxKeyLength) {
  cli.log(inflection.titleize(key)+':'+' '.repeat(maxKeyLength - key.length-1)+value);
}

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
 * styledHash logs a hash in a consistent columnar style
 *
 * @example
 * styledHash({name: "myapp", collaborators: ["user1@example.com", "user2@example.com"]})
 * Collaborators: user1@example.com
 *                user2@example.com
 * Name:          myapp
 *
 * @param {hash} hash of data to print
 * @param {keys} optional array of keys to sort/filter output
 * @returns {null}
 */
function styledHash(hash, keys) {
  let keyLengths = Object.keys(hash).map(function(key) {
    return key.toString().length;
  });
  let maxKeyLength = Math.max.apply(Math, keyLengths) + 2;
  keys = keys || Object.keys(hash).sort();
  for (var key_index in keys) {
    if (keys.hasOwnProperty(key_index)) {
      let value = hash[keys[key_index]];
      if(typeof value === 'object') {
        if(value.length > 0) {
          let elements = value.sort();
          logKeyValue(keys[key_index], elements[0], maxKeyLength);
          for (var i = 1; i < elements.length; i++) {
            cli.log(" ".repeat(maxKeyLength) + elements[i]);
          }
        }
      } else if (value !== null && value !== undefined) {
        logKeyValue(keys[key_index], value, maxKeyLength);
      }
    }
  }
}

module.exports.styledHeader = styledHeader;
module.exports.styledHash   = styledHash;
