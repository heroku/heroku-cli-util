export class NotFound extends Error {
  public readonly id = 'not_found'
  public readonly message = 'Couldn\'t find that addon.'
  public readonly statusCode = 404
}
