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

You can import the utilities you need from the main exports.

### Output Utilities

```js
import { hux } from '@heroku/heroku-cli-util';

// Styled header
hux.styledHeader('My CLI Header');

// Styled JSON
hux.styledJSON({ foo: 'bar' });

// Styled object
hux.styledObject({ foo: 'bar' });

// Table output
hux.table([
  {name: 'Alice', age: 30},
  {name: 'Bob', age: 25},
], {
  name: {header: 'Name'},
  age: {header: 'Age'},
});

// Wait indicator
const stop = hux.wait('Processing...');
// ...do async work...
stop();
```

### User Interaction

```js
import { hux } from '@heroku/heroku-cli-util';

const name = await hux.prompt('What is your name?');
const proceed = await hux.confirm('Continue?');
```

### Test Helpers

```js
import { testHelpers } from '@heroku/heroku-cli-util';

testHelpers.initCliTest();

testHelpers.setupStdoutStderr();
// ...run your CLI code...
const output = testHelpers.stdout();
const errorOutput = testHelpers.stderr();
testHelpers.restoreStdoutStderr();

testHelpers.expectOutput(output, 'expected output');

// Run a command (see docs for details)
// await testHelpers.runCommand(MyCommand, ['arg1', 'arg2']);
```

### Types

#### Error Classes

```js
import { utils } from '@heroku/heroku-cli-util';

// Error types
try {
  throw new utils.errors.AmbiguousError([{ name: 'foo' }, { name: 'bar' }], 'addon');
} catch (err) {
  if (err instanceof utils.errors.AmbiguousError) {
    console.error('Ambiguous:', err.message);
  }
}

try {
  throw new utils.errors.NotFound();
} catch (err) {
  if (err instanceof utils.errors.NotFound) {
    console.error('Not found:', err.message);
  }
}
```

#### PostgreSQL Types (TypeScript)

Import PG types using the `pg` namespace:

```typescript
import type { pg } from '@heroku/heroku-cli-util';

// Use the types
const connection: pg.ConnectionDetails = {
  database: 'mydb',
  host: 'localhost',
  password: 'pass',
  pathname: '/mydb',
  port: '5432',
  url: 'postgres://...',
  user: 'admin'
};

function processDatabase(details: pg.ConnectionDetailsWithAttachment) {
  // ...
}

const addon: pg.AddOnWithRelatedData = { /* ... */ };
const link: pg.Link = { /* ... */ };
const tunnel: pg.TunnelConfig = { /* ... */ };
```

Alternatively, you can import types directly:

```typescript
import type { 
  ConnectionDetails,
  ConnectionDetailsWithAttachment,
  AddOnWithRelatedData,
  ExtendedAddonAttachment,
  Link,
  TunnelConfig
} from '@heroku/heroku-cli-util';
```

### Database and Utility Helpers

```js
import { utils } from '@heroku/heroku-cli-util';

// Get Heroku Postgres database connection details (requires APIClient from @heroku-cli/command)
// const db = await utils.pg.databases(herokuApiClient, 'my-app', 'DATABASE_URL');

// Get Heroku Postgres host
const host = utils.pg.host();

// Run a query (requires a ConnectionDetails object)
// const result = await utils.pg.psql.exec(db, 'SELECT 1');
```

## Development

- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
