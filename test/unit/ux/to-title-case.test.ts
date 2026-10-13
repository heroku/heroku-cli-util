import {describe, expect, it} from 'vitest'

import {toTitleCase} from '../../../src/ux/to-title-case.js'

describe('toTitleCase', function () {
  it('converts lowercase string to title case', function () {
    const result = toTitleCase('hello world')
    expect(result).toBe('Hello World')
  })

  it('converts uppercase string to title case', function () {
    const result = toTitleCase('HELLO WORLD')
    expect(result).toBe('Hello World')
  })

  it('converts mixed case string to title case', function () {
    const result = toTitleCase('hELLo WoRLd')
    expect(result).toBe('Hello World')
  })

  it('handles undefined input correctly', function () {
    const result = toTitleCase()
    expect(result).toBeUndefined()
  })
})
