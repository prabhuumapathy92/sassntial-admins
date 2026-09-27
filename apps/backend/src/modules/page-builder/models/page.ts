import { model } from "@medusajs/framework/utils"

/**
 * A storefront page assembled from blocks.
 *
 * `parent_id` is the content hierarchy rather than the URL: it drives
 * breadcrumbs and, later, where the page sits in the navigation tree, without
 * forcing the slug to mirror the nesting.
 */
export const Page = model.define("cms_page", {
  id: model.id().primaryKey(),
  // Path after the country code, without a leading slash: "services/ai-seo".
  slug: model.text().unique(),
  title: model.text(),
  // Short form used in breadcrumbs when the title is too long to read well as
  // a crumb. Falls back to `title`.
  breadcrumb_label: model.text().nullable(),
  parent_id: model.text().nullable(),
  status: model.enum(["draft", "published"]).default("draft"),
  published_at: model.dateTime().nullable(),
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  og_image: model.text().nullable(),
})
