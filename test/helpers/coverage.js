'use strict';

if (process.env.COVERAGE) {
  require('blanket')({
    pattern: 'lib'
  });
}
