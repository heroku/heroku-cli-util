/**
 * This error is used only when the Platform API add-on attachment resolver resolves to one or more matches, but
 * a namespace (credential name) was provided and none of them had that exact namespace.
 * 
 * We would've expected this to use the same error message the resolver returns when it throws a Not Found error:
 * `"Couldn't find that add on attachment."`, because it's attachments and not add-ons that are being resolved.
 *
 * However, that's not the case here and we cannot refactor this to use the expected messaging because the only
 * command checking credentials, `pg:psql`, has a check with a strict match on the error message text to change
 * the error displayed to the user
 * ([see here](https://github.com/heroku/cli/blob/b79f2c93d6f21eafd9d93983bcd377e4bc7f8438/packages/cli/src/commands/pg/psql.ts#L32)).
 */
export class NotFound extends Error {
  public readonly body = {id: 'not_found', message: 'Couldn\'t find that addon.'}
  public readonly message = 'Couldn\'t find that addon.'
  public readonly statusCode = 404
}
