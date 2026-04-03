import defaultAnsis, {Ansis} from 'ansis'

/**
 * Check if colors should be enabled based on TTY and environment variables.
 * Colors are disabled by default when output is redirected (not a TTY),
 * unless FORCE_COLOR is explicitly set.
 * @returns true if colors should be enabled
 */
function shouldEnableColors(): boolean {
  // If FORCE_COLOR is set, let ansis handle it completely
  if (process.env.FORCE_COLOR !== undefined) {
    return true // use default ansis instance with its auto-detection
  }

  // If NO_COLOR is set, disable colors
  if (process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== '0') {
    return false
  }

  // When output is redirected (not a TTY), disable colors by default
  if (!process.stdout.isTTY) {
    return false
  }

  return defaultAnsis.level > 0
}

// Determine if colors are enabled, and create ansis instance with appropriate level
const colorsEnabled = shouldEnableColors()
// Create an ansis instance with level 0 (no colors) when colors are disabled
// This ensures all ansis methods return plain strings without ANSI codes
const ansis = colorsEnabled ? defaultAnsis : new Ansis(0)

/**
 * Color constants for Heroku CLI output
 * Most colors use ANSI256 codes for better compatibility with terminals that don't support TrueColor.
 * Magenta, red, and cyan are kept as hex values for precise color matching.
 */
const COLORS = {
  // Blue tones (ANSI256: 117)
  BLUE: 117,

  // Command tones (dark gray background, white foreground)
  // ANSI256: 237 (background), 255 (foreground)
  CODE_BG: 237,
  CODE_FG: 255,

  // Cyan tones (kept as hex for precise color matching)
  CYAN: '#50D3D5',
  CYAN_LIGHT: '#8FF5F7',

  // Gold tones (ANSI256: 220, approx. #FFD700)
  GOLD: 220,

  // Gray tones (ANSI256: 248)
  GRAY: 248,

  // Green tones (ANSI256: 40)
  GREEN: 40,

  // Magenta tones (kept as hex for precise color matching)
  MAGENTA: '#FF22DD',

  // Orange tones (ANSI256: 214)
  ORANGE: 214,

  // Pink tones (ANSI256: 212, approx. #FF87D7 - closest match to original #FF8DD3)
  PINK: 212,

  // Purple tones (ANSI256: 147 - closest match to original #ACADFF)
  PURPLE: 147,

  // Red tones (kept as hex for precise color matching)
  RED: '#FF8787',

  // Teal tones (ANSI256: 43)
  TEAL: 43,

  // Yellow tones (ANSI256: 185)
  YELLOW: 185,
} as const

/**
 * Color definitions for Heroku CLI output
 * Each color has a specific purpose as defined in the design system
 * Colors use ANSI256 codes where possible, with hex values for magenta, red, and cyan
 */

// Helper function to apply color based on type (number = ANSI256, string = hex)
const colorize = (color: number | string) =>
  typeof color === 'number' ? ansis.fg(color) : ansis.hex(color)

const bgColorize = (color: number | string) =>
  typeof color === 'number' ? ansis.bg(color) : ansis.bgHex(color)

// Check if terminal supports at least ANSI256 (level >= 2)
// Level values: 0=no color, 1=ANSI16, 2=ANSI256, 3=TrueColor
const supportsAnsi256 = ansis.level >= 2

// Helper function for purple color that falls back to ANSI16 magenta when only ANSI16 is supported
const purpleColorize = () =>
  supportsAnsi256 ? ansis.fg(COLORS.PURPLE) : ansis.magenta

/** Theme name: 'heroku' (default) or 'simple' (ANSI 8 only). Set via HEROKU_THEME env. */
export type ThemeName = 'heroku' | 'simple'

const THEME_ENV = 'HEROKU_THEME'

/**
 * Resolves active theme from HEROKU_THEME; defaults to 'heroku'.
 * @returns The active theme name.
 */
export function getTheme(): ThemeName {
  const v = process.env[THEME_ENV]?.toLowerCase().trim()
  if (v === 'simple') return 'simple'
  return 'heroku'
}

