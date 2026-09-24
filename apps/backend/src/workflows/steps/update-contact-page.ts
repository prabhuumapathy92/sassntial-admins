import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { CONTACT_PAGE_MODULE } from "../../modules/contact-page"
import type ContactPageModuleService from "../../modules/contact-page/service"
import type { ContactPageInput } from "../../modules/contact-page/service"

export const updateContactPageStep = createStep(
  "update-contact-page",
  async (input: ContactPageInput, { container }) => {
    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)

    // Kept so the step can put the previous content back if a later step fails.
    const previous = await service.retrieveSettings()
    const updated = await service.updateSettings(input)

    return new StepResponse(updated, previous)
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)

    const { id, ...rest } = previous

    await service.updateSettings(rest)
  }
)

export default updateContactPageStep
