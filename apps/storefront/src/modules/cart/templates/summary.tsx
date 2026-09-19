"use client"

import { convertToLocale } from "@lib/util/money"
import { Button, Heading } from "@medusajs/ui"

import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const itemCount = cart.items?.length ?? 0
  const itemSubtotal = cart.item_subtotal ?? 0
  const shippingSubtotal = cart.shipping_subtotal ?? 0
  const taxTotal = cart.tax_total ?? 0
  const discountSubtotal = cart.discount_total ?? 0
  const total = cart.total ?? 0

  return (
    <div className="overflow-hidden border border-slate-200/80 bg-white">
      <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 py-6 small:px-6">
        <div className="flex items-center justify-between gap-4">
          <Heading className="font-sans h2-core text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-950">
            Booking summary
          </Heading>

          <div className="inline-flex shrink-0 items-center border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            {itemCount} {itemCount === 1 ? "line item" : "line items"}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 small:px-6">
        <div>
          <DiscountCode cart={cart} variant="summary" />
        </div>

        <div className="mt-5 border border-slate-200/80 bg-white px-4 py-4">
          <div className="flex flex-col gap-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <span>Subtotal (exclude of taxes)</span>
              <span
                className="text-slate-900"
                data-testid="cart-subtotal"
                data-value={itemSubtotal}
              >
                {convertToLocale({
                  amount: itemSubtotal,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>

           

            {!!discountSubtotal && (
              <div className="flex items-center justify-between gap-4">
                <span>Discount</span>
                <span
                  className="text-[#2c7cf7]"
                  data-testid="cart-discount"
                  data-value={discountSubtotal}
                >
                  -
                  {convertToLocale({
                    amount: discountSubtotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span>Taxes</span>
              <span
                className="text-slate-900"
                data-testid="cart-taxes"
                data-value={taxTotal}
              >
                {convertToLocale({
                  amount: taxTotal,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
          </div>

          <div className="my-4 h-px w-full bg-slate-200" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-medium text-slate-900">Total</span>
            <span
              className="text-[2rem] font-semibold leading-none text-slate-950"
              data-testid="cart-total"
              data-value={total}
            >
              {convertToLocale({
                amount: total,
                currency_code: cart.currency_code,
              })}
            </span>
          </div>
        </div>

        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="mt-5 h-12 w-full bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_58%,#38bdf8_190%)] text-sm font-medium text-white">
            Go to checkout
          </Button>
        </LocalizedClientLink>

        <p className="mt-3 text-center font-[family-name:var(--font-tech)] text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
          Secure checkout
        </p>
      </div>
    </div>
  )
}

export default Summary
