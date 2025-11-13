/* eslint-disable camelcase */
import type {ExtendedAddonAttachment} from '../../src/types/pg/platform-api.js'

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

export const advancedDatabaseAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-6',
    name: 'postgresql-horizontal-12345',
    plan: {
      id: 'advanced',
      name: 'heroku-postgresql:advanced',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'ADVANCED_URL',
  ],
  id: 'attachment-10',
  name: 'ADVANCED',
  namespace: null,
} as ExtendedAddonAttachment

export const performanceDatabaseAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-7',
    name: 'postgresql-shallow-12345',
    plan: {
      id: 'performance-beta',
      name: 'heroku-postgresql:performance-beta',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'PERFORMANCE_URL',
  ],
  id: 'attachment-11',
  name: 'PERFORMANCE',
  namespace: null,
} as ExtendedAddonAttachment

export const premiumDatabaseAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-8',
    name: 'postgresql-solid-12345',
    plan: {
      id: 'premium-0',
      name: 'heroku-postgresql:premium-0',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'HEROKU_POSTGRESQL_PURPLE_URL',
  ],
  id: 'attachment-12',
  name: 'HEROKU_POSTGRESQL_PURPLE',
  namespace: null,
} as ExtendedAddonAttachment

export const miniDatabaseAttachment = {
  addon: {
    app: {
      id: 'app-1',
      name: 'my-app',
    },
    id: 'addon-9',
    name: 'postgresql-octagonal-12345',
    plan: {
      id: 'mini',
      name: 'heroku-postgresql:mini',
    },
  },
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  config_vars: [
    'HEROKU_POSTGRESQL_WHITE_URL',
  ],
  id: 'attachment-13',
  name: 'HEROKU_POSTGRESQL_WHITE',
  namespace: null,
} as ExtendedAddonAttachment
