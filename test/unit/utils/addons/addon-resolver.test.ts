/* eslint-disable camelcase */
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client'
import {Config} from '@oclif/core'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'

import {AmbiguousError} from '../../../../src/errors/ambiguous'
import AddonResolver from '../../../../src/utils/addons/addon-resolver'
import {advancedDatabase, premiumDatabase, standardDatabase} from '../../../fixtures/addon-mocks'
import {HEROKU_API} from '../../../fixtures/attachment-mocks'

const {expect} = chai

chai.use(chaiAsPromised)

/*
 * The meaningful parts on all the following tests are really ensuring that Platform API's Add-on Resolution endpoint
 * is being called with the correct parameters and that the method's result matches the expected one according to that
 * response.
 *
 * The examples include a lot of variations for the content of the method arguments, mainly the identifier used to
 * resolve the add-on. This is done to provide examples of how the different identifiers affect Platform API's response,
 * even when we're not testing the endpoint behavior and just mocking the endpoint call and the expected response.
 */
describe('AddonResolver#resolve', function () {
  let config: Config
  let heroku: APIClient

  beforeEach(async function () {
    config = await Config.load()
    heroku = new APIClient(config)
  })

  afterEach(function () {
    // eslint-disable-next-line import/no-named-as-default-member
    nock.cleanAll()
  })

  describe('when the app isn\'t specified', function () {
    it('returns the resolved add-on if one matches by id', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'addon-1',
          addon_service: undefined,
          app: undefined,
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('addon-1')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('returns the resolved add-on if one matches by name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'postgresql-horizontal-12345',
          addon_service: undefined,
          app: undefined,
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('postgresql-horizontal-12345')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('returns the resolved add-on if one matches by app and attachment name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('my-app::DATABASE')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('returns the resolved add-on attachment if one matches by app and config var name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE_URL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('my-app::DATABASE_URL')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('throws a not found error when trying to resolve only by attachment name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE',
          addon_service: undefined,
          app: undefined,
        })
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on.', resource: 'add_on'})

      try {
        await new AddonResolver(heroku).resolve('DATABASE')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).to.equal('not_found')
        expect(apiError.body.message).to.equal('Couldn\'t find that add on.')
        expect(apiError.http.statusCode).to.equal(404)
        api.done()
      }
    })

    it('throws a not found error when trying to resolve only by config var name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE_URL',
          addon_service: undefined,
          app: undefined,
        })
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on.', resource: 'add_on'})

      try {
        await new AddonResolver(heroku).resolve('DATABASE_URL')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).to.equal('not_found')
        expect(apiError.body.message).to.equal('Couldn\'t find that add on.')
        expect(apiError.http.statusCode).to.equal(404)
        api.done()
      }
    })

    it('throws an ambiguous error when multiple matches by app name and partial attachment name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'HEROKU_POSTGRESQL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [premiumDatabase, standardDatabase])

      try {
        await new AddonResolver(heroku).resolve('my-app::HEROKU_POSTGRESQL')
      } catch (error: unknown) {
        const apiError = error as AmbiguousError
        expect(apiError.body.id).to.equal('multiple_matches')
        expect(apiError.body.message).to.equal(
          'Ambiguous identifier; multiple matching add-ons found: '
            + 'postgresql-solid-12345, postgresql-hexagonal-12345.',
        )
        api.done()
      }
    })

    it('throws an ambiguous error when multiple matches by app name and partial config var name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'URL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase, premiumDatabase, standardDatabase])

      try {
        await new AddonResolver(heroku).resolve('my-app::URL')
      } catch (error: unknown) {
        const apiError = error as AmbiguousError
        expect(apiError.body.id).to.equal('multiple_matches')
        expect(apiError.body.message).to.equal(
          'Ambiguous identifier; multiple matching add-ons found: '
            + 'postgresql-horizontal-12345, postgresql-solid-12345, postgresql-hexagonal-12345.',
        )
        api.done()
      }
    })
  })

  describe('when the app is specified', function () {
    it('returns the resolved add-on if one matches by app and id', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'addon-1',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('addon-1', 'my-app')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('returns the resolved add-on if one matches by app and name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'postgresql-horizontal-12345',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('postgresql-horizontal-12345', 'my-app')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('returns the resolved add-on prioritizing the namespaced attachment name\'s app', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('my-app::DATABASE', 'another-app')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('returns the resolved add-on attachment prioritizing the namespaced config var name\'s app', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE_URL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('my-app::DATABASE_URL', 'another-app')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })

    it('throws a not found error when trying to resolve with an inexistent attachment name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'INEXISTENT_ATTACHMENT',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on.', resource: 'add_on'})

      try {
        await new AddonResolver(heroku).resolve('INEXISTENT_ATTACHMENT', 'my-app')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).to.equal('not_found')
        expect(apiError.body.message).to.equal('Couldn\'t find that add on.')
        expect(apiError.http.statusCode).to.equal(404)
        api.done()
      }
    })

    it('throws a not found error when trying to resolve with an inexistent config var name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'INEXISTENT_ATTACHMENT_URL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on.', resource: 'add_on'})

      try {
        await new AddonResolver(heroku).resolve('INEXISTENT_ATTACHMENT_URL', 'my-app')
      } catch (error: unknown) {
        const apiError = error as HerokuAPIError
        expect(apiError.body.id).to.equal('not_found')
        expect(apiError.body.message).to.equal('Couldn\'t find that add on.')
        expect(apiError.http.statusCode).to.equal(404)
        api.done()
      }
    })

    it('throws an ambiguous error when multiple matches by app name and partial attachment name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'HEROKU_POSTGRESQL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [premiumDatabase, standardDatabase])

      try {
        await new AddonResolver(heroku).resolve('HEROKU_POSTGRESQL', 'my-app')
      } catch (error: unknown) {
        const apiError = error as AmbiguousError
        expect(apiError.body.id).to.equal('multiple_matches')
        expect(apiError.body.message).to.equal(
          'Ambiguous identifier; multiple matching add-ons found: '
            + 'postgresql-solid-12345, postgresql-hexagonal-12345.',
        )
        api.done()
      }
    })

    it('throws an ambiguous error when multiple matches by app name and partial config var name', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'URL',
          addon_service: undefined,
          app: 'my-app',
        })
        .reply(200, [advancedDatabase, premiumDatabase, standardDatabase])

      try {
        await new AddonResolver(heroku).resolve('URL', 'my-app')
      } catch (error: unknown) {
        const apiError = error as AmbiguousError
        expect(apiError.body.id).to.equal('multiple_matches')
        expect(apiError.body.message).to.equal(
          'Ambiguous identifier; multiple matching add-ons found: '
            + 'postgresql-horizontal-12345, postgresql-solid-12345, postgresql-hexagonal-12345.',
        )
        api.done()
      }
    })
  })

  describe('when an add-on service is specified', function () {
    it('returns the resolved add-on if one matches for the specified add-on service', async function () {
      const api = nock(HEROKU_API)
        .post('/actions/addons/resolve', {
          addon: 'DATABASE',
          addon_service: 'heroku-postgresql',
          app: 'my-app',
        })
        .reply(200, [advancedDatabase])

      const result = await new AddonResolver(heroku).resolve('DATABASE', 'my-app', 'heroku-postgresql')

      expect(result).to.deep.equal(advancedDatabase)
      api.done()
    })
  })

  it('throws a not found error when trying to resolve if there are no matches for the specified add-on service', async function () {
    const api = nock(HEROKU_API)
      .post('/actions/addons/resolve', {
        addon: 'DATABASE',
        addon_service: 'heroku-redis',
        app: 'my-app',
      })
      .reply(404, {id: 'not_found', message: 'Couldn\'t find that add on.', resource: 'add_on'})

    try {
      await new AddonResolver(heroku).resolve('DATABASE', 'my-app', 'heroku-redis')
    } catch (error: unknown) {
      const apiError = error as HerokuAPIError
      expect(apiError.body.id).to.equal('not_found')
      expect(apiError.body.message).to.equal('Couldn\'t find that add on.')
      expect(apiError.http.statusCode).to.equal(404)
      api.done()
    }
  })
})
