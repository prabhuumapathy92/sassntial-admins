import { model } from "@medusajs/framework/utils"

/**
 * One section of a page.
 *
 * `type` selects which storefront component renders it and which schema
 * validates `data`, so adding a block type means adding a schema and a
 * renderer, never a migration. Keeping the payload in one jsonb column is what
 * lets the editing surface change later - a form editor today, a drag-and-drop
 * canvas tomorrow - without touching the stored shape.
 */
export const PageBlock = model.define("cms_page_block", {
  id: model.id().primaryKey(),
  page_id: model.text(),
  type: model.text(),
  // Ordering within the page. Gaps are fine, so reordering only rewrites the
  // blocks that actually moved.
  position: model.number().default(0),
  data: model.json().nullable(),
  is_active: model.boolean().default(true),
})
