import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

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
      expect(getAddonService()).toBe('heroku-postgresql')
      process.env = originalEnv
    })

    it('returns the value of the HEROKU_POSTGRESQL_ADDON_NAME environment variable if set', function () {
      const originalEnv = process.env
      process.env.HEROKU_POSTGRESQL_ADDON_NAME = 'heroku-postgresql-devname'
      expect(getAddonService()).toBe('heroku-postgresql-devname')
      process.env = originalEnv
    })

    it('returns the value of the HEROKU_DATA_SERVICE environment variable if set', function () {
      const originalEnv = process.env
      process.env.HEROKU_DATA_SERVICE = 'heroku-postgresql-devname'
      expect(getAddonService()).toBe('heroku-postgresql-devname')
      process.env = originalEnv
    })

    it('prioritizes the value of the HEROKU_POSTGRESQL_ADDON_NAME environment variable over the HEROKU_DATA_SERVICE environment variable if both areset', function () {
      const originalEnv = process.env
      process.env.HEROKU_POSTGRESQL_ADDON_NAME = 'heroku-postgresql-devname1'
      process.env.HEROKU_DATA_SERVICE = 'heroku-postgresql-devname2'
      expect(getAddonService()).toBe('heroku-postgresql-devname1')
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
      expect(isPostgresAddon(advancedDatabase)).toBe(true)
    })

    it('returns true for an Advanced Private database', function () {
      expect(isPostgresAddon(advancedPrivateDatabase)).toBe(true)
    })

    it('returns true for an Advanced Shield database', function () {
      expect(isPostgresAddon(advancedShieldDatabase)).toBe(true)
    })

    it('returns true for a Performance database', function () {
      expect(isPostgresAddon(performanceDatabase)).toBe(true)
    })

    // Essential Tier Databases
    it('returns true for an Essential database', function () {
      expect(isPostgresAddon(essentialDatabase)).toBe(true)
    })

    // Non-Advanced Tier Databases
    it('returns true for a Premium database', function () {
      expect(isPostgresAddon(premiumDatabase)).toBe(true)
    })

    it('returns true for a Private database', function () {
      expect(isPostgresAddon(privateDatabase)).toBe(true)
    })

    it('returns true for a Shield database', function () {
      expect(isPostgresAddon(shieldDatabase)).toBe(true)
    })

    it('returns true for a Standard database', function () {
      expect(isPostgresAddon(standardDatabase)).toBe(true)
    })

    // Legacy Essential Tier Databases
    it('returns true for a Dev database', function () {
      expect(isPostgresAddon(devDatabase)).toBe(true)
    })

    it('returns true for a Basic database', function () {
      expect(isPostgresAddon(basicDatabase)).toBe(true)
    })

    it('returns true for a Mini database', function () {
      expect(isPostgresAddon(miniDatabase)).toBe(true)
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isPostgresAddon(nonPostgresAddon)).toBe(false)
    })
  })

  describe('isAdvancedDatabase', function () {
    // Advanced Tier Databases
    it('returns true for an Advanced database', function () {
      expect(isAdvancedDatabase(advancedDatabase)).toBe(true)
    })

    it('returns true for an Advanced Private database', function () {
      expect(isAdvancedDatabase(advancedPrivateDatabase)).toBe(true)
    })

    it('returns true for an Advanced Shield database', function () {
      expect(isAdvancedDatabase(advancedShieldDatabase)).toBe(true)
    })

    it('returns true for a Performance database', function () {
      expect(isAdvancedDatabase(performanceDatabase)).toBe(true)
    })

    // Essential Tier Databases
    it('returns false for an Essential database', function () {
      expect(isAdvancedDatabase(essentialDatabase)).toBe(false)
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isAdvancedDatabase(premiumDatabase)).toBe(false)
    })

    it('returns false for a Private database', function () {
      expect(isAdvancedDatabase(privateDatabase)).toBe(false)
    })

    it('returns false for a Shield database', function () {
      expect(isAdvancedDatabase(shieldDatabase)).toBe(false)
    })

    it('returns false for a Standard database', function () {
      expect(isAdvancedDatabase(standardDatabase)).toBe(false)
    })

    // Legacy Essential Tier Databases
    it('returns false for a Dev database', function () {
      expect(isAdvancedDatabase(devDatabase)).toBe(false)
    })

    it('returns false for a Basic database', function () {
      expect(isAdvancedDatabase(basicDatabase)).toBe(false)
    })

    it('returns false for a Mini database', function () {
      expect(isAdvancedDatabase(miniDatabase)).toBe(false)
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isAdvancedDatabase(nonPostgresAddon)).toBe(false)
    })
  })

  describe('isAdvancedPrivateDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database in the Common Runtime', function () {
      expect(isAdvancedPrivateDatabase(advancedDatabase)).toBe(false)
    })

    it('returns true for an Advanced database in a Private Space', function () {
      expect(isAdvancedPrivateDatabase(advancedPrivateDatabase)).toBe(true)
    })

    it('returns true for an Advanced database in a Shield Private Space', function () {
      expect(isAdvancedPrivateDatabase(advancedShieldDatabase)).toBe(true)
    })

    it('returns false for a Performance database in the Common Runtime', function () {
      expect(isAdvancedPrivateDatabase(performanceDatabase)).toBe(false)
    })

    // Essential Tier Databases
    it('returns false for an Essential database', function () {
      expect(isAdvancedPrivateDatabase(essentialDatabase)).toBe(false)
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isAdvancedPrivateDatabase(premiumDatabase)).toBe(false)
    })

    it('returns false for a Private database', function () {
      expect(isAdvancedPrivateDatabase(privateDatabase)).toBe(false)
    })

    it('returns false for a Shield database', function () {
      expect(isAdvancedPrivateDatabase(shieldDatabase)).toBe(false)
    })

    it('returns false for a Standard database', function () {
      expect(isAdvancedPrivateDatabase(standardDatabase)).toBe(false)
    })

    // Legacy Essential Tier Databases
    it('returns false for a Dev database', function () {
      expect(isAdvancedPrivateDatabase(devDatabase)).toBe(false)
    })

    it('returns false for a Basic database', function () {
      expect(isAdvancedPrivateDatabase(basicDatabase)).toBe(false)
    })

    it('returns false for a Mini database', function () {
      expect(isAdvancedPrivateDatabase(miniDatabase)).toBe(false)
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isAdvancedPrivateDatabase(nonPostgresAddon)).toBe(false)
    })
  })

  describe('isLegacyDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database', function () {
      expect(isLegacyDatabase(advancedDatabase)).toBe(false)
    })

    it('returns false for an Advanced Private database', function () {
      expect(isLegacyDatabase(advancedPrivateDatabase)).toBe(false)
    })

    it('returns false for an Advanced Shield database', function () {
      expect(isLegacyDatabase(advancedShieldDatabase)).toBe(false)
    })

    it('returns false for a Performance database', function () {
      expect(isLegacyDatabase(performanceDatabase)).toBe(false)
    })

    // Essential Tier Databases
    it('returns true for an Essential database', function () {
      expect(isLegacyDatabase(essentialDatabase)).toBe(true)
    })

    // Non-Advanced Tier Databases
    it('returns true for a Premium database', function () {
      expect(isLegacyDatabase(premiumDatabase)).toBe(true)
    })

    it('returns true for a Private database', function () {
      expect(isLegacyDatabase(privateDatabase)).toBe(true)
    })

    it('returns true for a Shield database', function () {
      expect(isLegacyDatabase(shieldDatabase)).toBe(true)
    })

    it('returns true for a Standard database', function () {
      expect(isLegacyDatabase(standardDatabase)).toBe(true)
    })

    // Legacy Essential Tier Databases
    it('returns true for a Dev database', function () {
      expect(isLegacyDatabase(devDatabase)).toBe(true)
    })

    it('returns true for a Basic database', function () {
      expect(isLegacyDatabase(basicDatabase)).toBe(true)
    })

    it('returns true for a Mini database', function () {
      expect(isLegacyDatabase(miniDatabase)).toBe(true)
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isLegacyDatabase(nonPostgresAddon)).toBe(false)
    })
  })

  describe('isLegacyEssentialDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database', function () {
      expect(isLegacyEssentialDatabase(advancedDatabase)).toBe(false)
    })

    it('returns false for an Advanced Private database', function () {
      expect(isLegacyEssentialDatabase(advancedPrivateDatabase)).toBe(false)
    })

    it('returns false for an Advanced Shield database', function () {
      expect(isLegacyEssentialDatabase(advancedShieldDatabase)).toBe(false)
    })

    it('returns false for a Performance database', function () {
      expect(isLegacyEssentialDatabase(performanceDatabase)).toBe(false)
    })

    // Essential Tier Databases
    it('returns false for an Essential database', function () {
      expect(isLegacyEssentialDatabase(essentialDatabase)).toBe(false)
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isLegacyEssentialDatabase(premiumDatabase)).toBe(false)
    })

    it('returns false for a Private database', function () {
      expect(isLegacyEssentialDatabase(privateDatabase)).toBe(false)
    })

    it('returns false for a Shield database', function () {
      expect(isLegacyEssentialDatabase(shieldDatabase)).toBe(false)
    })

    it('returns false for a Standard database', function () {
      expect(isLegacyEssentialDatabase(standardDatabase)).toBe(false)
    })

    // Legacy Essential Tier Databases
    it('returns true for a Dev database', function () {
      expect(isLegacyEssentialDatabase(devDatabase)).toBe(true)
    })

    it('returns true for a Basic database', function () {
      expect(isLegacyEssentialDatabase(basicDatabase)).toBe(true)
    })

    it('returns true for a Mini database', function () {
      expect(isLegacyEssentialDatabase(miniDatabase)).toBe(true)
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isLegacyEssentialDatabase(nonPostgresAddon)).toBe(false)
    })
  })

  describe('isEssentialDatabase', function () {
    // Advanced Tier Databases
    it('returns false for an Advanced database', function () {
      expect(isEssentialDatabase(advancedDatabase)).toBe(false)
    })

    it('returns false for an Advanced Private database', function () {
      expect(isEssentialDatabase(advancedPrivateDatabase)).toBe(false)
    })

    it('returns false for an Advanced Shield database', function () {
      expect(isEssentialDatabase(advancedShieldDatabase)).toBe(false)
    })

    it('returns false for a Performance database', function () {
      expect(isEssentialDatabase(performanceDatabase)).toBe(false)
    })

    // Essential Tier Databases
    it('returns true for an Essential database', function () {
      expect(isEssentialDatabase(essentialDatabase)).toBe(true)
    })

    // Non-Advanced Tier Databases
    it('returns false for a Premium database', function () {
      expect(isEssentialDatabase(premiumDatabase)).toBe(false)
    })

    it('returns false for a Private database', function () {
      expect(isEssentialDatabase(privateDatabase)).toBe(false)
    })

    it('returns false for a Shield database', function () {
      expect(isEssentialDatabase(shieldDatabase)).toBe(false)
    })

    it('returns false for a Standard database', function () {
      expect(isEssentialDatabase(standardDatabase)).toBe(false)
    })

    // Legacy Essential Tier Databases
    it('returns false for a Dev database', function () {
      expect(isEssentialDatabase(devDatabase)).toBe(false)
    })

    it('returns false for a Basic database', function () {
      expect(isEssentialDatabase(basicDatabase)).toBe(false)
    })

    it('returns false for a Mini database', function () {
      expect(isEssentialDatabase(miniDatabase)).toBe(false)
    })

    // Non-Postgres Add-ons
    it('returns false for a non-Postgres add-on', function () {
      expect(isEssentialDatabase(nonPostgresAddon)).toBe(false)
    })
  })
})
