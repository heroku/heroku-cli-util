export class AmbiguousError extends Error {
  public readonly body: {id: string, message: string}
  public readonly message: string
  public readonly statusCode = 422

  constructor(public readonly matches: { name?: string }[], public readonly type: string) {
    super()
    this.message = `Ambiguous identifier; multiple matching add-ons found: ${matches.map(match => match.name).join(', ')}.`
    this.body = {id: 'multiple_matches', message: this.message}
  }
}
