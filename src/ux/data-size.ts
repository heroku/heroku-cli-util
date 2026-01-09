/**
 * @description Converts a data size in gigabytes to a human-readable format with appropriate units
 * @param gigabytes - The data size in gigabytes (GB) to convert
 * @returns A formatted string with the size and appropriate unit (MB, GB, or TB)
 * @example
 *   toHumanReadableDataSize(0.5) // returns '500.00 MB'
 *   toHumanReadableDataSize(1.5) // returns '1.50 GB'
 *   toHumanReadableDataSize(1000) // returns '1.00 TB'
 *   toHumanReadableDataSize(2000) // returns '2.00 TB'
 */
export function toHumanReadableDataSize(gigabytes: number) {
  if (gigabytes < 1) {
    return `${(gigabytes * 1000).toFixed(2)} MB`
  }

  if (gigabytes <= 999.994) {
    return `${gigabytes.toFixed(2)} GB`
  }

  return `${(gigabytes / 1000).toFixed(2)} TB`
}
