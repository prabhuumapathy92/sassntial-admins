"use client"

import { Table, Text } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (type === "preview") {
    return (
      <Table.Row className="w-full" data-testid="product-row">
        <Table.Cell className="!pl-0 p-4 w-24">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex w-16"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        <Table.Cell className="text-left">
          <Text
            className="txt-medium-plus text-ui-fg-base"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </Table.Cell>

        <Table.Cell className="!pr-0">
          <span className="flex h-full flex-col items-end justify-center !pr-0">
            <span className="flex gap-x-1">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
        </Table.Cell>
      </Table.Row>
    )
  }

 return (
    <article
      className="grid gap-5 py-6 medium:grid-cols-[108px_minmax(0,1fr)] medium:items-start"
      data-testid="product-row"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="flex h-[108px] w-[108px] items-center justify-center overflow-hidden border border-[#dbe3ef] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] p-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
      >
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
        />
      </LocalizedClientLink>

      <div className="min-w-0 grid gap-4 medium:grid-cols-[minmax(0,1fr)_auto] medium:gap-x-8">
        <div className="min-w-0">
          <Text
            className="text-[1.08rem] font-semibold leading-7 text-slate-950"
            title={item.product_title}
            data-testid="product-title"
          >
            {item.product_title}
          </Text>

          <div className="mt-3 text-sm leading-7 text-slate-600">
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
          </div>

          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="mt-2 inline-flex text-sm font-medium text-[#2c7cf7] transition-colors duration-200 hover:text-[#1d4ed8]"
          >
            View product
          </LocalizedClientLink>

          <div className="mt-4 grid gap-3 small:grid-cols-2 medium:hidden">
            <div className="border border-[#e8eef7] bg-[#f8fafc] px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#64748b]">
                Price
              </p>
              <div className="mt-2 text-slate-950">
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </div>

            <div className="border border-[#e8eef7] bg-[#f8fafc] px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#64748b]">
                Total
              </p>
              <div className="mt-2 text-slate-950">
                <LineItemPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </div>
          </div>

          <div className="hidden medium:flex medium:flex-wrap medium:items-center medium:gap-6 medium:pt-2">
            <div className="inline-flex items-stretch">
              <span className="inline-flex items-center border border-[#e8eef7] bg-[#f8fafc] px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#64748b]">
                Price
              </span>
              <div className="inline-flex items-center border border-l-0 border-[#e8eef7] bg-white px-4 py-2 text-slate-950">
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </div>

            <div className="inline-flex items-stretch">
              <span className="inline-flex items-center border border-[#e8eef7] bg-[#f8fafc] px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#64748b]">
                Total
              </span>
              <div className="inline-flex items-center border border-l-0 border-[#e8eef7] bg-white px-4 py-2 text-slate-950">
                <LineItemPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-[#e8eef7] pt-4 medium:border-0 medium:pt-0 medium:self-start">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#64748b] medium:hidden">
              Quantity
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 medium:mt-0 medium:justify-end">
              <CartItemSelect
                value={item.quantity}
                onChange={(value) => changeQuantity(parseInt(value.target.value))}
                className="h-11 min-w-[92px]"
                data-testid="product-select-button"
              >
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  )
                )}

                <option value={1} key={1}>
                  1
                </option>
              </CartItemSelect>

              <DeleteButton
                id={item.id}
                className="shrink-0"
                buttonClassName="h-11 border border-[#d7dce5] bg-white px-3 text-sm font-medium text-[#64748b] transition-colors duration-200 hover:border-[#2c7cf7] hover:text-[#2c7cf7]"
                data-testid="product-delete-button"
              >
                Remove
              </DeleteButton>

              {updating && <Spinner size="18" className="text-[#2c7cf7]" />}
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        </div>
      </div>
    </article>
  ) 
}

export default Item
