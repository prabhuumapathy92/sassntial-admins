import { model } from "@medusajs/framework/utils"

/**
 * A blog post.
 *
 * Kept as its own model rather than a page with a flag: posts carry
 * chronology, a byline and taxonomy that every page would then have to hold as
 * nullable columns, and they are listed, filtered and syndicated in ways pages
 * never are. The block system is shared - only the surrounding metadata
 * differs.
 */
export const Post = model.define("cms_post", {
  id: model.id().primaryKey(),
  slug: model.text().unique(),
  title: model.text(),
  excerpt: model.text().nullable(),
  cover_image: model.text().nullable(),
  category_id: model.text().nullable(),
  // Free-form list of tag names; a join table only pays off once tags need
  // their own descriptions or archive pages.
  tags: model.json().nullable(),
  author_id: model.text().nullable(),
  status: model.enum(["draft", "published"]).default("draft"),
  published_at: model.dateTime().nullable(),
  // Derived from the block content on save, so it cannot go stale the way a
  // hand-typed "6 min read" does.
  reading_minutes: model.number().default(1),
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
})
