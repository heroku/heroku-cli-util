var console = require('./console');
var columnify = require('columnify');
module.exports = function (data, opts) {
  if (!opts) { opts = {}; }
  if (!opts.showHeaders) { opts.showHeaders = false; }
  console.log(columnify(data, opts));
};
