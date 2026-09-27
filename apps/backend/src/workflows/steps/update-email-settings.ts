import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { CONTACT_PAGE_MODULE } from "../../modules/contact-page"
import type ContactPageModuleService from "../../modules/contact-page/service"
import type { EmailSettingsInput } from "../../modules/contact-page/service"

export const updateEmailSettingsStep = createStep(
  "update-email-settings",
  async (input: EmailSettingsInput, { container }) => {
    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)
    const settings = await service.saveSmtpSettings(input)

    return new StepResponse(settings)
  }
)

export default updateEmailSettingsStep
