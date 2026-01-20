/* eslint-disable import/no-named-as-default-member */
import ansi from 'ansis'

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

  // Gray tones (ANSI256: 248)
  GRAY: 248,

  // Green tones (ANSI256: 40)
  GREEN: 40,

  // Magenta tones (kept as hex for precise color matching)
  MAGENTA: '#FF8DD3',

  // Orange tones (ANSI256: 214)
  ORANGE: 214,

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
  typeof color === 'number' ? ansi.fg(color) : ansi.hex(color)

const bgColorize = (color: number | string) =>
  typeof color === 'number' ? ansi.bg(color) : ansi.bgHex(color)

// Check if terminal supports at least ANSI256 (level >= 2)
// Level values: 0=no color, 1=ANSI16, 2=ANSI256, 3=TrueColor
const supportsAnsi256 = ansi.level >= 2

// Helper function for purple color that falls back to ANSI16 magenta when only ANSI16 is supported
const purpleColorize = () =>
  supportsAnsi256 ? ansi.fg(COLORS.PURPLE) : ansi.magenta

// Colors for entities on the Heroku platform
export const app = (text: string) => purpleColorize().bold(`${supportsAnsi256 ? '⬢ ' : ''}${text}`)
export const pipeline = (text: string) => purpleColorize()(text)
export const space = (text: string) => colorize(COLORS.BLUE).bold(`${supportsAnsi256 ? '⬡ ' : ''}${text}`)
export const datastore = (text: string) => colorize(COLORS.YELLOW).bold(`${supportsAnsi256 ? '⛁ ' : ''}${text}`)
export const addon = (text: string) => colorize(COLORS.YELLOW).bold(text)
export const attachment = (text: string) => colorize(COLORS.YELLOW)(text)
export const name = (text: string) => colorize(COLORS.MAGENTA)(text)

// Status colors
export const success = (text: string) => colorize(COLORS.GREEN)(text)
export const failure = (text: string) => colorize(COLORS.RED)(text)
export const warning = (text: string) => colorize(COLORS.ORANGE)(text)

// User/Team colors
export const team = (text: string) => colorize(COLORS.CYAN).bold(text)
export const user = (text: string) => colorize(COLORS.CYAN)(text)

// General purpose colors
export const label = (text: string) => ansi.bold(text)
export const info = (text: string) => colorize(COLORS.TEAL)(text)
export const inactive = (text: string) => colorize(COLORS.GRAY)(text)
export const command = (text: string) => bgColorize(COLORS.CODE_BG).fg(COLORS.CODE_FG as number).bold(` $ ${text} `)
export const code = (text: string) => bgColorize(COLORS.CODE_BG).fg(COLORS.CODE_FG as number).bold(`${text}`)

/**
 * Color palette for reference
 * Shows ANSI256 codes for most colors, hex values for magenta, red, and cyan
 */
export const colorPalette = {
  addon: {name: 'yellow', style: 'bold', value: COLORS.YELLOW},
  app: {name: 'purple', style: 'bold', value: COLORS.PURPLE},
  attachment: {name: 'yellow', style: 'normal', value: COLORS.YELLOW},
  command: {name: 'white on dark gray', style: 'bold', value: COLORS.CODE_FG},
  datastore: {name: 'yellow', style: 'bold', value: COLORS.YELLOW},
  failure: {name: 'red', style: 'normal', value: COLORS.RED},
  inactive: {name: 'gray', style: 'normal', value: COLORS.GRAY},
  info: {name: 'teal', style: 'normal', value: COLORS.TEAL},
  label: {name: 'bright white/black', style: 'bold', value: 'default'},
  name: {name: 'magenta', style: 'normal', value: COLORS.MAGENTA},
  pipeline: {name: 'purple', style: 'normal', value: COLORS.PURPLE},
  space: {name: 'blue', style: 'bold', value: COLORS.BLUE},
  success: {name: 'green', style: 'normal', value: COLORS.GREEN},
  team: {name: 'cyan', style: 'bold', value: COLORS.CYAN},
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
