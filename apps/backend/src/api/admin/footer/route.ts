import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { NAVIGATION_MODULE } from "../../../modules/navigation"
import type NavigationModuleService from "../../../modules/navigation/service"
import { replaceFooterConfigWorkflow } from "../../../workflows/replace-footer-config"
import type { UpdateFooterConfigBody } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: NavigationModuleService = req.scope.resolve(NAVIGATION_MODULE)
  const footer = await service.retrieveFooterConfig()

  res.json({ footer })
}

export async function POST(
  req: MedusaRequest<UpdateFooterConfigBody>,
  res: MedusaResponse,
) {
  const { result } = await replaceFooterConfigWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.json({ footer: result })
}
