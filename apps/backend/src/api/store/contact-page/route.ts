import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { CONTACT_PAGE_MODULE } from "../../../modules/contact-page"
import type ContactPageModuleService from "../../../modules/contact-page/service"

/** Public read for the storefront's contact page. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContactPageModuleService = req.scope.resolve(
    CONTACT_PAGE_MODULE
  )

  const contact_page = await service.retrieveSettings()

  res.json({ contact_page })
}
