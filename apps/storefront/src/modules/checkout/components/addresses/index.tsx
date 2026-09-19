"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <section className="overflow-hidden border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)] small:px-7">
      <div className="mb-8 flex flex-row items-center justify-between gap-4">
        <Heading
          level="h2"
          className="h1-core font-sans h2-core text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-950"
        >
          Shipping Address
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-sm font-medium text-[#2c7cf7] transition-colors duration-200 hover:text-[#1d4ed8]"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="space-y-6">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="border-t border-slate-200 pt-6 font-sans text-[1.2rem] font-semibold text-slate-950"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton
              className="mt-2 h-12 bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-900"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </SubmitButton>
            <ErrorMessage
              error={message}
              data-testid="address-error-message"
            />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="grid gap-4 medium:grid-cols-3">
                <div
                  className="border border-slate-200 bg-slate-50/70 px-4 py-4"
                  data-testid="shipping-address-summary"
                >
                  <Text className="h1-core font-sans h2-core text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-950">
                    Shipping Address
                  </Text>
                  <Text className="text-sm leading-7 text-slate-700">
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </Text>
                  <Text className="text-sm leading-7 text-slate-700">
                    {cart.shipping_address.address_1}{" "}
                    {cart.shipping_address.address_2}
                  </Text>
                  <Text className="text-sm leading-7 text-slate-700">
                    {cart.shipping_address.postal_code},{" "}
                    {cart.shipping_address.city}
                  </Text>
                  <Text className="text-sm leading-7 text-slate-700">
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </Text>
                </div>

                <div
                  className="border border-slate-200 bg-slate-50/70 px-4 py-4"
                  data-testid="shipping-contact-summary"
                >
                  <Text className="mb-2 font-[family-name:var(--font-tech)] text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                    Contact
                  </Text>
                  <Text className="text-sm leading-7 text-slate-700">
                    {cart.shipping_address.phone}
                  </Text>
                  <Text className="text-sm leading-7 text-slate-700">
                    {cart.email}
                  </Text>
                </div>

                <div
                  className="border border-slate-200 bg-slate-50/70 px-4 py-4"
                  data-testid="billing-address-summary"
                >
                  <Text className="mb-2 font-[family-name:var(--font-tech)] text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
                    Billing Address
                  </Text>

                  {sameAsBilling ? (
                    <Text className="text-sm leading-7 text-slate-700">
                      Billing and delivery address are the same.
                    </Text>
                  ) : (
                    <>
                      <Text className="text-sm leading-7 text-slate-700">
                        {cart.billing_address?.first_name}{" "}
                        {cart.billing_address?.last_name}
                      </Text>
                      <Text className="text-sm leading-7 text-slate-700">
                        {cart.billing_address?.address_1}{" "}
                        {cart.billing_address?.address_2}
                      </Text>
                      <Text className="text-sm leading-7 text-slate-700">
                        {cart.billing_address?.postal_code},{" "}
                        {cart.billing_address?.city}
                      </Text>
                      <Text className="text-sm leading-7 text-slate-700">
                        {cart.billing_address?.country_code?.toUpperCase()}
                      </Text>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-20 items-center">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Addresses
