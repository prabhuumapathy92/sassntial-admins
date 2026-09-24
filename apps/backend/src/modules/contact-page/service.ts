import { MedusaService } from "@medusajs/framework/utils"

import { ContactPage } from "./models/contact-page"
import { ContactSubmission } from "./models/contact-submission"

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

/**
 * `model.json()` is typed as `Record<string, unknown>`, so the generated create
 * and update signatures reject an array even though jsonb stores one happily.
 * The cast is confined to these two call sites, which keeps `focus_items` a
 * plain `string[]` everywhere else in the codebase.
 */
const toPersistence = (data: ContactPageInput) => data as Record<string, any>

/**
 * The contact page is a singleton. Rather than make every caller worry about
 * whether the row exists yet, `retrieveSettings` creates it on first use and
 * `updateSettings` writes to whichever row it finds.
 */
class ContactPageModuleService extends MedusaService({
  ContactPage,
  ContactSubmission,
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

export type ContactSubmissionRecord = {
  id: string
  full_name: string
  company: string | null
  email: string
  phone_number: string | null
  location: string | null
  message: string
  created_at: string
}

export default ContactPageModuleService
