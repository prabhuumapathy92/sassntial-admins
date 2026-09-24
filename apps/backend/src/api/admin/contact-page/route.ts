import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { CONTACT_PAGE_MODULE } from "../../../modules/contact-page"
import type ContactPageModuleService from "../../../modules/contact-page/service"
import { updateContactPageWorkflow } from "../../../workflows/update-contact-page"
import type { UpdateContactPageBody } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContactPageModuleService = req.scope.resolve(
    CONTACT_PAGE_MODULE
  )

  const contact_page = await service.retrieveSettings()

  res.json({ contact_page })
}

export async function POST(
  req: MedusaRequest<UpdateContactPageBody>,
  res: MedusaResponse
) {
  const { result } = await updateContactPageWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.json({ contact_page: result })
}
