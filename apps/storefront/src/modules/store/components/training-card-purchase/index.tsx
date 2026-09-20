"use client"

import { addItemsToCart } from "@lib/data/cart"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { medusaErrorMessage } from "@lib/util/medusa-error"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import {
  addToCartLabel,
  defaultSelection,
  getPurchasableVariants,
  getTotals,
  isPurchasable,
  toggleSelection,
} from "@modules/products/lib/variant-selection"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"

/**
 * Compact multi-select buy block for training catalog cards, so a shopper can
 * pick options and check out without opening the product page. Shares its
 * selection rules with the product page panel via variant-selection.
 */
const TrainingCardPurchase = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const countryCode = useParams().countryCode as string
  const variants = product.variants ?? []
  const buyable = useMemo(() => getPurchasableVariants(product), [product])

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    defaultSelection(product)
  )
  const [isAdding, setIsAdding] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const selectedVariants = useMemo(
    () => variants.filter((variant) => selectedIds.has(variant.id)),
    [variants, selectedIds]
  )

  const totals = useMemo(() => getTotals(selectedVariants), [selectedVariants])

  const handleAddToCart = async () => {
    if (!selectedVariants.length) {
      return
    }

    setIsAdding(true)
    setFeedback(null)

    try {
      await addItemsToCart({
        items: selectedVariants.map((variant) => ({
          variantId: variant.id,
          quantity: 1,
        })),
        countryCode,
      })

      setFeedback(
        selectedVariants.length > 1
          ? `${selectedVariants.length} options added`
          : "Added to your cart"
      )
    } catch (error) {
      console.error("Add to cart failed", error)
      setFeedback(medusaErrorMessage(error))
    } finally {
      setIsAdding(false)
    }
  }

  if (!buyable.length) {
    return (
      <div className="w-full border border-brand-line bg-white/90 px-4 py-3 text-center text-[12px] text-slate-500 medium:w-[248px]">
        Currently unavailable
      </div>
    )
  }

  const showOptions = variants.length > 1
  const total = totals
    ? convertToLocale({
        amount: totals.calculated,
        currency_code: totals.currency,
      })
    : "--"

  return (
    <div className="w-full border border-brand-line bg-white/95 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.05)] medium:w-[248px]">
      {showOptions && (
        <ul className="mb-2 max-h-[132px] space-y-0.5 overflow-y-auto">
          {variants.map((variant) => {
            const prices = getPricesForVariant(variant)
            const available = isPurchasable(variant)
            const isSelected = selectedIds.has(variant.id)

            return (
              <li key={variant.id}>
                <label
                  className={clx(
                    "flex cursor-pointer items-center gap-2 px-2 py-1.5 text-[12px] transition-colors hover:bg-brand-mist",
                    {
                      "bg-brand-mist": isSelected,
                      "cursor-not-allowed opacity-55": !available,
                    }
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    disabled={!available}
                    onChange={() => {
                      setFeedback(null)
                      setSelectedIds((previous) =>
                        toggleSelection(previous, variant.id)
                      )
                    }}
                  />
                  <span
                    className={clx(
                      "flex h-[14px] w-[14px] shrink-0 items-center justify-center border transition-colors",
                      isSelected
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-brand-slate/50 bg-white text-transparent"
                    )}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-[10px] w-[10px]"
                    >
                      <path
                        d="m5 12.5 4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-slate-700">
                    {prices && (
                      <span className="font-semibold text-slate-900">
                        {prices.calculated_price}
                      </span>
                    )}
                    {prices ? " : " : ""}
                    {variant.title}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex items-baseline justify-between gap-2 px-1">
        <span className="text-[10px] font-semibold uppercase text-brand-slate">
          {selectedVariants.length > 1 ? "Total" : "Price"}
        </span>
        <span className="text-[17px] font-bold text-slate-900">
          {total}
        </span>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!selectedVariants.length || isAdding}
        isLoading={isAdding}
        className="mt-2 h-10 w-full bg-brand-cta text-[13px] font-bold text-white shadow-none transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:bg-slate-200 disabled:bg-none disabled:text-slate-400"
        data-testid="card-add-to-cart"
      >
        {addToCartLabel(selectedVariants.length)}
      </Button>

      {feedback && (
        <p
          className="mt-2 text-center text-[11px] leading-4 text-brand-navy"
          role="status"
        >
          {feedback}
        </p>
      )}
    </div>
  )
}

export default TrainingCardPurchase
