import { model } from "@medusajs/framework/utils"

/**
 * One entry in the storefront's navigation, stored as a self-referencing tree
 * so the same table covers all three levels the header renders:
 *
 *   depth 0  top-level item        "Training"          href, no icon
 *   depth 1  mega-menu group       "Featured Programs" icon, no href
 *   depth 1  simple dropdown link  "Contact Us"        href, no icon
 *   depth 2  link inside a group   "AI Bots Automation"
 *
 * The rendered shape falls out of the tree rather than being configured: a top
 * item whose children carry no href is a mega menu, and one whose children do
 * is a plain dropdown. That keeps editors from having to pick a layout that
 * contradicts the links they entered.
 */
export const NavItem = model.define("nav_item", {
  id: model.id().primaryKey(),
  // Which menu this tree belongs to: "primary", "secondary" or "cta". Only set
  // meaningfully on roots; descendants inherit it from their parent.
  menu: model.text(),
  parent_id: model.text().nullable(),
  label: model.text(),
  // Null for mega-menu groups, which are headings rather than destinations.
  href: model.text().nullable(),
  // One of the storefront's MegaMenuIcon names; only groups use it.
  icon: model.text().nullable(),
  // Optional image collage shown beside a mega menu, as { eyebrow, title,
  // subtitle, images: [{ src, alt, className }] }.
  media: model.json().nullable(),
  // Ordering among siblings. Gaps are fine, so a reorder only rewrites the
  // items that actually moved.
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
})
