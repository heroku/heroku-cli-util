'use strict';

let cli   = require('..');

String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.ljust = function( width, padding ) {
	padding = padding || " ";
	padding = padding.substr( 0, 1 );
	if( this.length < width )
		return this + padding.repeat( width - this.length );
	else
		return this;
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Object.prototype.keys = function ()
{
  var keys = [];
  for(var i in this) if (this.hasOwnProperty(i))
  {
    keys.push(i);
  }
  return keys;
};

/**
 * styled_header logs in a consistent header style
 *
 * @example
 * styled_header('MyApp') # Outputs === MyApp
 *
 * @param {header} header text
 * @returns {null}
 */
function styledHeader(header) {
  cli.log(`=== ${header}`);
}

/**
 * styled_hash logs a hash in a consistent columnar style
 *
 * @example
 * styled_hash({name: "myapp", collaborators: ["user1@example.com", "user2@example.com"]})
 * Collaborators: user1@example.com
 *                user1@example.com
 * Name:          myapp
 *
 * @param {hash} hash of data to print
 * @param {keys} optional array of keys to sort/filter output
 * @returns {null}
 */
function styledHash(hash, keys) {
  let max_key_length = hash.keys().map(function(key) {
    return key.toString().length;
  }).max() + 2;
  keys = keys || hash.keys().sort();
  for (var key_index in keys) {
    if (keys.hasOwnProperty(key_index)) {
      let value = hash[keys[key_index]];
      if(typeof value === 'object') {
        if(value.length > 0) {
          let elements = value.sort();
          cli.log(`${keys[key_index].toTitleCase()}: `.ljust(max_key_length) + elements[0]);
          for (var i = 1; i < elements.length; i++) {
            cli.log(" ".repeat(max_key_length) + elements[i]);
          }
        }
      } else if (value !== null && value !== undefined) {
        cli.log(`${keys[key_index].toTitleCase()}: `.ljust(max_key_length) + value);
      }
    }
  }
}

module.exports.styledHeader = styledHeader;
module.exports.styledHash   = styledHash;
