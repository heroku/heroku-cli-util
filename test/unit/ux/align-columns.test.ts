import {expect} from 'chai'

import {alignColumns} from '../../../src/ux/align-columns.js'

describe('alignColumns', function () {
  it('returns an empty array when the input is an empty array', function () {
    const data: string[][] = []
    const result = alignColumns(data)
    expect(result).to.deep.equal([])
  })

  it('aligns columns correctly without ANSI codes', function () {
    const data = [
      ['Name', 'Age', 'Occupation'],
      ['Alice', '30', 'Software Engineer'],
      ['Bob', '22', 'Designer'],
      ['Carol', '45', 'Doctor'],
    ]

    const expected = [
      'Name  Age Occupation       ',
      'Alice 30  Software Engineer',
      'Bob   22  Designer         ',
      'Carol 45  Doctor           ',
    ]

    const result = alignColumns(data)
    expect(result).to.deep.equal(expected)
  })

  it('aligns columns correctly with ANSI color codes', function () {
    const data = [
      ['\u001B[32mName\u001B[39m', 'Age', '\u001B[32mOccupation\u001B[39m'],
      ['\u001B[31mAlice\u001B[39m', '30', '\u001B[33mSoftware Engineer\u001B[39m'],
      ['Bob', '22', '\u001B[36mDesigner\u001B[39m'],
      ['\u001B[34mCarol\u001B[39m', '45', '\u001B[35mDoctor\u001B[39m'],
    ]

    const expected = [
      '\u001B[32mName\u001B[39m  Age \u001B[32mOccupation\u001B[39m       ',
      '\u001B[31mAlice\u001B[39m 30  \u001B[33mSoftware Engineer\u001B[39m',
      'Bob   22  \u001B[36mDesigner\u001B[39m         ',
      '\u001B[34mCarol\u001B[39m 45  \u001B[35mDoctor\u001B[39m           ',
    ]

    const result = alignColumns(data)
    expect(result).to.deep.equal(expected)
  })

  it('handles special characters in the strings correctly', function () {
    const data = [
      ['Name', 'Age', 'Occupation'],
      ['Alice', '30', 'Doctor (Cardiologist)'],
      ['\u001B[31mBob\u001B[39m', '22', 'Designer'],
      ['Carol', '45', 'Engineer & Developer'],
    ]

    const expected = [
      'Name  Age Occupation           ',
      'Alice 30  Doctor (Cardiologist)',
      '\u001B[31mBob\u001B[39m   22  Designer             ',
      'Carol 45  Engineer & Developer ',
    ]

    const result = alignColumns(data)
    expect(result).to.deep.equal(expected)
  })

  it('aligns columns correctly when some cells are empty', function () {
    const data = [
      ['Name', 'Age', 'Occupation'],
      ['Alice', '30', 'Software Engineer'],
      ['Bob', '22', ''],
      ['Carol', '45', 'Doctor'],
    ]

    const expected = [
      'Name  Age Occupation       ',
      'Alice 30  Software Engineer',
      'Bob   22                   ',
      'Carol 45  Doctor           ',
    ]

    const result = alignColumns(data)
    expect(result).to.deep.equal(expected)
  })
})
