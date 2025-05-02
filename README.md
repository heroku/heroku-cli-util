# @heroku/heroku-cli-util

A set of helpful CLI utilities for Heroku and oclif-based Node.js CLIs. This
package provides convenient wrappers and helpers for user interaction, output
formatting, and test utilities.

## Features

- **User prompts and confirmations** (yes/no, input)
- **Styled output** (headers, JSON, objects, tables)
- **Wait indicators** for async operations
- **Test helpers** for CLI output and environment setup

## Installation

```bash
npm install @heroku/heroku-cli-util
```

## Usage

You can import the utilities you need.

### Output Utilities

```js
// Styled header
import { styledHeader } from '@heroku/heroku-cli-util/dist/ux/styled-header';
styledHeader('My CLI Header');

// Styled JSON
import { styledJSON } from '@heroku/heroku-cli-util/dist/ux/styled-json';
styledJSON({ foo: 'bar' });

// Styled object
import { styledObject } from '@heroku/heroku-cli-util/dist/ux/styled-object';
styledObject({ foo: 'bar' });

// Table
import { table } from '@heroku/heroku-cli-util/dist/ux/table';
table([{ name: 'Alice' }, { name: 'Bob' }], { columns: [{ key: 'name' }] });

// Wait
import { wait } from '@heroku/heroku-cli-util/dist/ux/wait';
await wait('Processing...');
```

### User Interaction

```js
import { prompt } from '@heroku/heroku-cli-util/dist/ux/prompt';
const name = await prompt('What is your name?');

import { confirm } from '@heroku/heroku-cli-util/dist/ux/confirm';
const proceed = await confirm('Continue?');
```

### Test Helpers

```js
import { initCliTest } from '@heroku/heroku-cli-util/dist/test-helpers/init';
initCliTest();

import { stdout, stderr } from '@heroku/heroku-cli-util/dist/test-helpers/stub-output';
// Use stdout() and stderr() in your tests to capture CLI output
```

## Development

- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
