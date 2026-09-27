import { emitEventStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import type { SiteSettingsData } from "../modules/site-settings/service"
import { updateSiteSettingsStep } from "./steps/update-site-settings"

export const updateSiteSettingsWorkflow = createWorkflow(
  "update-site-settings",
  (input: SiteSettingsData) => {
    const settings = updateSiteSettingsStep(input)

    // Clears the storefront's cached copy so the change is live immediately.
    emitEventStep({ eventName: "cms.site-settings.changed", data: {} })

    return new WorkflowResponse(settings)
  }
)

export default updateSiteSettingsWorkflow
