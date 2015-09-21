'use strict';

let execSync = require('child_process').execSync;

function enable () {
  execSync(`osascript -e 'if application "yubiswitch" is running then tell application "yubiswitch" to KeyOn'`, {stdio: 'inherit'});
}

function disable () {
  execSync(`osascript -e 'if application "yubiswitch" is running then tell application "yubiswitch" to KeyOff'`, {stdio: 'inherit'});
}

module.exports = {
  enable,
  disable,
};
