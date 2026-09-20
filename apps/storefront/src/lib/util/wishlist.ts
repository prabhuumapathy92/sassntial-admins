/**
 * The wishlist is stored per browser: the storefront has no wishlist API yet,
 * so this keeps the controls honest instead of rendering dead buttons. Shared
 * so the catalog cards and the product page read and write the same list.
 */
export const WISHLIST_KEY = "training-storefront:wishlist"

export const readWishlist = (): string[] => {
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY)
    const parsed = raw ? JSON.parse(raw) : []

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Returns the list after the change, so callers can reflect the new state. */
export const toggleWishlistItem = (productId: string): string[] => {
  const current = readWishlist()
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId]

  try {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable (private mode); the UI still reflects intent.
  }

  return next
}
