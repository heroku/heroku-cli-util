import {describe, expect, it} from 'vitest'

import parseKeyValue from '../../../src/utils/parse-key-value.js'

describe('parseKeyValue', () => {
  it('should parse basic key=value input', () => {
    const result = parseKeyValue('name=John')
    expect(result).toEqual({key: 'name', value: 'John'})
  })

  it('should handle empty value', () => {
    const result = parseKeyValue('name=')
    expect(result).toEqual({key: 'name', value: ''})
  })

  it('should handle missing equals sign', () => {
    const result = parseKeyValue('name')
    expect(result).toEqual({key: 'name', value: ''})
  })

  it('should split only on first equals sign', () => {
    const result = parseKeyValue('url=https://example.com?a=1&b=2')
    expect(result).toEqual({key: 'url', value: 'https://example.com?a=1&b=2'})
  })

  it('should handle special characters in value', () => {
    const result = parseKeyValue('description=Hello,"World"!')
    expect(result).toEqual({key: 'description', value: 'Hello,"World"!'})
  })

  it('should handle empty string input', () => {
    const result = parseKeyValue('')
    expect(result).toEqual({key: '', value: ''})
  })
})
