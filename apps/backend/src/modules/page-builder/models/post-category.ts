import { model } from "@medusajs/framework/utils"

/**
 * A blog category.
 *
 * Its own record rather than a string on the post, so renaming a category
 * updates every post at once and the set stays closed - free text drifts into
 * "AI SEO", "AI Seo" and "ai-seo" within a few posts.
 */
export const PostCategory = model.define("cms_post_category", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  description: model.text().nullable(),
  rank: model.number().default(0),
})
