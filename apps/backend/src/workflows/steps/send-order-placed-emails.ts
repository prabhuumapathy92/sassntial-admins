import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import {
  sendNewOrderAdminEmail,
  sendOrderConfirmationEmail,
  type OrderEmailData,
} from "../../lib/order-emails"
import { CONTACT_PAGE_MODULE } from "../../modules/contact-page"
import type ContactPageModuleService from "../../modules/contact-page/service"

export type SendOrderPlacedEmailsInput = {
  order: OrderEmailData
}

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown email error"

/**
 * Emails the shopper a confirmation and the admin recipients an alert, through
 * the SMTP mailbox from Admin > Email settings. The two sends are independent:
 * a bad customer address must not cost the admin their alert, or vice versa.
 *
 * Failures are logged and never thrown. The order is already placed and paid
 * for, and nothing here can be rolled back, so failing the workflow would only
 * hide the result.
 */
export const sendOrderPlacedEmailsStep = createStep(
  "send-order-placed-emails",
  async ({ order }: SendOrderPlacedEmailsInput, { container }) => {
    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const label = order.display_id ? `#${order.display_id}` : order.id

    let settings: Awaited<
      ReturnType<ContactPageModuleService["retrieveSmtpDeliveryConfig"]>
    >

    try {
      settings = await service.retrieveSmtpDeliveryConfig()
    } catch (error) {
      logger.error(
        `Order ${label} was placed, but its emails could not be sent: ${describeError(error)}`
      )
      return new StepResponse({ customer_sent: false, admin_sent: false })
    }

    if (!settings.enabled) {
      logger.warn(
        `Order ${label} was placed, but no emails were sent because notifications are disabled in Admin > Email settings`
      )
      return new StepResponse({ customer_sent: false, admin_sent: false })
    }

    const [customer, admin] = await Promise.allSettled([
      sendOrderConfirmationEmail(settings, order),
      sendNewOrderAdminEmail(settings, order),
    ])

    if (customer.status === "rejected") {
      logger.error(
        `Order ${label}: the confirmation email to the customer failed: ${describeError(customer.reason)}`
      )
    }

    if (admin.status === "rejected") {
      logger.error(
        `Order ${label}: the new order email to the admin failed: ${describeError(admin.reason)}`
      )
    }

    return new StepResponse({
      customer_sent: customer.status === "fulfilled",
      admin_sent: admin.status === "fulfilled",
    })
  }
)

export default sendOrderPlacedEmailsStep
