/**
 * Shared form validation utilities
 */

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const sanitizeHtml = (html: string): string => {
  return html.trim()
}

export const extractPlainText = (html: string): string => {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const generateExcerpt = (html: string, maxLength: number = 220): string => {
  const plainText = extractPlainText(html)
  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength).trimEnd()}...`
    : plainText
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateImageUrl = (url: string): boolean => {
  if (!validateUrl(url)) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext))
}
