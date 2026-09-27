import { model } from "@medusajs/framework/utils"

/** A section of a post. Same shape and block types as `cms_page_block`. */
export const PostBlock = model.define("cms_post_block", {
  id: model.id().primaryKey(),
  post_id: model.text(),
  type: model.text(),
  position: model.number().default(0),
  data: model.json().nullable(),
  is_active: model.boolean().default(true),
})
