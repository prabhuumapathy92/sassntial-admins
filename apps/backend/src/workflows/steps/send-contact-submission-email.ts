import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { sendContactSubmissionNotification } from "../../lib/email"
import { CONTACT_PAGE_MODULE } from "../../modules/contact-page"
import type ContactPageModuleService from "../../modules/contact-page/service"
import type { ContactSubmissionRecord } from "../../modules/contact-page/service"

export const sendContactSubmissionEmailStep = createStep(
  "send-contact-submission-email",
  async (submission: ContactSubmissionRecord, { container }) => {
    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    try {
      const settings = await service.retrieveSmtpDeliveryConfig()

      if (!settings.enabled) {
        // Without this line a disabled toggle is indistinguishable from a
        // delivery that silently vanished.
        logger.warn(
          `Contact submission ${submission.id} was saved, but no email was sent because notifications are disabled in Admin > Email settings`
        )
        return new StepResponse(false)
      }

      await sendContactSubmissionNotification(settings, submission)
      return new StepResponse(true)
    } catch (error) {
      logger.error(
        `Contact submission ${submission.id} was saved, but its email notification failed: ${error instanceof Error ? error.message : "Unknown email error"}`
      )

      // The database submission remains the source of truth if SMTP is down.
      return new StepResponse(false)
    }
  }
)

export default sendContactSubmissionEmailStep
