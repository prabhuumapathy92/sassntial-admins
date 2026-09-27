import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { CONTACT_PAGE_MODULE } from "../../../modules/contact-page"
import type ContactPageModuleService from "../../../modules/contact-page/service"
import { updateEmailSettingsWorkflow } from "../../../workflows/update-email-settings"
import type { UpdateEmailSettingsBody } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContactPageModuleService = req.scope.resolve(
    CONTACT_PAGE_MODULE
  )
  const email_settings = await service.retrieveSmtpSettingsForAdmin()

  res.json({ email_settings })
}

export async function POST(
  req: MedusaRequest<UpdateEmailSettingsBody>,
  res: MedusaResponse
) {
  const { result } = await updateEmailSettingsWorkflow(req.scope).run({
    input: req.validatedBody.email_settings,
  })

  res.json({ email_settings: result })
}
