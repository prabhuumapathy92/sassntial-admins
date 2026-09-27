import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { NAVIGATION_MODULE } from "../../../modules/navigation"
import type NavigationModuleService from "../../../modules/navigation/service"
import { replaceNavigationMenuWorkflow } from "../../../workflows/replace-navigation-menu"
import type { UpdateNavigationBody } from "./validators"

/** Includes hidden items, so the editor can see and re-enable them. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: NavigationModuleService = req.scope.resolve(NAVIGATION_MODULE)

  const navigation = await service.retrieveTree({ includeInactive: true })

  res.json({ navigation })
}

export async function POST(
  req: MedusaRequest<UpdateNavigationBody>,
  res: MedusaResponse
) {
  const { result } = await replaceNavigationMenuWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.json({ navigation: result })
}
