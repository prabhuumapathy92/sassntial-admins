import { MedusaService } from "@medusajs/framework/utils"

import { ContactPage } from "./models/contact-page"
import { ContactSubmission } from "./models/contact-submission"
import { EmailSettings as EmailSettingsModel } from "./models/email-settings"
import { decryptEmailPassword, encryptEmailPassword } from "./email-credentials"

export type ContactPageSettings = {
  id: string
  intro: string | null
  general_inquiries_email: string | null
  support_line: string | null
  availability: string | null
  focus_items: string[]
  form_eyebrow: string | null
  form_heading: string | null
  form_description: string | null
}

export type ContactPageInput = Partial<Omit<ContactPageSettings, "id">>

export type EmailSettings = {
  id: string
  enabled: boolean
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  smtp_require_tls: boolean
  smtp_username: string
  smtp_password_configured: boolean
  from_name: string
  from_email: string
  to_emails: string[]
  reply_to_submitter: boolean
  subject_prefix: string
}

export type EmailSettingsInput = Omit<EmailSettings, "id" | "smtp_password_configured"> & {
  smtp_password?: string
  clear_smtp_password?: boolean
}

export type EmailDeliverySettings = Omit<EmailSettings, "id" | "smtp_password_configured"> & {
  smtp_password: string
}

/**
 * `model.json()` is typed as `Record<string, unknown>`, so the generated create
 * and update signatures reject an array even though jsonb stores one happily.
 * The cast is confined to these two call sites, which keeps `focus_items` a
 * plain `string[]` everywhere else in the codebase.
 */
const toPersistence = (data: ContactPageInput) => data as Record<string, any>
const toEmailPersistence = (data: Record<string, unknown>) =>
  data as Record<string, any>

/**
 * The contact page is a singleton. Rather than make every caller worry about
 * whether the row exists yet, `retrieveSettings` creates it on first use and
 * `updateSettings` writes to whichever row it finds.
 */
class ContactPageModuleService extends MedusaService({
  ContactPage,
  ContactSubmission,
  EmailSettings: EmailSettingsModel,
}) {
  async retrieveSettings(): Promise<ContactPageSettings> {
    const [existing] = await this.listContactPages({}, { take: 1 })

    const record = existing ?? (await this.createContactPages(
      toPersistence({ focus_items: [] })
    ))

    return normalize(record)
  }

  async updateSettings(data: ContactPageInput): Promise<ContactPageSettings> {
    const current = await this.retrieveSettings()

    const [updated] = await this.updateContactPages([
      { id: current.id, ...toPersistence(data) },
    ])

    return normalize(updated)
  }

  async retrieveSmtpSettingsForAdmin(): Promise<EmailSettings> {
    const [existing] = await this.listEmailSettings({}, { take: 1 })
    const record = existing ?? (await this.createEmailSettings({}))

    return normalizeEmailSettings(record)
  }

  async retrieveSmtpDeliveryConfig(): Promise<EmailDeliverySettings> {
    const [record] = await this.listEmailSettings({}, { take: 1 })
    const stored = record ?? (await this.createEmailSettings({}))
    const settings = normalizeEmailSettings(stored)

    return {
      ...settings,
      smtp_password: decryptEmailPassword(stored.smtp_password_encrypted ?? null),
    }
  }

  async saveSmtpSettings(input: EmailSettingsInput): Promise<EmailSettings> {
    const currentRecord = (await this.listEmailSettings({}, { take: 1 }))[0]
    const current = currentRecord ?? (await this.createEmailSettings({}))
    const {
      smtp_password,
      clear_smtp_password,
      ...settings
    } = input
    const update = {
      ...settings,
      smtp_password_encrypted: clear_smtp_password
        ? null
        : smtp_password
          ? encryptEmailPassword(smtp_password)
          : current.smtp_password_encrypted ?? null,
    }

    const [updated] = await this.updateEmailSettings([
      { id: current.id, ...toEmailPersistence(update) },
    ])

    return normalizeEmailSettings(updated)
  }
}

const normalize = (record: any): ContactPageSettings => ({
  id: record.id,
  intro: record.intro ?? null,
  general_inquiries_email: record.general_inquiries_email ?? null,
  support_line: record.support_line ?? null,
  availability: record.availability ?? null,
  focus_items: Array.isArray(record.focus_items)
    ? record.focus_items.filter(
        (item: unknown): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    : [],
  form_eyebrow: record.form_eyebrow ?? null,
  form_heading: record.form_heading ?? null,
  form_description: record.form_description ?? null,
})

const normalizeEmailSettings = (record: any): EmailSettings => ({
  id: record.id,
  enabled: Boolean(record.enabled),
  smtp_host: record.smtp_host ?? "",
  smtp_port: Number(record.smtp_port ?? 587),
  smtp_secure: Boolean(record.smtp_secure),
  smtp_require_tls: Boolean(record.smtp_require_tls),
  smtp_username: record.smtp_username ?? "",
  smtp_password_configured: Boolean(record.smtp_password_encrypted),
  from_name: record.from_name ?? "",
  from_email: record.from_email ?? "",
  to_emails: Array.isArray(record.to_emails)
    ? record.to_emails.filter((item: unknown): item is string => typeof item === "string")
    : [],
  reply_to_submitter: record.reply_to_submitter !== false,
  subject_prefix: record.subject_prefix ?? "",
})

export type ContactSubmissionRecord = {
  id: string
  full_name: string
  company: string | null
  website: string | null
  email: string
  phone_number: string | null
  location: string | null
  enquiry_type: string | null
  message: string
  created_at: string | Date
}

export default ContactPageModuleService
