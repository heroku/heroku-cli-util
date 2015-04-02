var output = require('./output');

exports.run = require('./run');
exports.log = console.log;
exports.formatDate = require('./date').formatDate;
exports.error = output.error;
exports.warn = output.warn;
