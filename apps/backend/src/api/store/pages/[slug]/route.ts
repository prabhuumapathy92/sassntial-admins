import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../modules/page-builder/service"
import { isPreviewRequest } from "../../../../lib/preview"

/**
 * Public read for one page and its blocks.
 *
 * Only published pages are served, so an unfinished draft cannot be reached by
 * guessing its slug. Breadcrumbs are derived here rather than in the
 * storefront, so every consumer gets the same trail.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const slug = decodeURIComponent(req.params.slug)
  const preview = isPreviewRequest(req)
  const page = await service.retrievePageBySlug(
    slug,
    preview ? {} : { status: "published" }
  )

  if (!page) {
    res.status(404).json({ message: `Page "${slug}" not found` })
    return
  }

  const breadcrumbs = await service.retrieveBreadcrumbs(page.id)

  res.json({ page, breadcrumbs, preview })
}
