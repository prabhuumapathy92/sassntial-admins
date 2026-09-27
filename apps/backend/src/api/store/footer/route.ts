import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { NAVIGATION_MODULE } from "../../../modules/navigation"
import type NavigationModuleService from "../../../modules/navigation/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: NavigationModuleService = req.scope.resolve(NAVIGATION_MODULE)
  const footer = await service.retrieveFooterConfig()

  res.json({ footer })
}
