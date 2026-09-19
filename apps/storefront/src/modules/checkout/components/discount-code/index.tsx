"use client"

import { Badge, Heading, Input, Label, Text, clx } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  variant?: "default" | "summary"
}

const DiscountCode: React.FC<DiscountCodeProps> = ({
  cart,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const isSummary = variant === "summary"

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  const renderPromotions = () => {
    if (!promotions.length) {
      return null
    }

    if (isSummary) {
      return (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-tech)] text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                Active promotions
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Discounts already attached to this order.
              </p>
            </div>
            <div className="inline-flex min-h-9 min-w-9 items-center justify-center border border-[#bfdbfe] bg-[#eff6ff] px-2 text-sm font-medium text-[#2c7cf7]">
              {promotions.length}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {promotions.map((promotion) => {
              const value =
                promotion.application_method?.value !== undefined &&
                promotion.application_method.currency_code !== undefined
                  ? promotion.application_method.type === "percentage"
                    ? `${promotion.application_method.value}%`
                    : convertToLocale({
                        amount: +promotion.application_method.value,
                        currency_code:
                          promotion.application_method.currency_code,
                      })
                  : null

              return (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between gap-3 border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                  data-testid="discount-row"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="font-medium text-slate-900"
                        data-testid="discount-code"
                      >
                        {promotion.code}
                      </span>
                      <span className="inline-flex items-center border border-slate-200 bg-white px-2 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-slate-500">
                        {promotion.is_automatic ? "Automatic" : "Code"}
                      </span>
                    </div>
                    {value ? (
                      <p className="mt-1 text-sm text-slate-500">
                        {value} applied to eligible items
                      </p>
                    ) : null}
                  </div>

                  {!promotion.is_automatic ? (
                    <button
                      className="shrink-0 text-sm font-medium text-[#2c7cf7] transition-colors duration-200 hover:text-[#1d4ed8]"
                      onClick={() => {
                        if (!promotion.code) {
                          return
                        }

                        removePromotionCode(promotion.code)
                      }}
                      data-testid="remove-discount-button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div className="w-full flex items-center">
        <div className="flex flex-col w-full">
          <Heading className="txt-medium mb-2">Promotion(s) applied:</Heading>

          {promotions.map((promotion) => {
            return (
              <div
                key={promotion.id}
                className="flex items-center justify-between w-full max-w-full mb-2"
                data-testid="discount-row"
              >
                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                  <span className="truncate" data-testid="discount-code">
                    <Badge
                      color={promotion.is_automatic ? "green" : "grey"}
                      size="small"
                    >
                      {promotion.code}
                    </Badge>{" "}
                    (
                    {promotion.application_method?.value !== undefined &&
                      promotion.application_method.currency_code !==
                        undefined && (
                        <>
                          {promotion.application_method.type === "percentage"
                            ? `${promotion.application_method.value}%`
                            : convertToLocale({
                                amount: +promotion.application_method.value,
                                currency_code:
                                  promotion.application_method.currency_code,
                              })}
                        </>
                      )}
                    )
                  </span>
                </Text>
                {!promotion.is_automatic && (
                  <button
                    className="flex items-center"
                    onClick={() => {
                      if (!promotion.code) {
                        return
                      }

                      removePromotionCode(promotion.code)
                    }}
                    data-testid="remove-discount-button"
                  >
                    <Trash size={14} />
                    <span className="sr-only">
                      Remove discount code from order
                    </span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div
      className={clx(
        "w-full flex flex-col",
        isSummary
          ? "border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-4 shadow-[0_14px_35px_rgba(15,23,42,0.04)]"
          : "bg-white"
      )}
    >
      <div className={clx("txt-medium", isSummary && "space-y-3")}>
        <form
          action={(a) => addPromotionCode(a)}
          className={clx("w-full", !isSummary && "mb-5")}
        >
          {isSummary ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">                 

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">
                        Promotion code
                      </p>
                      {promotions.length ? (
                        <span className="inline-flex items-center border border-slate-200 bg-white px-2 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-slate-500">
                          {promotions.length} active
                        </span>
                      ) : null}
                    </div>
                   
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex min-h-10 shrink-0 items-center border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition-colors duration-200 hover:border-[#bfdbfe] hover:bg-[#f8fbff] hover:text-[#2c7cf7]"
                  data-testid="add-discount-button"
                >
                  {isOpen ? "Close" : promotions.length ? "Manage" : "Add code"}
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex w-full gap-x-2">
                    <Input
                      className="size-full bg-white"
                      id="promotion-input"
                      name="code"
                      type="text"
                      autoFocus={false}
                      placeholder="Enter promotion code"
                      data-testid="discount-input"
                    />
                    <SubmitButton
                      variant="secondary"
                      className="h-10 border border-slate-200 bg-slate-950 px-4 text-white hover:bg-slate-900"
                      data-testid="discount-apply-button"
                    >
                      Apply
                    </SubmitButton>
                  </div>

                  <ErrorMessage
                    error={errorMessage}
                    data-testid="discount-error-message"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <Label className="flex gap-x-1 my-2 items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                  data-testid="add-discount-button"
                >
                  Add Promotion Code(s)
                </button>
              </Label>

              {isOpen && (
                <>
                  <div className="flex w-full gap-x-2">
                    <Input
                      className="size-full"
                      id="promotion-input"
                      name="code"
                      type="text"
                      autoFocus={false}
                      data-testid="discount-input"
                    />
                    <SubmitButton
                      variant="secondary"
                      data-testid="discount-apply-button"
                    >
                      Apply
                    </SubmitButton>
                  </div>

                  <ErrorMessage
                    error={errorMessage}
                    data-testid="discount-error-message"
                  />
                </>
              )}
            </>
          )}
        </form>

        {renderPromotions()}
      </div>
    </div>
  )
}

export default DiscountCode
