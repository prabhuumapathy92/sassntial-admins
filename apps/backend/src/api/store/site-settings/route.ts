import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { SITE_SETTINGS_MODULE } from "../../../modules/site-settings"
import type SiteSettingsModuleService from "../../../modules/site-settings/service"

/**
 * Everything here ends up in the storefront's public HTML anyway, so the whole
 * record is safe to serve to any caller holding the publishable key.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: SiteSettingsModuleService =
    req.scope.resolve(SITE_SETTINGS_MODULE)
  const site_settings = await service.getSiteSettings()

  res.json({ site_settings })
}
