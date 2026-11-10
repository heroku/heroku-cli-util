import * as color from './colors.js'

/**
 * @description Renders a section header. Pure: returns the string and writes nothing.
 * The trailing newline is intentional so `this.log(styledHeader(h))` keeps the blank line
 * that has always followed a header.
 * @param header - The header text.
 * @returns The rendered header.
 */
export function styledHeader(header: string): string {
  return color.label('=== ') + color.label(header) + '\n'
}
