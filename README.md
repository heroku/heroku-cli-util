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

## v11 Migration

Version 11 requires Node.js `>=22.12.0`, uses `@oclif/core` v5 directly, and
supports `@heroku-cli/command` v14 only. It does not support command v13.
The dependency range admits stable command v14 releases as well as the v14
beta used during v11 beta validation.

During the beta period, install an exact beta version rather than the floating
`beta` tag:

```bash
npm install @heroku/heroku-cli-util@11.0.0-beta.0
```

After v11 has completed beta acceptance and stable `@heroku-cli/command` v14
compatibility has been verified, migrate to:

```bash
npm install @heroku/heroku-cli-util@^11.0.0
```

The package directly uses oclif core v5. The command v14 dependency may bring
its own core v4 copy; both versions intentionally coexist, without dependency
overrides.

### Breaking: output helpers return strings

`hux.styledHeader`, `hux.styledObject`, and `hux.table` no longer write to
stdout. Each returns the rendered string. Inside an oclif command, wrap the call
in `this.log(...)`:

```diff
- hux.styledHeader(`${app.name} Info`)
- hux.styledObject(info, ['Owner', 'Region'])
- hux.table(apps, columns)
+ this.log(hux.styledHeader(`${app.name} Info`))
+ this.log(hux.styledObject(info, ['Owner', 'Region']))
+ this.log(hux.table(apps, columns))
```

Logging the return value produces the same bytes the helper used to print,
including the plain-text table fallback in CI and above `OCLIF_TABLE_LIMIT`.

> [!WARNING]
> A call you forget to migrate still compiles and runs, but prints nothing.
> TypeScript does not flag an unused string return value. Search for every call
> site, and consider a lint rule that rejects these helpers as bare statements,
> for example:
>
> ```js
> 'no-restricted-syntax': ['error', {
>   selector: ":matches(ExpressionStatement > CallExpression, ExpressionStatement > AwaitExpression > CallExpression)[callee.object.name='hux'][callee.property.name=/^(styledHeader|styledObject|table)$/]",
>   message: 'hux formatters return strings; wrap the call in this.log().',
> }]
> ```

**Outside a command** (a helper function in `lib/`), there is no `this.log`.
Return the string to the command, or accept a log function from it. Don't use
`ux.stdout(...)` there: it is not silenced under `--json`.

**`--json` suppression** comes from `this.log`, and oclif only applies it to
commands that set `static enableJsonFlag = true`. A command that declares its own
`json` flag gets no suppression from this change.

**`printLine` removed.** The `printLine` option on `hux.table` is gone. It was
only used for `csv: true` output. Other tables were always written straight to
stdout and ignored it. Use the returned string:

```diff
- hux.table(rows, columns, {printLine: line => lines.push(line)})
+ lines.push(hux.table(rows, columns))
```

**Tests that stub these helpers** must return a string. A stub returning
`undefined` makes `this.log(hux.table(...))` print a blank line.

**`styledObject` on a primitive** (string, number, boolean, `null`, `undefined`)
returns it as a string without printing, as before. Logging that return value
now prints it, so `this.log(hux.styledObject(null))` prints `null`, which
heroku-cli-util 10.x never did. Guard falsy values if they can occur.

### Breaking: `hux.openUrl` status message moved to stderr

`hux.openUrl` now writes `Opening <url> in <browser> browser…` to stderr instead
of stdout, matching its key prompt and warnings. Tests that assert on that line
should read `stderr`.

### Breaking: `hux.openUrl` 4th argument is an options object

The 4th argument was the test-only `dependencies` object. It is now
`{dependencies?, prompt?}`; pass test doubles as `{dependencies: {anykey, urlOpener}}`.
Calls with one to three arguments are unchanged.

`prompt` (default `true`) controls the "Press any key to open up the browser"
step. Commands whose whole job is to open the URL, such as `heroku open`, pass
`{prompt: false}`, so they open right away and also work without a TTY:

```ts
await hux.openUrl(url, flags.browser, undefined, {prompt: false})
```

`openUrl` and the prompt helpers (`prompt`, `confirm`, `confirmCommand`,
`anykey`) are interactive and still write to stderr. Commands that use them
should not offer `--json`, and they are exempt from direct-output and
`--json 2>&1` guardrails.

### Breaking: `hux.styledJSON` removed

`hux.styledJSON` was a passthrough to oclif's `ux.colorizeJson`. Choose the
replacement by what the JSON is for:

- **It is the command's `--json` output** (the usual case). With
  `enableJsonFlag`, return the object from `run()` and oclif prints it. In a
  hand-rolled `if (flags.json)` branch, use `this.logJson(obj)`.
  `this.logJson` is not silenced under `--json`. It prints the same bytes as
  `hux.styledJSON` unless the user has an oclif JSON color theme configured.
- **It is human-readable output**, such as a config value that happens to be JSON:
  `this.log(ux.colorizeJson(obj))`.

```diff
- if (flags.json) hux.styledJSON(app)
+ if (flags.json) this.logJson(app)
```

Don't use `this.log(ux.colorizeJson(...))` for `--json` output. On a command
with `enableJsonFlag`, `this.log` is silenced under `--json`, so the JSON
disappears.

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
- `@heroku/heroku-cli-util/colors` - Alias for color utilities
- `@heroku/heroku-cli-util/hux` - UX utilities (prompts, tables, output formatting)
- `@heroku/heroku-cli-util/utils` - All utility functions
- `@heroku/heroku-cli-util/utils/pg` - PostgreSQL-specific utilities
- `@heroku/heroku-cli-util/utils/addons` - Addon-specific utilities
- `@heroku/heroku-cli-util` - Root namespace exports (`utils`, `hux`, and `color`)

### Output Utilities

`styledHeader`, `styledObject`, and `table` are pure formatters: they
return the rendered string and write nothing. Inside an oclif command, pass the result
to `this.log()` so it is suppressed under `--json`.

```js
import { styledHeader, styledObject, table, wait } from '@heroku/heroku-cli-util/hux';

// Styled header (includes a trailing newline, so a blank line follows it when logged)
this.log(styledHeader('My CLI Header'));

// Styled object
this.log(styledObject({ foo: 'bar' }));

// Table output (also returns a string when `csv: true`)
this.log(table([
  {name: 'Alice', age: 30},
  {name: 'Bob', age: 25},
], {
  name: {header: 'Name'},
  age: {header: 'Age'},
}));

// Because they return strings, the output can be composed or asserted on directly
const summary = styledObject({ app: 'my-app', region: 'us' });
this.warn(`Current settings:\n${summary}`);

// Pause for a number of milliseconds
await wait(1000);
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
const resolver = new DatabaseResolver(herokuApiClient);
const database = await resolver.getDatabase(app, db);

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
