import { HttpTypes } from "@medusajs/types"

/**
 * The checkout step a cart should open on: the address form until the cart has
 * an address and email, then payment. Webinars are never shipped, so there is
 * no delivery step.
 */
export const getCheckoutPath = (cart: HttpTypes.StoreCart) => {
  const step =
    !cart?.shipping_address?.address_1 || !cart.email ? "address" : "payment"

  return `/checkout?step=${step}`
}
