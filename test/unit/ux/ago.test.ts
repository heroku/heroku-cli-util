import {expect} from 'chai'

import {ago} from '../../../src/ux/ago.js'

describe('ago', function () {
  let originalDateNow: typeof Date.now

  beforeEach(function () {
    // Mock Date.now to return a fixed timestamp
    originalDateNow = Date.now
    Date.now = () => new Date('2024-01-01T12:00:00Z').getTime()
  })

  afterEach(function () {
    // Restore original Date.now
    Date.now = originalDateNow
  })

  it('returns seconds ago for recent time', function () {
    const pastTime = new Date('2024-01-01T11:59:30Z') // 30 seconds ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 30s ago)')
  })

  it('returns seconds ago for very recent time', function () {
    const pastTime = new Date('2024-01-01T11:59:59Z') // 1 second ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 1s ago)')
  })

  it('returns minutes ago for time within an hour', function () {
    const pastTime = new Date('2024-01-01T11:30:00Z') // 30 minutes ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 30m ago)')
  })

  it('returns minutes ago for time just under an hour', function () {
    const pastTime = new Date('2024-01-01T11:01:00Z') // 59 minutes ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 59m ago)')
  })

  it('returns hours ago for time within a day', function () {
    const pastTime = new Date('2024-01-01T09:00:00Z') // 3 hours ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 3h ago)')
  })

  it('returns hours ago for time just under 25 hours', function () {
    const pastTime = new Date('2023-12-31T11:30:00Z') // 24.5 hours ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 24h ago)')
  })

  it('returns days ago for time over 25 hours', function () {
    const pastTime = new Date('2023-12-31T10:59:59Z') // 1 day ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 1d ago)')
  })

  it('returns days ago for time multiple days ago', function () {
    const pastTime = new Date('2023-12-25T12:00:00Z') // 7 days ago
    const result = ago(pastTime)
    expect(result).to.equal('(~ 7d ago)')
  })
})
