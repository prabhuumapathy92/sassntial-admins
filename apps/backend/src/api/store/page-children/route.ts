import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"

/**
 * Published children of a page, for index listings.
 *
 * Takes the parent's slug rather than its id, so a storefront route can ask for
 * "services" without first looking the page up.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const parentSlug = (req.query.parent as string | undefined)?.trim()

  if (!parentSlug) {
    res.status(400).json({ message: "Missing parent" })
    return
  }

  // Published only: an unpublished index page should 404 like any other,
  // rather than still rendering because its children are live.
  const parent = await service.retrievePageBySlug(parentSlug, {
    status: "published",
  })

  if (!parent) {
    res.status(404).json({ message: `Page "${parentSlug}" not found` })
    return
  }

  const all = await service.listPagesWithBlocks({ status: "published" })
  const pages = all.filter((page) => page.parent_id === parent.id)

  res.json({ pages })
}
