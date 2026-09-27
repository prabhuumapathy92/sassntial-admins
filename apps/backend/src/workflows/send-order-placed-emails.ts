import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

import type { OrderEmailData } from "../lib/order-emails"
import { sendOrderPlacedEmailsStep } from "./steps/send-order-placed-emails"

export type SendOrderPlacedEmailsWorkflowInput = {
  id: string
}

export const sendOrderPlacedEmailsWorkflow = createWorkflow(
  "send-order-placed-emails",
  (input: SendOrderPlacedEmailsWorkflowInput) => {
    // Selecting any top-level total makes the order module calculate every
    // total, including each item's, so the emails match the storefront.
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "shipping_total",
        "tax_total",
        "discount_total",
        "items.*",
        "shipping_address.*",
        "shipping_methods.name",
      ],
      filters: { id: input.id },
      options: { throwIfKeyNotFound: true },
    })

    const order = transform(
      { orders },
      ({ orders }) => orders[0] as unknown as OrderEmailData
    )

    const result = sendOrderPlacedEmailsStep({ order })

    return new WorkflowResponse(result)
  }
)

export default sendOrderPlacedEmailsWorkflow
