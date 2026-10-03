import {
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  updateLineItemsStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"

export type MarkCartItemsDigitalInput = {
  cart_id: string
}

/**
 * Marks every item in a cart as not requiring shipping.
 *
 * The store only sells webinar seats and recordings, but Medusa marks a line
 * item as requiring shipping whenever its product has a shipping profile, which
 * is the default for products created in the admin. Completing such a cart
 * fails without a delivery method, so the storefront runs this right before
 * placing the order. Doing it then also covers carts created before checkout
 * dropped its delivery step.
 */
export const markCartItemsDigitalWorkflow = createWorkflow(
  "mark-cart-items-digital",
  (input: MarkCartItemsDigitalInput) => {
    const { data: carts } = useQueryGraphStep({
      entity: "cart",
      fields: ["id", "completed_at", "items.id", "items.requires_shipping"],
      filters: { id: input.cart_id },
      options: { throwIfKeyNotFound: true },
    })

    const items = transform({ carts }, ({ carts }) => {
      const [cart] = carts

      // A completed cart is already an order; leave its record as it was.
      if (cart.completed_at) {
        return []
      }

      return (cart.items ?? [])
        .filter((item) => item?.requires_shipping)
        .map((item) => ({
          selector: { id: item!.id },
          data: { requires_shipping: false },
        }))
    })

    when("has-items-requiring-shipping", { items }, ({ items }) => {
      return items.length > 0
    }).then(() => {
      updateLineItemsStep({ id: input.cart_id, items })
    })

    return new WorkflowResponse(void 0)
  }
)

export default markCartItemsDigitalWorkflow
