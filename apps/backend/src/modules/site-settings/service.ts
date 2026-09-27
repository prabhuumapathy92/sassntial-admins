import { MedusaService } from "@medusajs/framework/utils"

import { SiteSettings } from "./models/site-settings"

export type SiteSettingsData = {
  google_analytics_id: string
  google_tag_manager_id: string
  meta_pixel_id: string
  microsoft_clarity_id: string
  google_site_verification: string
  bing_site_verification: string
  head_code: string
  body_code: string
}

const FIELDS = [
  "google_analytics_id",
  "google_tag_manager_id",
  "meta_pixel_id",
  "microsoft_clarity_id",
  "google_site_verification",
  "bing_site_verification",
  "head_code",
  "body_code",
] as const satisfies ReadonlyArray<keyof SiteSettingsData>

/** Empty strings everywhere, so callers never branch on null vs "". */
const normalize = (record?: Record<string, any> | null): SiteSettingsData =>
  Object.fromEntries(
    FIELDS.map((field) => [field, record?.[field] ?? ""])
  ) as SiteSettingsData

/** Blank fields are stored as null rather than as empty strings. */
const toPersistence = (data: SiteSettingsData) =>
  Object.fromEntries(
    FIELDS.map((field) => [field, data[field]?.trim() ? data[field] : null])
  )

/**
 * The settings are a singleton. Reads never create the row - a store that has
 * not saved anything yet simply gets empty settings - and the first save
 * creates it.
 */
class SiteSettingsModuleService extends MedusaService({
  SiteSettings,
}) {
  async getSiteSettings(): Promise<SiteSettingsData> {
    const [existing] = await this.listSiteSettings({}, { take: 1 })

    return normalize(existing)
  }

  async saveSiteSettings(data: SiteSettingsData): Promise<SiteSettingsData> {
    const [existing] = await this.listSiteSettings({}, { take: 1 })
    const payload = toPersistence(data)

    if (existing) {
      const [updated] = await this.updateSiteSettings([
        { id: existing.id, ...payload },
      ])

      return normalize(updated)
    }

    const [created] = await this.createSiteSettings([payload])

    return normalize(created)
  }
}

export default SiteSettingsModuleService
