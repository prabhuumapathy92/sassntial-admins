import { convertToLocale } from "@lib/util/money"
import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const itemCount = cart?.items?.length ?? 0
  const itemSubtotal = cart?.item_subtotal ?? 0
  const shippingSubtotal = cart?.shipping_subtotal ?? 0
  const discountSubtotal = cart?.discount_subtotal ?? 0
  const taxTotal = cart?.tax_total ?? 0
  const total = cart?.total ?? 0

  return (
    <div className="sticky top-8 flex flex-col gap-y-8">
      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <Heading
              level="h2"
              className="font-sans text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-950"
            >
              In your Cart
            </Heading>
            <div className="inline-flex shrink-0 items-center border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review totals before payment confirmation.
          </p>
        </div>

        <div className="px-5 py-5">
          <div className="border border-slate-200 bg-slate-50/70 px-4 py-4">
            <div className="flex flex-col gap-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Subtotal (excl. shipping and taxes)</span>
                <span data-testid="cart-subtotal" data-value={itemSubtotal}>
                  {convertToLocale({
                    amount: itemSubtotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Shipping</span>
                <span data-testid="cart-shipping" data-value={shippingSubtotal}>
                  {convertToLocale({
                    amount: shippingSubtotal,
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
                <span data-testid="cart-taxes" data-value={taxTotal}>
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
                className="text-[1.75rem] font-semibold leading-none text-slate-950"
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

          <div className="mt-5 border border-slate-200 bg-white px-4 py-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-[family-name:var(--font-tech)] text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                Items
              </p>
              <p className="text-sm text-slate-500">
                {itemCount} {itemCount === 1 ? "product" : "products"}
              </p>
            </div>
            <ItemsPreviewTemplate cart={cart} />
          </div>

          <div className="mt-5">
            <DiscountCode cart={cart} variant="summary" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
