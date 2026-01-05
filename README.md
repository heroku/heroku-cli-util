# @heroku/heroku-cli-util

A set of helpful CLI utilities for Heroku and oclif-based Node.js CLIs. This
package provides convenient wrappers and helpers for user interaction, output
formatting, and color styling.

## Features

- **User prompts and confirmations** (yes/no, input)
- **Styled output** (headers, JSON, objects, tables)
- **Wait indicators** for async operations
- **Colors** for consistent, semantic CLI styling

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

### Colors

```js
import { color } from '@heroku/heroku-cli-util';

// App-related colors
console.log(color.app('my-awesome-app'));        // Purple, bold with app icon
console.log(color.pipeline('staging'));          // Purple
console.log(color.space('production'));         // Blue, bold with space icon
console.log(color.addon('heroku-postgresql'));   // Yellow, bold
console.log(color.datastore('postgresql-123'));  // Yellow, bold with datastore icon

// Status colors
console.log(color.success('Deploy complete'));   // Green
console.log(color.failure('Build failed'));      // Red
console.log(color.warning('Deprecated feature')); // Orange

// User/Team colors
console.log(color.team('my-team'));              // Cyan, bold
console.log(color.user('user@example.com'));     // Cyan

// General purpose
console.log(color.label('Name'));                // Bold
console.log(color.info('Help text'));            // Teal
console.log(color.command('heroku apps:list'));  // Command with prompt styling
```

See the [COLORS.md](docs/COLORS.md) documentation for the complete color palette and usage guide.

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
