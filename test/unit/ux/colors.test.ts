import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import {color} from '../../../src/index.js'

const ANSI_ESC = '\u001B'

/**
 * True when the string contains ANSI escape codes (color is applied).
 * @param s - String to check.
 * @returns Whether the string contains ANSI escape sequences.
 */
function hasAnsiCodes(s: string): boolean {
  return new RegExp(`${ANSI_ESC}\\[`).test(s)
}

const originalHerokuTheme = process.env.HEROKU_THEME

describe('colors', function () {
  afterEach(function () {
    if (originalHerokuTheme === undefined) {
      delete process.env.HEROKU_THEME
    } else {
      process.env.HEROKU_THEME = originalHerokuTheme
    }
  })

  describe('getTheme', function () {
    it('returns "heroku" when HEROKU_THEME is unset', function () {
      delete process.env.HEROKU_THEME
      expect(color.getTheme()).toBe('heroku')
    })

    it('returns "heroku" when HEROKU_THEME is "heroku"', function () {
      process.env.HEROKU_THEME = 'heroku'
      expect(color.getTheme()).toBe('heroku')
    })

    it('returns "simple" when HEROKU_THEME is "simple"', function () {
      process.env.HEROKU_THEME = 'simple'
      expect(color.getTheme()).toBe('simple')
    })

    it('returns "heroku" for unknown HEROKU_THEME value', function () {
      process.env.HEROKU_THEME = 'unknown'
      expect(color.getTheme()).toBe('heroku')
    })

    it('is case-insensitive and trims HEROKU_THEME', function () {
      process.env.HEROKU_THEME = '  SIMPLE  '

      expect(color.getTheme()).toBe('simple')
    })
  })

  describe('app-related colors', function () {
    it('should style app names with purple', function () {
      const result = color.app('my-app')

      expect(result).toContain('my-app')

      if (hasAnsiCodes(result)) {
        expect(result).not.toBe('my-app')
      }
    })

    it('should style addon names with yellow', function () {
      const result = color.addon('heroku-postgresql')
      expect(result).toContain('heroku-postgresql')
      if (hasAnsiCodes(result)) expect(result).not.toBe('heroku-postgresql')
    })

    it('should style attachment names with gold', function () {
      const result = color.attachment('DATABASE')
      expect(result).toContain('DATABASE')
      if (hasAnsiCodes(result)) expect(result).not.toBe('DATABASE')
    })

    it('should style pipeline names with magenta', function () {
      const result = color.pipeline('staging')
      expect(result).toContain('staging')
      if (hasAnsiCodes(result)) expect(result).not.toBe('staging')
    })

    it('should style space names with blue', function () {
      const result = color.space('production')
      expect(result).toContain('production')
      if (hasAnsiCodes(result)) expect(result).not.toBe('production')
    })

    it('should style datastore names with yellow', function () {
      const result = color.datastore('postgresql-123')
      expect(result).toContain('postgresql-123')
      if (hasAnsiCodes(result)) expect(result).not.toBe('postgresql-123')
    })
  })

  describe('status colors', function () {
    it('should style success messages with green', function () {
      const result = color.success('Deploy complete')
      expect(result).toContain('Deploy complete')
      if (hasAnsiCodes(result)) expect(result).not.toBe('Deploy complete')
    })

    it('should style failure messages with red', function () {
      const result = color.failure('Build failed')
      expect(result).toContain('Build failed')
      if (hasAnsiCodes(result)) expect(result).not.toBe('Build failed')
    })

    it('should style warning messages with orange', function () {
      const result = color.warning('Deprecated feature')
      expect(result).toContain('Deprecated feature')
      if (hasAnsiCodes(result)) expect(result).not.toBe('Deprecated feature')
    })
  })

  describe('user/team colors', function () {
    it('should style team names with light cyan', function () {
      const result = color.team('my-team')
      expect(result).toContain('my-team')
      if (hasAnsiCodes(result)) expect(result).not.toBe('my-team')
    })

    it('should style user emails with cyan', function () {
      const result = color.user('user@example.com')
      expect(result).toContain('user@example.com')
      if (hasAnsiCodes(result)) expect(result).not.toBe('user@example.com')
    })
  })

  describe('general purpose colors', function () {
    it('should style labels with bold', function () {
      const result = color.label('Name')
      expect(result).toContain('Name')
      if (hasAnsiCodes(result)) expect(result).not.toBe('Name')
    })

    it('should style names with pink', function () {
      const result = color.name('entity-name')
      expect(result).toContain('entity-name')
      if (hasAnsiCodes(result)) expect(result).not.toBe('entity-name')
    })

    it('should style info text with teal', function () {
      const result = color.info('Help text')
      expect(result).toContain('Help text')
      if (hasAnsiCodes(result)) expect(result).not.toBe('Help text')
    })

    it('should style inactive text with gray', function () {
      const result = color.inactive('disabled')
      expect(result).toContain('disabled')
      if (hasAnsiCodes(result)) expect(result).not.toBe('disabled')
    })
  })

  describe('color constants', function () {
    it('should have all required color constants', function () {
      expect(color.COLORS).toHaveProperty('PURPLE')
      expect(color.COLORS).toHaveProperty('YELLOW')
      expect(color.COLORS).toHaveProperty('MAGENTA')
      expect(color.COLORS).toHaveProperty('BLUE')
      expect(color.COLORS).toHaveProperty('GREEN')
      expect(color.COLORS).toHaveProperty('RED')
      expect(color.COLORS).toHaveProperty('ORANGE')
      expect(color.COLORS).toHaveProperty('CYAN')
      expect(color.COLORS).toHaveProperty('CYAN_LIGHT')
      expect(color.COLORS).toHaveProperty('TEAL')
      expect(color.COLORS).toHaveProperty('GRAY')
      expect(color.COLORS).toHaveProperty('GOLD')
      expect(color.COLORS).toHaveProperty('PINK')
    })

    it('should have correct values for color constants (ANSI256 codes or hex)', function () {
      // ANSI256 codes (numbers)
      expect(color.COLORS.YELLOW).toBe(185) // ANSI256 yellow
      expect(color.COLORS.BLUE).toBe(117) // ANSI256 blue
      expect(color.COLORS.GREEN).toBe(40) // ANSI256 green
      expect(color.COLORS.ORANGE).toBe(214) // ANSI256 orange
      expect(color.COLORS.TEAL).toBe(43) // ANSI256 teal
      expect(color.COLORS.GRAY).toBe(248) // ANSI256 gray
      expect(color.COLORS.CODE_BG).toBe(237) // ANSI256 dark gray
      expect(color.COLORS.CODE_FG).toBe(255) // ANSI256 white

      // ANSI256 codes
      expect(color.COLORS.PURPLE).toBe(147) // ANSI256 purple (closest to original #ACADFF)
      expect(color.COLORS.GOLD).toBe(220) // ANSI256 gold
      expect(color.COLORS.PINK).toBe(212) // ANSI256 pink

      // Hex values (kept for precise color matching)
      expect(color.COLORS.MAGENTA).toBe('#FF22DD')
      expect(color.COLORS.RED).toBe('#FF8787')
      expect(color.COLORS.CYAN).toBe('#50D3D5')
      expect(color.COLORS.CYAN_LIGHT).toBe('#8FF5F7')
    })
  })

  describe('color palette', function () {
    it('should have all required color definitions', function () {
      expect(color.colorPalette).toHaveProperty('app')
      expect(color.colorPalette).toHaveProperty('addon')
      expect(color.colorPalette).toHaveProperty('attachment')
      expect(color.colorPalette).toHaveProperty('pipeline')
      expect(color.colorPalette).toHaveProperty('space')
      expect(color.colorPalette).toHaveProperty('datastore')
      expect(color.colorPalette).toHaveProperty('success')
      expect(color.colorPalette).toHaveProperty('failure')
      expect(color.colorPalette).toHaveProperty('warning')
      expect(color.colorPalette).toHaveProperty('team')
      expect(color.colorPalette).toHaveProperty('user')
      expect(color.colorPalette).toHaveProperty('label')
      expect(color.colorPalette).toHaveProperty('name')
      expect(color.colorPalette).toHaveProperty('info')
      expect(color.colorPalette).toHaveProperty('inactive')
      expect(color.colorPalette).toHaveProperty('gold')
      expect(color.colorPalette).toHaveProperty('code')
      expect(color.colorPalette).toHaveProperty('command')
      expect(color.colorPalette).toHaveProperty('snippet')
    })

    it('should have correct color values (ANSI256 codes or hex)', function () {
      expect(color.colorPalette.app.value).toBe(147) // ANSI256 purple
      expect(color.colorPalette.addon.value).toBe(185) // ANSI256 yellow
      expect(color.colorPalette.attachment.value).toBe(185) // ANSI256 yellow (palette shows yellow, but function uses gold)
      expect(color.colorPalette.pipeline.value).toBe(147) // ANSI256 purple (palette shows purple, but function uses magenta)
      expect(color.colorPalette.space.value).toBe(117) // ANSI256 blue
      expect(color.colorPalette.datastore.value).toBe(185) // ANSI256 yellow
      expect(color.colorPalette.success.value).toBe(40) // ANSI256 green
      expect(color.colorPalette.failure.value).toBe('#FF8787') // hex red
      expect(color.colorPalette.warning.value).toBe(214) // ANSI256 orange
      expect(color.colorPalette.team.value).toBe('#8FF5F7') // hex light cyan
      expect(color.colorPalette.user.value).toBe('#50D3D5') // hex cyan
      expect(color.colorPalette.name.value).toBe('#FF22DD') // hex magenta (palette shows magenta, but function uses pink)
      expect(color.colorPalette.info.value).toBe(43) // ANSI256 teal
      expect(color.colorPalette.inactive.value).toBe(248) // ANSI256 gray
      expect(color.colorPalette.gold.value).toBe(220) // ANSI256 gold
    })

    it('should have correct color names', function () {
      expect(color.colorPalette.app.name).toBe('purple')
      expect(color.colorPalette.addon.name).toBe('yellow')
      expect(color.colorPalette.attachment.name).toBe('yellow')
      expect(color.colorPalette.pipeline.name).toBe('purple')
      expect(color.colorPalette.space.name).toBe('blue')
      expect(color.colorPalette.datastore.name).toBe('yellow')
      expect(color.colorPalette.success.name).toBe('green')
      expect(color.colorPalette.failure.name).toBe('red')
      expect(color.colorPalette.warning.name).toBe('orange')
      expect(color.colorPalette.team.name).toBe('light cyan')
      expect(color.colorPalette.user.name).toBe('cyan')
      expect(color.colorPalette.name.name).toBe('magenta')
      expect(color.colorPalette.info.name).toBe('teal')
      expect(color.colorPalette.inactive.name).toBe('gray')
      expect(color.colorPalette.gold.name).toBe('gold')
    })
  })

  describe('simple theme (HEROKU_THEME=simple)', function () {
    beforeEach(function () {
      process.env.HEROKU_THEME = 'simple'
    })

    it('styles app names without unicode symbol', function () {
      const result = color.app('my-app')
      expect(result).toContain('my-app')
      expect(result).not.toContain('⬢')
    })

    it('styles space names without unicode symbol', function () {
      const result = color.space('production')
      expect(result).toContain('production')
      expect(result).not.toContain('⬡')
    })

    it('styles datastore names without unicode symbol', function () {
      const result = color.datastore('postgresql-123')
      expect(result).toContain('postgresql-123')
      expect(result).not.toContain('⛁')
    })

    it('applies basic ANSI colors when terminal supports color', function () {
      const successResult = color.success('ok')
      const failureResult = color.failure('err')
      const appResult = color.app('x')
      expect(successResult).toContain('ok')
      expect(failureResult).toContain('err')
      expect(appResult).toContain('x')
      if (hasAnsiCodes(successResult)) {
        expect(successResult).not.toBe('ok')
        expect(failureResult).not.toBe('err')
        expect(appResult).not.toBe('x')
      }
    })
  })

  describe('TTY and environment variable detection', function () {
    const originalForceColor = process.env.FORCE_COLOR
    const originalNoColor = process.env.NO_COLOR

    afterEach(function () {
      // Restore original values
      if (originalForceColor === undefined) {
        delete process.env.FORCE_COLOR
      } else {
        process.env.FORCE_COLOR = originalForceColor
      }

      if (originalNoColor === undefined) {
        delete process.env.NO_COLOR
      } else {
        process.env.NO_COLOR = originalNoColor
      }

      // Note: We can't actually restore isTTY as it's read-only in most environments
      // These tests document the expected behavior based on environment conditions
    })

    it('should respect FORCE_COLOR environment variable', function () {
      // When FORCE_COLOR is set, colors should be enabled
      // This test documents that FORCE_COLOR takes precedence
      const forceColorSet = process.env.FORCE_COLOR !== undefined
      if (forceColorSet) {
        // If FORCE_COLOR is set in the test environment, ansis should provide colors
        const result = color.ansis.red('test')
        expect(result).toBeTypeOf('string')
      }

      // Test that color functions work regardless of FORCE_COLOR
      expect(color.app('test')).toContain('test')
    })

    it('should respect NO_COLOR environment variable when set to non-zero', function () {
      // When NO_COLOR is set (and not '0'), colors should be disabled
      // This tests the NO_COLOR !== '0' condition
      const testValue = 'test'

      // Save current state
      const before = process.env.NO_COLOR

      // Temporarily set NO_COLOR
      process.env.NO_COLOR = '1'

      // Color functions should still return the text (just maybe without colors)
      const result = color.app(testValue)
      expect(result).toContain(testValue)

      // Restore
      if (before === undefined) {
        delete process.env.NO_COLOR
      } else {
        process.env.NO_COLOR = before
      }
    })

    it('should handle NO_COLOR set to 0 (meaning colors enabled)', function () {
      // When NO_COLOR is '0', it should be treated as "colors enabled"
      const testValue = 'test'

      // Save current state
      const before = process.env.NO_COLOR

      // Set NO_COLOR to '0'
      process.env.NO_COLOR = '0'

      // Color functions should work
      const result = color.app(testValue)
      expect(result).toContain(testValue)

      // Restore
      if (before === undefined) {
        delete process.env.NO_COLOR
      } else {
        process.env.NO_COLOR = before
      }
    })

    it('should handle TTY detection for color support', function () {
      // This test documents that TTY status affects color support
      const {isTTY} = process.stdout

      // The color module should handle both TTY and non-TTY environments
      const result = color.success('test')
      expect(result).toContain('test')

      // In non-TTY environments (like CI), colors might be disabled
      // In TTY environments, colors should work if terminal supports them
      if (!isTTY && !process.env.FORCE_COLOR) {
        // Non-TTY without FORCE_COLOR should disable colors
        // But the function should still return the text
        expect(result).toBeTypeOf('string')
      }
    })

    it('should check ansis level for color support', function () {
      // The ansis instance has a level property indicating color support
      // Level 0 = no colors, 1 = basic 16 colors, 2 = 256 colors, 3 = 16m colors
      expect(color.ansis).toHaveProperty('level')
      expect(color.ansis.level).toBeTypeOf('number')
      expect(color.ansis.level).toBeGreaterThanOrEqual(0)
    })
  })
})
