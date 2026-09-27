import { model } from "@medusajs/framework/utils"

/** Singleton JSON settings for the shared storefront footer. */
export const FooterSettings = model.define("footer_settings", {
  id: model.id().primaryKey(),
  key: model.text().unique(),
  data: model.json(),
})
