'use strict';

/**
 * formatDate will format a date in a standard Heroku format
 *
 * @param {Date} date the date to format
 * @return {String} string representing the date
 */
function formatDate (date) {
  return date.toISOString();
}

exports.formatDate = formatDate;
