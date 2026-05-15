
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client.js'
import {Config} from '@oclif/core'
import nock from 'nock'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import {AmbiguousError} from '../../../../src/errors/ambiguous.js'
import {NotFound} from '../../../../src/errors/not-found.js'
import AddonAttachmentResolver from '../../../../src/utils/addons/attachment-resolver.js'
import {
  credentialAttachment,
  defaultAttachment,
  followerAttachment,
  foreignAttachment,
  HEROKU_API,
} from '../../../fixtures/attachment-mocks.js'

describe('AddonAttachmentResolver#resolve', function () {
  let config: Config
  let heroku: APIClient

  beforeEach(async function () {
    config = await Config.load(process.cwd())
    heroku = new APIClient(config)
  })

  afterEach(function () {
    nock.cleanAll()
  })

  describe('when the app isn\'t specified', function () {
    it('returns the resolved addon attachment if one matches by attachment id', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve(undefined, 'attachment-1')

      expect(result).toEqual(defaultAttachment)
    })

    it('returns the resolved addon attachment if one matches by app and attachment name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve(undefined, 'my-app::DATABASE')

      expect(result).toEqual(defaultAttachment)
    })

    it('returns the resolved addon attachment if one matches by app and config var name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve(undefined, 'my-app::DATABASE_URL')

      expect(result).toEqual(defaultAttachment)
    })

    it('throws a not found error when trying to resolve only by attachment name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'add_on attachment'})

      try {
        await new AddonAttachmentResolver(heroku).resolve(undefined, 'DATABASE')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).toBe('not_found')
        expect(apiError.body.message).toBe('Couldn\'t find that add on attachment.')
        expect(apiError.http.statusCode).toBe(404)
      }
    })

    it('throws a not found error when trying to resolve only by config var name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'add_on attachment'})

      try {
        await new AddonAttachmentResolver(heroku).resolve(undefined, 'DATABASE_URL')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).toBe('not_found')
        expect(apiError.body.message).toBe('Couldn\'t find that add on attachment.')
        expect(apiError.http.statusCode).toBe(404)
      }
    })

    it('throws an ambiguous error when multiple matches by app name and partial attachment name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve(undefined, 'my-app::DATA')).rejects.toThrow(AmbiguousError)
    })

    it('throws an ambiguous error when multiple matches by app name and partial config var name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve(undefined, 'my-app::BASE_URL')).rejects.toThrow(AmbiguousError)
    })
  })

  describe('when the app is specified', function () {
    it('throws an app not found error when trying to resolve by whatever identifier but the app doesn\'t exist', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that app.', resource: 'app'})

      try {
        await new AddonAttachmentResolver(heroku).resolve('missing-app', 'whatever')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).toBe('not_found')
        expect(apiError.body.message).toBe('Couldn\'t find that app.')
        expect(apiError.http.statusCode).toBe(404)
      }
    })

    it('throws an attachment not found error when trying to resolve by an attachment id for a different app', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'add_on attachment'})

      try {
        await new AddonAttachmentResolver(heroku).resolve('my-app', foreignAttachment.id)
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).toBe('not_found')
        expect(apiError.body.message).toBe('Couldn\'t find that add on attachment.')
        expect(apiError.http.statusCode).toBe(404)
      }
    })

    it('throws an attachment not found error when trying to resolve by a non-existent attachment name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'add_on attachment'})

      try {
        await new AddonAttachmentResolver(heroku).resolve('my-app', 'PRIMARY_DB')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).toBe('not_found')
        expect(apiError.body.message).toBe('Couldn\'t find that add on attachment.')
        expect(apiError.http.statusCode).toBe(404)
      }
    })

    // This is wrongfully described in the API comments as returning the attachment for the other app, but passing an app name
    // sets a base scope on the endpoint logic where no attachment for a different app can be found by the resolver as it never
    // changes the scope. Here we describe the real behavior.
    it('throws an attachment not found error when trying to resolve for a different app and attachment names', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'add_on attachment'})

      try {
        await new AddonAttachmentResolver(heroku).resolve('my-app', 'my-other-app::DATABASE')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).toBe('not_found')
        expect(apiError.body.message).toBe('Couldn\'t find that add on attachment.')
        expect(apiError.http.statusCode).toBe(404)
      }
    })

    it('returns the resolved addon attachment if one matches exactly by attachment name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve('my-app', 'DATABASE')

      expect(result).toEqual(defaultAttachment)
    })

    it('returns the resolved addon attachment if one matches exactly by config var name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve('my-app', 'DATABASE_URL')

      expect(result).toEqual(defaultAttachment)
    })

    it('throws an ambiguous error when multiple matches by partial attachment name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve('my-app', 'DATA')).rejects.toThrow(AmbiguousError)
    })

    it('throws an ambiguous error when multiple matches by partial config var name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve('my-app', 'BASE_URL')).rejects.toThrow(AmbiguousError)
    })
  })

  describe('when the namespace option is provided', function () {
    it('throws a NotFound error when no attachment matches the given namespace', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve('my-app', 'DATA', {namespace: 'missing'})).rejects.toThrow(NotFound)
    })

    it('filters by namespace if one matches the provided name', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve('my-app', 'DATA', {namespace: 'read-only'})
      expect(result.namespace).toBe('read-only')
    })

    it('throws an ambiguous error when multiple matches after filtering by namespace', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve('my-app', 'BASE_URL', {namespace: undefined})).rejects.toThrow(AmbiguousError)
    })
  })

  describe('when the addon_service option is provided', function () {
    it('throws an attachment not found error when the matching attachment is for a different addon service', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      try {
        await new AddonAttachmentResolver(heroku).resolve('my-app', 'DATABASE', {addonService: 'heroku-redis'})
      } catch (error: unknown) {
        const notFoundError = error as NotFound
        expect(notFoundError.body.id).toBe('not_found')
        expect(notFoundError.body.message).toBe('Couldn\'t find that addon.')
      }
    })

    it('returns the resolved addon attachment if the matching attachment is for the same addon service', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment])

      const result = await new AddonAttachmentResolver(heroku).resolve('my-app', 'DATABASE_URL', {addonService: 'heroku-postgresql'})

      expect(result).toEqual(defaultAttachment)
    })

    it('throws an ambiguous error when multiple matches for the same addon service', async function () {
      nock(HEROKU_API)
        .post('/actions/addon-attachments/resolve')
        .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

      await expect(new AddonAttachmentResolver(heroku).resolve('my-app', 'BASE_URL', {addonService: 'heroku-postgresql'})).rejects.toThrow(AmbiguousError)
    })
  })
})
