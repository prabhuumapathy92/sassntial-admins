import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"

/** Public category list, for the blog's filter bar and archive pages. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  res.json({ categories: await service.listCategories() })
}
