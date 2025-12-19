import ansi from 'ansis'

/**
 * Color constants for Heroku CLI output
 * Each hex value corresponds to a specific color in the design system
 */
const COLORS = {
  // Blue tones
  BLUE: '#62CBF4',

  // Command tones (dark gray background, white foreground)
  CODE_BG: '#3A3A3A',
  CODE_FG: '#FFFFFF',

  // Cyan tones
  CYAN: '#50D3D5',

  // Gray tones
  GRAY: '#B6B6B6',

  // Green tones
  GREEN: '#00D300',

  // Magenta tones
  MAGENTA: '#FF8DD3',

  // Orange tones
  ORANGE: '#F29D00',

  // Purple tones
  PURPLE: '#ACADFF',

  // Red tones
  RED: '#FF8787',

  // Teal tones
  TEAL: '#00D4AA',

  // Yellow tones
  YELLOW: '#BFBD25',
} as const

/**
 * Color definitions for Heroku CLI output
 * Each color has a specific purpose and hex value as defined in the design system
 */

// Colors for entities on the Heroku platform
export const app = (text: string) => ansi.hex(COLORS.PURPLE).bold(`⬢ ${text}`)
export const pipeline = (text: string) => ansi.hex(COLORS.PURPLE)(text)
export const space = (text: string) => ansi.hex(COLORS.BLUE).bold(`⬡ ${text}`)
export const datastore = (text: string) => ansi.hex(COLORS.YELLOW).bold(`☷ ${text}`)
export const addon = (text: string) => ansi.hex(COLORS.YELLOW).bold(text)
export const attachment = (text: string) => ansi.hex(COLORS.YELLOW)(text)
export const name = (text: string) => ansi.hex(COLORS.MAGENTA)(text)

// Status colors
export const success = (text: string) => ansi.hex(COLORS.GREEN)(text)
export const failure = (text: string) => ansi.hex(COLORS.RED)(text)
export const warning = (text: string) => ansi.hex(COLORS.ORANGE)(text)

// User/Team colors
export const team = (text: string) => ansi.hex(COLORS.CYAN).bold(text)
export const user = (text: string) => ansi.hex(COLORS.CYAN)(text)

// General purpose colors
export const label = (text: string) => ansi.bold(text)
export const info = (text: string) => ansi.hex(COLORS.TEAL)(text)
export const inactive = (text: string) => ansi.hex(COLORS.GRAY)(text)
export const command = (text: string) => ansi.bgHex(COLORS.CODE_BG).hex(COLORS.CODE_FG).bold(` $ ${text} `)
export const code = (text: string) => ansi.bgHex(COLORS.CODE_BG).hex(COLORS.CODE_FG).bold(`${text} `)

/**
 * Color palette for reference
 */
export const colorPalette = {
  addon: {hex: COLORS.YELLOW, name: 'yellow', style: 'bold'},
  app: {hex: COLORS.PURPLE, name: 'purple', style: 'bold'},
  attachment: {hex: COLORS.YELLOW, name: 'yellow', style: 'normal'},
  command: {hex: COLORS.CODE_FG, name: 'white on dark gray', style: 'bold'},
  datastore: {hex: COLORS.YELLOW, name: 'yellow', style: 'bold'},
  failure: {hex: COLORS.RED, name: 'red', style: 'normal'},
  inactive: {hex: COLORS.GRAY, name: 'gray', style: 'normal'},
  info: {hex: COLORS.TEAL, name: 'teal', style: 'normal'},
  label: {hex: 'default', name: 'bright white/black', style: 'bold'},
  name: {hex: COLORS.MAGENTA, name: 'magenta', style: 'normal'},
  pipeline: {hex: COLORS.PURPLE, name: 'purple', style: 'normal'},
  space: {hex: COLORS.BLUE, name: 'blue', style: 'bold'},
  success: {hex: COLORS.GREEN, name: 'green', style: 'normal'},
  team: {hex: COLORS.CYAN, name: 'cyan', style: 'bold'},
  user: {hex: COLORS.CYAN, name: 'cyan', style: 'normal'},
  warning: {hex: COLORS.ORANGE, name: 'orange', style: 'normal'},
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
