import {expect} from 'chai'

import {
  getAddonService,
  isAdvancedDatabase,
  isAdvancedPrivateDatabase,
  isEssentialDatabase,
  isLegacyDatabase,
  isLegacyEssentialDatabase,
  isPostgresAddon,
} from '../../../../src/utils/addons/helpers.js'
import {
  advancedDatabase,
  advancedPrivateDatabase,
  advancedShieldDatabase,
  basicDatabase,
  devDatabase,
  essentialDatabase,
  miniDatabase,
  nonPostgresAddon,
  performanceDatabase,
  premiumDatabase,
  privateDatabase,
  shieldDatabase,
  standardDatabase,
} from '../../../fixtures/addon-mocks.js'

describe('addons/helpers', function () {
  describe('getAddonService', function () {
    it('returns the Heroku Postgres add-on service slug if no environment variables are set', function () {
      const originalEnv = process.env
      delete process.env.HEROKU_POSTGRESQL_ADDON_NAME
      delete process.env.HEROKU_DATA_SERVICE
      expect(getAddonService()).to.be.equal('heroku-postgresql')
      process.env = originalEnv
    })

    it('returns the value of the HEROKU_POSTGRESQL_ADDON_NAME environment variable if set', function () {
      const originalEnv = process.env
      process.env.HEROKU_POSTGRESQL_ADDON_NAME = 'heroku-postgresql-devname'
      expect(getAddonService()).to.be.equal('heroku-postgresql-devname')
      process.env = originalEnv
    })

    it('returns the value of the HEROKU_DATA_SERVICE environment variable if set', function () {
      const originalEnv = process.env
      process.env.HEROKU_DATA_SERVICE = 'heroku-postgresql-devname'
      expect(getAddonService()).to.be.equal('heroku-postgresql-devname')
      process.env = originalEnv
    })

    it('prioritizes the value of the HEROKU_POSTGRESQL_ADDON_NAME environment variable over the HEROKU_DATA_SERVICE environment variable if both areset', function () {
      const originalEnv = process.env
      process.env.HEROKU_POSTGRESQL_ADDON_NAME = 'heroku-postgresql-devname1'
      process.env.HEROKU_DATA_SERVICE = 'heroku-postgresql-devname2'
      expect(getAddonService()).to.be.equal('heroku-postgresql-devname1')
      process.env = originalEnv
    })
  })

  describe('isPostgresAddon', function () {
    let originalEnv: NodeJS.ProcessEnv

    beforeEach(function () {
      originalEnv = process.env
      delete process.env.HEROKU_POSTGRESQL_ADDON_NAME
      delete process.env.HEROKU_DATA_SERVICE
    })

    afterEach(function () {
      process.env = originalEnv
    })

    // Advanced Tier Databases
    it('returns true for an Advanced database', function () {
      expect(isPostgresAddon(advancedDatabase)).to.be.true
    })

    it('returns true for an Advanced Private database', function () {
      expect(isPostgresAddon(advancedPrivateDatabase)).to.be.true
    })

    it('returns true for an Advanced Shield database', function () {
      expect(isPostgresAddon(advancedShieldDatabase)).to.be.true
    })

    it('returns true for a Performance database', function () {
      expect(isPostgresAddon(performanceDatabase)).to.be.true
    })

    // Essential Tier Databases
    it('returns true for an Essential database', function () {
      expect(isPostgresAddon(essentialDatabase)).to.be.true
    })

    // Non-Advanced Tier Databases
    it('returns true for a Premium database', function () {
      expect(isPostgresAddon(premiumDatabase)).to.be.true
    })

    it('returns true for a Private database', function () {
      expect(isPostgresAddon(privateDatabase)).to.be.true
    })

    it('returns true for a Shield database', function () {
      expect(isPostgresAddon(shieldDatabase)).to.be.true
    })

    it('returns true for a Standard database', function () {
      expect(isPostgresAddon(standardDatabase)).to.be.true
    })

    // Legacy Essential Tier Databases
    it('returns true for a Dev database', function () {
      expect(isPostgresAddon(devDatabase)).to.be.true
    })

    it('returns true for a Basic database', function () {
      expect(isPostgresAddon(basicDatabase)).to.be.true
    })

    it('returns true for a Mini database', function () {
      expect(isPostgresAddon(miniDatabase)).to.be.true
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isPostgresAddon(nonPostgresAddon)).to.be.false
    })
  })

  describe('isAdvancedDatabase', function () {
    // Advanced Tier Databases
    it('returns true for an Advanced database', function () {
      expect(isAdvancedDatabase(advancedDatabase)).to.be.true
    })

    it('returns true for an Advanced Private database', function () {
      expect(isAdvancedDatabase(advancedPrivateDatabase)).to.be.true
    })

    it('returns true for an Advanced Shield database', function () {
      expect(isAdvancedDatabase(advancedShieldDatabase)).to.be.true
    })

    it('returns true for a Performance database', function () {
      expect(isAdvancedDatabase(performanceDatabase)).to.be.true
    })

    // Essential Tier Databases
    it('returns false for an Essential database', function () {
      expect(isAdvancedDatabase(essentialDatabase)).to.be.false
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isAdvancedDatabase(premiumDatabase)).to.be.false
    })

    it('returns false for a Private database', function () {
      expect(isAdvancedDatabase(privateDatabase)).to.be.false
    })

    it('returns false for a Shield database', function () {
      expect(isAdvancedDatabase(shieldDatabase)).to.be.false
    })

    it('returns false for a Standard database', function () {
      expect(isAdvancedDatabase(standardDatabase)).to.be.false
    })

    // Legacy Essential Tier Databases
    it('returns false for a Dev database', function () {
      expect(isAdvancedDatabase(devDatabase)).to.be.false
    })

    it('returns false for a Basic database', function () {
      expect(isAdvancedDatabase(basicDatabase)).to.be.false
    })

    it('returns false for a Mini database', function () {
      expect(isAdvancedDatabase(miniDatabase)).to.be.false
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isAdvancedDatabase(nonPostgresAddon)).to.be.false
    })
  })

  describe('isAdvancedPrivateDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database in the Common Runtime', function () {
      expect(isAdvancedPrivateDatabase(advancedDatabase)).to.be.false
    })

    it('returns true for an Advanced database in a Private Space', function () {
      expect(isAdvancedPrivateDatabase(advancedPrivateDatabase)).to.be.true
    })

    it('returns true for an Advanced database in a Shield Private Space', function () {
      expect(isAdvancedPrivateDatabase(advancedShieldDatabase)).to.be.true
    })

    it('returns false for a Performance database in the Common Runtime', function () {
      expect(isAdvancedPrivateDatabase(performanceDatabase)).to.be.false
    })

    // Essential Tier Databases
    it('returns false for an Essential database', function () {
      expect(isAdvancedPrivateDatabase(essentialDatabase)).to.be.false
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isAdvancedPrivateDatabase(premiumDatabase)).to.be.false
    })

    it('returns false for a Private database', function () {
      expect(isAdvancedPrivateDatabase(privateDatabase)).to.be.false
    })

    it('returns false for a Shield database', function () {
      expect(isAdvancedPrivateDatabase(shieldDatabase)).to.be.false
    })

    it('returns false for a Standard database', function () {
      expect(isAdvancedPrivateDatabase(standardDatabase)).to.be.false
    })

    // Legacy Essential Tier Databases
    it('returns false for a Dev database', function () {
      expect(isAdvancedPrivateDatabase(devDatabase)).to.be.false
    })

    it('returns false for a Basic database', function () {
      expect(isAdvancedPrivateDatabase(basicDatabase)).to.be.false
    })

    it('returns false for a Mini database', function () {
      expect(isAdvancedPrivateDatabase(miniDatabase)).to.be.false
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isAdvancedPrivateDatabase(nonPostgresAddon)).to.be.false
    })
  })

  describe('isLegacyDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database', function () {
      expect(isLegacyDatabase(advancedDatabase)).to.be.false
    })

    it('returns false for an Advanced Private database', function () {
      expect(isLegacyDatabase(advancedPrivateDatabase)).to.be.false
    })

    it('returns false for an Advanced Shield database', function () {
      expect(isLegacyDatabase(advancedShieldDatabase)).to.be.false
    })

    it('returns false for a Performance database', function () {
      expect(isLegacyDatabase(performanceDatabase)).to.be.false
    })

    // Essential Tier Databases
    it('returns true for an Essential database', function () {
      expect(isLegacyDatabase(essentialDatabase)).to.be.true
    })

    // Non-Advanced Tier Databases
    it('returns true for a Premium database', function () {
      expect(isLegacyDatabase(premiumDatabase)).to.be.true
    })

    it('returns true for a Private database', function () {
      expect(isLegacyDatabase(privateDatabase)).to.be.true
    })

    it('returns true for a Shield database', function () {
      expect(isLegacyDatabase(shieldDatabase)).to.be.true
    })

    it('returns true for a Standard database', function () {
      expect(isLegacyDatabase(standardDatabase)).to.be.true
    })

    // Legacy Essential Tier Databases
    it('returns true for a Dev database', function () {
      expect(isLegacyDatabase(devDatabase)).to.be.true
    })

    it('returns true for a Basic database', function () {
      expect(isLegacyDatabase(basicDatabase)).to.be.true
    })

    it('returns true for a Mini database', function () {
      expect(isLegacyDatabase(miniDatabase)).to.be.true
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isLegacyDatabase(nonPostgresAddon)).to.be.false
    })
  })

  describe('isLegacyEssentialDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database', function () {
      expect(isLegacyEssentialDatabase(advancedDatabase)).to.be.false
    })

    it('returns false for an Advanced Private database', function () {
      expect(isLegacyEssentialDatabase(advancedPrivateDatabase)).to.be.false
    })

    it('returns false for an Advanced Shield database', function () {
      expect(isLegacyEssentialDatabase(advancedShieldDatabase)).to.be.false
    })

    it('returns false for a Performance database', function () {
      expect(isLegacyEssentialDatabase(performanceDatabase)).to.be.false
    })

    // Essential Tier Databases
    it('returns false for an Essential database', function () {
      expect(isLegacyEssentialDatabase(essentialDatabase)).to.be.false
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isLegacyEssentialDatabase(premiumDatabase)).to.be.false
    })

    it('returns false for a Private database', function () {
      expect(isLegacyEssentialDatabase(privateDatabase)).to.be.false
    })

    it('returns false for a Shield database', function () {
      expect(isLegacyEssentialDatabase(shieldDatabase)).to.be.false
    })

    it('returns false for a Standard database', function () {
      expect(isLegacyEssentialDatabase(standardDatabase)).to.be.false
    })

    // Legacy Essential Tier Databases
    it('returns true for a Dev database', function () {
      expect(isLegacyEssentialDatabase(devDatabase)).to.be.true
    })

    it('returns true for a Basic database', function () {
      expect(isLegacyEssentialDatabase(basicDatabase)).to.be.true
    })

    it('returns true for a Mini database', function () {
      expect(isLegacyEssentialDatabase(miniDatabase)).to.be.true
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isLegacyEssentialDatabase(nonPostgresAddon)).to.be.false
    })
  })

  describe('isEssentialDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database', function () {
      expect(isEssentialDatabase(advancedDatabase)).to.be.false
    })

    it('returns false for an Advanced Private database', function () {
      expect(isEssentialDatabase(advancedPrivateDatabase)).to.be.false
    })

    it('returns false for an Advanced Shield database', function () {
      expect(isEssentialDatabase(advancedShieldDatabase)).to.be.false
    })

    it('returns false for a Performance database', function () {
      expect(isEssentialDatabase(performanceDatabase)).to.be.false
    })

    // Essential Tier Databases
    it('returns true for an Essential database', function () {
      expect(isEssentialDatabase(essentialDatabase)).to.be.true
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isEssentialDatabase(premiumDatabase)).to.be.false
    })

    it('returns false for a Private database', function () {
      expect(isEssentialDatabase(privateDatabase)).to.be.false
    })

    it('returns false for a Shield database', function () {
      expect(isEssentialDatabase(shieldDatabase)).to.be.false
    })

    it('returns false for a Standard database', function () {
      expect(isEssentialDatabase(standardDatabase)).to.be.false
    })

    // Legacy Essential Tier Databases
    it('returns false for a Dev database', function () {
      expect(isEssentialDatabase(devDatabase)).to.be.false
    })

    it('returns false for a Basic database', function () {
      expect(isEssentialDatabase(basicDatabase)).to.be.false
    })

    it('returns false for a Mini database', function () {
      expect(isEssentialDatabase(miniDatabase)).to.be.false
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isEssentialDatabase(nonPostgresAddon)).to.be.false
    })
  })
})
