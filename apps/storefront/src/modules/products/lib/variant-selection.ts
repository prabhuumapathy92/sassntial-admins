import { HttpTypes } from "@medusajs/types"

import { getPricesForVariant } from "@lib/util/get-product-price"

/**
 * Shared multi-select helpers for buying several variants at once.
 *
 * Used by the webinar purchase panel on the product page and by the compact
 * purchase block on training catalog cards, so both agree on what is buyable,
 * what is pre-selected, and how a selection totals up.
 */

export const isPurchasable = (variant: HttpTypes.StoreProductVariant) => {
  if (!variant.manage_inventory || variant.allow_backorder) {
    return true
  }

  return (variant.inventory_quantity ?? 0) > 0
}

export const getPurchasableVariants = (product: HttpTypes.StoreProduct) =>
  (product.variants ?? []).filter(
    (variant) => !!(variant as any).calculated_price && isPurchasable(variant)
  )

/** Cheapest purchasable option, pre-ticked so a price is always shown. */
export const defaultSelection = (product: HttpTypes.StoreProduct) => {
  const priced = getPurchasableVariants(product)

  if (!priced.length) {
    return new Set<string>()
  }

  const cheapest = [...priced].sort(
    (left, right) =>
      (left as any).calculated_price.calculated_amount -
      (right as any).calculated_price.calculated_amount
  )[0]

  return new Set<string>([cheapest.id])
}

export type Totals = {
  calculated: number
  original: number
  savings: number
  percentage: number
  currency: string
} | null

/** Sums every ticked option so the header reflects the whole selection. */
export const getTotals = (
  variants: HttpTypes.StoreProductVariant[]
): Totals => {
  const priced = variants
    .map((variant) => getPricesForVariant(variant))
    .filter(Boolean) as NonNullable<ReturnType<typeof getPricesForVariant>>[]

  if (!priced.length) {
    return null
  }

  const calculated = priced.reduce(
    (sum, price) => sum + price.calculated_price_number,
    0
  )
  const original = priced.reduce(
    (sum, price) => sum + price.original_price_number,
    0
  )
  const savings = original - calculated

  return {
    calculated,
    original,
    savings,
    percentage: original > 0 ? Math.round((savings / original) * 100) : 0,
    currency: priced[0].currency_code,
  }
}

/** Toggles one variant in a selection without mutating the original set. */
export const toggleSelection = (selection: Set<string>, variantId: string) => {
  const next = new Set(selection)

  if (next.has(variantId)) {
    next.delete(variantId)
  } else {
    next.add(variantId)
  }

  return next
}

export const addToCartLabel = (count: number) =>
  !count ? "Select an option" : count > 1 ? `Add ${count} To Cart` : "Add To Cart"
