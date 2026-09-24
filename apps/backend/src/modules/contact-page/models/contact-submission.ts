import { model } from "@medusajs/framework/utils"

/**
 * One enquiry sent from the storefront's contact form. Only name, email and
 * message are required — the other fields are optional on the form itself, so
 * forcing them here would reject submissions the page happily accepts.
 */
export const ContactSubmission = model.define("contact_submission", {
  id: model.id().primaryKey(),
  full_name: model.text(),
  company: model.text().nullable(),
  email: model.text(),
  phone_number: model.text().nullable(),
  location: model.text().nullable(),
  message: model.text(),
})
