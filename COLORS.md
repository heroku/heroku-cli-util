# Heroku CLI Color Palette

This document describes the new color palette for the Heroku CLI, implemented using the `ansis` npm package.

## Usage

```typescript
import * as colors from '@heroku/heroku-cli-util/colors'

// App-related colors
console.log(colors.app('my-awesome-app'))        // Purple, bold
console.log(colors.addon('heroku-postgresql'))   // Yellow
console.log(colors.attachment('DATABASE'))       // Yellow
console.log(colors.pipeline('staging'))          // Magenta
console.log(colors.space('production'))          // Blue, bold
console.log(colors.datastore('postgresql-123'))  // Yellow, bold

// Status colors
console.log(colors.success('Deploy complete'))   // Green
console.log(colors.failure('Build failed'))      // Red
console.log(colors.warning('Deprecated feature')) // Orange

// User/Team colors
console.log(colors.team('my-team'))              // Cyan
console.log(colors.user('user@example.com'))     // Cyan

// General purpose colors
console.log(colors.label('Name'))                // Bold (default)
console.log(colors.name('entity-name'))          // Purple
console.log(colors.info('Help text'))            // Teal
console.log(colors.inactive('disabled'))         // Gray
console.log(colors.command('heroku apps:list'))  // White on dark gray background with $ prefix
```

### Using Color Constants

You can also access the raw color constants for custom styling:

```typescript
import { COLORS } from '@heroku/heroku-cli-util/colors'
import ansi from 'ansis'

// Use color constants directly
console.log(ansi.hex(COLORS.PURPLE)('Custom purple text'))
console.log(ansi.hex(COLORS.BLUE).bold('Custom blue bold text'))

// Available constants:
// COLORS.PURPLE   - #ACADFF
// COLORS.YELLOW   - #BFBD25
// COLORS.MAGENTA  - #FF8DD3
// COLORS.BLUE     - #62CBF4
// COLORS.GREEN    - #00D300
// COLORS.RED      - #FF8787
// COLORS.ORANGE   - #F29D00
// COLORS.CYAN     - #50D3D5
// COLORS.TEAL     - #00D4AA
// COLORS.GRAY     - #B6B6B6
// COLORS.CODE_BG  - #2E2E2E
// COLORS.CODE_FG  - #FFFFFF
```

## Color Definitions

| Alias | Purpose | Hex Value | Color Name | Style |
|-------|---------|-----------|------------|-------|
| `app` | Name of an app | #ACADFF | purple | bold |
| `addon` | Name of an addon | #BFBD25 | yellow | bold |
| `attachment` | Name of an attachment | #BFBD25 | yellow | normal |
| `pipeline` | Name of a pipeline | #ACADFF | purple | normal |
| `space` | Name of a space | #62CBF4 | blue | bold |
| `datastore` | Name of a heroku datastore | #BFBD25 | yellow | bold |
| `success` | Success messages and states | #00D300 | green | normal |
| `failure` | Failure, error messages and states | #FF8787 | red | normal |
| `warning` | Warning messages | #F29D00 | orange | normal |
| `team` | Heroku team/org | #50D3D5 | cyan | bold |
| `user` | Heroku user/email | #50D3D5 | cyan | normal |
| `label` | Labels, table headers and keys | default | bright white/black | bold |
| `name` | Name of heroku entity without special color | #FF8DD3 | magenta | normal |
| `info` | Help text, soft alerts | #00D4AA | teal | normal |
| `inactive` | Disabled and unknown states | #B6B6B6 | gray | normal |
| `command` | Command examples with shell prompt | #FFFFFF on #2E2E2E | white on dark gray | bold |

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

## Color Fallback Behavior

When `ansis` automatically maps colors to ANSI 16, it uses intelligent color approximation:

| Original Color | Hex Value | Typical ANSI 16 Mapping | Notes |
|----------------|-----------|-------------------------|-------|
| Purple (#ACADFF) | App names, pipelines | Magenta | Maintains distinction |
| Blue (#62CBF4) | Space names | Cyan | Good contrast |
| Yellow (#BFBD25) | Addons, attachments, datastores | Yellow | Unchanged |
| Magenta (#FF8DD3) | General names | Magenta | Unchanged |
| Green (#00D300) | Success | Green | Unchanged |
| Red (#FF8787) | Failure | Red | Unchanged |
| Orange (#F29D00) | Warning | Yellow | Maps to yellow |
| Cyan (#50D3D5) | Team/user | Cyan | Unchanged |
| Teal (#00D4AA) | Info | Cyan | Maps to cyan |
| Gray (#B6B6B6) | Inactive | Gray | Unchanged |
| White on Dark Gray | Command examples | White on Dark Gray | Unchanged |

## Design Principles

- **Accessibility**: All colors are designed to be accessible and provide sufficient contrast
- **Consistency**: Colors follow semantic conventions across the CLI
- **Hierarchy**: Bold styling is used for primary entities (apps, spaces, datastores) and labels
- **Status**: Status colors follow semantic conventions: green for success, red for errors, orange for warnings
- **Automatic Fallback**: The `ansis` package automatically handles color fallback for different terminal capabilities

## Migration from @heroku-cli/color

The new color system replaces the previous `@heroku-cli/color` package with more specific, semantic color functions. Instead of generic color functions, you now have purpose-built functions for different types of content.

### Before

```typescript
import {color} from '@heroku-cli/color'
console.log(color.cyan('my-app'))
```

### After

```typescript
import * as colors from '@heroku/heroku-cli-util/colors'
console.log(colors.app('my-app'))
```
