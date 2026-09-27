import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { SITE_SETTINGS_MODULE } from "../../../modules/site-settings"
import type SiteSettingsModuleService from "../../../modules/site-settings/service"
import { updateSiteSettingsWorkflow } from "../../../workflows/update-site-settings"
import type { UpdateSiteSettingsBody } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: SiteSettingsModuleService =
    req.scope.resolve(SITE_SETTINGS_MODULE)
  const site_settings = await service.getSiteSettings()

  res.json({ site_settings })
}

export async function POST(
  req: MedusaRequest<UpdateSiteSettingsBody>,
  res: MedusaResponse
) {
  const { result } = await updateSiteSettingsWorkflow(req.scope).run({
    input: req.validatedBody.site_settings,
  })

  res.json({ site_settings: result })
}
