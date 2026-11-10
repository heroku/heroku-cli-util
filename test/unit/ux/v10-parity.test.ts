import {captureOutput} from '@heroku-cli/test-utils'
import {ux} from '@oclif/core/ux'
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest'

import {styledHeader} from '../../../src/ux/styled-header.js'
import {styledObject} from '../../../src/ux/styled-object.js'
import {table} from '../../../src/ux/table.js'
import {styledHeader as v10StyledHeader} from '../../fixtures/v10/styled-header.js'
import {styledObject as v10StyledObject} from '../../fixtures/v10/styled-object.js'
import {table as v10Table} from '../../fixtures/v10/table.js'
import {expectPure} from '../../helpers/expect-pure.js'

/*
 * Golden tests: logging what a formatter now returns must write exactly the bytes the
 * heroku-cli-util 10.10.2 implementation (verbatim copy in test/fixtures/v10) printed. Default styling
 * is used unless a case says otherwise, so the border/header defaults are covered too.
 */

async function v10Output(fn: () => unknown): Promise<string> {
  const {stdout} = await captureOutput(async () => {
    fn()
  })
  return stdout
}

async function loggedOutput(fn: () => string): Promise<string> {
  const rendered = await expectPure(fn)
  const {stdout} = await captureOutput(async () => {
    ux.stdout(rendered)
  })
  return stdout
}

type Row = Record<string, unknown>

const data: Row[] = [
  {
    age: 30, email: 'alice@example.com', name: 'Alice', note: 'multi\nline',
  },
  {
    age: 25, email: 'bob@example.com', name: 'Bob', note: '100% done, "quoted"',
  },
  {
    age: 35, email: null, name: 'Charlie', note: '\u001B[31mred\u001B[39m',
  },
]

const columns = {
  age: {header: 'Age'},
  email: {extended: true, header: 'Email'},
  name: {header: 'Name'},
  note: {get: (row: Row) => row.note},
}

type TableOptions = Parameters<typeof table<Row>>[2]

const tableCases: Array<[string, Row[], TableOptions]> = [
  ['default styling', data, undefined],
  ['noStyle', data, {noStyle: true}],
  ['title', data, {title: 'Users'}],
  ['extended', data, {extended: true}],
  ['columns', data, {columns: 'Name,Age'}],
  ['filter', data, {filter: 'name=li'}],
  ['sort', data, {sort: 'age'}],
  ['maxWidth', data, {maxWidth: 30}],
  ['empty data', [], undefined],
  ['csv', data, {csv: true}],
  ['csv extended + sort', data, {csv: true, extended: true, sort: 'name'}],
  ['csv empty data', [], {csv: true}],
]

