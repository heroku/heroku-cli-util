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

Import only the utilities you need for better performance and smaller bundle sizes.

```js
import * as color from '@heroku/heroku-cli-util/color';
import { confirm, table } from '@heroku/heroku-cli-util/hux';
import { DatabaseResolver } from '@heroku/heroku-cli-util/utils/pg';
import { AddonResolver } from '@heroku/heroku-cli-util/utils/addons';
```

**Available import paths:**
- `@heroku/heroku-cli-util/color` - Color utilities
- `@heroku/heroku-cli-util/hux` - UX utilities (prompts, tables, output formatting)
- `@heroku/heroku-cli-util/utils` - All utility functions
- `@heroku/heroku-cli-util/utils/pg` - PostgreSQL-specific utilities
- `@heroku/heroku-cli-util/utils/addons` - Addon-specific utilities

### Output Utilities

```js
import { styledHeader, styledJSON, styledObject, table, wait } from '@heroku/heroku-cli-util/hux';

// Styled header
styledHeader('My CLI Header');

// Styled JSON
styledJSON({ foo: 'bar' });

// Styled object
styledObject({ foo: 'bar' });

// Table output
table([
  {name: 'Alice', age: 30},
  {name: 'Bob', age: 25},
], {
  name: {header: 'Name'},
  age: {header: 'Age'},
});

// Wait indicator
const stop = wait('Processing...');
// ...do async work...
stop();
```

### User Interaction

```js
import { prompt, confirm } from '@heroku/heroku-cli-util/hux';

const name = await prompt('What is your name?');
const proceed = await confirm('Continue?');
```

### Colors

```js
import * as color from '@heroku/heroku-cli-util/color';

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
console.log(color.team('my-team'));              // Light cyan
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
import { AmbiguousError, NotFound } from '@heroku/heroku-cli-util/utils';

// Error types
try {
  throw new AmbiguousError([{ name: 'foo' }, { name: 'bar' }], 'addon');
} catch (err) {
  if (err instanceof AmbiguousError) {
    console.error('Ambiguous:', err.message);
  }
}

try {
  throw new NotFound();
} catch (err) {
  if (err instanceof NotFound) {
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
import { DatabaseResolver, PsqlService, getHost, getPsqlConfigs } from '@heroku/heroku-cli-util/utils/pg';
import { AddonResolver, isPostgresAddon } from '@heroku/heroku-cli-util/utils/addons';

// Resolve a database from an app (requires APIClient from @heroku-cli/command)
const resolver = new DatabaseResolver(herokuApiClient, app, db);
const database = await resolver.resolve();

// Get Heroku Postgres host
const host = getHost();

// Create a PSQL service
const psql = new PsqlService(database);

// Check if addon is PostgreSQL
const isPg = isPostgresAddon(addon);

// Resolve an addon
const addonResolver = new AddonResolver(herokuApiClient, app, addonName);
const addon = await addonResolver.resolve();
```

## Development

- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
