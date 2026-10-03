import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { markCartItemsDigitalWorkflow } from "../../../../../workflows/mark-cart-items-digital"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  await markCartItemsDigitalWorkflow(req.scope).run({
    input: { cart_id: req.params.id },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [cart],
  } = await query.graph({
    entity: "cart",
    fields: ["id", "items.id", "items.requires_shipping"],
    filters: { id: req.params.id },
  })

  res.status(200).json({ cart })
}
