/* eslint-disable import/no-named-as-default-member */
import ansis from 'ansis'

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
  code: (text: string) => string
  command: (text: string) => string
  datastore: (text: string) => string
  failure: (text: string) => string
  inactive: (text: string) => string
  info: (text: string) => string
  label: (text: string) => string
  name: (text: string) => string
  pipeline: (text: string) => string
  space: (text: string) => string
  success: (text: string) => string
  team: (text: string) => string
  user: (text: string) => string
  warning: (text: string) => string
}

const herokuTheme: ColorTheme = {
  addon: (text: string) => colorize(COLORS.YELLOW)(text),
  app: (text: string) => purpleColorize()(`${supportsAnsi256 ? '⬢ ' : ''}${text}`),
  attachment: (text: string) => colorize(COLORS.GOLD)(text),
  code: (text: string) =>
    bgColorize(COLORS.CODE_BG).fg(COLORS.CODE_FG as number).bold(`${text}`),
  command: (text: string) =>
    bgColorize(COLORS.CODE_BG).fg(COLORS.CODE_FG as number).bold(` $ ${text} `),
  datastore: (text: string) => colorize(COLORS.YELLOW)(`${supportsAnsi256 ? '⛁ ' : ''}${text}`),
  failure: (text: string) => colorize(COLORS.RED)(text),
  inactive: (text: string) => colorize(COLORS.GRAY)(text),
  info: (text: string) => colorize(COLORS.TEAL)(text),
  label: (text: string) => ansis.bold(text),
  name: (text: string) => colorize(COLORS.PINK)(text),
  pipeline: (text: string) => colorize(COLORS.MAGENTA)(text),
  space: (text: string) => colorize(COLORS.BLUE)(`${supportsAnsi256 ? '⬡ ' : ''}${text}`),
  success: (text: string) => colorize(COLORS.GREEN)(text),
  team: (text: string) => colorize(COLORS.CYAN_LIGHT)(text),
  user: (text: string) => colorize(COLORS.CYAN)(text),
  warning: (text: string) => colorize(COLORS.ORANGE)(text),
}

/** Simple theme: ANSI 8 colors only, no symbols. */
const simpleTheme: ColorTheme = {
  addon: (text: string) => ansis.yellow(text),
  app: (text: string) => ansis.magenta(text),
  attachment: (text: string) => ansis.yellow(text),
  code: (text: string) => ansis.bold(text),
  command: (text: string) => ansis.bold(` $ ${text} `),
  datastore: (text: string) => ansis.yellow(text),
  failure: (text: string) => ansis.red(text),
  inactive: (text: string) => ansis.gray(text),
  info: (text: string) => ansis.cyan(text),
  label: (text: string) => ansis.bold(text),
  name: (text: string) => ansis.magenta(text),
  pipeline: (text: string) => ansis.magenta(text),
  space: (text: string) => ansis.cyan(text),
  success: (text: string) => ansis.green(text),
  team: (text: string) => ansis.cyan(text),
  user: (text: string) => ansis.cyan(text),
  warning: (text: string) => ansis.yellow(text),
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
 * Re-export everything from ansis as a passthrough
 * This gives access to all ansis functionality while adding our custom colors
 */
export * from 'ansis'
export {default as ansi} from 'ansis'
