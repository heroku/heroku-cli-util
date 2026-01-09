/**
 * @description Aligns columns in a 2d array of strings. Omits ANSI color code sequences from alignment calculations
 * @param arrays - The 2d array of strings to align
 * @returns The aligned array of strings
 * @example
 *   const data = [
 *     ['Name', 'Age', 'Occupation'],
 *     ['Alice', '30', 'Software Engineer'],
 *     ['Bob', '22', 'Designer'],
 *     ['Carol', '45', 'Doctor'],
 *   ]
 *
 *   alignColumns(data)
 *
 *   // returns
 *
 *   [
 *     'Name  Age Occupation       ',
 *     'Alice 30  Software Engineer',
 *     'Bob   22  Designer         ',
 *     'Carol 45  Doctor           ',
 *   ]
 */
export function alignColumns(arrays: string[][]): string[] {
  // eslint-disable-next-line no-control-regex
  const ansiRegex = /\u001B\[\d+m/g

  const visualLength = (str: string): number => str.replaceAll(ansiRegex, '').length

  if (arrays.length === 0) {
    return []
  }

  // calculate width for each column based on max visual length of entries
  const columnWidths = arrays[0].map((_, colIndex) =>
    Math.max(...arrays.map(row => visualLength(row[colIndex]))),
  )

  // align rows by padding to max length
  const alignedRows = arrays.map(row =>
    row.map((cell, colIndex) => {
      const paddingLength = columnWidths[colIndex] - visualLength(cell)
      return cell + ' '.repeat(paddingLength) // Add necessary padding to each cell
    }).join(' '),
  )

  return alignedRows
}
