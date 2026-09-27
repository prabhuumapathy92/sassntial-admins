import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { sendEmailSettingsTest } from "../../lib/email"
import { CONTACT_PAGE_MODULE } from "../../modules/contact-page"
import type ContactPageModuleService from "../../modules/contact-page/service"

export const sendEmailSettingsTestStep = createStep(
  "send-email-settings-test",
  async (_input: Record<string, never>, { container }) => {
    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)
    const settings = await service.retrieveSmtpDeliveryConfig()
    const result = await sendEmailSettingsTest(settings)

    return new StepResponse({ message_id: result.messageId })
  }
)

export default sendEmailSettingsTestStep
