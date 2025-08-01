export const myAppConfigVars = {
  MAIN_DATABASE_URL: 'postgres://user1:password1@main-database.example.com:5432/db1',
  MAIN_RO_DATABASE_URL: 'postgres://user2:password2@main-database.example.com:5432/db1',
  FOLLOWER_DATABASE_URL: 'postgres://user3:password3@follower-database.example.com:5432/db2',
  DEV_ADDON_DATABASE_URL: 'postgres://user4:password4@dev-addon-database.example-staging.com:5432/db3',
  REDIS_URL: 'redis://user5:pass5@redis-database.example.com:6379/0',
  REDIS_FOLLOWER_URL: 'redis://user6:pass6@redis-follower-database.example.com:6379/0',
}

export const myOtherAppConfigVars = {
  MAIN_DATABASE_URL: 'postgres://user1:password1@main-database.example.com:5432/db1',
  MY_APP_FOLLOWER_URL: 'postgres://user3:password3@follower-database.example.com:5432/db2',
  MY_APP_FOLLOWER_ALT_URL: 'postgres://user3:password3@follower-database.example.com:5432/db2',
  REDIS_FOLLOWER_URL: 'redis://user6:pass6@redis-follower-database.example.com:6379/0',
}

export const emptyAppConfigVars = {}
