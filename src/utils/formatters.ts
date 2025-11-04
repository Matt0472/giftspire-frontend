/**
 * Format a price value with currency
 * @param price - The price value
 * @param currency - The currency code (default: 'EUR')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency
    }).format(price)
  } catch (error) {
    console.warn('Failed to format price:', error)
    return `€${price.toFixed(2)}`
  }
}

/**
 * Format a rating value to one decimal place
 * @param rating - The rating value
 * @param fallbackText - Optional fallback text when rating is null/undefined
 * @returns Formatted rating string
 */
export function formatRating(rating: number | null | undefined, fallbackText: string = 'N/A'): string {
  if (rating === null || rating === undefined) {
    return fallbackText
  }
  return rating.toFixed(1)
}
