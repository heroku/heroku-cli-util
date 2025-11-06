import type {ExtendedAddon} from '../../src/types/pg/platform-api'

export const advancedDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-1',
  name: 'postgresql-horizontal-12345',
  plan: {
    id: 'advanced',
    name: 'heroku-postgresql:advanced',
  },
} as ExtendedAddon

export const advancedPrivateDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-2',
  name: 'postgresql-vertical-12345',
  plan: {
    id: 'advanced-private',
    name: 'heroku-postgresql:advanced-private',
  },
} as ExtendedAddon

export const advancedShieldDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-3',
  name: 'postgresql-colorful-12345',
  plan: {
    id: 'advanced-shield',
    name: 'heroku-postgresql:advanced-shield',
  },
} as ExtendedAddon

export const basicDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-4',
  name: 'postgresql-angular-12345',
  plan: {
    id: 'basic',
    name: 'heroku-postgresql:basic',
  },
} as ExtendedAddon

export const devDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-5',
  name: 'postgresql-clean-12345',
  plan: {
    id: 'mini',
    name: 'heroku-postgresql:mini',
  },
} as ExtendedAddon

export const essentialDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-6',
  name: 'postgresql-cylindrical-12345',
  plan: {
    id: 'essential-0',
    name: 'heroku-postgresql:essential-0',
  },
} as ExtendedAddon

export const miniDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-7',
  name: 'postgresql-octagonal-12345',
  plan: {
    id: 'mini',
    name: 'heroku-postgresql:mini',
  },
} as ExtendedAddon

export const nonPostgresAddon: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-8',
  name: 'redis-animated-12345',
  plan: {
    id: 'premium-5',
    name: 'heroku-redis:premium-5',
  },
} as ExtendedAddon

/* Performance was the old name for Advanced databases */
export const performanceDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-9',
  name: 'postgresql-shallow-12345',
  plan: {
    id: 'performance-beta',
    name: 'heroku-postgresql:performance-beta',
  },
} as ExtendedAddon

export const premiumDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-10',
  name: 'postgresql-solid-12345',
  plan: {
    id: 'premium-0',
    name: 'heroku-postgresql:premium-0',
  },
} as ExtendedAddon

export const privateDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-11',
  name: 'postgresql-cubic-12345',
  plan: {
    id: 'private-0',
    name: 'heroku-postgresql:private-0',
  },
} as ExtendedAddon

export const shieldDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-12',
  name: 'postgresql-cubed-12345',
  plan: {
    id: 'shield-0',
    name: 'heroku-postgresql:shield-0',
  },
} as ExtendedAddon

export const standardDatabase: ExtendedAddon = {
  app: {
    id: 'app-1',
    name: 'my-app',
  },
  id: 'addon-13',
  name: 'postgresql-hexagonal-12345',
  plan: {
    id: 'standard-0',
    name: 'heroku-postgresql:standard-0',
  },
} as ExtendedAddon
