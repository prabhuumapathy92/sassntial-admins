import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

import { sendOrderPlacedEmailsWorkflow } from "../workflows/send-order-placed-emails"

/**
 * Medusa emits `order.placed` once checkout completes, which is only after the
 * payment provider has accepted the payment. Running here rather than in the
 * checkout request keeps SMTP latency out of the shopper's order confirmation.
 */
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await sendOrderPlacedEmailsWorkflow(container).run({
    input: { id: data.id },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
