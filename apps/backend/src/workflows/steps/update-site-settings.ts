import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { SITE_SETTINGS_MODULE } from "../../modules/site-settings"
import type SiteSettingsModuleService from "../../modules/site-settings/service"
import type { SiteSettingsData } from "../../modules/site-settings/service"

export const updateSiteSettingsStep = createStep(
  "update-site-settings",
  async (input: SiteSettingsData, { container }) => {
    const service: SiteSettingsModuleService =
      container.resolve(SITE_SETTINGS_MODULE)
    const previous = await service.getSiteSettings()
    const settings = await service.saveSiteSettings(input)

    return new StepResponse(settings, previous)
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service: SiteSettingsModuleService =
      container.resolve(SITE_SETTINGS_MODULE)

    await service.saveSiteSettings(previous)
  }
)

export default updateSiteSettingsStep
