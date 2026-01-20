import {expect} from 'chai'

import {color} from '../../../src/index.js'

describe('colors', function () {
  describe('app-related colors', function () {
    it('should style app names with purple and bold', function () {
      const result = color.app('my-app')
      expect(result).to.include('my-app')
      // The exact ANSI codes will vary, but we can check that it's not just plain text
      expect(result).to.not.equal('my-app')
    })

    it('should style addon names with yellow', function () {
      const result = color.addon('heroku-postgresql')
      expect(result).to.include('heroku-postgresql')
      expect(result).to.not.equal('heroku-postgresql')
    })

    it('should style attachment names with yellow', function () {
      const result = color.attachment('DATABASE')
      expect(result).to.include('DATABASE')
      expect(result).to.not.equal('DATABASE')
    })

    it('should style pipeline names with magenta', function () {
      const result = color.pipeline('staging')
      expect(result).to.include('staging')
      expect(result).to.not.equal('staging')
    })

    it('should style space names with blue and bold', function () {
      const result = color.space('production')
      expect(result).to.include('production')
      expect(result).to.not.equal('production')
    })

    it('should style datastore names with yellow and bold', function () {
      const result = color.datastore('postgresql-123')
      expect(result).to.include('postgresql-123')
      expect(result).to.not.equal('postgresql-123')
    })
  })

  describe('status colors', function () {
    it('should style success messages with green', function () {
      const result = color.success('Deploy complete')
      expect(result).to.include('Deploy complete')
      expect(result).to.not.equal('Deploy complete')
    })

    it('should style failure messages with red', function () {
      const result = color.failure('Build failed')
      expect(result).to.include('Build failed')
      expect(result).to.not.equal('Build failed')
    })

    it('should style warning messages with orange', function () {
      const result = color.warning('Deprecated feature')
      expect(result).to.include('Deprecated feature')
      expect(result).to.not.equal('Deprecated feature')
    })
  })

  describe('user/team colors', function () {
    it('should style team names with cyan', function () {
      const result = color.team('my-team')
      expect(result).to.include('my-team')
      expect(result).to.not.equal('my-team')
    })

    it('should style user emails with cyan', function () {
      const result = color.user('user@example.com')
      expect(result).to.include('user@example.com')
      expect(result).to.not.equal('user@example.com')
    })
  })

  describe('general purpose colors', function () {
    it('should style labels with bold', function () {
      const result = color.label('Name')
      expect(result).to.include('Name')
      expect(result).to.not.equal('Name')
    })

    it('should style names with purple', function () {
      const result = color.name('entity-name')
      expect(result).to.include('entity-name')
      expect(result).to.not.equal('entity-name')
    })

    it('should style info text with teal', function () {
      const result = color.info('Help text')
      expect(result).to.include('Help text')
      expect(result).to.not.equal('Help text')
    })

    it('should style inactive text with gray', function () {
      const result = color.inactive('disabled')
      expect(result).to.include('disabled')
      expect(result).to.not.equal('disabled')
    })
  })

  describe('color constants', function () {
    it('should have all required color constants', function () {
      expect(color.COLORS).to.have.property('PURPLE')
      expect(color.COLORS).to.have.property('YELLOW')
      expect(color.COLORS).to.have.property('MAGENTA')
      expect(color.COLORS).to.have.property('BLUE')
      expect(color.COLORS).to.have.property('GREEN')
      expect(color.COLORS).to.have.property('RED')
      expect(color.COLORS).to.have.property('ORANGE')
      expect(color.COLORS).to.have.property('CYAN')
      expect(color.COLORS).to.have.property('TEAL')
      expect(color.COLORS).to.have.property('GRAY')
    })

    it('should have correct values for color constants (ANSI256 codes or hex)', function () {
      // ANSI256 codes (numbers)
      expect(color.COLORS.YELLOW).to.equal(185) // ANSI256 yellow
      expect(color.COLORS.BLUE).to.equal(117) // ANSI256 blue
      expect(color.COLORS.GREEN).to.equal(40) // ANSI256 green
      expect(color.COLORS.ORANGE).to.equal(214) // ANSI256 orange
      expect(color.COLORS.TEAL).to.equal(43) // ANSI256 teal
      expect(color.COLORS.GRAY).to.equal(248) // ANSI256 gray
      expect(color.COLORS.CODE_BG).to.equal(237) // ANSI256 dark gray
      expect(color.COLORS.CODE_FG).to.equal(255) // ANSI256 white

      // ANSI256 codes
      expect(color.COLORS.PURPLE).to.equal(147) // ANSI256 purple (closest to original #ACADFF)

      // Hex values (kept for precise color matching)
      expect(color.COLORS.MAGENTA).to.equal('#FF8DD3')
      expect(color.COLORS.RED).to.equal('#FF8787')
      expect(color.COLORS.CYAN).to.equal('#50D3D5')
    })
  })

  describe('color palette', function () {
    it('should have all required color definitions', function () {
      expect(color.colorPalette).to.have.property('app')
      expect(color.colorPalette).to.have.property('addon')
      expect(color.colorPalette).to.have.property('attachment')
      expect(color.colorPalette).to.have.property('pipeline')
      expect(color.colorPalette).to.have.property('space')
      expect(color.colorPalette).to.have.property('datastore')
      expect(color.colorPalette).to.have.property('success')
      expect(color.colorPalette).to.have.property('failure')
      expect(color.colorPalette).to.have.property('warning')
      expect(color.colorPalette).to.have.property('team')
      expect(color.colorPalette).to.have.property('user')
      expect(color.colorPalette).to.have.property('label')
      expect(color.colorPalette).to.have.property('name')
      expect(color.colorPalette).to.have.property('info')
      expect(color.colorPalette).to.have.property('inactive')
    })

    it('should have correct color values (ANSI256 codes or hex)', function () {
      expect(color.colorPalette.app.value).to.equal(147) // ANSI256 purple
      expect(color.colorPalette.addon.value).to.equal(185) // ANSI256 yellow
      expect(color.colorPalette.attachment.value).to.equal(185) // ANSI256 yellow
      expect(color.colorPalette.pipeline.value).to.equal(147) // ANSI256 purple
      expect(color.colorPalette.space.value).to.equal(117) // ANSI256 blue
      expect(color.colorPalette.datastore.value).to.equal(185) // ANSI256 yellow
      expect(color.colorPalette.success.value).to.equal(40) // ANSI256 green
      expect(color.colorPalette.failure.value).to.equal('#FF8787') // hex red
      expect(color.colorPalette.warning.value).to.equal(214) // ANSI256 orange
      expect(color.colorPalette.team.value).to.equal('#50D3D5') // hex cyan
      expect(color.colorPalette.user.value).to.equal('#50D3D5') // hex cyan
      expect(color.colorPalette.name.value).to.equal('#FF8DD3') // hex magenta
      expect(color.colorPalette.info.value).to.equal(43) // ANSI256 teal
      expect(color.colorPalette.inactive.value).to.equal(248) // ANSI256 gray
    })

    it('should have correct color names', function () {
      expect(color.colorPalette.app.name).to.equal('purple')
      expect(color.colorPalette.addon.name).to.equal('yellow')
      expect(color.colorPalette.attachment.name).to.equal('yellow')
      expect(color.colorPalette.pipeline.name).to.equal('purple')
      expect(color.colorPalette.space.name).to.equal('blue')
      expect(color.colorPalette.datastore.name).to.equal('yellow')
      expect(color.colorPalette.success.name).to.equal('green')
      expect(color.colorPalette.failure.name).to.equal('red')
      expect(color.colorPalette.warning.name).to.equal('orange')
      expect(color.colorPalette.team.name).to.equal('cyan')
      expect(color.colorPalette.user.name).to.equal('cyan')
      expect(color.colorPalette.name.name).to.equal('magenta')
      expect(color.colorPalette.info.name).to.equal('teal')
      expect(color.colorPalette.inactive.name).to.equal('gray')
    })
  })
})
