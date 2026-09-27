import { model } from "@medusajs/framework/utils"

/**
 * Singleton holding the storefront's analytics tags, search engine
 * verification codes, and any custom tracking code the admin pastes in.
 */
export const SiteSettings = model.define("site_settings", {
  id: model.id().primaryKey(),
  google_analytics_id: model.text().nullable(),
  google_tag_manager_id: model.text().nullable(),
  meta_pixel_id: model.text().nullable(),
  microsoft_clarity_id: model.text().nullable(),
  google_site_verification: model.text().nullable(),
  bing_site_verification: model.text().nullable(),
  head_code: model.text().nullable(),
  body_code: model.text().nullable(),
})
