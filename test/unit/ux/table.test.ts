import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {describe, expect, it} from 'vitest'

import {table} from '../../../src/ux/table.js'

const removeAllWhitespace = (str: string): string => ansis.strip(str).replaceAll(/\s+/g, '')

describe('table', function () {
  it('should print the correct table output', async function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    const {stdout} = await captureOutput(() => table(data, columns, {noStyle: true}))

    const strippedOutput = removeAllWhitespace(stdout)
    expect(strippedOutput).toContain(removeAllWhitespace('Baz   Foo'))
    expect(strippedOutput).toContain(removeAllWhitespace('42    bar'))
    expect(strippedOutput).toContain(removeAllWhitespace('7     qux'))
  })

  it('should respect sort options', async function () {
    const data = [
      {age: 30, name: 'Alice'},
      {age: 25, name: 'Bob'},
      {age: 35, name: 'Charlie'},
    ]
    const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
    const {stdout} = await captureOutput(() =>
      table(data, columns, {
        noStyle: true,
        sort: 'age',
      }))

    const strippedOutput = removeAllWhitespace(stdout)
    // Should be sorted by age in ascending order
    expect(strippedOutput).toContain(removeAllWhitespace('Age   Name'))
    expect(strippedOutput).toContain(removeAllWhitespace('25    Bob'))
    expect(strippedOutput).toContain(removeAllWhitespace('30    Alice'))
    expect(strippedOutput).toContain(removeAllWhitespace('35    Charlie'))
  })

  describe('--columns flag', function () {
    it('should match by header name', async function () {
      const data = [
        {age: 30, city: 'NYC', name: 'Alice'},
        {age: 25, city: 'LA', name: 'Bob'},
      ]
      const columns = {age: {header: 'Age'}, city: {header: 'City'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'Name,City',
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain(removeAllWhitespace('Name   City'))
      expect(strippedOutput).toContain(removeAllWhitespace('Alice  NYC'))
      expect(strippedOutput).toContain(removeAllWhitespace('Bob    LA'))
      expect(strippedOutput).not.toContain('Age')
    })

    it('should match by property key', async function () {
      const data = [
        {age: 30, name: 'Alice'},
        {age: 25, name: 'Bob'},
      ]
      const columns = {age: {header: 'Age'}, name: {}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'name',
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain('name')
      expect(strippedOutput).toContain('Alice')
      expect(strippedOutput).toContain('Bob')
      expect(strippedOutput).not.toContain('Age')
    })

    it('should preserve order of specified columns', async function () {
      const data = [
        {age: 30, city: 'NYC', name: 'Alice'},
      ]
      const columns = {age: {header: 'Age'}, city: {header: 'City'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'City,Name,Age',
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      const cityIndex = strippedOutput.indexOf('City')
      const nameIndex = strippedOutput.indexOf('Name')
      const ageIndex = strippedOutput.indexOf('Age')

      expect(cityIndex).toBeLessThan(nameIndex)
      expect(nameIndex).toBeLessThan(ageIndex)
    })

    it('should deduplicate repeated columns', async function () {
      const data = [
        {age: 30, name: 'Alice'},
      ]
      const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'Name,Name,Age',
        }))

      const nameOccurrences = (stdout.match(/Name/g) || []).length

      expect(nameOccurrences).toBe(1)
    })

    it('should error for unknown columns', async function () {
      const data = [
        {age: 30, name: 'Alice'},
      ]
      const columns = {age: {header: 'Age'}, name: {header: 'Name'}}

      expect(() =>
        table(data, columns, {
          columns: 'Name,Invalid',
        })).toThrow(/Columns flag has an invalid value/)
    })
  })

  describe('--csv flag', function () {
    it('should output CSV with headers', async function () {
      const data = [
        {age: 30, name: 'Alice'},
        {age: 25, name: 'Bob'},
      ]
      const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          csv: true,
        }))

      expect(stdout.trim()).toBe('Age,Name\n30,Alice\n25,Bob')
    })

    it('should escape CSV when values contain commas', async function () {
      const data = [
        {name: 'Alice, Jr.', role: 'Developer'},
        {name: 'Bob', role: 'Manager, Lead'},
      ]
      const columns = {name: {header: 'Name'}, role: {header: 'Role'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          csv: true,
        }))

      const lines = stdout.trim().split('\n')
      expect(lines[0]).toBe('Name,Role')
      expect(lines[1]).toBe('"Alice, Jr.",Developer')
      expect(lines[2]).toBe('Bob,"Manager, Lead"')
    })

    it('should escape CSV when values contain quotes', async function () {
      const data = [
        {message: 'She said "hello"', status: 'sent'},
        {message: 'Normal text', status: 'read'},
      ]
      const columns = {message: {header: 'Message'}, status: {header: 'Status'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          csv: true,
        }))

      const lines = stdout.trim().split('\n')
      expect(lines[0]).toBe('Message,Status')
      expect(lines[1]).toBe('"She said ""hello""",sent')
      expect(lines[2]).toBe('Normal text,read')
    })

    it('should escape CSV when values contain newlines', async function () {
      const data = [
        {message: 'Line 1\nLine 2', status: 'sent'},
        {message: 'Normal', status: 'read'},
      ]
      const columns = {message: {header: 'Message'}, status: {header: 'Status'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          csv: true,
        }))

      expect(stdout.trim()).toBe('Message,Status\n"Line 1\nLine 2",sent\nNormal,read')
    })
  })

  describe('--filter flag', function () {
    it('should filter by substring match', async function () {
      const data = [
        {age: 30, name: 'Alice'},
        {age: 25, name: 'Bob'},
        {age: 35, name: 'Charlie'},
      ]
      const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          filter: 'name=li',
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain('Alice')
      expect(strippedOutput).toContain('Charlie')
      expect(strippedOutput).not.toContain('Bob')
    })

    it('should filter by exact match', async function () {
      const data = [
        {age: 30, name: 'Alice'},
        {age: 25, name: 'Bob'},
        {age: 35, name: 'Charlie'},
      ]
      const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          filter: 'name=Alice',
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain('Alice')
      expect(strippedOutput).not.toContain('Charlie')
      expect(strippedOutput).not.toContain('Bob')
    })

    it('should error for invalid format missing equals', async function () {
      const data = [
        {name: 'Alice'},
      ]
      const columns = {name: {header: 'Name'}}

      expect(() =>
        table(data, columns, {
          filter: 'nameAlice',
        })).toThrow(/Filter flag has an invalid value/)
    })

    it('should error for invalid format missing value', async function () {
      const data = [
        {name: 'Alice'},
      ]
      const columns = {name: {header: 'Name'}}

      expect(() =>
        table(data, columns, {
          filter: 'name=',
        })).toThrow(/Filter flag has an invalid value/)
    })

    it('should error for unknown column', async function () {
      const data = [
        {name: 'Alice'},
      ]
      const columns = {name: {header: 'Name'}}

      expect(() =>
        table(data, columns, {
          filter: 'invalid=test',
        })).toThrow(/Filter flag has an invalid value/)
    })
  })

  describe('--sort flag', function () {
    it('should sort by single column ascending', async function () {
      const data = [
        {age: 30, name: 'Alice'},
        {age: 25, name: 'Bob'},
        {age: 35, name: 'Charlie'},
      ]
      const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          sort: 'age',
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      const bobIndex = strippedOutput.indexOf('Bob')
      const aliceIndex = strippedOutput.indexOf('Alice')
      const charlieIndex = strippedOutput.indexOf('Charlie')

      expect(bobIndex).toBeLessThan(aliceIndex)
      expect(aliceIndex).toBeLessThan(charlieIndex)
    })

    it('should sort by multi-column ascending', async function () {
      const data = [
        {age: 30, city: 'NYC', name: 'Alice'},
        {age: 25, city: 'NYC', name: 'Diana'},
        {age: 25, city: 'LA', name: 'Bob'},
        {age: 30, city: 'LA', name: 'Charlie'},
      ]
      const columns = {age: {header: 'Age'}, city: {header: 'City'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          sort: 'age,city',
        }))

      const stripped = removeAllWhitespace(stdout)
      const bobIndex = stripped.indexOf('Bob')     // age 25, city LA
      const dianaIndex = stripped.indexOf('Diana')  // age 25, city NYC
      const charlieIndex = stripped.indexOf('Charlie') // age 30, city LA
      const aliceIndex = stripped.indexOf('Alice')  // age 30, city NYC

      // Within age 25: LA before NYC
      expect(bobIndex).toBeLessThan(dianaIndex)
      // Within age 30: LA before NYC
      expect(charlieIndex).toBeLessThan(aliceIndex)
      // Age 25 before age 30
      expect(bobIndex).toBeLessThan(charlieIndex)
    })

    it('should error for unknown column', async function () {
      const data = [
        {name: 'Alice'},
      ]
      const columns = {name: {header: 'Name'}}

      expect(() =>
        table(data, columns, {
          sort: 'invalid',
        })).toThrow(/Sort flag has an invalid value/)
    })
  })

  describe('--extended flag', function () {
    it('should hide extended columns by default', async function () {
      const data = [
        {age: 30, name: 'Alice', secret: 'password123'},
      ]
      const columns = {
        age: {header: 'Age'},
        name: {header: 'Name'},
        secret: {extended: true, header: 'Secret'},
      }
      const {stdout} = await captureOutput(() =>
        table(data, columns, {}))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain('Name')
      expect(strippedOutput).toContain('Age')
      expect(strippedOutput).not.toContain('Secret')
      expect(strippedOutput).not.toContain('password123')
    })

    it('should show extended columns when flag is set', async function () {
      const data = [
        {age: 30, name: 'Alice', secret: 'password123'},
      ]
      const columns = {
        age: {header: 'Age'},
        name: {header: 'Name'},
        secret: {extended: true, header: 'Secret'},
      }
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          extended: true,
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain('Name')
      expect(strippedOutput).toContain('Age')
      expect(strippedOutput).toContain('Secret')
      expect(strippedOutput).toContain('password123')
    })

    it('should let --columns override --extended', async function () {
      const data = [
        {age: 30, name: 'Alice', secret: 'password123'},
      ]
      const columns = {
        age: {header: 'Age'},
        name: {header: 'Name'},
        secret: {extended: true, header: 'Secret'},
      }
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'Name',
          extended: true,
        }))

      const strippedOutput = removeAllWhitespace(stdout)
      expect(strippedOutput).toContain('Name')
      expect(strippedOutput).not.toContain('Age')
      expect(strippedOutput).not.toContain('Secret')
    })
  })

  describe('combined flags', function () {
    it('should support filter + sort + columns', async function () {
      const data = [
        {age: 35, city: 'NYC', name: 'Charlie'},
        {age: 30, city: 'NYC', name: 'Alice'},
        {age: 25, city: 'LA', name: 'Bob'},
        {age: 28, city: 'LA', name: 'Diana'},
      ]
      const columns = {age: {header: 'Age'}, city: {header: 'City'}, name: {header: 'Name'}}
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'Name,Age',
          filter: 'name=li',
          sort: 'age',
        }))

      const strippedOutput = removeAllWhitespace(stdout)

      // Columns flag
      expect(strippedOutput).toContain(removeAllWhitespace('Name   Age'))
      expect(strippedOutput).not.toContain('City')

      // Filter flag
      expect(strippedOutput).toContain('Alice')
      expect(strippedOutput).toContain('Charlie')
      expect(strippedOutput).not.toContain('Bob')
      expect(strippedOutput).not.toContain('Diana')

      // Sort flag
      const aliceIndex = strippedOutput.indexOf('Alice')
      const charlieIndex = strippedOutput.indexOf('Charlie')
      expect(aliceIndex).toBeLessThan(charlieIndex)
    })

    it('should support filter + sort + columns + csv', async function () {
      const data = [
        {
          age: 35, city: 'NYC', name: 'Charlie', role: 'Developer',
        },
        {
          age: 30, city: 'NYC', name: 'Alice', role: 'Developer',
        },
        {
          age: 25, city: 'LA', name: 'Bob', role: 'Manager',
        },
        {
          age: 28, city: 'LA', name: 'Diana', role: 'Designer',
        },
      ]
      const columns = {
        age: {header: 'Age'}, city: {header: 'City'}, name: {header: 'Name'}, role: {header: 'Role'},
      }
      const {stdout} = await captureOutput(() =>
        table(data, columns, {
          columns: 'Age,City,Name',
          csv: true,
          filter: 'city=NYC',
          sort: 'age',
        }))

      const lines = stdout.trim().split('\n')
      expect(lines[0]).toBe('Age,City,Name')
      expect(lines[1]).toBe('30,NYC,Alice')
      expect(lines[2]).toBe('35,NYC,Charlie')
      expect(lines.length).toBe(3)
    })
  })
})
