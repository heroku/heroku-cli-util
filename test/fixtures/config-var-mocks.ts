export const myAppConfigVars = {
  DEV_ADDON_DATABASE_URL: 'postgres://user4:password4@dev-addon-database.example-staging.com:5432/db3',
  FOLLOWER_DATABASE_URL: 'postgres://user3:password3@follower-database.example.com:5432/db2',
  MAIN_DATABASE_URL: 'postgres://user1:password1@main-database.example.com:5432/db1',
  MAIN_RO_DATABASE_URL: 'postgres://user2:password2@main-database.example.com:5432/db1',
  REDIS_FOLLOWER_URL: 'redis://user6:password6@redis-follower-database.example.com:6379/0',
  REDIS_URL: 'redis://user5:password5@redis-database.example.com:6379/0',
}

export const myOtherAppConfigVars = {
  MAIN_DATABASE_URL: 'postgres://user1:password1@main-database.example.com:5432/db1',
  MY_APP_FOLLOWER_ALT_URL: 'postgres://user3:password3@follower-database.example.com:5432/db2',
  MY_APP_FOLLOWER_URL: 'postgres://user3:password3@follower-database.example.com:5432/db2',
  REDIS_FOLLOWER_URL: 'redis://user6:password6@redis-follower-database.example.com:6379/0',
}

export const shieldDatabaseConfigVars = {
  DATABASE_BASTION_KEY: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
  DATABASE_BASTION_REKEYS_AFTER: '2025-01-01T00:00:00Z',
  DATABASE_BASTIONS: '10.7.0.1',
  DATABASE_URL: 'postgres://user7:password7@shield-database.example.com:5432/db1',
}

export const privateDatabaseConfigVars = {
  DATABASE_URL: 'postgres://user8:password8@private-database.example.com:5432/db1',
}

export const emptyAppConfigVars = {}
