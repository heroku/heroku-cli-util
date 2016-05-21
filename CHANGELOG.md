6.0.10 / 2016-05-20
===================

  * 6.0.10
  * better method of detecting when to clear
  * skip clearing if not enabled

6.0.9 / 2016-05-20
==================

  * 6.0.9
  * return promises for cli.command

6.0.8 / 2016-05-20
==================

  * 6.0.8
  * clean up prompt rendering
  * do not require function to return a promise
  * show error message when a promise is not returned

6.0.7 / 2016-05-20
==================

  * 6.0.7
  * build fix
  * mock logging when not tty

6.0.6 / 2016-05-20
==================

  * 6.0.6
  * added ansi-escapes

6.0.5 / 2016-05-20
==================

  * 6.0.5
  * fixpack
  * update node to 6.2.0

6.0.4 / 2016-05-20
==================

  * 6.0.4
  * minor bug fix with small screens
  * clean up spinner output
  * take out co
  * use ansi escapes to render spinner more cleanly

6.0.3 / 2016-05-20
==================

  * 6.0.3
  * update heroku-client

6.0.2 / 2016-05-20
==================

  * 6.0.2
  * updated deps
  * standardify

6.0.1 / 2016-05-19
==================

  * 6.0.1
  * optimize requires
  * updated heroku-client
  * changelog

6.0.0 / 2016-05-19
==================

  * 6.0.0
  * updated heroku-client
  * optimize lodash requires
  * loosely define dependencies
  * updated deps

5.10.12 / 2016-05-18
====================

  * 5.10.12
  * added ability to update action message

5.10.11 / 2016-05-16
====================

  * 5.10.11
  * Add exit.js extracted from heroku-certs ([#65](https://github.com/heroku/heroku-cli-util/issues/65))
  * do log path lookup in node
  * use cli.action.warn always
  * action.warn improvements
  * testing action
  * linewrap testing
  * ignore coverage directory
  * fix exclusion

5.10.10 / 2016-04-21
====================

  * 5.10.10
  * added cmd style
  * fix build
  * ignore linewrap from codeclimate since we did not write it
  * added yubikey test
  * badging
  * readme formatting
  * fix npm test command
  * remove unused dev dependencies
  * mocha updates
  * update node to 5.10.1
  * code climate
  * update deps
  * update license

5.10.9 / 2016-04-20
===================

  * 5.10.9
  * added release color
  * update badges

5.10.8 / 2016-04-20
===================

  * 5.10.8
  * fix tests
  * update colors
    added configVar color
    changed colors around so app won't conflict with addon
  * Revert "make changelog its own npm command"
    This reverts commit 503ee73ad266ea8bec37c0967a326e7057b0fa14.
  * make changelog its own npm command
  * fixed changelog

5.10.7 / 2016-04-18
===================

  * 5.10.7
  * added heroku and app colors ([#61](https://github.com/heroku/heroku-cli-util/issues/61))
  * fixpack
  * added changelog
  * added cli.action.warn
  * read x-heroku-warning header
  * do not error on rollbar connection error
  * spinner updates
    * force line spinner on windows
    * added hexagon spinner

5.10.6 / 2016-04-13
===================

  * 5.10.6
  * fix newlines when spinner is disabled

5.10.5 / 2016-04-13
===================

  * 5.10.5
  * fix spinner with narrow screens ([#60](https://github.com/heroku/heroku-cli-util/issues/60))
    fixes https://github.com/heroku/heroku/issues/1931

5.10.4 / 2016-04-13
===================

  * 5.10.4
  * strip color when logging ([#57](https://github.com/heroku/heroku-cli-util/issues/57))
  * fix test output with spinner under tests ([#59](https://github.com/heroku/heroku-cli-util/issues/59))
    * fix test output with spinner under tests
    * added code coverage
    * added spinner test
    * remove docs badge
    * added test for cli.action

5.10.3 / 2016-04-08
===================

  * 5.10.3
  * updated deps

5.10.2 / 2016-04-08
===================

  * 5.10.2
  * fix spinner with no color supported

5.10.1 / 2016-04-07
===================

  * 5.10.1
  * fix spinner on windows

5.10.0 / 2016-04-07
===================

  * 5.10.0
  * spinner updates
  * Fixing test mocking to fix circleci build
  * added spinner
  * Switch back to tunnel-agent from tunnel
  * Merge pull request [#49](https://github.com/heroku/heroku-cli-util/issues/49) from heroku/fix-wrapping-with-command-examples
    fix wrapping with command examples
  * Merge pull request [#56](https://github.com/heroku/heroku-cli-util/issues/56) from heroku/ssl-cert-dir-and-file
    Add SSL_CERT_DIR & SSL_CERT_FILE to trusted certs
  * Cleaning up code with ternary + arrow function
  * Add SSL_CERT_DIR & SSL_CERT_FILE to trusted certs
  * 5.9.3
  * updated deps
  * use jq theme

5.9.3 / 2016-03-31
==================

  * update deps
  * update node on circle
  * 5.9.2
  * export linewrap

5.9.2 / 2016-03-30
==================

  * export linewrap
  * 5.9.1
  * Merge branch 'fix-table-width'
  * fix table widths
    if the label is longer than any of the cell data this doesn't calculate
    the label correctly

5.9.1 / 2016-03-22
==================

  * only use co generators
  * updated action example
  * 5.9.0

5.9.0 / 2016-03-21
==================

  * Merge pull request [#55](https://github.com/heroku/heroku-cli-util/issues/55) from heroku/proxy-fixes
    Pass through auth & add HTTP_PROXY as fallback
  * Pass through auth & add HTTP_PROXY as fallback
  * added got to readme
  * Merge pull request [#54](https://github.com/heroku/heroku-cli-util/issues/54) from heroku/got-proxy
    Add got wrapper class to properly use proxies
  * Fix snake case to camel case
  * Fixing package.json dependencies
  * Add got wrapper class to properly use proxies
  * 5.8.4

5.8.4 / 2016-03-21
==================

  * Merge pull request [#53](https://github.com/heroku/heroku-cli-util/issues/53) from heroku/styled-json
    added styledJSON
  * added styledJSON to README
  * fixed tests
  * added styledJSON
  * Merge pull request [#52](https://github.com/heroku/heroku-cli-util/issues/52) from heroku/testing-tweaks
    strip color when mocking
  * strip color when mocking
  * ignore test directory from npm
