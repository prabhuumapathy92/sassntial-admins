"use client"

import { addToCart } from "@lib/data/cart"
import { medusaErrorMessage } from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  groupWebinarVariants,
  getVariantInfo,
} from "@modules/products/lib/webinar-content"
import {
  REFUND_POLICY_URL,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
} from "@modules/products/lib/support-contact"
import {
  InfoIcon,
  MailIcon,
  PhoneIcon,
  ShareIcon,
  ShieldIcon,
} from "@modules/products/components/webinar-icons"
import { useParams } from "next/navigation"
import React, { useMemo, useState } from "react"

type WebinarPurchasePanelProps = {
  product: HttpTypes.StoreProduct
  disabled?: boolean
}

const isPurchasable = (variant: HttpTypes.StoreProductVariant) => {
  if (!variant.manage_inventory || variant.allow_backorder) {
    return true
  }

  return (variant.inventory_quantity ?? 0) > 0
}

/** Cheapest priced variant, so the headline price matches the pre-selected row. */
const defaultVariantId = (product: HttpTypes.StoreProduct) => {
  const priced = (product.variants ?? []).filter(
    (variant) => !!(variant as any).calculated_price
  )

  if (!priced.length) {
    return product.variants?.[0]?.id
  }

  return [...priced].sort(
    (left, right) =>
      (left as any).calculated_price.calculated_amount -
      (right as any).calculated_price.calculated_amount
  )[0].id
}

type Prices = ReturnType<typeof getPricesForVariant>

const PriceSummary = ({
  prices,
  onAddToCart,
  disabled,
  isAdding,
  label,
}: {
  prices: Prices
  onAddToCart: () => void
  disabled: boolean
  isAdding: boolean
  label: string
}) => {
  const savings = prices
    ? prices.original_price_number - prices.calculated_price_number
    : 0

  const savingsLabel = prices
    ? convertToLocale({
        amount: savings,
        currency_code: prices.currency_code,
      })
    : null

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0 text-[13px] leading-5">
        {savings > 0 && (
          <p className="text-slate-500">
            Was:{" "}
            <span className="font-semibold text-brand-ember line-through">
              {prices!.original_price}
            </span>
          </p>
        )}
        <p className="text-slate-500">
          Now:{" "}
          <span
            className="text-[19px] font-bold text-slate-900"
            data-testid="webinar-price"
          >
            {prices?.calculated_price ?? "--"}
          </span>
        </p>
        {savings > 0 && (
          <p className="text-[12px] text-slate-500">
            You Save:{" "}
            <span className="font-semibold text-brand-ember">
              {savingsLabel} ({prices!.percentage_diff}%)
            </span>
          </p>
        )}
      </div>

      <Button
        onClick={onAddToCart}
        disabled={disabled}
        isLoading={isAdding}
        className="h-10 shrink-0 rounded-full bg-gradient-to-r from-brand-gold to-brand-ember px-5 text-[13px] font-bold text-white shadow-none transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:bg-slate-200 disabled:bg-none disabled:text-slate-400"
        data-testid="add-product-button"
      >
        {label}
      </Button>
    </div>
  )
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="border-y border-brand-line bg-brand-mist px-4 py-2 text-center text-[13px] font-semibold text-brand-navy">
    {children}
  </h3>
)

