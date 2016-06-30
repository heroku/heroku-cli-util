'use strict'

const util = require('./util')
const heroku = require('./heroku')

/**
 * preauth will make an API call to preauth a user for an app
 * this makes it so the user will not have to enter a 2fa code
 * for the next few minutes on the specified app.
 *
 * You need this if your command is going to make multiple API calls
 * since otherwise the secondFactor key would only work one time for
 * yubikeys.
 *
 * @param {String} app the app to preauth against
 * @param {String} secondFactor a second factor code
 * @return {Promise} A promise fulfilled when the preauth is complete
 */
function preauth (app, secondFactor) {
  return heroku.put(`/apps/${app}/pre-authorizations`, {
    headers: { 'Heroku-Two-Factor-Code': secondFactor }
  })
}

module.exports = util.promiseOrCallback(preauth)
