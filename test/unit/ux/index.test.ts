import {describe, expect, it} from 'vitest'

import * as hux from '../../../src/ux/index.js'

describe('ux index exports', function () {
  it('exports ago', function () {
    expect(hux.ago).toBeTypeOf('function')
  })

  it('exports alignColumns', function () {
    expect(hux.alignColumns).toBeTypeOf('function')
  })

  it('exports anykey', function () {
    expect(hux.anykey).toBeTypeOf('function')
  })

  it('exports color', function () {
    expect(hux.color).toBeDefined()
    expect(typeof hux.color).toBe('object')
  })

  it('exports confirmCommand', function () {
    expect(hux.confirmCommand).toBeTypeOf('function')
  })

  it('exports confirm', function () {
    expect(hux.confirm).toBeTypeOf('function')
  })

  it('exports toHumanReadableDataSize', function () {
    expect(hux.toHumanReadableDataSize).toBeTypeOf('function')
  })

  it('exports formatPrice', function () {
    expect(hux.formatPrice).toBeTypeOf('function')
  })

  it('exports openUrl', function () {
    expect(hux.openUrl).toBeTypeOf('function')
  })

  it('exports prompt', function () {
    expect(hux.prompt).toBeTypeOf('function')
  })

  it('exports styledHeader', function () {
    expect(hux.styledHeader).toBeTypeOf('function')
  })

  it('exports styledJSON', function () {
    expect(hux.styledJSON).toBeTypeOf('function')
  })

  it('exports styledObject', function () {
    expect(hux.styledObject).toBeTypeOf('function')
  })

  it('exports table', function () {
    expect(hux.table).toBeTypeOf('function')
  })

  it('exports toTitleCase', function () {
    expect(hux.toTitleCase).toBeTypeOf('function')
  })

  it('exports wait', function () {
    expect(hux.wait).toBeTypeOf('function')
  })
})
