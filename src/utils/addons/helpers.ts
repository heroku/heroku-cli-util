import {ExtendedAddon, ExtendedAddonAttachment} from '../../types/pg/platform-api'

export const getAddonService = () =>
  process.env.HEROKU_POSTGRESQL_ADDON_NAME || process.env.HEROKU_DATA_SERVICE || 'heroku-postgresql'

export const isPostgresAddon = (addon: ExtendedAddon | ExtendedAddonAttachment['addon']) =>
  addon.plan.name.split(':', 2)[0] === getAddonService()

export const isAdvancedDatabase = (addon: ExtendedAddon | ExtendedAddonAttachment['addon']) =>
  isPostgresAddon(addon) && /^(advanced|performance)/.test(addon.plan.name.split(':', 2)[1])

export const isAdvancedPrivateDatabase = (addon: ExtendedAddon | ExtendedAddonAttachment['addon']) =>
  isAdvancedDatabase(addon) && /(private|shield)/.test(addon.plan.name.split(':', 2)[1])

export const isLegacyDatabase = (addon: ExtendedAddon | ExtendedAddonAttachment['addon']) =>
  isPostgresAddon(addon) && !isAdvancedDatabase(addon)

export const isLegacyEssentialDatabase = (addon: ExtendedAddon | ExtendedAddonAttachment['addon']) =>
  isLegacyDatabase(addon) && /^(dev|basic|mini)/.test(addon.plan.name.split(':', 2)[1])

export const isEssentialDatabase = (addon: ExtendedAddon | ExtendedAddonAttachment['addon']) =>
  isLegacyDatabase(addon) && addon.plan.name.split(':', 2)[1].startsWith('essential')
