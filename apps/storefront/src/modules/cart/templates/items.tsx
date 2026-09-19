import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const itemCount = items?.length ?? 0

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[#e8eef7] pb-5 medium:flex-row medium:items-end medium:justify-between">
        <div>         
          <Heading className="font-sans h2-core text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-950">
            Your cart
          </Heading>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Review line items, adjust quantities, and continue to checkout when
            everything looks right.
          </p>
        </div>

        <div className="inline-flex w-fit items-center border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </div>
      </div>

      <div className="mt-1 divide-y divide-[#e8eef7]">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
          : repeat(4).map((i) => {
              return (
                <div
                  key={i}
                  className="grid gap-5 py-6 medium:grid-cols-[108px_minmax(0,1fr)_230px]"
                >
                  <div className="h-[108px] w-[108px] animate-pulse bg-slate-100" />
                  <div className="space-y-3">
                    <div className="h-6 w-2/3 animate-pulse bg-slate-100" />
                    <div className="h-5 w-1/3 animate-pulse bg-slate-100" />
                    <div className="h-4 w-1/2 animate-pulse bg-slate-100" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-11 w-full animate-pulse bg-slate-100" />
                    <div className="h-16 w-full animate-pulse bg-slate-100" />
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default ItemsTemplate
