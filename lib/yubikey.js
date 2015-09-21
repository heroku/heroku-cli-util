'use strict';

let execSync = require('child_process').execSync;

function enable () {
  if (process.platform !== 'darwin') return;
  try {
    execSync(`osascript -e 'if application "yubiswitch" is running then tell application "yubiswitch" to KeyOn'`, {stdio: 'inherit'});
  } catch (err) { }
}

function disable () {
  if (process.platform !== 'darwin') return;
  try {
    execSync(`osascript -e 'if application "yubiswitch" is running then tell application "yubiswitch" to KeyOff'`, {stdio: 'inherit'});
  } catch (err) { }
}

module.exports = {
  enable,
  disable,
};
