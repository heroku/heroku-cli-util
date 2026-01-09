/**
 * @description Returns human-readable relative time since the date. This code is inspired by ps.
 * @param since - The date to calculate the time since
 * @returns The human-readable relative time since the date
 * @example
 * const date = new Date()
 * date.setHours(date.getHours() - 1)
 *
 * ago(date)
 *
 * // returns
 *
 * '(~ 1h ago)'
 */
export function ago(since: Date): string {
  const elapsed = Math.floor((Date.now() - since.getTime()) / 1000)
  if (elapsed < 60) return `(~ ${Math.floor(elapsed)}s ago)`
  if (elapsed < 60 * 60) return `(~ ${Math.floor(elapsed / 60)}m ago)`
  if (elapsed < 60 * 60 * 25) return `(~ ${Math.floor(elapsed / 60 / 60)}h ago)`
  return `(~ ${Math.floor(elapsed / 60 / 60 / 24)}d ago)`
}