export default function WebinarPurchasePanel({
  product,
  disabled,
}: WebinarPurchasePanelProps) {
  const countryCode = useParams().countryCode as string
  const groups = useMemo(() => groupWebinarVariants(product), [product])

  const [selectedId, setSelectedId] = useState<string | undefined>(() =>
    defaultVariantId(product)
  )
  const [isAdding, setIsAdding] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [shareNote, setShareNote] = useState<string | null>(null)

  const selectedVariant = useMemo(
    () => product.variants?.find((variant) => variant.id === selectedId),
    [product.variants, selectedId]
  )

  const prices = useMemo(
    () => (selectedVariant ? getPricesForVariant(selectedVariant) : null),
    [selectedVariant]
  )

  const inStock = selectedVariant ? isPurchasable(selectedVariant) : false

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      return
    }

    setIsAdding(true)
    setFeedback(null)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      setFeedback("Added to your cart")
    } catch (error) {
      // Without this the rejected server action escapes as an unhandled error
      // and the shopper only sees Next's dev overlay.
      console.error("Add to cart failed", error)
      setFeedback(medusaErrorMessage(error))
    } finally {
      setIsAdding(false)
    }
  }

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""

    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url })
        return
      }

      await navigator.clipboard.writeText(url)
      setShareNote("Link copied")
    } catch {
      setShareNote("Could not share this page")
    }

    setTimeout(() => setShareNote(null), 2500)
  }

  const buttonLabel = !selectedVariant
    ? "Select option"
    : !inStock
      ? "Unavailable"
      : "Add To Cart"

  const summaryProps = {
    prices,
    onAddToCart: handleAddToCart,
    disabled: !selectedVariant || !inStock || !!disabled || isAdding,
    isAdding,
    label: buttonLabel,
  }

  return (
    <div className="flex flex-col gap-4" id="webinar-options">
      <div className="overflow-hidden rounded-[4px] border border-brand-line bg-white">
        <PriceSummary {...summaryProps} />

        {groups.map((group) => (
          <div key={group.key}>
            <SectionHeading>{group.title}</SectionHeading>
            <ul className="divide-y divide-brand-line/60">
              {group.variants.map((variant) => {
                const variantPrices = getPricesForVariant(variant)
                const info = getVariantInfo(variant)
                const isSelected = variant.id === selectedId
                const available = isPurchasable(variant)

                return (
                  <li key={variant.id}>
                    <label
                      className={clx(
                        "flex cursor-pointer items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-brand-mist",
                        {
                          "bg-brand-mist": isSelected,
                          "cursor-not-allowed opacity-55": !available,
                        }
                      )}
                    >
                      <input
                        type="radio"
                        name="webinar-option"
                        className="sr-only"
                        checked={isSelected}
                        disabled={!available}
                        onChange={() => setSelectedId(variant.id)}
                      />
                      <span
                        className={clx(
                          "flex h-[15px] w-[15px] shrink-0 items-center justify-center border transition-colors",
                          isSelected
                            ? "border-brand-navy bg-brand-navy"
                            : "border-brand-slate/50 bg-white"
                        )}
                        aria-hidden
                      >
                        {isSelected && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-[11px] w-[11px]"
                          >
                            <path
                              d="m5 12.5 4.5 4.5L19 7.5"
                              stroke="#ffffff"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-slate-700">
                        {variantPrices && (
                          <span className="font-medium text-slate-900">
                            {variantPrices.calculated_price}
                          </span>
                        )}
                        {variantPrices ? " : " : ""}
                        {variant.title}
                        {!available && (
                          <span className="ml-1 text-[11px] text-slate-500">
                            (sold out)
                          </span>
                        )}
                      </span>

                      {info && (
                        <span
                          className="shrink-0 text-brand-slate"
                          title={info}
                          aria-label={info}
                        >
                          <InfoIcon className="h-[15px] w-[15px]" />
                        </span>
                      )}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {groups.length > 0 && (
          <div className="border-t border-brand-line">
            <PriceSummary {...summaryProps} />
          </div>
        )}

        {feedback && (
          <p
            className="border-t border-brand-line bg-brand-mist px-4 py-2 text-center text-[12px] leading-5 text-brand-navy"
            role="status"
          >
            {feedback}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-[4px] border border-brand-line bg-white px-4 py-3">
        <ShieldIcon className="h-9 w-9 shrink-0 text-brand-gold" />
        <div className="text-[12px] leading-5">
          <p className="font-semibold uppercase tracking-wide text-brand-navy">
            100% Money Back Guaranteed
          </p>
          <LocalizedClientLink
            href={REFUND_POLICY_URL}
            className="text-brand-slate underline underline-offset-2 hover:text-brand-navy"
          >
            Refund / Cancellation policy
          </LocalizedClientLink>
        </div>
      </div>

      <div className="rounded-[4px] border border-brand-amber/50 bg-brand-amber/12 px-4 py-3 text-center text-[12px] leading-6 text-slate-700">
        <p>For group or any booking support, contact:</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-1 flex items-center justify-center gap-1.5 text-brand-navy hover:underline"
        >
          <MailIcon className="h-3.5 w-3.5" />
          {SUPPORT_EMAIL}
        </a>
        <a
          href={SUPPORT_PHONE_HREF}
          className="mt-0.5 flex items-center justify-center gap-1.5 text-brand-navy hover:underline"
        >
          <PhoneIcon className="h-3.5 w-3.5" />
          {SUPPORT_PHONE}
        </a>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-slate px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-brand-navy"
        >
          <ShareIcon className="h-3.5 w-3.5" />
          Share
        </button>
        {shareNote && (
          <span className="text-[12px] text-slate-500" role="status">
            {shareNote}
          </span>
        )}
      </div>
    </div>
  )
}