interface ColorTheme {
  addon: (text: string) => string
  app: (text: string) => string
  attachment: (text: string) => string
  blue: (text: string) => string
  code: (text: string) => string
  command: (text: string) => string
  cyan: (text: string) => string
  datastore: (text: string) => string
  failure: (text: string) => string
  gold: (text: string) => string
  gray: (text: string) => string
  green: (text: string) => string
  inactive: (text: string) => string
  info: (text: string) => string
  label: (text: string) => string
  magenta: (text: string) => string
  name: (text: string) => string
  orange: (text: string) => string
  pink: (text: string) => string
  pipeline: (text: string) => string
  purple: (text: string) => string
  red: (text: string) => string
  space: (text: string) => string
  success: (text: string) => string
  teal: (text: string) => string
  team: (text: string) => string
  user: (text: string) => string
  warning: (text: string) => string
  yellow: (text: string) => string
}

const herokuTheme: ColorTheme = {
  addon: (text: string) => colorize(COLORS.YELLOW)(text),
  app: (text: string) => purpleColorize()(`${supportsAnsi256 ? '⬢ ' : ''}${text}`),
  attachment: (text: string) => colorize(COLORS.GOLD)(text),
  blue: (text: string) => colorize(COLORS.BLUE)(text),
  code: (text: string) =>
    bgColorize(COLORS.CODE_BG).fg(COLORS.CODE_FG as number).bold(`${text}`),
  command: (text: string) =>
    bgColorize(COLORS.CODE_BG).fg(COLORS.CODE_FG as number).bold(` $ ${text} `),
  cyan: (text: string) => colorize(COLORS.CYAN)(text),
  datastore: (text: string) => colorize(COLORS.YELLOW)(`${supportsAnsi256 ? '⛁ ' : ''}${text}`),
  failure: (text: string) => colorize(COLORS.RED)(text),
  gold: (text: string) => colorize(COLORS.GOLD)(text),
  gray: (text: string) => colorize(COLORS.GRAY)(text),
  green: (text: string) => colorize(COLORS.GREEN)(text),
  inactive: (text: string) => colorize(COLORS.GRAY)(text),
  info: (text: string) => colorize(COLORS.TEAL)(text),
  label: (text: string) => ansis.bold(text),
  magenta: (text: string) => colorize(COLORS.MAGENTA)(text),
  name: (text: string) => colorize(COLORS.PINK)(text),

  orange: (text: string) => colorize(COLORS.ORANGE)(text),
  pink: (text: string) => colorize(COLORS.PINK)(text),
  pipeline: (text: string) => colorize(COLORS.MAGENTA)(text),
  purple: (text: string) => purpleColorize()(text),
  red: (text: string) => colorize(COLORS.RED)(text),
  space: (text: string) => colorize(COLORS.BLUE)(`${supportsAnsi256 ? '⬡ ' : ''}${text}`),
  success: (text: string) => colorize(COLORS.GREEN)(text),
  teal: (text: string) => colorize(COLORS.TEAL)(text),
  team: (text: string) => colorize(COLORS.CYAN_LIGHT)(text),
  user: (text: string) => colorize(COLORS.CYAN)(text),
  warning: (text: string) => colorize(COLORS.ORANGE)(text),
  yellow: (text: string) => colorize(COLORS.YELLOW)(text),
}

/** Simple theme: ANSI 8 colors only, no symbols. */
const simpleTheme: ColorTheme = {
  addon: (text: string) => ansis.yellow(text),
  app: (text: string) => ansis.magenta(text),
  attachment: (text: string) => ansis.yellow(text),
  blue: (text: string) => ansis.blue(text),
  code: (text: string) => ansis.bold(text),
  command: (text: string) => ansis.bold(` $ ${text} `),
  cyan: (text: string) => ansis.cyan(text),
  datastore: (text: string) => ansis.yellow(text),
  failure: (text: string) => ansis.red(text),
  gold: (text: string) => ansis.yellow(text),
  gray: (text: string) => ansis.gray(text),
  green: (text: string) => ansis.green(text),
  inactive: (text: string) => ansis.gray(text),
  info: (text: string) => ansis.cyan(text),
  label: (text: string) => ansis.bold(text),
  magenta: (text: string) => ansis.magenta(text),
  name: (text: string) => ansis.magenta(text),
  orange: (text: string) => ansis.yellow(text),
  pink: (text: string) => ansis.magenta(text),
  pipeline: (text: string) => ansis.magenta(text),
  purple: (text: string) => ansis.magenta(text),
  red: (text: string) => ansis.red(text),
  space: (text: string) => ansis.cyan(text),
  success: (text: string) => ansis.green(text),
  teal: (text: string) => ansis.cyan(text),
  team: (text: string) => ansis.cyan(text),
  user: (text: string) => ansis.cyan(text),
  warning: (text: string) => ansis.yellow(text),
  yellow: (text: string) => ansis.yellow(text),
}

