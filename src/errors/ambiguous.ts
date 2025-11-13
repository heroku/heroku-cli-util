import type {ExtendedAddon, ExtendedAddonAttachment} from '../types/pg/platform-api.js'

/**
 * This error is used internally to signal when the `AddonAttachmentResolver` cannot resolve
 * to a single attachment.
 */
export class AmbiguousError extends Error {
  public readonly body: {id: string, message: string}
  public readonly message: string
  public readonly statusCode = 422

  constructor(public readonly matches: ExtendedAddon[] | ExtendedAddonAttachment[], public readonly type: string) {
    super()
    this.message = `Ambiguous identifier; multiple matching add-ons found: ${matches.map(match => match.name).join(', ')}.`
    this.body = {id: 'multiple_matches', message: this.message}
  }
}
