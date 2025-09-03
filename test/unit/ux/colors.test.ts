import {expect} from 'chai'
import * as colors from '../../../src/ux/colors.js'

describe('colors', () => {
  describe('app-related colors', () => {
    it('should style app names with purple and bold', () => {
      const result = colors.app('my-app')
      expect(result).to.include('my-app')
      // The exact ANSI codes will vary, but we can check that it's not just plain text
      expect(result).to.not.equal('my-app')
    })

    it('should style addon names with yellow', () => {
      const result = colors.addon('heroku-postgresql')
      expect(result).to.include('heroku-postgresql')
      expect(result).to.not.equal('heroku-postgresql')
    })

    it('should style attachment names with yellow', () => {
      const result = colors.attachment('DATABASE')
      expect(result).to.include('DATABASE')
      expect(result).to.not.equal('DATABASE')
    })

    it('should style pipeline names with magenta', () => {
      const result = colors.pipeline('staging')
      expect(result).to.include('staging')
      expect(result).to.not.equal('staging')
    })

    it('should style space names with blue and bold', () => {
      const result = colors.space('production')
      expect(result).to.include('production')
      expect(result).to.not.equal('production')
    })

    it('should style datastore names with yellow and bold', () => {
      const result = colors.datastore('postgresql-123')
      expect(result).to.include('postgresql-123')
      expect(result).to.not.equal('postgresql-123')
    })
  })

  describe('status colors', () => {
    it('should style success messages with green', () => {
      const result = colors.success('Deploy complete')
      expect(result).to.include('Deploy complete')
      expect(result).to.not.equal('Deploy complete')
    })

    it('should style failure messages with red', () => {
      const result = colors.failure('Build failed')
      expect(result).to.include('Build failed')
      expect(result).to.not.equal('Build failed')
    })

    it('should style warning messages with orange', () => {
      const result = colors.warning('Deprecated feature')
      expect(result).to.include('Deprecated feature')
      expect(result).to.not.equal('Deprecated feature')
    })
  })

  describe('user/team colors', () => {
    it('should style team names with cyan', () => {
      const result = colors.team('my-team')
      expect(result).to.include('my-team')
      expect(result).to.not.equal('my-team')
    })

    it('should style user emails with cyan', () => {
      const result = colors.user('user@example.com')
      expect(result).to.include('user@example.com')
      expect(result).to.not.equal('user@example.com')
    })
  })

  describe('general purpose colors', () => {
    it('should style labels with bold', () => {
      const result = colors.label('Name')
      expect(result).to.include('Name')
      expect(result).to.not.equal('Name')
    })

    it('should style names with purple', () => {
      const result = colors.name('entity-name')
      expect(result).to.include('entity-name')
      expect(result).to.not.equal('entity-name')
    })

    it('should style info text with teal', () => {
      const result = colors.info('Help text')
      expect(result).to.include('Help text')
      expect(result).to.not.equal('Help text')
    })

    it('should style inactive text with gray', () => {
      const result = colors.inactive('disabled')
      expect(result).to.include('disabled')
      expect(result).to.not.equal('disabled')
    })
  })

  describe('color constants', () => {
    it('should have all required color constants', () => {
      expect(colors.COLORS).to.have.property('PURPLE')
      expect(colors.COLORS).to.have.property('YELLOW')
      expect(colors.COLORS).to.have.property('MAGENTA')
      expect(colors.COLORS).to.have.property('BLUE')
      expect(colors.COLORS).to.have.property('GREEN')
      expect(colors.COLORS).to.have.property('RED')
      expect(colors.COLORS).to.have.property('ORANGE')
      expect(colors.COLORS).to.have.property('CYAN')
      expect(colors.COLORS).to.have.property('TEAL')
      expect(colors.COLORS).to.have.property('GRAY')
    })

    it('should have correct hex values for color constants', () => {
      expect(colors.COLORS.PURPLE).to.equal('#ACADFF')
      expect(colors.COLORS.YELLOW).to.equal('#BFBD25')
      expect(colors.COLORS.MAGENTA).to.equal('#FF8DD3')
      expect(colors.COLORS.BLUE).to.equal('#62CBF4')
      expect(colors.COLORS.GREEN).to.equal('#00D300')
      expect(colors.COLORS.RED).to.equal('#FF8787')
      expect(colors.COLORS.ORANGE).to.equal('#F29D00')
      expect(colors.COLORS.CYAN).to.equal('#50D3D5')
      expect(colors.COLORS.TEAL).to.equal('#00D4AA')
      expect(colors.COLORS.GRAY).to.equal('#B6B6B6')
    })
  })

  describe('color palette', () => {
    it('should have all required color definitions', () => {
      expect(colors.colorPalette).to.have.property('app')
      expect(colors.colorPalette).to.have.property('addon')
      expect(colors.colorPalette).to.have.property('attachment')
      expect(colors.colorPalette).to.have.property('pipeline')
      expect(colors.colorPalette).to.have.property('space')
      expect(colors.colorPalette).to.have.property('datastore')
      expect(colors.colorPalette).to.have.property('success')
      expect(colors.colorPalette).to.have.property('failure')
      expect(colors.colorPalette).to.have.property('warning')
      expect(colors.colorPalette).to.have.property('team')
      expect(colors.colorPalette).to.have.property('user')
      expect(colors.colorPalette).to.have.property('label')
      expect(colors.colorPalette).to.have.property('name')
      expect(colors.colorPalette).to.have.property('info')
      expect(colors.colorPalette).to.have.property('inactive')
    })

    it('should have correct hex values', () => {
      expect(colors.colorPalette.app.hex).to.equal('#ACADFF')
      expect(colors.colorPalette.addon.hex).to.equal('#BFBD25')
      expect(colors.colorPalette.attachment.hex).to.equal('#BFBD25')
      expect(colors.colorPalette.pipeline.hex).to.equal('#FF8DD3')
      expect(colors.colorPalette.space.hex).to.equal('#62CBF4')
      expect(colors.colorPalette.datastore.hex).to.equal('#BFBD25')
      expect(colors.colorPalette.success.hex).to.equal('#00D300')
      expect(colors.colorPalette.failure.hex).to.equal('#FF8787')
      expect(colors.colorPalette.warning.hex).to.equal('#F29D00')
      expect(colors.colorPalette.team.hex).to.equal('#50D3D5')
      expect(colors.colorPalette.user.hex).to.equal('#50D3D5')
      expect(colors.colorPalette.name.hex).to.equal('#ACADFF')
      expect(colors.colorPalette.info.hex).to.equal('#00D4AA')
      expect(colors.colorPalette.inactive.hex).to.equal('#B6B6B6')
    })

    it('should have correct color names', () => {
      expect(colors.colorPalette.app.name).to.equal('purple')
      expect(colors.colorPalette.addon.name).to.equal('yellow')
      expect(colors.colorPalette.attachment.name).to.equal('yellow')
      expect(colors.colorPalette.pipeline.name).to.equal('magenta')
      expect(colors.colorPalette.space.name).to.equal('blue')
      expect(colors.colorPalette.datastore.name).to.equal('yellow')
      expect(colors.colorPalette.success.name).to.equal('green')
      expect(colors.colorPalette.failure.name).to.equal('red')
      expect(colors.colorPalette.warning.name).to.equal('orange')
      expect(colors.colorPalette.team.name).to.equal('cyan')
      expect(colors.colorPalette.user.name).to.equal('cyan')
      expect(colors.colorPalette.name.name).to.equal('purple')
      expect(colors.colorPalette.info.name).to.equal('teal')
      expect(colors.colorPalette.inactive.name).to.equal('gray')
    })

    it('should have correct styles', () => {
      expect(colors.colorPalette.app.style).to.equal('bold')
      expect(colors.colorPalette.addon.style).to.equal('normal')
      expect(colors.colorPalette.attachment.style).to.equal('normal')
      expect(colors.colorPalette.pipeline.style).to.equal('normal')
      expect(colors.colorPalette.space.style).to.equal('bold')
      expect(colors.colorPalette.datastore.style).to.equal('bold')
      expect(colors.colorPalette.success.style).to.equal('normal')
      expect(colors.colorPalette.failure.style).to.equal('normal')
      expect(colors.colorPalette.warning.style).to.equal('normal')
      expect(colors.colorPalette.team.style).to.equal('normal')
      expect(colors.colorPalette.user.style).to.equal('normal')
      expect(colors.colorPalette.label.style).to.equal('bold')
      expect(colors.colorPalette.name.style).to.equal('normal')
      expect(colors.colorPalette.info.style).to.equal('normal')
      expect(colors.colorPalette.inactive.style).to.equal('normal')
    })
  })
})
