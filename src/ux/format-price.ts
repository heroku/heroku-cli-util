import printf from 'printf'

/**
 * @description Formats a monthly price (in cents) as a human-readable string, optionally as an hourly rate
 * @param monthlyRate - The monthly price in cents (e.g., 1000 = $10.00/month)
 * @param hourly - If true, formats the price as an hourly rate instead of monthly (default: false)
 * @returns A formatted price string (e.g., '$10.00', '~$0.014', or 'free')
 * @example
 *   formatPrice(1050) // returns '$10.50'
 *   formatPrice(1000, true) // returns '~$0.014'
 *   formatPrice(0) // returns 'free'
 *   formatPrice(10000) // returns '$100'
 */
export function formatPrice(monthlyRate: number, hourly: boolean = false): string {
  if (monthlyRate === 0) return 'free'

  // we are using a standardized 720 hours/month
  if (hourly) {
    const hourlyRate = (monthlyRate / 100) / 720
    if (hourlyRate < 0.001) return '~$0.000'
    return `~$${hourlyRate.toFixed(3)}`
  }

  const fmt = monthlyRate % 100 === 0 ? '$%.0f' : '$%.02f'
  return printf(fmt, monthlyRate / 100)
}
