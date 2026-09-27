import { model } from "@medusajs/framework/utils"

/**
 * A byline.
 *
 * Kept separate so a role or avatar is corrected once rather than on every
 * post the person has written.
 */
export const Author = model.define("cms_author", {
  id: model.id().primaryKey(),
  name: model.text(),
  role: model.text().nullable(),
  avatar: model.text().nullable(),
  bio: model.text().nullable(),
})
