# Heroku CLI Color System

This document describes the new color system for the Heroku CLI, implemented using the `ansis` npm package.

## Basic Usage

```typescript
import {color} from '@heroku/heroku-cli-util'

console.log(color.app('my-awesome-app'))
console.log(color.addon('heroku-postgresql'))
console.log(color.success('Deploy complete'))
console.log(color.team('my-team'))
console.log(color.orange('Custom orange color'))
```

## Color Definitions

### Heroku Platform Resources

#### `app`
**Purpose**: Displays the name of a Heroku application. This is the primary resource type in the Heroku platform.

**Color**: Purple (ANSI256: 147, approx. #AFAFFF)  
**Style**: Hexagon icon (⬢) prefix when ANSI256 is supported

**Example**:
```typescript
console.log(`Deploying to ${color.app('my-awesome-app')}`)
// Output: Deploying to ⬢ my-awesome-app (in purple)
```

#### `pipeline`
**Purpose**: Displays the name of a Heroku pipeline. Pipelines group related apps together for continuous delivery workflows.

**Color**: Purple (ANSI256: 147, approx. #AFAFFF)  
**Style**: Normal weight (no bold)

**Example**:
```typescript
console.log(`Pipeline: ${color.pipeline('production-pipeline')}`)
// Output: Pipeline: production-pipeline (in purple)
```

#### `space`
**Purpose**: Displays the name of a Heroku Private Space. Spaces provide network isolation for apps in a private network.

**Color**: Blue (ANSI256: 117, approx. #87D7FF)  
**Style**: Space icon (⬡) prefix when ANSI256 is supported

**Example**:
```typescript
console.log(`Space: ${color.space('private-network')}`)
// Output: Space: ⬡ private-network (in blue)
```

#### `addon`
**Purpose**: Displays the name of a Heroku addon. Addons provide additional services and functionality to apps (e.g., databases, monitoring, logging).

**Color**: Yellow (ANSI256: 185, approx. #D7D75F)  
**Style**: Normal weight

**Example**:
```typescript
console.log(`Addon: ${color.addon('heroku-postgresql')}`)
// Output: Addon: heroku-postgresql (in yellow)
```

#### `attachment`
**Purpose**: Displays the name of an addon attachment. Attachments connect addons to apps, allowing multiple apps to share the same addon instance.

**Color**: Yellow (ANSI256: 185, approx. #D7D75F)  
**Style**: Normal weight (no bold)

**Example**:
```typescript
console.log(`Attachment: ${color.attachment('DATABASE_URL')}`)
// Output: Attachment: DATABASE_URL (in yellow)
```

#### `datastore`
**Purpose**: Displays the name of a Heroku datastore (e.g., Heroku Postgres, Heroku Redis). These are first-party data storage services provided by Heroku.

**Color**: Yellow (ANSI256: 185, approx. #D7D75F)  
**Style**: Datastore icon (⛁) prefix when ANSI256 is supported

**Example**:
```typescript
console.log(`Datastore: ${color.datastore('postgres-12345')}`)
// Output: Datastore: ⛁ postgres-12345 (in yellow)
```

### Status Colors

#### `success`
**Purpose**: Indicates successful operations, positive states, and completion messages. Use for confirmations, successful deployments, and positive feedback.

**Color**: Green (ANSI256: 40, approx. #00D700)  
**Style**: Normal weight

**Example**:
```typescript
console.log(color.success('Deploy complete'))
// Output: Deploy complete (in green)
```

#### `failure`
**Purpose**: Indicates errors, failures, and negative states. Use for error messages, failed operations, and critical issues.

**Color**: Red (Hex: #FF8787)  
**Style**: Normal weight

**Example**:
```typescript
console.log(color.failure('Deploy failed: Build timeout'))
// Output: Deploy failed: Build timeout (in red)
```

#### `warning`
**Purpose**: Indicates warnings and cautionary messages. Used when we want the user to knowof a potentially bad state or action they really should take -- deprecation notices as an example.

**Color**: Orange (ANSI256: 214, approx. #FF8700)  
**Style**: Normal weight

**Example**:
```typescript
console.log(color.warning('This feature will be deprecated soon'))
// Output: This feature will be deprecated soon (in orange)
```

### User and Team Colors

#### `team`
**Purpose**: Displays the name of a Heroku team or organization. Teams allow multiple users to collaborate on apps and resources.

**Color**: Light Cyan (Hex: #6FE5E7)  
**Style**: Normal weight

**Example**:
```typescript
console.log(`Team: ${color.team('acme-corp')}`)
// Output: Team: acme-corp (in light cyan)
```

#### `user`
**Purpose**: Displays Heroku user information, typically email addresses. Use for showing who performed an action or owns a resource.

**Color**: Cyan (Hex: #50D3D5)  
**Style**: Normal weight (no bold)

**Example**:
```typescript
console.log(`Owner: ${color.user('user@example.com')}`)
// Output: Owner: user@example.com (in cyan)
```

### General Purpose Colors

#### `name`
**Purpose**: Displays the name of a generic Heroku resource that doesn't have a specific semantic color. Use as a fallback for resource types that don't have dedicated color functions.

**Color**: Magenta (Hex: #FF8DD3)  
**Style**: Normal weight

**Example**:
```typescript
console.log(`Resource: ${color.name('custom-resource')}`)
// Output: Resource: custom-resource (in magenta)
```

#### `info`
**Purpose**: Displays informational text, help messages, soft alerts, URLs, and can serve as an alternative color for generic Heroku resources. Use for supplementary information that doesn't require emphasis.

**Color**: Teal (ANSI256: 43, approx. #00D7D7)  
**Style**: Normal weight

**Example**:
```typescript
console.log(color.info('Visit https://dashboard.heroku.com for more details'))
// Output: Visit https://dashboard.heroku.com for more details (in teal)
```

#### `label`
**Purpose**: Displays labels, table headers, and keys. Provides emphasis without color. Adapts to terminal theme (bright white on dark backgrounds, black on light backgrounds).

**Color**: Default terminal foreground color  
**Style**: Normal weight

**Example**:
```typescript
console.log(`${color.label('Status')}: ${color.success('Active')}`)
// Output: Status: Active (Status in default color, Active in green)
```

#### `inactive`
**Purpose**: Displays disabled states, unknown values, and inactive resources. Use to indicate that something is not currently active or available.

**Color**: Gray (ANSI256: 248, approx. #A8A8A8)  
**Style**: Normal weight

**Example**:
```typescript
console.log(`Status: ${color.inactive('Unknown')}`)
// Output: Status: Unknown (in gray)
```

#### `command`
**Purpose**: Displays command examples with a shell prompt indicator. Use for showing users example commands they can run in their terminal.

**Color**: White foreground on dark gray background (ANSI256: 255 on 237, approx. #FFFFFF on #3A3A3A)  
**Style**: ` $ ` prefix and suffix

**Example**:
```typescript
console.log(`Run: ${color.command('heroku apps:info')}`)
// Output: Run:  $ heroku apps:info  (in white on dark gray background)
```

#### `code`
**Purpose**: Displays code snippets and command examples without a shell prompt. Use for inline code, file paths, or code blocks that don't need the prompt indicator.

**Color**: White foreground on dark gray background (ANSI256: 255 on 237, approx. #FFFFFF on #3A3A3A)  
**Style**: Normal weight

**Example**:
```typescript
console.log(`File: ${color.code('config/database.yml')}`)
// Output: File: config/database.yml (in white on dark gray background)
```

## Demo

To see all colors in action, run:

```bash
npm run example color-demo
```

### Automatic Color Fallback

The `ansis` package automatically detects terminal color capabilities and falls back gracefully:

- **TrueColor terminals**: Full hex color support
- **ANSI 256 terminals**: 256 color palette
- **ANSI 16 terminals**: 16 color palette with automatic mapping
- **Monochrome terminals**: Bold/underline styling only

No additional configuration is needed - the colors will automatically adapt to your terminal's capabilities.

## Design Principles

- **Accessibility**: All colors are designed to be accessible and provide sufficient contrast
- **Consistency**: Colors follow semantic conventions across the CLI
- **Heroku Resources**: Resources offered directly from Heroku get an icon identifier
- **Color Grouping**: Related entities share similar colors to create visual relationships:
  - **Purple** is used for app-related concepts: apps, pipelines, and spaces
  - **Yellow** is used for addon-related concepts: addons (both Heroku and third-party), PostgreSQL databases, and attachments
  - **Cyan** is used for user-related concepts: users, organizations, and teams
  - **Status**: Status colors follow semantic conventions: green for success, red for errors, orange for warnings
- **Automatic Fallback**: The `ansis` package automatically handles color fallback for different terminal capabilities

## Migration from @heroku-cli/color

The new color system replaces the previous `@heroku-cli/color` package with more semantic color functions. Instead of a mix of semantic and generic color functions, you now have purpose-built functions that cover most types of content. The interface should largely remain the same, simply importing from a different package.

### Before

```typescript
import {color} from '@heroku-cli/color'
console.log(color.cyan('my-app'))
```

### After

```typescript
import {color} from '@heroku/heroku-cli-util'
console.log(color.app('my-app'))
```
