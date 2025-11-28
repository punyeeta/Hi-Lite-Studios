/**
 * FAQ Context localStorage Keys
 * Centralized keys to avoid hardcoded strings and ensure consistency
 */
export const FAQ_STORAGE_KEYS = {
  ORDER: 'faq_order',
  FEATURED: 'faq_featured',
} as const

/**
 * Utility function to safely get FAQ order from localStorage
 */
export function getFAQOrder(): string[] {
  try {
    const raw = localStorage.getItem(FAQ_STORAGE_KEYS.ORDER)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch (err) {
    console.error('Failed to parse FAQ order from localStorage:', err)
    return []
  }
}

/**
 * Utility function to safely get featured FAQs from localStorage
 */
export function getFeaturedFAQs(): string[] {
  try {
    const raw = localStorage.getItem(FAQ_STORAGE_KEYS.FEATURED)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch (err) {
    console.error('Failed to parse featured FAQs from localStorage:', err)
    return []
  }
}

/**
 * Utility function to safely save FAQ order to localStorage
 */
export function saveFAQOrder(order: string[]): void {
  try {
    localStorage.setItem(FAQ_STORAGE_KEYS.ORDER, JSON.stringify(order))
  } catch (err) {
    console.error('Failed to save FAQ order to localStorage:', err)
  }
}

/**
 * Utility function to safely save featured FAQs to localStorage
 */
export function saveFeaturedFAQs(featured: string[]): void {
  try {
    localStorage.setItem(FAQ_STORAGE_KEYS.FEATURED, JSON.stringify(featured))
  } catch (err) {
    console.error('Failed to save featured FAQs to localStorage:', err)
  }
}
