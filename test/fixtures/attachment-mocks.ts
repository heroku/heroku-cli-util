/* eslint-disable camelcase */
import type {ExtendedAddonAttachment} from '../../src/types/pg/platform-api'

export const HEROKU_API = 'https://api.heroku.com'

export const defaultAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-1',
    name: 'postgresql-clean-12345',
    plan: {
      id: 'essential-1',
      name: 'heroku-postgresql:essential-1',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'MAIN_DATABASE_URL',
  ],
  id: 'attachment-1',
  name: 'MAIN_DATABASE',
  namespace: null,
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
  config_vars: [
    'MAIN_RO_DATABASE_URL',
  ],
  id: 'attachment-3',
  name: 'MAIN_RO_DATABASE',
  namespace: 'read-only',
}

export const followerAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-2',
    name: 'postgresql-regular-12345',
    plan: {
      id: 'essential-1',
      name: 'heroku-postgresql:essential-1',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'FOLLOWER_DATABASE_URL',
  ],
  id: 'attachment-4',
  name: 'FOLLOWER_DATABASE',
  namespace: null,
} as ExtendedAddonAttachment

export const developerAddonAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-3',
    name: 'postgresql-devname-regular-12345',
    plan: {
      id: 'essential-1',
      name: 'heroku-postgresql-devname:essential-1',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'DEV_ADDON_DATABASE_URL',
  ],
  id: 'attachment-5',
  name: 'DEV_ADDON_DATABASE',
  namespace: null,
} as ExtendedAddonAttachment

export const foreignFollowerAttachment: ExtendedAddonAttachment = {
  ...followerAttachment,
  app: {
    id: 'app-2',
    name: 'my-other-app',
  },
  config_vars: [
    'MY_APP_FOLLOWER_URL',
  ],
  id: 'attachment-6',
  name: 'MY_APP_FOLLOWER',
}

export const equivalentAttachment: ExtendedAddonAttachment = {
  ...foreignFollowerAttachment,
  config_vars: [
    'MY_APP_FOLLOWER_ALT_URL',
  ],
  id: 'attachment-7',
  name: 'MY_APP_FOLLOWER_ALT',
}

export const shieldDatabaseAttachment = {
  addon: {
    app: {
      id: 'app-3',
      name: 'my-shield-app',
    },
    id: 'addon-4',
    name: 'postgresql-vertical-12345',
    plan: {
      id: 'shield-0',
      name: 'heroku-postgresql:shield-0',
    },
  },
  app: {
    id: 'app-3',
    name: 'my-shield-app',
  },
  config_vars: [
    'DATABASE_BASTION_KEY',
    'DATABASE_BASTION_REKEYS_AFTER',
    'DATABASE_BASTIONS',
    'DATABASE_URL',
  ],
  id: 'attachment-8',
  name: 'DATABASE',
  namespace: null,
} as ExtendedAddonAttachment

export const privateDatabaseAttachment = {
  addon: {
    app: {
      id: 'app-4',
      name: 'my-private-app',
    },
    id: 'addon-5',
    name: 'postgresql-vertical-12345',
    plan: {
      id: 'private-0',
      name: 'heroku-postgresql:private-0',
    },
  },
  app: {
    id: 'app-4',
    name: 'my-private-app',
  },
  config_vars: [
    'DATABASE_URL',
  ],
  id: 'attachment-9',
  name: 'DATABASE',
  namespace: null,
} as ExtendedAddonAttachment