const activeTheme = (): ColorTheme => (getTheme() === 'simple' ? simpleTheme : herokuTheme)

// Colors for entities on the Heroku platform
export const app = (text: string) => activeTheme().app(text)
export const pipeline = (text: string) => activeTheme().pipeline(text)
export const space = (text: string) => activeTheme().space(text)
export const datastore = (text: string) => activeTheme().datastore(text)
export const addon = (text: string) => activeTheme().addon(text)
export const attachment = (text: string) => activeTheme().attachment(text)
export const name = (text: string) => activeTheme().name(text)

// Status colors
export const success = (text: string) => activeTheme().success(text)
export const enabled = success
export const failure = (text: string) => activeTheme().failure(text)
export const error = failure
export const warning = (text: string) => activeTheme().warning(text)

// User/Team colors
export const team = (text: string) => activeTheme().team(text)
export const user = (text: string) => activeTheme().user(text)

// General purpose colors
export const label = (text: string) => activeTheme().label(text)
export const info = (text: string) => activeTheme().info(text)
export const inactive = (text: string) => activeTheme().inactive(text)
export const disabled = inactive
export const command = (text: string) => activeTheme().command(text)
export const code = (text: string) => activeTheme().code(text)
export const snippet = code

// Basic color functions (respect active theme)
export const blue = (text: string) => activeTheme().blue(text)
export const cyan = (text: string) => activeTheme().cyan(text)
export const gold = (text: string) => activeTheme().gold(text)
export const gray = (text: string) => activeTheme().gray(text)
export const green = (text: string) => activeTheme().green(text)
export const magenta = (text: string) => activeTheme().magenta(text)
export const orange = (text: string) => activeTheme().orange(text)
export const pink = (text: string) => activeTheme().pink(text)
export const purple = (text: string) => activeTheme().purple(text)
export const red = (text: string) => activeTheme().red(text)
export const teal = (text: string) => activeTheme().teal(text)
export const yellow = (text: string) => activeTheme().yellow(text)

/**
 * Color palette for reference
 * Shows ANSI256 codes for most colors, hex values for magenta, red, and cyan
 */
export const colorPalette = {
  addon: {name: 'yellow', style: 'normal', value: COLORS.YELLOW},
  app: {name: 'purple', style: 'normal', value: COLORS.PURPLE},
  attachment: {name: 'yellow', style: 'normal', value: COLORS.YELLOW},
  code: {name: 'white on dark gray', style: 'bold', value: COLORS.CODE_FG},
  command: {name: 'white on dark gray', style: 'bold', value: COLORS.CODE_FG},
  datastore: {name: 'yellow', style: 'normal', value: COLORS.YELLOW},
  failure: {name: 'red', style: 'normal', value: COLORS.RED},
  gold: {name: 'gold', style: 'normal', value: COLORS.GOLD},
  inactive: {name: 'gray', style: 'normal', value: COLORS.GRAY},
  info: {name: 'teal', style: 'normal', value: COLORS.TEAL},
  label: {name: 'bright white/black', style: 'bold', value: 'default'},
  name: {name: 'magenta', style: 'normal', value: COLORS.MAGENTA},
  pipeline: {name: 'purple', style: 'normal', value: COLORS.PURPLE},
  snippet: {name: 'white on dark gray', style: 'normal', value: COLORS.CODE_FG},
  space: {name: 'blue', style: 'normal', value: COLORS.BLUE},
  success: {name: 'green', style: 'normal', value: COLORS.GREEN},
  team: {name: 'light cyan', style: 'normal', value: COLORS.CYAN_LIGHT},
  user: {name: 'cyan', style: 'normal', value: COLORS.CYAN},
  warning: {name: 'orange', style: 'normal', value: COLORS.ORANGE},
} as const

/**
 * Export color constants for external use
 */
export {COLORS}

/**
 * Re-export the configured ansis instance with custom TTY detection
 * Use color.ansis.bold(), color.ansis.red(), etc. for direct ansis styling
 * These methods respect the custom shouldEnableColors() logic
 */
export {ansis}
