import { model } from "@medusajs/framework/utils"

/**
 * The editable content of the storefront's contact page. There is one row: the
 * service treats the first record as the live settings and creates it on the
 * first read, so the admin screen always has something to edit.
 */
export const ContactPage = model.define("contact_page", {
  id: model.id().primaryKey(),
  intro: model.text().nullable(),
  general_inquiries_email: model.text().nullable(),
  support_line: model.text().nullable(),
  availability: model.text().nullable(),
  // A list of short strings, rendered as the "Focus" cards.
  focus_items: model.json().nullable(),
  form_eyebrow: model.text().nullable(),
  form_heading: model.text().nullable(),
  form_description: model.text().nullable(),
})
