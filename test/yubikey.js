'use strict'
/* globals describe it beforeEach sinon afterEach */

describe('yubikey', () => {
  let mock, yubikey
  beforeEach(() => {
    mock = sinon.mock(require('child_process'))
    yubikey = require('../lib/yubikey')
    yubikey.platform = 'darwin'
  })
  afterEach(() => {
    mock.verify()
    mock.restore()
  })

  it('turns yubikey on', () => {
    mock.expects('execSync').withExactArgs('osascript -e \'if application "yubiswitch" is running then tell application "yubiswitch" to KeyOn\'', { stdio: 'inherit' }).once()
    yubikey.enable()
  })

  it('turns yubikey off', () => {
    mock.expects('execSync').withExactArgs('osascript -e \'if application "yubiswitch" is running then tell application "yubiswitch" to KeyOff\'', { stdio: 'inherit' }).once()
    yubikey.disable()
  })
})
