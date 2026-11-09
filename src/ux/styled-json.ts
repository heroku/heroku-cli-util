import {ux} from '@oclif/core/ux'

/**
 * @description Renders a value as colorized, pretty-printed JSON. Pure: returns the string and writes nothing.
 * @param obj - The value to render.
 * @returns The rendered JSON.
 */
export function styledJSON(obj: unknown): string {
  return ux.colorizeJson(obj)
}
