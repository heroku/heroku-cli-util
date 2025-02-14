'use strict'

exports.color = require('@heroku-cli/color').default

const console = require('./lib/console')
const errors = require('./lib/errors')
const prompt = require('./lib/prompt')
const styled = require('./lib/styled')

exports.hush = console.hush
exports.log = console.log.bind(console)
exports.formatDate = require('./lib/date').formatDate
exports.error = errors.error
exports.action = require('./lib/action')
exports.warn = exports.action.warn
exports.errorHandler = errors.errorHandler
exports.console = console
exports.yubikey = require('./lib/yubikey')
exports.prompt = prompt.prompt
exports.confirmApp = prompt.confirmApp
exports.preauth = require('./lib/preauth')
exports.command = require('./lib/command')
exports.debug = console.debug
exports.mockConsole = console.mock
exports.table = require('./lib/table')
exports.stdout = ''
exports.stderr = ''
exports.styledHeader = styled.styledHeader
exports.styledObject = styled.styledObject
exports.styledHash = styled.styledObject
exports.styledNameValues = styled.styledNameValues
exports.styledJSON = styled.styledJSON
exports.open = require('./lib/open')
exports.got = require('./lib/got')
exports.linewrap = require('./lib/linewrap')
exports.Spinner = require('./lib/spinner')
exports.exit = require('./lib/exit').exit
exports.auth = require('./lib/auth')
exports.login = exports.auth.login
exports.logout = exports.auth.logout