describe('formatters match heroku-cli-util 10.x output byte-for-byte', function () {
  beforeEach(function () {
    vi.stubEnv('OCLIF_TABLE_SKIP_CI_CHECK', '')
  })

  afterEach(function () {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  // Upstream treats CI='' as CI, so forcing ink takes OCLIF_TABLE_SKIP_CI_CHECK.
  describe('table, ink renderer', function () {
    beforeEach(function () {
      vi.stubEnv('OCLIF_TABLE_SKIP_CI_CHECK', 'true')
    })

    it('really uses the ink renderer', function () {
      expect(table(data, columns)).toContain('─')
    })

    it.each(tableCases)('%s', async function (_name, rows, options) {
      const expected = await v10Output(() => v10Table(rows, columns, options))
      expect(expected.length).toBeGreaterThan(0)
      expect(await loggedOutput(() => table(rows, columns, options))).toBe(expected)
    })
  })

  describe('table, plain renderer (CI)', function () {
    beforeEach(function () {
      vi.stubEnv('CI', 'true')
    })

    it('really uses the plain renderer', function () {
      expect(table(data, columns)).not.toContain('─')
    })

    it.each(tableCases)('%s', async function (_name, rows, options) {
      const expected = await v10Output(() => v10Table(rows, columns, options))
      expect(expected.length).toBeGreaterThan(0)
      expect(await loggedOutput(() => table(rows, columns, options))).toBe(expected)
    })
  })

  it('table, plain renderer (at OCLIF_TABLE_LIMIT)', async function () {
    vi.stubEnv('OCLIF_TABLE_SKIP_CI_CHECK', 'true')
    vi.stubEnv('OCLIF_TABLE_LIMIT', '2')
    const expected = await v10Output(() => v10Table(data, columns))
    expect(expected).toContain('Alice')
    expect(expected).not.toContain('─')
    expect(await loggedOutput(() => table(data, columns))).toBe(expected)
  })

  // table() copies printTable's renderer choice; these pin the copy to upstream's behavior.
  const rendererEnvs: Array<[string, Record<string, string | undefined>]> = [
    ['CI unset', {CI: undefined}],
    ["CI=''", {CI: ''}],
    ['CI=false', {CI: 'false'}],
    ['CI=0', {CI: '0'}],
    ['CONTINUOUS_INTEGRATION only', {CI: undefined, CONTINUOUS_INTEGRATION: '1'}],
    ['CI_* variable only', {CI: undefined, CI_PIPELINE_ID: '1'}],
    ['CI=true, skip check', {CI: 'true', OCLIF_TABLE_SKIP_CI_CHECK: 'true'}],
    ['CI=true, skip check false', {CI: 'true', OCLIF_TABLE_SKIP_CI_CHECK: 'false'}],
    ['SF_TABLE_LIMIT', {OCLIF_TABLE_SKIP_CI_CHECK: 'true', SF_TABLE_LIMIT: '2'}],
    ['non-numeric limit', {OCLIF_TABLE_LIMIT: 'abc', OCLIF_TABLE_SKIP_CI_CHECK: 'true'}],
  ]

  it.each(rendererEnvs)('table, renderer choice: %s', async function (_name, vars) {
    for (const [key, value] of Object.entries(vars)) vi.stubEnv(key, value)
    const expected = await v10Output(() => v10Table(data, columns))
    expect(expected).toContain('Alice')
    expect(await loggedOutput(() => table(data, columns))).toBe(expected)
  })

  it('styledHeader', async function () {
    const expected = await v10Output(() => v10StyledHeader('My Header'))
    expect(expected).toContain('My Header')
    expect(await loggedOutput(() => styledHeader('My Header'))).toBe(expected)
  })

  describe('styledObject', function () {
    const obj = {
      // eslint-disable-next-line perfectionist/sort-objects
      name: 'my-app', empty: [], missing: null, owner: {email: 'a@b.c'}, regions: ['us', 'eu'], size: 3,
    }

    it('all keys', async function () {
      const expected = await v10Output(() => v10StyledObject(obj))
      expect(expected).toContain('my-app')
      expect(await loggedOutput(() => styledObject(obj))).toBe(expected)
    })

    it('selected keys in order', async function () {
      const keys = ['size', 'name', 'missing', 'regions']
      const expected = await v10Output(() => v10StyledObject(obj, keys))
      expect(expected).toContain('my-app')
      expect(await loggedOutput(() => styledObject(obj, keys))).toBe(expected)
    })
  })
})

describe('table when the test runner intercepts console', function () {
  afterEach(function () {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  // vitest (by default) and similar runners replace `console` with an object whose log() does
  // not write to process.stdout. The plain renderer prints via console.log, so capture must
  // replace console.log itself rather than relying on it reaching process.stdout.write.
  it('still returns the plain table', async function () {
    vi.stubEnv('OCLIF_TABLE_SKIP_CI_CHECK', '')
    vi.stubEnv('CI', 'true')
    const expected = table(data, columns)
    expect(expected).toMatch(/Alice/)

    const interceptedLog = vi.fn()
    vi.stubGlobal('console', {...console, log: interceptedLog})

    expect(table(data, columns)).toBe(expected)
    expect(interceptedLog).not.toHaveBeenCalled()
    expect(console.log).toBe(interceptedLog)
  })
})
