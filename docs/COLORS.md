# Heroku CLI Color Palette

This document describes the new color palette for the Heroku CLI, implemented using the `ansis` npm package.

## Usage

```typescript
import {color} from '@heroku/heroku-cli-util'

console.log(color.app('my-awesome-app'))
console.log(color.addon('heroku-postgresql'))
console.log(color.success('Deploy complete'))
console.log(color.team('my-team'))
console.log(color.orange('Custom orange color'))
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
- **Color Grouping**: Related entities share similar colors to create visual relationships:
  - **Purple** is used for app-related concepts: apps, pipelines, and spaces
  - **Yellow** is used for addon-related concepts: addons (both Heroku and third-party), PostgreSQL databases, and attachments
  - **Cyan** is used for user-related concepts: users, organizations, and teams
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
import {color} from '@heroku/heroku-cli-util'
console.log(color.app('my-app'))
```
