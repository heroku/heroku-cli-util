import {HTTPError} from '@heroku/http-call'
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client.js'
import {Config} from '@oclif/core'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import sinon from 'sinon'

import {NotFound} from '../../../../src/types/errors/not-found.js'
import {getAttachment} from '../../../../src/utils/pg/databases.js'
import AppAttachmentResolver from '../../../../src/utils/addons/resolve.js'
import {
  HEROKU_API,
  defaultAttachment,
  foreignAttachment,
  credentialAttachment,
  followerAttachment,
  developerAddonAttachment,
  equivalentAttachment,
  foreignFollowerAttachment,
} from '../../../fixtures/attachment-mocks.js'
import { AmbiguousError } from '../../../../src/types/errors/ambiguous.js'
import { myAppConfigVars, myOtherAppConfigVars } from '../../../fixtures/config-var-mocks.js'
import { configVarsByAppIdCache } from '../../../../src/utils/pg/config-vars.js'

const {expect} = chai

chai.use(chaiAsPromised)

describe('databases', function () {
  describe('getAttachment', function () {
    let config: Config
    let heroku: APIClient
    let appAttachmentStub: sinon.SinonStub
    let env: typeof process.env

    beforeEach(async function () {
      config = await Config.load()
      heroku = new APIClient(config)
      appAttachmentStub = sinon.stub(AppAttachmentResolver.prototype, 'resolve')
      env = process.env
    })

    afterEach(function () {
      process.env = env
      sinon.restore()
      nock.cleanAll()
    })

    describe('when matchesHelper returns a single match', function () {
      it('returns the single attachment when matchesHelper finds exactly one match', async function () {
        appAttachmentStub.resolves(defaultAttachment)

        const result = await getAttachment(heroku, 'my-app', 'MAIN_DATABASE')

        expect(result).to.deep.equal(defaultAttachment)
        sinon.assert.calledWith(
          appAttachmentStub, 'my-app', 'MAIN_DATABASE', {addon_service: 'heroku-postgresql', namespace: undefined}
        )
      })

      it('parses app name from database argument when using \'app::attachment\' format', async function () {
        appAttachmentStub.resolves(foreignAttachment)

        const result = await getAttachment(heroku, 'my-app', 'my-other-app::MAIN_DATABASE')

        expect(result).to.deep.equal(foreignAttachment)
        sinon.assert.calledWith(
          appAttachmentStub, 'my-other-app', 'MAIN_DATABASE', {addon_service: 'heroku-postgresql', namespace: undefined}
        )
      })

      it('handles existing namespace', async function () {
        appAttachmentStub.resolves(credentialAttachment)

        const result = await getAttachment(heroku, 'my-app', 'DATABASE', 'read-only')

        expect(result).to.deep.equal(credentialAttachment)
        sinon.assert.calledWith(
          appAttachmentStub, 'my-app', 'DATABASE', {addon_service: 'heroku-postgresql', namespace: 'read-only'}
        )
      })

      it('respects value of HEROKU_POSTGRESQL_ADDON_NAME', async function () {
        process.env = {
          HEROKU_POSTGRESQL_ADDON_NAME: 'heroku-postgresql-devname'
        }
        appAttachmentStub.resolves(developerAddonAttachment)

        const result = await getAttachment(heroku, 'my-app', 'DEV_ADDON_DATABASE')

        expect(result).to.deep.equal(developerAddonAttachment)
        sinon.assert.calledWith(
          appAttachmentStub, 'my-app', 'DEV_ADDON_DATABASE', {addon_service: 'heroku-postgresql-devname', namespace: undefined}
        )
      })
    })

    describe('when matchesHelper returns no matches', function () {
      // Simulate a 404 error from the resolver (no matches found)
      const httpError = {
        body: {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'addon-attachment'},
        statusCode: 404,
      } as HTTPError
      const notFoundError = new HerokuAPIError(httpError)

      it('throws error when app has no databases', async function () {
        appAttachmentStub.rejects(notFoundError)
        
        // Mock the Heroku API to return empty array (no attachments)
        const api = nock(HEROKU_API)
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        try {
          await getAttachment(heroku, 'app-no-addons', 'MAIN_DATABASE')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            appAttachmentStub, 'app-no-addons', 'MAIN_DATABASE', {addon_service: 'heroku-postgresql', namespace: undefined}
          )
          api.done()
          expect((error as Error).message).to.equal('app-no-addons has no databases')
        }
      })

      it('throws error when app has databases but requested database does not exist', async function () {
        appAttachmentStub.rejects(notFoundError)

        // Mock the Heroku API to return available attachments
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

        try {
          await getAttachment(heroku, 'my-app', 'NONEXISTENT_DB')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            appAttachmentStub, 'my-app', 'NONEXISTENT_DB', {addon_service: 'heroku-postgresql', namespace: undefined}
          )
          api.done()
          expect((error as Error).message).to.equal(
            'Unknown database: NONEXISTENT_DB. Valid options are: MAIN_DATABASE_URL, MAIN_RO_DATABASE_URL, FOLLOWER_DATABASE_URL'
          )
        }
      })

      it('handles app::database format when no matches found', async function () {
        appAttachmentStub.rejects(notFoundError)
        
        // Mock the Heroku API to return available attachments
        const api = nock(HEROKU_API)
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        try {
          await getAttachment(heroku, 'my-app', 'app-no-addons::MAIN_DATABASE')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            appAttachmentStub, 'app-no-addons', 'MAIN_DATABASE', {addon_service: 'heroku-postgresql', namespace: undefined}
          )
          api.done()
          expect((error as Error).message).to.equal('app-no-addons has no databases')
        }
      })

      it('handles non-existent namespace', async function () {
        appAttachmentStub.rejects(new NotFound())

        // In this case, there's no fetching app add-on attachments from Platform API, because the matchesHelper
        // function re-throws the NotFound error received from the resolver.
        try {
          await getAttachment(heroku, 'my-app', 'DATABASE', 'missing-namespace')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            appAttachmentStub, 'my-app', 'DATABASE', {addon_service: 'heroku-postgresql', namespace: 'missing-namespace'}
          )
          expect((error as Error).message).to.equal('Couldn\'t find that addon.')
        }
      })

      it('respects value of HEROKU_POSTGRESQL_ADDON_NAME env var', async function () {
        process.env = {
          HEROKU_POSTGRESQL_ADDON_NAME: 'heroku-postgresql-devname'
        }
        appAttachmentStub.rejects(notFoundError)

        // Mock the Heroku API to return available attachments for the specified addon service
        nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [developerAddonAttachment])

        await expect(getAttachment(heroku, 'my-app', 'FOLLOWER'))
          .to.be.rejectedWith('Unknown database: FOLLOWER. Valid options are: DEV_ADDON_DATABASE_URL')
        sinon.assert.calledWith(
          appAttachmentStub, 'my-app', 'FOLLOWER', {addon_service: 'heroku-postgresql-devname', namespace: undefined}
        )
      })
    })

    describe('when matchesHelper returns multiple matches', function () {
      beforeEach(function () {
        configVarsByAppIdCache.clear()
      })

      it('throws AmbiguousError when multiple matches are found and they are different add-ons', async function () {
        appAttachmentStub.rejects(
          new AmbiguousError(
            [defaultAttachment, credentialAttachment, followerAttachment],
            'addon_attachment',
          )
        )

        try {
          await getAttachment(heroku, 'my-app', 'DATABASE')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            appAttachmentStub, 'my-app', 'DATABASE', {addon_service: 'heroku-postgresql', namespace: undefined}
          )
          expect((error as Error).message).to.equal(
            'Ambiguous identifier; multiple matching add-ons found: MAIN_DATABASE, MAIN_RO_DATABASE, FOLLOWER_DATABASE.'
          )
        }
      })

      it('throws AmbiguousError when multiple matches are found and they are non equivalent attachments (different namespaces)', async function () {
        appAttachmentStub.rejects(
          new AmbiguousError(
            [defaultAttachment, credentialAttachment],
            'addon_attachment',
          )
        )

        // Mock the Heroku API to return config vars for the app (to check if the attachments are equivalent)
        const api = nock(HEROKU_API)
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        try {
          await getAttachment(heroku, 'my-app', 'MAIN')
        } catch (error: unknown) {
          api.done()
          sinon.assert.calledWith(
            appAttachmentStub, 'my-app', 'MAIN', {addon_service: 'heroku-postgresql', namespace: undefined}
          )
          expect((error as Error).message).to.equal(
            'Ambiguous identifier; multiple matching add-ons found: MAIN_DATABASE, MAIN_RO_DATABASE.'
          )
        }
      })

      it('returns the first match when multiple matches are found but they are equivalent', async function () {
        appAttachmentStub.rejects(
          new AmbiguousError(
            [foreignFollowerAttachment, equivalentAttachment],
            'addon_attachment',
          )
        )

        // Mock the Heroku API to return config vars for the app (to check if the attachments are equivalent)
        const api = nock(HEROKU_API)
          .get('/apps/my-other-app/config-vars')
          .reply(200, myOtherAppConfigVars)

        const result = await getAttachment(heroku, 'my-other-app', 'FOLLOWER')

        expect(result).to.deep.equal(foreignFollowerAttachment)
        api.done()
        sinon.assert.calledWith(
          appAttachmentStub, 'my-other-app', 'FOLLOWER', {addon_service: 'heroku-postgresql', namespace: undefined}
        )
      })
    })
  })
})
