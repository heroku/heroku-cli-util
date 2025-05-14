/* eslint-disable unicorn/no-empty-file */
// import {APIClient} from '@heroku-cli/command'
// import {Config} from '@oclif/core'
// import * as chai from 'chai'
// import chaiAsPromised from 'chai-as-promised'
// import * as nock from 'nock'

// import {AmbiguousError} from '../../../../src/types/errors/ambiguous'
// import {NotFound} from '../../../../src/types/errors/not-found'
// import {appAttachment} from '../../../../src/utils/addons/resolve'

// const {expect} = chai

// chai.use(chaiAsPromised)

// describe('appAttachment', function () {
//   let config: Config
//   let heroku: APIClient
//   const HEROKU_API = 'https://api.heroku.com'
//   const sampleAddon = {
//     addon: {
//       config_vars: [],
//       id: 'addon-1',
//       name: 'test-addon',
//       plan: {},
//     },
//     name: 'attachment-1',
//     namespace: null,
//   }

//   beforeEach(async function () {
//     config = await Config.load()
//     heroku = new APIClient(config)
//   })

//   afterEach(function () {
//     nock.cleanAll()
//   })

//   it('returns the resolved addon attachment when one match', async function () {
//     nock(HEROKU_API)
//       .post('/actions/addon-attachments/resolve')
//       .reply(200, [sampleAddon])
//     const result = await appAttachment(heroku, 'my-app', 'attachment-1')
//     expect(result).to.deep.equal(sampleAddon)
//   })

//   it('throws NotFound when no matches', async function () {
//     nock(HEROKU_API)
//       .post('/actions/addon-attachments/resolve')
//       .reply(200, [])
//     await expect(appAttachment(heroku, 'my-app', 'missing')).to.be.rejectedWith(NotFound)
//   })

//   it('throws AmbiguousError when multiple matches and no namespace', async function () {
//     const ambiguous = [
//       {...sampleAddon, namespace: null},
//       {...sampleAddon, name: 'other', namespace: null},
//     ]
//     nock(HEROKU_API)
//       .post('/actions/addon-attachments/resolve')
//       .reply(200, ambiguous)
//     await expect(appAttachment(heroku, 'my-app', 'ambiguous')).to.be.rejectedWith(AmbiguousError)
//   })

//   it('filters by namespace if provided', async function () {
//     const ambiguous = [
//       {...sampleAddon, namespace: 'foo'},
//       {...sampleAddon, namespace: 'bar'},
//     ]
//     nock(HEROKU_API)
//       .post('/actions/addon-attachments/resolve')
//       .reply(200, ambiguous)
//     const result = await appAttachment(heroku, 'my-app', 'attachment-1', {namespace: 'foo'})
//     expect(result.namespace).to.equal('foo')
//   })
// })
