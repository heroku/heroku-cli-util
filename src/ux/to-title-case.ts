/**
 * @description Converts a string to title case by capitalizing the first letter of each word
 * @param str - The string to convert to title case, can be undefined
 * @returns The title-cased string, or undefined if input is undefined
 * @example
 *   toTitleCase('hello world') // returns 'Hello World'
 *   toTitleCase('HELLO WORLD') // returns 'Hello World'
 *   toTitleCase('hELLo WoRLd') // returns 'Hello World'
 *   toTitleCase(undefined) // returns undefined
 */
export function toTitleCase(str?: string): string | undefined {
  if (!str) {
    return str
  }

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
