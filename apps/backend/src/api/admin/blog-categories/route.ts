import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"

const service = (req: MedusaRequest): PageBuilderModuleService =>
  req.scope.resolve(PAGE_BUILDER_MODULE)

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ categories: await service(req).listCategories() })
}

export async function POST(req: MedusaRequest<any>, res: MedusaResponse) {
  const category = await service(req).upsertCategory(req.validatedBody)

  res.json({ category })
}
