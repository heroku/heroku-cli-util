export default function getHost() {
  const host = process.env.HEROKU_DATA_HOST || process.env.HEROKU_POSTGRESQL_HOST
  return host ?? 'api.data.heroku.com'
}
