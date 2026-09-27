import { model } from "@medusajs/framework/utils"

/** Singleton SMTP configuration used for contact form notifications. */
export const EmailSettings = model.define("contact_email_settings", {
  id: model.id().primaryKey(),
  enabled: model.boolean().default(false),
  smtp_host: model.text().nullable(),
  smtp_port: model.number().default(587),
  smtp_secure: model.boolean().default(false),
  smtp_require_tls: model.boolean().default(true),
  smtp_username: model.text().nullable(),
  smtp_password_encrypted: model.text().nullable(),
  from_name: model.text().nullable(),
  from_email: model.text().nullable(),
  to_emails: model.json().nullable(),
  reply_to_submitter: model.boolean().default(true),
  subject_prefix: model.text().nullable(),
})
