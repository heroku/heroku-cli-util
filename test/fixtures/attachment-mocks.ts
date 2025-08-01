import type {ExtendedAddonAttachment} from '../../src/types/pg/data-api.js'

export const HEROKU_API = 'https://api.heroku.com'

export const defaultAttachment = {
  addon: {
    id: 'addon-1',
    name: 'postgresql-clean-12345',
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    plan: {
      id: 'essential-1',
      name: 'heroku-postgresql:essential-1',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'attachment-1',
  name: 'MAIN_DATABASE',
  namespace: null,
  config_vars: [
    'MAIN_DATABASE_URL',
  ],
} as ExtendedAddonAttachment

export const foreignAttachment: ExtendedAddonAttachment = {
  ...defaultAttachment,
  app: {
    id: 'app-2',
    name: 'my-other-app',
  },
  id: 'attachment-2',
}

export const credentialAttachment: ExtendedAddonAttachment = {
  ...defaultAttachment,
  id: 'attachment-3',
  name: 'MAIN_RO_DATABASE',
  namespace: 'read-only',
  config_vars: [
    'MAIN_RO_DATABASE_URL',
  ],
}

export const followerAttachment = {
  addon: {
    id: 'addon-2',
    name: 'postgresql-regular-12345',
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    plan: {
      id: 'essential-1',
      name: 'heroku-postgresql:essential-1',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'attachment-4',
  name: 'FOLLOWER_DATABASE',
  namespace: null,
  config_vars: [
    'FOLLOWER_DATABASE_URL',
  ],
} as ExtendedAddonAttachment

export const developerAddonAttachment = {
  addon: {
    id: 'addon-3',
    name: 'postgresql-devname-regular-12345',
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    plan: {
      id: 'essential-1',
      name: 'heroku-postgresql-devname:essential-1',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'attachment-5',
  name: 'DEV_ADDON_DATABASE',
  namespace: null,
  config_vars: [
    'DEV_ADDON_DATABASE_URL',
  ],
} as ExtendedAddonAttachment

export const foreignFollowerAttachment: ExtendedAddonAttachment = {
  ...followerAttachment,
  app: {
    id: 'app-2',
    name: 'my-other-app',
  },
  id: 'attachment-6',
  name: 'MY_APP_FOLLOWER',
  config_vars: [
    'MY_APP_FOLLOWER_URL',
  ],
}

export const equivalentAttachment: ExtendedAddonAttachment = {
  ...foreignFollowerAttachment,
  id: 'attachment-7',
  name: 'MY_APP_FOLLOWER_ALT',
  config_vars: [
    'MY_APP_FOLLOWER_ALT_URL',
  ],
}

export const shieldDatabaseAttachment = {
  addon: {
    id: 'addon-4',
    name: 'postgresql-vertical-12345',
    app: {
      id: 'app-3',
      name: 'my-shield-app',
    },
    plan: {
      id: 'shield-0',
      name: 'heroku-postgresql:shield-0',
    },
  },
  app: {
    id: 'app-3',
    name: 'my-shield-app',
  },
  id: 'attachment-8',
  name: 'DATABASE',
  namespace: null,
  config_vars: [
    'DATABASE_BASTION_KEY',
    'DATABASE_BASTION_REKEYS_AFTER',
    'DATABASE_BASTIONS',
    'DATABASE_URL',
  ],
} as ExtendedAddonAttachment
